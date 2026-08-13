import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Target,
  Upload,
  LogOut,
  MessageSquare,
  FileText,
  Menu,
  X,
  Sparkles,
  Calendar,
  Mail,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sendReportEmail } from '../services/api';
import ChatDrawer from './ChatDrawer';
import DocumentUploadModal from './DocumentUploadModal';
import TelegramModal from './TelegramModel';
import ArthaLogo from './ArthaLogo';

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [telegramOpen, setTelegramOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [sendingReport, setSendingReport] = useState(false);
  const [reportNotification, setReportNotification] = useState(null);

  const handleSendReport = async () => {
    try {
      setSendingReport(true);
      setReportNotification(null);
      const res = await sendReportEmail();
      setReportNotification({
        type: 'success',
        text: res.data?.message || `Report is being generated and sent to ${user?.email || 'your email'}.`
      });
    } catch (err) {
      console.error('Failed to send report email:', err);
      setReportNotification({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to send email report. Please try again.'
      });
    } finally {
      setSendingReport(false);
      setTimeout(() => {
        setReportNotification(null);
      }, 5000);
    }
  };

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
          <div className="px-2 py-3 mb-6 border-b border-neutral-900/80 pb-4">
            <Link to="/" className="inline-block">
              <ArthaLogo size="md" showText={true} tagline={true} />
            </Link>
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
            onClick={handleSendReport}
            disabled={sendingReport}
            className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-amber-400 border border-neutral-800 py-2 px-3 rounded-lg text-xs font-medium transition cursor-pointer disabled:opacity-50"
          >
            {sendingReport ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Mail className="w-3.5 h-3.5" />
            )}
            {sendingReport ? 'Sending Report...' : 'Send Report'}
          </button>

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
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  <ArthaLogo size="sm" showText={true} tagline={true} />
                </Link>
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
                  handleSendReport();
                }}
                disabled={sendingReport}
                className="w-full flex items-center justify-center gap-2 bg-neutral-900 text-amber-400 border border-neutral-800 py-2.5 px-3 rounded-lg text-xs font-medium disabled:opacity-50 cursor-pointer"
              >
                {sendingReport ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
                {sendingReport ? 'Sending Report...' : 'Send Report'}
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setTelegramOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 bg-neutral-900 text-sky-400 border border-neutral-800 py-2.5 px-3 rounded-lg text-xs font-medium cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                Telegram Agent
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setUploadOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-black py-2.5 px-3 rounded-lg text-xs font-semibold cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                Upload Receipt
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-neutral-500 hover:text-red-400 cursor-pointer"
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

      {/* Toast Notification for Email Report */}
      {reportNotification && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-medium shadow-2xl backdrop-blur-md transition-all ${
            reportNotification.type === 'success'
              ? 'bg-neutral-950/95 border-emerald-500/40 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.25)]'
              : 'bg-neutral-950/95 border-red-500/40 text-red-300 shadow-[0_0_25px_rgba(239,68,68,0.25)]'
          }`}
        >
          {reportNotification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{reportNotification.text}</span>
          <button
            onClick={() => setReportNotification(null)}
            className="ml-2 text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Modals & Drawers */}
      <ChatDrawer isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      <DocumentUploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} />
      <TelegramModal isOpen={telegramOpen} onClose={() => setTelegramOpen(false)} />
    </div>
  );
}