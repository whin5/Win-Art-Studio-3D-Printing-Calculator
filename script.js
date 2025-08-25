let history = JSON.parse(localStorage.getItem('projects') || '[]');
updateHistoryTable();

// Logo Preview
document.getElementById('logoInput').addEventListener('change', function(){
  const file = this.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = document.getElementById('logoPreview');
    img.src = reader.result;
    img.style.display = 'block';
  };
  reader.readAsDataURL(file);
});

// Project Type Switch
document.getElementById('projectType').addEventListener('change', function(){
  const type = this.value;
  const resinLabels = document.querySelectorAll('#resinPriceLabel, #resinVolumeLabel');
  if(type === 'resin') {
    resinLabels.forEach(l => l.style.display='block');
    document.getElementById('p-price').value=1200;
    document.getElementById('p-volume').value=1000;
  } else {
    resinLabels.forEach(l => l.style.display='none');
    document.getElementById('p-price').value=1000;
  }
});

// Calculate
document.getElementById('calculateBtn').addEventListener('click', function(){
  const type = document.getElementById('projectType').value;
  const name = document.getElementById('p-name').value;
  const currency = document.getElementById('p-currency').value;
  const price = parseFloat(document.getElementById('p-price').value);
  const volume = parseFloat(document.getElementById('p-volume').value || 1);
  const used = parseFloat(document.getElementById('p-used').value);
  const time = parseFloat(document.getElementById('p-time').value);
  const kwh = parseFloat(document.getElementById('p-kwh').value);
  const laborRate = parseFloat(document.getElementById('p-laborRate').value);
  const machine = parseFloat(document.getElementById('p-machine').value);
  const markup = parseFloat(document.getElementById('p-markup').value);

  let materialCost;
  if(type==='resin'){
    materialCost = (used/volume)*price;
  } else {
    materialCost = (used/1000)*price;
  }

  let electricityCost = 0; // simplified, you can compute if needed
  let labor = laborRate;
  let machineCost = time*machine;

  let totalCost = materialCost + labor + machineCost + electricityCost;
  let totalIncome = totalCost * (1 + markup/100);

  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `<h3>Invoice Preview</h3>
    ${document.getElementById('logoPreview').src ? `<img src="${document.getElementById('logoPreview').src}" style="max-height:50px;">` : ''}
    <p>Project: ${name}</p>
    <p>Type: ${type}</p>
    <p>Total Cost: ${currency} ${totalCost.toFixed(2)}</p>
    <p>Total Income: ${currency} ${totalIncome.toFixed(2)}</p>
    <button id="exportInvoice" class="btn">Export Invoice</button>`;

  // Add to history
  history.push({name,type,totalCost: totalCost.toFixed(2),totalIncome: totalIncome.toFixed(2)});
  localStorage.setItem('projects', JSON.stringify(history));
  updateHistoryTable();

  // Export single invoice
  document.getElementById('exportInvoice').addEventListener('click', function(){
    const csvContent = "data:text/csv;charset=utf-8,Project,Type,Total Cost,Total Income\n" +
      `${name},${type},${totalCost.toFixed(2)},${totalIncome.toFixed(2)}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${name}_invoice.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});

// Update History Table
function updateHistoryTable(){
  const tbody = document.querySelector('#historyTable tbody');
  tbody.innerHTML = '';
  let total = 0;
  history.forEach(proj => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${proj.name}</td><td>${proj.type}</td><td>${proj.totalCost}</td><td>${proj.totalIncome}</td>`;
    tbody.appendChild(tr);
    total += parseFloat(proj.totalIncome);
  });
  document.getElementById('totalIncome').textContent = total.toFixed(2);
}

// Export History CSV
document.getElementById('exportHistory').addEventListener('click', function(){
  let csvContent = "data:text/csv;charset=utf-8,Project Name,Type,Total Cost,Total Income\n";
  history.forEach(proj => {
    csvContent += `${proj.name},${proj.type},${proj.totalCost},${proj.totalIncome}\n`;
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `project_history.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Import History CSV
document.getElementById('importHistoryInput').addEventListener('change', e => {
  const file = e.target.files[0];
  if(!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const text = reader.result;
    const lines = text.split('\n').slice(1); // skip header
    const imported = [];
    lines.forEach(line => {
      if(line.trim()==='') return;
      const [name,type,totalCost,totalIncome] = line.split(',');
      imported.push({name,type,totalCost,totalIncome});
    });
    history = imported;
    localStorage.setItem('projects', JSON.stringify(history));
    updateHistoryTable();
  }
  reader.readAsText(file);
});
