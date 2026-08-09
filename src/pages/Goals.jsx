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
  AlertCircle,
  PlusCircle
} from 'lucide-react';
import { getGoals, createGoal, updateGoal, deleteGoal } from '../services/api';

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white tracking-tight">Financial Goals</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Track MacBook Purchase, Emergency Fund, Education & Vacation savings</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-3.5 py-2 rounded-lg text-[13px] transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          New Goal
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-neutral-950 border border-neutral-900 p-3.5 rounded-xl">
          <div className="flex items-center justify-between text-neutral-500 text-[11px] font-medium uppercase tracking-wider mb-1">
            <span>Target</span>
            <Target className="w-3.5 h-3.5 text-emerald-500/50" />
          </div>
          <div className="text-lg font-semibold text-white">₹{totalTarget.toLocaleString()}</div>
        </div>

        <div className="bg-neutral-950 border border-neutral-900 p-3.5 rounded-xl">
          <div className="flex items-center justify-between text-neutral-500 text-[11px] font-medium uppercase tracking-wider mb-1">
            <span>Saved</span>
            <PiggyBank className="w-3.5 h-3.5 text-blue-500/50" />
          </div>
          <div className="text-lg font-semibold text-blue-400">₹{totalSaved.toLocaleString()}</div>
        </div>

        <div className="bg-neutral-950 border border-neutral-900 p-3.5 rounded-xl">
          <div className="flex items-center justify-between text-neutral-500 text-[11px] font-medium uppercase tracking-wider mb-1">
            <span>Progress</span>
            <TrendingUp className="w-3.5 h-3.5 text-purple-500/50" />
          </div>
          <div className="text-lg font-semibold text-white">{avgProgress}%</div>
        </div>

        <div className="bg-neutral-950 border border-neutral-900 p-3.5 rounded-xl">
          <div className="flex items-center justify-between text-neutral-500 text-[11px] font-medium uppercase tracking-wider mb-1">
            <span>Achieved</span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500/50" />
          </div>
          <div className="text-lg font-semibold text-emerald-400">{completedGoalsCount} / {goals.length}</div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="py-2.5 px-3.5 bg-red-500/5 border border-red-500/10 text-red-400 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Goals Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-40 text-neutral-500 gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
          <span className="text-xs">Loading goals...</span>
        </div>
      ) : goals.length === 0 ? (
        <div className="bg-neutral-950 border border-neutral-900 py-16 rounded-xl text-center space-y-2">
          <Target className="w-8 h-8 mx-auto stroke-1 text-neutral-700" />
          <p className="text-neutral-500 text-[13px]">No financial goals set yet</p>
          <p className="text-neutral-600 text-[11px]">Create savings goals like MacBook Purchase or Emergency Fund</p>
        </div>
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
                className={`bg-neutral-950 border ${
                  isCompleted ? 'border-emerald-500/30' : 'border-neutral-900'
                } rounded-xl p-4 space-y-3 hover:border-neutral-800 transition-colors flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white text-sm flex items-center gap-1.5">
                        {g.goal_name}
                        {isCompleted && (
                          <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-emerald-500/10 text-emerald-400 rounded">
                            Done
                          </span>
                        )}
                      </h3>
                      <p className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-neutral-600" />
                        Expected completion: <span className="text-neutral-300 font-medium">{expectedCompletion}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(g.id)}
                      disabled={deletingId === g.id}
                      className="p-1 text-neutral-600 hover:text-red-400 rounded transition-colors disabled:opacity-30 cursor-pointer"
                      title="Delete Goal"
                    >
                      {deletingId === g.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-1 bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-900">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-400">Target:</span>
                      <span className="font-semibold text-white">₹{target.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-400">Saved:</span>
                      <span className="font-semibold text-emerald-400">₹{saved.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs pt-1 border-t border-neutral-800/60">
                      <span className="text-neutral-400">Progress:</span>
                      <span className="font-bold text-purple-400">{percent}%</span>
                    </div>
                  </div>

                  <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-900 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-500">
                    {isCompleted ? (
                      <span className="text-emerald-400 font-medium">Goal Achieved!</span>
                    ) : (
                      <>Remaining: <strong className="text-neutral-300">₹{(target - saved).toLocaleString()}</strong></>
                    )}
                  </span>
                  <button
                    onClick={() => {
                      setDepositGoal(g);
                      setDepositAmount('');
                    }}
                    className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-black px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-3 h-3" />
                    Add Savings
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Create Financial Goal</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-500 hover:text-neutral-300 p-1 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-neutral-400 mb-1 uppercase tracking-wider">Goal Name *</label>
                <input
                  type="text"
                  required
                  name="goal_name"
                  placeholder="e.g. MacBook Purchase"
                  value={formData.goal_name}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700"
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
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700"
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
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-400 mb-1 uppercase tracking-wider">Target Completion Date</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-700"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-[13px] text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold px-4 py-1.5 rounded-lg text-[13px] transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Add Savings to "{depositGoal.goal_name}"</h3>
              <button
                onClick={() => setDepositGoal(null)}
                className="text-neutral-500 hover:text-neutral-300 p-1 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-3">
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
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700"
                  autoFocus
                />
              </div>

              <div className="p-2.5 bg-neutral-900 rounded-lg text-xs text-neutral-400 flex justify-between">
                <span>Current Saved: <strong className="text-neutral-200">₹{Number(depositGoal.saved_amount || 0).toLocaleString()}</strong></span>
                <span>New Total: <strong className="text-emerald-400">₹{(Number(depositGoal.saved_amount || 0) + Number(depositAmount || 0)).toLocaleString()}</strong></span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setDepositGoal(null)}
                  className="px-3 py-1.5 text-[13px] text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingGoal}
                  className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold px-4 py-1.5 rounded-lg text-[13px] transition-colors cursor-pointer"
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
