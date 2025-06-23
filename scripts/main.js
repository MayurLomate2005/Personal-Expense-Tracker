// 🚀 Updated main.js with Split Logic
import { getExpenses, saveExpense } from './db.js';
import { renderTable, renderBalances, showStatus } from './ui.js';

const form = document.getElementById('expense-form');
const settleBtn = document.getElementById('settle-btn');

let isEditing = false;
let editExpenseId = null;

window.addEventListener('load', updateUI);

form.addEventListener('submit', e => {
  e.preventDefault();

  const updatedExpense = {
    id: isEditing ? editExpenseId : Date.now(),
    date: document.getElementById('date').value,
    category: document.getElementById('category').value,
    description: document.getElementById('description').value,
    amount: parseFloat(document.getElementById('amount').value),
    paidBy: document.getElementById('paidBy').value
  };

  if (!updatedExpense.date || !updatedExpense.category || !updatedExpense.description || isNaN(updatedExpense.amount) || !updatedExpense.paidBy) {
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
    resetEditState();
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

function resetEditState() {
  isEditing = false;
  editExpenseId = null;
  document.querySelector('#expense-form button').textContent = 'Add Expense';
}

export function triggerEditMode(id) {
  const expenses = getExpenses();
  const expense = expenses.find(exp => exp.id === id);
  if (!expense) return;

  document.getElementById('date').value = expense.date;
  document.getElementById('category').value = expense.category;
  document.getElementById('description').value = expense.description;
  document.getElementById('amount').value = expense.amount;
  document.getElementById('paidBy').value = expense.paidBy;

  isEditing = true;
  editExpenseId = id;

  document.querySelector('#expense-form button').textContent = 'Update Expense';
}
