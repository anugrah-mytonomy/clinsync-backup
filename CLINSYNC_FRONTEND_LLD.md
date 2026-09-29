# ClinSync LLD — Frontend (React) — Sign-in, Session & Menus

| | |
| --- | --- |
| **Status** | Draft — for review |
| **Owner** | Anugrah M |
| **Reviewers** | Tasneem Sharma, Nagesh N |
| **Parent page** | ClinSync LLD — M1 Auth & Tenancy |
| **Related pages** | AUTH Setup, Token Contract & Cookies · Service Overview & End-to-End Flow · API End Points · ClinSync UI – Project Setup & Structure |

## In short

- React signs in with AUTH directly and keeps the access token in memory, in the Redux store. It calls ClinSync's `GET /api/v1/session` after sign-in and again every time the token changes (login or refresh).
- Menus and buttons are meant to be built from the `permissions` in the `/session` response. This hides what the user cannot use. The API still enforces every permission.
- After a page reload, memory is empty, so React starts by trying a silent refresh using the refresh cookie.

---

## 1. Scope and references

| Item | Where |
| --- | --- |
| React folder structure | ClinSync UI – Project Setup & Structure |
| Token contract and cookie | AUTH Setup, Token Contract & Cookies |
| API contract | API End Points |

Section 10 maps each part of this design to the file that implements it.

---

## 2. Responsibilities

| # | Responsibility | How | Status |
| --- | --- | --- | --- |
| 1 | Sign in | `POST /centralauth/login` with `client_id: "CS"`. Show a message for 401 / 403 / 423 | Done. Shows the message AUTH returns; per-status messages are pending (section 8) |
| 2 | Hold the access token | In memory, in the Redux store (`auth.token`). Never `localStorage` or `sessionStorage` | Done |
| 3 | Call ClinSync | `Authorization: Bearer <access_token>` on every request | Done |
| 4 | Load the session | `GET /api/v1/session` after sign-in and after every refresh | Done |
| 5 | Show organization branding | Name, logo and theme from `organization` | Name and logo done. Theme pending |
| 6 | Show or hide menus and actions | From `permissions` (section 7) | Permission hooks done. Hiding menus and buttons is pending |
| 7 | Keep the token fresh | Timer plus 401 handling (section 5) | 401 handling done. Timer pending |
| 8 | Handle blocked users | Screen for `no_organization`, `organization_inactive`, `no_access` | Done, as one screen showing the backend's message |
| 9 | Sign out | `POST /centralauth/logout`, then clear in-memory state | Done |

---

## 3. Auth state model

| From | Event | To |
| --- | --- | --- |
| Booting | App starts | Refreshing |
| Refreshing | Refresh returns 200 (new access token) | LoadingSession |
| Refreshing | Refresh returns 401 (no cookie) | Anonymous |
| Anonymous | User submits the login form | SigningIn |
| SigningIn | Login returns 200 (access token) | LoadingSession |
| SigningIn | Login returns 401, 403 or 423 | Anonymous (show message) |
| LoadingSession | `/session` returns 200 | Ready |
| LoadingSession | `/session` returns 403 `no_organization`, `organization_inactive` or `no_access` | Blocked |
| LoadingSession | `/session` returns 401 `invalid_token` | Anonymous |
| Ready | Timer fires, or an API returns 401 `token_expired` | Refreshing |
| Ready | User logs out | Anonymous |
| Blocked | User logs out | Anonymous |

**Why the app starts with a refresh.** The access token lives only in memory, so a reload or a new tab loses it. The refresh cookie survives, so React calls `POST /centralauth/refresh` first. A 200 loads the session; a 401 shows the login page. This has been confirmed working in local dev through the Vite proxy (section 9).

---

## 4. Loading the session

1. Get an access token, from login or refresh.
2. Call `GET /api/v1/session` with the Bearer header. Never send `organizationId`; the backend works it out from the token.
3. **200:** keep `user`, `organization`, `permissions` and `tokenExpiresAt` in the RTK Query cache, then render the app shell. Applying the theme and scheduling the refresh are still to be built.
4. **401 `token_expired`:** refresh once, then retry once.
5. **401 `invalid_token`:** retry once after 2 seconds (see the clock-skew risk in section 9). If it fails again, go to the login page.
6. **403:** show the blocked screen. Do not refresh.
7. **Anything else:** show an error screen with a Retry button.

Only a 200 lets the user into ClinSync. The session is cached per access token, so a new token (after a refresh) triggers a new `/session` call automatically.

---

## 5. Keeping the token fresh

AUTH access tokens currently last **5 minutes** (`exp − iat = 300 s`).

```text
FUNCTION schedule_refresh(tokenExpiresAt):              // NOT YET BUILT
    delay = tokenExpiresAt - NOW() - 60 seconds          // refresh a minute early
    delay = MAX(delay, 0)
    AFTER delay: refresh_once()

FUNCTION refresh_once():                                 // single-flight
    IF a refresh is already running THEN RETURN its result   // parallel calls share one refresh
    result = POST /centralauth/refresh                       // cookie is sent automatically
    IF 200: store new access token                           // /session refetches automatically
    IF 401: clear state; go to login

FUNCTION api_call(request):
    response = SEND request with Bearer token
    IF response is 401 with code "token_expired":
        refresh_once(); retry the request ONE time
    IF response is 403: DO NOT refresh — show the matching page or message
    RETURN response
```

