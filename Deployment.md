# Complete Production Deployment & Architecture Documentation

**Project:** FinPilot AI — Web Dashboard & Interactive Frontend

**Target Infrastructure:** Azure Static Web Apps (Edge Global Content Delivery Network)

**Framework & Bundler:** React 18 / TypeScript / Vite

**Live Production URL:** `https://gentle-grass-0ac410700.7.azurestaticapps.net`

**Backend Host Target:** `https://artha-api-live-f3cke3azcmd2d4fw.centralindia-01.azurewebsites.net`

**Auth & BaaS Integration:** Supabase (`@supabase/supabase-js`)

---

## 1. Executive Summary & Architectural Decisions

### 1.1 Why Azure Static Web Apps (SWA) vs. Node.js Container Hosting

When deploying modern Single-Page Applications (SPAs) built with React and Vite, running a full Node.js container or virtual machine is inefficient and costly.

```
                                 ┌────────────────────────────────────────────────────────┐
                                 │         FRONTEND HOSTING ARCHITECTURE (AZURE SWA)       │
                                 └────────────────────────────────────────────────────────┘

 [ Global Browser Client ] ──────────────► [ Microsoft Azure Global Edge CDN ]
                                                            │
                                  ┌─────────────────────────┴────────────────────────┐
                                  │                                                  │
                                  ▼                                                  ▼
                     [ Asset Cache (Immutable) ]                           [ SPA Routing Engine ]
                     ├─ /assets/index-[hash].js                            ├─ staticwebapp.config.json
                     ├─ /assets/vendor-[hash].js                           └─ Rewrite /* ──► /index.html
                     └─ /assets/index-[hash].css                                      │
                                                                                      │ (Hydration in Browser)
                                                                                      ▼
                                                                           [ React Virtual DOM (SPA) ]
                                                                           ├─ Supabase Auth Client
                                                                           ├─ Chart.js / Recharts Engine
                                                                           ├─ Telegram Connect Modal
                                                                           └─ REST Client (Axios/Fetch)
                                                                                      │
                                                                                      │ HTTPS (Bearer JWT)
                                                                                      ▼
                                                                           [ Azure App Service Backend ]
                                                                           (artha-api-live)

```

1. **Global Anycast Edge CDN Distribution:**
* Instead of serving static `.js`, `.css`, and images from a single centralized server in one region, Azure Static Web Apps replicates compiled production assets across hundreds of Microsoft Edge Points of Presence (PoPs) worldwide.
* Static assets are downloaded with near-zero latency ($<15\text{ ms}$).


2. **Zero Maintenance & Free-Tier Efficiency:**
* Under the **Azure for Students Subscription**, Azure Static Web Apps provides a dedicated **Free Tier** offering unlimited SSL certificate renewals, custom domain bindings, and automated GitHub CI/CD deployments with $0$ credit burn.


3. **Atomic Production Deployments:**
* Deployments pushed to `main` build inside an isolated container runner and swap atomically. If a build breaks or TypeScript errors occur, the previous live production build remains served without downtime.



---

## 2. Deep Dive: SPA Client-Side Routing & `staticwebapp.config.json`

### 2.1 The Classic SPA 404 Problem

In a React SPA (built with React Router or TanStack Router), navigation between pages (e.g., `/dashboard`, `/analytics`, `/login`, `/settings`) is handled entirely in the browser’s memory using the HTML5 `History.pushState()` API.

When a user visits `https://gentle-grass-0ac410700.7.azurestaticapps.net/` and clicks around, the client updates the URL without reloading the page. However:

* If a user bookmarks `https://gentle-grass-0ac410700.7.azurestaticapps.net/dashboard` and refreshes the page, the browser sends an HTTP `GET /dashboard` request directly to the Azure storage server.
* Because no physical file or folder named `/dashboard` exists on disk (only `/index.html` and compiled assets in `/assets/` exist), the web server naturally responds with an **`HTTP 404 Not Found`**.

---

### 2.2 The Solution: Custom Navigation Fallback Rules

