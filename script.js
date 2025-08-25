// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
    document.getElementById(tab).style.display = 'block';
  });
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

// Export to Excel (history)
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

// Simple calculate & save for Resin
document.getElementById('r-calc').addEventListener('click', () => {
  const name = document.getElementById('r-name').value;
  const currency = document.getElementById('r-currency').value || '';
  const bottlePrice = Number(document.getElementById('r-bottlePrice').value);
  const bottleVol = Number(document.getElementById('r-bottleVolume').value);
  const used = Number(document.getElementById('r-ml').value);
  const time = Number(document.getElementById('r-time').value);
  const watts = Number(document.getElementById('r-watts').value);
  const kwh = Number(document.getElementById('r-kwh').value);
  const labor = Number(document.getElementById('r-laborRate').value);
  const machine = Number(document.getElementById('r-machine').value);
  const markup = Number(document.getElementById('r-markup').value);

  const resinCost = (bottlePrice * used / bottleVol);
  const electricity = (watts/1000)*time*kwh;
  const laborCost = labor + machine + electricity; // summarized
  const totalCost = resinCost + laborCost;
  const totalIncome = totalCost * (1 + markup/100);

  document.getElementById('r-results').innerHTML = `
    Total Cost: ${currency} ${totalCost.toFixed(2)}<br>
    Total Income: ${currency} ${totalIncome.toFixed(2)}
  `;

  history.push({name,type:'Resin',totalCost:totalCost.toFixed(2),totalIncome:totalIncome.toFixed(2)});
  localStorage.setItem('projects', JSON.stringify(history));
  updateHistoryTable();
});

// Simple calculate & save for Filament
document.getElementById('f-calc').addEventListener('click', () => {
  const name = document.getElementById('f-name').value;
  const currency = document.getElementById('f-currency').value || '';
  const price = Number(document.getElementById('f-price').value);
  const used = Number(document.getElementById('f-used').value);
  const time = Number(document.getElementById('f-time').value);
  const watts = Number(document.getElementById('f-watts').value);
  const kwh = Number(document.getElementById('f-kwh').value);
  const labor = Number(document.getElementById('f-laborRate').value);
  const machine = Number(document.getElementById('f-machine').value);
  const markup = Number(document.getElementById('f-markup').value);

  const materialCost = price*used/1000;
  const electricity = (watts/1000)*time*kwh;
  const laborCost = labor + machine + electricity; // summarized
  const totalCost = materialCost + laborCost;
  const totalIncome = totalCost*(1+markup/100);

  document.getElementById('f-results').innerHTML = `
    Total Cost: ${currency} ${totalCost.toFixed(2)}<br>
    Total Income: ${currency} ${totalIncome.toFixed(2)}
  `;

  history.push({name,type:'Filament',totalCost:totalCost.toFixed(2),totalIncome:totalIncome.toFixed(2)});
  localStorage.setItem('projects', JSON.stringify(history));
  updateHistoryTable();
});
