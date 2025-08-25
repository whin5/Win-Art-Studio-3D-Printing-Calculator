const $ = s=>document.querySelector(s);
const $$ = s=>document.querySelectorAll(s);

const currencies = [{code:'PHP',symbol:'₱'},{code:'USD',symbol:'$'},{code:'EUR',symbol:'€'}];
function populateCurrencies(sel){
  sel.innerHTML='';
  currencies.forEach(c=>{
    const opt=document.createElement('option'); opt.value=c.code; opt.textContent=c.code+' ('+c.symbol+')';
    sel.appendChild(opt);
  });
}
populateCurrencies($('#f-currency')); populateCurrencies($('#r-currency'));

$$('.tab').forEach(tab=>tab.addEventListener('click', ()=>{
  const t=tab.dataset.tab;
  $$('.tab').forEach(t=>t.classList.remove('active'));
  tab.classList.add('active');
  $$('.tab-panel').forEach(p=>p.style.display=p.id==='panel-'+t?'block':'none');
}));

function saveProject(type,data){
  const projects=JSON.parse(localStorage.getItem('projects')||'[]');
  data.type=type;
  data.total=data.subtotal+data.markup;
  projects.push(data);
  localStorage.setItem('projects',JSON.stringify(projects));
  renderHistory();
}

function renderHistory(){
  const projects=JSON.parse(localStorage.getItem('projects')||'[]');
  const tbody=$('#history-table tbody');
  tbody.innerHTML='';
  let totalIncome=0;
  projects.forEach(p=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${p.name}</td><td>${p.type}</td><td>${p.total.toFixed(2)}</td><td>${p.total.toFixed(2)}</td>`;
    tbody.appendChild(tr);
    totalIncome+=p.total;
  });
  $('#total-income').textContent=totalIncome.toFixed(2);
}
renderHistory();

function calc(type){
  if(type==='filament'){
    const name=$('#f-name').value;
    const price=+$('#f-priceKg').value;
    const grams=+$('#f-grams').value;
    const hours=+$('#f-time').value;
    const kwh=+$('#f-kwh').value;
    const labor=+$('#f-laborRate').value;
    const machine=+$('#f-machine').value;
    const misc=+$('#f-consumables').value;
    const markupPct=+$('#f-markup').value;

    const material=grams/1000*price;
    const electricity=hours*kwh*0.12; // simplified
    const laborCost=labor*hours+machine*hours;
    const subtotal=material+electricity+laborCost+misc;
    const markup=subtotal*markupPct/100;
    const total=subtotal+markup;

    $('#f-results').innerHTML=`<p>Total: ${total.toFixed(2)}</p>`;
    saveProject('Filament',{name,subtotal,markup,total});
  }else{
    const name=$('#r-name').value;
    const price=+$('#r-priceL').value;
    const ml=+$('#r-ml').value;
    const hours=+$('#r-time').value;
    const kwh=+$('#r-kwh').value;
    const labor=+$('#r-laborRate').value;
    const machine=+$('#r-machine').value;
    const misc=+$('#r-consumables').value;
    const markupPct=+$('#r-markup').value;

    const material=(ml/1000)*price;
    const electricity=hours*kwh*0.12;
    const laborCost=labor*hours+machine*hours;
    const subtotal=material+electricity+laborCost+misc;
    const markup=subtotal*markupPct/100;
    const total=subtotal+markup;

    $('#r-results').innerHTML=`<p>Total: ${total.toFixed(2)}</p>`;
    saveProject('Resin',{name,subtotal,markup,total});
  }
}

$('#f-calc').addEventListener('click',()=>calc('filament'));
$('#r-calc').addEventListener('click',()=>calc('resin'));
$('#f-clear').addEventListener('click',()=>$('#f-results').innerHTML='');
$('#r-clear').addEventListener('click',()=>$('#r-results').innerHTML='');

// Logo upload preview
$('#logo-upload').addEventListener('change',e=>{
  const file=e.target.files
