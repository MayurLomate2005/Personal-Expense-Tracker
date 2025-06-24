// main.js – entry point
import { renderTable, showStatus, renderBalances } from './ui.js';

const form = document.getElementById('expense-form');
const tripTitleInput = document.getElementById('tripTitle');
const tripDateInput = document.getElementById('tripDate');
const startTripBtn = document.getElementById('startTrip');
const newTripBtn = document.getElementById('newTrip');
const viewHistoryBtn = document.getElementById('viewHistory');
const tripHistoryList = document.getElementById('trip-history-list');
const historySection = document.getElementById('history-section');

let isEditing = false;
let editExpenseId = null;
let currentTripTitle = '';
let currentTripDate = '';

function getAllTrips() {
  return JSON.parse(localStorage.getItem('allTrips')) || {};
}

function saveAllTrips(trips) {
  localStorage.setItem('allTrips', JSON.stringify(trips));
}

function loadTrip(title) {
  const trips = getAllTrips();
  const expenses = trips[title] || [];
  currentTripTitle = title;
  currentTripDate = expenses.length > 0 ? expenses[0].date : '';
  tripTitleInput.value = currentTripTitle;
  tripDateInput.value = currentTripDate;
  showStatus(`📂 Loaded trip: ${title}`);
  renderTable(expenses);
  renderBalances(expenses);
}

function updateUI() {
  const trips = getAllTrips();
  if (currentTripTitle && trips[currentTripTitle]) {
    renderTable(trips[currentTripTitle]);
    renderBalances(trips[currentTripTitle]);
  } else {
    renderTable([]);
    renderBalances([]);
  }
}

function saveExpense(expense) {
  const trips = getAllTrips();
  if (!trips[currentTripTitle]) trips[currentTripTitle] = [];
  trips[currentTripTitle].push(expense);
  saveAllTrips(trips);
}

function triggerEditMode(id) {
  const trips = getAllTrips();
  const expenses = trips[currentTripTitle] || [];
  const expense = expenses.find(exp => exp.id === id);
  if (!expense) return;

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

function deleteExpense(id) {
  const trips = getAllTrips();
  let expenses = trips[currentTripTitle] || [];
  expenses = expenses.filter(exp => exp.id !== id);
  trips[currentTripTitle] = expenses;
  saveAllTrips(trips);
  showStatus('🗑️ Expense deleted!');
  updateUI();
}

startTripBtn.addEventListener('click', () => {
  if (!tripTitleInput.value || !tripDateInput.value) {
    alert('Please enter trip title and date');
    return;
  }
  currentTripTitle = tripTitleInput.value;
  currentTripDate = tripDateInput.value;
  showStatus(`✅ Trip "${currentTripTitle}" started!`);
  updateUI();
});

form.addEventListener('submit', e => {
  e.preventDefault();

  if (!currentTripTitle || !currentTripDate) {
    alert('Please start a trip before adding expenses.');
    return;
  }

  const expense = {
    id: isEditing ? editExpenseId : Date.now(),
    tripTitle: currentTripTitle,
    date: currentTripDate,
    category: document.getElementById('category').value,
    description: document.getElementById('description').value,
    amount: parseFloat(document.getElementById('amount').value),
    paidBy: document.getElementById('paidBy').value
  };

  if (!expense.category || !expense.description || isNaN(expense.amount) || !expense.paidBy) {
    alert('Please fill all fields correctly.');
    return;
  }

  const trips = getAllTrips();

  if (isEditing) {
    const index = trips[currentTripTitle].findIndex(exp => exp.id === editExpenseId);
    trips[currentTripTitle][index] = expense;
    saveAllTrips(trips);
    showStatus('✅ Expense updated!');
    document.querySelector('#expense-form button').textContent = 'Add Expense';
    isEditing = false;
    editExpenseId = null;
  } else {
    saveExpense(expense);
    showStatus('✅ Expense added!');
  }

  form.reset();
  updateUI();
});

newTripBtn.addEventListener('click', () => {
  tripTitleInput.value = '';
  tripDateInput.value = '';
  currentTripTitle = '';
  currentTripDate = '';
  form.reset();
  updateUI();
});

viewHistoryBtn.addEventListener('click', () => {
  const trips = getAllTrips();
  tripHistoryList.innerHTML = '';
  for (const title in trips) {
    const li = document.createElement('li');
    li.textContent = title;
    li.style.cursor = 'pointer';
    li.addEventListener('click', () => {
      loadTrip(title);
      historySection.classList.add('hidden');
    });
    tripHistoryList.appendChild(li);
  }
  historySection.classList.toggle('hidden');
});

window.triggerEditMode = triggerEditMode;
window.deleteExpense = deleteExpense;

window.addEventListener('load', updateUI);
