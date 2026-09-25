# .specify — start here

## What is this folder, in plain words?

Before we build a feature, we write down **what it should do** in a simple text
file. That file is called a "spec." Once it's written down, code has to match
it — if the code does something the spec doesn't say, that's a bug (in the
code or in the spec, but always something to fix, not ignore).

Think of it like a recipe: you write the recipe first, then cook. If the dish
doesn't taste like the recipe says, either you cooked it wrong or the recipe
was wrong — either way, you fix one to match the other. You don't just shrug
and serve a different dish.

## Where everything lives

```
.specify/
  README.md                 ← you are here
  memory/constitution.md    ← the house rules (read once, rarely changes)
  templates/                ← blank forms — copy these to start a new feature
  feature.json               ← "what am I working on right now"
  specs/                     ← one folder per feature — this is the real content
    001-authentication/
    002-app-shell-and-routing/
    003-dashboard/
    004-content-library/
    005-scan-history/
    006-add-content/
```

Full list with status: [`specs/README.md`](./specs/README.md).

## What each file is for

| File | What it's for |
|---|---|
| `README.md` | The front door — this file. |
| `feature.json` | One line: which feature is "active" right now. |
| `memory/constitution.md` | The non-negotiable house rules (e.g. "tokens never go in `localStorage`"). Rarely changes. |
| `templates/spec-template.md` | Blank form — copy it to start writing a new feature's spec. |
| `templates/plan-template.md` | Blank form for "how will I build this" — copy it once a spec is ready to become code. |
| `templates/tasks-template.md` | Blank form for the step-by-step checklist that comes after a plan. |
| `specs/README.md` | Index of every feature spec, its status, and the workflow for adding a new one. |
| `specs/001-authentication/spec.md` | What login/logout/session behavior *should* be — the rules, not the bug. |
| `specs/001-authentication/plan.md` | How the login feature was actually built — which files, which approach. |
| `specs/001-authentication/tasks.md` | The auth checklist — what's done, what's still blocked (backend cookie work). |
| `specs/001-authentication/gaps.md` | The known bug log: what the code does today vs. what the spec says, and why. |
| `specs/001-authentication/contracts/auth.md` | The exact API contract for auth — request/response shapes, the one cookie's exact flags. |
| `specs/001-authentication/checklists/requirements.md` | Quick checkbox list: has the spec covered everything it needs to? |
| `specs/002-app-shell-and-routing/spec.md` | What the sidebar/layout/URL routing should do (who can see what page). |
| `specs/003-dashboard/spec.md` | What the `/dashboard` landing page should show. |
| `specs/004-content-library/spec.md` | What the `/library` table page should do (search, bulk actions, row actions). |
| `specs/005-scan-history/spec.md` | What the scan list/results/document-detail pages should do. |
| `specs/006-add-content/spec.md` | What file upload should do (ready/review/rejected rules, storage flow). |

## The 5-step flow

1. **Specify** — write (or update) `specs/<number>-<name>/spec.md`. Plain
   description of what the feature does, for who, and what "done" looks like.
2. **Plan** — write `plan.md`. Which files will change, which approach.
3. **Tasks** — write `tasks.md`. A checklist, small steps, in order.
4. **Implement** — write the code. Only what the tasks say — no bonus features.
5. **Converge** — if the code ends up doing something different than the
   spec, don't just leave it. Either fix the code, or update the spec to
   match reality. Never let them quietly disagree.

## Day-to-day: what do I actually do?

- **Fixing a bug or asking "why does X work this way?"** → open the matching
  `specs/<number>-<name>/spec.md` first. It usually already answers it.
- **Adding a new page or feature?** → copy `templates/spec-template.md` into a
  new `specs/007-your-feature/spec.md` and fill it in before writing code.
- **Touching login, cookies, tokens, or file upload?** → these are the
  security-sensitive parts. Read `specs/001-authentication/` (auth) or
  `specs/006-add-content/` (upload) first — small mistakes here are the kind
  that leak data or break sessions.
- **Not sure what to work on next?** → check `feature.json`, or ask.

## The one rule that matters most

If the spec and the code disagree, that's not a "which one is right" debate —
it's a bug. Stop and fix it (update the spec, or fix the code) before doing
anything else. Don't build on top of a disagreement.
