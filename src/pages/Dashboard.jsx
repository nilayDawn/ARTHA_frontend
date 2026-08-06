import { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PiggyBank, 
  ArrowUpRight, 
  PlusCircle, 
  Receipt 
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
  CartesianGrid 
} from 'recharts';

const CATEGORY_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [txRes, bgRes, glRes] = await Promise.allSettled([
          api.get('/transactions'),
          api.get('/budgets'),
          api.get('/goals'),
        ]);

        if (txRes.status === 'fulfilled') setTransactions(txRes.value.data);
        if (bgRes.status === 'fulfilled') setBudgets(bgRes.value.data);
        if (glRes.status === 'fulfilled') setGoals(glRes.value.data);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Compute Financial Summaries
  const totalExpenses = transactions.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const monthlyIncome = 60000; // Default benchmark income or can be customized
  const savings = Math.max(0, monthlyIncome - totalExpenses);
  const savingsRate = Math.round((savings / monthlyIncome) * 100);

  // Prepare Category Spending Chart Data
  const categoryMap = transactions.reduce((acc, curr) => {
    const cat = curr.category || 'Other';
    acc[cat] = (acc[cat] || 0) + Number(curr.amount || 0);
    return acc;
  }, {});

  const categoryChartData = Object.keys(categoryMap).map((cat) => ({
    name: cat,
    value: categoryMap[cat],
  }));

  // Prepare Bar Chart Data for Budgets vs Spending
  const budgetVsSpendingData = budgets.map((b) => {
    const spent = transactions
      .filter((t) => t.category?.toLowerCase() === b.category?.toLowerCase())
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);
    return {
      category: b.category,
      Limit: Number(b.monthly_limit || b.limit || 0),
      Spent: spent,
    };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mr-3"></div>
        <span>Loading financial overview...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Income Card */}
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/60 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-slate-400">Monthly Income</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">₹{monthlyIncome.toLocaleString()}</div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 flex items-center"><TrendingUp className="w-3 h-3 mr-0.5" /> Est. Base</span>
          </p>
        </div>

        {/* Total Expenses Card */}
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/60 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-slate-400">Total Expenses</span>
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">₹{totalExpenses.toLocaleString()}</div>
          <p className="text-xs text-slate-400 mt-1">{transactions.length} recorded transactions</p>
        </div>

        {/* Savings Card */}
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/60 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-slate-400">Net Savings</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">₹{savings.toLocaleString()}</div>
          <p className="text-xs text-slate-400 mt-1">Income minus expenses</p>
        </div>

        {/* Savings Rate Card */}
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/60 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-slate-400">Savings Rate</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">{savingsRate}%</div>
          <div className="w-full bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, savingsRate))}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown (Pie Chart) */}
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/60 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Spending by Category</h3>
          {categoryChartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#fff' }}
                    formatter={(value) => [`₹${value}`, 'Amount']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {categoryChartData.map((item, idx) => (
                  <div key={item.name} className="flex items-center gap-1.5 text-xs text-slate-300">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                    ></span>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500">
              <Receipt className="w-10 h-10 mb-2 stroke-1" />
              <p>No expense data available to visualize.</p>
            </div>
          )}
        </div>

        {/* Budget vs Spending (Bar Chart) */}
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/60 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Budgets vs Actual Spent</h3>
          {budgetVsSpendingData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetVsSpendingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="category" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#fff' }}
                  />
                  <Bar dataKey="Limit" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Spent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500">
              <PlusCircle className="w-10 h-10 mb-2 stroke-1" />
              <p>No budgets created yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Recent Transactions Preview Table */}
      <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/60 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-900/50 text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Merchant</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {transactions.slice(0, 5).map((t) => (
                  <tr key={t.id || Math.random()} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 text-slate-400">{t.date ? new Date(t.date).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-4 py-3 font-medium text-white">{t.merchant || 'Unknown'}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 text-xs rounded-full bg-slate-700 text-slate-300 font-medium">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-rose-400">
                      -₹{Number(t.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-6">
            No transactions found. Start adding transactions or uploading receipts.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;