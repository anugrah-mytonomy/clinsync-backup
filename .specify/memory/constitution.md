# ClinSync Constitution

Non-negotiable rules for this repository. Feature specs, plans, and code must not violate them.

## Core Principles

### I. Spec is the source of truth

Behavior is specified before it is implemented. If code and spec disagree, the spec wins until the spec is deliberately changed.

Do not invent API fields, cookies, headers, storage, routes, or UI states that are not in `.specify/specs/`. If something is unclear, mark it `NEEDS CLARIFICATION` in the spec — do not guess in code.

### II. One contract per integration

Frontend and backend share one contract per feature (`.specify/specs/<id>/contracts/`). `API_LLD.md` is a generated-style index of those contracts, not a second competing design.

Auth, cookies, tokens, and error shapes are specified in `.specify/specs/001-authentication/`. They are not implied by `credentials: 'include'` or by Redux.

### III. Security-first session handling

- Access tokens live in memory (Redux) only. Never `localStorage`, `sessionStorage`, or a non-HttpOnly cookie.
- Refresh/session identity lives in an HttpOnly cookie set by the auth service via `Set-Cookie`. The UI never writes cookies.
- Protected APIs send `Authorization: Bearer <access_token>`. Refresh uses the cookie, not the access token.
- Logout must clear the session cookie server-side.

### IV. Existing product over new stack

Reuse the current React 19 + TypeScript + Vite + RTK Query + Tailwind stack. New libraries need a spec/plan exception. Match existing UI components, routing, and folder layout.

### V. Observable quality

Auth, validation, and user-visible mutations need tests. Coverage gates in `vite.config.ts` stay enforced. Do not ship a feature whose happy path and primary failure path are unspecified.

## Spec-Driven Workflow

Every change that alters user-visible behavior or an API follows this order:

1. **Specify** — update or add `.specify/specs/<nnn>-<feature>/spec.md`
2. **Contract** — if an HTTP API changes, update `contracts/`
3. **Plan** — `plan.md` (how, stack, files)
4. **Tasks** — `tasks.md` (ordered, checkable)
5. **Implement** — only what the spec/tasks allow
6. **Converge** — if implementation drifts, update the spec first or fix the code

Constitution changes require the same discipline: amend this file, then update affected specs.

## Governance

- Specs, constitution, and templates all live in `/.specify`. Feature specs are `/.specify/specs`.
- Status on each spec is one of: `Draft` | `Active` | `Implemented` | `Partial` | `Deprecated`.
- Stale narrative docs (`FEATURES.md`, `PROJECT_OVERVIEW.md`) must point here; they must not describe a different product.
- A cookie, header, or storage mechanism that is not in the auth contract does not exist.

**Version**: 1.0.0 | **Ratified**: 2026-09-22 | **Last Amended**: 2026-09-22
