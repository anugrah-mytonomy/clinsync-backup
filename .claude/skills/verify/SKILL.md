---
name: verify
description: Verify changes in ClinSync (clynsync) before committing — typecheck, lint, format check, and tests. Project-specific verify skill for this repo.
---

# Verify (ClinSync / clynsync)

Run these in order and stop at the first failure:

1. `npm run typecheck` (`tsc -b`)
2. `npm run lint` (`eslint .`)
3. `npm run format:check` (`prettier --check .`)
4. `npm run test:coverage` (`vitest run --coverage`) — thresholds in `vite.config.ts` (statements 80%, branches 70%, functions 80%, lines 80%)

If only test files changed and no source coverage is at risk, `npm run test` is enough for step 4.

Report which step failed and the relevant error output; do not continue past a failing step.

Spec-driven: behavior must match `.specify/specs/` before merging user-visible or API changes.
