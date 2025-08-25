// Tabs
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-panel');
tabs.forEach(tab=>{
  tab.addEventListener('click', ()=>{
    tabs.forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    panels.forEach(p=>p.style.display='none');
    document.getElementById(tab.dataset.tab+'-panel').style.display='block';
    if(tab.dataset.tab==='history') renderHistory();
  });
});

// Logo upload preview
document.getElementById('logo-upload').addEventListener('change', e=>{
  const file = e.target.files[0];
  if(file){
    document.getElementById('logo-preview').src = URL.createObjectURL(file);
  }
});

// Utils
function fmtMoney(code, n){ return `${code} ${n.toFixed(2)}`; }
let projects = JSON.parse(localStorage.getItem('projects')||'[]');

// Render history
function renderHistory(){
  const tbody = document.querySelector('#history-table tbody');
  tbody.innerHTML='';
  let totalIncome =0;
  projects.forEach((p,i)=>{
    totalIncome+=p.total;
    const tr = document.createElement('tr');
    tr.innerHTML=`
      <td>${p.type}</td>
      <td>${p.name}</td>
      <td>${fmtMoney(p.currency,p.totalCost)}</td>
      <td>${fmtMoney(p.currency,p.total)}</td>
      <td><button onclick="exportInvoice(${i})">Invoice</button></td>
    `;
    tbody.appendChild(tr);
  });
  document.getElementById('total-income').innerText = fmtMoney('PHP',totalIncome);
}

// Filament Calc
document.getElementById('f-calc').addEventListener('click',()=>{
  const name=document.getElementById('f-name').value;
  const currency=document.getElementById('f-currency').value;
  const price=parseFloat(document.getElementById('f-price').value);
  const used=parseFloat(document.getElementById('f-used').value);
  const time=parseFloat(document.getElementById('f-time').value);
  const watts=parseFloat(document.getElementById('f-watts').value);
  const kwh=parseFloat(document.getElementById('f-kwh').value);
  const labor=parseFloat(document.getElementById('f-labor').value);
  const machine=parseFloat(document.getElementById('f-machine').value);
  const markup=parseFloat(document.getElementById('f-markup').value);

  const materialCost = (used/1000)*price;
  const energy = (watts*time/1000)*kwh;
  const laborCost = labor;
  const machineCost = machine*time;
  const subtotal = materialCost+energy+laborCost+machineCost;
  const total = subtotal*(1+markup/100);

  document.getElementById('f-results').innerHTML=`Total: ${fmtMoney(currency,total)}`;

  projects.push({type:'Filament',name,currency,totalCost:subtotal,total});
  localStorage.setItem('projects',JSON.stringify(projects));
  renderHistory();
});

// Resin Calc
document.getElementById('r-calc').addEventListener('click',()=>{
  const name=document.getElementById('r-name').value;
  const currency=document.getElementById('r-currency').value;
  const price=parseFloat(document.getElementById('r-price').value);
  const used=parseFloat(document.getElementById('r-used').value);
  const time=parseFloat(document.getElementById('r-time').value);
  const watts=parseFloat(document.getElementById('r-watts').value);
  const kwh=parseFloat(document.getElementById('r-kwh').value);
  const labor=parseFloat(document.getElementById('r-labor').value);
  const machine=parseFloat(document.getElementById('r-machine').value);
  const markup=parseFloat(document.getElementById('r-markup').value);

  const materialCost = (used/1000)*price;
  const energy = (watts*time/1000)*kwh;
  const laborCost = labor;
  const machineCost = machine*time;
  const subtotal = materialCost+energy+laborCost+machineCost;
  const total = subtotal*(1+markup/100);

  document.getElementById('r-results').innerHTML=`Total: ${fmtMoney(currency,total)}`;

  projects.push({type:'Resin',name,currency,totalCost:subtotal,total});
  localStorage.setItem('projects',JSON.stringify(projects));
  renderHistory();
});

// Export summary
document.getElementById('export-summary').addEventListener('click',()=>{
  let csv = 'Type,Project Name,Total Cost,Total Income\n';
  projects.forEach(p=>{
    csv+=`${p.type},${p.name},${p.totalCost},${p.total}\n`;
  });
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href=url;
  a.download='projects_summary.csv';
  a.click();
  URL.revokeObjectURL(url);
});

// Export single invoice
function exportInvoice(i){
  const p=projects[i];
  let csv = `Win Art Studio\nProject Invoice\nType,Project Name,Total Cost,Total Income\n${p.type},${p.name},${p.totalCost},${p.total}\n`;
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href=url;
  a.download=`invoice_${p.name}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
