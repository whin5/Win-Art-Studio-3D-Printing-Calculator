// Tab Switching
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll(".tab-panel").forEach(p=>p.style.display="none");
    document.getElementById(btn.dataset.tab).style.display="block";
    renderHistory();
  });
});

// Logo Upload Preview
document.getElementById("logoInput").addEventListener("change", e=>{
  const file = e.target.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = function(e){
      const img = document.getElementById("logoPreview");
      img.src = e.target.result;
      img.style.display = "inline-block";
    }
    reader.readAsDataURL(file);
  }
});

// History
let projects = JSON.parse(localStorage.getItem("projects")) || [];

function addToHistory(project){
  projects.push(project);
  localStorage.setItem("projects", JSON.stringify(projects));
  renderHistory();
}

function renderHistory(){
  const tbody = document.querySelector("#historyTable tbody");
  tbody.innerHTML = "";
  projects.forEach(p=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${p.name}</td><td>${p.type}</td><td>${p.totalCost.toFixed(2)}</td><td>${p.totalIncome.toFixed(2)}</td>`;
    tbody.appendChild(tr);
  });
}

// Export History
document.getElementById("exportHistory").addEventListener("click", ()=>{
  let csv = "Project Name,Type,Total Cost,Total Income\n";
  projects.forEach(p=>{
    csv += `${p.name},${p.type},${p.totalCost.toFixed(2)},${p.totalIncome.toFixed(2)}\n`;
  });
  const blob = new Blob([csv], {type:"text/csv"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "projects_history.csv";
  a.click();
});

// Resin Calculation
document.getElementById("r-calc").addEventListener("click", ()=>{
  const name = document.getElementById("r-name").value;
  const currency = document.getElementById("r-currency").value;
  const bottlePrice = parseFloat(document.getElementById("r-bottlePrice").value);
  const bottleVolume = parseFloat(document.getElementById("r-bottleVolume").value);
  const mlUsed = parseFloat(document.getElementById("r-ml").value);
  const time = parseFloat(document.getElementById("r-time").value);
  const watts = parseFloat(document.getElementById("r-watts").value);
  const kwh = parseFloat(document.getElementById("r-kwh").value);
  const labor = parseFloat(document.getElementById("r-laborRate").value);
  const machine = parseFloat(document.getElementById("r-machine").value);
  const markupPct = parseFloat(document.getElementById("r-markup").value);

  const materialCost = (bottlePrice/bottleVolume)*mlUsed;
  const energyCost = (watts*time/1000)*kwh;
  const laborCost = labor*time;
  const machineCost = machine*time;
  const subtotal = materialCost+energyCost+laborCost+machineCost;
  const total = subtotal*(1+markupPct/100);

  document.getElementById("r-results").innerHTML = `
    <p>Total Cost: ${currency} ${total.toFixed(2)}</p>
    <button class="btn" id="r-exportInvoice">Export Invoice</button>
  `;

  addToHistory({name,type:"Resin",totalCost:subtotal,totalIncome:total});

  document.getElementById("r-exportInvoice").addEventListener("click", ()=>{
    let csv = `Win Art Studio Invoice\n`;
    csv += `Project Name,${name}\nType,Resin\n`;
    csv += `Material Used (ml),${mlUsed}\nBottle Price,${bottlePrice}\n`;
    csv += `Total Cost,${subtotal.toFixed(2)}\nTotal Income,${total.toFixed(2)}\n`;
    const blob = new Blob([csv], {type:"text/csv"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${name}_invoice.csv`;
    a.click();
  });
});

// Filament Calculation
document.getElementById("f-calc").addEventListener("click", ()=>{
  const name = docu
