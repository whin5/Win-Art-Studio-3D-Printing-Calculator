// Tab switching
document.querySelectorAll(".tab-button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));

    button.classList.add("active");
    document.getElementById(button.dataset.tab).classList.add("active");
  });
});

// Resin calculation
function calculateResin() {
  const currency = document.getElementById("resinCurrency").value;
  const resinPrice = parseFloat(document.getElementById("resinPrice").value);
  const resinUsed = parseFloat(document.getElementById("resinUsed").value);
  const printTime = parseFloat(document.getElementById("resinPrintTime").value);
  const powerDraw = parseFloat(document.getElementById("resinPowerDraw").value);
  const electricityRate = parseFloat(document.getElementById("resinElectricity").value);
  const laborRate = parseFloat(document.getElementById("resinLabor").value);
  const operatorHours = parseFloat(document.getElementById("resinOperatorHours").value);
  const machinePrice = parseFloat(document.getElementById("resinMachinePrice").value);
  const amortizationYears = parseFloat(document.getElementById("resinAmortization").value);
  const markup = parseFloat(document.getElementById("resinMarkup").value);

  const materialCost = (resinUsed / 1000) * resinPrice;
  const electricityCost = (powerDraw * printTime / 1000) * electricityRate;
  const laborCost = laborRate * operatorHours;
  const machineHourly = machinePrice / (amortizationYears * 365 * 24);
  const machineCost = machineHourly * printTime;

  const baseCost = materialCost + electricityCost + laborCost + machineCost;
  const finalCost = baseCost * (1 + markup / 100);

  document.getElementById("resinResult").innerHTML = `
    <strong>Total Cost:</strong> ${currency}${finalCost.toFixed(2)}<br>
    (Material: ${currency}${materialCost.toFixed(2)}, Electricity: ${currency}${electricityCost.toFixed(2)}, Labor: ${currency}${laborCost.toFixed(2)}, Machine: ${currency}${machineCost.toFixed(2)})
  `;
}

// Filament calculation
function calculateFilament() {
  const currency = document.getElementById("filamentCurrency").value;
  const filamentPrice = parseFloat(document.getElementById("filamentPrice").value);
  const filamentUsed = parseFloat(document.getElementById("filamentUsed").value);
  const printTime = parseFloat(document.getElementById("filamentPrintTime").value);
  const powerDraw = parseFloat(document.getElementById("filamentPowerDraw").value);
  const electricityRate = parseFloat(document.getElementById("filamentElectricity").value);
  const laborRate = parseFloat(document.getElementById("filamentLabor").value);
  const operatorHours = parseFloat(document.getElementById("filamentOperatorHours").value);
  const machinePrice = parseFloat(document.getElementById("filamentMachinePrice").value);
  const amortizationYears = parseFloat(document.getElementById("filamentAmortization").value);
  const markup = parseFloat(document.getElementById("filamentMarkup").value);

  const materialCost = (filamentUsed / 1000) * filamentPrice;
  const electricityCost = (powerDraw * printTime / 1000) * electricityRate;
  const laborCost = laborRate * operatorHours;
  const machineHourly = machinePrice / (amortizationYears * 365 * 24);
  const machineCost = machineHourly * printTime;

  const baseCost = materialCost + electricityCost + laborCost + machineCost;
  const finalCost = baseCost * (1 + markup / 100);

  document.getElementById("filamentResult").innerHTML = `
    <strong>Total Cost:</strong> ${currency}${finalCost.toFixed(2)}<br>
    (Material: ${currency}${materialCost.toFixed(2)}, Electricity: ${currency}${electricityCost.toFixed(2)}, Labor: ${currency}${laborCost.toFixed(2)}, Machine: ${currency}${machineCost.toFixed(2)})
  `;
}
