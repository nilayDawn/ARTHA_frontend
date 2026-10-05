import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import {
  getFinancialSummary,
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getBudgets,
  createBudget,
  deleteBudget,
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  getBudgetTemplates,
} from '@/api/finance';
import { getCategories } from '@/api/catalogue';
import { isIncomeTransaction } from '@/utils/financeUtils';

export const DEFAULT_CATEGORIES = [
  'Food & Dining',
  'Income',
  'Shopping',
  'Utilities',
  'Transport',
  'Entertainment',
  'Health',
  'Education',
  'Subscriptions',
  'Other',
];

// Async Thunks
export const fetchFinancialSummary = createAsyncThunk(
  'finance/fetchSummary',
  async (month, { rejectWithValue }) => {
    try {
      const params = month && month !== 'ALL' ? { month } : {};
      const res = await getFinancialSummary(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to load summary');
    }
  }
);

export const fetchCategoriesThunk = createAsyncThunk(
  'finance/fetchCategories',
  async () => {
    try {
      const data = await getCategories();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((c) => c.name);
      }
      return DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  }
);

export const fetchTransactionsThunk = createAsyncThunk(
  'finance/fetchTransactions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await getTransactions(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch transactions');
    }
  }
);

export const createTransactionThunk = createAsyncThunk(
  'finance/createTransaction',
  async (payload, { dispatch, getState, rejectWithValue }) => {
    try {
      const res = await createTransaction(payload);
      const state = getState();
      dispatch(fetchFinancialSummary(state.finance.selectedMonth));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to create transaction');
    }
  }
);

export const updateTransactionThunk = createAsyncThunk(
  'finance/updateTransaction',
  async ({ id, data }, { dispatch, getState, rejectWithValue }) => {
    try {
      const res = await updateTransaction(id, data);
      const state = getState();
      dispatch(fetchFinancialSummary(state.finance.selectedMonth));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to update transaction');
    }
  }
);

export const deleteTransactionThunk = createAsyncThunk(
  'finance/deleteTransaction',
  async (id, { dispatch, getState, rejectWithValue }) => {
    try {
      await deleteTransaction(id);
      const state = getState();
      dispatch(fetchFinancialSummary(state.finance.selectedMonth));
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to delete transaction');
    }
  }
);

export const fetchBudgetsThunk = createAsyncThunk(
  'finance/fetchBudgets',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await getBudgets(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch budgets');
    }
  }
);

export const createBudgetThunk = createAsyncThunk(
  'finance/createBudget',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await createBudget(payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to create budget');
    }
  }
);

export const deleteBudgetThunk = createAsyncThunk(
  'finance/deleteBudget',
  async (id, { rejectWithValue }) => {
    try {
      await deleteBudget(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to delete budget');
    }
  }
);

export const fetchBudgetTemplatesThunk = createAsyncThunk(
  'finance/fetchBudgetTemplates',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getBudgetTemplates();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch budget templates');
    }
  }
);

export const fetchGoalsThunk = createAsyncThunk(
  'finance/fetchGoals',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getGoals();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch goals');
    }
  }
);

export const createGoalThunk = createAsyncThunk(
  'finance/createGoal',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await createGoal(payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to create goal');
    }
  }
);

export const updateGoalThunk = createAsyncThunk(
  'finance/updateGoal',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateGoal(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to update goal');
    }
  }
);

