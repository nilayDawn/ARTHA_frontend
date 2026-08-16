import { useState, useEffect } from 'react';
import { 
  Target, 
  Plus, 
  Trash2, 
  PiggyBank, 
  Calendar, 
  CheckCircle, 
  TrendingUp, 
  Loader2, 
  X,
  PlusCircle
} from 'lucide-react';
import { getGoals, createGoal, updateGoal, deleteGoal } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import ErrorAlert from '../components/ui/ErrorAlert';
import LoadingState from '../components/ui/LoadingState';
import EmptyState from '../components/ui/EmptyState';
import SEOHead from '../components/ui/SEOHead';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add Goal Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Deposit/Top-up Modal State
  const [depositGoal, setDepositGoal] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [updatingGoal, setUpdatingGoal] = useState(false);

  const [formData, setFormData] = useState({
    goal_name: '',
    target_amount: '',
    saved_amount: '0',
    deadline: ''
  });

  const fetchGoalsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getGoals();
      setGoals(res.data || []);
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError('Failed to load financial goals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoalsData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!formData.goal_name.trim() || !formData.target_amount || Number(formData.target_amount) <= 0) return;

    try {
      setSubmitting(true);
      await createGoal({
        goal_name: formData.goal_name.trim(),
        target_amount: parseFloat(formData.target_amount),
        saved_amount: formData.saved_amount ? parseFloat(formData.saved_amount) : 0,
        deadline: formData.deadline || null
      });
      setIsAddModalOpen(false);
      setFormData({
        goal_name: '',
        target_amount: '',
        saved_amount: '0',
        deadline: ''
      });
      await fetchGoalsData();
    } catch (err) {
      console.error('Failed to create goal:', err);
      alert(err.response?.data?.detail || 'Failed to create goal.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    if (!depositGoal || !depositAmount || Number(depositAmount) <= 0) return;

    try {
      setUpdatingGoal(true);
      const newSaved = Number(depositGoal.saved_amount || 0) + parseFloat(depositAmount);
      await updateGoal(depositGoal.id, { saved_amount: newSaved });
      setDepositGoal(null);
      setDepositAmount('');
      await fetchGoalsData();
    } catch (err) {
      console.error('Failed to update goal progress:', err);
      alert('Failed to update savings for this goal.');
    } finally {
      setUpdatingGoal(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this financial goal?')) return;
    try {
      setDeletingId(id);
      await deleteGoal(id);
      setGoals((prev) => prev.filter((g) => String(g.id) !== String(id)));
    } catch (err) {
      console.error('Failed to delete goal:', err);
      alert(err.response?.data?.detail || 'Failed to delete goal.');
    } finally {
      setDeletingId(null);
    }
  };

  // Overall metrics
  const totalTarget = goals.reduce((sum, g) => sum + Number(g.target_amount || 0), 0);
  const totalSaved = goals.reduce((sum, g) => sum + Number(g.saved_amount || 0), 0);
  const completedGoalsCount = goals.filter((g) => Number(g.saved_amount || 0) >= Number(g.target_amount || 0)).length;
  const avgProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <div className="space-y-5 w-full max-w-7xl mx-auto">
      <SEOHead
        title="Savings Goals"
        description="Set financial targets, track deposit progress, and manage emergency funds and major purchase milestones."
      />
      {/* Header */}
      <PageHeader
        title="Financial Goals"
        subtitle="Track MacBook Purchase, Emergency Fund, Education & Vacation savings"
        action={
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-3.5 py-2 rounded-lg text-[13px] transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            New Goal
          </button>
        }
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="artha-card p-3.5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-1">
            <span>Target</span>
            <Target className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">₹{totalTarget.toLocaleString()}</div>
        </div>

        <div className="artha-card p-3.5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-1">
            <span>Saved</span>
            <PiggyBank className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400 tracking-tight">₹{totalSaved.toLocaleString()}</div>
        </div>

        <div className="artha-card p-3.5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-1">
            <span>Progress</span>
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400 tracking-tight">{avgProgress}%</div>
        </div>

        <div className="artha-card p-3.5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-1">
            <span>Achieved</span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 tracking-tight">{completedGoalsCount} / {goals.length}</div>
        </div>
      </div>

      {/* Error */}
      <ErrorAlert message={error} />

      {/* Goals Grid */}
      {loading ? (
        <LoadingState message="Loading goals..." />
      ) : goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No financial goals set yet"
          subtitle="Create savings goals like MacBook Purchase or Emergency Fund"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {goals.map((g) => {
            const target = Number(g.target_amount || 0);
            const saved = Number(g.saved_amount || 0);
            const percent = target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0;
            const isCompleted = saved >= target;

            // Format Expected Completion Date
            let expectedCompletion = 'November 2026';
            if (g.deadline) {
              expectedCompletion = new Date(g.deadline).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
            }

            return (
              <div
                key={g.id}
                className={`artha-card ${
                  isCompleted ? 'border-emerald-500/35 shadow-[0_8px_30px_rgba(0,217,165,0.08)]' : ''
                } rounded-xl p-4 space-y-3 flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white text-sm flex items-center gap-1.5">
                        {g.goal_name}
                        {isCompleted && (
                          <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20">
                            Done
                          </span>
                        )}
                      </h3>
                      <p className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-neutral-500" />
                        Expected completion: <span className="text-neutral-300 font-medium">{expectedCompletion}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(g.id)}
                      disabled={deletingId === g.id}
                      className="p-1 text-neutral-500 hover:text-red-400 rounded transition-colors disabled:opacity-30 cursor-pointer artha-btn-interactive"
                      title="Delete Goal"
                    >
                      {deletingId === g.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-1 bg-neutral-900/60 p-2.5 rounded-lg border border-white/[0.05]">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-400">Target:</span>
                      <span className="font-semibold text-white">₹{target.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-400">Saved:</span>
                      <span className="font-semibold text-emerald-400">₹{saved.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs pt-1 border-t border-white/[0.05]">
                      <span className="text-neutral-400">Progress:</span>
                      <span className="font-bold text-purple-400">{percent}%</span>
                    </div>
                  </div>

                  <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden border border-white/[0.03]">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.055] flex items-center justify-between">
                  <span className="text-[11px] text-neutral-500">
                    {isCompleted ? (
                      <span className="text-emerald-400 font-medium">Goal Achieved!</span>
                    ) : (
                      <>Remaining: <strong className="text-neutral-300">₹{(target - saved).toLocaleString()}</strong></>
                    )}
                  </span>
                  {isCompleted ? (
                    <button
                      disabled
                      className="flex items-center gap-1.5 bg-neutral-900/80 border border-white/[0.08] text-neutral-400 px-3 py-1 rounded-lg text-[11px] font-medium cursor-not-allowed opacity-80"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      Goal Completed
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setDepositGoal(g);
                        setDepositAmount('');
                      }}
                      className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-black px-2.5 py-1 rounded-lg text-[11px] font-semibold artha-btn-interactive shadow-sm cursor-pointer"
                    >
                      <PlusCircle className="w-3 h-3" />
                      Add Savings
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="artha-glass rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.055]">
              <h3 className="text-sm font-semibold text-white">Create Financial Goal</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-medium text-neutral-400 mb-1 uppercase tracking-wider">Goal Name *</label>
                <input
                  type="text"
                  required
                  name="goal_name"
                  placeholder="e.g. MacBook Purchase"
                  value={formData.goal_name}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-900 border border-white/[0.08] focus:border-emerald-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-400 mb-1 uppercase tracking-wider">Target Amount (₹) *</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  required
                  name="target_amount"
                  placeholder="100000"
                  value={formData.target_amount}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-900 border border-white/[0.08] focus:border-emerald-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-400 mb-1 uppercase tracking-wider">Already Saved (₹)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  name="saved_amount"
                  placeholder="45000"
                  value={formData.saved_amount}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-900 border border-white/[0.08] focus:border-emerald-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-400 mb-1 uppercase tracking-wider">Target Completion Date</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-900 border border-white/[0.08] focus:border-emerald-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/[0.055]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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
                  {submitting ? 'Creating...' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Savings Modal */}
      {depositGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="artha-glass rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.055]">
              <h3 className="text-sm font-semibold text-white">Add Savings to "{depositGoal.goal_name}"</h3>
              <button
                onClick={() => setDepositGoal(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-medium text-neutral-400 mb-1 uppercase tracking-wider">Amount (₹) *</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  required
                  placeholder="5000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/[0.08] focus:border-emerald-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none transition-colors"
                  autoFocus
                />
              </div>

              <div className="p-3 bg-neutral-900/80 rounded-xl border border-white/[0.05] text-xs text-neutral-400 flex justify-between">
                <span>Current Saved: <strong className="text-neutral-200">₹{Number(depositGoal.saved_amount || 0).toLocaleString()}</strong></span>
                <span>New Total: <strong className="text-emerald-400">₹{(Number(depositGoal.saved_amount || 0) + Number(depositAmount || 0)).toLocaleString()}</strong></span>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/[0.055]">
                <button
                  type="button"
                  onClick={() => setDepositGoal(null)}
                  className="px-3.5 py-2 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingGoal}
                  className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold px-4 py-2 rounded-xl text-xs artha-btn-interactive shadow-[0_4px_14px_rgba(0,217,165,0.22)] cursor-pointer"
                >
                  {updatingGoal && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {updatingGoal ? 'Saving...' : 'Add to Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
