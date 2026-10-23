# ClinSync (frontend)

**Clinic AI Portal** — React, TypeScript, Vite, Redux Toolkit.

This repository is **frontend only**. The ClinSync API (PostgreSQL + FastAPI) lives in a separate **ClinSync-Backend** repo. Clone that repo, run Docker on port **8001**, then run this UI on **5188**.

**Spec-driven development:** [`.specify/`](./.specify/README.md) (feature specs + API expectations). Auth contract: [`.specify/specs/001-authentication/contracts/auth.md`](./.specify/specs/001-authentication/contracts/auth.md).

## Prerequisites

- Node.js **20+**, npm
- **ClinSync-Backend** + Docker (for login / session)
- Dev **Central Auth** user with client id **`CS`** (credentials are not in this repo)

## Backend (required for login + session)

1. Clone **ClinSync-Backend** (sibling folder next to this repo is fine).
2. From the backend root (folder with `docker-compose.yml`):

   ```powershell
   docker compose up -d --build
   ```

3. API docs: **http://localhost:8001/api/v1/docs**  
   Backend `api/.env` must match dev Auth (`AUTH_ISSUER` / JWKS — see backend `api/.env.example`).

## First-time setup (frontend)

```bash
npm install
```

**After every clone**, create `.env` (it is not in Git):

```powershell
copy .env.example .env
```

```bash
cp .env.example .env   # macOS / Linux
```

| Variable | Typical dev value |
|----------|-------------------|
| `VITE_AUTH_API_URL` | `https://pecmicroservicesdev.mytonomy.com` |
| `VITE_CLINSYNC_API_URL` | `http://localhost:8001` |

```bash
npm run dev
```

Open **http://localhost:5188** (Vite proxies `/api_auth` and `/api` in dev).

## Build (stage / production)

Create **`.env.stage`** or **`.env.production`** (gitignored) with the same `VITE_*` keys as `.env.example`, then `npm run build:stage` or `npm run build:prod`. DevOps may set these in CI instead.

## After clone — common issues

| Symptom | Likely cause |
|---------|----------------|
| App starts but login fails | No `.env` — copy `.env.example` → `.env` |
| `session` **502** / failed | API not on **8001** — start ClinSync-Backend Docker |
| `login` **401** | Invalid dev Auth user or no **CS** client access |
| `session` **401** `invalid_token` | Backend `AUTH_*` mismatch with dev Auth, or clock skew (~2s retry in UI) |
| `session` **403** | JWT **`sub`** not in DB — backend seed defaults to user **`1213`**; use `setup_local.py --user-id <your-sub>` if yours differs |
| Reload → `/login` | Refresh cookie often missing on login — [auth gaps](./.specify/specs/001-authentication/gaps.md) |
| Library / scans look static | Expected — **mock data** until APIs are wired |
| Add Content upload fails | Backend may not implement `POST /library/uploads/*` yet |

**Quick checks:** `8001/api/v1/docs` loads; Network tab `login` then `session` status codes; backend `scripts/try_session.py --api http://localhost:8001`.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server (port **5188**) |
| `npm run build:stage` / `build:prod` | Production builds |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm test` | Vitest |

Before opening a PR: `npm run typecheck`, `npm run lint`, `npm test`.

## What is wired vs mock

| Area | Data source |
|------|-------------|
| Login, session, logout | Real Auth + ClinSync `/api/v1/session` |
| Dashboard, library list, scan history | In-repo mock data (see [`.specify/specs/`](./.specify/specs/README.md)) |
| Add Content upload | Backend `library/uploads/*` when implemented ([006 spec](./.specify/specs/006-add-content/spec.md)) |

## Routes

| Path | Notes |
|------|-------|
| `/login` | Public |
| `/dashboard`, `/library`, `/library/add-content`, `/scans/*` | Protected (in-memory access token + refresh on reload) |
