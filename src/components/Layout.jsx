import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Target, 
  Bot, 
  Upload, 
  LogOut, 
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ChatDrawer from './ChatDrawer';
import DocumentUploadModal from './DocumentUploadModal';
import TelegramModal from './TelegramModel';

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [telegramOpen, setTelegramOpen] = useState(false);

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', href: '/transactions', icon: Receipt },
    { name: 'Budgets', href: '/budgets', icon: PieChart },
    { name: 'Goals', href: '/goals', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 hidden md:flex">
        <div>
          <div className="flex items-center gap-3 px-2 py-4 mb-6">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Bot className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">FinPilot AI</span>
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const active = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    active 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-800">
          <button
            onClick={() => setTelegramOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 py-2.5 px-4 rounded-xl text-sm font-medium transition"
          >
            <MessageSquare className="w-4 h-4" />
            Connect Telegram
          </button>

          <button
            onClick={() => setUploadOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-2.5 px-4 rounded-xl text-sm font-semibold transition shadow-lg shadow-emerald-500/10"
          >
            <Upload className="w-4 h-4" />
            Upload Receipt
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-rose-400 transition rounded-xl hover:bg-rose-500/10"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-slate-900/50 border-b border-slate-800 px-6 flex items-center justify-between backdrop-blur-sm sticky top-0 z-10">
          <div className="text-xs text-slate-400">
            Welcome, <span className="text-slate-200 font-medium">{user?.email}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTelegramOpen(true)}
              className="md:hidden p-2 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20 text-xs flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              Telegram
            </button>

            <button
              onClick={() => setChatOpen(true)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-medium transition border border-slate-700"
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              AI Assistant
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Floating Modals & Drawers */}
      <ChatDrawer isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      <DocumentUploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} />
      <TelegramModal isOpen={telegramOpen} onClose={() => setTelegramOpen(false)} />
    </div>
  );
}