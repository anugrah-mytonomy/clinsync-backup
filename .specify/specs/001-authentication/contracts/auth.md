# Auth HTTP Contract

Canonical contract for ClinSync ↔ Central Auth. Frontend and backend MUST match this file. If this file and `API_LLD.md` disagree, this file wins.

**In short**: there is exactly one cookie in this whole product — `refresh_token`,
set by the backend on login, HttpOnly (JavaScript can never read or write it).
Everything below is the precise recipe for that one cookie: its name, its
flags, and which endpoint sets or clears it. If you're debugging "why is the
Cookies tab empty," the answer is always somewhere on this page.

**Base URL**

| Environment | Browser calls | Upstream |
|-------------|---------------|----------|
| Local dev | `/api_auth` (Vite proxy) | `VITE_AUTH_API_URL` |
| Test | `VITE_AUTH_API_URL` | mock / MSW |
| Stage / prod | `VITE_AUTH_API_URL` | auth service |

All requests use `credentials: include` (cookies sent and stored).

---

## Session cookie

The **only** cookie in this product.

| Attribute | Required value | Why |
|-----------|----------------|-----|
| Name | `refresh_token` | Stable name the browser and auth service share |
| Value | Opaque server-issued secret. Not the access token. | Access token stays in JSON / Redux |
| Path | `/` | Must be sent to `/api_auth/centralauth/refresh` |
| HttpOnly | `true` | JS must not read or write it |
| SameSite | `Lax` | Same-site via Vite proxy / gateway |
| Secure | `false` on `http://localhost`; `true` on HTTPS | `Secure` on HTTP is dropped by the browser — empty Cookies tab |
| Domain | **omit** (host-only) | A `Domain` of the upstream API host will not store on `localhost:5174` through the proxy |
| Max-Age / Expires | Refresh lifetime (recommend ≥ access `expires_in`, e.g. 7 days) | Controls stay-signed-in |

`credentials: 'include'` does **not** create this cookie. The browser stores it only when a response includes:

```http
Set-Cookie: refresh_token=<opaque>; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800
```

Local HTTP example (no `Secure`, no `Domain`).

---

## `POST /centralauth/login`

**Request**

```json
{
  "email": "content-ops@mytonomy.com",
  "password": "string",
  "client_id": "CS"
}
```

**Response `200`**

Headers (required):

```http
Set-Cookie: refresh_token=<opaque>; Path=/; HttpOnly; SameSite=Lax; Max-Age=<seconds>
```

Body:

```json
{
  "access_token": "string",
  "expires_in": 3600
}
```

**Response `401`**: invalid credentials. No `Set-Cookie`.

Frontend: dispatch `access_token` to Redux; navigate to `/dashboard`. Do not write cookies.

---

## `POST /centralauth/refresh`

**Request**: empty body. No `Authorization` header required. Cookie `refresh_token` MUST be present.

**Response `200`**: same JSON shape as login. MAY rotate the cookie with a new `Set-Cookie`.

**Response `401`**: missing, invalid, or expired session cookie. Body SHOULD explain that the session/token is missing (this is the “missing token” error when no cookie was stored).

Frontend on boot: if Redux has no access token, call refresh. On `401`, continue unauthenticated.

---

## `POST /centralauth/logout`

**Request**: empty JSON object `{}` is acceptable. Send cookie.

**Response `204`** (or `200`). MUST expire the cookie:

```http
Set-Cookie: refresh_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0
```

Frontend: clear Redux token and go to `/login` even if the network call fails.

---

## Other ClinSync APIs

Every non-auth endpoint requires:

```http
Authorization: Bearer <access_token>
```

`401` → client refresh (cookie) → retry once. Refresh `401` → logout.

---

## Dev proxy rules

Vite `server.proxy['/api_auth']` forwards to the auth service and rewrites the path prefix.

The proxy MUST forward `Set-Cookie` unchanged except it MUST NOT attach `Domain=<upstream host>`. If the auth service emits `Domain`, local cookies will not appear under `http://localhost:5174`.

---

## Explicit non-requirements

- Frontend MUST NOT call `document.cookie`.
- Access token MUST NOT be stored as a cookie.
- `localStorage` / `sessionStorage` MUST NOT hold tokens.
