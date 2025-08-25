// Win Art Studio - Calculator + History + Invoice Export
// Data stored in localStorage key 'winart.projects'

/* ---------- Utilities ---------- */
const $ = (sel) => document.querySelector(sel);
const $all = (sel) => Array.from(document.querySelectorAll(sel));

function loadProjects() {
  try {
    return JSON.parse(localStorage.getItem('winart.projects') || '[]');
  } catch (e) {
    return [];
  }
}
function saveProjects(arr) {
  localStorage.setItem('winart.projects', JSON.stringify(arr));
}

/* ---------- Tab switching ---------- */
$all('.tab-btn').forEach(btn => {
  btn.addEventListener('click', (ev) => {
    $all('.tab-btn').forEach(b => b.classList.remove('active'));
    $all('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const id = btn.dataset.tab;
    document.getElementById(id).classList.add('active');
  });
});

/* ---------- Calculation & Save ---------- */
function calculateAndSaveResin() {
  // read inputs
  const name = $('#r-name').value || 'Untitled';
  const currency = $('#r-currency').value || '₱';
  const priceL = parseFloat($('#r-priceL').value) || 0;       // per liter
  const usedMl = parseFloat($('#r-ml').value) || 0;          // ml
  const wastePct = parseFloat($('#r-waste').value) || 0;
  const consumables = parseFloat($('#r-consumables').value) || 0;
  const time = parseFloat($('#r-time').value) || 0;          // hours
  const watts = parseFloat($('#r-watts').value) || 0;
  const kwh = parseFloat($('#r-kwh').value) || 0;
  const laborRate = parseFloat($('#r-laborRate').value) || 0;
  const laborHours = parseFloat($('#r-laborHours').value) || 0;
  const machinePrice = parseFloat($('#r-machinePrice').value) || 0;
  const amortYears = parseFloat($('#r-amortYears').value) || 1;
  const markup = parseFloat($('#r-markup').value) || 0;

  // calculations
  const usedMlWithWaste = usedMl * (1 + wastePct/100);
  const materialCost = (priceL / 1000) * usedMlWithWaste; // priceL per liter -> per ml multiply
  const energyCost = (watts * time / 1000) * kwh;
  const laborCost = laborRate * laborHours;
  const amortHourly = machinePrice / (amortYears * 365 * 24);
  const machineCost = amortHourly * time;
  const subtotal = materialCost + energyCost + laborCost + consumables + machineCost;
  const finalPrice = subtotal * (1 + markup/100);
  const income = finalPrice - subtotal;

  // display
  $('#r-result').innerHTML = `
    <div><strong>${name}</strong> — <span class="hint">Resin</span></div>
    <div>Material: ${currency}${materialCost.toFixed(2)} &nbsp; Electricity: ${currency}${energyCost.toFixed(2)} &nbsp; Labor: ${currency}${laborCost.toFixed(2)}</div>
    <div>Consumables: ${currency}${consumables.toFixed(2)} &nbsp; Machine amort.: ${currency}${machineCost.toFixed(2)}</div>
    <div class="hint" style="margin-top:8px;"><strong>Subtotal:</strong> ${currency}${subtotal.toFixed(2)} — <strong>Final (with markup):</strong> ${currency}${finalPrice.toFixed(2)}</div>
  `;

  // save to history
  const entry = {
    id: Date.now(),
    date: new Date().toLocaleString(),
    name,
    type: 'Resin',
    currency,
    inputs: {
      priceL, usedMl, wastePct, consumables, time, watts, kwh, laborRate, laborHours, machinePrice, amortYears, markup
    },
    numbers: {
      materialCost, energyCost, laborCost, machineCost, subtotal, finalPrice, income, totalHours: time
    }
  };

  const projects = loadProjects();
  projects.push(entry);
  saveProjects(projects);
  renderHistory();
}

function calculateAndSaveFilament() {
  const name = $('#f-name').value || 'Untitled';
  const currency = $('#f-currency').value || '₱';
  const priceKg = parseFloat($('#f-priceKg').value) || 0;   // per kg
  const grams = parseFloat($('#f-grams').value) || 0;      // grams
  const wastePct = parseFloat($('#f-waste').value) || 0;
  const time = parseFloat($('#f-time').value) || 0;
  const watts = parseFloat($('#f-watts').value) || 0;
  const kwh = parseFloat($('#f-kwh').value) || 0;
  const laborRate = parseFloat($('#f-laborRate').value) || 0;
  const laborHours = parseFloat($('#f-laborHours').value) || 0;
  const consumables = parseFloat($('#f-consumables')?.value || 0); // optional
  const machinePrice = parseFloat($('#f-machinePrice').value) || 0;
  const amortYears = parseFloat($('#f-amortYears').value) || 1;
  const markup = parseFloat($('#f-markup').value) || 0;

  // calculations
  const gramsWithWaste = grams * (1 + wastePct/100);
  const materialCost = (priceKg) * (gramsWithWaste / 1000); // price per kg -> grams->kg
  const energyCost = (watts * time / 1000) * kwh;
  const laborCost = laborRate * laborHours;
  const amortHourly = machinePrice / (amortYears * 365 * 24);
  const machineCost = amortHourly * time;
  const subtotal = materialCost + energyCost + laborCost + consumables + machineCost;
  const finalPrice = subtotal * (1 + markup/100);
  const income = finalPrice - subtotal;

  // display
  $('#f-result').innerHTML = `
    <div><strong>${name}</strong> — <span class="hint">Filament (eSUN PLA+ option available)</span></div>
    <div>Material: ${currency}${materialCost.toFixed(2)} &nbsp; Electricity: ${currency}${energyCost.toFixed(2)} &nbsp; Labor: ${currency}${laborCost.toFixed(2)}</div>
    <div>Consumables: ${currency}${consumables.toFixed(2)} &nbsp; Machine amort.: ${currency}${machineCost.toFixed(2)}</div>
    <div class="hint" style="margin-top:8px;"><strong>Subtotal:</strong> ${currency}${subtotal.toFixed(2)} — <strong>Final (with markup):</strong> ${currency}${finalPrice.toFixed(2)}</div>
  `;

  const entry = {
    id: Date.now(),
    date: new Date().toLocaleString(),
    name,
    type: 'Filament',
    currency,
    inputs: {
      priceKg, grams, wastePct, time, watts, kwh, laborRate, laborHours, consumables, machinePrice, amortYears, markup
    },
    numbers: {
      materialCost, energyCost, laborCost, machineCost, subtotal, finalPrice, income, totalHours: time
    }
  };

  const projects = loadProjects();
  projects.push(entry);
  saveProjects(projects);
  renderHistory();
}

/* ---------- Clear buttons ---------- */
$('#r-clear').addEventListener('click', () => {
  $('#resinForm').reset();
  $('#r-result').innerHTML = '';
});
$('#f-clear').addEventListener('click', () => {
  $('#fForm').reset();
  $('#f-result').innerHTML = '';
});

/* ---------- Hook up calculate buttons ---------- */
$('#r-calc').addEventListener('click', calculateAndSaveResin);
$('#f-calc').addEventListener('click', calculateAndSaveFilament);

/* ---------- History rendering & KPIs ---------- */
function renderHistory() {
  const projects = loadProjects();
  const tbody = $('#historyTable tbody');
  tbody.innerHTML = '';
  let totalIncome = 0;
  let totalHours = 0;
  projects.forEach((p, idx) => {
    const tr = document.createElement('tr');
    const n = idx + 1;
    const date = p.date;
    const project = p.name;
    const type = p.type;
    const currency = p.currency || '₱';
    const totalCost = p.numbers.subtotal || 0;
    const finalPrice = p.numbers.finalPrice || 0;
    const income = p.numbers.income || 0;
    totalIncome += income;
    totalHours += (p.numbers.totalHours || 0);
    tr.innerHTML = `
      <td>${n}</td>
      <td>${date}</td>
      <td>${project}</td>
      <td>${type}</td>
      <td>${currency} ${totalCost.toFixed(2)}</td>
      <td>${currency} ${finalPrice.toFixed(2)}</td>
      <td>${currency} ${income.toFixed(2)}</td>
      <td>
        <button class="btn" onclick="exportInvoice(${p.id})">Invoice</button>
        <button class="btn" onclick="deleteProject(${p.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  $('#kpi-projects').innerText = projects.length;
  $('#kpi-hours').innerText = totalHours.toFixed(1);
  $('#kpi-income').innerText = (projects[0]?.currency || '₱') + ' ' + totalIncome.toFixed(2);
}

/* ---------- Delete project ---------- */
function deleteProject(id) {
  let arr = loadProjects().filter(p => p.id !== id);
  saveProjects(arr);
  renderHistory();
}

/* ---------- Export single project invoice (.xlsx) ---------- */
function exportInvoice(projectId) {
  const projects = loadProjects();
  const p = projects.find(x => x.id === projectId);
  if (!p) { alert('Project not found'); return; }

  // Build invoice sheet data
  const company = ['Win Art Studio'];
  const title = ['INVOICE'];
  const meta = [
    ['Invoice date', new Date().toLocaleDateString()],
    ['Project', p.name],
    ['Type', p.type]
  ];
  const headers = ['Item', 'Detail', 'Amount'];
  const rows = [];

  // breakdown items
  if (p.type === 'Resin') {
    const i = p.inputs;
    const n = p.numbers;
    rows.push(['Material (resin)', `${i.usedMl} ml @ ₱${i.priceL}/L => used with waste`, n.materialCost.toFixed(2)]);
    rows.push(['Electricity', `${i.watts} W × ${i.time} h`, n.energyCost.toFixed(2)]);
    rows.push(['Labor', `${i.laborRate}/hr × ${i.laborHours} hr`, n.laborCost.toFixed(2)]);
    rows.push(['Consumables', 'IPA / misc', (i.consumables || 0).toFixed(2)]);
    rows.push(['Machine amortization', `Amort ${i.amortYears} yrs`, n.machineCost.toFixed(2)]);
  } else {
    const i = p.inputs;
    const n = p.numbers;
    rows.push(['Material (filament)', `${i.grams} g @ ${i.priceKg}/kg`, n.materialCost.toFixed(2)]);
    rows.push(['Electricity', `${i.watts} W × ${i.time} h`, n.energyCost.toFixed(2)]);
    rows.push(['Labor', `${i.laborRate}/hr × ${i.laborHours} hr`, n.laborCost.toFixed(2)]);
    rows.push(['Consumables', 'misc', (i.consumables || 0).toFixed(2)]);
    rows.push(['Machine amortization', `Amort ${i.amortYears} yrs`, n.machineCost.toFixed(2)]);
  }

  rows.push(['', 'Subtotal', p.numbers.subtotal.toFixed(2)]);
  rows.push(['', `Markup`, (p.inputs.markup || 0).toFixed(2) + '%']);
  rows.push(['', 'Final Price', p.numbers.finalPrice.toFixed(2)]);
  rows.push(['', 'Income', p.numbers.income.toFixed(2)]);

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Sheet: Invoice (styled as simple table)
  const ws_data = [];
  ws_data.push(company);
  ws_data.push([]);
  ws_data.push(title);
  ws_data.push([]);
  ws_data.push(...meta);
  ws_data.push([]);
  ws_data.push(headers);
  rows.forEach(r => ws_data.push(r));
  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(wb, ws, 'Invoice');

  // Sheet: Raw data
  const raw = [
    ['id','date','name','type','currency','subtotal','finalPrice','income']
  ];
  raw.push([p.id, p.date, p.name, p.type, p.currency, p.numbers.subtotal.toFixed(2), p.numbers.finalPrice.toFixed(2), p.numbers.income.toFixed(2)]);
  const ws2 = XLSX.utils.aoa_to_sheet(raw);
  XLSX.utils.book_append_sheet(wb, ws2, 'Raw');

  // Write file
  const filename = `${p.name.replace(/[^a-z0-9_\- ]/gi,'')}_invoice.xlsx`;
  XLSX.writeFile(wb, filename);
}

/* ---------- Export all history (.xlsx) ---------- */
$('#exportAllBtn').addEventListener('click', () => {
  const projects = loadProjects();
  const wb = XLSX.utils.book_new();

  // Summary sheet
  const sumHeader = ['No','Date','Project','Type','Currency','Subtotal','FinalPrice','Income','Hours'];
  const sum = [sumHeader];
  let totalIncome = 0;
  let totalHours = 0;
  projects.forEach((p, i) => {
    sum.push([
      i+1,
      p.date,
      p.name,
      p.type,
      p.currency,
      p.numbers.subtotal.toFixed(2),
      p.numbers.finalPrice.toFixed(2),
      p.numbers.income.toFixed(2),
      p.numbers.totalHours || 0
    ]);
    totalIncome += p.numbers.income || 0;
    totalHours += p.numbers.totalHours || 0;
  });
  sum.push([]);
  sum.push(['', '', '', '', 'Totals', '', '', totalIncome.toFixed(2), totalHours.toFixed(2)]);
  const wsSum = XLSX.utils.aoa_to_sheet(sum);
  XLSX.utils.book_append_sheet(wb, wsSum, 'History Summary');

  // Full raw sheet
  const rawHeader = ['id','date','name','type','currency','inputs','numbers'];
  const rawRows = [rawHeader];
  projects.forEach(p => {
    rawRows.push([p.id, p.date, p.name, p.type, p.currency, JSON.stringify(p.inputs), JSON.stringify(p.numbers)]);
  });
  const wsRaw = XLSX.utils.aoa_to_sheet(rawRows);
  XLSX.utils.book_append_sheet(wb, wsRaw, 'Raw Data');

  XLSX.writeFile(wb, 'WinArt_Project_History.xlsx');
});

/* ---------- Import CSV/XLSX to history ---------- */
$('#importBtn').addEventListener('click', () => {
  const fileInput = $('#importFile');
  const file = fileInput.files[0];
  if (!file) { alert('Choose a CSV or XLSX file first'); return; }
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = e.target.result;
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'csv' || ext === 'txt') {
      // parse CSV
      const text = data;
      const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
      // expecting exported CSV layout: we will accept minimal: Date,Project,Type,TotalCost,FinalPrice,Income
      const start = lines[0].toLowerCase();
      // simple parse
      lines.slice(1).forEach(line=>{
        const cols = line.split(',');
        if (cols.length >= 6) {
          const entry = {
            id: Date.now() + Math.floor(Math.random()*1000),
            date: cols[0],
            name: cols[1],
            type: cols[2],
            currency: cols[5] ? cols[5].replace(/[0-9.\s-]/g,'') : '₱',
            inputs: {},
            numbers: {
              subtotal: parseFloat(cols[3]) || 0,
              finalPrice: parseFloat(cols[4]) || 0,
              income: parseFloat(cols[4]) - parseFloat(cols[3]) || 0,
              totalHours: 0
            }
          };
          const arr = loadProjects();
          arr.push(entry);
          saveProjects(arr);
        }
      });
      renderHistory();
      alert('CSV import attempted. Check history.');
    } else {
      // XLSX
      try {
        const wb = XLSX.read(data, {type:'binary'});
        const firstSheetName = wb.SheetNames[0];
        const ws = wb.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(ws, {header:1});
        // expect first row header
        for (let i = 1; i < json.length; i++) {
          const row = json[i];
          if (!row || row.length < 4) continue;
          const entry = {
            id: Date.now() + i,
            date: row[1] || new Date().toLocaleString(),
            name: row[2] || ('Imported ' + i),
            type: row[3] || 'Imported',
            currency: row[4] || '₱',
            numbers: {
              subtotal: parseFloat(row[5]) || 0,
              finalPrice: parseFloat(row[6]) || 0,
              income: parseFloat(row[7]) || 0,
              totalHours: parseFloat(row[8]) || 0
            },
            inputs: {}
          };
          const arr = loadProjects();
          arr.push(entry);
          saveProjects(arr);
        }
        renderHistory();
        alert('XLSX imported (best-effort).');
      } catch (err) {
        alert('Failed to parse file: ' + err.message);
      }
    }
    fileInput.value = '';
  };

  const ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'xlsx' || ext === 'xls') reader.readAsBinaryString(file);
  else reader.readAsText(file);
});

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderHistory();
});
