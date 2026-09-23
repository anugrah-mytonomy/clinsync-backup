# Tasks: Authentication

**Spec**: `.specify/specs/001-authentication/spec.md`
**Plan**: `.specify/specs/001-authentication/plan.md`

## Phase 1 — Contract on the auth service (blocked on backend)

- [ ] T001 Login `200` includes `Set-Cookie: refresh_token` with Path `/`, HttpOnly, SameSite=Lax, host-only Domain, Secure only on HTTPS
- [ ] T002 Cookie value is an opaque refresh credential, not `access_token`
- [ ] T003 Refresh authenticates solely from `refresh_token` cookie; missing cookie → `401` missing/no session
- [ ] T004 Logout expires `refresh_token` (`Max-Age=0`)
- [ ] T005 Confirm Vite proxy forwards `Set-Cookie` onto `http://localhost:5174` (no upstream `Domain`)

## Phase 2 — Frontend converge (only if Phase 1 still fails after Set-Cookie exists)

- [ ] T006 If cookie is present in login response but not stored, add proxy `cookieDomainRewrite: 'localhost'` (or equivalent) — do not write cookies in JS
- [ ] T007 Keep `credentials: 'include'`; do not add `localStorage` persistence

## Phase 3 — Verify

- [ ] T008 Manual: login → Application → Cookies shows `refresh_token`
- [ ] T009 Manual: reload `/dashboard` stays authenticated
- [ ] T010 Manual: logout → cookie gone → refresh `401`
- [ ] T011 Tests still pass for login success/failure (`LoginPage`, `authSlice`)

## Out of scope for frontend

- Setting `document.cookie` from `access_token`
- Treating empty Cookies tab as a React bug when login has no `Set-Cookie`
