import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Receipt, 
  ArrowDownRight, 
  ArrowUpRight,
  X,
  Loader2,
  Calendar,
  Edit2,
  Check
} from 'lucide-react';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import ErrorAlert from '../components/ui/ErrorAlert';
import LoadingState from '../components/ui/LoadingState';
import EmptyState from '../components/ui/EmptyState';
import SEOHead from '../components/ui/SEOHead';
import CustomSelect from '../components/ui/CustomSelect';

const CATEGORIES = [
  'Food & Dining',
  'Income',
  'Shopping',
  'Utilities',
  'Transport',
  'Entertainment',
  'Health',
  'Education',
  'Subscriptions',
  'Other'
];

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Inline Category Edit State
  const [editingCategoryTxId, setEditingCategoryTxId] = useState(null);
  const [newCategoryVal, setNewCategoryVal] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    merchant: '',
    category: 'Food & Dining',
    date: new Date().toISOString().split('T')[0],
    source: 'manual'
  });

  // Fetch transactions from backend with DB-level filtering
  const fetchTransactions = useCallback(async (cat = selectedCategory, search = searchTerm, sDate = startDate, eDate = endDate) => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (cat && cat !== 'All') params.category = cat;
      if (search && search.trim()) params.search = search.trim();
      if (sDate) params.start_date = sDate;
      if (eDate) params.end_date = eDate;

      const res = await getTransactions(params);
      setTransactions(res.data || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions from server.');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm, startDate, endDate]);

  // Debounced fetch on filter/search change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransactions(selectedCategory, searchTerm, startDate, endDate);
    }, 200);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchTerm, startDate, endDate, fetchTransactions]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) return;
    
    try {
      setSubmitting(true);
      await createTransaction({
        amount: parseFloat(formData.amount),
        merchant: formData.merchant.trim() || 'Unknown',
        category: formData.category,
        date: formData.date,
        source: formData.source || 'manual'
      });
      setIsModalOpen(false);
      setFormData({
        amount: '',
        merchant: '',
        category: 'Food & Dining',
        date: new Date().toISOString().split('T')[0],
        source: 'manual'
      });
      await fetchTransactions(selectedCategory, searchTerm, startDate, endDate);
    } catch (err) {
      console.error('Failed to create transaction:', err);
      alert(err.response?.data?.detail || 'Failed to add transaction');
    } finally {
      setSubmitting(false);
    }
  };

  // Edit category handler
  const handleSaveCategoryEdit = async (txId) => {
    if (!newCategoryVal) {
      setEditingCategoryTxId(null);
      return;
    }
    try {
      setUpdatingId(txId);
      await updateTransaction(txId, { category: newCategoryVal });
      setTransactions((prev) =>
        prev.map((t) => (String(t.id) === String(txId) ? { ...t, category: newCategoryVal } : t))
      );
      setEditingCategoryTxId(null);
    } catch (err) {
      console.error('Failed to update category:', err);
      alert('Failed to update category');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction record?')) return;
    try {
      setDeletingId(id);
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => String(t.id) !== String(id)));
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      alert(err.response?.data?.detail || 'Failed to delete transaction.');
    } finally {
      setDeletingId(null);
    }
  };

  // Metrics calculation based on backend-filtered dataset
  const totalExpenses = transactions
    .filter((t) => (t.category || '').toLowerCase() !== 'income' && (t.type || '').toLowerCase() !== 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalIncome = transactions
    .filter((t) => (t.category || '').toLowerCase() === 'income' || (t.type || '').toLowerCase() === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  return (
    <div className="space-y-5 w-full max-w-7xl mx-auto">
      <SEOHead
        title="Transactions"
        description="Filter, track, edit, and log personal financial transactions with category classification and real-time income/expense analysis."
      />
      {/* Header */}
      <PageHeader
        title="Transaction Management"
        subtitle="Edit categories, search, filter by date, and manage expenses"
        action={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-3.5 py-2 rounded-lg text-[13px] artha-btn-interactive shadow-[0_4px_14px_rgba(0,217,165,0.22)] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            Add Transaction
          </button>
        }
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3.5">
        <div className="artha-card p-3.5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-1">
            <span>Records</span>
            <Receipt className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{transactions.length}</div>
        </div>

        <div className="artha-card p-3.5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-1">
            <span>Total Spent</span>
            <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400 tracking-tight">₹{totalExpenses.toLocaleString()}</div>
        </div>

        <div className="artha-card p-3.5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-1">
            <span>Total Income</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 tracking-tight">₹{totalIncome.toLocaleString()}</div>
        </div>
      </div>

      {/* Search, Filter & Date Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
        {/* Search */}
        <div className="relative sm:col-span-2">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search merchant, category, or amount..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0D0D0D] border border-white/[0.065] rounded-lg pl-8 pr-3 py-2 text-[13px] text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-emerald-500/50 transition-colors shadow-sm"
          />
        </div>

        {/* Category */}
        <div>
          <CustomSelect
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={['All', ...CATEGORIES]}
            placeholder="All Categories"
            size="md"
          />
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-1">
          <input
            type="date"
            title="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-[#0D0D0D] border border-white/[0.065] text-neutral-400 text-xs rounded-lg px-2 py-2 focus:outline-none focus:border-emerald-500/50 shadow-sm"
          />
          <span className="text-neutral-600 text-xs">-</span>
          <input
            type="date"
            title="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-[#0D0D0D] border border-white/[0.065] text-neutral-400 text-xs rounded-lg px-2 py-2 focus:outline-none focus:border-emerald-500/50 shadow-sm"
          />
        </div>
      </div>

      {/* Error Notification */}
      <ErrorAlert message={error} />

      {/* Data Table */}
      <div className="artha-card rounded-xl overflow-hidden">
        {loading ? (
          <LoadingState message="Loading records..." />
        ) : transactions.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No matching transactions found"
            subtitle="Clear date/category filters or search term"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="text-[11px] uppercase text-neutral-500 border-b border-white/[0.055] bg-[#090909]">
                  <th className="px-4 py-2.5 font-medium">Date</th>
                  <th className="px-4 py-2.5 font-medium">Merchant</th>
                  <th className="px-4 py-2.5 font-medium">Category</th>
                  <th className="px-4 py-2.5 font-medium">Source</th>
                  <th className="px-4 py-2.5 font-medium text-right">Amount</th>
                  <th className="px-4 py-2.5 font-medium text-center w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const isIncome = (tx.category || '').toLowerCase() === 'income' || (tx.type || '').toLowerCase() === 'income';

                  return (
                    <tr key={tx.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-2.5 text-neutral-500 text-xs">
                        {tx.date ? new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-4 py-2.5 font-medium text-neutral-200">{tx.merchant || 'Unknown'}</td>
                      
                      {/* Editable Category */}
                      <td className="px-4 py-2.5 text-neutral-400 text-xs">
                        {editingCategoryTxId === tx.id ? (
                          <div className="flex items-center gap-1">
                            <div className="w-36">
                              <CustomSelect
                                value={newCategoryVal}
                                onChange={(e) => setNewCategoryVal(e.target.value)}
                                options={CATEGORIES}
                                size="sm"
                              />
                            </div>
                            <button
                              onClick={() => handleSaveCategoryEdit(tx.id)}
                              disabled={updatingId === tx.id}
                              className="p-1 text-emerald-400 hover:bg-emerald-500/10 rounded cursor-pointer"
                            >
                              {updatingId === tx.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                            </button>
                            <button
                              onClick={() => setEditingCategoryTxId(null)}
                              className="p-1 text-neutral-500 hover:bg-neutral-800 rounded cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 group">
                            <span className="px-2 py-0.5 rounded bg-neutral-900 border border-white/[0.065] text-neutral-300">
                              {tx.category || 'Other'}
                            </span>
                            <button
                              onClick={() => {
                                setEditingCategoryTxId(tx.id);
                                setNewCategoryVal(tx.category || 'Food & Dining');
                              }}
                              className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-white transition-opacity p-0.5 cursor-pointer"
                              title="Edit Category"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-2.5 text-neutral-500 text-[11px] capitalize">{tx.source || 'manual'}</td>
                      <td className={`px-4 py-2.5 text-right font-medium ${isIncome ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isIncome ? '+' : '-'}₹{Number(tx.amount || 0).toLocaleString()}
                      </td>
                      
                      <td className="px-4 py-2.5 text-center flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleDelete(tx.id)}
                          disabled={deletingId === tx.id}
                          className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors disabled:opacity-30 cursor-pointer artha-btn-interactive"
                          title="Delete Transaction"
                        >
                          {deletingId === tx.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="artha-glass rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.055]">
              <h3 className="text-sm font-semibold text-white">Add Transaction</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-medium text-neutral-400 mb-1 uppercase tracking-wider">Amount (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  name="amount"
                  placeholder="450.00"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-900 border border-white/[0.08] focus:border-emerald-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-400 mb-1 uppercase tracking-wider">Merchant</label>
                <input
                  type="text"
                  name="merchant"
                  placeholder="Swiggy, Amazon, Uber, etc."
                  value={formData.merchant}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-900 border border-white/[0.08] focus:border-emerald-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none transition-colors"
                />
              </div>

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
                <label className="block text-[11px] font-medium text-neutral-400 mb-1 uppercase tracking-wider">Date *</label>
                <input
                  type="date"
                  required
                  name="date"
                  value={formData.date}
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
                  {submitting ? 'Saving...' : 'Add Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
