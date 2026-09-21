---
name: pr-description
description: Draft a PR title and description for pec-configurator-ui matching this repo's observed conventions. Use when asked to write/generate a PR description or open a PR for the current branch.
---

# PR description conventions (pec-configurator-ui)

- **Title**: check `git log` on the branch for a Jira-style ticket prefix already used in commit subjects (e.g. `MED-2382 - Adding the chip filter clear option`) and carry it into the PR title if present: `MED-#### - <short description>`. Otherwise this repo also uses an `<Area> | <description>` style for non-ticket work (e.g. `Hotfix | disabled redox function from production`). Keep it short either way.

- **Body**: brief summary bullets of the change, then an explicit **Test plan** section. Because this repo's GitHub Actions workflows (`CDNonProd.yml`, `CDProd.yml`) are `workflow_dispatch`-only and do **not** run automatically on pull requests, nothing else gates the change — so the test plan must explicitly list the manual verification steps performed, e.g.:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run test` (or `test:coverage` if coverage-sensitive code changed)
  - `npm run build:stage` (if the change could affect the build)
  - Any manual browser verification of the affected flow

- Otherwise follow the standard `gh pr create` flow (HEREDOC body, etc.) already described in the system-level PR instructions — this skill only adds the repo-specific title and test-plan conventions on top of that.
