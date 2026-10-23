---
name: pr-description
description: Draft a PR title and description for ClinSync (clynsync). Use when asked to write a PR description or open a PR for the current branch.
---

# PR description conventions (ClinSync / clynsync)

- **Title**: short imperative or fix/feature prefix, e.g. `fix: session retry for clock skew`, `feat: wire library upload polling`. Use team ticket IDs if your branch commits already include them.

- **Body**:
  - **Summary** — 1–3 bullets: what changed and why (link `.specify/specs/` if behavior changed).
  - **Test plan** — checklist, e.g.:
    - `npm run typecheck`
    - `npm run lint`
    - `npm test` (or `test:coverage` if production code changed)
    - Manual: login → dashboard, affected route (library/scans/upload), Network tab if auth/API touched
  - Note **frontend-only** vs **needs ClinSync-Backend** if the PR depends on API work.

- Use `gh pr create` with a HEREDOC body per team GitHub workflow. This skill only adds ClinSync-specific title and test-plan expectations.
