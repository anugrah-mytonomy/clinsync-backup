# Feature Specification: Dashboard

**Feature Branch**: `003-dashboard`
**Created**: 2026-09-22
**Status**: Partial (UI with hardcoded data; `GET /dashboard/summary` not wired)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Library health at a glance (Priority: P1)

A content-ops user opens `/dashboard` and sees inventory, scan coverage, risk backlog, trend, and documents by year.

**Why this priority**: This is the default landing page after login.

**Independent Test**: Authenticated visit to `/dashboard` renders Inventory, Coverage, Backlog, Risk Trend, Documents by Year, date-range tabs, and Add Content.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they open Dashboard, **Then** they see title “Dashboard” and subtitle “Library health and scan risk at a glance”.
2. **Given** the header action, **When** they click Add Content, **Then** they go to `/library/add-content`.
3. **Given** date-range tabs (Last 7 days, Last 30 days, Last 3 months, Last 6 months, Last year, Custom Range), **When** they change range, **Then** widgets MUST eventually refetch `GET /dashboard/summary?range=` (today they do not — mock data).

### Edge Cases

- Zero titles / 0% coverage empty presentation is not specified separately; use current widget empty-ish numbers until API exists.
- Custom Range control exists in the tab list; date-picker behavior is `NEEDS CLARIFICATION` until a dedicated UX spec.

## Requirements *(mandatory)*

- **FR-001**: Dashboard MUST show Inventory (total titles, untagged warning, specialty tags, document types).
- **FR-002**: MUST show Coverage (percent scanned, scanned/total, oldest unscanned).
- **FR-003**: MUST show Backlog tiles High / Medium / Low.
- **FR-004**: MUST show Risk Trend (high/medium/low over time).
- **FR-005**: MUST show Documents by Year.
- **FR-006**: Production data MUST come from `GET /dashboard/summary` as in `API_LLD.md` §6. Until then, UI may use in-component mocks (status Partial).
- **FR-007**: `range` query values: `7d` | `30d` | `90d` | `all` (map UI tabs to these in the plan when wiring). Last 6 months / Last year / Custom Range mapping is `NEEDS CLARIFICATION` vs the four API values.

### Key Entities

- Inventory, Coverage, Backlog tiles, TrendPoint, YearRow — types in `src/pages/dashboard/types.ts`.

## Success Criteria *(mandatory)*

- **SC-001**: User can read total titles and coverage percent without opening Library.
- **SC-002**: Add Content from dashboard reaches the upload page.
- **SC-003** (when API wired): Changing Last 7 days vs Last 30 days changes summary numbers from the API.

## Assumptions

- Review Queue (`/dashboard/review-queue`) remains a placeholder until its own spec.

## Out of Scope

- Export / SME review workflows
- Real-time push updates
