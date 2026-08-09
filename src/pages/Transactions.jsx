import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Filter, 
  Receipt, 
  ArrowDownRight, 
  Calendar, 
  Tag, 
  Store,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { getTransactions, createTransaction, deleteTransaction } from '../services/api';

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

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Add Modal State
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

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getTransactions();
      setTransactions(res.data || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

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
      await fetchTransactions();
    } catch (err) {
      console.error('Failed to create transaction:', err);
      alert(err.response?.data?.detail || 'Failed to add transaction');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      setDeletingId(id);
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      alert('Failed to delete transaction.');
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = 
      (t.merchant || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalSpent = transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Transactions</h1>
          <p className="text-sm text-slate-400">View, search, and record all your spending</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-4 py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/10 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Total Transactions</span>
            <Receipt className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{transactions.length}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Total Spent</span>
            <ArrowDownRight className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400">₹{totalSpent.toLocaleString()}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Avg. Transaction</span>
            <Tag className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            ₹{transactions.length > 0 ? Math.round(totalSpent / transactions.length).toLocaleString() : 0}
          </div>
        </div>
      </div>

      {/* Controls: Search & Category Filter */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-slate-900/40 p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search merchant or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500/50"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Transactions List / Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
            <span>Loading transactions...</span>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <Receipt className="w-12 h-12 mx-auto stroke-1 text-slate-600" />
            <p className="text-slate-400 font-medium">No transactions found</p>
            <p className="text-xs text-slate-500">Add a new transaction or clear filters to view data.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-950/70 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5">Merchant</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Source</th>
                  <th className="px-4 py-3.5 text-right">Amount</th>
                  <th className="px-4 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {tx.date ? new Date(tx.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                    </td>
                    <td className="px-4 py-3 font-medium text-white">
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span>{tx.merchant || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 text-xs rounded-full bg-slate-800 border border-slate-700/60 text-slate-300 font-medium">
                        {tx.category || 'Other'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 capitalize">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-400 border border-slate-700/40">
                        {tx.source || 'manual'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-rose-400">
                      -₹{Number(tx.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(tx.id)}
                        disabled={deletingId === tx.id}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition disabled:opacity-50"
                        title="Delete Transaction"
                      >
                        {deletingId === tx.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-400" />
                Add New Transaction
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
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Amount (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  name="amount"
                  placeholder="e.g. 450.00"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Merchant / Store Name</label>
                <input
                  type="text"
                  name="merchant"
                  placeholder="e.g. Starbuck, Swiggy, Amazon"
                  value={formData.merchant}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

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
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Date *</label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
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
