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
  Sparkles
} from 'lucide-react';
import { getBudgets, createBudget, deleteBudget, getTransactions } from '../services/api';
import { getCategorySpendingForMonth, getCurrentMonthStr } from '../utils/financeUtils';
import PageHeader from '../components/ui/PageHeader';
import ErrorAlert from '../components/ui/ErrorAlert';
import LoadingState from '../components/ui/LoadingState';
import EmptyState from '../components/ui/EmptyState';
import SEOHead from '../components/ui/SEOHead';
import CustomSelect from '../components/ui/CustomSelect';

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
      setError('Failed to load budget data from server.');
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
      setBudgets((prev) => prev.filter((b) => String(b.id) !== String(id)));
    } catch (err) {
      console.error('Failed to delete budget:', err);
      alert(err.response?.data?.detail || 'Failed to delete budget.');
    } finally {
      setDeletingId(null);
    }
  };

  // Helper to compute category spending using modular financeUtils
  const getCategorySpending = (category, budgetMonth) => {
    return getCategorySpendingForMonth(transactions, category, budgetMonth);
  };

  // Days remaining calculation
  const now = new Date();
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysRemaining = Math.max(1, lastDayOfMonth - now.getDate());

  // Overall metrics for current month
  const totalLimit = budgets.reduce((sum, b) => sum + Number(b.monthly_limit || 0), 0);
  const totalSpentInBudgets = budgets.reduce((sum, b) => {
    const spent = getCategorySpending(b.category, b.month);
    return sum + spent;
  }, 0);
  const remainingTotal = totalLimit - totalSpentInBudgets;
  const overallUtilization = totalLimit > 0 ? Math.round((totalSpentInBudgets / totalLimit) * 100) : 0;

  // AI Alerts Generator
  const aiAlerts = budgets.map((b) => {
    const spent = getCategorySpending(b.category, b.month);
    const limit = Number(b.monthly_limit || 0);
    const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
    return {
      category: b.category,
      percent,
      message: `${b.category} spending reached ${percent}% of your monthly limit with ${daysRemaining} days remaining.`
    };
  }).filter((alert) => alert.percent >= 75);

  return (
    <div className="space-y-5 w-full max-w-7xl mx-auto">
      <SEOHead
        title="Budgets"
        description="Set category spending limits, receive automated AI budget utilization alerts, and track remaining monthly allowances."
      />
      {/* Header */}
      <PageHeader
        title="Budget Management"
        subtitle="Set category budget limits (resets automatically every month)"
        action={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-3.5 py-2 rounded-lg text-[13px] artha-btn-interactive shadow-[0_4px_14px_rgba(0,217,165,0.22)] hover:shadow-[0_6px_18px_rgba(0,217,165,0.35)] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            Create Budget
          </button>
        }
      />

      {/* AI Progress Monitoring Alerts */}
      {aiAlerts.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 space-y-2 text-xs shadow-md">
          <div className="flex items-center gap-2 font-medium text-amber-400">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>AI Budget Monitor Alert</span>
          </div>
          <div className="space-y-1 pl-6">
            {aiAlerts.map((alert, idx) => (
              <p key={idx} className="text-neutral-300">
                • {alert.message}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="artha-card p-3.5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-1">
            <span>Budget Limit</span>
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">₹{totalLimit.toLocaleString()}</div>
        </div>

        <div className="artha-card p-3.5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-1">
            <span>Total Spent</span>
            <TrendingUp className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400 tracking-tight">₹{totalSpentInBudgets.toLocaleString()}</div>
        </div>

        <div className="artha-card p-3.5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-1">
            <span>Remaining</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className={`text-2xl font-bold tracking-tight ${remainingTotal < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            ₹{remainingTotal.toLocaleString()}
          </div>
        </div>

        <div className="artha-card p-3.5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-1">
            <span>Utilization</span>
            <PieChart className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400 tracking-tight">{overallUtilization}%</div>
          <div className="w-full bg-neutral-900 h-1 rounded-full mt-1.5 overflow-hidden border border-white/[0.03]">
            <div
              className={`h-full rounded-full transition-all duration-500 ${overallUtilization > 100 ? 'bg-red-500' : overallUtilization > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
              style={{ width: `${Math.min(100, Math.max(0, overallUtilization))}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Error */}
      <ErrorAlert message={error} />

      {/* Budget Cards Grid */}
      {loading ? (
        <LoadingState message="Loading budgets..." />
      ) : budgets.length === 0 ? (
        <EmptyState
          icon={PieChart}
          title="No budgets created yet"
          subtitle="Set category limits to track spending"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {budgets.map((b) => {
            const spent = getCategorySpending(b.category, b.month);
            const limit = Number(b.monthly_limit || 0);
            const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
            const remaining = limit - spent;

            let barColor = 'bg-emerald-500';
            let textColor = 'text-emerald-400';
            if (percent >= 100) {
              barColor = 'bg-red-500';
              textColor = 'text-red-400';
            } else if (percent >= 80) {
              barColor = 'bg-amber-500';
              textColor = 'text-amber-400';
            }

            return (
              <div
                key={b.id}
                className="artha-card rounded-xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-white text-[13px]">{b.category}</h3>
                    <span className="text-[11px] text-neutral-500">Month: {b.month || getCurrentMonthStr()}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(b.id)}
                    disabled={deletingId === b.id}
                    className="p-1 text-neutral-500 hover:text-red-400 rounded transition-colors disabled:opacity-30 cursor-pointer artha-btn-interactive"
                    title="Delete Budget"
                  >
                    {deletingId === b.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-400">Spent: ₹{spent.toLocaleString()}</span>
                    <span className="text-neutral-400">Limit: ₹{limit.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden border border-white/[0.03]">
                    <div
                      className={`h-full ${barColor} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  {percent >= 100 ? (
                    <span className="flex items-center gap-1 text-red-400 font-medium">
                      <AlertTriangle className="w-3 h-3" /> Over by ₹{Math.abs(remaining).toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-neutral-400">₹{remaining.toLocaleString()} left</span>
                  )}
                  <span className={`font-medium ${textColor}`}>{percent}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="artha-glass rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.055]">
              <h3 className="text-sm font-semibold text-white">Create Category Budget</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-medium text-neutral-400 mb-1 uppercase tracking-wider">Category *</label>
                <CustomSelect
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  options={CATEGORIES}
                  size="md"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-400 mb-1 uppercase tracking-wider">Monthly Limit (₹) *</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  required
                  name="monthly_limit"
                  placeholder="8000"
                  value={formData.monthly_limit}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-900 border border-white/[0.08] focus:border-emerald-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-400 mb-1 uppercase tracking-wider">Month (YYYY-MM)</label>
                <input
                  type="month"
                  required
                  name="month"
                  value={formData.month}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-900 border border-white/[0.08] focus:border-emerald-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/[0.055]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold px-4 py-2 rounded-xl text-xs artha-btn-interactive shadow-[0_4px_14px_rgba(0,217,165,0.22)] cursor-pointer"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
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
