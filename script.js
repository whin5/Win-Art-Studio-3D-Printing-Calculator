let projectHistory = [];

function openTab(evt, tabId) {
  let tabcontent = document.querySelectorAll(".tabcontent");
  tabcontent.forEach(tc => tc.style.display = "none");

  let tablinks = document.querySelectorAll(".tablink");
  tablinks.forEach(btn => btn.classList.remove("active"));

  document.getElementById(tabId).style.display = "block";
  evt.currentTarget.classList.add("active");
}

function calculateProject(type) {
  const formId = type === "resin" ? "resinForm" : "filamentForm";
  const form = document.getElementById(formId);

  const name = form.querySelector(`#${type}Name`).value;
  const currency = form.querySelector(`#${type}Currency`).value;
  const materialPrice = parseFloat(form.querySelector(`#${type}MaterialPrice`).value) || 0;
  const used = parseFloat(form.querySelector(`#${type}Used`).value) || 0;
  const time = parseFloat(form.querySelector(`#${type}Time`).value) || 0;
  const power = parseFloat(form.querySelector(`#${type}Power`).value) || 0;
  const electricity = parseFloat(form.querySelector(`#${type}Electricity`).value) || 0;
  const labor = parseFloat(form.querySelector(`#${type}Labor`).value) || 0;
  const amort = parseFloat(form.querySelector(`#${type}Amort`).value) || 0;
  const machine = parseFloat(form.querySelector(`#${type}Machine`).value) || 0;
  const markup = parseFloat(form.querySelector(`#${type}Markup`).value) || 0;

  const materialCost = materialPrice * used;
  const electricityCost = (power * time / 1000) * electricity;
  const laborCost = labor * time;
  const amortCost = amort * time;
  const baseCost = materialCost + electricityCost + laborCost + amortCost;
  const income = baseCost + (baseCost * markup / 100);

  const project = { name, type, totalCost: baseCost, income, currency };
  projectHistory.push(project);
  updateHistory();
}

function updateHistory() {
  const tbody = document.querySelector("#historyTable tbody");
  tbody.innerHTML = "";
  projectHistory.forEach((p, i) => {
    const row = `<tr>
      <td>${p.name}</td>
      <td>${p.type}</td>
      <td>${p.currency}${p.totalCost.toFixed(2)}</td>
      <td>${p.currency}${p.income.toFixed(2)}</td>
      <td><button onclick="exportInvoice(${i})">Export Invoice</button></td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

function exportAllHistory() {
  const data = projectHistory.map(p => ({
    Project: p.name,
    Type: p.type,
    Cost: p.totalCost,
    Income: p.income
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Summary");
  XLSX.writeFile(wb, "All_Project_History.xlsx");
}

function exportInvoice(index) {
  const p = projectHistory[index];
  const data = [
    { Field: "Project Name", Value: p.name },
    { Field: "Type", Value: p.type },
    { Field: "Total Cost", Value: p.currency + p.totalCost.toFixed(2) },
    { Field: "Income", Value: p.currency + p.income.toFixed(2) }
  ];
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Invoice");
  XLSX.writeFile(wb, `${p.name}_Invoice.xlsx`);
}

// Logo upload
document.getElementById("logoUpload").addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(event) {
    const img = document.getElementById("logoPreview");
    img.src = event.target.result;
    img.style.display = "block";
  };
  reader.readAsDataURL(file);
});
