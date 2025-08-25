// Tab switching
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// Resin calculator
function calculateResin() {
  let name = document.getElementById("resinProjectName").value;
  let currency = document.getElementById("resinCurrency").value;
  let price = parseFloat(document.getElementById("resinPrice").value);
  let used = parseFloat(document.getElementById("resinUsed").value);
  let time = parseFloat(document.getElementById("resinTime").value);
  let power = parseFloat(document.getElementById("resinPower").value);
  let elec = parseFloat(document.getElementById("resinElec").value);
  let labor = parseFloat(document.getElementById("resinLabor").value);
  let amort = parseFloat(document.getElementById("resinAmort").value);
  let machine = parseFloat(document.getElementById("resinMachine").value);
  let markup = parseFloat(document.getElementById("resinMarkup").value);

  let materialCost = price * used;
  let elecCost = (power / 1000) * time * elec;
  let laborCost = time * labor;
  let amortCost = amort > 0 ? (machine / (amort * 30 * 24)) * time : 0;
  let total = materialCost + elecCost + laborCost + amortCost;
  let finalPrice = total * (1 + markup / 100);

  document.getElementById("resinResult").innerHTML = `
    <h3>${name}</h3>
    Material Cost: ${currency}${materialCost.toFixed(2)}<br>
    Electricity Cost: ${currency}${elecCost.toFixed(2)}<br>
    Labor Cost: ${currency}${laborCost.toFixed(2)}<br>
    Machine Amortization: ${currency}${amortCost.toFixed(2)}<br>
    <strong>Total Price: ${currency}${finalPrice.toFixed(2)}</strong>
  `;
}

// Filament calculator
function calculateFilament() {
  let name = document.getElementById("filamentProjectName").value;
  let currency = document.getElementById("filamentCurrency").value;
  let price = parseFloat(document.getElementById("filamentPrice").value);
  let used = parseFloat(document.getElementById("filamentUsed").value);
  let time = parseFloat(document.getElementById("filamentTime").value);
  let power = parseFloat(document.getElementById("filamentPower").value);
  let elec = parseFloat(document.getElementById("filamentElec").value);
  let labor = parseFloat(document.getElementById("filamentLabor").value);
  let amort = parseFloat(document.getElementById("filamentAmort").value);
  let machine = parseFloat(document.getElementById("filamentMachine").value);
  let markup = parseFloat(document.getElementById("filamentMarkup").value);

  let materialCost = price * used;
  let elecCost = (power / 1000) * time * elec;
  let laborCost = time * labor;
  let amortCost = amort > 0 ? (machine / (amort * 30 * 24)) * time : 0;
  let total = materialCost + elecCost + laborCost + amortCost;
  let finalPrice = total * (1 + markup / 100);

  document.getElementById("filamentResult").innerHTML = `
    <h3>${name}</h3>
    Material Cost: ${currency}${materialCost.toFixed(2)}<br>
    Electricity Cost: ${currency}${elecCost.toFixed(2)}<br>
    Labor Cost: ${currency}${laborCost.toFixed(2)}<br>
    Machine Amortization: ${currency}${amortCost.toFixed(2)}<br>
    <strong>Total Price: ${currency}${finalPrice.toFixed(2)}</strong>
  `;
}
