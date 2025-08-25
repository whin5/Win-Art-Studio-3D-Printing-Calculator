// Tab switching
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    panels.forEach(p => p.style.display = p.id === 'panel-' + target ? 'block' : 'none');
  });
});

// Logo upload preview
const logoUpload = document.getElementById('logo-upload');
const logoPreview = document.getElementById('logo-preview');
logoUpload.addEventListener('change', e => {
  const file = e.target.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = e => logoPreview.src = e.target.result;
    reader.readAsDataURL(file);
  }
});

// Storage
let projects = JSON.parse(localStorage.getItem('projects')) || [];

// Utility: Save and update
function saveProject(project){
  projects.push(project);
  localStorage.setItem('projects',JSON.stringify(projects));
  updateHistory();
}

// History table
const historyTableBody = document.querySelector('#history-table tbody');

function updateHistory(){
  historyTableBody.innerHTML = '';
  projects.forEach((p, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.type}</td>
      <td>${p.totalCost.toFixed(2)}</td>
      <td>${p.totalIncome.toFixed(2)}</td>
      <td>
        <button class="btn" onclick="exportInvoice(${idx})">Export Invoice</button>
      </td>
    `;
    historyTableBody.appendChild(tr);
  });
}

// Calculate Filament
document.getElementById('f-calc').addEventListener('click', () => {
  const name = document.getElementById('f-name').value;
  const currency = document.getElementById('f-currency').value || '';
  const price = parseFloat(document.getElementById('f-price').value);
  const used = parseFloat(document.getElementById('f-used').value);
  const time = parseFloat(document.getElementById('f-time').value);
  const watts = parseFloat(document.getElementById('f-watts').value);
  const kwh = parseFloat(document.getElementById('f-kwh').value);
  const labor = parseFloat(document.getElementById('f-labor').value);
  const machine = parseFloat(document.getElementById('f-machine').value);
  const markup = parseFloat(document.getElementById('f-markup').value);

  const materialCost = (used/1000)*price;
  const energyCost = watts * time / 1000 * kwh;
  const laborCost = labor * time;
  const machineCost = machine * time;
  const subtotal = materialCost + energyCost + laborCost + machineCost;
  const total = subtotal * (1 + markup/100);

  document.getElementById('f-result').innerText = `${currency} Total: ${total.toFixed(2)}`;
  saveProject({name,type:'Filament',totalCost:subtotal,totalIncome:total});
});

// Calculate Resin
document.getElementById('r-calc').addEventListener('click', () => {
  const name = document.getElementById('r-name').value;
  const currency = document.getElementById('r-currency').value || '';
  const price = parseFloat(document.getElementById('r-price').value);
  const used = parseFloat(document.getElementById('r-used').value);
  const time = parseFloat(document.getElementById('r-time').value);
  const watts = parseFloat(document.getElementById('r-watts').value);
  const kwh = parseFloat(document.getElementById('r-kwh').value);
  const labor = parseFloat(document.getElementById('r-labor').value);
  const machine = parseFloat(document.getElementById('r-machine').value);
  const markup = parseFloat(document.getElementById('r-markup').value);

  const materialCost = (used/1000)*price;
  const energyCost = watts * time / 1000 * kwh;
  const laborCost = labor * time;
  const machineCost = machine * time;
  const subtotal = materialCost + energyCost + laborCost + machineCost;
  const total = subtotal * (1 + markup/100);

  document.getElementById('r-result').innerText = `${currency} Total: ${total.toFixed(2)}`;
  saveProject({name,type:'Resin',totalCost:subtotal,totalIncome:total});
});

// Export all history to Excel
document.getElementById('export-history').addEventListener('click', () => {
  exportToExcel(projects, 'Project_History.xlsx');
});

// Export single project invoice
function exportInvoice(idx){
  const project = projects[idx];
  const data = [
    ['Win Art Studio Invoice'],
    ['Project Name', project.name],
    ['Type', project.type],
    ['Total Cost', project.totalCost.toFixed(2)],
    ['Total Income', project.totalIncome.toFixed(2)]
  ];
  exportToExcel(data, `${project.name}_Invoice.xlsx`);
}

// Simple Excel export
function exportToExcel(data, filename){
  let csv = '';
  data.forEach(row => {
    if(Array.isArray(row)){
      csv += row.join(',') + '\n';
    } else {
      csv += row.name + ',' + row.type + ',' + row.totalCost + ',' + row.totalIncome + '\n';
    }
  });
  const blob = new Blob([csv], {type:'text/csv'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

// Import previous projects
const importBtn = document.getElementById('import-history');
const importFile = document.getElementById('import-file');

importBtn.addEventListener('click', ()=> importFile.click());

importFile.addEventListener('change', e => {
  const file = e.target.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = function(ev){
      const imported = JSON.parse(ev.target.result);
      projects = projects.concat(imported);
      localStorage.setItem('projects', JSON.stringify(projects));
      updateHistory();
    };
    reader.readAsText(file);
  }
});

// Initial render
updateHistory();
