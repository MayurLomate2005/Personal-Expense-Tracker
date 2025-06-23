import { getExpenses, saveExpense } from './storage.js';
import { renderTable, drawChart } from './ui.js';
import { getPeriodFilter } from './filters.js';

const form = document.getElementById('expense-form');
const filterPeriod = document.getElementById('filter-period');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const newExpense = {
    id: Date.now(),
    date: document.getElementById('date').value,
    category: document.getElementById('category').value,
    description: document.getElementById('description').value,
    amount: parseFloat(document.getElementById('amount').value)
  };
  saveExpense(newExpense);
  form.reset();
  updateUI();
});

filterPeriod.addEventListener('change', updateUI);

function updateUI() {
  const expenses = getExpenses();
  const filtered = expenses.filter(getPeriodFilter(filterPeriod.value));
  renderTable(filtered);
  drawChart(filtered);
}

window.addEventListener('load', () => {
  google.charts.load('current', { packages: ['corechart'] });
  google.charts.setOnLoadCallback(updateUI);
});
