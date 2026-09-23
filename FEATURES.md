# Clynsync — Features & Routes

For overall tech stack see [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md).

**Source of truth for behavior is [`.specify/specs/`](./.specify/specs/README.md), not this file.** This is a route index plus pointers.

## Spec index

| Area | Spec | Status |
|------|------|--------|
| Auth | [001-authentication](./.specify/specs/001-authentication/spec.md) | Partial — login JSON wired; session cookie not issued by auth service |
| Shell / routes | [002-app-shell-and-routing](./.specify/specs/002-app-shell-and-routing/spec.md) | Partial |
| Dashboard | [003-dashboard](./.specify/specs/003-dashboard/spec.md) | Partial — UI, mock data |
| Library | [004-content-library](./.specify/specs/004-content-library/spec.md) | Partial — UI, mock data |
| Scan history | [005-scan-history](./.specify/specs/005-scan-history/spec.md) | Partial — UI, mock data |
| Add content | [006-add-content](./.specify/specs/006-add-content/spec.md) | Partial — validation + LocalStack |

## Routes

Defined across `src/routes/index.tsx`, `public.routes.tsx`, `private.routes.tsx`. Page
components are lazy-loaded (`React.lazy` + `Suspense` + `PageLoader`).

| Path | Access | Component | Notes |
|---|---|---|---|
| `/` | — | redirect | → `/dashboard` |
| `/login` | public | `LoginPage` (in `AuthLayout`) | Real `POST /centralauth/login` |
| `/portal` | — | redirect | legacy path → `/dashboard` |
| `/dashboard` | protected | `DashboardPage` (in `DashboardLayout`) | |
| `/library` | protected | `LibraryPage` | |
| `/library/add-content` | protected | `AddContentPage` | |
| `/scans` | protected | `ScanHistoryPage` | |
| `/scans/:scanId` | protected | `ScanResultsPage` | |
| `/scans/:scanId/documents/:documentId` | protected | `DocumentDetailsPage` | |
| `/scans/:scanId/documents/:documentId/replace` | protected | `ReplaceDocumentPage` | |
| `/dashboard/review-queue` | protected | `ReviewQueuePage` | placeholder |
| `/playground` | dev-only | `Playground` | `import.meta.env.DEV` |
| `*` | — | redirect | catch-all → `/dashboard` |

Protection: `src/routes/ProtectedRoute.tsx` requires Redux `access_token` (see auth spec).

## Auth (do not re-specify here)

Login calls `useLoginMutation` → Redux `access_token`. Session cookie is **backend `Set-Cookie` only**. See [auth gaps](./.specify/specs/001-authentication/gaps.md) if Cookies is empty or refresh reports missing token.

## Nav stubs (no spec yet)

In `Sidebar.tsx`, not routed in `private.routes.tsx`:

- Help & Support (`/dashboard/help`)
- Settings (`/dashboard/settings`)
- Findings & Reports (commented)

## Shared UI

`src/components/ui/` — Button, Input, Spinner, PageLoader, ProgressBar, CardTable, DonutChart, Select, Table, uploadFile, icons.

## Testing

Vitest + jsdom + Testing Library + MSW. Coverage thresholds in `vite.config.ts`.
