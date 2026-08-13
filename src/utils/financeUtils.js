
// Shared Finance Utilities & Calculation Helpers



//  Check if a transaction is an Income entry

export const isIncomeTransaction = (tx) => {
  if (!tx) return false;
  const category = (tx.category || '').toLowerCase();
  const type = (tx.type || '').toLowerCase();
  return category === 'income' || type === 'income';
};

// Fuzzy check if transaction category matches a target category (e.g., Food & Dining -> Food, Restaurant, Dining)
export const matchCategory = (txCategory, targetCategory) => {
  if (!txCategory || !targetCategory) return false;
  const catLower = txCategory.toLowerCase();
  const targetLower = targetCategory.toLowerCase();

  if (targetLower === 'all') return true;

  if (targetLower.includes('food') || targetLower.includes('dining')) {
    return catLower.includes('food') || catLower.includes('dining') || catLower.includes('restaurant');
  }
  if (targetLower.includes('shop')) {
    return catLower.includes('shop') || catLower.includes('store');
  }
  if (targetLower.includes('utilit') || targetLower.includes('bill')) {
    return catLower.includes('utilit') || catLower.includes('bill');
  }
  if (targetLower.includes('transport') || targetLower.includes('travel')) {
    return catLower.includes('transport') || catLower.includes('travel');
  }
  if (targetLower.includes('subscript')) {
    return catLower.includes('subscript');
  }
  if (targetLower.includes('entertain')) {
    return catLower.includes('entertain');
  }
  if (targetLower.includes('educat')) {
    return catLower.includes('educat');
  }

  return catLower === targetLower || catLower.includes(targetLower);
};



 // Calculate total spent for a category within a given month (YYYY-MM)

export const getCategorySpendingForMonth = (transactions = [], category, monthStr) => {
  return transactions.reduce((acc, t) => {
    if (isIncomeTransaction(t)) return acc;
    if (monthStr && t.date && String(t.date).slice(0, 7) !== monthStr) return acc;

    if (matchCategory(t.category || '', category)) {
      return acc + Number(t.amount || 0);
    }
    return acc;
  }, 0);
};


 // Currency Formatter

export const formatCurrency = (amount) => {
  return `₹${Number(amount || 0).toLocaleString()}`;
};

// Get current month string YYYY-MM
export const getCurrentMonthStr = () => new Date().toISOString().slice(0, 7);
