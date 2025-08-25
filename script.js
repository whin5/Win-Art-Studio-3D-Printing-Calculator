const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.panel').forEach(p => p.style.display = 'none');
    document.getElementById(`panel-${tab.dataset.tab}`).style.display = 'block';
    if(tab.dataset.tab==='history') updateHistoryTable();
  });
});

const currencies = ['PHP','USD','EUR','JPY'];
function populateCurrency(selId) {
  const sel = document.getElementById(selId);
  sel.innerHTML = '';
  currencies.forEach(c => sel.innerHTML += `<option value="${c}">${c}</option>`);
}
populateCurrency('f-currency');
populateCurrency('r-currency');

// Logo upload
document.getElementById('logo-upload').addEventListener('change', e=>{
  const file = e.target.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = () => {
      const img = document.getElementById('logo-img');
      img.src = reader.result;
      img.style.display='block';
    }
    reader.readAsDataURL(file);
  }
});

function calculateTotal(materialCost, hours, power, electricityRate, laborRate, laborHours, machine, markup){
  const energy = (power*hours/1000)*electricityRate;
  const labor = laborRate*laborHours;
  const subtotal = materialCost+energy+labor+machine;
  const total = subtotal*(1+markup/100);
  return total;
}

// Save projects
let projects = JSON.parse(localStorage.getItem('projects')||'[]');

function saveProject(type, name, currency, materialCost, total){
  const proj = {type,name,currency,materialCost,total};
  projects.push(proj);
  localStorage.setItem('projects',JSON.stringify(projects));
}

function updateHistoryTable(){
  const tbody = document.querySelector('#history-table tbody');
  tbody.innerHTML='';
  let totalIncome=0;
  projects.forEach((p,i)=>{
    totalIncome+=p.total;
    const tr = document.createElement('tr');
    tr.innerHTML=`<td>${p.name}</td><td>${p.type}</td><td>${p.materialCost.toFixed(2)}</td><td>${p.total.toFixed(2)}</td>
      <td><button onclick="exportInvoice(${i})">Invoice</button></td>`;
    tbody.appendChild(tr);
  });
  document.getElementById('total-income').textContent = totalIncome.toFixed(2);
}

// Filament calculation
document.getElementById('f-calc').addEventListener('click',()=>{
  const name = document.getElementById('f-name').value;
  const currency = document.getElementById('f-currency').value;
  const price = parseFloat(document.getElementById('f-price').value);
  const used = parseFloat(document.getElementById('f-used').value);
  const hours = parseFloat(document.getElementById('f-time').value);
  const power = parseFloat(document.getElementById('f-power').value);
  const electricity = parseFloat(document.getElementById('f-electricity').value);
  const laborRate = parseFloat(document.getElementById('f-labor').value);
  const machine = parseFloat(document.getElementById('f-machine').value);
  const markup = parseFloat(document.getElementById('f-markup').value);
  const materialCost = (used/1000)*price;
  const total = calculateTotal(materialCost,hours,power,electricity,laborRate, hours, machine, markup);
  document.getElementById('f-results').textContent=`Total: ${currency} ${total.toFixed(2)}`;
  saveProject('Filament',name,currency,materialCost,total);
});

// Resin calculation
document.getElementById('r-calc').addEventListener('click',()=>{
  const name = document.getElementById('r-name').value;
  const currency = document.getElementById('r-currency').value;
  const price = parseFloat(document.getElementById('r-price').value);
  const used = parseFloat(document.getElementById('r-used').value);
  const hours = parseFloat(document.getElementById('r-time').value);
  const power = parseFloat(document.getElementById('r-power').value);
  const electricity = parseFloat(document.getElementById('r-electricity').value);
  const laborRate = parseFloat(document.getElementById('r-labor').value);
  const machine = parseFloat(document.getElementById('r-machine').value);
  const markup = parseFloat(document.getElementById('r-markup').value);
  const materialCost = (used/1000)*price;
  const total = calculateTotal(materialCost,hours,power,electricity,laborRate,hours,machine,markup);
  document.getElementById('r-results').textContent=`Total: ${currency} ${total.toFixed(2)}`;
  saveProject('Resin',name,currency,materialCost,total);
});

// Export history summary
document.getElementById('export-summary').addEventListener('click',()=>{
  let csv = 'Project,Type,Material Cost,Total Income\n';
  projects.forEach(p=>{
    csv+=`${p.name},${p.type},${p.materialCost},${p.total}\n`;
  });
  const blob = new Blob([csv],{type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href=url; a.download='projects_summary.csv'; a.click();
  URL.revokeObjectURL(url);
});

// Export single invoice
function exportInvoice(index){
  const p = projects[index];
  let csv = `Win Art Studio Invoice\n\nProject: ${p.name}\nType: ${p.type}\nMaterial Cost: ${p.materialCost.toFixed(2)}\nTotal Cost: ${p.total.toFixed(2)}\n\nThank you for your business!`;
  const blob = new Blob([csv],{type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href=url; a.download=`invoice_${p.name.replace(/\s/g,'_')}.csv`; a.click();
  URL.revokeObjectURL(url);
}
