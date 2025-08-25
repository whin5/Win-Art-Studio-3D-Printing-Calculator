let history = JSON.parse(localStorage.getItem('projects')) || [];

// Logo preview
const logoInput = document.getElementById('logoInput');
const logoPreview = document.getElementById('logoPreview');
logoInput.addEventListener('change', (e)=>{
  const file = e.target.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = ()=>{ logoPreview.src = reader.result; logoPreview.style.display='block'; };
    reader.readAsDataURL(file);
  }
});

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p=>p.style.display='none');
    document.getElementById(btn.dataset.tab).style.display='block';
  });
});

// Calculate Resin
document.getElementById('r-calc').addEventListener('click', ()=>{
  const name = document.getElementById('r-name').value;
  const currency = document.getElementById('r-currency').value;
  const bottlePrice = parseFloat(document.getElementById('r-bottlePrice').value);
  const bottleVolume = parseFloat(document.getElementById('r-bottleVolume').value);
  const used = parseFloat(document.getElementById('r-ml').value);
  const time = parseFloat(document.getElementById('r-time').value);
  const watts = parseFloat(document.getElementById('r-watts').value);
  const kwh = parseFloat(document.getElementById('r-kwh').value);
  const labor = parseFloat(document.getElementById('r-laborRate').value);
  const machine = parseFloat(document.getElementById('r-machine').value);
  const markup = parseFloat(document.getElementById('r-markup').value);

  const resinCost = (used/bottleVolume)*bottlePrice;
  const electricity = (watts/1000)*time*kwh;
  const totalCost = resinCost + electricity + labor + (machine*time);
  const totalIncome = totalCost * (1 + markup/100);

  history.push({name,type:'Resin',totalCost:totalCost.toFixed(2),totalIncome:totalIncome.toFixed(2),currency});
  localStorage.setItem('projects', JSON.stringify(history));
  document.getElementById('r-results').innerText=`Total Cost: ${currency} ${totalCost.toFixed(2)}\nTotal Income: ${currency} ${totalIncome.toFixed(2)}`;
  updateHistoryTable();
});

// Calculate Filament
document.getElementById('f-calc').addEventListener('click', ()=>{
  const name = document.getElementById('f-name').value;
  const currency = document.getElementById('f-currency').value;
  const price = parseFloat(document.getElementById('f-price').value);
  const used = parseFloat(document.getElementById('f-used').value);
  const time = parseFloat(document.getElementById('f-time').value);
  const watts = parseFloat(document.getElementById('f-watts').value);
  const kwh = parseFloat(document.getElementById('f-kwh').value);
  const labor = parseFloat(document.getElementById('f-laborRate').value);
  const machine = parseFloat(document.getElementById('f-machine').value);
  const markup = parseFloat(document.getElementById('f-markup').value);

  const materialCost = (used/1000)*price; // per gram
  const electricity = (watts/1000)*time*kwh;
  const totalCost = materialCost + electricity + labor + (machine*time);
  const totalIncome = totalCost*(1+markup/100);

  history.push({name,type:'Filament',totalCost:totalCost.toFixed(2),totalIncome:totalIncome.toFixed(2),currency});
  localStorage.setItem('projects', JSON.stringify(history));
  document.getElementById('f-results').innerText=`Total Cost: ${currency} ${totalCost.toFixed(2)}\nTotal Income: ${currency} ${totalIncome.toFixed(2)}`;
  updateHistoryTable();
});

// Update History Table
function updateHistoryTable(){
  const tbody = document.querySelector('#historyTable tbody');
  tbody.innerHTML='';
  history.forEach((p,i)=>{
    const tr = document.createElement('tr');
    tr.innerHTML=`<td>${p.name}</td><td>${p.type}</td><td>${p.totalCost}</td><td>${p.totalIncome}</td>
                  <td><button class="btn" onclick="exportInvoice(${i})">Export Invoice</button></td>`;
    tbody.appendChild(tr);
  });
}

// Export Invoice
function exportInvoice(index){
  const project = history[index];
  if(!project) return;
  const wb = XLSX.utils.book_new();
  const ws_data=[
    ["Win Art Studio: 3D Printing Invoice"],
    [],
    project.name, 
    ["Project Type", project.type],
    [],
    ["Description", `Cost (${project.currency || ''})`],
    ["Total Cost", project.totalCost],
    ["Total Income", project.totalIncome]
  ];
  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(wb, ws, "Invoice");
  XLSX.writeFile(wb, `${project.name}_invoice.xlsx`);
}

// Export History
document.getElementById('exportHistory').addEventListener('click', ()=>{
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(history);
  XLSX.utils.book_append_sheet(wb, ws, "History");
  XLSX.writeFile(wb, "project_history.xlsx");
});

// Import History
document.getElementById('importHistory').addEventListener('click', ()=>{
  const input = document.createElement('input');
  input.type='file';
  input.accept='.xlsx';
  input.onchange=e=>{
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = evt=>{
      const data = new Uint8Array(evt.target.result);
      const wb = XLSX.read(data,{type:'array'});
      const ws = wb.Sheets[wb.SheetNames[0]];
      const imported = XLSX.utils.sheet_to_json(ws);
      history = imported;
      localStorage.setItem('projects', JSON.stringify(history));
      updateHistoryTable();
    };
    reader.readAsArrayBuffer(file);
  };
  input.click();
});

// Clear History
document.getElementById('clearHistory').addEventListener('click', ()=>{
  if(confirm("Clear all project history?")){
    history=[];
    localStorage.setItem('projects', JSON.stringify(history));
    updateHistoryTable();
  }
});

// Load history on page load
updateHistoryTable();
