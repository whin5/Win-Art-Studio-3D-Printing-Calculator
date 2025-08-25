function calculate() {
  const currency = document.getElementById("currency").value;
  const resinPrice = parseFloat(document.getElementById("resinPrice").value);
  const resinUsed = parseFloat(document.getElementById("resinUsed").value);
  const wastage = parseFloat(document.getElementById("wastage").value) / 100;
  const ipa = parseFloat(document.getElementById("ipa").value);
  const printTime = parseFloat(document.getElementById("printTime").value);
  const printerPower = parseFloat(document.getElementById("printerPower").value);
  const electricityRate = parseFloat(document.getElementById("electricityRate").value);
  const laborRate = parseFloat(document.getElementById("laborRate").value);
  const operatorHours = parseFloat(document.getElementById("operatorHours").value);
  const machineAmort = parseFloat(document.getElementById("machineAmort").value);
  const markup = parseFloat(document.getElementById("markup").value) / 100;

  // Costs
  const materialCost = ((resinUsed / 1000) * resinPrice) * (1 + wastage) + ipa;
  const electricityCost = (printerPower * printTime / 1000) * electricityRate;
  const laborCost = laborRate * operatorHours;
  const machineCost = machineAmort * printTime;

  const totalCost = materialCost + electricityCost + laborCost + machineCost;
  const finalPrice = totalCost * (1 + markup);
  const income = finalPrice - totalCost;

  // Display
  document.getElementById("materialCost").innerText = `Material Cost: ${currency}${materialCost.toFixed(2)}`;
  document.getElementById("electricityCost").innerText = `Electricity Cost: ${currency}${electricityCost.toFixed(2)}`;
  document.getElementById("laborCost").innerText = `Labor Cost: ${currency}${laborCost.toFixed(2)}`;
  document.getElementById("machineCost").innerText = `Machine Amortization: ${currency}${machineCost.toFixed(2)}`;
  document.getElementById("totalCost").innerText = `Total Cost: ${currency}${totalCost.toFixed(2)}`;
  document.getElementById("finalPrice").innerText = `Final Price (with Markup): ${currency}${finalPrice.toFixed(2)}`;
  document.getElementById("income").innerText = `Estimated Income: ${currency}${income.toFixed(2)}`;
}
