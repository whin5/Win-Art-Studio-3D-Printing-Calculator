// Show/hide inputs based on project type
document.getElementById('projectType').addEventListener('change', e => {
  const type = e.target.value;
  document.getElementById('resinInputs').style.display = (type==='resin')?'block':'none';
  document.getElementById('filamentInputs').style.display = (type==='filament')?'block':'none';
});

// Logo preview
document.getElementById('logoInput').addEventListener('change', e => {
  const file = e.target.files[0];
  if(file) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = document.getElementById('logoPreview');
      img.src = reader.result;
      img.style.display = 'inline-block';
    }
    reader.readAsDataURL(file);
  }
});

// Project History
let history = JSON.parse(localStorage.getItem('projects')) || [];
let lastProject = null;

function updateHistoryTable() {
  const tbody = document.querySelector('#historyTable tbody');
  tbody.innerHTML = '';
  let totalIncome = 0;
  history.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p.name}</td><td>${p.type}</td><td>${p.totalCost}</td><td>${p.totalIncome}</td>`;
    tbody.appendChild(tr);
    totalIncome += Number(p.totalIncome);
  });
  document.getElementById('totalIncome').textContent = totalIncome.toFixed(2);
}
updateHistoryTable();

// Calculate button
document.getElementById('calc').addEventListener('click', () => {
  const type = document.getElementById('projectType').value;
  const name = document.getElementById('name').value;
  const currency = document.getElementById('currency').value || '';
  const time = Number(document.getElementById('time').value);
  const watts = Number(document.getElementById('watts').value);
  const kwh = Number(document.getElementById('kwh').value);
  const labor = Number(document.getElementById('laborRate').value);
  const machine = Number(document.getElementById('machine').value);
  const markup = Number(document.getElementById('markup').value);

  let materialCost = 0;

  if(type==='resin'){
    const bottlePrice = Number(document.getElementById('r-bottlePrice').value);
    const bottleVol = Number(document.getElementById('r-bottleVolume').value);
    const used = Number(document.getElementById('r-ml').value);
    materialCost = bottlePrice * used / bottleVol;
  } else {
    const price = Number(document.getElementById('f-price').value);
    const used = Number(document.getElementById('f-used').value);
    materialCost = price * used / 1000;
  }

  const electricity = (watts/1000)*time*kwh;
  const laborCost = labor + machine + electricity;
  const totalCost = materialCost + laborCost;
  const totalIncome = totalCost*(1+markup/100);

  document.getElementById('results').innerHTML = `
    Total Cost: ${currency} ${totalCost.toFixed(2)}<br>
    Total Income: ${currency} ${totalIncome.toFixed(2)}
  `;

  lastProject = {name,type,currency,totalCost:totalCost.toFixed(2),totalIncome:totalIncome.toFixed(2)};
  history.push(lastProject);
  localStorage.setItem('projects', JSON.stringify(history));
  updateHistoryTable();
});

// Export History to CSV
document.getElementById('exportHistory').addEventListener('click', () => {
  let csv = 'Project Name,Type,Total Cost,Total Income\n';
  history.forEach(p => {
    csv += `${p.name},${p.type},${p.totalCost},${p.totalIncome}\n`;
  });
  const blob = new Blob([csv], {type: 'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'project_history.csv';
  a.click();
  URL.revokeObjectURL(url);
});

// Export last project invoice
document.getElementById('exportInvoice').addEventListener('click', () => {
  if(!lastProject) {
    alert('No project calculated yet!');
    return;
  }

  let csv = `Company Name,Win Art Studio\n`;
  csv += `Project Name,${lastProject.name}\n`;
  csv += `Project Type,${lastProject.type}\n`;
  csv += `Total Cost,${lastProject.currency} ${lastProject.totalCost}\n`;
  csv += `Total Income,${lastProject.currency} ${lastProject.totalIncome}\n`;

  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${lastProject.name}_invoice.csv`;
  a.click();
  URL.revokeObjectURL(url);
});
