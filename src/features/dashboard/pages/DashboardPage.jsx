import { useEffect, useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  ArrowUpRight,
  Receipt,
  BarChart3,
  Calendar,
  Sparkles,
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
  Area,
} from 'recharts';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectSelectedMonth,
  setSelectedMonth,
  selectFinancialSummary,
  fetchFinancialSummary,
  selectTransactionsList,
  fetchTransactionsThunk,
  selectBudgetsList,
  fetchBudgetsThunk,
} from '@/redux/slices/financeSlice';
import SEOHead from '@/components/common/SEOHead';
import CustomSelect from '@/components/common/CustomSelect';
import SkeletonLoader from '@/components/common/SkeletonLoader';

const CATEGORY_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#64748b'];

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const selectedMonth = useAppSelector(selectSelectedMonth);
  const summaryData = useAppSelector(selectFinancialSummary);
  const transactions = useAppSelector(selectTransactionsList);
  const budgets = useAppSelector(selectBudgetsList);

  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const [loading, setLoading] = useState(true);
  const [availableMonths, setAvailableMonths] = useState([currentMonthStr]);

  const recentTransactions = useMemo(() => {
    return (transactions || []).slice(0, 5);
  }, [transactions]);

  // High-performance unified fetch using Redux thunks
  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const params = selectedMonth && selectedMonth !== 'ALL' ? { month: selectedMonth } : {};

        const results = await Promise.allSettled([
          dispatch(fetchFinancialSummary(selectedMonth)),
          dispatch(fetchTransactionsThunk({ ...params, limit: 5 })),
          dispatch(fetchBudgetsThunk(params)),
        ]);

        if (!isMounted) return;
        if (results[0].status === 'fulfilled' && results[0].value?.payload?.active_months) {
          setAvailableMonths(results[0].value.payload.active_months);
        }
      } catch (err) {
        console.error('Error loading dashboard metrics:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboard();
    return () => {
      isMounted = false;
    };
  }, [dispatch, selectedMonth]);

  // Options for custom month selector
  const monthOptions = useMemo(() => {
    const opts = [
      { label: 'All-Time Cumulative', value: 'ALL' },
      { label: `Current Month (${currentMonthStr})`, value: currentMonthStr },
    ];
    availableMonths
      .filter((m) => m !== currentMonthStr && m !== 'ALL')
      .forEach((m) => {
        opts.push({ label: `Statement Period (${m})`, value: m });
      });
    return opts;
  }, [availableMonths, currentMonthStr]);

  // Extract KPIs from cached summary
  const monthlyIncome = summaryData?.total_income ?? 0;
  const totalExpenses = summaryData?.total_expense ?? 0;
  const savings = summaryData?.net_savings ?? Math.max(0, monthlyIncome - totalExpenses);
  const savingsRate = summaryData?.savings_rate ?? (monthlyIncome > 0 ? Math.round((savings / monthlyIncome) * 100) : 0);
  const transactionCount = summaryData?.transaction_count ?? recentTransactions.length;

  // Category Donut Chart Data
  const categoryChartData = useMemo(() => {
    if (!summaryData?.category_breakdown) return [];
    return Object.entries(summaryData.category_breakdown).map(([name, value]) => ({
      name,
      value: Number(value),
    }));
  }, [summaryData]);

  // Budgets vs Actual Spending
  const budgetVsSpendingData = useMemo(() => {
    const breakdown = summaryData?.category_breakdown || {};
    return budgets.map((b) => {
      const bCat = (b.category || '').toLowerCase();
      // Find matching category in breakdown
      const matchedKey = Object.keys(breakdown).find((k) => {
        const kLower = k.toLowerCase();
        if (bCat.includes('food') && (kLower.includes('food') || kLower.includes('dining') || kLower.includes('restaurant'))) {
          return true;
        }
        return kLower === bCat;
      });
      const spent = matchedKey ? breakdown[matchedKey] : 0;
      return {
        category: b.category,
        Limit: Number(b.monthly_limit || b.limit || 0),
        Spent: Number(spent || 0),
      };
    });
  }, [budgets, summaryData]);

  // Daily / Monthly Trend Chart Data
  const trendData = useMemo(() => {
    if (!summaryData?.daily_trend) return [];
    return Object.entries(summaryData.daily_trend).map(([day, amount]) => ({
      day,
      Spent: Number(amount),
    }));
  }, [summaryData]);

  if (loading && !summaryData) {
    return <SkeletonLoader type="page" />;
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
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Financial Overview
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Redis Cache
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-normal mt-0.5">
            Real-time analytics with sub-second cached aggregations
          </p>
        </div>

        {/* Custom Month Selector */}
        <div className="w-full sm:w-64 self-start sm:self-auto flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
          <CustomSelect
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            options={monthOptions}
            placeholder="Select Period"
            size="sm"
          />
        </div>
      </div>

      {/* 1. Summary Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Monthly Income */}
        <div className="artha-kpi-income p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
            <span>Monthly Income</span>
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 tracking-tight">₹{monthlyIncome.toLocaleString()}</div>
          <p className="text-[11px] text-slate-500 font-normal flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />{' '}
            {selectedMonth === currentMonthStr ? 'Current Month' : 'Selected Period'}
          </p>
        </div>

        {/* Total Expenses */}
        <div className="artha-kpi-expense p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
            <span>Total Expenses</span>
            <TrendingDown className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400 tracking-tight">₹{totalExpenses.toLocaleString()}</div>
          <p className="text-[11px] text-slate-500 font-normal">{transactionCount} records in period</p>
        </div>

        {/* Savings */}
        <div className="artha-kpi-savings p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
            <span>Savings</span>
            <PiggyBank className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400 tracking-tight">₹{savings.toLocaleString()}</div>
          <p className="text-[11px] text-slate-500 font-normal">Income minus expenses</p>
        </div>

        {/* Savings Rate */}
        <div className="artha-kpi-rate p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
            <span>Savings Rate</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400 tracking-tight">{savingsRate}%</div>
          <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden border border-white/[0.03]">
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
        <div className="artha-card p-4 rounded-xl space-y-3 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,217,165,0.025)_0%,transparent_70%)] pointer-events-none"></div>
          <h3 className="text-[13px] font-semibold text-slate-300 relative z-10">Spending by category</h3>
          {categoryChartData.length > 0 ? (
            <div className="flex-1 flex flex-col justify-center relative z-10">
              <div className="h-52 w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={74}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0D0D0D',
                        borderColor: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '0.75rem',
                        color: '#fff',
                        fontSize: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                      }}
                      formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Spent']}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Donut Center Focal Metric */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[11px] text-slate-500 font-medium">Total Spend</span>
                  <span className="text-xl font-bold text-white tracking-tight mt-0.5">
                    ₹{totalExpenses.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-3 border-t border-white/[0.055]">
                {categoryChartData.map((item, idx) => (
                  <div key={item.name} className="flex items-center gap-1.5 text-[11px] text-slate-400 font-normal">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                    ></span>
                    <span>{item.name}:</span>
                    <strong className="text-slate-200 font-medium">₹{item.value.toLocaleString()}</strong>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-slate-600 space-y-1 relative z-10">
              <Receipt className="w-8 h-8 stroke-1 text-slate-700" />
              <p className="text-xs text-slate-500 font-normal">No expense data for this month</p>
            </div>
          )}
        </div>

        {/* Budgets vs Actual Spent */}
        <div className="artha-card p-4 rounded-xl space-y-3 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.025)_0%,transparent_70%)] pointer-events-none"></div>
          <h3 className="text-[13px] font-semibold text-slate-300 relative z-10">Budgets vs actual spent</h3>
          {budgetVsSpendingData.length > 0 ? (
            <div className="h-60 w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetVsSpendingData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis dataKey="category" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D0D0D',
                      borderColor: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    }}
                  />
                  <Bar dataKey="Limit" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Spent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-60 flex flex-col items-center justify-center text-slate-600 space-y-1 relative z-10">
              <Sparkles className="w-8 h-8 stroke-1 text-slate-700" />
              <p className="text-xs text-slate-500 font-normal">No budgets active for this month</p>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Trends Chart */}
      {trendData.length > 0 && (
        <div className="artha-card p-4 rounded-xl space-y-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,217,165,0.025)_0%,transparent_70%)] pointer-events-none"></div>
          <div className="flex items-center justify-between relative z-10">
            <h3 className="text-[13px] font-semibold text-slate-300">Daily spending trend</h3>
            <BarChart3 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="h-48 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D0D0D',
                    borderColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  }}
                />
                <Area type="monotone" dataKey="Spent" stroke="#10b981" fillOpacity={1} fill="url(#colorSpent)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 3. Recent Transactions Table */}
      <div className="artha-card rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/[0.055]">
          <h3 className="text-[13px] font-semibold text-slate-300">Recent transactions</h3>
        </div>
        {recentTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="text-[11px] uppercase text-slate-500 font-medium border-b border-white/[0.055] bg-[#090909]">
                  <th className="px-4 py-2.5 font-medium">Date</th>
                  <th className="px-4 py-2.5 font-medium">Merchant</th>
                  <th className="px-4 py-2.5 font-medium">Category</th>
                  <th className="px-4 py-2.5 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((t, index) => {
                  const isInc =
                    (t.category || '').toLowerCase() === 'income' || (t.type || '').toLowerCase() === 'income';

                  return (
                    <tr
                      key={t.id || `recent-tx-${index}`}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-2.5 text-slate-500 text-xs font-normal">
                        {t.date
                          ? new Date(t.date).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="px-4 py-2.5 font-medium text-slate-200">{t.merchant || 'Unknown'}</td>
                      <td className="px-4 py-2.5 text-slate-400 text-xs">
                        <span className="px-2 py-0.5 rounded bg-neutral-900 border border-white/[0.065] text-slate-300">
                          {t.category || 'Other'}
                        </span>
                      </td>
                      <td
                        className={`px-4 py-2.5 text-right font-semibold ${isInc ? 'text-emerald-400' : 'text-red-400'}`}
                      >
                        {isInc ? '+' : '-'}₹{Number(t.amount || 0).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-8 font-normal">
            No transactions found for this month. Add transactions or upload receipts to view activity.
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;