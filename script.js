// Existing tab, logo, calculation, and history code remains unchanged

// --- Export Full History to Excel ---
document.getElementById('exportHistory').addEventListener('click', function(){
  if(history.length === 0){ alert('No projects to export.'); return; }

  let csv = 'Project Name,Type,Total Cost,Total Income\n';
  history.forEach(p => {
    csv += `${p.name},${p.type},${p.totalCost},${p.totalIncome}\n`;
  });

  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'project_history.csv';
  link.click();
});

// --- Export Client Invoice ---
function exportInvoice(project){
  if(!project) return;
  const logoSrc = document.getElementById('logoPreview').src || '';
  let csv = '';
  csv += `Win Art Studio Invoice\n\n`;
  if(logoSrc) csv += `Logo: ${logoSrc}\n\n`;
  csv += `Project Name: ,${project.name}\n`;
  csv += `Type: ,${project.type}\n`;
  csv += `Total Cost: ,${project.totalCost}\n`;
  csv += `Total Income: ,${project.totalIncome}\n`;
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${project.name}_invoice.csv`;
  link.click();
}

// --- Example: clicking invoice for last project (you can create buttons for each row if needed)
document.querySelector('#historyTable tbody').addEventListener('click', function(e){
  if(e.target.tagName === 'TD'){
    const row = e.target.parentNode;
    const name = row.children[0].innerText;
    const project = history.find(p=>p.name===name);
    if(project) exportInvoice(project);
  }
});
