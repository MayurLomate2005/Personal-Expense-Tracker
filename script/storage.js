export function getExpenses() {
  return JSON.parse(localStorage.getItem('expenses')) || [];
}

export function saveExpense(expense) {
  const expenses = getExpenses();
  expenses.push(expense);
  localStorage.setItem('expenses', JSON.stringify(expenses));
}
