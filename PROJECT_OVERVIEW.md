# Clynsync — Project Overview

## What This Is

**Clynsync** is the frontend for a **Clinic AI Portal** — a clinical content governance
platform built for Mytonomy. Branding, logo, and copy throughout the app confirm this
(`src/assets/mytonomy_logo.png`, footer contact `medops-admin@mytonomy.com`).

The product's purpose, per the marketing copy in `AuthLayout.tsx`:

> "Clinical Content Governance, automated with trust... Enforce safety and peer alignment
> across your clinic's landing portals, patient logins, and EMR communication workflows."

Concretely, it's a tool that:
- Ingests clinical content (patient guidance PDFs/DOCX/HTML, training videos, regulatory
  materials) via an upload / Content Library feature.
- Scans content for compliance risk (e.g. missing FDA warnings, outdated dosage guidance,
  drift from clinical guidelines such as AHA 2024).
- Surfaces "Findings" classified by risk level (High/Medium/Low) requiring
  Subject-Matter-Expert (SME) review and sign-off.
- Tracks a review queue, eventually exporting governance reports.

**Current state:** UI-first. Dashboard, library, and scans still use mock data. Add Content
uploads to LocalStack in local dev. Login calls the real Central Auth API
(`POST /centralauth/login`) and stores `access_token` in Redux. Stay-signed-in requires the
auth service to set an HttpOnly `refresh_token` cookie — see
[`.specify/specs/001-authentication`](./.specify/specs/001-authentication/spec.md).

**Spec-driven development:** product behavior lives in [`.specify/`](./.specify/README.md).
Constitution: [`.specify/memory/constitution.md`](./.specify/memory/constitution.md).

## Tech Stack

| Area | Library | Version |
|---|---|---|
| UI framework | React / React DOM | ^19.2.8 |
| Language | TypeScript | ~6.0.2 |
| Build tool | Vite | ^8.2.0 |
| Routing | react-router-dom (data router) | ^7.18.2 |
| State management | @reduxjs/toolkit (incl. RTK Query) + react-redux | ^2.12.0 / ^9.3.0 |
| Forms & validation | react-hook-form + zod | ^7.85.0 / ^4.4.3 |
| Styling | Tailwind CSS + PostCSS + Autoprefixer | ^3.4.19 |
| Charts | Recharts | ^3.10.1 |
| Testing | Vitest, Testing Library, MSW | ^4.1.10 / ^16.3.2 / ^2.15.0 |
| Lint/format | ESLint (flat config) + typescript-eslint, Prettier | ^10.8.1 / ^3.9.6 |

npm scripts: `dev`, `build:stage`, `build:prod`, `preview`, `lint`, `format` / `format:check`,
`typecheck`, `test` / `test:watch` / `test:coverage`.

> Note: `README.md` is still the default Vite React-TS template and has not been customized
> for this project.

## Project Structure

```
.specify/                # Spec-driven folder (constitution, templates, specs)
src/
├── app/                 # Redux store + RTK Query base API slice
├── assets/              # SVG icons, logo, hero image
├── components/
│   ├── layout/          # Sidebar, PageHeader
│   └── ui/              # Design-system components (Button, Input, CardTable, DonutChart,
│                         #   PageLoader, ProgressBar, Spinner, icons, Select, Table)
├── feature/auth/         # authSlice (Redux) + authApiSlice (RTK Query endpoints)
├── hooks/useAuth.ts      # Auth hook (Redux state + logout mutation)
├── layouts/              # AuthLayout, DashboardLayout
├── mocks/                # MSW handlers + server setup (tests)
├── pages/
│   ├── auth/             # LoginPage
│   ├── content-library/  # LibraryPage, AddContentPage
│   ├── dashboard/        # DashboardPage + sub-widgets + ReviewQueuePage
│   └── scan-history/     # Scan history, results, document details, replace
├── playground/           # Dev-only component showcase (/playground, dev mode only)
├── routes/               # index.tsx, public.routes.tsx, private.routes.tsx, ProtectedRoute.tsx
├── schemas/              # zod schemas (loginSchema.ts)
├── styles/               # global.css, theme.css (CSS custom properties / design tokens)
├── testing/              # setup.ts, testUtils.tsx
├── types/                # api.ts, library.ts, addContent.ts, scanHistory.ts
├── utils/                # cn.ts, addContentValidation.ts, formatBytes.ts, localstackUpload.ts
└── main.tsx              # App entry (StrictMode, Redux Provider, RouterProvider)
```

Path alias `@/*` → `src/*` (configured in `vite.config.ts` and `tsconfig.app.json`).

## Auth Setup

Canonical spec: [`.specify/specs/001-authentication`](./.specify/specs/001-authentication/spec.md).

- **State**: `src/feature/auth/authSlice.ts` — `{ token }` in Redux memory only. No
  `localStorage`.
- **API**: `src/app/api/apiSlice.ts` uses `credentials: 'include'` and
  `Authorization: Bearer <token>`. Endpoints in `authApiSlice.ts`:
  `POST /centralauth/login`, `/logout`, `/refresh`.
- **Boot**: `AuthInitializer` calls refresh when Redux has no token (expects the session
  cookie). If the auth service does not `Set-Cookie` on login, refresh returns missing
  token — [gaps.md](./.specify/specs/001-authentication/gaps.md).
- **Route protection**: `ProtectedRoute` requires Redux token → `/login`.
- **Validation**: `src/schemas/loginSchema.ts` — email + password min 8; `client_id` `CS`.

## Backend / API Integration Points

- **Env vars** (`.env.example`): `VITE_APP_ENV`, `VITE_AUTH_API_URL`
  (default `http://localhost:4000`). Local dev uploads: `VITE_S3_ENDPOINT`, `VITE_S3_BUCKET`.
- **Dev proxy**: `vite.config.ts` proxies `/api_auth` → `VITE_AUTH_API_URL`.
- **Test mocks**: `src/mocks/handlers.ts` mocks `POST */centralauth/login` (and refresh/logout).
- **No library/scan/dashboard backend wired yet.** Those pages use mocks. Add Content
  uploads to LocalStack locally; production will use presigned URLs (`API_LLD.md` §3).

## Notable Configuration

- **Tailwind** (`tailwind.config.js`): theme colors/spacing/radius driven by CSS variables
  defined in `src/styles/theme.css` (e.g. primary `#005F7F`), enabling opacity modifiers.
- **ESLint** (`eslint.config.js`): flat config, typescript-eslint + react-hooks +
  react-refresh rules, Prettier conflicts disabled.
- **Prettier** (`.prettierrc.json`): singleQuote, trailing commas, tabWidth 2, printWidth 100.
- **TypeScript**: project references (`tsconfig.json` → `tsconfig.app.json` +
  `tsconfig.node.json`), strict mode, `@/*` path alias.
- **Vite / Vitest** (`vite.config.ts`): jsdom test environment, coverage thresholds enforced
  (statements 80%, branches 70%, functions 80%, lines 80%).
- **Spec-driven workflow**: [`.specify/`](./.specify/README.md) — constitution + specs for auth and add content. Cursor rule: `.cursor/rules/spec-driven.mdc`.