export const deleteGoalThunk = createAsyncThunk(
  'finance/deleteGoal',
  async (id, { rejectWithValue }) => {
    try {
      await deleteGoal(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to delete goal');
    }
  }
);

const currentMonthStr = new Date().toISOString().slice(0, 7);

const initialState = {
  selectedMonth: currentMonthStr,
  categories: DEFAULT_CATEGORIES,
  summary: null,
  summaryStatus: 'idle',
  summaryError: null,

  transactions: [],
  transactionsStatus: 'idle',
  transactionsError: null,

  budgets: [],
  budgetsStatus: 'idle',
  budgetsError: null,

  budgetTemplates: [],

  goals: [],
  goalsStatus: 'idle',
  goalsError: null,
};

export const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    setSelectedMonth: (state, action) => {
      state.selectedMonth = action.payload;
    },
    resetFinanceState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Summary
      .addCase(fetchFinancialSummary.pending, (state) => {
        state.summaryStatus = 'loading';
        state.summaryError = null;
      })
      .addCase(fetchFinancialSummary.fulfilled, (state, action) => {
        state.summaryStatus = 'succeeded';
        state.summary = action.payload;
      })
      .addCase(fetchFinancialSummary.rejected, (state, action) => {
        state.summaryStatus = 'failed';
        state.summaryError = action.payload;
      })

      // Categories
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.categories = action.payload;
      })

      // Transactions
      .addCase(fetchTransactionsThunk.pending, (state) => {
        state.transactionsStatus = 'loading';
        state.transactionsError = null;
      })
      .addCase(fetchTransactionsThunk.fulfilled, (state, action) => {
        state.transactionsStatus = 'succeeded';
        state.transactions = action.payload || [];
      })
      .addCase(fetchTransactionsThunk.rejected, (state, action) => {
        state.transactionsStatus = 'failed';
        state.transactionsError = action.payload;
      })
      .addCase(createTransactionThunk.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload);
      })
      .addCase(updateTransactionThunk.fulfilled, (state, action) => {
        const index = state.transactions.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(deleteTransactionThunk.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter((t) => t.id !== action.payload);
      })

      // Budgets
      .addCase(fetchBudgetsThunk.pending, (state) => {
        state.budgetsStatus = 'loading';
        state.budgetsError = null;
      })
      .addCase(fetchBudgetsThunk.fulfilled, (state, action) => {
        state.budgetsStatus = 'succeeded';
        state.budgets = action.payload || [];
      })
      .addCase(fetchBudgetsThunk.rejected, (state, action) => {
        state.budgetsStatus = 'failed';
        state.budgetsError = action.payload;
      })
      .addCase(createBudgetThunk.fulfilled, (state, action) => {
        state.budgets.push(action.payload);
      })
      .addCase(deleteBudgetThunk.fulfilled, (state, action) => {
        state.budgets = state.budgets.filter((b) => b.id !== action.payload);
      })
      .addCase(fetchBudgetTemplatesThunk.fulfilled, (state, action) => {
        state.budgetTemplates = action.payload || [];
      })

      // Goals
      .addCase(fetchGoalsThunk.pending, (state) => {
        state.goalsStatus = 'loading';
        state.goalsError = null;
      })
      .addCase(fetchGoalsThunk.fulfilled, (state, action) => {
        state.goalsStatus = 'succeeded';
        state.goals = action.payload || [];
      })
      .addCase(fetchGoalsThunk.rejected, (state, action) => {
        state.goalsStatus = 'failed';
        state.goalsError = action.payload;
      })
      .addCase(createGoalThunk.fulfilled, (state, action) => {
        state.goals.push(action.payload);
      })
      .addCase(updateGoalThunk.fulfilled, (state, action) => {
        const index = state.goals.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.goals[index] = action.payload;
        }
      })
      .addCase(deleteGoalThunk.fulfilled, (state, action) => {
        state.goals = state.goals.filter((g) => g.id !== action.payload);
      });
  },
});

export const { setSelectedMonth, resetFinanceState } = financeSlice.actions;

// Granular Selectors
export const selectSelectedMonth = (state) => state.finance.selectedMonth;
export const selectCategories = (state) => state.finance.categories;
export const selectFinancialSummary = (state) => state.finance.summary;
export const selectSummaryLoading = (state) => state.finance.summaryStatus === 'loading';
export const selectSummaryError = (state) => state.finance.summaryError;

export const selectTransactionsList = (state) => state.finance.transactions;
export const selectTransactionsLoading = (state) => state.finance.transactionsStatus === 'loading';
export const selectTransactionsError = (state) => state.finance.transactionsError;

export const selectBudgetsList = (state) => state.finance.budgets;
export const selectBudgetsLoading = (state) => state.finance.budgetsStatus === 'loading';
export const selectBudgetTemplatesList = (state) => state.finance.budgetTemplates;

export const selectGoalsList = (state) => state.finance.goals;
export const selectGoalsLoading = (state) => state.finance.goalsStatus === 'loading';

// Memoized Selectors for optimized rendering
export const selectCategorySpendingMap = createSelector(
  [selectTransactionsList, selectSelectedMonth],
  (transactions, selectedMonth) => {
    const map = {};
    for (const t of transactions) {
      if (isIncomeTransaction(t)) continue;
      if (selectedMonth && selectedMonth !== 'ALL' && t.date && String(t.date).slice(0, 7) !== selectedMonth) {
        continue;
      }
      const cat = t.category || 'Other';
      map[cat] = (map[cat] || 0) + Number(t.amount || 0);
    }
    return map;
  }
);

export default financeSlice.reducer;
