# ClinSync

Clinic AI Portal frontend (React + TypeScript + Vite).

**Spec-driven:** behavior is defined in [`.specify/`](./.specify/README.md) before code changes.

## First-time setup

```bash
npm install
copy .env.example .env          # Windows — create local env
npm run localstack:up           # Docker — required for Add Content upload in dev
npm run dev
```

Auth expects Central Auth at `VITE_AUTH_API_URL` (default `http://localhost:4000`). See [auth gaps](./.specify/specs/001-authentication/gaps.md) if login works but cookies stay empty.

LocalStack details: [`LOCALSTACK.md`](./LOCALSTACK.md). Architecture: [`PROJECT_OVERVIEW.md`](./PROJECT_OVERVIEW.md). API index: [`API_LLD.md`](./API_LLD.md).

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
