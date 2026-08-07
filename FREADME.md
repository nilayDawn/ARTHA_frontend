# FinPilot AI — Frontend

The official frontend for **FinPilot AI**, a personal finance assistant powered by an AI agent (LangGraph + Gemini 2.5) with OCR receipt scanning, document auto-extraction, and natural-language financial chat.

This is a **React 19 + Vite** single-page application built with **Tailwind CSS v4**, **Supabase** for authentication, and **Recharts** for data visualization. It consumes the FastAPI backend located in the sibling `backend/` directory.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Prerequisites](#prerequisites)
3. [Getting Started](#getting-started)
4. [Environment Configuration](#environment-configuration)
5. [Project Structure](#project-structure)
6. [Routing & Application Flow](#routing--application-flow)
7. [Authentication & State Management](#authentication--state-management)
8. [API Service Layer](#api-service-layer)
9. [Components](#components)
10. [Pages](#pages)
11. [Styling & Theming](#styling--theming)
12. [Scripts & Tooling](#scripts--tooling)
13. [Data Flow & Backend Integration](#data-flow--backend-integration)
14. [Current Status & Known Limitations](#current-status--known-limitations)

---

## Tech Stack

| Layer            | Technology                                                              |
| ---------------- | ----------------------------------------------------------------------- |
| Framework        | [React 19](https://react.dev) + [Vite 8](https://vitejs.dev)             |
| Language         | JavaScript (ESM)                                                        |
| Routing          | [React Router v7](https://reactrouter.com)                              |
| Styling          | [Tailwind CSS v4](https://tailwindcss.com) + custom CSS                 |
| Icons            | [lucide-react](https://lucide.dev)                                      |
| Charts           | [Recharts](https://recharts.org)                                        |
| HTTP Client      | [Axios](https://axios-http.com)                                         |
| Auth / Backend   | [Supabase JS SDK](https://supabase.com/docs/reference/javascript)       |
| Linting          | ESLint 10 (flat config) + React Hooks + React Refresh plugins           |
| Build Tools      | Vite, `@vitejs/plugin-react`, `@tailwindcss/vite`, PostCSS, Autoprefixer |

> **Note:** The project uses plain JavaScript (`.jsx`), not TypeScript. The Vite template's default `README.md` (React + Vite boilerplate) has been replaced with this document.

---

## Prerequisites

- **Node.js** (v18+ recommended, matching Vite 8 requirements)
- **npm** (comes with Node.js)
- A running **FinPilot AI backend** (FastAPI) — see `backend/README.md`
- A **Supabase** project (for email/password authentication)

---

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables** — copy `.env` values into your environment (see [Environment Configuration](#environment-configuration)).

3. **Start the development server**

   ```bash
   npm run dev
   ```

   Vite will spin up a local dev server (default `http://localhost:5173`) with Hot Module Replacement (HMR).

4. **Build for production**

   ```bash
   npm run build
   ```

   Output is emitted to the `dist/` directory.

5. **Preview the production build**

   ```bash
   npm run preview
   ```

6. **Lint the codebase**

   ```bash
   npm run lint
   ```

---

## Environment Configuration

The app reads the following environment variables (accessed via `import.meta.env`). They are **not** committed to the repository (see `.gitignore`).

| Variable                  | Purpose                                        | Default/Placeholder                    |
| ------------------------- | ---------------------------------------------- | -------------------------------------- |
| `VITE_SUPABASE_URL`       | Supabase project URL for auth                 | `https://placeholder.supabase.co`      |
| `VITE_SUPABASE_ANON_KEY`  | Supabase anon/public API key                  | `placeholder-key`                      |
| `VITE_BACKEND_API_URL`    | Base URL of the FastAPI backend (`/api/v1`)   | `http://localhost:8000/api/v1`         |

> **Important:** If `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` are missing, the app logs a warning via `src/lib/supabase.js` and falls back to placeholder values. Authentication will not work until real values are provided.

---

## Project Structure

```
frontend/
├── .gitignore
├── index.html                 # Vite HTML entry point
├── package.json               # Dependencies & scripts
├── package-lock.json
├── vite.config.js             # Vite + React + Tailwind v4 plugin config
├── eslint.config.js           # ESLint flat config
├── README.md                  # This document
├── public/
│   ├── favicon.svg            # App favicon
│   └── icons.svg              # SVG sprite of social/brand icons
└── src/
    ├── main.jsx               # React entry point (createRoot + StrictMode)
    ├── App.jsx                # Router, route definitions, auth provider
    ├── App.css                # Legacy template styles (unused by active UI)
    ├── index.css              # Tailwind import + theme tokens + global styles
    ├── assets/                # Static assets
    ├── components/
    │   ├── Layout.jsx             # Authenticated app shell (sidebar, header, content)
    │   ├── ChatDrawer.jsx         # AI assistant chat slide-in drawer
    │   ├── DocumentUploadModal.jsx# Receipt/statement upload modal
    │   ├── TelegramModel.jsx      # "Connect Telegram" modal (account-linking code)
    │   └── ProtectedRoute.jsx     # Route guard for authenticated pages
    ├── context/
    │   └── AuthContext.jsx        # Global auth provider + useAuth hook
    ├── lib/
    │   └── supabase.js            # Supabase client singleton
    ├── pages/
    │   ├── Dashboard.jsx          # Overview with cards, charts, transaction table
    │   ├── Login.jsx              # Sign-in page
    │   └── Signup.jsx             # Account creation page
    └── services/
        └── api.js                 # Axios instance + typed API helper functions
```

---

## Routing & Application Flow

Routing is defined in `src/App.jsx` using **React Router v7** (`BrowserRouter`).

### Public Routes
- `/login` — `Login` page
- `/signup` — `Signup` page

### Protected Routes (wrapped in `ProtectedRoute` → `Layout`)
- `/dashboard` — `Dashboard` (financial overview)
- `/transactions` — Transactions management (*placeholder*)
- `/budgets` — Budget tracking (*placeholder*)
- `/goals` — Financial goals (*placeholder*)
- `/documents` — Documents & receipts (*placeholder*)

### Catch-all
- `*` → redirects to `/dashboard`

### Navigation hierarchy
```
<AuthProvider>            # provides user/session context
  <BrowserRouter>
    <Routes>
      /login, /signup                      (public)
      <ProtectedRoute>                     (guard: requires user)
        <Layout>                           (app shell)
          /dashboard
          /transactions
          /budgets
          /goals
          /documents
      * → /dashboard
    </Routes>
  </BrowserRouter>
</AuthProvider>
```

> **Note:** `Transactions`, `Budgets`, `Goals`, and `Documents` are currently temporary inline components (placeholders) pending implementation in a later phase.

---

## Authentication & State Management

Authentication is handled by **Supabase Auth** and exposed globally via React Context.

### `src/lib/supabase.js`
Creates and exports a single Supabase client using the environment variables. Warns if credentials are missing.

### `src/context/AuthContext.jsx`
The `AuthProvider` component:
- On mount, fetches the current session via `supabase.auth.getSession()`.
- Subscribes to `supabase.auth.onAuthStateChange()` to react to login, logout, and token refresh events.
- Exposes `{ user, session, loading, logout }` through `useAuth()`.
- While `loading` is true, renders a centered spinner overlay.
- `logout` calls `supabase.auth.signOut()`.

### Route Guard — `src/components/ProtectedRoute.jsx`
- Reads `{ user, loading }` from `useAuth()`.
- Shows a spinner while loading.
- Renders `<Outlet />` (nested routes) if a user is logged in; otherwise redirects (`<Navigate>`) to `/login`.

---

## API Service Layer

`src/services/api.js` centralizes all backend communication:

- Creates an **Axios** instance with `baseURL` from `VITE_BACKEND_API_URL` (default `http://localhost:8000/api/v1`).
- A **request interceptor** attaches the Supabase session's `access_token` as a `Bearer` token to every request.

### Exported helpers

| Function              | Method | Endpoint             | Purpose                                    |
| --------------------- | ------ | -------------------- | ------------------------------------------ |
| `getTransactions()`   | GET    | `/transactions`      | Fetch user transactions                    |
| `createTransaction(payload)` | POST | `/transactions` | Create a transaction                       |
| `getBudgets()`        | GET    | `/budgets`           | Fetch budgets                              |
| `createBudget(payload)` | POST  | `/budgets`           | Create a budget                            |
| `getGoals()`          | GET    | `/goals`             | Fetch financial goals                      |
| `createGoal(payload)` | POST   | `/goals`             | Create a goal                              |
| `chatWithAgent(message, history)` | POST | `/chat` | Send chat message + history to AI agent |
| `uploadDocument(formData)` | POST | `/documents/upload` | Upload image for OCR extraction (multipart) |
| `getTelegramLinkCode()` | POST | `/telegram/link-code` | Generate a `FP-XXXX` code to link the Telegram bot |

`uploadDocument` sets `Content-Type: multipart/form-data` and passes a `FormData` containing the file.
`getTelegramLinkCode` is called by `TelegramModal` and returns `{ code, expires_in_seconds }`.

---

## Components

### `Layout.jsx` — Authenticated App Shell
- **Sidebar** (w-64): brand/logo ("FinPilot AI"), navigation links (Overview, Transactions, Budgets, Goals), a **Connect Telegram** button, an **Upload Receipt** button, and a **Sign Out** button.
- **Header**: shows logged-in user's email, a mobile **Telegram** button, and an **AI Assistant** button that opens the chat drawer.
- **Main content area**: renders nested routes via `<Outlet />`.
- Manages local state for `chatOpen`, `uploadOpen`, and `telegramOpen` to toggle the drawer and modals.
- Uses `lucide-react` icons and highlights the active nav item based on `location.pathname`.

### `ChatDrawer.jsx` — AI Assistant
- Slide-in panel from the right (fixed overlay) for chatting with the FinPilot AI agent.
- Maintains a local `messages` array (initialized with a greeting from the assistant).
- Reconstructs the conversation `history` in the format `{ role, content }` for the backend.
- Calls `chatWithAgent(userMsg, history)` and appends the assistant's response, including `memories_used` (displayed as "Context recalled").
- Shows a loading indicator while the agent is processing.
- Auto-scrolls to the latest message.
- Handles errors gracefully with a fallback message.

### `DocumentUploadModal.jsx` — Receipt / Statement Upload
- Modal with a **drag-and-drop** zone plus a file picker.
- Accepts image types: `JPEG, PNG, WEBP, HEIC`.
- Attaches the selected file to a `FormData` and calls `uploadDocument()`.
- Displays a spinner ("Gemini 2.5 Flash Analyzing Receipt...") during processing.
- On success, shows the extracted transaction (merchant, amount, category, date) and calls the `onSuccess` callback.
- On failure, surfaces the backend error detail.

### `TelegramModal.jsx` — Connect Telegram Assistant
- Modal opened from the **Connect Telegram** button in `Layout` (sidebar + mobile header).
- On open, calls `getTelegramLinkCode()` to fetch a fresh single-use code (valid **10 minutes**).
- Displays the `FP-XXXX` code prominently with a **Copy Command** button (copies `/link FP-XXXX` to the clipboard).
- Provides a deep link **Open Bot** → `https://t.me/FinPilotAIBot?start=FP-XXXX` so the user can launch the bot pre-seeded with their code.
- Includes numbered instructions: open the bot in Telegram, then send `/link <code>`.
- Handles loading and error states gracefully.

### `ProtectedRoute.jsx`
- Route guard wrapper (see [Authentication](#authentication--state-management)).

---

## Pages

### `Dashboard.jsx`
The main financial overview page. On mount it fetches transactions, budgets, and goals in parallel using `Promise.allSettled` (so one failure doesn't block others).

**Summary cards:**
- **Monthly Income** — hardcoded default of `₹60,000` (labeled "Est. Base").
- **Total Expenses** — sum of all transaction amounts.
- **Net Savings** — `max(0, income - expenses)`.
- **Savings Rate** — percentage with a progress bar.

**Charts:**
- **Spending by Category** — a donut (pie) chart built from aggregated transaction amounts per category, with a color-coded legend.
- **Budgets vs Actual Spent** — a grouped bar chart comparing each budget's monthly limit against actual spending for that category.

**Recent Transactions** — a table showing the latest 5 transactions (date, merchant, category, amount).

Charts are rendered with **Recharts** (`PieChart`, `BarChart`, `ResponsiveContainer`, `Tooltip`, etc.). Empty states are shown when no data exists.

### `Login.jsx`
- Email/password sign-in form using `supabase.auth.signInWithPassword()`.
- Displays auth errors inline and navigates to `/dashboard` on success.

### `Signup.jsx`
- Sign-up form with full name, email, and password.
- Calls `supabase.auth.signUp()` with `full_name` stored in user metadata.
- Displays errors and navigates to `/dashboard` on success.

---

## Styling & Theming

- **Tailwind CSS v4** is imported via `@import "tailwindcss";` in `src/index.css`.
- Custom theme tokens are defined with the `@theme` directive, adding a **brand** color palette (greens: `brand-50/100/500/600/700`).
- Global styles set a dark **slate-900** background (`#0f172a`) with light text (`#f8fafc`) and a system font stack.
- The UI uses a **dark theme** throughout with emerald/teal accents.
- `src/App.css` contains leftover Vite template styles (e.g. `.hero`, `.counter`, `#next-steps`) that are **not used** by the active application UI.

### Color Palette Highlights
| Token              | Value      | Usage                              |
| ------------------ | ---------- | ---------------------------------- |
| `brand-500`        | `#22c55e`  | Primary brand green (emerald)      |
| `brand-600`        | `#16a34a`  | Hover / stronger green             |
| `slate-900/950`    | —          | App background                    |
| emerald/teal/rose/purple | —   | Accents for cards, charts, buttons |

---

## Scripts & Tooling

Defined in `package.json`:

| Command               | Description                          |
| --------------------- | ------------------------------------ |
| `npm run dev`         | Start Vite dev server (HMR)          |
| `npm run build`       | Production build to `dist/`          |
| `npm run preview`     | Preview the production build         |
| `npm run lint`        | Run ESLint across the project        |

**ESLint** uses a flat config (`eslint.config.js`) with:
- `@eslint/js` recommended rules
- `eslint-plugin-react-hooks` recommended
- `eslint-plugin-react-refresh` (Vite preset)
- Browser globals and JSX support
- `dist/` ignored

---

## Data Flow & Backend Integration

```
[React UI]  ── Axios (Bearer JWT from Supabase session) ──▶  [FastAPI backend: /api/v1]
    ▲                                                             │
    └──────────── JSON responses (transactions, budgets, goals, chat, OCR) ──┘
```

1. **Authentication**: User signs in via Supabase (client-side). The session's JWT is attached to every API request by the Axios interceptor.
2. **Financial data**: `Dashboard` fetches `/transactions`, `/budgets`, `/goals` and renders cards + charts.
3. **AI Chat**: `ChatDrawer` posts messages + history to `/chat`; the backend (LangGraph + Gemini 2.5) returns a response and optionally `memories_used`.
4. **Documents**: `DocumentUploadModal` POSTs an image to `/documents/upload`; the backend runs OCR (Gemini 2.5 Flash) and returns extracted transaction data.
5. **Telegram linking**: `TelegramModal` POSTs to `/telegram/link-code` to get an `FP-XXXX` code; the user then sends `/link <code>` to the FinPilot AI bot, and the backend maps their `telegram_chat_id` to their Supabase `user_id`. From then on, the bot accepts expense text, receipt photos, and PDF bank statements.

> The frontend must be pointed at a running backend via `VITE_BACKEND_API_URL`, and Supabase credentials must be configured for auth to function end-to-end.

---

## Current Status & Known Limitations

- ✅ **Implemented**: Auth (login/signup/logout), protected routing, app shell/layout, AI chat drawer, document upload modal, **Telegram connection modal**, and dashboard with summary cards + charts + recent transactions.
- ⏳ **Placeholders**: Transactions Management, Budget Tracking, Financial Goals, and Documents & Receipts pages render temporary headings and are not yet fully built.
- ⚠️ **Hardcoded income**: The Dashboard uses a fixed `monthlyIncome` of `₹60,000` as a benchmark; it is not yet user-configurable.
- ⚠️ **Environment required**: Supabase keys and backend URL must be configured for the app to function.
- ⚠️ **Telegram bot URL**: The "Open Bot" deep link points to `t.me/FinPilotAIBot`; this must match the bot name registered with BotFather, and the backend webhook must be deployed and configured for production use.
- 🧹 **Legacy CSS**: `src/App.css` contains unused Vite template styles.

---

*Generated documentation for the FinPilot AI frontend. See `backend/README.md` for backend details.*
