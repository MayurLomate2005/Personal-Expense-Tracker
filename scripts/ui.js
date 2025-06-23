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
      <td>
        <button class="edit-btn" data-id="${exp.id}">✏️ Edit</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = parseInt(e.target.dataset.id);
      triggerEditMode(id);
    });
  });
}

export function showStatus(message) {
  const status = document.getElementById('status');
  status.textContent = message;
  setTimeout(() => (status.textContent = ''), 3000);
}
