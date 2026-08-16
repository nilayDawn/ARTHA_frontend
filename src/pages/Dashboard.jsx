import { useEffect, useState, useMemo } from 'react';
import api from '../services/api';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  ArrowUpRight,
  PlusCircle,
  Receipt,
  BarChart3,
  Calendar
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import SEOHead from '../components/ui/SEOHead';

const CATEGORY_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#64748b'];

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Month Filter state - defaults to current calendar month (YYYY-MM)
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);

  const [availableMonths, setAvailableMonths] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const txParams = selectedMonth && selectedMonth !== 'ALL' ? { month: selectedMonth } : {};
        const bgParams = selectedMonth && selectedMonth !== 'ALL' ? { month: selectedMonth } : {};
        const [txRes, bgRes, allTxRes] = await Promise.allSettled([
          api.get('/transactions', { params: txParams }),
          api.get('/budgets', { params: bgParams }),
          api.get('/transactions'),
        ]);

        if (txRes.status === 'fulfilled') setTransactions(txRes.value.data || []);
        if (bgRes.status === 'fulfilled') setBudgets(bgRes.value.data || []);
        
        if (allTxRes.status === 'fulfilled') {
          const allTx = allTxRes.value.data || [];
          const months = Array.from(
            new Set(
              allTx
                .map((t) => (t.date ? String(t.date).slice(0, 7) : null))
                .filter(Boolean)
            )
          ).sort().reverse();
          setAvailableMonths(months);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedMonth]);

  // Transactions for active month are directly supplied by backend DB fetch
  const monthlyTransactions = transactions;

  // Compute Financial Overview based on backend-filtered transactions
  const incomeFromTx = monthlyTransactions
    .filter((t) => (t.category || '').toLowerCase() === 'income' || (t.type || '').toLowerCase() === 'income')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const monthlyIncome = incomeFromTx;

  const expenseTx = monthlyTransactions.filter(
    (t) => (t.category || '').toLowerCase() !== 'income' && (t.type || '').toLowerCase() !== 'income'
  );
  const totalExpenses = expenseTx.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const savings = Math.max(0, monthlyIncome - totalExpenses);
  const savingsRate = monthlyIncome > 0 ? Math.round((savings / monthlyIncome) * 100) : 0;

  // Category Spending Data (for active month)
  const categoryMap = expenseTx.reduce((acc, curr) => {
    const cat = curr.category || 'Other';
    acc[cat] = (acc[cat] || 0) + Number(curr.amount || 0);
    return acc;
  }, {});

  const categoryChartData = Object.keys(categoryMap).map((cat) => ({
    name: cat,
    value: categoryMap[cat],
  }));

  // Monthly Spending Trends Data (historical trend)
  const monthlyTrendMap = expenseTx.reduce((acc, curr) => {
    if (!curr.date) return acc;
    const monthKey = new Date(curr.date).toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
    acc[monthKey] = (acc[monthKey] || 0) + Number(curr.amount || 0);
    return acc;
  }, {});

  const monthlyTrendData = Object.keys(monthlyTrendMap).map((m) => ({
    month: m,
    Spent: monthlyTrendMap[m],
  }));

  // Budgets vs Actual Spending Data (budgets pre-filtered by backend DB query)
  const budgetVsSpendingData = budgets.map((b) => {
      const spent = expenseTx
        .filter((t) => {
          const cat = (t.category || '').toLowerCase();
          const bCat = (b.category || '').toLowerCase();
          if (bCat.includes('food') && (cat.includes('food') || cat.includes('dining') || cat.includes('restaurant'))) return true;
          return cat === bCat;
        })
        .reduce((acc, t) => acc + Number(t.amount || 0), 0);

      return {
        category: b.category,
        Limit: Number(b.monthly_limit || b.limit || 0),
        Spent: spent,
      };
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-500 gap-2">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-500 border-t-transparent"></div>
        <span className="text-xs">Loading Financial Overview...</span>
      </div>
    );
  }

  return (
    <div className="space-y-5 w-full max-w-7xl mx-auto">
      <SEOHead
        title="Dashboard"
        description="View real-time financial overview, monthly income, total expenses, savings rate, category breakdown, and recent transactions."
      />
      {/* Header & Month Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">Financial Overview</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Real-time summary of monthly income, expenses, and savings rate</p>
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-900 rounded-lg px-3 py-1.5 self-start sm:self-auto">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs text-neutral-400 font-medium">Period:</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-neutral-950 text-white">All-Time Cumulative</option>
            <option value={currentMonthStr} className="bg-neutral-950 text-white">Current Month ({currentMonthStr})</option>
            {availableMonths
              .filter((m) => m !== currentMonthStr)
              .map((m) => (
                <option key={m} value={m} className="bg-neutral-950 text-white">
                  Statement Period ({m})
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Info banner if active selected month has 0 transactions but user has transactions in other months */}
      {monthlyTransactions.length === 0 && availableMonths.length > 0 && selectedMonth !== 'ALL' && (
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-300">
          <span>
            💡 <strong>Notice:</strong> No transactions logged for <strong>{selectedMonth}</strong>. Your uploaded bank statement transactions are in <strong>{availableMonths.join(', ')}</strong>.
          </span>
          <button
            onClick={() => setSelectedMonth('ALL')}
            className="px-3 py-1 bg-emerald-500 text-black font-semibold rounded-md hover:bg-emerald-400 transition-all text-xs self-start sm:self-auto shrink-0"
          >
            View All-Time Data
          </button>
        </div>
      )}

      {/* 1. Summary Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Monthly Income */}
        <div className="bg-neutral-950 border border-neutral-900 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-[11px] font-medium uppercase tracking-wider">
            <span>Monthly Income</span>
            <Wallet className="w-3.5 h-3.5 text-emerald-500/60" />
          </div>
          <div className="text-xl font-semibold text-emerald-400">₹{monthlyIncome.toLocaleString()}</div>
          <p className="text-[11px] text-neutral-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" /> {selectedMonth === currentMonthStr ? 'Current Month' : 'Selected Period'}
          </p>
        </div>

        {/* Total Expenses */}
        <div className="bg-neutral-950 border border-neutral-900 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-[11px] font-medium uppercase tracking-wider">
            <span>Total Expenses</span>
            <TrendingDown className="w-3.5 h-3.5 text-red-500/60" />
          </div>
          <div className="text-xl font-semibold text-red-400">₹{totalExpenses.toLocaleString()}</div>
          <p className="text-[11px] text-neutral-600">{expenseTx.length} records in period</p>
        </div>

        {/* Savings */}
        <div className="bg-neutral-950 border border-neutral-900 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-[11px] font-medium uppercase tracking-wider">
            <span>Savings</span>
            <PiggyBank className="w-3.5 h-3.5 text-blue-500/60" />
          </div>
          <div className="text-xl font-semibold text-blue-400">₹{savings.toLocaleString()}</div>
          <p className="text-[11px] text-neutral-600">Income minus expenses</p>
        </div>

        {/* Savings Rate */}
        <div className="bg-neutral-950 border border-neutral-900 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-[11px] font-medium uppercase tracking-wider">
            <span>Savings Rate</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-purple-500/60" />
          </div>
          <div className="text-xl font-semibold text-purple-400">{savingsRate}%</div>
          <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, savingsRate))}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 2. Expense Analytics & Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Spending by Category (Pie Chart & List) */}
        <div className="bg-neutral-950 border border-neutral-900 p-4 rounded-xl space-y-3 flex flex-col justify-between">
          <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Spending by Category ({selectedMonth})</h3>
          {categoryChartData.length > 0 ? (
            <div className="flex-1 flex flex-col justify-center">
              <div className="h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '0.5rem', color: '#fff', fontSize: '12px' }}
                      formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Spent']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-3 border-t border-neutral-900">
                {categoryChartData.map((item, idx) => (
                  <div key={item.name} className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                    ></span>
                    <span>{item.name}:</span>
                    <strong className="text-neutral-200">₹{item.value.toLocaleString()}</strong>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-neutral-600 space-y-1">
              <Receipt className="w-8 h-8 stroke-1 text-neutral-700" />
              <p className="text-xs">No expense data for this month</p>
            </div>
          )}
        </div>

        {/* Budgets vs Actual Spent */}
        <div className="bg-neutral-950 border border-neutral-900 p-4 rounded-xl space-y-3 flex flex-col justify-between">
          <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Budgets vs Actual Spent</h3>
          {budgetVsSpendingData.length > 0 ? (
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetVsSpendingData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#18181b" />
                  <XAxis dataKey="category" stroke="#71717a" fontSize={11} />
                  <YAxis stroke="#71717a" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '0.5rem', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="Limit" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Spent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-60 flex flex-col items-center justify-center text-neutral-600 space-y-1">
              <PlusCircle className="w-8 h-8 stroke-1 text-neutral-700" />
              <p className="text-xs">No budgets active for this month</p>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Trends Chart */}
      {monthlyTrendData.length > 0 && (
        <div className="bg-neutral-950 border border-neutral-900 p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Monthly Spending Trends (Historical)</h3>
            <BarChart3 className="w-4 h-4 text-emerald-500/60" />
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#18181b" />
                <XAxis dataKey="month" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '0.5rem', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="Spent" stroke="#10b981" fillOpacity={1} fill="url(#colorSpent)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 3. Recent Transactions Table */}
      <div className="bg-neutral-950 border border-neutral-900 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-neutral-900">
          <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Recent Transactions</h3>
        </div>
        {monthlyTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="text-[11px] uppercase text-neutral-600 border-b border-neutral-900 bg-neutral-950">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Date</th>
                  <th className="px-4 py-2.5 font-medium">Merchant</th>
                  <th className="px-4 py-2.5 font-medium">Category</th>
                  <th className="px-4 py-2.5 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {monthlyTransactions.slice(0, 5).map((t) => {
                  const isInc = (t.category || '').toLowerCase() === 'income' || (t.type || '').toLowerCase() === 'income';

                  return (
                    <tr key={t.id || Math.random()} className="border-b border-neutral-900/50 hover:bg-neutral-900/30 transition-colors">
                      <td className="px-4 py-2.5 text-neutral-500 text-xs">
                        {t.date ? new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-4 py-2.5 font-medium text-neutral-200">{t.merchant || 'Unknown'}</td>
                      <td className="px-4 py-2.5 text-neutral-400 text-xs">
                        <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                          {t.category || 'Other'}
                        </span>
                      </td>
                      <td className={`px-4 py-2.5 text-right font-medium ${isInc ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isInc ? '+' : '-'}₹{Number(t.amount || 0).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-neutral-600 text-center py-8">
            No transactions found for this month. Add transactions or upload receipts to view activity.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;