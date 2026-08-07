import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Receipt, Target, PieChart, Sparkles, LogOut, UploadCloud } from 'lucide-react';
import ChatDrawer from './ChatDrawer';
import DocumentUploadModal from './DocumentUploadModal';

export default function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [chatOpen, setChatOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Transactions', path: '/transactions', icon: Receipt },
    { label: 'Budgets', path: '/budgets', icon: PieChart },
    { label: 'Goals', path: '/goals', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col justify-between">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Sparkles size={24} />
            </div>
            <h1 className="text-xl font-bold bg-linear-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
              FinPilot AI
            </h1>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => setUploadOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-colors border border-slate-700"
          >
            <UploadCloud size={18} className="text-emerald-400" />
            <span>Upload Document</span>
          </button>

          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-medium transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 bg-slate-900/30 px-6 flex items-center justify-between">
          <span className="text-xs text-slate-400">Logged in as {user?.email}</span>
          <button
            onClick={() => setChatOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-emerald-900/20"
          >
            <Sparkles size={16} />
            <span>AI Assistant</span>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Modals & Drawers */}
      <ChatDrawer isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      <DocumentUploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={() => navigate('/dashboard')}
      />
    </div>
  );
}