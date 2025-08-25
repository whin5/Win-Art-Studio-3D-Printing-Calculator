function calculateCost() {
  const currency = document.getElementById("currency").value || "₱";

  const resinPrice = parseFloat(document.getElementById("resinPrice").value) || 0;
  const resinUsed = parseFloat(document.getElementById("resinUsed").value) || 0;
  const wastage = parseFloat(document.getElementById("wastage").value) || 0;

  const ipa = parseFloat(document.getElementById("ipa").value) || 0;
  const printTime = parseFloat(document.getElementById("printTime").value) || 0;
  const power = parseFloat(document.getElementById("power").value) || 0;
  const rate = parseFloat(document.getElementById("rate").value) || 0;

  const laborRate = parseFloat(document.getElementById("laborRate").value) || 0;
  const laborHours = parseFloat(document.getElementById("laborHours").value) || 0;
  const amortization = parseFloat(document.getElementById("amortization").value) || 0;
  const markup = parseFloat(document.getElementById("markup").value) || 0;

  // Material cost
  const resinCost = (resinPrice / 1000) * resinUsed;
  const wastageCost = resinCost * (wastage / 100);
  const materialCost = resinCost + wastageCost + ipa;

  // Electricity
  const electricityCost = ((power * printTime) / 1000) * rate;

  // Labor
  const laborCost = laborRate * laborHours;

  // Total
  const totalCost = materialCost + electricityCost + laborCost + amortization;

  // Final price
  const finalPrice = totalCost * (1 + markup / 100);

  document.getElementById("materialCost").innerText = currency + materialCost.toFixed(2);
  document.getElementById("electricityCost").innerText = currency + electricityCost.toFixed(2);
  document.getElementById("laborCost").innerText = currency + laborCost.toFixed(2);
  document.getElementById("totalCost").innerText = currency + totalCost.toFixed(2);
  document.getElementById("finalPrice").innerText = currency + finalPrice.toFixed(2);
}
