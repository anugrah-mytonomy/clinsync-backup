# ClinSync Specs

This folder is the **source of truth** for product behavior. Code follows these specs. If code and spec disagree, fix the spec first or change the code to match — do not leave a silent gap.

Governing rules: [`../memory/constitution.md`](../memory/constitution.md).

## Workflow

```
specify → contract → plan → tasks → implement → converge
```

1. Copy templates from `.specify/templates/` into a new `.specify/specs/NNN-feature-name/` directory.
2. Write `spec.md` (what / why). Mark unknowns as `NEEDS CLARIFICATION`.
3. If the work crosses HTTP, cookies, or storage, add `contracts/`.
4. Write `plan.md` and `tasks.md`.
5. Implement only listed tasks.
6. After shipping, set status to `Implemented` or `Partial` and record remaining gaps.

Do not put implementation-only notes in `FEATURES.md` or `PROJECT_OVERVIEW.md`. Those files index this folder.

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
