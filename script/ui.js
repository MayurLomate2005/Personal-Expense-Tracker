export function renderTable(expenses) {
  const tableBody = document.getElementById('expense-table-body');
  tableBody.innerHTML = '';
  expenses.forEach(exp => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${exp.date}</td>
      <td>${exp.category}</td>
      <td>${exp.description}</td>
      <td>₹${exp.amount.toFixed(2)}</td>
    `;
    tableBody.appendChild(row);
  });
}

export function drawChart(expenses) {
  const categoryTotals = {};
  expenses.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const data = [['Category', 'Amount']];
  for (let cat in categoryTotals) {
    data.push([cat, categoryTotals[cat]]);
  }

  const chartData = google.visualization.arrayToDataTable(data);
  const options = {
    title: 'Expenses by Category',
    pieHole: 0.4
  };
  const chart = new google.visualization.PieChart(document.getElementById('chart_div'));
  chart.draw(chartData, options);
}
