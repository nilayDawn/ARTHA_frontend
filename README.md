# 🏛️ ARTHA AI — Frontend Client Application

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8.2.0-646CFF?style=for-the-badge&logo=vite" alt="Vite 8" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Data%20Viz-Recharts-22b5bf?style=for-the-badge" alt="Recharts" />
  <img src="https://img.shields.io/badge/Auth-Supabase%20Session-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Bundle%20Optimized-87.4%25%20Reduction-brightgreen?style=for-the-badge" alt="Optimized" />
</p>

---

## 🎯 Application Overview

The **ARTHA AI** frontend is an enterprise-grade financial management SPA engineered with **React 19**, **Vite 8**, and **Tailwind CSS v4**. It features real-time financial tracking, interactive charts, receipt/invoice OCR scanning, an AI CFO assistant drawer, and multi-channel account synchronization.

### Key Capabilities & Engineering Highlights:
- **Modular Domain API Architecture**: Dedicated client modules (`api/auth.js`, `api/finance.js`, `api/chat.js`, `api/documents.js`, `api/payments.js`, `api/catalogue.js`) with automatic Supabase JWT and custom user LLM key injection.
- **Global Reactive Mutation Bus (`FinanceContext`)**: When an AI agent logs a transaction in the chat drawer or an OCR receipt is processed, `refreshFinance()` immediately updates the dashboard, budgets, and transaction tables without page reloads.
- **Route-Level Code Splitting & Dynamic Imports**: Built with `React.lazy()` and `<Suspense>`, reducing initial index bundle size from **1,024 KB down to 129 KB (87.4% reduction)**.
- **Zero-Redundancy Backend Aggregations**: Eliminates client-side array loops by pulling pre-calculated, Redis-cached KPIs from `/api/v1/summary`.
- **Dynamic Catalogue Integration**: Automatically loads standardized spending categories and 50/30/20 budget templates from `/api/v1/catalogue`.
- **Stateful Telegram Bot Account Linking**: One-click generation of ephemeral `FP-XXXX` tokens with instant clipboard copy and Telegram deep-linking.

---

## 📊 Bundle Performance & Optimization Benchmarks

| Metric | Before Optimization | After Transformation | Engineering Gain |
| :--- | :--- | :--- | :--- |
| **Initial JS Bundle** | `1,024.08 kB` (Single Monolith) | **`129.41 kB`** (`dist/assets/index.js`) | **87.4% Bundle Cut** |
| **Landing Page Chunk**| Downloaded whole app | **`25.98 kB`** (5.66 kB gzipped) | **Sub-50ms Initial Load** |
| **Login / Signup Chunks**| Downloaded whole app | **`3.69 kB` / `4.32 kB`** | **Instant Route Switch** |
| **Heavy Charts (Recharts)**| In initial bundle | Split into `vendor-charts` (loaded on dashboard only) | **Zero penalty for public visitors** |
| **Vite Chunk Warnings** | `(!) Chunks > 500 kB` | **0 Warnings / Clean Build** | **Production Ready** |

---

## 🏗️ Client Architecture & State Flow

```mermaid
graph TD
    User([User Interaction]) --> Router[React Router v7 + Suspense]

    subgraph Route-Level Code Splitting
        Router -->|Lazy| Landing[Landing View ~25 KB]
        Router -->|Lazy| Auth[Login / Signup ~4 KB]
        Router -->|Lazy| Dashboard[Dashboard View ~13 KB]
        Router -->|Lazy| Transactions[Transactions View ~12 KB]
        Router -->|Lazy| Budgets[Budgets & Goals ~25 KB]
    end

    subgraph Redux Toolkit State Management
        Dashboard & Transactions & Budgets <--> ReduxStore[Redux Toolkit Store]
        ReduxStore --> AuthSlice[authSlice: Session, User, Profile]
        ReduxStore --> FinanceSlice[financeSlice: Tx, Budgets, Goals, Summary]
        ReduxStore --> DocSlice[documentSlice: OCR Uploads & Status]
        ReduxStore --> ChatSlice[chatSlice: Message Thread & Streaming]
        ReduxStore --> UISlice[uiSlice: Modals & Drawer Visibility]
    end

    subgraph Modular API Layer
        FinanceSlice --> FinAPI[api/finance.js]
        Dashboard --> CatAPI[api/catalogue.js]
        ChatSlice --> ChatAPI[api/chat.js]
        DocSlice --> DocAPI[api/documents.js]
    end

    subgraph Backend Gateway
        FinAPI & CatAPI & ChatAPI & DocAPI --> Axios[Axios Interceptors JWT & LLM Key]
        Axios --> LiveBackend[(FastAPI Backend Gateway)]
    end
```

---

## 📁 Project Directory Layout

