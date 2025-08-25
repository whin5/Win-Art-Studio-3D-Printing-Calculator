let history = JSON.parse(localStorage.getItem('projectHistory')||'[]');

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const tab=btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p=>p.style.display='none');
    document.getElementById(tab).style.display='block';
    if(tab==='history') renderHistory();
  });
});

// Logo upload
document.getElementById('logoInput').addEventListener('change', e=>{
  const file=e.target.files[0];
  if(file){
    const reader=new FileReader();
    reader.onload=()=>{document.getElementById('logoPreview').src=reader.result; document.getElementById('logoPreview').style.display='inline';};
    reader.readAsDataURL(file);
  }
});

// Resin calculation
document.getElementById('r-calc').addEventListener('click',()=>{
  const name=document.getElementById('r-name').value;
  const currency=document.getElementById('r-currency').value||'PHP';
  const bottlePrice=Number(document.getElementById('r-bottlePrice').value);
  const bottleVolume=Number(document.getElementById('r-bottleVolume').value);
  const used=Number(document.getElementById('r-ml').value);
  const time=Number(document.getElementById('r-time').value);
  const watts=Number(document.getElementById('r-watts').value);
  const kwh=Number(document.getElementById('r-kwh').value);
  const laborRate=Number(document.getElementById('r-laborRate').value);
  const machine=Number(document.getElementById('r-machine').value);
  const markup=Number(document.getElementById('r-markup').value);

  const materialCost = (used/bottleVolume)*bottlePrice;
  const electricityCost = watts/1000*time*kwh;
  const laborCost = laborRate*time;
  const machineCost = machine*time;
  const totalCost = materialCost + electricityCost + laborCost + machineCost;
  const totalIncomeValue = totalCost*(1+markup/100);

  document.getElementById('r-results').innerHTML=`Total Cost: ${currency} ${totalCost.toFixed(2)}<br>Total Income: ${currency} ${totalIncomeValue.toFixed(2)}`;

  // Save to history
  history.push({name,type:'Resin',currency,materialCost,electricityCost,laborCost,machineCost,totalCost,totalIncomeValue});
  localStorage.setItem('projectHistory',JSON.stringify(history));
  renderHistory();
});

// Filament calculation
document.getElementById('f-calc').addEventListener('click',()=>{
  const name=document.getElementById('f-name').value;
  const currency=document.getElementById('f-currency').value||'PHP';
  const price=Number(document.getElementById('f-price').value);
  const used=Number(document.getElementById('f-used').value);
  const time=Number(document.getElementById('f-time').value);
  const watts=Number(document.getElementById('f-watts').value);
  const kwh=Number(document.getElementById('f-kwh').value);
  const laborRate=Number(document.getElementById('f-laborRate').value);
  const machine=Number(document.getElementById('f-machine').value);
  const markup=Number(document.getElementById('f-markup').value);

  const materialCost = (used/1000)*price; // assume price per kg
  const electricityCost = watts/1000*time*kwh;
  const laborCost = laborRate*time;
  const machineCost = machine*time;
  const totalCost = materialCost + electricityCost + laborCost + machineCost;
  const totalIncomeValue = totalCost*(1+markup/100);

  document.getElementById('f-results').innerHTML=`Total Cost: ${currency} ${totalCost.toFixed(2)}<br>Total Income: ${currency} ${totalIncomeValue.toFixed(2)}`;

  // Save to history
  history.push({name,type:'Filament',currency,materialCost,electricityCost,laborCost,machineCost,totalCost,totalIncomeValue});
  localStorage.setItem('projectHistory',JSON.stringify(history));
  renderHistory();
});

// Render History
function renderHistory(){
  const tbody=document.querySelector('#historyTable tbody');
  tbody.innerHTML='';
  history.forEach((p,i)=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${p.name}</td><td>${p.type}</td><td>${p.totalCost.toFixed(2)}</td><td>${p.totalIncomeValue.toFixed(2)}</td>
    <td><button class="exportInvoice btn" data-index="${i}">Invoice</button></td>`;
    tbody.appendChild(tr);
  });
}

// Export History to Excel
document.getElementById('exportHistory').addEventListener('click', () => {
  if(history.length === 0){
    alert('No history to export.');
    return;
  }
  let csv = 'Project Name,Type,Total Cost,Total Income\n';
  history.forEach(p => {
    csv += `"${p.name}","${p.type}","${p.totalCost.toFixed(2)}","${p.totalIncomeValue.toFixed(2)}"\n`;
  });
  const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'project_history.csv';
  link.click();
});

// Export individual invoice
document.addEventListener('click', e => {
  if(e.target.classList.contains('exportInvoice')){
    const idx = e.target.dataset.index;
    const p = history[idx];
    if(!p){
      alert('Project data not found!');
      return;
    }

    let csv = '';
    if(document.getElementById('logoPreview').src){
      csv += `"Company Logo","${document.getElementById('logoPreview').src}"\n\n`;
    }
    csv += `"Invoice for Project","${p.name}"\n`;
    csv += `"Type","${p.type}"\n\n`;
    csv += `"Cost Breakdown","Amount (${p.currency})"\n`;
    csv += `"Material","${p.materialCost.toFixed(2)}"\n`;
    csv += `"Electricity","${p.electricityCost.toFixed(2)}"\n`;
    csv += `"Labor","${p.laborCost.toFixed(2)}"\n`;
    csv += `"Machine","${p.machineCost.toFixed(2)}"\n`;
    csv += `"Total Income","${p.totalIncomeValue.toFixed(2)}"\n`;

    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${p.name}_invoice.csv`;
    link.click();
  }
});

// Clear history
document.getElementById('clearHistory').addEventListener('click',()=>{
  if(confirm('Clear all history?')){
    history=[];
    localStorage.removeItem('projectHistory');
    renderHistory();
  }
});

// Initial render
renderHistory();
