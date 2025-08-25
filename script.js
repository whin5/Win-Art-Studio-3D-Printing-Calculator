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

  projects.push({name,type:'Filament',totalCost:subtotal,totalIncome:total});
  localStorage.setItem('projects',JSON.stringify(projects));
  updateHistory();
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

  projects.push({name,type:'Resin',totalCost:subtotal,totalIncome:total});
  localStorage.setItem('projects',JSON.stringify(projects));
  updateHistory();
});

// Update history table
function updateHistory(){
  const