```text
frontend/
├── index.html                     # HTML5 Shell
├── package.json                   # Dependencies (React 19, Redux Toolkit, Tailwind v4, Recharts, Vite 8)
├── vite.config.js                 # Rollup code splitting & vendor manualChunks
├── jsconfig.json                  # Path aliases (@/* -> src/*)
├── README.md                      # Client architecture specification
└── src/
    ├── main.jsx                   # Application bootstrap with Redux Provider
    ├── App.jsx                    # Lazy router, Suspense & Auth subscriber
    ├── index.css                  # Theme tokens, custom utilities & glassmorphism
    ├── redux/                     # Redux Toolkit State Layer
    │   ├── store.js               # Central root store
    │   ├── hooks.js               # Typed useAppDispatch & useAppSelector
    │   └── slices/                # Domain-Driven Slices
    │       ├── authSlice.js       # Supabase auth, user sync & thunks
    │       ├── financeSlice.js    # Transactions, budgets, goals, summary, selectors
    │       ├── documentSlice.js   # Document list, uploads & deletion
    │       ├── chatSlice.js       # AI chat thread & drawer state
    │       └── uiSlice.js         # Modal dialog visibility controls
    ├── api/                       # Decoupled Domain HTTP Modules
    │   ├── client.js              # Base Axios instance with Bearer JWT interceptor
    │   ├── endpoints.js           # API route constants
    │   ├── auth.js                # Signup, Login, Me, Profile
    │   ├── finance.js             # Transactions, Budgets, Goals, Summary
    │   ├── chat.js                # AI CFO chat & custom API key validator
    │   ├── documents.js           # Multi-modal receipt OCR upload
    │   ├── payments.js            # Stripe checkout sessions & subscriptions
    │   ├── catalogue.js           # Categories, merchant rules & budget templates
    │   ├── telegram.js            # Link code generation
    │   ├── reports.js             # HTML email reports trigger
    │   └── index.js               # Centralized barrel export
    ├── features/                  # Domain-Driven UI Modules
    │   ├── auth/                  # LoginPage, SignupPage
    │   ├── dashboard/             # DashboardPage with real-time analytics
    │   ├── transactions/          # TransactionsPage with filters & table
    │   ├── budgets/               # BudgetsPage & budget cards
    │   ├── goals/                 # GoalsPage & progress rings
    │   ├── documents/             # DocumentsPage & DocumentUploadModal
    │   ├── chat/                  # ChatDrawer AI copilot
    │   ├── settings/              # ApiKeyModal & TelegramModal
    │   └── landing/               # LandingPage product showcase
    ├── components/
    │   ├── layout/Layout.jsx      # App shell with sidebar, header & modal mounts
    │   └── common/                # Reusable UI primitives (Badge, StatCard, CustomSelect, etc.)
    └── routes/                    # Route Definitions & Guards
        ├── AppRoutes.jsx          # React.lazy() route declarations
        └── ProtectedRoute.jsx     # Redux-backed auth guard
    └── utils/
        └── financeUtils.js        # Formatting & currency helpers (₹)
```

---

## 🚀 Development & Production Build

### 1. Environment Configuration
Create a `.env` file in the `frontend/` directory:
```env
VITE_BACKEND_API_URL="http://localhost:8000/api/v1"
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 2. Install & Start Development Server
```bash
npm install
npm run dev
```
Navigate to `http://localhost:5173`.

### 3. Production Build & Chunk Inspection
```bash
npm run build
```
Output:
```text
dist/index.html                             3.78 kB │ gzip:   1.27 kB
dist/assets/index-Bb8W9FWu.css             65.34 kB │ gzip:  10.63 kB
dist/assets/LoadingState-CO0Ne0_Z.js        0.38 kB │ gzip:   0.27 kB
dist/assets/Login-DPGqpImJ.js               3.69 kB │ gzip:   1.53 kB
dist/assets/Signup-DfjkxQgM.js              4.32 kB │ gzip:   1.59 kB
dist/assets/Transactions-BFGnlngU.js       12.82 kB │ gzip:   3.49 kB
dist/assets/Dashboard-CWzsXnUK.js          13.14 kB │ gzip:   3.67 kB
dist/assets/Landing-DtmgvDmU.js            25.98 kB │ gzip:   5.66 kB
dist/assets/index-BZnsI4sn.js             129.41 kB │ gzip:  41.77 kB
dist/assets/vendor-react-HfXirebA.js      178.63 kB │ gzip:  56.44 kB
dist/assets/vendor-supabase-CV0_D-zB.js   207.02 kB │ gzip:  53.40 kB
dist/assets/vendor-charts-o6AMm8zd.js     403.68 kB │ gzip: 115.18 kB
✓ built in 556ms
```

---

## 📄 License

Copyright (C) 2026 Nilay Dawn. Released under the GNU General Public License v3.0.
