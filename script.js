// Tab Switching
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(tab.dataset.target).classList.add("active");
  });
});

// Project History
let projectHistory = [];
let totalIncome = 0;

function saveProject(type) {
  const form = document.querySelector(`#${type}-form`);
  const data = Object.fromEntries(new FormData(form).entries());

  const materialCost = parseFloat(data.materialPrice) * parseFloat(data.usedMaterial);
  const electricityCost = (parseFloat(data.printTime) * parseFloat(data.powerDraw) * parseFloat(data.electricityRate)) / 1000;
  const laborCost = parseFloat(data.laborRate) * (parseFloat(data.printTime) / 60);
  const amortizationCost = parseFloat(data.machinePrice) / parseFloat(data.machineAmortization);
  
  const baseCost = materialCost + electricityCost + laborCost + amortizationCost;
  const finalCost = baseCost * (1 + parseFloat(data.markup) / 100);

  const project = {
    name: data.projectName,
    type,
    currency: data.currency,
    total: finalCost.toFixed(2)
  };

  projectHistory.push(project);
  totalIncome += finalCost;

  renderHistory();
}

function renderHistory() {
  const tbody = document.querySelector("#history-body");
  tbody.innerHTML = "";
  projectHistory.forEach((proj, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${i+1}</td>
        <td>${proj.name}</td>
        <td>${proj.type}</td>
        <td>${proj.currency} ${proj.total}</td>
      </tr>
    `;
  });
  document.querySelector("#total-income").innerText = `Total Income: ${projectHistory[0]?.currency || ''} ${totalIncome.toFixed(2)}`;
}

// Export History (Summary) to Excel
function exportHistory() {
  let csv = "No,Project,Type,Total\n";
  projectHistory.forEach((proj, i) => {
    csv += `${i+1},${proj.name},${proj.type},${proj.currency} ${proj.total}\n`;
  });
  downloadCSV(csv, "project-history.csv");
}

// Export Invoice (Single Client Project)
function exportInvoice() {
  if (projectHistory.length === 0) {
    alert("No projects to export!");
    return;
  }
  const last = projectHistory[projectHistory.length - 1];
  let csv = `Invoice\nProject,${last.name}\nType,${last.type}\nTotal,${last.currency} ${last.total}\n`;
  downloadCSV(csv, `${last.name}-invoice.csv`);
}

// Helper
function downloadCSV(content, filename) {
  const blob = new Blob([content], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}
