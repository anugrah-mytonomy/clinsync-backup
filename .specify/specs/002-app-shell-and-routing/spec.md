# Feature Specification: App Shell & Routing

**Feature Branch**: `002-app-shell-and-routing`
**Created**: 2026-09-22
**Status**: Partial (core routes shipped; Help, Settings, Findings Reports are nav-only)

## In short

This is the frame everything else sits inside: the sidebar, the login gate,
and which URL shows which page. If you're logged in, every route sends you
into the dashboard shell; if you're not, every route sends you to `/login`.
Two sidebar links (Help & Support, Settings) exist visually but don't go
anywhere real yet — that's intentional, not a bug, until those pages get
their own spec.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reach the portal (Priority: P1)

An authenticated user lands in the dashboard shell with sidebar navigation.

**Why this priority**: Every other feature hangs off this shell.

**Independent Test**: Log in and see ClinSync sidebar: Dashboard, Library, Scan History, plus Help & Support and Settings entries.

**Acceptance Scenarios**:

1. **Given** no session, **When** the user opens `/` or `/dashboard`, **Then** they are redirected to `/login`.
2. **Given** a Redux access token, **When** the user opens `/`, **Then** they are redirected to `/dashboard` inside `DashboardLayout`.
3. **Given** `/portal`, **When** visited, **Then** redirect to `/dashboard`.
4. **Given** an unknown path, **When** visited, **Then** redirect to `/dashboard` (then login if unauthenticated).

### User Story 2 - Navigate primary sections (Priority: P1)

The user switches between Dashboard, Library, and Scan History without losing the shell.

**Acceptance Scenarios**:

1. **Given** the sidebar, **When** they click Library, **Then** the URL is `/library` and the Library nav item is active.
2. **Given** Dashboard, **When** they click Scan History, **Then** the URL is `/scans`.

### User Story 3 - Secondary nav (Priority: P3)

Help & Support and Settings appear in the sidebar.

**Acceptance Scenarios**:

1. **Given** the sidebar footer, **When** the user clicks Help & Support or Settings, **Then** today they hit a route that is **not implemented** (nav exists; `private.routes.tsx` still comments those routes). Spec for those pages is out of this feature until scheduled.

### Edge Cases

- `/playground` exists only when `import.meta.env.DEV`.
- Pages are lazy-loaded; a `PageLoader` is shown while the chunk loads.
- Auth boot (`AuthInitializer`) shows `PageLoader` until the refresh attempt finishes.

## Requirements *(mandatory)*

- **FR-001**: Public route: `/login` in `AuthLayout`.
- **FR-002**: Protected routes wrap `DashboardLayout` with `ProtectedRoute` (Redux token required).
- **FR-003**: Implemented protected paths: `/dashboard`, `/library`, `/library/add-content`, `/dashboard/review-queue`, `/scans`, `/scans/:scanId`, `/scans/:scanId/documents/:documentId`, `/scans/:scanId/documents/:documentId/replace`.
- **FR-004**: Branding in the shell is ClinSync / Mytonomy.
- **FR-005**: Sidebar user block may stay hardcoded until a profile spec exists.

### Key Entities

- **Protected session**: presence of Redux `access_token` (see 001-authentication).

## Success Criteria *(mandatory)*

- **SC-001**: Unauthenticated users cannot see dashboard chrome.
- **SC-002**: Primary nav reaches Dashboard, Library, and Scan History.

## Assumptions

- Review Queue page may remain a placeholder.
- Help, Settings, Findings Reports need their own specs before implementation.

## Out of Scope

- Responsive redesign beyond current `md:` sidebar collapse
- Deep linking outside the routes table
