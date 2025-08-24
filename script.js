function calculateCost() {
  const material = document.getElementById("material").value;
  const materialCost = parseFloat(document.getElementById("materialCost").value);
  const materialUsed = parseFloat(document.getElementById("materialUsed").value);
  const printTime = parseFloat(document.getElementById("printTime").value);
  const electricityCost = parseFloat(document.getElementById("electricityCost").value);
  const printerPower = parseFloat(document.getElementById("printerPower").value);
  const laborCost = parseFloat(document.getElementById("laborCost").value);
  const profitMargin = parseFloat(document.getElementById("profitMargin").value);

  let materialUnitCost = 0;

  if (material === "filament") {
    // grams to kg
    materialUnitCost = (materialUsed / 1000) * materialCost;
  } else {
    // ml to L
    materialUnitCost = (materialUsed / 1000) * materialCost;
  }

  const electricityUsed = (printerPower / 1000) * printTime;
  const electricityTotal = electricityUsed * electricityCost;

  const totalCost = materialUnitCost + electricityTotal + laborCost;
  const finalPrice = totalCost * (1 + profitMargin / 100);
  const income = finalPrice - totalCost;

  document.getElementById("materialCostResult").innerText = "Material Cost: ₱" + materialUnitCost.toFixed(2);
  document.getElementById("electricityCostResult").innerText = "Electricity Cost: ₱" + electricityTotal.toFixed(2);
  document.getElementById("laborCostResult").innerText = "Labor/Overhead Cost: ₱" + laborCost.toFixed(2);
  document.getElementById("totalCostResult").innerText = "Total Production Cost: ₱" + totalCost.toFixed(2);
  document.getElementById("finalPriceResult").innerText = "Suggested Price (with Profit): ₱" + finalPrice.toFixed(2);
  document.getElementById("incomeResult").innerText = "Expected Income: ₱" + income.toFixed(2);
}