To solve this, a `staticwebapp.config.json` file was engineered and committed to the root of the frontend repository:

```json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/images/*.{png,jpg,gif,ico,webp}", "/css/*", "/assets/*"]
  },
  "responseOverrides": {
    "404": {
      "rewrite": "/index.html"
    }
  }
}

```

#### Detailed Breakdown of Rules:

* **`navigationFallback.rewrite: "/index.html"`**: Intercepts any incoming HTTP request targeting an unrecognized route and serves the primary `/index.html` file with an `HTTP 200 OK`. The browser then loads the JavaScript bundle, and React Router examines the browser's current URL and mounts the correct page component (`Dashboard.tsx`).
* **`navigationFallback.exclude: [...]`**: Prevents image requests (e.g., `/images/logo.png`) and code chunk requests (`/assets/chunk-XYZ.js`) from being rewritten to `index.html` if they are missing, preventing corrupt asset execution.
* **`responseOverrides.404.rewrite: "/index.html"`**: Hardens edge cases by redirecting direct 404 status codes back to the React root router.

---

## 3. Production Environment Variable Injection: Build-Time vs. Runtime

A major difference between Backend (FastAPI) and Frontend (Vite + React) cloud hosting is **when environment variables are resolved**:

```
 [ Backend (FastAPI / Azure App Service) ] ──► Runtime Evaluation
                                               os.getenv("KEY") reads live OS variables on every request.

 [ Frontend (Vite / React SPA) ]           ──► Build-Time Static Injection (Baking)
                                               import.meta.env.VITE_* is replaced by strings during 'npm run build'.

```

### 3.1 The Vite `VITE_` Prefix Mandate

Vite explicitly ignores environment variables that do not start with `VITE_` to prevent leaking private backend secrets (such as Supabase service role keys or database passwords) into the client-side browser bundle.

### 3.2 Frontend Production Keys Configured in Azure Static Web Apps:

| Variable Key | Target Environment | Purpose / Role |
| --- | --- | --- |
| `VITE_BACKEND_API_URL` | `https://artha-api-live-f3cke3azcmd2d4fw.centralindia-01.azurewebsites.net` | Target endpoint for all REST operations (Chat agent, document processing, budget CRUD, report triggers). |
| `VITE_SUPABASE_URL` | `https://your-supabase-id.supabase.co` | Supabase endpoint for JWT verification, session persistence, and profile metadata. |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Public client token used by `@supabase/supabase-js` for browser-scoped database requests. |

---

## 4. End-to-End CORS & Security Handshake

When a browser running on `https://gentle-grass-0ac410700.7.azurestaticapps.net` initiates an HTTP request to `https://artha-api-live...azurewebsites.net`, modern browsers enforce **Cross-Origin Resource Sharing (CORS)** via preflight `OPTIONS` requests.

```
 [ React Frontend (Azure SWA) ]                           [ FastAPI Backend (Azure App Service) ]
  Origin: gentle-grass-0ac410700...                        arth-api-live...
               │                                                         │
               │ 1. HTTP OPTIONS (Preflight Check)                       │
               │    Header: Origin = https://gentle-grass...             │
               ├────────────────────────────────────────────────────────►│
               │                                                         │ ── Checks origins whitelist
               │ 2. HTTP 200 OK                                          │ ── Matches gentle-grass!
               │    Access-Control-Allow-Origin: gentle-grass...         │
               │    Access-Control-Allow-Credentials: true               │
               │◄────────────────────────────────────────────────────────┤
               │                                                         │
               │ 3. Actual HTTP POST /api/v1/chat                        │
               │    Authorization: Bearer <Supabase_JWT>                 │
               ├────────────────────────────────────────────────────────►│
               │                                                         │ ── Validates JWT
               │                                                         │ ── Executes LangGraph Agent
               │ 4. HTTP 200 OK (JSON Stream / Assistant Response)        │
               │◄────────────────────────────────────────────────────────┤

```

### 4.1 Production Middleware Block in Backend `app/main.py`

