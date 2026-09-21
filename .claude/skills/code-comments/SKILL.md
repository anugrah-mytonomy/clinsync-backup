---
name: code-comments
description: Comment style conventions actually used in pec-configurator-ui. Load before adding comments to code in this repo, or when cleaning up a file that contains stale commented-out code.
---

# Code comment conventions (pec-configurator-ui)

- **Default to no comments.** Most files in this codebase (e.g. `src/utils/configUtils.ts`, `src/components/modal/BaseModal.tsx`) are comment-free — naming carries the meaning.

- **When a comment is warranted**, keep it a single `//` line directly above the tricky code, explaining *why*, not *what*. Good examples already in the codebase: `src/app/api/apiSlice.ts`'s `// Mutex new refresh` / `// Wait for ongoing refresh` / `// Retry original request after refresh`, and the callback-stability comment in `src/hooks/usePopupPosition.ts`.

- **No JSDoc.** There isn't a single `/** ... */` block anywhere in `src/`. Don't introduce JSDoc-style doc comments — it would be inconsistent with the rest of the repo.

- **No TODO/FIXME markers exist in this repo.** Resolve or drop an issue rather than stubbing it with a marker comment.

- **Don't leave commented-out dead code.** A few files still carry it as legacy cruft (dead selectors in `src/feature/config/configSlice.ts`, a dead menu item in `src/components/navigation/Navbar.tsx`, a dead JSX block in `src/pages/login/index.tsx`, dead lines in `src/components/config/editors/RichTextEditor.tsx`). This is not a pattern to follow — never add new commented-out code, and delete it on sight if you're already editing a file that has it.
