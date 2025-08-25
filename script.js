function calculateCost() {
  const currency = document.getElementById("currency").value;
  const projectName = document.getElementById("projectName").value;
  const materialPrice = parseFloat(document.getElementById("materialPrice").value) || 0;
  const materialUsed = parseFloat(document.getElementById("materialUsed").value) || 0;
  const printTime = parseFloat(document.getElementById("printTime").value) || 0;
  const powerDraw = parseFloat(document.getElementById("powerDraw").value) || 0;
  const electricityRate = parseFloat(document.getElementById("electricityRate").value) || 0;
  const laborRate = parseFloat(document.getElementById("laborRate").value) || 0;
  const laborHours = parseFloat(document.getElementById("laborHours").value) || 0;
  const machinePrice = parseFloat(document.getElementById("machinePrice").value) || 0;
  const amortYears = parseFloat(document.getElementById("amortYears").value) || 0;
  const markup = parseFloat(document.getElementById("markup").value) || 0;

  // Material cost
  let materialCost = (materialPrice / 1000) * materialUsed;

  // Electricity cost
  let electricityCost = ((powerDraw * printTime) / 1000) * electricityRate;

  // Labor cost
  let laborCost = laborRate * laborHours;

  // Machine amortization per hour
  let totalHours = amortYears * 365 * 24;
  let amortCost = machinePrice / totalHours * printTime;

  // Total before markup
  let baseCost = materialCost + electricityCost + laborCost + amortCost;

  // Final cost with markup
  let finalCost = baseCost * (1 + markup / 100);

  document.getElementById("result").innerHTML = `
    <h3>Project: ${projectName}</h3>
    <p>Material Cost: ${currency} ${materialCost.toFixed(2)}</p>
    <p>Electricity Cost: ${currency} ${electricityCost.toFixed(2)}</p>
    <p>Labor Cost: ${currency} ${laborCost.toFixed(2)}</p>
    <p>Machine Amortization: ${currency} ${amortCost.toFixed(2)}</p>
    <hr>
    <p><strong>Total (Before Markup):</strong> ${currency} ${baseCost.toFixed(2)}</p>
    <p><strong>Final Price (With Markup):</strong> ${currency} ${finalCost.toFixed(2)}</p>
  `;
}
