---
name: code-comments
description: Comment style conventions for ClinSync (clynsync). Load before adding comments or removing stale commented-out code.
---

# Code comment conventions (ClinSync / clynsync)

- **Default to no comments.** Prefer clear names and small functions; most UI code stays comment-free.

- **When a comment is warranted**, use a single `//` line above non-obvious logic explaining *why* (business rule, auth quirk, clock skew). Good examples: `src/app/api/apiSlice.ts` (refresh mutex, `invalid_token` retry), `AuthInitializer.tsx` (boot behavior).

- **No JSDoc** unless the file already uses it consistently (this repo generally does not).

- **No TODO/FIXME** — fix the issue or track it in `.specify/specs/` tasks, not in code.

- **Do not leave commented-out dead code.** Remove it when you touch the file.

- **Spec references** in comments may point to `.specify/specs/...` paths, not deleted overview docs.
