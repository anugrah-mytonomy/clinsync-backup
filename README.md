# ClinSync

Clinic AI Portal frontend (React + TypeScript + Vite).

**Spec-driven:** behavior is defined in [`.specify/`](./.specify/README.md) before code changes.

## First-time setup

```bash
npm install
copy .env.example .env          # Windows — create local env
```

**Backend (Docker)** — from `ClinSync-Backend\ClinSync-Backend`:

```powershell
docker compose up -d --build
```

**Frontend:**

```bash
npm run dev
```

Or one script (Windows): `.\scripts\dev.ps1` — starts Docker backend then Vite.

Open **http://localhost:5188** (UI) and **http://localhost:8001/api/v1/docs** (API).

Auth: align `VITE_AUTH_API_URL` with ClinSync `AUTH_*` (see `.env.example`). [Auth gaps](./.specify/specs/001-authentication/gaps.md). Add Content upload uses the backend presigned-URL API when wired ([006 spec](./.specify/specs/006-add-content/spec.md)).

Architecture: [`PROJECT_OVERVIEW.md`](./PROJECT_OVERVIEW.md). API index: [`API_LLD.md`](./API_LLD.md).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server |
| `npm run build:stage` / `build:prod` | Production build |
| `npm test` | Vitest |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |

## Routes

| Path | Notes |
|------|-------|
| `/login` | Public |
| `/dashboard`, `/library`, `/library/add-content`, `/scans/*` | Protected (Redux token) |
| `/playground` | Dev only — local folder gitignored; ignore if missing |
