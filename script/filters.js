export function getPeriodFilter(period) {
  const today = new Date();

  return function (expense) {
    const date = new Date(expense.date);
    if (period === 'today') {
      return date.toDateString() === today.toDateString();
    }
    if (period === 'week') {
      const start = new Date(today);
      start.setDate(today.getDate() - today.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return date >= start && date <= end;
    }
    if (period === 'month') {
      return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    }
    if (period === 'year') {
      return date.getFullYear() === today.getFullYear();
    }
    return true; // all
  };
}
