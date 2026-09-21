# Clynsync — Features & Routes

For overall tech stack and architecture, see [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md).

## Routes

Defined across `src/routes/index.tsx`, `public.routes.tsx`, `private.routes.tsx`. All page
components are lazy-loaded (`React.lazy` + `Suspense` + `PageLoader` fallback).

| Path | Access | Component | Notes |
|---|---|---|---|
| `/` | — | redirect | → `/dashboard` |
| `/login` | public | `LoginPage` (in `AuthLayout`) | |
| `/portal` | — | redirect | legacy path → `/dashboard` |
| `/dashboard` | protected | `DashboardPage` (in `DashboardLayout`) | |
| `/library` | protected | `LibraryPage` | |
| `/library/add-content` | protected | `AddContentPage` | |
| `/scans` | protected | `ScanHistoryPage` | |
| `/dashboard/review-queue` | protected | `ReviewQueuePage` | placeholder ("coming soon") |
| `/playground` | dev-only | `Playground` | gated by `import.meta.env.DEV` |
| `*` | — | redirect | catch-all → `/dashboard` |

Protection is enforced by `src/routes/ProtectedRoute.tsx`, which checks
`useAuth().isAuthenticated` and redirects unauthenticated users to `/login`.

## Built Features

### Auth (`src/pages/auth/`)
- `LoginPage.tsx` — email/password form (react-hook-form + zod). On submit, currently fakes
  a 600ms delay and dispatches a hardcoded token rather than calling the real login mutation.

### Dashboard (`src/pages/dashboard/`)
- `DashboardPage.tsx` — four summary cards: Content Analyzed, High Risk Findings,
  SME Review Queue, SME-Verified Content (all mock numbers).
- `OverallRiskDistribution.tsx` — donut chart (via shared `DonutChart`) of High/Medium/Low
  risk finding counts.
- `RecentScans.tsx` — list of recent scans with status badges (Verified / High Risk /
  Medium Risk).
- `FindingsRequiringAttention.tsx` — `CardTable` of findings (description, source document,
  risk level, awaiting action, "Review Finding" link).
- `ReviewQueuePage.tsx` — placeholder page titled "Review Queue & Export", not yet built.

### Content Library (`src/pages/content-library/`)
- `LibraryPage.tsx` — library table, bulk actions, search, scan actions.
- `AddContentPage.tsx` — drag-and-drop upload with ready/review/rejected states; local dev
  uploads to LocalStack S3 via `src/utils/localstackUpload.ts`.

### Not Yet Built (stubbed in nav only)
Visible in `Sidebar.tsx`'s nav list and commented out in `private.routes.tsx`:
- Findings & Reports (`/dashboard/findings-reports`)
- Help & Support (`/dashboard/help`)
- Settings (`/dashboard/settings`)

### Dev-only Playground (`src/playground/`)
Component showcase mounted only in dev mode: `ButtonPlayground`, `CardTablePlayground`,
`DonutChartPlayground`, `InputPlayground`, `PageLoaderPlayground`, `SpinnerPlayground`.

## Shared UI Component Library (`src/components/ui/`)

- `Button` — variants primary/secondary/danger/ghost; sizes sm/md/lg; loading state.
- `Input`, `Spinner`, `PageLoader`, `ProgressBar`.
- `CardTable<T>` — generic typed table component.
- `DonutChart` — Recharts-based pie/donut wrapper.
- `icons/index.tsx` — hand-rolled inline SVG icon set.
- `Select`, `Table` — shared form/table components.

## Layout Components (`src/components/layout/`)

- `Sidebar.tsx` — left nav ("Clinic AI Portal" branding), user footer, logout button.
- `PageHeader.tsx` — reusable page title/subtitle/actions header bar.

## Testing Setup

- Vitest + jsdom, Testing Library, MSW for API mocking.
- `src/mocks/handlers.ts` mocks `/login` and `/logout`.
- Coverage thresholds enforced: statements 80%, branches 70%, functions 80%, lines 80%
  (excludes `src/mocks/**` and `src/testing/**`).
- Existing tests cover: `LoginPage`, `authSlice`/`authApiSlice`, layout components
  (`Sidebar`, `PageHeader`), and utils.
