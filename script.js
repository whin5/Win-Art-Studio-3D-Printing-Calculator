document.addEventListener('DOMContentLoaded', () => {

  // --- Tabs ---
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
      document.getElementById(tab).style.display = 'block';
    });
  });
  document.getElementById(document.querySelector('.tab-btn.active').dataset.tab).style.display = 'block';

  // --- Logo ---
  const logoInput = document.getElementById('logoInput');
  const logoPreview = document.getElementById('logoPreview');
  logoInput.addEventListener('change', () => {
    const file = logoInput.files[0];
    if(file){
      const reader = new FileReader();
      reader.onload = e => {
        logoPreview.src = e.target.result;
        logoPreview.style.display = 'block';
      }
      reader.readAsDataURL(file);
    }
  });

  // --- History ---
  let historyData = JSON.parse(localStorage.getItem('projects')) || [];
  let lastProject = null;

  function updateHistory() {
    const tbody = document.querySelector('#historyTable tbody');
    tbody.innerHTML = '';
    let totalIncome = 0;
    historyData.forEach((p, i) => {
      totalIncome += p.totalIncome;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.name}</td>
        <td>${p.type}</td>
        <td>${p.totalCost.toFixed(2)}</td>
        <td>${p.totalIncome.toFixed(2)}</td>
        <td><button onclick="exportInvoice(${i})">Invoice</button></td>
      `;
      tbody.appendChild(tr);
    });
    document.getElementById('totalIncome').textContent = totalIncome.toFixed(2);
  }

  // --- Export Invoice ---
  window.exportInvoice = function(index){
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

  // --- Export Last Invoice ---
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

  document.getElementById('r-invoice').addEventListener('click', exportLastInvoice);
  document.getElementById('f-invoice').addEventListener('click', exportLastInvoice);

  // --- Resin Calc ---
  document.getElementById('r-calc').addEventListener('click', () => {
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
    const totalIncome = totalCost * (1 + markup/100);

    document.getElementById('r-results').innerHTML = `
      Material: ${currency} ${materialCost.toFixed(2)}<br>
      Electricity: ${currency} ${electricityCost.toFixed(2)}<br>
      Labor: ${currency} ${laborCost.toFixed(2)}<br>
      Machine: ${currency} ${machineCost.toFixed(2)}<br>
      Total Cost: ${currency} ${totalCost.toFixed(2)}<br>
      Total Income: ${currency} ${totalIncome.toFixed(2)}
    `;

    lastProject = { name, type:'Resin', totalCost, totalIncome, currency };
    historyData.push(lastProject);
    localStorage.setItem('projects', JSON.stringify(historyData));
    updateHistory();
  });

  // --- Filament Calc ---
  document.getElementById('f-calc').addEventListener('click', () => {
    const name = document.getElementById('f-name').value || 'Unnamed Filament Project';
    const currency = document.getElementById('f-currency').value || 'PHP';
    const price = parseFloat(document.getElementById('f-price').value);
    const used = parseFloat(document.getElementById('f-used').value);
    const hours = parseFloat(document.getElementById('f-time').value);
    const watts = parseFloat(document.getElementById('f-watts').value);
    const kwh = parseFloat(document.getElementById('f-kwh').value);
    const laborRate = parseFloat(document.getElementById('f-laborRate').value);
    const machineRate = parseFloat(document.getElementById('f-machine').value);
    const markup = parseFloat(document.getElementById('f-markup').value);

    const materialCost = (price / 1000) * used;
    const electricityCost = (watts * hours / 1000) * kwh;
    const laborCost = hours * laborRate;
    const machineCost = hours * machineRate;
    const totalCost = materialCost + electricityCost + laborCost + machineCost;
    const totalIncome = totalCost * (1 + markup/100);

    document.getElementById('f-results').innerHTML = `
      Material: ${currency} ${materialCost.toFixed(2)}<br>
      Electricity: ${currency} ${electricityCost.toFixed(2)}<br>
      Labor: ${currency} ${laborCost.toFixed(2)}<br>
      Machine: ${currency} ${machineCost.toFixed(2)}<br>
      Total Cost: ${currency} ${totalCost.toFixed(2)}<br>
      Total Income: ${currency} ${totalIncome.toFixed(2)}
    `;

    lastProject = { name, type:'Filament', totalCost, totalIncome, currency };
    historyData.push(lastProject);
    localStorage.setItem('projects', JSON.stringify(historyData));
    updateHistory();
  });

  // --- Export Full History ---
  document.getElementById('exportHistory').addEventListener('click', () => {
    if(historyData.length === 0){ alert("No history to export!"); return; }
    const wb = XLSX.utils.book_new();
    const wsData = [['Project Name','Type','Total Cost','Total Income']];
    historyData.forEach(p => wsData.push([p.name,p.type,p.totalCost.toFixed(2),p.totalIncome.toFixed(2)]));
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'History');
    XLSX.writeFile(wb, `3DPrinting_History.xlsx`);
  });

  // --- Clear History ---
  document.getElementById('clearHistory').addEventListener('click', () => {
    if(confirm("Clear all history?")){
      historyData = [];
      lastProject = null;
      localStorage.removeItem('projects');
      updateHistory();
      document.getElementById('r-results').innerHTML = '';
      document.getElementById('f-results').innerHTML = '';
    }
  });

  updateHistory();
});
