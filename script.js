// Tab switching
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".tab-panel");
tabs.forEach(tab => {
  tab.addEventListener("click", ()=>{
    tabs.forEach(t=>t.classList.remove("active"));
    tab.classList.add("active");
    panels.forEach(p=>p.style.display="none");
    document.getElementById("panel-" + tab.dataset.tab).style.display="block";
  });
});

// Logo upload preview
const logoInput = document.getElementById("logoInput");
const logoPreview = document.getElementById("logoPreview");
logoInput.addEventListener("change", ()=>{
  const file = logoInput.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = e => logoPreview.src = e.target.result;
    reader.readAsDataURL(file);
  }
});

// Storage & history
let projects = JSON.parse(localStorage.getItem("projects")||"[]");
const historyTable = document.querySelector("#historyTable tbody");

function addToHistory(project){
  projects.push(project);
  localStorage.setItem("projects", JSON.stringify(projects));
  renderHistory();
}

function renderHistory(){
  historyTable.innerHTML = "";
  projects.forEach((p,i)=>{
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.name}</td>
      <td>${p.type}</td>
      <td>${p.totalCost.toFixed(2)}</td>
      <td>${p.totalIncome.toFixed(2)}</td>
      <td><button onclick="exportInvoice(${i})">Export Invoice</button></td>
    `;
    historyTable.appendChild(row);
  });
}
renderHistory();

// Filament calc
document.getElementById("f-calc").addEventListener("click", ()=>{
  const name = document.getElementById("f-name").value;
  const currency = document.getElementById("f-currency").value;
  const priceKg = parseFloat(document.getElementById("f-priceKg").value);
  const grams = parseFloat(document.getElementById("f-grams").value);
  const time = parseFloat(document.getElementById("f-time").value);
  const watts = parseFloat(document.getElementById("f-watts").value);
  const kwh = parseFloat(document.getElementById("f-kwh").value);
  const labor = parseFloat(document.getElementById("f-laborRate").value);
  const machine = parseFloat(document.getElementById("f-machine").value);
  const markupPct = parseFloat(document.getElementById("f-markup").value);

  const materialCost = (grams/1000)*priceKg;
  const energyCost = (watts*time/1000)*kwh;
  const laborCost = labor*time; // simplified
  const machineCost = machine*time;
  const subtotal = materialCost + energyCost + laborCost + machineCost;
  const total = subtotal*(1+markupPct/100);

  document.getElementById("f-results").innerHTML = `
    <p>Total Cost: ${currency} ${total.toFixed(2)}</p>
  `;

  addToHistory({name,type:"Filament",totalCost:subtotal,totalIncome:total});
});

// Resin calc
document.getElementById("r-calc").addEventListener("click", ()=>{
  const name = document.getElementById("r-name").value;
  const currency = document.getElementById("r-currency").value;
  const price = parseFloat(document.getElementById("r-price").value);
  const ml = parseFloat(document.getElementById("r-ml").value);
  const time = parseFloat(document.getElementById("r-time").value);
  const watts = parseFloat(document.getElementById("r-watts").value);
  const kwh = parseFloat(document.getElementById("r-kwh").value);
  const labor = parseFloat(document.getElementById("r-laborRate").value);
  const machine = parseFloat(document.getElementById("r-machine").value);
  const markupPct = parseFloat(document.getElementById("r-markup").value);

  const materialCost = ml*price;
  const energyCost = (watts*time/1000)*kwh;
  const laborCost = labor*time;
  const machineCost = machine*time;
  const subtotal = materialCost + energyCost + laborCost + machineCost;
  const total = subtotal*(1+markupPct/100);

  document.getElementById("r-results").innerHTML = `
    <p>Total Cost: ${currency} ${total.toFixed(2)}</p>
  `;

  addToHistory({name,type:"Resin",totalCost:subtotal,totalIncome:total});
});

// Export history to Excel
document.getElementById("exportHistory").addEventListener("click", ()=>{
  let csv = "Project Name,Type,Total Cost,Total Income\n";
  projects.forEach(p=>{ csv+=`${p.name},${p.type},${p.totalCost},${p.totalIncome}\n`; });
  const blob = new Blob([csv], {type:"text/csv"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "project_history.csv";
  a.click();
});

// Export single invoice
function exportInvoice(idx){
  const p = projects[idx];
  let csv = `Win Art Studio Invoice\nProject Name,${p.name}\nType,${p.type}\nTotal Cost,${p.totalCost}\nTotal Income,${p.totalIncome}\n`;
  const blob = new Blob([csv], {type:"text/csv"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${p.name}_invoice.csv`;
  a.click();
}
