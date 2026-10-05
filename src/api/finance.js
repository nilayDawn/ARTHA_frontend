import API from './client';
import { ENDPOINTS } from './endpoints';

// Transactions
export const getTransactions = (params) => API.get(ENDPOINTS.TRANSACTIONS.BASE, { params });
export const createTransaction = (payload) => API.post(ENDPOINTS.TRANSACTIONS.BASE, payload);
export const updateTransaction = (id, payload) => API.patch(ENDPOINTS.TRANSACTIONS.DETAIL(id), payload);
export const deleteTransaction = (id) => API.delete(ENDPOINTS.TRANSACTIONS.DETAIL(id));

// Financial Summary (Cached on backend)
export const getFinancialSummary = (params) => API.get(ENDPOINTS.FINANCE.SUMMARY, { params });

// Budgets
export const getBudgets = (params) => API.get(ENDPOINTS.BUDGETS.BASE, { params });
export const createBudget = (payload) => API.post(ENDPOINTS.BUDGETS.BASE, payload);
export const deleteBudget = (id) => API.delete(ENDPOINTS.BUDGETS.DETAIL(id));
export const getBudgetTemplates = () => API.get(ENDPOINTS.BUDGETS.TEMPLATES);

// Savings Goals
export const getGoals = () => API.get(ENDPOINTS.GOALS.BASE);
export const createGoal = (payload) => API.post(ENDPOINTS.GOALS.BASE, payload);
export const updateGoal = (id, payload) => API.patch(ENDPOINTS.GOALS.DETAIL(id), payload);
export const deleteGoal = (id) => API.delete(ENDPOINTS.GOALS.DETAIL(id));
