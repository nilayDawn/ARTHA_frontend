import { useState, useEffect } from 'react';
import { 
  PieChart, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  TrendingUp, 
  Wallet, 
  CheckCircle2, 
  Loader2, 
  X,
  AlertCircle
} from 'lucide-react';
import { getBudgets, createBudget, deleteBudget, getTransactions } from '../services/api';

const CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Utilities',
  'Transport',
  'Entertainment',
  'Health',
  'Education',
  'Subscriptions',
  'Other'
];

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const getCurrentMonthStr = () => new Date().toISOString().slice(0, 7);

  const [formData, setFormData] = useState({
    category: 'Food & Dining',
    monthly_limit: '',
    month: getCurrentMonthStr()
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [bRes, tRes] = await Promise.all([getBudgets(), getTransactions()]);
      setBudgets(bRes.data || []);
      setTransactions(tRes.data || []);
    } catch (err) {
      console.error('Error fetching budgets:', err);
      setError('Failed to load budget data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.monthly_limit || Number(formData.monthly_limit) <= 0) return;

    try {
      setSubmitting(true);
      await createBudget({
        category: formData.category,
        monthly_limit: parseFloat(formData.monthly_limit),
        month: formData.month || getCurrentMonthStr()
      });
      setIsModalOpen(false);
      setFormData({
        category: 'Food & Dining',
        monthly_limit: '',
        month: getCurrentMonthStr()
      });
      await fetchData();
    } catch (err) {
      console.error('Failed to create budget:', err);
      alert(err.response?.data?.detail || 'Failed to create budget. Budget for this category/month might already exist.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this budget limit?')) return;
    try {
      setDeletingId(id);
      await deleteBudget(id);
      setBudgets((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error('Failed to delete budget:', err);
      alert('Failed to delete budget.');
    } finally {
      setDeletingId(null);
    }
  };

  // Compute category spending map
  const categorySpendingMap = transactions.reduce((acc, t) => {
    const cat = t.category || 'Other';
    acc[cat] = (acc[cat] || 0) + Number(t.amount || 0);
    return acc;
  }, {});

  // Overall metrics
  const totalLimit = budgets.reduce((sum, b) => sum + Number(b.monthly_limit || 0), 0);
  const totalSpentInBudgets = budgets.reduce((sum, b) => {
    const spent = categorySpendingMap[b.category] || 0;
    return sum + spent;
  }, 0);
  const remainingTotal = totalLimit - totalSpentInBudgets;
  const overallUtilization = totalLimit > 0 ? Math.round((totalSpentInBudgets / totalLimit) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Budgets</h1>
          <p className="text-sm text-slate-400">Set monthly limits by category & monitor live spending</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-4 py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/10 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Create Budget
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Total Budget Limit</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">₹{totalLimit.toLocaleString()}</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Spent in Budgeted Categories</span>
            <TrendingUp className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400">₹{totalSpentInBudgets.toLocaleString()}</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Remaining Balance</span>
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className={`text-2xl font-bold ${remainingTotal < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            ₹{remainingTotal.toLocaleString()}
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Overall Utilization</span>
            <PieChart className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{overallUtilization}%</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                overallUtilization > 100 ? 'bg-rose-500' : overallUtilization > 80 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, overallUtilization))}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Budget Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48 text-slate-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
          <span>Loading budget limits...</span>
        </div>
      ) : budgets.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-12 rounded-xl text-center space-y-3">
          <PieChart className="w-12 h-12 mx-auto stroke-1 text-slate-600" />
          <p className="text-slate-400 font-medium">No budgets created yet</p>
          <p className="text-xs text-slate-500">Create budget limits for categories to track your spending targets.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {budgets.map((b) => {
            const spent = categorySpendingMap[b.category] || 0;
            const limit = Number(b.monthly_limit || 0);
            const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
            const remaining = limit - spent;

            let statusColor = 'emerald';
            let barColor = 'bg-emerald-500';
            let textColor = 'text-emerald-400';
            if (percent >= 100) {
              statusColor = 'rose';
              barColor = 'bg-rose-500';
              textColor = 'text-rose-400';
            } else if (percent >= 80) {
              statusColor = 'amber';
              barColor = 'bg-amber-500';
              textColor = 'text-amber-400';
            }

            return (
              <div
                key={b.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white text-base">{b.category}</h3>
                    <span className="text-xs text-slate-400">Month: {b.month || 'Current'}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(b.id)}
                    disabled={deletingId === b.id}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition disabled:opacity-50"
                    title="Delete Budget"
                  >
                    {deletingId === b.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">Spent: ₹{spent.toLocaleString()}</span>
                    <span className="text-slate-200">Limit: ₹{limit.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full ${barColor} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center gap-1.5">
                    {percent >= 100 ? (
                      <span className="flex items-center gap-1 text-rose-400 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5" /> Exceeded by ₹{Math.abs(remaining).toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-slate-400">
                        Remaining: <strong className={textColor}>₹{remaining.toLocaleString()}</strong>
                      </span>
                    )}
                  </div>
                  <span className={`font-semibold ${textColor}`}>{percent}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-emerald-400" />
                Create Category Budget
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Monthly Limit (₹) *</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  required
                  name="monthly_limit"
                  placeholder="e.g. 15000"
                  value={formData.monthly_limit}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Month (YYYY-MM)</label>
                <input
                  type="month"
                  required
                  name="month"
                  value={formData.month}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-semibold px-5 py-2 rounded-xl transition shadow-lg shadow-emerald-500/10 cursor-pointer"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Saving...' : 'Set Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
