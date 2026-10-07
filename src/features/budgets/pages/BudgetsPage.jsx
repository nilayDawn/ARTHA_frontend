import { useState, useEffect, useMemo } from 'react';
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
  Sparkles,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectCategories,
  selectBudgetsList,
  selectBudgetsLoading,
  selectFinancialSummary,
  fetchBudgetsThunk,
  createBudgetThunk,
  deleteBudgetThunk,
  fetchFinancialSummary,
} from '@/redux/slices/financeSlice';
import { getCurrentMonthStr } from '@/utils/financeUtils';
import PageHeader from '@/components/common/PageHeader';
import ErrorAlert from '@/components/common/ErrorAlert';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import EmptyState from '@/components/common/EmptyState';
import SEOHead from '@/components/common/SEOHead';
import CustomSelect from '@/components/common/CustomSelect';

export default function BudgetsPage() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const budgets = useAppSelector(selectBudgetsList);
  const summary = useAppSelector(selectFinancialSummary);
  const loading = useAppSelector(selectBudgetsLoading);
  const currentMonthStr = getCurrentMonthStr();

  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    category: categories[0] || 'Food & Dining',
    monthly_limit: '',
    month: currentMonthStr,
  });

  useEffect(() => {
    dispatch(fetchBudgetsThunk({ month: currentMonthStr }));
    dispatch(fetchFinancialSummary(currentMonthStr));
  }, [dispatch, currentMonthStr]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.monthly_limit || Number(formData.monthly_limit) <= 0) return;

    try {
      setSubmitting(true);
      await dispatch(
        createBudgetThunk({
          category: formData.category,
          monthly_limit: parseFloat(formData.monthly_limit),
          month: formData.month || currentMonthStr,
        })
      ).unwrap();
      setIsModalOpen(false);
      setFormData({
        category: categories[0] || 'Food & Dining',
        monthly_limit: '',
        month: currentMonthStr,
      });
      dispatch(fetchFinancialSummary(currentMonthStr));
    } catch (err) {
      console.error('Failed to create budget:', err);
      const msg = err || 'Failed to create budget. Budget for this category/month might already exist.';
      setError(msg);
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this budget limit?')) return;
    try {
      setDeletingId(id);
      await dispatch(deleteBudgetThunk(id)).unwrap();
      dispatch(fetchFinancialSummary(currentMonthStr));
    } catch (err) {
      console.error('Failed to delete budget:', err);
      const msg = err || 'Failed to delete budget.';
      setError(msg);
      alert(msg);
    } finally {
      setDeletingId(null);
    }
  };

  // Helper to compute category spending from pre-calculated summary
  const getCategorySpending = (category) => {
    const breakdown = summary?.category_breakdown || summary?.category_spending;
    if (!breakdown) return 0;
    const catLower = category.toLowerCase();
    const matched = Object.keys(breakdown).find((k) => {
      const kLower = k.toLowerCase();
      if (catLower.includes('food') && (kLower.includes('food') || kLower.includes('dining') || kLower.includes('restaurant'))) {
        return true;
      }
      return kLower === catLower;
    });
    return matched ? Number(breakdown[matched] || 0) : 0;
  };

  // Days remaining in current calendar month
  const now = new Date();
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysRemaining = Math.max(1, lastDayOfMonth - now.getDate());

  // Overall metrics for current month
  const totalLimit = budgets.reduce((sum, b) => sum + Number(b.monthly_limit || 0), 0);
  const totalSpentInBudgets = budgets.reduce((sum, b) => {
    const spent = getCategorySpending(b.category);
    return sum + spent;
  }, 0);
  const remainingTotal = totalLimit - totalSpentInBudgets;
  const overallUtilization = totalLimit > 0 ? Math.round((totalSpentInBudgets / totalLimit) * 100) : 0;

  // AI Alerts Generator
  const aiAlerts = budgets
    .map((b) => {
      const spent = getCategorySpending(b.category);
      const limit = Number(b.monthly_limit || 0);
      const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
      return {
        category: b.category,
        percent,
        message: `${b.category} spending reached ${percent}% of your monthly limit with ${daysRemaining} days remaining.`,
      };
    })
    .filter((alert) => alert.percent >= 75);

  const categoryOptions = useMemo(() => {
    return categories
      .filter((c) => c.toLowerCase() !== 'income')
      .map((c) => ({ label: c, value: c }));
  }, [categories]);

  if (loading && budgets.length === 0) {
    return <SkeletonLoader type="page" />;
  }

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

      {error && <ErrorAlert message={error} />}

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
            <CheckCircle2 className={`w-3.5 h-3.5 ${remainingTotal >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
          </div>
          <div
            className={`text-2xl font-bold tracking-tight ${remainingTotal >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
          >
            {remainingTotal >= 0 ? '' : '-'}₹{Math.abs(remainingTotal).toLocaleString()}
          </div>
        </div>

        <div className="artha-card p-3.5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-1">
            <span>Utilization</span>
            <AlertTriangle
              className={`w-3.5 h-3.5 ${overallUtilization >= 80 ? 'text-amber-400' : 'text-purple-400'}`}
            />
          </div>
          <div className="text-2xl font-bold text-purple-400 tracking-tight">{overallUtilization}%</div>
          <div className="w-full bg-neutral-900 h-1 rounded-full overflow-hidden border border-white/[0.04] mt-1.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                overallUtilization >= 100
                  ? 'bg-red-500'
                  : overallUtilization >= 80
                    ? 'bg-amber-500'
                    : 'bg-purple-500'
              }`}
              style={{ width: `${Math.min(100, overallUtilization)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Budgets Grid */}
      {budgets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => {
            const spent = getCategorySpending(b.category);
            const limit = Number(b.monthly_limit || 0);
            const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
            const remaining = limit - spent;
            const isOver = remaining < 0;

            return (
              <div key={b.id} className="artha-card p-4 rounded-xl space-y-3 relative group">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{b.category}</h3>
                    <p className="text-[11px] text-slate-400">Monthly budget for {b.month || currentMonthStr}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(b.id)}
                    disabled={deletingId === b.id}
                    className="text-slate-500 hover:text-red-400 transition p-1 rounded-lg hover:bg-neutral-900 cursor-pointer"
                  >
                    {deletingId === b.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">
                      Spent: <strong className="text-white">₹{spent.toLocaleString()}</strong>
                    </span>
                    <span className="text-slate-400">
                      Limit: <strong className="text-white">₹{limit.toLocaleString()}</strong>
                    </span>
                  </div>

                  <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden border border-white/[0.04]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percent >= 100 ? 'bg-red-500' : percent >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, percent)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/[0.04]">
                  <span className={`font-medium ${isOver ? 'text-red-400' : 'text-emerald-400'}`}>
                    {isOver ? `Over by ₹${Math.abs(remaining).toLocaleString()}` : `₹${remaining.toLocaleString()} left`}
                  </span>
                  <span className="text-slate-500">{percent}% utilized</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={PieChart}
          title="No Budgets Active"
          description="Create monthly category budgets to keep spending disciplined and receive automated warnings."
          actionText="Create First Budget"
          onAction={() => setIsModalOpen(true)}
        />
      )}

      {/* Create Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="artha-card rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-white mb-4">Set Category Budget</h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                <CustomSelect
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  options={categoryOptions}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Monthly Limit (₹)</label>
                <input
                  type="number"
                  name="monthly_limit"
                  min="1"
                  max="100000000"
                  step="any"
                  required
                  placeholder="e.g. 15000"
                  value={formData.monthly_limit}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-900 border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Month Period</label>
                <input
                  type="month"
                  name="month"
                  value={formData.month}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-900 border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-neutral-900 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl text-xs transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
