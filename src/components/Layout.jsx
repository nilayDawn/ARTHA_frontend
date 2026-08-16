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
  AlertCircle,
  Key
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sendReportEmail } from '../services/api';
import ChatDrawer from './ChatDrawer';
import DocumentUploadModal from './DocumentUploadModal';
import TelegramModal from './TelegramModel';
import ApiKeyModal from './ApiKeyModal';
import ArthaLogo from './ArthaLogo';

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [telegramOpen, setTelegramOpen] = useState(false);
  const [apiKeyOpen, setApiKeyOpen] = useState(false);
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
    <div className="min-h-screen bg-[#050505] text-neutral-100 flex flex-col md:flex-row antialiased">
      {/* Laptop / Desktop Permanent Sidebar */}
      <aside className="w-64 bg-[#080808] border-r border-white/[0.055] flex-col justify-between p-4 hidden md:flex shrink-0 shadow-2xl">
        <div>
          <div className="px-2 py-3 mb-6 border-b border-white/[0.055] pb-4">
            <Link to="/" className="inline-block">
              <ArthaLogo size="md" showText={true} tagline={true} />
            </Link>
          </div>

          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const active = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`artha-sidebar-link flex items-center gap-3 px-3 py-2 rounded-r-lg text-xs font-medium border-l-2 ${
                    active
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500 shadow-[inset_1px_0_8px_rgba(0,217,165,0.06)]'
                      : 'text-neutral-400 border-transparent hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-emerald-400' : 'text-neutral-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2 pt-4 border-t border-white/[0.055]">
          <button
            onClick={() => setApiKeyOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-[#0D0D0D] hover:bg-neutral-800/80 text-[#D6A84F] border border-white/[0.065] hover:border-[#D6A84F]/30 py-2 px-3 rounded-lg text-xs font-medium artha-btn-interactive cursor-pointer shadow-sm"
          >
            <Key className="w-3.5 h-3.5 text-[#D6A84F]" />
            ARTHA API Key
          </button>

          <button
            onClick={handleSendReport}
            disabled={sendingReport}
            className="w-full flex items-center justify-center gap-2 bg-[#0D0D0D] hover:bg-neutral-800/80 text-amber-400 border border-white/[0.065] hover:border-amber-500/30 py-2 px-3 rounded-lg text-xs font-medium artha-btn-interactive cursor-pointer disabled:opacity-50 shadow-sm"
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
            className="w-full flex items-center justify-center gap-2 bg-[#0D0D0D] hover:bg-neutral-800/80 text-sky-400 border border-white/[0.065] hover:border-sky-500/30 py-2 px-3 rounded-lg text-xs font-medium artha-btn-interactive cursor-pointer shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Telegram Agent
          </button>

          <button
            onClick={() => setUploadOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black py-2 px-3 rounded-lg text-xs font-semibold artha-btn-interactive shadow-[0_4px_14px_rgba(0,217,165,0.22)] hover:shadow-[0_6px_18px_rgba(0,217,165,0.35)] cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Receipt
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-neutral-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10 cursor-pointer artha-btn-interactive"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Slide-over Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-md flex">
          <div className="w-72 bg-[#080808] border-r border-white/[0.055] p-5 flex flex-col justify-between h-full shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.055] mb-4">
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  <ArthaLogo size="sm" showText={true} tagline={true} />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg bg-neutral-900 border border-white/[0.065] cursor-pointer"
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
                      className={`artha-sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-r-lg text-sm font-medium border-l-2 ${
                        active
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500 shadow-[inset_1px_0_8px_rgba(0,217,165,0.06)]'
                          : 'text-neutral-400 border-transparent hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/[0.055]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setApiKeyOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#0D0D0D] text-[#D6A84F] border border-white/[0.065] py-2.5 px-3 rounded-lg text-xs font-medium cursor-pointer artha-btn-interactive"
              >
                <Key className="w-4 h-4" />
                LLM API Key
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSendReport();
                }}
                disabled={sendingReport}
                className="w-full flex items-center justify-center gap-2 bg-[#0D0D0D] text-amber-400 border border-white/[0.065] py-2.5 px-3 rounded-lg text-xs font-medium disabled:opacity-50 cursor-pointer artha-btn-interactive"
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
                className="w-full flex items-center justify-center gap-2 bg-[#0D0D0D] text-sky-400 border border-white/[0.065] py-2.5 px-3 rounded-lg text-xs font-medium cursor-pointer artha-btn-interactive"
              >
                <MessageSquare className="w-4 h-4" />
                Telegram Agent
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setUploadOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-black py-2.5 px-3 rounded-lg text-xs font-semibold cursor-pointer artha-btn-interactive shadow-md"
              >
                <Upload className="w-4 h-4" />
                Upload Receipt
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-neutral-500 hover:text-red-400 cursor-pointer artha-btn-interactive"
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
        <header className="h-16 bg-[#080808]/85 border-b border-white/[0.055] px-4 sm:px-6 flex items-center justify-between backdrop-blur-xl sticky top-0 z-30 shadow-md">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-neutral-400 hover:text-white rounded-xl bg-[#0D0D0D] border border-white/[0.065] md:hidden cursor-pointer artha-btn-interactive hover:bg-neutral-800/80"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Premium User Profile Capsule */}
            {(() => {
              const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || (user?.email ? user.email.split('@')[0] : 'User');
              const initial = userName ? userName[0].toUpperCase() : 'U';
              return (
                <div className="flex items-center gap-2.5 bg-[#0D0D0D]/90 border border-white/[0.065] rounded-full px-3 py-1.5 shadow-inner">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#D6A84F]/20 to-[#D6A84F]/40 border border-[#D6A84F]/60 text-[#D6A84F] font-bold text-[11px] flex items-center justify-center shrink-0 shadow-sm">
                    {initial}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-300 font-medium truncate max-w-[140px] sm:max-w-[200px] md:max-w-[260px]" title={user?.email}>
                      {userName}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" title={`Active Session (${user?.email || 'Logged in'})`}></span>
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="flex items-center gap-3">
            {/* Date Pill (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 bg-[#0D0D0D]/80 border border-white/[0.055] rounded-full px-3.5 py-1.5 text-xs text-neutral-400 font-medium shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-[#D6A84F]" />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>

            {/* LLM API Key Quick Button in Header */}
            <button
              onClick={() => setApiKeyOpen(true)}
              className="p-2 bg-[#0D0D0D] hover:bg-neutral-800/80 text-[#D6A84F] rounded-xl border border-white/[0.065] hover:border-[#D6A84F]/40 text-xs flex items-center gap-1.5 cursor-pointer artha-btn-interactive shadow-sm"
              title="ARTHA API Key Settings"
            >
              <Key className="w-4 h-4 text-[#D6A84F]" />
              <span className="hidden sm:inline text-xs font-medium">API Key</span>
            </button>

            {/* Mobile Telegram Agent Quick Access */}
            <button
              onClick={() => setTelegramOpen(true)}
              className="md:hidden p-2 bg-[#0D0D0D] text-sky-400 rounded-xl border border-white/[0.065] text-xs flex items-center gap-1 cursor-pointer hover:bg-neutral-800/80 artha-btn-interactive shadow-sm"
              title="Telegram Agent"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            {/* Premium Gold AI CFO Assistant Button */}
            <button
              onClick={() => setChatOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#D6A84F]/15 via-[#D6A84F]/25 to-[#D6A84F]/15 hover:from-[#D6A84F]/25 hover:to-[#D6A84F]/35 text-[#D6A84F] px-4 py-2 rounded-xl text-xs font-bold tracking-wide border border-[#D6A84F]/40 shadow-[0_0_15px_rgba(214,168,79,0.2)] hover:shadow-[0_0_22px_rgba(214,168,79,0.4)] artha-btn-interactive cursor-pointer group active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#D6A84F] group-hover:rotate-12 transition-transform duration-300" />
              <span>AI CFO Assistant</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-transparent">
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
      <ChatDrawer isOpen={chatOpen} onClose={() => setChatOpen(false)} onOpenApiKeyModal={() => setApiKeyOpen(true)} />
      <DocumentUploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} />
      <TelegramModal isOpen={telegramOpen} onClose={() => setTelegramOpen(false)} />
      <ApiKeyModal isOpen={apiKeyOpen} onClose={() => setApiKeyOpen(false)} />
    </div>
  );
}