Rules:

- Refresh on 401 `token_expired` only, never on 403.
- Retry a request at most once.
- Only one refresh at a time (single-flight). Both API slices share one refresh call, so several failing requests don't each start their own.

Until the timer is built, the token is refreshed the first time a ClinSync call returns `token_expired`.

---

## 6. Reading the /session response

Example response (local dev):

```json
{
  "user": { "userId": 1213, "roles": ["content_operator"] },
  "organization": {
    "organizationId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "name": "Mytonomy",
    "config": {
      "logo_url": "https://cdn.mytonomy.com/clinsync/logo.png",
      "portal_url": "https://clinsync.mytonomy.com",
      "theme": { "font": "Inter", "primary": "#1B4F72", "secondary": "#F4F6F7" }
    }
  },
  "permissions": {
    "DA": ["modify", "read", "upload"],
    "LB": ["modify", "read", "upload"],
    "SH": ["modify", "read", "upload"]
  },
  "tokenExpiresAt": "2026-09-29T08:10:31Z"
}
```

| Field | Used for | Status |
| --- | --- | --- |
| `user.userId` | Diagnostics only | — |
| `user.roles` | Display only (for example a profile label). Not used to decide access | Not shown yet |
| `organization.name` | Sidebar header | Done |
| `organization.config.logo_url` | Sidebar logo. Falls back to the ClinSync default if unset or if the image fails to load | Done |
| `organization.config.theme` | CSS variables (primary, secondary, font). Fall back to defaults if unset | Pending |
| `organization.config.portal_url` | Organization link, if shown | Not used |
| `organization.organizationId` | Display and caching only. Never sent back to the API | — |
| `permissions` | Menus, route guards, buttons (section 7) | Hooks done |
| `tokenExpiresAt` | Refresh timer | Pending |

Unknown `config` keys are ignored, so the backend can add organization attributes without a frontend release.

---

## 7. Menus, routes and buttons from permissions

Use the `permissions` from `/session`, not the raw token. The frontend also treats `modify` as implying `read`, so it stays correct even if the backend doesn't normalise.

| Menu code | Menu | Route | Visible when |
| --- | --- | --- | --- |
| `DA` | Dashboard | `/dashboard` | `DA` includes `read` (or `modify`) |
| `LB` | Library | `/library` | `LB` includes `read` (or `modify`) |
| `SH` | Scan History | `/scans` | `SH` includes `read` (or `modify`) |

```text
FUNCTION can(menu, action):                   // useHasPermission(menu, action)
    granted = permissions[menu] OR []          // false if the menu is absent
    IF action = "read": RETURN "read" IN granted OR "modify" IN granted
    RETURN action IN granted

// examples
show "Upload" button      IF can("LB", "upload")
show "Edit document"      IF can("LB", "modify")
show "Start scan"         IF can("SH", "modify")
```

- Hide any menu the user has no `read` on. Also guard its route, so typing the URL redirects to the first allowed page. *(Pending.)*
- A content operator (MVP 1) sees Dashboard, Library and Scan History with every action. A future read-only role would see the same menus with the upload and modify buttons hidden.
- The UI is a convenience, not security; the API checks every call. If the API returns 403 `permission_denied`, show a message and do not refresh.

---

## 8. Error handling matrix

| Where | Signal | Screen or action | Status |
| --- | --- | --- | --- |
| Login | 401 | "Email or password is incorrect" | Shows AUTH's `detail` message instead |
| Login | 403 | "You don't have access to ClinSync" | Shows AUTH's `detail` message instead |
| Login | 423 | "Your account is locked. Contact your administrator" | Shows AUTH's `detail` message instead |
| `/session` or any API | 401 `token_expired` | Refresh, retry once | Done |
| `/session` or any API | 401 `invalid_token` | Retry once after 2 s, then the login page | Done |
| Refresh | 401 | Login page | Done |
| `/session` | 403 `no_organization` | "Contact your administrator to be assigned an organization" | Done: blocked screen with `error.message` and Logout |
| `/session` | 403 `organization_inactive` | "<organization name> is no longer active" | Done: blocked screen with `error.message` and Logout |
| `/session` | 403 `no_access` | "You don't have access to ClinSync" | Done: blocked screen with `error.message` and Logout |
| Any API | 403 `permission_denied` | Message; keep the user in the app | Pending |
| Any API | 500 `internal_error` | Generic error; show `request_id` for support | Error screen with Retry done; `request_id` not shown yet |

---

## 9. Local development

| Item | Value |
| --- | --- |
| React dev server | `http://localhost:5188` (Vite) |
| ClinSync API | `http://localhost:8001` (FastAPI) |
| AUTH (dev) | `https://pecmicroservicesdev.mytonomy.com` |
| Environment variables | `VITE_AUTH_API_URL`, `VITE_CLINSYNC_API_URL` in `.env.development`, `.env.stage`, `.env.production` |

