# .specify

Single folder for spec-driven development.

```
.specify/
  README.md                 ← you are here
  memory/constitution.md    ← non-negotiable rules
  templates/                ← copy these for a new feature
  feature.json              ← active feature
  specs/                    ← source of truth for product behavior
    001-authentication/
    ...
```

Start here: [`specs/README.md`](./specs/README.md).

Workflow: specify → contract → plan → tasks → implement → converge.
Copy `templates/` into `specs/NNN-feature-name/`. Do not add a second specs folder at the repo root.
