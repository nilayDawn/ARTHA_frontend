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
      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error('Failed to delete goal:', err);
      alert('Failed to delete goal.');
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Financial Goals</h1>
          <p className="text-sm text-slate-400">Track savings targets, deadlines, and milestone progress</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-4 py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/10 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          New Goal
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Total Target</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">₹{totalTarget.toLocaleString()}</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Total Saved</span>
            <PiggyBank className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-sky-400">₹{totalSaved.toLocaleString()}</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Overall Progress</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{avgProgress}%</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Achieved Goals</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{completedGoalsCount} / {goals.length}</div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Goals Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48 text-slate-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
          <span>Loading goals...</span>
        </div>
      ) : goals.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-12 rounded-xl text-center space-y-3">
          <Target className="w-12 h-12 mx-auto stroke-1 text-slate-600" />
          <p className="text-slate-400 font-medium">No financial goals set yet</p>
          <p className="text-xs text-slate-500">Create goals like Emergency Fund, Vacation, or Major Purchases.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map((g) => {
            const target = Number(g.target_amount || 0);
            const saved = Number(g.saved_amount || 0);
            const percent = target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0;
            const remaining = Math.max(0, target - saved);
            const isCompleted = saved >= target;

            return (
              <div
                key={g.id}
                className={`bg-slate-900 border ${
                  isCompleted ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-slate-800'
                } rounded-2xl p-5 shadow-lg space-y-4 hover:border-slate-700 transition flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white text-base flex items-center gap-2">
                        {g.goal_name}
                        {isCompleted && (
                          <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                            Achieved!
                          </span>
                        )}
                      </h3>
                      {g.deadline && (
                        <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          Target: {new Date(g.deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(g.id)}
                      disabled={deletingId === g.id}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition disabled:opacity-50"
                      title="Delete Goal"
                    >
                      {deletingId === g.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-emerald-400">Saved: ₹{saved.toLocaleString()}</span>
                      <span className="text-slate-400">Target: ₹{target.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {isCompleted ? (
                      <span className="text-emerald-400 font-semibold">100% Reached</span>
                    ) : (
                      <>Remaining: <strong className="text-slate-200">₹{remaining.toLocaleString()}</strong></>
                    )}
                  </span>
                  <button
                    onClick={() => {
                      setDepositGoal(g);
                      setDepositAmount('');
                    }}
                    className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                Create New Goal
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Goal Name *</label>
                <input
                  type="text"
                  required
                  name="goal_name"
                  placeholder="e.g. Emergency Fund, New Laptop, Japan Trip"
                  value={formData.goal_name}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Amount (₹) *</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  required
                  name="target_amount"
                  placeholder="e.g. 50000"
                  value={formData.target_amount}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Already Saved (₹)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  name="saved_amount"
                  placeholder="0"
                  value={formData.saved_amount}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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
                  {submitting ? 'Creating...' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Savings / Deposit Modal */}
      {depositGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-emerald-400" />
                Add Savings to "{depositGoal.goal_name}"
              </h3>
              <button
                onClick={() => setDepositGoal(null)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Contribution Amount (₹) *</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  required
                  placeholder="e.g. 2000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                  autoFocus
                />
              </div>

              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800 text-xs text-slate-400 flex justify-between">
                <span>Current Saved: <strong>₹{Number(depositGoal.saved_amount || 0).toLocaleString()}</strong></span>
                <span>New Total: <strong>₹{(Number(depositGoal.saved_amount || 0) + Number(depositAmount || 0)).toLocaleString()}</strong></span>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setDepositGoal(null)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingGoal}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-semibold px-5 py-2 rounded-xl transition shadow-lg shadow-emerald-500/10 cursor-pointer"
                >
                  {updatingGoal && <Loader2 className="w-4 h-4 animate-spin" />}
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
