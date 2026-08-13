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
  Sparkles,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ChatDrawer from './ChatDrawer';
import DocumentUploadModal from './DocumentUploadModal';
import TelegramModal from './TelegramModel';

import logo from '../assets/logo.png';

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
          <div className="flex items-center gap-3.5 px-2 py-3 mb-6 border-b border-neutral-900/80 pb-4">
            <div className="relative w-12 h-12 rounded-full border-2 border-[#D6A84F]/80 bg-neutral-900 shadow-[0_0_15px_rgba(214,168,79,0.35)] flex items-center justify-center overflow-hidden shrink-0 transition-transform hover:scale-105">
              <img 
                src={logo} 
                alt="ARTHA Logo" 
                className="w-full h-full object-contain scale-[1.45]" 
              />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-[#D6A84F] block leading-tight">ARTHA</span>
              <span className="text-[10px] font-medium text-neutral-400 block mt-0.5">AI Financial Employee</span>
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
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full border-2 border-[#D6A84F]/80 bg-neutral-900 shadow-[0_0_12px_rgba(214,168,79,0.35)] flex items-center justify-center overflow-hidden shrink-0">
                    <img 
                      src={logo} 
                      alt="ARTHA Logo" 
                      className="w-full h-full object-contain scale-[1.45]" 
                    />
                  </div>
                  <div>
                    <span className="font-extrabold text-[#D6A84F] text-base block leading-tight">ARTHA</span>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">AI Financial Employee</span>
                  </div>
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
        <header className="h-16 bg-neutral-950/80 border-b border-neutral-900/80 px-4 sm:px-6 flex items-center justify-between backdrop-blur-xl sticky top-0 z-30 shadow-lg">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-neutral-400 hover:text-white rounded-xl bg-neutral-900/80 border border-neutral-800 md:hidden cursor-pointer transition-all hover:bg-neutral-800"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Premium User Profile Capsule */}
            <div className="flex items-center gap-2.5 bg-neutral-900/60 border border-neutral-800/80 rounded-full px-3 py-1.5 shadow-inner">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#D6A84F]/20 to-[#D6A84F]/40 border border-[#D6A84F]/60 text-[#D6A84F] font-bold text-[11px] flex items-center justify-center shrink-0 shadow-sm">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-300 font-medium truncate max-w-[140px] sm:max-w-[200px] md:max-w-[260px]">
                  {user?.email}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" title="Active Session"></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Date Pill (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 bg-neutral-900/40 border border-neutral-900 rounded-full px-3.5 py-1.5 text-xs text-neutral-400 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#D6A84F]" />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>

            {/* Mobile Telegram Agent Quick Access */}
            <button
              onClick={() => setTelegramOpen(true)}
              className="md:hidden p-2 bg-neutral-900 text-sky-400 rounded-xl border border-neutral-800 text-xs flex items-center gap-1 cursor-pointer hover:bg-neutral-800 transition"
              title="Telegram Agent"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            {/* Premium Gold AI CFO Assistant Button */}
            <button
              onClick={() => setChatOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#D6A84F]/15 via-[#D6A84F]/25 to-[#D6A84F]/15 hover:from-[#D6A84F]/25 hover:to-[#D6A84F]/35 text-[#D6A84F] px-4 py-2 rounded-xl text-xs font-bold tracking-wide border border-[#D6A84F]/40 shadow-[0_0_15px_rgba(214,168,79,0.25)] hover:shadow-[0_0_22px_rgba(214,168,79,0.45)] transition-all cursor-pointer group active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#D6A84F] group-hover:rotate-12 transition-transform duration-300" />
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