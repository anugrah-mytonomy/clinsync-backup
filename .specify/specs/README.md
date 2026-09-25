# ClinSync Specs

This folder describes **what the product actually does** — page by page,
feature by feature. If you're not sure how something is supposed to behave,
the answer is in here, not in a guess.

Rule: code must match what's written here. If they disagree, that's a bug —
fix the spec or fix the code, don't leave it unresolved.

House rules for the whole project: [`../memory/constitution.md`](../memory/constitution.md).

## How a feature gets built here

```
write the spec → (add a contract, if it talks to an API) → plan it → break into tasks → build it → check it still matches
```

1. Copy `.specify/templates/` into a new `.specify/specs/NNN-feature-name/` folder.
2. Write `spec.md` — what it does and why. If something's genuinely unknown,
   write `NEEDS CLARIFICATION` instead of guessing.
3. If it touches an HTTP API, cookies, or storage, add a `contracts/` file
   describing that exact shape (request/response, cookie names, etc).
4. Write `plan.md` (how you'll build it) and `tasks.md` (the checklist).
5. Build only what the tasks describe.
6. Once shipped, mark the spec `Implemented` or `Partial`, and note anything
   still missing.

`FEATURES.md` / `PROJECT_OVERVIEW.md` are just an index pointing here — the
real detail always lives in this folder.

## Index

| ID | Feature | Status | Spec | Contract |
|----|---------|--------|------|----------|
| 001 | Authentication | Partial | [spec.md](./001-authentication/spec.md) | [contracts/auth.md](./001-authentication/contracts/auth.md) |
| 002 | App shell & routing | Partial | [spec.md](./002-app-shell-and-routing/spec.md) | — |
| 003 | Dashboard | Partial | [spec.md](./003-dashboard/spec.md) | [API_LLD §6](../../API_LLD.md) |
| 004 | Content library | Partial | [spec.md](./004-content-library/spec.md) | [API_LLD §2](../../API_LLD.md) |
| 005 | Scan history | Partial | [spec.md](./005-scan-history/spec.md) | [API_LLD §4–5](../../API_LLD.md) |
| 006 | Add content | Partial | [spec.md](./006-add-content/spec.md) | [API_LLD §3](../../API_LLD.md) |

**Partial** means the UI exists but the specified backend contract is incomplete or not wired.

## Auth (read this first)

The empty Cookies tab and refresh `missing token` error are specified here, not implied by frontend fetch options:

- Access token → Redux memory, sent as `Authorization: Bearer`
- Session → HttpOnly cookie from login `Set-Cookie`
- `credentials: 'include'` only *forwards* that cookie; it does not create it

See [001-authentication/gaps.md](./001-authentication/gaps.md) for current code vs this contract.
