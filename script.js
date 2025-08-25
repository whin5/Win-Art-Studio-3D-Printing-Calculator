// Tab switching using your snippet
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;

    // remove active from all tabs
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    // hide all panels
    document.querySelectorAll('#resin, #filament, #history').forEach(p => {
      p.style.display = 'none';
    });

    // show selected panel
    document.querySelector(`#${tab}`).style.display = 'block';
  });
});

// Logo preview
const logoInput = document.getElementById('logoInput');
const logoPreview = document.getElementById('logoPreview');
logoInput.addEventListener('change', () => {
  const file = logoInput.files[0];
  if (file) {
    logoPreview.src = URL.createObjectURL(file);
    logoPreview.style.display = 'inline';
  }
});

// History storage
let projects = JSON.parse(localStorage.getItem('projects')) || [];
const historyTableBody = document.querySelector('#historyTable tbody');

function updateHistoryTable() {
  historyTableBody.innerHTML = '';
  projects.forEach(p => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${p.name}</td>
      <td>${p.type}</td>
      <td>${p.totalCost.toFixed(2)}</td>
      <td>${p.totalIncome.toFixed(2)}</td>
    `;
    historyTableBody.appendChild(row);
  });
}

// Resin Calculation
document.getElementById('r-calc').addEventListener('click', () => {
  const name = document.getElementById('r-name').value;
  const currency = document.getElementById('r-currency').value || '';
  const bottlePrice = Number(document.getElementById('r-bottlePrice').value);
  const bottleVolume = Number(document.getElementById('r-bottleVolume').value);
  const used = Number(document.getElementById('r-ml').value);
  const time = Number(document.getElementById('r-time').value);
  const watts = Number(document.getElementById('r-watts').value);
  const kwh = Number(document.getElementById('r-kwh').value);
  const labor = Number(document.getElementById('r-laborRate').value);
  const machine = Number(document.getElementById('r-machine').value);
  const markup = Number(document.getElementById('r-markup').value);

  const materialCost = (used / bottleVolume) * bottlePrice;
  const electricityCost = (watts / 1000) * time * kwh;
  const totalCost = materialCost + electricityCost + labor + machine;
  const totalIncome = totalCost * (1 + markup / 100);

  document.getElementById('r-results').innerHTML = `
    <p>Total Cost: ${currency} ${totalCost.toFixed(2)}</p>
    <p>Total Income: ${currency} ${totalIncome.toFixed(2)}</p>
  `;

  projects.push({
    name,
    type: 'Resin',
    totalCost,
    totalIncome
  });
  localStorage.setItem('projects', JSON.stringify(projects));
  updateHistoryTable();
});

// Filament Calculation
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

  const materialCost = (used / 1000) * price; // assuming price per kg
  const electricityCost = (watts / 1000) * time * kwh;
  const totalCost = materialCost + electricityCost + labor + machine;
  const totalIncome = totalCost * (1 + markup / 100);

  document.getElementById('f-results').innerHTML = `
    <p>Total Cost: ${currency} ${totalCost.toFixed(2)}</p>
    <p>Total Income: ${currency} ${totalIncome.toFixed(2)}</p>
  `;

  projects.push({
    name,
    type: 'Filament',
    totalCost,
    totalIncome
  });
  localStorage.setItem('projects', JSON.stringify(projects));
  updateHistoryTable();
});

// Export history to Excel
document.getElementById('exportHistory').addEventListener('click', () => {
  let csv = 'Project Name,Type,Total Cost,Total Income\n';
  projects.forEach(p => {
    csv += `${p.name},${p.type},${p.totalCost.toFixed(2)},${p.totalIncome.toFixed(2)}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'project_history.csv';
  link.click();
});

// Initialize table on load
updateHistoryTable();
