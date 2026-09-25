# Feature Specification: Authentication

**Feature Branch**: `001-authentication`
**Created**: 2026-09-22
**Status**: Partial (UI login wired; session cookie contract not fulfilled by auth service)
**Input**: Central auth login, in-memory access token, HttpOnly refresh cookie, silent refresh on boot

## In short

Log in with email + password. The short-lived access token lives only in
memory (Redux) — never in `localStorage`. Staying logged in across a page
reload depends on a second, longer-lived credential that only the backend
can set (a secure cookie JavaScript can't touch). Today the backend isn't
setting that cookie yet, so a reload logs people out even though login
itself works — see [`gaps.md`](./gaps.md) for the exact symptom and fix.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Sign in (Priority: P1)

A Medical Operations user opens `/login`, enters email and password, and reaches the dashboard.

**Why this priority**: Nothing else in the portal is reachable without a session.

**Independent Test**: Submit valid credentials against `POST /centralauth/login` and land on `/dashboard` with a Redux access token and a browser session cookie.

**Acceptance Scenarios**:

1. **Given** a valid email, password (≥ 8 characters), and `client_id` `CS`, **When** the user submits Sign In, **Then** the auth service returns `200` with `access_token` + `expires_in` **and** `Set-Cookie` for the session cookie, and the UI navigates to `/dashboard`.
2. **Given** invalid credentials, **When** the user submits, **Then** the UI stays on `/login` and shows the API error message.
3. **Given** a malformed email or password shorter than 8 characters, **When** the user submits, **Then** the form shows validation errors and does not call the API.

---

### User Story 2 - Stay signed in across reload (Priority: P1)

A signed-in user reloads the browser. They remain on the protected app without typing the password again.

**Why this priority**: Access tokens are memory-only; reload must restore them from the session cookie.

**Independent Test**: Log in, confirm Application → Cookies has the session cookie, reload `/dashboard`, remain authenticated.

**Acceptance Scenarios**:

1. **Given** a valid session cookie and no Redux token (fresh load), **When** the app boots, **Then** it calls `POST /centralauth/refresh` with the cookie, stores the new `access_token` in Redux, and does not redirect to `/login`.
2. **Given** no session cookie, **When** the app boots, **Then** refresh returns `401`, Redux stays empty, and visiting `/dashboard` redirects to `/login`.

---

### User Story 3 - Silent re-auth when access token expires (Priority: P2)

A user stays on a page long enough that the access token expires. The next API call still succeeds after one refresh.

**Why this priority**: Access tokens are short-lived (`expires_in`).

**Independent Test**: Force a `401` on a protected call while the session cookie is valid; one refresh occurs; the original call is retried with the new Bearer token.

**Acceptance Scenarios**:

1. **Given** an expired access token and a valid session cookie, **When** any protected request returns `401`, **Then** the client calls refresh once (mutex), updates Redux, and retries the original request.
2. **Given** refresh itself returns `401`, **When** that happens, **Then** Redux is cleared and the user is treated as logged out.

---

### User Story 4 - Sign out (Priority: P2)

The user signs out. The session cannot be reused.

**Why this priority**: Session cookie must die on the server and in the browser.

**Independent Test**: Logout, then call refresh — `401`. Cookies table no longer has the session cookie.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they sign out, **Then** the UI calls `POST /centralauth/logout`, the auth service clears the session cookie (`Set-Cookie` with empty/expired value), Redux token is cleared, and the user is sent to `/login`.

### Edge Cases

- First visit to `/login` with no cookie: boot refresh fails; this is expected and must not show an error banner.
- Concurrent `401`s: only one refresh in flight.
- Login succeeds in JSON but omits `Set-Cookie`: treat as a **backend contract failure**. UI may still enter dashboard for this tab, but reload must send the user to login. This is not a frontend cookie bug.
- Cookie present but rejected by the browser (`Secure` on `http://`, `Domain` not `localhost` in local dev): same observable as “no cookie”.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST authenticate via `POST /centralauth/login` with `{ email, password, client_id }`. `client_id` is `CS`.
- **FR-002**: Login response body MUST be `{ access_token: string, expires_in: number }`.
- **FR-003**: Login response MUST include `Set-Cookie` for the session cookie defined in [contracts/auth.md](./contracts/auth.md).
- **FR-004**: Frontend MUST store `access_token` in Redux only. MUST NOT write `document.cookie`, `localStorage`, or `sessionStorage` for tokens.
- **FR-005**: Frontend MUST send `credentials: 'include'` on all auth-service requests so the browser stores and returns the session cookie.
- **FR-006**: Protected routes MUST require a Redux access token. Missing token → `/login`.
- **FR-007**: On boot, if Redux has no token, the app MUST call `POST /centralauth/refresh`. Success hydrates Redux. Failure is silent (no session).
- **FR-008**: Refresh MUST NOT require `Authorization`. Identity comes only from the session cookie.
- **FR-009**: Other APIs (except login and refresh) MUST send `Authorization: Bearer <access_token>`.
- **FR-010**: A `401` on a non-refresh request MUST trigger a single refresh, then retry.
- **FR-011**: Logout MUST call `POST /centralauth/logout` and MUST result in a cleared session cookie plus empty Redux token.
- **FR-012**: Frontend MUST NOT construct or copy the access token into a cookie. Cookie issuance is backend-only.

### Key Entities

- **Access token**: Short-lived bearer credential in JSON. Memory only.
- **Session cookie**: HttpOnly opaque refresh credential. Browser cookie jar only. Name, path, and flags in the contract.
- **Auth session**: Backend record that refresh and logout consult.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: After a successful login, DevTools → Application → Cookies for the UI origin shows the session cookie.
- **SC-002**: After login, Network → login response includes `Set-Cookie`.
- **SC-003**: Reload of `/dashboard` within cookie lifetime does not return the user to `/login`.
- **SC-004**: With cookies disabled / cookie missing, refresh returns `401` with a missing-token/no-session error, and the user cannot stay on protected routes after reload.
- **SC-005**: Login with invalid credentials never navigates away from `/login`.

## Assumptions

- Auth is the existing Central Auth service (`VITE_AUTH_API_URL`), proxied in local dev as same-origin `/api_auth`.
- The UI origin in local dev is `http://localhost:5174` (Vite). Cookie attributes MUST be valid for that origin when proxied.
- Password reset, MFA, and SSO are out of scope.

## Out of Scope

- User profile API / “John Doe” sidebar identity
- Role-based permissions beyond “has token / does not”
- Remember-me longer than the cookie `Max-Age` in the contract
