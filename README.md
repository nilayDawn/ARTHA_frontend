# 🏛️ ARTHA AI — Frontend Dashboard & Client Specification

> **Enterprise Personal Finance & AI CFO Client Application**  
> *Built with React 19, Vite, Tailwind CSS v4, Supabase Auth, Recharts, and Axios.*

---

## 🎯 Application Overview

The **ARTHA AI** frontend is a modern web application designed for personal financial management, featuring an AI CFO assistant drawer, automated receipt OCR scanning, interactive visual analytics, and Telegram bot account linking.

### Key Highlights:
### Key Highlights:
- **Luxury Minimalist Design**: Dark slate mode (`#0f172a`), emerald accents, and champagne gold (`#D6A84F`) branding elements. Display logged-in user full name (`user_metadata.full_name`).
- **Modular Reusable UI Architecture**: Centralized `GoogleAuthButton`, `AuthCard`, `PageHeader`, `ErrorAlert`, `LoadingState`, and `EmptyState` components to eliminate code redundancy across pages.
- **Custom ARTHA API Key Management**: `ApiKeyModal` UI component allowing users to set, test, and manage custom API keys stored in `localStorage` with automated `X-User-LLM-Key` request header injection.
- **AI CFO Assistant Drawer**: Integrated LangGraph conversational interface with grounding memory pills and structured database action parsing.
- **Visual Analytics**: Interactive donut charts for spending categories and side-by-side grouped bar charts for budget limits vs. actual spent via **Recharts**.
- **Automated Receipt & Document OCR Upload**: File dropzone supporting receipt scanning via ARTHA Vision.
- **Telegram Account Linking Modal**: One-click command generation (`/link FP-XXXX`) and direct Telegram deep-linking.
- **Email Financial Summary Dispatch**: One-click asynchronous dispatch of HTML summary reports to the user's registered email address.

---

## 🛠 Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [React 19](https://react.dev) | UI Component Architecture |
| **Build Tool** | [Vite 8](https://vitejs.dev) | Lightning-fast HMR and bundling |
| **Routing** | [React Router v7](https://reactrouter.com) | Client-side routing with route guards |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) | Theme tokens & modern utility classes |
| **State & Auth** | Supabase Auth + React Context | Session management & JWT bearer token injection |
| **Icons** | [lucide-react](https://lucide.dev) | Modern vector icons |
| **Charts** | [Recharts](https://recharts.org) | Responsive data visualization |
| **HTTP Client** | [Axios](https://axios-http.com) | API requests with automated auth bearer & custom LLM key header interceptors |

---

## 📁 Repository Structure

```text
frontend/
├── index.html                 # HTML entrypoint
├── package.json               # Dependencies & build scripts
├── vite.config.js             # Vite, React, and Tailwind v4 setup
├── FREADME.md                 # Frontend architecture specification
├── README.md                  # Mirror documentation
└── src/
    ├── main.jsx               # App mounting entrypoint
    ├── App.jsx                # Router setup & ProtectedRoute guards
    ├── index.css              # Global styles, Tailwind v4 directives & theme tokens
    ├── assets/                # ARTHA brand logo assets
    ├── components/            # UI Components
    │   ├── Layout.jsx             # Shell sidebar, header, user profile capsule & modals toggle
    │   ├── ChatDrawer.jsx         # AI CFO Assistant slide-in drawer
    │   ├── ApiKeyModal.jsx        # Custom ARTHA API Key modal
    │   ├── DocumentUploadModal.jsx# Receipt & invoice dropzone upload modal
    │   ├── TelegramModel.jsx      # Telegram bot connection modal
    │   ├── ProtectedRoute.jsx     # Auth session wrapper
    │   └── ui/                    # Shared Reusable UI Components
    │       ├── GoogleAuthButton.jsx   # Shared Google OAuth button
    │       ├── AuthCard.jsx           # Auth page container card
    │       ├── PageHeader.jsx         # Standard page top header
    │       ├── ErrorAlert.jsx         # Standardized error notification banner
    │       ├── LoadingState.jsx       # Standardized loading indicator
    │       └── EmptyState.jsx         # Standardized empty state display
    ├── context/
    │   └── AuthContext.jsx        # Supabase auth session provider
    ├── lib/
    │   └── supabase.js            # Supabase client singleton
    ├── pages/
    │   ├── Dashboard.jsx          # Summary cards, charts & transaction history
    │   ├── Transactions.jsx       # Transaction management & category editing
    │   ├── Budgets.jsx            # Category budget limits & AI monitor
    │   ├── Goals.jsx              # Savings goals & deposit management
    │   ├── Documents.jsx          # Receipts & bank statements OCR library
    │   ├── Login.jsx              # User sign-in page
    │   └── Signup.jsx             # User registration page
    └── services/
        └── api.js                 # Axios instance with Bearer JWT & X-User-LLM-Key interceptors
```

---

## 🔗 Backend API Integration

The frontend communicates with the FastAPI backend (`http://localhost:8000/api/v1`) via `src/services/api.js`.

| Helper Function | HTTP Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| `getTransactions()` | `GET` | `/transactions` | Fetch user transactions |
| `createTransaction()` | `POST` | `/transactions` | Log new transaction |
| `getBudgets()` | `GET` | `/budgets` | Fetch active monthly budgets |
| `createBudget()` | `POST` | `/budgets` | Set budget |
| `getGoals()` | `GET` | `/goals` | Fetch savings goals |
| `createGoal()` | `POST` | `/goals` | Create goal |
| `chatWithAgent()` | `POST` | `/chat` | Send message + history + custom API key to ARTHA AI agent |
| `validateApiKey()` | `POST` | `/chat/validate-key` | Perform live ping test for custom ARTHA API Key |
| `uploadDocument()` | `POST` | `/documents/upload` | Upload receipt image for OCR processing |
| `getTelegramLinkCode()` | `POST` | `/telegram/link-code` | Fetch encrypted `FP-XXXX` Telegram link token |
| `sendReportEmail()` | `POST` | `/reports/send-email` | Dispatch email summary report via Resend |

---

## ⚡ Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment (`.env`)**:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_BACKEND_API_URL=http://localhost:8000/api/v1
   VITE_TELEGRAM_BOT_USERNAME=NilFinanceBot
   ```

3. **Run Local Dev Server**:
   ```bash
   npm run dev
   ```

4. **Production Build**:
   ```bash
   npm run build
   ```

---

*Authored by the ARTHA AI Core Team.*

## License

Copyright (C) 2026  Nilay Dawn

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

See the [LICENSE](LICENSE) file for more details.