To support this secure cross-origin communication without exposing the API to malicious third-party scrapers:

```python
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:5173",                                    # Local Vite dev server
    "http://localhost:3000",                                    # Local alternate dev server
    "https://gentle-grass-0ac410700.7.azurestaticapps.net",     # Production Azure SWA domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

```

#### Why this CORS configuration is secure:

1. **Explicit Origin Whitelisting:** Wildcard origins (`"*"`) are forbidden when credentials (`allow_credentials=True`) are enabled. Specifying only the exact Azure Static Web App URL ensures other web applications cannot make authenticated requests using stolen cookies or local tokens.
2. **`allow_credentials=True`:** Enables the React browser client to attach `Authorization: Bearer <token>` headers on every secured request.
3. **`allow_methods=["*"]` & `allow_headers=["*"]`:** Allows all REST verbs (`GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`) and content types (`application/json`, `multipart/form-data` for receipt uploads) without triggering browser-level header rejections.

---

## 5. Automated CI/CD Deployment Pipeline

Azure Static Web Apps integrates directly with GitHub by committing an automated workflow file (`.github/workflows/azure-static-web-apps-*.yml`) inside your frontend repository.

### 5.1 The Automated GitHub Actions Workflow File

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: true
          lfs: false

      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"               # Application root directory
          api_location: ""                # No backend functions inside SWA
          output_location: "dist"         # Vite build output directory

```

### 5.2 Build Configuration Parameters Explained:

* **`app_location: "/"`**: Points to the directory where `package.json` resides.
* **`output_location: "dist"`**: Specifies the directory Vite outputs production assets into (`dist/`). *(Create-React-App uses `build/`, while Vite uses `dist/`)*.
* **`api_location: ""`**: Left empty because our backend runs independently on Azure App Service rather than Azure Functions.

---

## 6. Supabase Authentication Domain Configuration

To complete authentication security:

1. In the **Supabase Dashboard**, navigate to **Authentication** $\rightarrow$ **URL Configuration**.
2. **Site URL:** Set to `https://gentle-grass-0ac410700.7.azurestaticapps.net`
3. **Redirect URLs:** Add:
* `https://gentle-grass-0ac410700.7.azurestaticapps.net/**`
* `http://localhost:5173/**` (for local development continuity)



This ensures OAuth redirects, magic email verification links, and password reset flows redirect the user back to the production web app.

---

## 7. Verification & Feature Checklist

| Feature Component | Test Vector | Expected Output | Status |
| --- | --- | --- | --- |
| **Edge Delivery** | Visit `https://gentle-grass-0ac410700.7.azurestaticapps.net` | Clean UI load with CDN edge caching | ✅ Active |
| **SPA Routing** | Directly load `/analytics` and refresh page | Page renders without 404 errors | ✅ Active |
| **Authentication** | Sign up new user / Sign in with credentials | JWT issued by Supabase & stored in localStorage | ✅ Active |
| **Document OCR** | Upload receipt image via UI | Dispatched to `/api/v1/documents/upload` $\rightarrow$ Gemini OCR extracts metadata | ✅ Active |
| **AI Assistant** | Open chat drawer & send natural language query | Routed to `/api/v1/chat` $\rightarrow$ LangGraph agent responds with financial context | ✅ Active |
| **Email Summary** | Click "Send Report" on Dashboard | Background task triggers Resend SMTP $\rightarrow$ HTML report sent to user inbox | ✅ Active |

---

## 8. Operational Runbook: How to Deploy Frontend Updates

1. Make UI/component changes locally in your frontend codebase.
2. Verify production build passes locally:
```bash
npm run build

```


3. Commit and push directly to `main`:
```bash
git add .
git commit -m "feat: improve analytics charts and chat layout"
git push origin main

```


4. GitHub Actions will trigger `Azure/static-web-apps-deploy@v1`, build your Vite application, bake in environment variables, and atomically deploy the new bundle to Microsoft's Edge CDN in under 90 seconds.