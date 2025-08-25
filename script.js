// Tab Switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
    document.getElementById(tab).style.display = 'block';
  });
});

// Logo Preview
document.getElementById('logoInput').addEventListener('change', function(e){
  const reader = new FileReader();
  reader.onload = function(){
    const img = document.getElementById('logoPreview');
    img.src = reader.result;
    img.style.display = 'inline-block';
  }
  reader.readAsDataURL(this.files[0]);
});

// Project History
let history = JSON.parse(localStorage.getItem('projects') || '[]');

function updateHistoryTable(){
  const tbody = document.querySelector('#historyTable tbody');
  tbody.innerHTML = '';
  let totalIncome = 0;
  history.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p.name}</td><td>${p.type}</td><td>${p.totalCost}</td><td>${p.totalIncome}</td>`;
    tbody.appendChild(tr);
    totalIncome += Number(p.totalIncome);
  });
  document.getElementById('totalIncome').innerText = totalIncome.toFixed(2);
}
updateHistoryTable();

// Clear History
document.getElementById('clearHistory').addEventListener('click', function(){
  if(confirm("Are you sure you want to clear all project history?")) {
    history = [];
    localStorage.removeItem('projects');
    updateHistoryTable();
  }
});

// Calculate Resin
document.getElementById('r-calc').addEventListener('click', function(){
  const name = document.getElementById('r-name').value;
  const currency = document.getElementById('r-currency').value || 'PHP';
  const bottlePrice = Number(document.getElementById('r-bottlePrice').value);
  const bottleVolume = Number(document.getElementById('r-bottleVolume').value);
  const used = Number(document.getElementById('r-ml').value);
  const time = Number(document.getElementById('r-time').value);
  const watts = Number(document.getElementById('r-watts').value);
  const kwh = Number(document.getElementById('r-kwh').value);
  const labor = Number(document.getElementById('r-laborRate').value);
  const machine = Number(document.getElementById('r-machine').value);
  const markup = Number(document.getElementById('r-markup').value);

  const resinCost = (bottlePrice/bottleVolume)*used;
  const powerCost = (watts/1000)*time*kwh;
  const machineCost = machine*time;
  const totalCost = resinCost + powerCost + labor + machineCost;
  const totalIncome = totalCost*(1+markup/100);

  document.getElementById('r-results').innerHTML = `${currency} Total Cost: ${totalCost.toFixed(2)}<br>${currency} Total Income: ${totalIncome.toFixed(2)}`;

  history.push({name, type:'Resin', totalCost: totalCost.toFixed(2), totalIncome: totalIncome.toFixed(2)});
  localStorage.setItem('projects', JSON.stringify(history));
  updateHistoryTable();
});

// Calculate Filament
document.getElementById('f-calc').addEventListener('click', function(){
  const name = document.getElementById('f-name').value;
  const currency = document.getElementById('f-currency').value || 'PHP';
  const price = Number(document.getElementById('f-price').value);
  const used = Number(document.getElementById('f-used').value);
  const time = Number(document.getElementById('f-time').value);
  const watts = Number(document.getElementById('f-watts').value);
  const kwh = Number(document.getElementById('f-kwh').value);
  const labor = Number(document.getElementById('f-laborRate').value);
  const machine = Number(document.getElementById('f-machine').value);
  const markup = Number(document.getElementById('f-markup').value);

  const filamentCost = price*used/1000;
  const powerCost = (watts/1000)*time*kwh;
  const machineCost = machine*time;
  const totalCost = filamentCost + powerCost + labor + machineCost;
  const totalIncome = totalCost*(1+markup/100);

  document.getElementById('f-results').innerHTML = `${currency} Total Cost: ${totalCost.toFixed(2)}<br>${currency} Total Income: ${totalIncome.toFixed(2)}`;

  history.push({name, type:'Filament', totalCost: totalCost.toFixed(2), totalIncome: totalIncome.toFixed(2)});
  localStorage.setItem('projects', JSON.stringify(history));
  updateHistoryTable();
});
