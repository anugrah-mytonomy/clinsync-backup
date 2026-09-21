---
name: verify
description: Verify changes in pec-configurator-ui before committing - typecheck, lint, format check, and tests. This is the project-specific verify skill the global /verify skill looks for in this repo.
---

# Verify

Run these in order and stop at the first failure:

1. `npm run typecheck` (`tsc -b`)
2. `npm run lint` (`eslint .`)
3. `npm run format:check` (`prettier --check .`)
4. `npm run test:coverage` (`vitest run --coverage`) — enforces coverage thresholds from `vite.config.ts` (statements 80%, branches 70%, functions 75%, lines 80%)

If only test files changed and no source coverage is at risk, `npm run test` (no coverage) is sufficient for step 4.

`scripts/bundle.sh` is a separate release-prep script (format → lint → build:stage) — it skips typecheck and tests, so don't substitute it for this verify sequence.

Report which step failed and the relevant error output; don't continue past a failing step.
