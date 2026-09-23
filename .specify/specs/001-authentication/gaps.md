# Auth gaps: spec vs code vs observed bug

Recorded 2026-09-22. Update this file when T001–T010 close.

## Observed

- Application → Cookies for `http://localhost:5174` is empty after login.
- Dashboard still works in that tab (Redux has `access_token`).
- `POST /centralauth/refresh` returns missing token / no session.

## Spec

Login MUST `Set-Cookie` `refresh_token`. Refresh uses that cookie only. Frontend never writes cookies.

## Code today

| Piece | Matches spec? |
|-------|----------------|
| Login JSON → Redux | Yes |
| `credentials: 'include'` | Yes |
| No `document.cookie` / no `localStorage` token | Yes |
| Boot `AuthInitializer` → refresh | Yes |
| 401 mutex refresh | Yes |
| Login `Set-Cookie` | **No — auth service / contract not implemented** |
| Cookie visible on UI origin | **No — consequence of missing Set-Cookie (or rejected attributes)** |

## Classification

**Backend contract gap**, not a frontend storage bug.

`credentials: 'include'` cannot populate the Cookies table. The browser only stores a cookie from `Set-Cookie`. Refresh then has no cookie, so the auth service correctly reports a missing token.

`API_LLD.md` previously documented login JSON only, with no cookie. That incomplete spec is what allowed this drift. `contracts/auth.md` is now the contract.

## How to confirm

Network → `POST .../centralauth/login` → Response Headers:

- No `Set-Cookie` → backend has not implemented T001.
- `Set-Cookie` present, Cookies still empty → cookie attributes or Vite proxy (T006), still not a Redux issue.
