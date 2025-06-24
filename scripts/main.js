// main.js – entry point
import { getExpenses, saveExpense } from './db.js';
import { renderTable, showStatus, renderBalances } from './ui.js';

const form = document.getElementById('expense-form');
const tripTitleInput = document.getElementById('tripTitle');
const tripDateInput = document.getElementById('tripDate');
const startTripBtn = document.getElementById('startTrip');

let isEditing = false;
let editExpenseId = null;
let currentTripTitle = '';
let currentTripDate = '';

startTripBtn.addEventListener('click', () => {
  if (!tripTitleInput.value || !tripDateInput.value) {
    alert('Please enter trip title and date');
    return;
  }
  currentTripTitle = tripTitleInput.value;
  currentTripDate = tripDateInput.value;
  showStatus(`✅ Trip "${currentTripTitle}" started!`);
});

form.addEventListener('submit', e => {
  e.preventDefault();

  if (!currentTripTitle || !currentTripDate) {
    alert('Please start a trip before adding expenses.');
    return;
  }

  const updatedExpense = {
    id: isEditing ? editExpenseId : Date.now(),
    tripTitle: currentTripTitle,
    date: currentTripDate,
    category: document.getElementById('category').value,
    description: document.getElementById('description').value,
    amount: parseFloat(document.getElementById('amount').value),
    paidBy: document.getElementById('paidBy').value
  };

  if (!updatedExpense.category || !updatedExpense.description || isNaN(updatedExpense.amount) || !updatedExpense.paidBy) {
    alert('Please fill all fields correctly.');
    return;
  }

  const expenses = getExpenses();

  if (isEditing) {
    const index = expenses.findIndex(exp => exp.id === editExpenseId);
    expenses[index] = updatedExpense;
    localStorage.setItem('advanced_expenses', JSON.stringify(expenses));
    showStatus('✅ Expense updated!');
    document.querySelector('#expense-form button').textContent = 'Add Expense';
    isEditing = false;
    editExpenseId = null;
  } else {
    saveExpense(updatedExpense);
    showStatus('✅ Expense added!');
  }

  form.reset();
  updateUI();
});

function updateUI() {
  const expenses = getExpenses();
  renderTable(expenses);
  renderBalances(expenses);
}

export function triggerEditMode(id) {
  const expenses = getExpenses();
  const expense = expenses.find(exp => exp.id === id);
  if (!expense) return;

  currentTripTitle = expense.tripTitle;
  currentTripDate = expense.date;
  tripTitleInput.value = expense.tripTitle;
  tripDateInput.value = expense.date;

  document.getElementById('category').value = expense.category;
  document.getElementById('description').value = expense.description;
  document.getElementById('amount').value = expense.amount;
  document.getElementById('paidBy').value = expense.paidBy;

  isEditing = true;
  editExpenseId = id;
  document.querySelector('#expense-form button').textContent = 'Update Expense';
}

window.addEventListener('load', updateUI);
