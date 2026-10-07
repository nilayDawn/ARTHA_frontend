import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/slices/authSlice';
import ArthaLogo from '@/components/common/ArthaLogo';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Receipt,
  MessageSquare,
  Mail,
  ChevronRight,
  Bot,
  Layers,
  Terminal,
  Activity,
  ExternalLink,
  Database,
  Server,
  Code2,
  Gauge,
  Check,
  AlertCircle,
  ArrowUpRight,
  X,
} from 'lucide-react';

export default function LandingPage() {
  const user = useAppSelector(selectCurrentUser);

  // Dynamic backend base URL & Swagger Docs link
  const rawApiUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8000/api/v1';
  const backendBaseUrl = rawApiUrl.replace(/\/api\/v1\/?$/, '');
  const swaggerDocsUrl = `${backendBaseUrl}/docs`;

  // State for interactive Load Test Modal
  const [showLoadTestModal, setShowLoadTestModal] = useState(false);
  const [activeTestTab, setActiveTestTab] = useState('summary'); // 'summary' | 'scenarios' | 'bottlenecks'

  // Interactive AI Assistant Simulation state
  const [activePromptIndex, setActivePromptIndex] = useState(0);

  const samplePrompts = [
    {
      question: "Can I afford a ₹1,200 travel booking this month?",
      category: "Budget Feasibility Check",
      latency: "1.4s (Gemini 2.5 Flash)",
      response:
        "Based on your current monthly net income (₹85,000) and allocated fixed expenses (₹38,000), you have ₹15,500 remaining in discretionary cash. A ₹1,200 booking is within budget, though it temporarily lowers your Emergency Fund velocity by 8%.",
      actionBlock: {
        action: "evaluate_affordability",
        parameters: { amount: 1200, category: "Travel", current_surplus: 15500 },
        decision: "APPROVED_WITH_CAUTION",
      },
    },
    {
      question: "Analyze my dining out expenses over the last 30 days.",
      category: "Composite Query & Audit",
      latency: "18ms (Redis Cache Hit)",
      response:
        "You spent ₹8,200 on dining out across 18 transactions. This is 22% above your target ₹6,800 monthly food budget. Cutting 3 restaurant orders per week will recover ₹1,300/month.",
      actionBlock: {
        action: "query_spending_summary",
        parameters: { category: "Dining Out", window_days: 30, variance: "+22%" },
        decision: "OVERSPEND_ALERT",
      },
    },
    {
      question: "What is my current progress on the Emergency Reserve goal?",
      category: "Goal Trajectory Math",
      latency: "24ms (Indexed DB Lookup)",
      response:
        "Your Emergency Fund holds ₹8,400 out of your ₹10,000 target (84% complete). At your current savings rate of ₹500/month, you are projected to reach 100% completion in 3.2 weeks.",
      actionBlock: {
        action: "calculate_goal_eta",
        parameters: { current_savings: 8400, target: 10000, completion_weeks: 3.2 },
        decision: "ON_TRACK",
      },
    },
  ];

  // Authentic k6 load test results dataset
  const k6Scenarios = [
    {
      name: "Smoke Test",
      concurrency: "2 VUs",
      duration: "34s",
      requests: "120",
      throughput: "3.5 req/s",
      errorRate: "0.83%*",
      note: "1 cold-start TCP handshake drop, 100% stable after",
    },
    {
      name: "Normal Load",
      concurrency: "10 VUs",
      duration: "2m 20s",
      requests: "777",
      throughput: "5.5 req/s",
      errorRate: "0.00%",
      note: "Zero errors; 100% check pass baseline across all routes",
    },
    {
      name: "Stress Test",
      concurrency: "10 → 50 VUs",
      duration: "3m 40s",
      requests: "4,493",
      throughput: "20.3 req/s",
      errorRate: "1.27%",
      note: "Identified cloud database connection saturation knee at >25 VUs",
    },
    {
      name: "Spike Burst",
      concurrency: "2 → 35 VUs",
      duration: "1m 50s",
      requests: "1,039",
      throughput: "9.4 req/s",
      errorRate: "1.44%",
      note: "Instant 17.5x burst; zero downtime and immediate elastic recovery",
    },
    {
      name: "Soak Endurance",
      concurrency: "12 VUs",
      duration: "3m 50s",
      requests: "1,766",
      throughput: "7.7 req/s",
      errorRate: "0.17%",
      note: "Zero memory leaks or latency creep over sustained traffic",
    },
    {
      name: "Breakpoint Probe",
      concurrency: "15 → 75 VUs",
      duration: "4m 30s",
      requests: "12,919",
      throughput: "49.6 req/s",
      errorRate: "Handled*",
      note: "FastAPI ASGI engine sustained ~50 req/s ceiling before WAN auth expiry",
    },
  ];

  return (
    <div className="min-h-screen bg-[#07090E] text-[#E6EDF3] font-sans antialiased selection:bg-emerald-500/25 selection:text-emerald-400">
      
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#07090E]/90 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo & Tag */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <ArthaLogo size="md" showText={true} />
            </Link>
            <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-white/5">
              portfolio-v2.0
            </span>
          </div>

          {/* Recruiter-Friendly Quick Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
            <a href="#functionality" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#architecture" className="hover:text-white transition-colors">
              Architecture
            </a>
            <button
              onClick={() => {
                setActiveTestTab('summary');
                setShowLoadTestModal(true);
              }}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer text-zinc-300"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Load Test Report</span>
            </button>
            <a
              href={swaggerDocsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-zinc-300"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Swagger Docs (/docs)</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </a>
            <a href="#engineering-notes" className="hover:text-white transition-colors">
              Bottlenecks Solved
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <a
              href={swaggerDocsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-lg transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>/docs</span>
            </a>

            {user ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all shadow-[0_0_15px_rgba(52,211,153,0.2)] flex items-center gap-1.5 cursor-pointer"
              >
                <span>Live Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-3.5 py-1.5 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all shadow-[0_0_15px_rgba(52,211,153,0.2)] flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore App</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden border-b border-white/[0.08]">
        {/* Soft Radial Ambient Lighting */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none rounded-full opacity-70" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Engineering Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-white/10 text-xs text-zinc-300 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] text-emerald-400">PORTFOLIO PROJECT</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">FastAPI • Clean Hexagonal Architecture • LangGraph</span>
          </div>

          {/* Honest, Clear Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.18]">
            An intelligent financial engine, engineered for{' '}
            <span className="text-emerald-400 font-extrabold">concurrency</span> & clean architecture.
          </h1>

          {/* Builder's Human Intro */}
          <p className="mt-6 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
            I built ARTHA to solve personal finance beyond basic CRUD spreadsheets. It features multimodal receipt OCR with Gemini Vision, stateful financial reasoning via LangGraph, real-time Telegram bot sync, and a decoupled hexagonal backend benchmarked against 21,000+ k6 requests.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={user ? "/dashboard" : "/signup"}
              className="px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(52,211,153,0.25)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{user ? "Open Live Dashboard" : "Launch Interactive Demo"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => {
                setActiveTestTab('summary');
                setShowLoadTestModal(true);
              }}
              className="px-5 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/10 font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>View k6 Load Test Report</span>
            </button>

            <a
              href={swaggerDocsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 border border-white/10 font-mono text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>FastAPI /docs</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
            </a>
          </div>

          {/* 3. REAL BACKEND BENCHMARKS BAR (Facts, No Fluff) */}
          <div id="benchmarks" className="mt-14 max-w-5xl mx-auto">
            <div className="text-left mb-3 flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                Verified k6 Load Test Performance (Linux x86_64)
              </span>
              <button
                onClick={() => setShowLoadTestModal(true)}
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-mono cursor-pointer"
              >
                <span>Inspect full 6-scenario suite</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Metric 1 */}
              <div className="p-4 sm:p-5 rounded-xl bg-zinc-900/70 border border-white/[0.08] text-left">
                <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                  Normal Concurrency
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
                  0.00%
                </div>
                <div className="mt-1 text-xs text-zinc-400">
                  HTTP error rate across 777 requests at 10 VUs
                </div>
              </div>

              {/* Metric 2 */}
              <div className="p-4 sm:p-5 rounded-xl bg-zinc-900/70 border border-white/[0.08] text-left">
                <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                  Engine Throughput
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
                  ~50 req/s
                </div>
                <div className="mt-1 text-xs text-zinc-400">
                  In-memory ASGI ceiling profiled at 75 concurrent VUs
                </div>
              </div>

              {/* Metric 3 */}
              <div className="p-4 sm:p-5 rounded-xl bg-zinc-900/70 border border-white/[0.08] text-left">
                <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                  Cached Read SLA
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">
                  2.8 – 4.1 ms
                </div>
                <div className="mt-1 text-xs text-zinc-400">
                  Average response latency for catalog & cached routes
                </div>
              </div>

              {/* Metric 4 */}
              <div className="p-4 sm:p-5 rounded-xl bg-zinc-900/70 border border-white/[0.08] text-left">
                <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                  Threadpool Concurrency
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-sky-400">
                  100 threads
                </div>
                <div className="mt-1 text-xs text-zinc-400">
                  AnyIO worker capacity tuned to prevent starvation
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. APPLICATION FUNCTIONALITY (What It Actually Does) */}
      <section id="functionality" className="py-20 bg-[#0A0D14] border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-zinc-800 text-emerald-400 border border-white/5">
              Production Capabilities
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
              What the platform actually does
            </h2>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
              Every feature below is implemented as an autonomous domain module inside <code className="text-xs font-mono bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-300">backend/app/modules/</code>, ready for independent extraction or containerized deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/[0.08] hover:border-emerald-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 flex items-center justify-between">
                <span>AI CFO Copilot (LangGraph)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">modules/agent</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                State machine evaluating user cash flow, budgets, and savings goals. Employs regex heuristic guardrails (&lt;1ms evaluation) against prompt injections and produces structured action payloads for client execution.
              </p>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>Qdrant long-term vector memory</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/[0.08] hover:border-emerald-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 flex items-center justify-between">
                <span>Multimodal Document OCR</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">modules/documents</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Extracts merchant, date, total, and categorized line items from raw receipt images or PDF statements using Google Gemini 2.5 Flash. Built with strict 15MB file-size streaming checks to prevent memory exhaustion attacks.
              </p>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>Supabase S3 signed storage URLs</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/[0.08] hover:border-emerald-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 flex items-center justify-between">
                <span>Ledger & Aggregations</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">modules/finance</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Full CRUD ledger with automatic income classification, relative date normalizations ("yesterday", "last week"), category budget velocity tracking, and PostgreSQL composite indexes for sub-millisecond filtering.
              </p>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>User-scoped cache key invalidation</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/[0.08] hover:border-emerald-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 flex items-center justify-between">
                <span>Telegram Bot Companion</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">modules/telegram</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Log expenses on mobile by messaging the bot or snapping receipt photos. Authentication relies on single-use 10-minute ephemeral link codes (<code className="text-zinc-300">FP-XXXX</code>) backed by indexed lookup.
              </p>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>Zero table scans on linking</span>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/[0.08] hover:border-emerald-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 flex items-center justify-between">
                <span>Automated Email Dispatcher</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">modules/reports</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Renders responsive Jinja HTML templates summarizing monthly spending breakdown, budget health, and top expense categories. Dispatches through Resend HTTP API with automatic local SMTP fallback.
              </p>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>Isolated HTML template engines</span>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/[0.08] hover:border-emerald-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 flex items-center justify-between">
                <span>Security Defense-in-Depth</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">core/security</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Strict Supabase Row Level Security (RLS) guarantees complete tenant isolation. Layered with sliding-window in-memory rate limiting, HTTP security headers, and JWT claims caching (600s TTL).
              </p>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>Zero cross-user data leakage</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. ARCHITECTURE & RECRUITER PERSPECTIVE */}
      <section id="architecture" className="py-20 bg-[#07090E] border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-zinc-800 text-emerald-400 border border-white/5">
              System Design & ADRs
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
              Hexagonal Architecture (Ports & Adapters)
            </h2>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
              Business rules have zero knowledge of external vendor libraries. All cloud systems implement typed abstract interfaces located in <code className="text-xs font-mono bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-300">backend/app/ports/</code>.
            </p>
          </div>

          <div className="max-w-5xl mx-auto rounded-2xl bg-zinc-950 border border-white/10 p-6 sm:p-8 font-mono text-xs shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-zinc-400 ml-2">architecture-topology.spec</span>
              </div>
              <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 text-[11px]">
                Zero Vendor Lock-in
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 1: Gateway & Middleware */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-3">
                <div className="text-emerald-400 font-bold uppercase text-[11px] tracking-wider flex items-center gap-2">
                  <Server className="w-3.5 h-3.5" />
                  <span>1. Ingress & Gateway</span>
                </div>
                <ul className="space-y-2 text-zinc-300 leading-relaxed">
                  <li>• FastAPI ASGI runtime (Python 3.12)</li>
                  <li>• Dynamic worker calculation (<code className="text-zinc-400">gunicorn.conf.py</code>)</li>
                  <li>• Sliding-window rate limiter middleware</li>
                  <li>• AnyIO 100-thread async worker limiter</li>
                  <li>• Strict OWASP security response headers</li>
                </ul>
              </div>

              {/* Column 2: Pure Domain Ports */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-3">
                <div className="text-amber-400 font-bold uppercase text-[11px] tracking-wider flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" />
                  <span>2. Abstract Ports</span>
                </div>
                <ul className="space-y-2 text-zinc-300 leading-relaxed">
                  <li>• <code className="text-amber-300">DatabasePort</code> (Repository contract)</li>
                  <li>• <code className="text-amber-300">CachePort</code> (Scoped key invalidation)</li>
                  <li>• <code className="text-amber-300">LLMProviderPort</code> (Multimodal & text)</li>
                  <li>• <code className="text-amber-300">VectorStorePort</code> (Cosine search)</li>
                  <li>• <code className="text-amber-300">StorageProviderPort</code> (Signed URLs)</li>
                  <li>• <code className="text-amber-300">EmailProviderPort</code> (Jinja dispatch)</li>
                </ul>
              </div>

              {/* Column 3: Pluggable Adapters */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-3">
                <div className="text-sky-400 font-bold uppercase text-[11px] tracking-wider flex items-center gap-2">
                  <Database className="w-3.5 h-3.5" />
                  <span>3. Pluggable Adapters</span>
                </div>
                <ul className="space-y-2 text-zinc-300 leading-relaxed">
                  <li>• <strong className="text-white">DB:</strong> Supabase PostgreSQL / In-Memory</li>
                  <li>• <strong className="text-white">Cache:</strong> Redis / In-Memory TTL</li>
                  <li>• <strong className="text-white">AI:</strong> Google Gemini 2.5 Flash</li>
                  <li>• <strong className="text-white">Vector:</strong> Qdrant Cloud</li>
                  <li>• <strong className="text-white">Email:</strong> Resend API / Local SMTP</li>
                  <li>• <strong className="text-white">Tests:</strong> 100% offline mock suite</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-zinc-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Unit test suite runs completely offline in ~1.85s without cloud dependencies.
              </span>
              <a
                href={swaggerDocsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
              >
                <span>Inspect OpenAPI Contracts</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 6. INTERACTIVE AI CFO PLAYGROUND */}
      <section id="demo" className="py-20 bg-[#0A0D14] border-b border-white/[0.08]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-zinc-800 text-emerald-400 border border-white/5">
              Live Interactive Console
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">
              Test AI Financial Reasoning & Action Payloads
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400">
              Click a sample query to see how the agent reasons, checks guardrails, and emits structured action payloads for the client.
            </p>
          </div>

          {/* Prompt Selector Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
            {samplePrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActivePromptIndex(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer border ${
                  activePromptIndex === idx
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-[0_0_12px_rgba(52,211,153,0.15)]'
                    : 'bg-zinc-900 text-zinc-400 border-white/10 hover:text-white'
                }`}
              >
                {item.category}
              </button>
            ))}
          </div>

          {/* Interactive Simulation Output Card */}
          <div className="rounded-2xl bg-zinc-950 border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* User Query */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-white font-bold text-xs shrink-0 font-mono">
                YOU
              </div>
              <div className="bg-zinc-900/80 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none text-xs text-zinc-200 font-medium max-w-xl">
                "{samplePrompts[activePromptIndex].question}"
              </div>
            </div>

            {/* AI Agent Response & Action Block */}
            <div className="flex items-start gap-3 pt-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0 font-mono">
                AI
              </div>
              <div className="flex-1 bg-zinc-900/60 border border-emerald-500/30 px-5 py-4 rounded-2xl rounded-tl-none text-xs space-y-4 shadow-md">
                
                {/* Header with Execution Metric */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5 text-[11px] font-mono">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>LangGraph CFO Reasoning Output</span>
                  </div>
                  <span className="text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded border border-white/5">
                    Latency: {samplePrompts[activePromptIndex].latency}
                  </span>
                </div>

                {/* Response Text */}
                <p className="text-zinc-200 leading-relaxed text-xs sm:text-sm">
                  {samplePrompts[activePromptIndex].response}
                </p>

                {/* Structured JSON Action Block emitted to frontend */}
                <div className="pt-2">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                    Structured Action Payload Emitted to Client:
                  </span>
                  <pre className="p-3 rounded-lg bg-black/60 border border-white/5 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                    {JSON.stringify(samplePrompts[activePromptIndex].actionBlock, null, 2)}
                  </pre>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. ENGINEERING NOTES (Real Bottlenecks Solved) */}
      <section id="engineering-notes" className="py-20 bg-[#07090E] border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-zinc-800 text-emerald-400 border border-white/5">
              Production Hardening
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
              Real Bottlenecks Profiled & Solved
            </h2>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
              Every production system encounters real limitations during load testing. Here are three bottlenecks I discovered through k6 testing and resolved in the codebase:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {/* Bottleneck 1 */}
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] space-y-3">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>Issue: Threadpool Starvation</span>
              </div>
              <h4 className="text-sm font-bold text-white">
                AnyIO Default 40-Thread Ceiling
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                During 50 VU stress tests, asynchronous requests running synchronous library operations choked on AnyIO's default 40-worker thread limiter.
              </p>
              <div className="pt-3 border-t border-white/5">
                <div className="text-[11px] font-mono text-emerald-400 font-semibold mb-1">
                  ✓ Resolution:
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Configured lifespan limiter to 100 threads in <code className="text-[11px] font-mono text-zinc-400">app/main.py</code>, doubling concurrent throughput without unbounded memory usage.
                </p>
              </div>
            </div>

            {/* Bottleneck 2 */}
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>Issue: Cache Stampedes</span>
              </div>
              <h4 className="text-sm font-bold text-white">
                Over-Broad Cache Invalidation
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                A single user creating a transaction previously flushed global caches, destroying cached aggregations for unrelated users and spiking database CPU.
              </p>
              <div className="pt-3 border-t border-white/5">
                <div className="text-[11px] font-mono text-emerald-400 font-semibold mb-1">
                  ✓ Resolution:
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Refactored <code className="text-[11px] font-mono text-zinc-400">CachePort.invalidate_user()</code> to scope pattern keys strictly to <code className="text-[11px] font-mono text-zinc-400">{'{user_id}'}</code>, isolating mutations.
                </p>
              </div>
            </div>

            {/* Bottleneck 3 */}
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.08] space-y-3">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>Issue: Table Scans</span>
              </div>
              <h4 className="text-sm font-bold text-white">
                Telegram Link Code Resolution
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The legacy prototype iterated through memory decrypting link codes for all users to authenticate incoming Telegram webhooks.
              </p>
              <div className="pt-3 border-t border-white/5">
                <div className="text-[11px] font-mono text-emerald-400 font-semibold mb-1">
                  ✓ Resolution:
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Implemented ephemeral 10-minute indexed codes on the user record, turning $O(N)$ linear scans into an instant $O(1)$ query with auto-invalidation.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. FOOTER WITH RECRUITER LINKS */}
      <footer className="py-12 bg-[#05070B] border-t border-white/[0.08] text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/5">
            <div>
              <div className="flex items-center gap-3">
                <ArthaLogo size="sm" showText={true} />
                <span className="font-mono text-zinc-500">|</span>
                <span className="font-mono text-zinc-400">Designed & Engineered by Nilay Dawn</span>
              </div>
              <p className="mt-2 text-zinc-500 max-w-md">
                Production-tested personal finance system built with FastAPI, LangGraph, Supabase PostgreSQL, and Clean Hexagonal Architecture.
              </p>
            </div>

            {/* Direct Links for Technical Review */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 font-mono text-xs">
              <a
                href={swaggerDocsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>FastAPI /docs</span>
                <ExternalLink className="w-3 h-3 text-zinc-500" />
              </a>

              <button
                onClick={() => {
                  setActiveTestTab('scenarios');
                  setShowLoadTestModal(true);
                }}
                className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>k6 Report Details</span>
              </button>

              <Link
                to={user ? "/dashboard" : "/signup"}
                className="px-4 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>Live App</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-[11px] font-mono">
            <div>
              Clean Architecture • Zero Vendor Lock-in • Tested Under Real Concurrency
            </div>
            <div>
              © {new Date().getFullYear()} ARTHA AI. All rights reserved.
            </div>
          </div>

        </div>
      </footer>

      {/* 9. INTERACTIVE LOAD TEST REPORT MODAL */}
      {showLoadTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0B0F17] border border-white/15 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-950">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>ARTHA Backend k6 Load Test Report</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-emerald-400 border border-white/5">
                      21,114 Reqs Total
                    </span>
                  </h3>
                  <p className="text-[11px] font-mono text-zinc-400">
                    Target: ARTHA FastAPI ASGI Engine (Linux x86_64) • Tool: k6 v2.3.0
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowLoadTestModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="px-6 pt-3 border-b border-white/10 flex items-center gap-2 bg-zinc-950/50">
              <button
                onClick={() => setActiveTestTab('summary')}
                className={`px-3 py-2 text-xs font-mono font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTestTab === 'summary'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Executive Findings
              </button>
              <button
                onClick={() => setActiveTestTab('scenarios')}
                className={`px-3 py-2 text-xs font-mono font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTestTab === 'scenarios'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                All 6 Scenarios Breakdown
              </button>
              <button
                onClick={() => setActiveTestTab('bottlenecks')}
                className={`px-3 py-2 text-xs font-mono font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTestTab === 'bottlenecks'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Resolved Bottlenecks
              </button>
            </div>

            {/* Modal Content Area */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-zinc-300 font-sans">
              
              {activeTestTab === 'summary' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 space-y-2">
                    <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block">
                      Core Benchmark Assessment
                    </span>
                    <p className="leading-relaxed">
                      Testing was systematically conducted across six scenarios: <strong>Smoke (2 VUs)</strong>, <strong>Normal Load (10 VUs)</strong>, <strong>Stress (50 VUs)</strong>, <strong>Spike (35 VUs burst)</strong>, <strong>Soak (12 VUs endurance)</strong>, and <strong>Breakpoint (75 VUs capacity probe)</strong>.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                    <div className="p-3 rounded-lg bg-zinc-950 border border-white/5">
                      <div className="text-[10px] text-zinc-500 uppercase">Total Reqs Tested</div>
                      <div className="text-lg font-bold text-white mt-0.5">21,114</div>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-950 border border-white/5">
                      <div className="text-[10px] text-zinc-500 uppercase">Normal Load Error %</div>
                      <div className="text-lg font-bold text-emerald-400 mt-0.5">0.00%</div>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-950 border border-white/5">
                      <div className="text-[10px] text-zinc-500 uppercase">Max Throughput</div>
                      <div className="text-lg font-bold text-white mt-0.5">49.6 req/s</div>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-950 border border-white/5">
                      <div className="text-[10px] text-zinc-500 uppercase">Cached Route Latency</div>
                      <div className="text-lg font-bold text-amber-400 mt-0.5">2.8 - 4.1 ms</div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">
                      Engineering Takeaways:
                    </h4>
                    <ul className="space-y-2 text-zinc-400 list-disc list-inside leading-relaxed">
                      <li><strong className="text-zinc-200">Zero Memory Leaks:</strong> Over continuous soak testing (1,766 requests), P95 latency remained flat at 1.40s without drift.</li>
                      <li><strong className="text-zinc-200">Rapid Elastic Recovery:</strong> Under 17.5x spike loads (35 VUs in 10s), error rate was 1.4% with instantaneous recovery.</li>
                      <li><strong className="text-zinc-200">Identified Saturation Knee:</strong> Remote database connection saturation begins at &gt;25 concurrent VUs, establishing the exact point where read-replica pooling is required.</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTestTab === 'scenarios' && (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-[11px] border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-zinc-400">
                          <th className="py-2.5 px-3">Scenario</th>
                          <th className="py-2.5 px-3">Concurrency</th>
                          <th className="py-2.5 px-3">Requests</th>
                          <th className="py-2.5 px-3">Throughput</th>
                          <th className="py-2.5 px-3">Error %</th>
                          <th className="py-2.5 px-3">Assessment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-zinc-300">
                        {k6Scenarios.map((sc, i) => (
                          <tr key={i} className="hover:bg-zinc-900/50">
                            <td className="py-2.5 px-3 font-bold text-white">{sc.name}</td>
                            <td className="py-2.5 px-3 text-zinc-400">{sc.concurrency}</td>
                            <td className="py-2.5 px-3">{sc.requests}</td>
                            <td className="py-2.5 px-3 text-emerald-400">{sc.throughput}</td>
                            <td className="py-2.5 px-3 font-semibold">{sc.errorRate}</td>
                            <td className="py-2.5 px-3 text-zinc-400 text-[10px]">{sc.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    *Breakpoint probe accumulated 12,919 requests. The ASGI server successfully sustained ~50 req/s before remote Supabase GoTrue token expired (60-minute limit).
                  </p>
                </div>
              )}

              {activeTestTab === 'bottlenecks' && (
                <div className="space-y-4 font-mono">
                  <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5">
                    <span className="text-rose-400 font-bold text-[11px] block mb-1">
                      1. AnyIO Default 40-Thread Limit
                    </span>
                    <p className="text-zinc-400 text-xs mb-2 leading-relaxed">
                      Sync DB drivers running inside FastAPI async event loop choked on default AnyIO capacity under 50 VUs.
                    </p>
                    <span className="text-emerald-400 text-xs">
                      Fix: Injected AnyIO lifespan thread limiter = 100 in app/main.py.
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5">
                    <span className="text-amber-400 font-bold text-[11px] block mb-1">
                      2. Global Cache Over-Invalidation
                    </span>
                    <p className="text-zinc-400 text-xs mb-2 leading-relaxed">
                      Transaction write operations wiped global cache keys across all users, causing thundering herd problems.
                    </p>
                    <span className="text-emerald-400 text-xs">
                      Fix: Scoped CachePort.invalidate_user() pattern keys strictly to user_id.
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5">
                    <span className="text-sky-400 font-bold text-[11px] block mb-1">
                      3. Missing Composite Indexes on Ledger Table
                    </span>
                    <p className="text-zinc-400 text-xs mb-2 leading-relaxed">
                      Filtered reads on (user_id, date) performed sequential table scans under increasing record volumes.
                    </p>
                    <span className="text-emerald-400 text-xs">
                      Fix: Applied composite index idx_transactions_user_date (user_id, date DESC).
                    </span>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-white/10 flex items-center justify-between bg-zinc-950 text-xs">
              <span className="font-mono text-zinc-500 text-[11px]">
                Full report file: backend/docs/LOAD_TEST_REPORT.md
              </span>
              <button
                onClick={() => setShowLoadTestModal(false)}
                className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium cursor-pointer transition-colors"
              >
                Close Report
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
