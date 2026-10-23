---
name: react-coding-standard
description: React/Redux/styling conventions used in ClinSync (clynsync). Load when writing or editing React components, hooks, forms, or API slices in this repo.
---

# React coding standard (ClinSync / clynsync)

- **Redux**: `useDispatch<AppDispatch>()` and `useSelector` from `react-redux` with types from `@/app/store`. Auth/session helpers live in `@/hooks/useAuth.ts` (`useSession`, `useOrganization`, `useHasPermission`).

- **API**: RTK Query slices extend `authApiSlice` / `clinsyncApiSlice` from `@/app/api/apiSlice.ts`. ClinSync calls use the shared reauth base query; do not bypass it for authenticated routes. Auth uses `credentials: 'include'`; the UI never writes cookies.

- **Styling**: Tailwind with shared tokens in `src/styles/global.css` (`gap-lg`, `text-muted`, `border-border`, `bg-background`, etc.). Match existing pages (e.g. library `#F1F5F9` shells) rather than inventing new palettes. Use `@/utils/cn` for conditional classes.

- **Icons**: `@/components/ui/icons` for inline SVG icons; feature assets under `@/assets/*.svg`.

- **Forms**: `react-hook-form` + `zodResolver` + schemas in `src/schemas/`. Use `Input` / `Button` from `@/components/ui/`. API errors: `getApiErrorMessage` from `@/types/api` (see `LoginPage.tsx`).

- **Modals**: `@/components/ui/Modal` when adding overlays.

- **Routing**: route tables in `src/routes/`; protected shell via `ProtectedRoute` + `DashboardLayout`.

- **Tests**: colocate `*.test.tsx` / `*.test.ts`. Use `renderWithProviders` from `src/testing/testUtils.tsx` for Redux/router. MSW handlers in `src/mocks/handlers.ts`; tests use `src/testing/setup.ts`.

- **Specs**: read matching `.specify/specs/NNN-*/spec.md` before changing user-visible behavior, auth, or HTTP contracts.
