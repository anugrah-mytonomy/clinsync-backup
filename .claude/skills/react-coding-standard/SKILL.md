---
name: react-coding-standard
description: React/Redux/styling conventions actually used in pec-configurator-ui. Load when writing or editing React components, hooks, forms, or modals in this repo so new code matches the existing style.
---

# React coding standard (pec-configurator-ui)

- **Redux access**: always use `useAppDispatch` / `useTypedSelector` from `src/app/store.ts`, never raw `useDispatch`/`useSelector` from `react-redux`. (`src/components/providers/PrivateAuthProvider.tsx` currently uses raw `useSelector` — that's an existing inconsistency, not the pattern to copy; fix it opportunistically if you're already touching that file.)

- **Styling**: use the design-token Tailwind classes backed by the `--mt-*` CSS variables in `src/styles/theme.css` (e.g. `bg-background-surface-default`, `text-text-primary`, `stroke-icon-primary`, `border-border-subtle`) instead of hardcoded hex or arbitrary Tailwind values. A handful of existing hardcoded hex values (`#FADBDE`, `#9CA3AF`) are pre-existing exceptions, not something to replicate.

- **Icons**: import from the `src/styles/icons` barrel (`index.ts`), never a direct file import. Icon components take `React.SVGProps<SVGSVGElement>` and use `stroke="inherit"` internally so color is driven externally via a Tailwind `stroke-*` class on the call site.

- **Forms**: `react-hook-form` + `zodResolver(someRequestSchema)` from `@hookform/resolvers/zod`, validating against a schema in `src/schemas/`, built from the shared `Input`/`Button` components in `src/components/ui/`. Surface API/server errors via `setError("root", { message })` and render a `formState.errors.root` alert block (see `src/pages/login/index.tsx`).

- **Modals**: build on `BaseModal` (`src/components/modal/BaseModal.tsx`) rather than a bespoke overlay — it already handles portal-to-`#root`, the `show`/`cbShowChange` prop pair, and click-outside-to-close.

- **Tests**: colocate as `Foo.tsx` + `Foo.test.tsx`. Use `renderWithProvider` from `src/testing/testUtils.tsx` for anything touching Redux or `react-router`; it builds a fresh store per test and accepts `preloadedState`.

For the config-editing domain specifically (discriminated-union config types, editor/preview pairs), see the `add-config-type` skill.
