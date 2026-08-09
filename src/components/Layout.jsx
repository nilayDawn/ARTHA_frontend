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
  MessageSquare,
  FileText,
  Menu,
  X,
  Sparkles
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', href: '/transactions', icon: Receipt },
    { name: 'Budgets', href: '/budgets', icon: PieChart },
    { name: 'Goals', href: '/goals', icon: Target },
    { name: 'Documents', href: '/documents', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col md:flex-row antialiased">
      {/* Laptop / Desktop Permanent Sidebar */}
      <aside className="w-64 bg-neutral-950 border-r border-neutral-900 flex-col justify-between p-4 hidden md:flex shrink-0">
        <div>
          <div className="flex items-center gap-2.5 px-2 py-3 mb-6">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white block">FinPilot AI</span>
              <span className="text-[10px] text-neutral-500 block">AI Financial Employee</span>
            </div>
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const active = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    active
                      ? 'bg-neutral-900 text-emerald-400 border border-neutral-800'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2 pt-4 border-t border-neutral-900">
          <button
            onClick={() => setTelegramOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-sky-400 border border-neutral-800 py-2 px-3 rounded-lg text-xs font-medium transition cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Telegram Agent
          </button>

          <button
            onClick={() => setUploadOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black py-2 px-3 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Receipt
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-neutral-500 hover:text-red-400 transition rounded-lg hover:bg-red-500/10 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Slide-over Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-sm flex">
          <div className="w-72 bg-neutral-950 border-r border-neutral-900 p-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-900 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-white text-base">FinPilot AI</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg bg-neutral-900 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1.5">
                {navigation.map((item) => {
                  const active = location.pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                        active
                          ? 'bg-neutral-900 text-emerald-400 border border-neutral-800'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-2 pt-4 border-t border-neutral-900">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setTelegramOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 bg-neutral-900 text-sky-400 border border-neutral-800 py-2.5 px-3 rounded-lg text-xs font-medium"
              >
                <MessageSquare className="w-4 h-4" />
                Telegram Agent
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setUploadOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-black py-2.5 px-3 rounded-lg text-xs font-semibold"
              >
                <Upload className="w-4 h-4" />
                Upload Receipt
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-neutral-500 hover:text-red-400"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-14 bg-neutral-950/90 border-b border-neutral-900 px-4 sm:px-6 flex items-center justify-between backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg bg-neutral-900 border border-neutral-800 md:hidden cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            <span className="text-xs text-neutral-400 truncate hidden sm:inline">
              Welcome, <strong className="text-neutral-200 font-medium">{user?.email}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTelegramOpen(true)}
              className="md:hidden p-1.5 bg-neutral-900 text-sky-400 rounded-lg border border-neutral-800 text-xs flex items-center gap-1 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setChatOpen(true)}
              className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-medium border border-emerald-500/20 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI CFO Assistant</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-black">
          <Outlet />
        </main>
      </div>

      {/* Modals & Drawers */}
      <ChatDrawer isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      <DocumentUploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} />
      <TelegramModal isOpen={telegramOpen} onClose={() => setTelegramOpen(false)} />
    </div>
  );
}