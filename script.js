// Tab Switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
    document.getElementById(tab).style.display = 'block';
  });
});

// Logo Upload Preview
document.getElementById('logoInput').addEventListener('change', function() {
  const file = this.files[0];
  if(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.getElementById('logoPreview');
      img.src = e.target.result;
      img.style.display = 'block';
    }
    reader.readAsDataURL(file);
  }
});

// Local Storage & History
let historyData = JSON.parse(localStorage.getItem('projects')) || [];

function updateHistory() {
  const tbody = document.querySelector('#historyTable tbody');
  tbody.innerHTML = '';
  let totalIncome = 0;
  historyData.forEach((p, i) => {
    totalIncome += p.totalIncome;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p.name}</td>
                    <td>${p.type}</td>
                    <td>${p.totalCost.toFixed(2)}</td>
                    <td>${p.totalIncome.toFixed(2)}</td>
                    <td><button onclick="exportInvoice(${i})">Invoice</button></td>`;
    tbody.appendChild(tr);
  });
  document.getElementById('totalIncome').textContent =
