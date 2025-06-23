import { triggerEditMode } from './main.js';

export function renderTable(expenses) {
  const tbody = document.getElementById('expense-table-body');
  tbody.innerHTML = '';

  expenses.forEach(exp => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${exp.date}</td>
      <td>${exp.category}</td>
      <td>${exp.description}</td>
      <td>₹${parseFloat(exp.amount).toFixed(2)}</td>
      <td>${exp.paidBy}</td>
      <td>
        <button class="edit-btn" data-id="${exp.id}">✏️ Edit</button>
        <button class="delete-btn" data-id="${exp.id}">🗑️ Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  // Attach Edit button listeners
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = parseInt(e.target.dataset.id);
      triggerEditMode(id);
    });
  });

  // Attach Delete button listeners
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = parseInt(e.target.dataset.id);
      deleteExpense(id);
    });
  });
}

export function showStatus(message) {
  const status = document.getElementById('status');
  status.textContent = message;
  setTimeout(() => (status.textContent = ''), 3000);
}

export function renderBalances(expenses) {
  const balancesDiv = document.getElementById('balances');
  balancesDiv.innerHTML = '';

  if (!expenses.length) return;

  const members = [...new Set(expenses.map(e => e.paidBy))];
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const share = totalSpent / members.length;

  const paidMap = {};
  members.forEach(member => {
    paidMap[member] = expenses
      .filter(e => e.paidBy === member)
      .reduce((sum, e) => sum + e.amount, 0);
  });

  const balanceMap = {};
  members.forEach(member => {
    balanceMap[member] = paidMap[member] - share;
  });

  const result = [];
  const debtors = members.filter(m => balanceMap[m] < 0).sort((a, b) => balanceMap[a] - balanceMap[b]);
  const creditors = members.filter(m => balanceMap[m] > 0).sort((a, b) => balanceMap[b] - balanceMap[a]);

  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(Math.abs(balanceMap[debtor]), balanceMap[creditor]);

    result.push(`${debtor} owes ₹${amount.toFixed(2)} to ${creditor}`);

    balanceMap[debtor] += amount;
    balanceMap[creditor] -= amount;

    if (Math.abs(balanceMap[debtor]) < 0.01) i++;
    if (Math.abs(balanceMap[creditor]) < 0.01) j++;
  }

  if (result.length === 0) {
    balancesDiv.innerHTML = '<p>All settled up! ✅</p>';
  } else {
    const ul = document.createElement('ul');
    result.forEach(r => {
      const li = document.createElement('li');
      li.textContent = r;
      ul.appendChild(li);
    });
    balancesDiv.appendChild(ul);
  }
}

// 🗑️ Delete expense and update UI
function deleteExpense(id) {
  const expenses = JSON.parse(localStorage.getItem('advanced_expenses')) || [];
  const updated = expenses.filter(exp => exp.id !== id);
  localStorage.setItem('advanced_expenses', JSON.stringify(updated));
  showStatus('🗑️ Expense deleted!');
  renderTable(updated);
  renderBalances(updated);
}
