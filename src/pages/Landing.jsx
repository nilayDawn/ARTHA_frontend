import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ArthaLogo from '../components/ArthaLogo';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Receipt,
  MessageSquare,
  PieChart,
  Target,
  Mail,
  CheckCircle,
  ChevronRight,
  Bot,
  Layers,
  Lock,
  Compass,
  Cpu,
  BarChart3,
  HelpCircle
} from 'lucide-react';

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Interactive AI Assistant Simulation state
  const [activePromptIndex, setActivePromptIndex] = useState(0);

  const samplePrompts = [
    {
      question: "Can I afford a ₹1,200 travel booking this month?",
      response: "Based on your current monthly net income (₹85,000) and allocated fixed expenses (₹38,000), you have ₹15,500 remaining in discretionary cash. A ₹1,200 trip is feasible, but will reduce your Emergency Fund monthly allocation from ₹5,000 to ₹2,000.",
      tag: "Budget Feasibility"
    },
    {
      question: "Analyze my dining out expenses over the last 30 days.",
      response: "You spent ₹8,200 on dining out across 18 transactions. This is 22% above your target ₹6,800 monthly food budget. Cutting 3 restaurant visits per week will save ₹1,300/month.",
      tag: "Expense Audit"
    },
    {
      question: "What is my current progress on the Emergency Reserve goal?",
      response: "Your Emergency Fund is at ₹5,400 out of your ₹10,000 target (84% complete). At your current savings rate of ₹500/month, you will reach full completion in 3.2 weeks.",
      tag: "Goal Tracker"
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#F2F2F2] font-sans antialiased selection:bg-[#00D9A5]/30 selection:text-[#00D9A5]">
      
      {/* 1. TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-[#050505]/85 backdrop-blur-md border-b border-[rgba(255,255,255,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <ArthaLogo size="md" showText={true} tagline={true} />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#8A8F8D]">
            <a href="#philosophy" className="hover:text-[#F2F2F2] transition-colors">Philosophy</a>
            <a href="#features" className="hover:text-[#F2F2F2] transition-colors">Capabilities</a>
            <a href="#simulation" className="hover:text-[#F2F2F2] transition-colors">AI CFO Agent</a>
            <a href="#security" className="hover:text-[#F2F2F2] transition-colors">Security</a>
            <a href="#faq" className="hover:text-[#F2F2F2] transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 text-xs font-semibold text-[#050505] bg-[#00D9A5] hover:bg-[#00B88C] rounded-lg transition-all shadow-[0_0_15px_rgba(0,217,165,0.25)] flex items-center gap-2 cursor-pointer"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-medium text-[#8A8F8D] hover:text-[#F2F2F2] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-xs font-semibold text-[#050505] bg-[#00D9A5] hover:bg-[#00B88C] rounded-lg transition-all shadow-[0_0_15px_rgba(0,217,165,0.2)] flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden border-b border-[rgba(255,255,255,0.08)]">
        {/* Subtle Background Radial Accent */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#D6A84F]/10 via-[#00D9A5]/10 to-transparent blur-3xl pointer-events-none rounded-full opacity-60"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B0F0E] border border-[rgba(255,255,255,0.08)] text-xs text-[#00D9A5] mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#00D9A5]" />
            <span className="font-medium text-[#8A8F8D]">Intelligent Multi-Agent Financial Companion</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D9A5] animate-pulse"></span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Master your wealth with <span className="text-[#D6A84F]">purpose</span> & intelligence.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            ARTHA bridges ancient wisdom with cutting-edge AI. Track cash flow, scan receipts, optimize monthly budgets, and achieve financial goals with an autonomous AI companion.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={user ? "/dashboard" : "/signup"}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#00D9A5] hover:bg-[#00B88C] text-[#050505] font-bold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(0,217,165,0.25)] flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <span>{user ? "Open AI Dashboard" : "Start Free Experience"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#0B0F0E] hover:bg-[#121917] text-white border border-[rgba(255,255,255,0.08)] font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-[#D6A84F]" />
              <span>Access Account</span>
            </Link>
          </div>

          {/* High-Fidelity Interactive Dashboard Preview Card */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl bg-[#0B0F0E] border border-[rgba(255,255,255,0.08)] shadow-2xl p-4 sm:p-6 text-left overflow-hidden relative">
            {/* Top Bar Mock Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.08)] mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                <span className="text-xs text-slate-500 ml-2 font-mono">artha-cfo-v1.0.4.live</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#00D9A5] bg-[#00D9A5]/10 border border-[#00D9A5]/20 px-2.5 py-1 rounded-full font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D9A5] animate-ping"></span>
                AI Agent Active
              </div>
            </div>

            {/* Dashboard Mock Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Stat Card 1 */}
              <div className="p-4 rounded-xl bg-[#050505] border border-[rgba(255,255,255,0.08)]">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Total Assets</span>
                <div className="text-2xl font-bold text-white tracking-tight">₹128,450.00</div>
                <div className="mt-2 text-xs text-[#00D9A5] flex items-center gap-1 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+12.4% vs last month</span>
                </div>
              </div>

              {/* Stat Card 2 */}
              <div className="p-4 rounded-xl bg-[#050505] border border-[rgba(255,255,255,0.08)]">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Monthly Surplus</span>
                <div className="text-2xl font-bold text-[#D6A84F] tracking-tight">₹2,410.50</div>
                <div className="mt-2 text-xs text-slate-500 font-normal">Allocated to savings & investment</div>
              </div>

              {/* Stat Card 3 */}
              <div className="p-4 rounded-xl bg-[#050505] border border-[rgba(255,255,255,0.08)]">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Goal Status</span>
                <div className="text-2xl font-bold text-white tracking-tight">84% Complete</div>
                <div className="mt-2 w-full bg-[#0B0F0E] h-1.5 rounded-full overflow-hidden border border-[rgba(255,255,255,0.08)]">
                  <div className="bg-[#00D9A5] h-full rounded-full w-[84%]"></div>
                </div>
              </div>
            </div>

            {/* AI CFO Recommendation Banner */}
            <div className="mt-4 p-4 rounded-xl bg-[#050505] border border-[#00D9A5]/30 flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-[#00D9A5]/10 border border-[#00D9A5]/30 flex items-center justify-center shrink-0 mt-0.5">
                <Zap className="w-4 h-4 text-[#00D9A5]" />
              </div>
              <div className="flex-1 text-xs">
                <div className="font-bold text-[#F2F2F2] mb-0.5 flex items-center gap-2">
                  <span>ARTHA AI CFO Recommendation</span>
                  <span className="text-[10px] text-[#D6A84F] bg-[#D6A84F]/10 px-2 py-0.5 rounded border border-[#D6A84F]/20">Smart Advice</span>
                </div>
                <p className="text-[#8A8F8D] leading-relaxed">
                  "Your food budget is currently 14% below expected ceiling. Reallocating ₹150 surplus toward your <span className="text-[#F2F2F2] font-semibold">Emergency Fund</span> will reach your target 2 weeks ahead of schedule."
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. SANSKRIT CONCEPT & PHILOSOPHY SECTION */}
      <section id="philosophy" className="py-20 md:py-28 bg-[#0B0F0E] border-b border-[rgba(255,255,255,0.08)] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#050505] border border-[#D6A84F]/30 text-xs text-[#D6A84F] mb-4">
              <Compass className="w-3.5 h-3.5" />
              <span>Rooted in Sanskrit Heritage</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F2F2F2] tracking-tight">
              The Ideology of <span className="text-[#D6A84F]">Artha (अर्थ)</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#8A8F8D] leading-relaxed">
              In classical philosophy, <strong className="text-[#F2F2F2]">Artha</strong> signifies the noble pursuit of wealth, material well-being, and financial purpose — essential pillars for a balanced, purposeful life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-[#050505] border border-[rgba(255,255,255,0.08)] hover:border-[#D6A84F]/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#D6A84F]/10 border border-[#D6A84F]/30 flex items-center justify-center text-[#D6A84F] mb-5">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#F2F2F2] mb-2">Material Wealth & Stability</h3>
              <p className="text-xs text-[#8A8F8D] leading-relaxed">
                Building durable capital through automated budget tracking, disciplined cash flow control, and systematic savings goals.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-[#050505] border border-[rgba(255,255,255,0.08)] hover:border-[#00D9A5]/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#00D9A5]/10 border border-[#00D9A5]/30 flex items-center justify-center text-[#00D9A5] mb-5">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#F2F2F2] mb-2">Intelligent Purpose</h3>
              <p className="text-xs text-[#8A8F8D] leading-relaxed">
                Utilizing multi-agent AI reasoning to ensure every dollar spent aligns with your life priorities rather than impulsive habits.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-[#050505] border border-[rgba(255,255,255,0.08)] hover:border-[#D6A84F]/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#D6A84F]/10 border border-[#D6A84F]/30 flex items-center justify-center text-[#D6A84F] mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#F2F2F2] mb-2">Harmonious Well-Being</h3>
              <p className="text-xs text-[#8A8F8D] leading-relaxed">
                Achieving clarity and freedom from financial anxiety through 24/7 autonomous monitoring and encrypted data protection.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. CORE FEATURES & CAPABILITIES */}
      <section id="features" className="py-20 md:py-28 bg-[#050505] border-b border-[rgba(255,255,255,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B0F0E] border border-[rgba(255,255,255,0.08)] text-xs text-[#00D9A5] mb-4">
              <Layers className="w-3.5 h-3.5" />
              <span>Full Financial Toolkit</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F2F2F2] tracking-tight">
              Built for precision, powered by <span className="text-[#00D9A5]">AI</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#8A8F8D]">
              Everything you need to orchestrate your personal finances in one dark, minimal dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-[#0B0F0E] border border-[rgba(255,255,255,0.08)] hover:border-[#00D9A5]/50 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-[#00D9A5]/10 border border-[#00D9A5]/20 flex items-center justify-center text-[#00D9A5] mb-4 group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F2F2F2] mb-2">AI CFO Assistant</h3>
              <p className="text-xs text-[#8A8F8D] leading-relaxed">
                Consult your personal AI companion via natural text. Get real-time answers on cash flow, affordability, and budget optimization.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-[#0B0F0E] border border-[rgba(255,255,255,0.08)] hover:border-[#00D9A5]/50 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-[#00D9A5]/10 border border-[#00D9A5]/20 flex items-center justify-center text-[#00D9A5] mb-4 group-hover:scale-105 transition-transform">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F2F2F2] mb-2">OCR Receipt Processing</h3>
              <p className="text-xs text-[#8A8F8D] leading-relaxed">
                Upload image or PDF receipts. Vision AI automatically extracts vendor, date, total amount, and categorizes the transaction instantly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-[#0B0F0E] border border-[rgba(255,255,255,0.08)] hover:border-[#00D9A5]/50 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-[#00D9A5]/10 border border-[#00D9A5]/20 flex items-center justify-center text-[#00D9A5] mb-4 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F2F2F2] mb-2">Telegram Companion</h3>
              <p className="text-xs text-[#8A8F8D] leading-relaxed">
                Connect your Telegram account. Log expenses on the go by sending quick text notes or receipt photos straight to your AI bot.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-[#0B0F0E] border border-[rgba(255,255,255,0.08)] hover:border-[#00D9A5]/50 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-[#00D9A5]/10 border border-[#00D9A5]/20 flex items-center justify-center text-[#00D9A5] mb-4 group-hover:scale-105 transition-transform">
                <PieChart className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F2F2F2] mb-2">Dynamic Budget Manager</h3>
              <p className="text-xs text-[#8A8F8D] leading-relaxed">
                Set monthly spending targets across custom categories with real-time percentage progress bars and overspend alerts.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-[#0B0F0E] border border-[rgba(255,255,255,0.08)] hover:border-[#00D9A5]/50 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-[#00D9A5]/10 border border-[#00D9A5]/20 flex items-center justify-center text-[#00D9A5] mb-4 group-hover:scale-105 transition-transform">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F2F2F2] mb-2">Goal & Wealth Tracker</h3>
              <p className="text-xs text-[#8A8F8D] leading-relaxed">
                Define financial targets (Emergency Fund, Investment, Travel) and track exact completion dates based on current saving velocities.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-[#0B0F0E] border border-[rgba(255,255,255,0.08)] hover:border-[#00D9A5]/50 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-[#00D9A5]/10 border border-[#00D9A5]/20 flex items-center justify-center text-[#00D9A5] mb-4 group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F2F2F2] mb-2">One-Click Email Reports</h3>
              <p className="text-xs text-[#8A8F8D] leading-relaxed">
                Generate and send detailed financial summaries straight to your email with a single click from the sidebar navigation.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. INTERACTIVE AI CFO AGENT DEMO SIMULATION */}
      <section id="simulation" className="py-20 md:py-28 bg-[#0B0F0E] border-b border-[rgba(255,255,255,0.08)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#050505] border border-[#00D9A5]/30 text-xs text-[#00D9A5] mb-4">
              <Zap className="w-3.5 h-3.5" />
              <span>Interactive Agent Demo</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#F2F2F2] tracking-tight">
              Test ARTHA's AI Financial Intelligence
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#8A8F8D]">
              Click a sample prompt below to see how ARTHA analyzes cash flow and provides instant financial clarity.
            </p>
          </div>

          {/* Interactive Prompt Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
            {samplePrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActivePromptIndex(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  activePromptIndex === idx
                    ? 'bg-[#00D9A5]/10 text-[#00D9A5] border-[#00D9A5]/40 shadow-[0_0_12px_rgba(0,217,165,0.15)]'
                    : 'bg-[#050505] text-slate-400 border-[rgba(255,255,255,0.08)] hover:text-white'
                }`}
              >
                {item.tag}
              </button>
            ))}
          </div>

          {/* Simulation Output Card */}
          <div className="rounded-2xl bg-[#050505] border border-[rgba(255,255,255,0.08)] p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* User Prompt */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#121917] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#F2F2F2] font-bold text-xs shrink-0">
                You
              </div>
              <div className="bg-[#0B0F0E] border border-[rgba(255,255,255,0.08)] px-4 py-3 rounded-2xl rounded-tl-none text-xs text-[#F2F2F2] font-medium max-w-xl">
                "{samplePrompts[activePromptIndex].question}"
              </div>
            </div>

            {/* AI Agent Response */}
            <div className="flex items-start gap-3 pt-2">
              <div className="w-8 h-8 rounded-full bg-[#D6A84F]/15 border border-[#D6A84F]/40 flex items-center justify-center text-[#D6A84F] font-bold text-xs shrink-0">
                <Bot className="w-4 h-4 text-[#D6A84F]" />
              </div>
              <div className="bg-[#0B0F0E] border border-[#00D9A5]/30 px-5 py-4 rounded-2xl rounded-tl-none text-xs text-[#F2F2F2] leading-relaxed max-w-2xl space-y-3 shadow-md">
                <div className="flex items-center gap-2 text-[11px] font-bold text-[#00D9A5] border-b border-[rgba(255,255,255,0.08)] pb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ARTHA AI CFO Response</span>
                </div>
                <p className="text-[#F2F2F2]">
                  {samplePrompts[activePromptIndex].response}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. SECURITY & PRIVACY */}
      <section id="security" className="py-20 md:py-28 bg-[#050505] border-b border-[rgba(255,255,255,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-4xl mx-auto bg-[#0B0F0E] border border-[rgba(255,255,255,0.08)] rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-[#00D9A5]/10 border border-[#00D9A5]/30 flex items-center justify-center text-[#00D9A5] shrink-0">
              <Lock className="w-8 h-8" />
            </div>

            <div className="flex-1 space-y-3 text-center md:text-left">
              <h3 className="text-2xl font-extrabold text-[#F2F2F2]">
                Enterprise-Grade Privacy & Security
              </h3>
              <p className="text-xs sm:text-sm text-[#8A8F8D] leading-relaxed">
                Your financial records are strictly isolated using Supabase Row Level Security (RLS). We never sell your data, monetize your insights, or train public models on your personal financial transactions.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold text-[#00D9A5]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>Row Level Security</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>Encrypted Sessions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>Zero Ad Tracking</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="py-20 bg-[#0B0F0E] border-b border-[rgba(255,255,255,0.08)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#F2F2F2]">Frequently Asked Questions</h2>
            <p className="mt-2 text-xs text-[#8A8F8D]">Everything you need to know about getting started with ARTHA.</p>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#050505] border border-[rgba(255,255,255,0.08)]">
              <h4 className="text-sm font-bold text-[#F2F2F2] mb-1.5">What makes ARTHA different from traditional expense trackers?</h4>
              <p className="text-xs text-[#8A8F8D] leading-relaxed">
                ARTHA isn't a passive spreadsheet. It features an active AI CFO agent capable of reading raw receipt documents, updating vector database memory, providing natural language advice, and sending automated progress reports.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#050505] border border-[rgba(255,255,255,0.08)]">
              <h4 className="text-sm font-bold text-[#F2F2F2] mb-1.5">How does receipt OCR processing work?</h4>
              <p className="text-xs text-[#8A8F8D] leading-relaxed">
                Upload your JPEG, PNG, or PDF receipts via the web interface or Telegram bot. Vision AI scans the text, identifies line items, vendor name, transaction date, and creates an entry automatically.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#050505] border border-[rgba(255,255,255,0.08)]">
              <h4 className="text-sm font-bold text-[#F2F2F2] mb-1.5">Can I connect ARTHA with my Telegram account?</h4>
              <p className="text-xs text-[#8A8F8D] leading-relaxed">
                Yes! From your dashboard, link your Telegram user ID to log receipts and receive real-time financial alerts directly through the Telegram bot.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA BANNER */}
      <section className="py-20 bg-[#050505]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-b from-[#0B0F0E] to-[#050505] border border-[rgba(255,255,255,0.08)] shadow-2xl relative overflow-hidden">
            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <ArthaLogo size="lg" showText={true} tagline={true} className="justify-center" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F2F2F2]">
                Start your journey toward financial clarity.
              </h2>
              <p className="text-xs sm:text-sm text-[#8A8F8D]">
                Join ARTHA today and experience your personal AI CFO.
              </p>
              <div className="pt-2">
                <Link
                  to={user ? "/dashboard" : "/signup"}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#00D9A5] hover:bg-[#00B88C] text-[#050505] font-extrabold text-sm rounded-xl transition-all shadow-[0_0_25px_rgba(0,217,165,0.3)] cursor-pointer"
                >
                  <span>{user ? "Go to My Dashboard" : "Create Free Account"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="py-8 bg-[#050505] border-t border-[rgba(255,255,255,0.08)] text-xs text-[#8A8F8D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ArthaLogo size="xs" showText={true} />
            <span>— Intelligent Financial Companion</span>
          </div>
          <div>
            © {new Date().getFullYear()} ARTHA. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
