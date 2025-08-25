let projects = [];
let totalIncome = 0;

// Tab switching
document.querySelectorAll(".tab-button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(tc => tc.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// Logo upload
document.getElementById("logoUpload").addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      document.getElementById("logoPreview").src = evt.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Resin form
document.getElementById("resinForm").addEventListener("submit", function(e) {
  e.preventDefault();
  saveProject("Resin", {
    name: document.getElementById("resinName").value,
    used: parseFloat(document.getElementById("resinUsed").value),
    price: parseFloat(document.getElementById("resinPrice").value),
    time: parseFloat(document.getElementById("resinTime").value) || 0,
    power: parseFloat(document.getElementById("resinPower").value) || 0,
    rate: parseFloat(document.getElementById("resinRate").value) || 0,
    labor: parseFloat(document.getElementById("resinLabor").value) || 0,
    machine: parseFloat(document.getElementById("resinMachine").value) || 0,
    markup: parseFloat(document.getElementById("resinMarkup").value) || 0,
  });
});

// Filament form
document.getElementById("filamentForm").addEventListener("submit", function(e) {
  e.preventDefault();
  saveProject("Filament", {
    name: document.getElementById("filamentName").value,
    used: parseFloat(document.getElementById("filamentUsed").value),
    price: parseFloat(document.getElementById("filamentPrice").value),
    time: parseFloat(document.getElementById("filamentTime").value) || 0,
    power: parseFloat(document.getElementById("filamentPower").value) || 0,
    rate: parseFloat(document.getElementById("filamentRate").value) || 0,
    labor: parseFloat(document.getElementById("filamentLabor").value) || 0,
    machine: parseFloat(document.getElementById("filamentMachine").value) || 0,
    markup: parseFloat(document.getElementById("filamentMarkup").value) || 0,
  });
});

// Save project and update history
function saveProject(type, data) {
  const materialCost = data.used * data.price;
  const electricity = (data.power * data.time / 1000) * data.rate;
  const laborCost = data.time * data.labor;
  const totalCost = materialCost + electricity + laborCost + data.machine;
  const income = totalCost * (1 + data.markup / 100);

  const project = { name: data.name, type, totalCost, income };
  projects.push(project);

  totalIncome += income;

  updateHistory();
}

// Update history table
function updateHistory() {
  const tbody = document.querySelector("#historyTable tbody");
  tbody.innerHTML = "";
  projects.forEach((p, index) => {
    const row = `<tr>
      <td>${p.name}</td>
      <td>${p.type}</td>
      <td>₱${p.totalCost.toFixed(2)}</td>
      <td>₱${p.income.toFixed(2)}</td>
      <td><button onclick="exportInvoice(${index})">Export Invoice</button></td>
    </tr>`;
    tbody.insertAdjacentHTML("beforeend", row);
  });
  document.getElementById("totalIncome").textContent = "₱" + totalIncome.toFixed(2);
}

// Export all projects
document.getElementById("exportAll").addEventListener("click", () => {
  let csv = "Project Name,Type,Total Cost,Income\n";
  projects.forEach(p => {
    csv += `${p.name},${p.type},${p.totalCost},${p.income}\n`;
  });
  downloadCSV(csv, "Project_History.csv");
});

// Export single invoice
function exportInvoice(index) {
  const p = projects[index];
  let csv = "Invoice\n";
  csv += `Project,${p.name}\nType,${p.type}\nTotal Cost,${p.totalCost}\nIncome,${p.income}\n`;
  downloadCSV(csv, `${p.name}_Invoice.csv`);
}

// CSV download helper
function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