**Dev proxy.** In development the browser calls same-origin paths, and Vite forwards them:

| Browser path | Forwarded to | Notes |
| --- | --- | --- |
| `/api_auth/*` | `VITE_AUTH_API_URL` (prefix stripped) | `cookieDomainRewrite` stores the refresh cookie on `localhost` |
| `/api/*` | `VITE_CLINSYNC_API_URL` (path unchanged) | Declared after `/api_auth`, because Vite matches by prefix in order |

Stage and production builds call `VITE_AUTH_API_URL` and `VITE_CLINSYNC_API_URL` directly.

**CORS.**

- **ClinSync API:** not needed in dev, because of the proxy. Stage and production must allow the React origin and the `Authorization` header (`CORS_ALLOWED_ORIGINS`). `/session` uses a Bearer header, not cookies.
- **AUTH:** login, refresh and logout use the cookie, so React calls them with credentials included. Outside dev, AUTH must allow credentials for the React origin.

**Refresh cookie from localhost — resolved in dev.** The concern was that AUTH sets the refresh cookie for `*.mytonomy.com`, so a page on `http://localhost` would never get it. The first option (proxy `/centralauth` through the dev server and rewrite the cookie domain) is implemented. The `pec_cs_refresh_token` cookie is now stored on `localhost:5188`, and silent refresh on reload works. Stage and production still need checking once the real hosts are known.

**Risk — clock skew between AUTH and the ClinSync API.** The AUTH server's clock was measured about 1–2 seconds ahead of the local machine. A token used immediately after login can therefore look "not yet valid" to the ClinSync API, which returns 401 `invalid_token`. Seen as: "the first login fails, the second works."

- **Frontend (done):** retry `invalid_token` once after 2 seconds before logging out.
- **Backend (needed):** accept a small clock-skew leeway when validating the token (for example PyJWT `leeway=10`).

---

## 10. Where it lives in the code

| Concern | File |
| --- | --- |
| Shared Bearer header, 401 → refresh → retry, single-flight refresh | `src/app/api/baseQueryWithReauth.ts` |
| AUTH API slice | `src/app/api/apiSlice.ts` |
| ClinSync API slice (error codes, `invalid_token` retry) | `src/app/api/clinsyncApiSlice.ts` |
| Store (both slices registered) | `src/app/store.ts` |
| Token state (`setCredentials`, `logout`) | `src/feature/auth/authSlice.ts` |
| Login / logout / refresh endpoints | `src/feature/auth/authApiSlice.ts` |
| `getSession` endpoint | `src/feature/session/sessionApiSlice.ts` |
| Session and error types | `src/feature/session/session.types.ts` |
| `useSession`, `useOrganization`, `useHasPermission` | `src/feature/session/useSession.ts` |
| Silent refresh on app start | `src/components/AuthInitializer.tsx` |
| Loader / blocked / error screens; only a 200 renders the app | `src/components/SessionGate.tsx` |
| Route order: `ProtectedRoute` → `SessionGate` → `DashboardLayout` | `src/routes/private.routes.tsx` |
| Organization name and logo | `src/components/layout/Sidebar.tsx` |
| MSW handlers (200 and every error code) | `src/mocks/handlers.ts` |

---

## 11. Frontend tests

| Test | Status |
| --- | --- |
| `can()`: `modify` implies `read`; a missing menu returns false | Done |
| `/session` sent with the Bearer header | Done |
| 401 `token_expired` → one refresh, one retry | Done |
| Refresh fails → login | Done |
| 401 `invalid_token` persists → login; succeeds on retry → app | Done |
| 403 → no refresh, blocked screen with Logout (all three codes) | Done |
| Other errors → error screen, Retry recovers | Done |
| Organization name and logo from the session | Done |
| Refresh scheduler: refreshes 60 s early, never a negative delay | Pending (timer not built) |
| Single-flight: three parallel 401s cause one refresh call | Pending (the logic exists; no test yet) |
| Reload with a valid cookie → Ready; without → login | Pending |
| Menu visibility and route guard for `content_operator` and a read-only example | Pending |

---

## 12. Open items

| # | Item | Owner |
| --- | --- | --- |
| 1 | Add clock-skew leeway to token validation in the ClinSync API | Backend |
| 2 | Return a reachable `logo_url` (`cdn.mytonomy.com` does not resolve today) | Backend |
| 3 | Confirm the `organization_inactive` message: in `error.message` or in `details[0].message` | Backend |
| 4 | Refresh timer from `tokenExpiresAt` | Frontend |
| 5 | Hide menus and buttons by permission, and add route guards | Frontend |
| 6 | Apply `organization.config.theme` as CSS variables (confirm with design: its primary `#1B4F72` differs from the app's `#005F7F`) | Frontend / Design |
| 7 | Per-status login messages (401 / 403 / 423) | Frontend |
| 8 | Show `request_id` on the generic error screen; handle 403 `permission_denied` | Frontend |
| 9 | AUTH API slice refreshes on *any* 401, including a failed login. Limit it to real token expiry | Frontend |
