// main.js – entry point

import { getExpenses, saveExpense } from './db.js';
import { renderTable, showStatus } from './ui.js';

const form = document.getElementById('expense-form');

let isEditing = false;
let editExpenseId = null;

// Update UI on load
window.addEventListener('load', updateUI);

// Handle form submission
form.addEventListener('submit', e => {
  e.preventDefault();

  const updatedExpense = {
    id: isEditing ? editExpenseId : Date.now(),
    date: document.getElementById('date').value,
    category: document.getElementById('category').value,
    description: document.getElementById('description').value,
    amount: parseFloat(document.getElementById('amount').value)
  };

  if (!updatedExpense.date || !updatedExpense.category || !updatedExpense.description || isNaN(updatedExpense.amount)) {
    alert('Please fill all fields correctly.');
    return;
  }

  const expenses = getExpenses();

  if (isEditing) {
    const index = expenses.findIndex(exp => exp.id === editExpenseId);
    if (index !== -1) {
      expenses[index] = updatedExpense;
      localStorage.setItem('advanced_expenses', JSON.stringify(expenses));
      showStatus('✅ Expense updated!');
    }
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

// Function to update the table
function updateUI() {
  const expenses = getExpenses();
  renderTable(expenses);
}

// Trigger edit mode
function triggerEditMode(id) {
  const expenses = getExpenses();
  const expense = expenses.find(exp => exp.id === id);
  if (!expense) return;

  document.getElementById('date').value = expense.date;
  document.getElementById('category').value = expense.category;
  document.getElementById('description').value = expense.description;
  document.getElementById('amount').value = expense.amount;

  isEditing = true;
  editExpenseId = id;

  document.querySelector('#expense-form button').textContent = 'Update Expense';
}

// ✅ Export for use in ui.js
export { triggerEditMode };
