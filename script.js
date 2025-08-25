let history = [];

// Tab switch
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// Resin calculation
function calculateResin() {
  const project = document.getElementById('resinProject').value;
  const currency = document.getElementById('resinCurrency').value;
  const price = parseFloat(document.getElementById('resinPrice').value);
  const used = parseFloat(document.getElementById('resinUsed').value);
  const time = parseFloat(document.getElementById('resinPrintTime').value);
  const power = parseFloat(document.getElementById('resinPower').value);
  const elecRate = parseFloat(document.getElementById('resinElecRate').value);
  const laborRate = parseFloat(document.getElementById('resinLabor').value);
  const operatorHours = parseFloat(document.getElementById('resinOperatorHours').value);
  const machinePrice = parseFloat(document.getElementById('resinMachinePrice').value);
  const amortYears = parseFloat(document.getElementById('resinAmort').value);
  const markup = parseFloat(document.getElementById('resinMarkup').value);

  const materialCost = price * used;
  const elecCost = (power * time / 1000) * elecRate;
  const laborCost = laborRate * operatorHours;
  const amortCost = (machinePrice / (amortYears * 365 * 24)) * time;
  const baseCost = materialCost + elecCost + laborCost + amortCost;
  const totalCost = baseCost * (1 + markup / 100);

  document.getElementById('resinResult').innerHTML =
    `<h3>Total Cost: ${totalCost.toFixed(2)} ${currency}</h3>`;

  addHistory("Resin", project, totalCost, currency);
}

// Filament calculation
function calculateFilament() {
  const project = document.getElementById('filamentProject').value;
  const currency = document.getElementById('filamentCurrency').value;
  const price = parseFloat(document.getElementById('filamentPrice').value);
  const used = parseFloat(document.getElementById('filamentUsed').value);
  const time = parseFloat(document.getElementById('filamentPrintTime').value);
  const power = parseFloat(document.getElementById('filamentPower').value);
  const elecRate = parseFloat(document.getElementById('filamentElecRate').value);
  const laborRate = parseFloat(document.getElementById('filamentLabor').value);
  const operatorHours = parseFloat(document.getElementById('filamentOperatorHours').value);
  const machinePrice = parseFloat(document.getElementById('filamentMachinePrice').value);
  const amortYears = parseFloat(document.getElementById('filamentAmort').value);
  const markup = parseFloat(document.getElementById('filamentMarkup').value);

  const materialCost = price * used;
  const elecCost = (power * time / 1000) * elecRate;
  const laborCost = laborRate * operatorHours;
  const amortCost = (machinePrice / (amortYears * 365 * 24)) * time;
  const baseCost = materialCost + elecCost + laborCost + amortCost;
  const totalCost = baseCost * (1 + markup / 100);

  document.getElementById('filamentResult').innerHTML =
    `<h3>Total Cost: ${totalCost.toFixed(2)} ${currency}</h3>`;

  addHistory("Filament", project, totalCost, currency);
}

// Add to history
function addHistory(type, project, cost, currency) {
  history.push({ type, project, cost, currency });
  renderHistory();
}

// Render history
function renderHistory() {
  const tbody = document.querySelector('#historyTable tbody');
  tbody.innerHTML = "";
  history.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.type}</td>
      <td>${item.project}</td>
      <td>${item.cost.toFixed(2)}</td>
      <td>${item.currency}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Export to Excel (CSV format, Excel-readable)
function exportToExcel() {
  let csv = "Type,Project,Cost,Currency\n";
  history.forEach(item => {
    csv += `${item.type},${item.project},${item.cost.toFixed(2)},${item.currency}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "invoice.csv";
  a.click();
  window.URL.revokeObjectURL(url);
}
