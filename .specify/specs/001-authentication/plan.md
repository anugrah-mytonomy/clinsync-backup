# Implementation Plan: Authentication

**Spec**: `.specify/specs/001-authentication/spec.md`
**Contract**: `.specify/specs/001-authentication/contracts/auth.md`
**Status**: Active — frontend partial, backend cookie issuance required

## Technical Context

- UI: React 19, RTK Query `authApiSlice`, Redux `authSlice`, `AuthInitializer`, Vite proxy `/api_auth`
- Auth service: Central Auth at `VITE_AUTH_API_URL`
- Files (frontend, already aligned with most of the spec):
  - `src/app/api/apiSlice.ts` — `credentials: 'include'`, Bearer header, 401 → refresh mutex
  - `src/feature/auth/authSlice.ts` — memory-only token
  - `src/feature/auth/authApiSlice.ts` — login / logout / refresh
  - `src/components/AuthInitializer.tsx` — boot refresh
  - `src/pages/auth/LoginPage.tsx` — real login mutation
  - `vite.config.ts` — `/api_auth` proxy

## Approach

Do not add frontend cookie writes. Close the gap on the auth service:

1. Login `Set-Cookie: refresh_token=...` with attributes in the contract (host-only, Path `/`, HttpOnly, SameSite=Lax, Secure only on HTTPS).
2. Refresh reads that cookie only; `401` when it is missing (expected “missing token”).
3. Logout expires the cookie.
4. Confirm through the Vite proxy that Application → Cookies for `http://localhost:5174` shows `refresh_token` after login.

If the auth service cannot omit `Domain` / `Secure` for local HTTP, add a local-dev cookie policy or a proxy `cookieDomainRewrite` — that is an implementation detail, not a spec change, as long as the cookie is stored on the UI origin.

## Constitution Check

- [x] Spec written before further auth changes
- [x] Cookie/header/storage in the contract
- [x] No localStorage for tokens
- [x] Existing auth slices reused

## Phases

1. Auth service issues and clears `refresh_token` per contract
2. Verify login → cookie visible → reload → refresh `200` → dashboard
3. Align MSW handlers for tests if refresh success path is tested
4. Mark spec `Implemented` when SC-001–SC-004 pass
