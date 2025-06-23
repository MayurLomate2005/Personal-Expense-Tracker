google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(drawChart);

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

const form = document.getElementById('expense-form');
const tableBody = document.getElementById('expense-table-body');
const filterCategory = document.getElementById('filter-category');
const filterMonth = document.getElementById('filter-month');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const expense = {
    date: document.getElementById('date').value,
    category: document.getElementById('category').value,
    description: document.getElementById('description').value,
    amount: parseFloat(document.getElementById('amount').value)
  };
  expenses.push(expense);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  form.reset();
  renderTable();
  drawChart();
});

function renderTable() {
  const categoryFilter = filterCategory.value;
  const monthFilter = filterMonth.value;
  const filtered = expenses.filter(exp => {
    const matchCategory = !categoryFilter || exp.category === categoryFilter;
    const matchMonth = !monthFilter || exp.date.startsWith(monthFilter);
    return matchCategory && matchMonth;
  });

  tableBody.innerHTML = '';
  filtered.forEach(exp => {
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

function drawChart() {
  const monthFilter = filterMonth.value;
  const filtered = expenses.filter(exp => !monthFilter || exp.date.startsWith(monthFilter));

  const categoryTotals = {};
  filtered.forEach(exp => {
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

filterCategory.addEventListener('change', () => {
  renderTable();
  drawChart();
});
filterMonth.addEventListener('change', () => {
  renderTable();
  drawChart();
});

window.addEventListener('load', () => {
  renderTable();
  drawChart();
});
