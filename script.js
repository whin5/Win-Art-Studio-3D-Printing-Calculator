// --- Tab Switching ---
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
    document.getElementById(tab).style.display = 'block';
  });
});

// --- Logo Upload Preview ---
document.getElementById('logoInput').addEventListener('change', function() {
  const file = this.files[0];
  if(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.getElementById('logoPreview');
      img.src = e.target.result;
      img.style.display = 'block';
    }
    reader.readAsDataURL(file);
  }
});

// --- History Data ---
let historyData = JSON.parse(localStorage.getItem('projects')) || [];
let lastProject = null;

// --- Update History Table ---
function updateHistory() {
  const tbody = document.querySelector('#historyTable tbody');
  tbody.innerHTML = '';
  let totalIncome = 0;
  historyData.forEach((p, i) => {
    totalIncome += p.totalIncome;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p.name}</td>
                    <td>${p.type}</td>
                    <td>${p.totalCost.toFixed(2)}</td>
                    <td>${p.totalIncome.toFixed(2)}</td>
                    <td><button onclick="exportInvoice(${i})">Invoice</button></td>`;
    tbody.appendChild(tr);
  });
  document.getElementById('totalIncome').textContent = totalIncome.toFixed(2);
}

// --- Export Individual Invoice ---
function exportInvoice(index) {
  const project = historyData[index];
  const wb = XLSX.utils.book_new();
  const wsData = [
    ['Project Name', project.name],
    ['Type', project.type],
    ['Total Cost', project.totalCost.toFixed(2)],
    ['Total Income', project.totalIncome.toFixed(2)]
  ];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, 'Invoice');
  XLSX.writeFile(wb, `${project.name}_Invoice.xlsx`);
}

// --- Export Last Project Invoice ---
function exportLastInvoice() {
  if(!lastProject) { alert("No project calculated yet!"); return; }
  const wb = XLSX.utils.book_new();
  const wsData = [
    ['Project Name', lastProject.name],
    ['Type', lastProject.type],
    ['Total Cost', lastProject.totalCost.toFixed(2)],
    ['Total Income', lastProject.totalIncome.toFixed(2)]
  ];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, 'Invoice');
  XLSX.writeFile(wb, `${lastProject.name}_Invoice.xlsx`);
}

// --- Resin Calculation ---
function calculateResin() {
  const name = document.getElementById('r-name').value || 'Unnamed Resin Project';
  const currency = document.getElementById('r-currency').value || 'PHP';
  const bottlePrice = parseFloat(document.getElementById('r-bottlePrice').value);
  const bottleVolume = parseFloat(document.getElementById('r-bottleVolume').value);
  const mlUsed = parseFloat(document.getElementById('r-ml').value);
  const hours = parseFloat(document.getElementById('r-time').value);
  const watts = parseFloat(document.getElementById('r-watts').value);
  const kwh = parseFloat(document.getElementById('r-kwh').value);
  const laborRate = parseFloat(document.getElementById('r-laborRate').value);
  const machineRate = parseFloat(document.getElementById('r-machine').value);
  const markup = parseFloat(document.getElementById('r-markup').value);

  const materialCost = (bottlePrice / bottleVolume) * mlUsed;
  const electricityCost = (watts * hours / 1000) * kwh;
  const laborCost = hours * laborRate;
  const machineCost = hours * machineRate;
  const totalCost = materialCost + electricityCost + laborCost + machineCost;
  const totalIncome = totalCost * (1 + markup / 100);

  document.getElementById('r-results').innerHTML = `
    Material: ${currency} ${materialCost.toFixed(2)}<br>
    Electricity: ${currency} ${electricityCost.toFixed(2)}<br>
    Labor: ${currency} ${laborCost.toFixed(2)}<br>
    Machine: ${currency} ${machineCost.toFixed(2)}<br>
    Total Cost: ${currency} ${totalCost.toFixed(2)}<br>
    Total Income: ${currency} ${totalIncome.toFixed(2)}
  `;

  lastProject = { name, type: 'Resin', totalCost, totalIncome, currency };
  historyData
