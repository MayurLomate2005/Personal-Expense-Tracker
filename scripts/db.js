// db.js – handles saving and loading from localStorage

const STORAGE_KEY = 'advanced_expenses';

export function getExpenses() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function saveExpense(expense) {
  const expenses = getExpenses();
  expenses.push(expense);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}
