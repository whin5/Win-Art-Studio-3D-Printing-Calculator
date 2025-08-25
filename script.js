// Tab Switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;

    document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
    document.getElementById(tab).style.display = 'block';
  });
});

// Logo Preview
const logoInput = document.getElementById('logoInput');
const logoPreview = document.getElementById('logoPreview');
logoInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = e => {
      logoPreview.src = e.target.result;
      logoPreview.style.display = 'inline';
    };
    reader.readAsDataURL(file);
  }
});

// History
let history = JSON.parse(localStorage.getItem('projectHistory')) || [];

function updateHistoryTable() {
  const tbody = document.querySelector('#historyTable tbody');
  tbody.innerHTML = '';
  history.forEach(h => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${h.name}</td><td>${h.type}</td><td>${h.totalCost.toFixed(2)}</td><td>${h.totalIncome.toFixed(2)}</td>`;
    tbody.appendChild(row);
  });
}

// Clear History
document.getElementById('clearHistory').addEventListener('click', () => {
  if(confirm('Are you sure you want to clear history?')){
    history = [];
    localStorage.setItem('projectHistory', JSON.stringify(history));
    updateHistoryTable();
  }
});

// Resin Calculation
document.getElementById('r-calc').addEventListener('click', () => {
  const name = document.getElementById('r-name').value;
  const currency = document.getElementById('r-currency').value || '';
  const bottlePrice = parseFloat(document.getElementById('r-bottlePrice').value);
  const bottleVolume = parseFloat(document.getElementById('r-bottleVolume').value);
  const mlUsed = parseFloat(document.getElementById('r-ml').value);
  const time = parseFloat(document.getElementById('r-time').value);
  const watts = parseFloat(document.getElementById('r-watts').value);
  const kwh = parseFloat(document.getElementById('r-kwh').value);
  const labor = parseFloat(document.getElementById('r-laborRate').value);
  const machine = parseFloat(document.getElementById('r-machine').value);
  const markup = parseFloat(document.getElementById('r-markup').value);

  const materialCost = bottlePrice * (mlUsed / bottleVolume);
  const electricityCost = (watts/1000) * time * kwh;
  const totalCost = materialCost + electricityCost + labor + (machine*time);
  const totalIncome = totalCost * (1 + markup/100);

  document.getElementById('r-results').innerHTML = `${currency} Total Cost: ${totalCost.toFixed(2)}<br>${currency} Total Income: ${totalIncome.toFixed(2)}`;

  history.push({name, type:'Resin', totalCost, totalIncome});
  localStorage.setItem('projectHistory', JSON.stringify(history));
  updateHistoryTable();
});

// Filament Calculation
document.getElementById('f-calc').addEventListener('click', () => {
  const name = document.getElementById('f-name').value;
  const currency = document.getElementById('f-currency').value || '';
  const price = parseFloat(document.getElementById('f-price').value);
  const used = parseFloat(document.getElementById('f-used').value);
  const time = parseFloat(document.getElementById('f-time').value);
  const watts = parseFloat(document.getElementById('f-watts').value);
  const kwh = parseFloat(document.getElementById('f-kwh').value);
  const labor = parseFloat(document.getElementById('f-laborRate').value);
  const machine = parseFloat(document.getElementById('f-machine').value);
  const markup = parseFloat(document.getElementById('f-markup').value);

  const materialCost = price * (used/1000);
  const electricityCost = (watts/1000) * time * kwh;
  const totalCost = materialCost + electricityCost + labor + (machine*time);
  const totalIncome = totalCost * (1 + markup/100);

  document.getElementById('f-results').innerHTML = `${currency} Total Cost: ${totalCost.toFixed(2)}<br>${currency} Total Income: ${totalIncome.toFixed(2)}`;

  history.push({name, type:'Filament', totalCost, totalIncome});
  localStorage.setItem('projectHistory', JSON.stringify(history));
  updateHistoryTable();
});

// Export History to Excel
function exportToExcel(filename, rows){
  let csvContent = "data:text/csv;charset=utf-8,";
  rows.forEach(r => {
    csvContent += r.join(",") + "\r\n";
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

document.getElementById('exportHistory').addEventListener('click', () => {
  const rows = [['Project Name','Type','Total Cost','Total Income']];
  history.forEach(h => {
    rows.push([h.name,h.type,h.totalCost.toFixed(2),h.totalIncome.toFixed(2)]);
  });
  exportToExcel('project_history.csv', rows);
});

// Export Single Project Invoice
function exportInvoice(project){
  const rows = [
    ['Win Art Studio: Invoice'],
    ['Project Name', project.name],
    ['Type', project.type],
    ['Total Cost', project.totalCost.toFixed(2)],
    ['Total Income', project.totalIncome.toFixed(2)]
  ];
  exportToExcel(`${project.name}_invoice.csv`, rows);
}

document.getElementById('r-exportInvoice').addEventListener('click', () => {
  const last = history.filter(h=>h.type==='Resin').slice(-1)[0];
  if(last) exportInvoice(last);
});
document.getElementById('f-exportInvoice').addEventListener('click', () => {
  const last = history.filter(h=>h.type==='Filament').slice(-1)[0];
  if(last) exportInvoice(last);
});

// Initialize
updateHistoryTable();
