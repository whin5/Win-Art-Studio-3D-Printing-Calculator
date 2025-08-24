document.getElementById("calcForm").addEventListener("submit", function(e) {
  e.preventDefault();
  
  const material = document.getElementById("material").value;
  const weight = parseFloat(document.getElementById("weight").value);
  const price = parseFloat(document.getElementById("price").value);
  const labor = parseFloat(document.getElementById("labor").value);
  const overhead = parseFloat(document.getElementById("overhead").value);

  if (isNaN(weight) || isNaN(price) || isNaN(labor) || isNaN(overhead)) {
    alert("Please fill in all fields correctly.");
    return;
  }

  const materialCost = weight * price;
  const total = materialCost + labor + overhead;

  document.getElementById("total").textContent = total.toFixed(2);

  // Save to history
  const history = document.getElementById("history");
  const li = document.createElement("li");
  li.textContent = `${material.toUpperCase()} - Weight: ${weight}, Cost: ₱${total.toFixed(2)}`;
  history.appendChild(li);
});