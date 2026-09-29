# ClinSync UI – Project Setup & Structure

_By Anugrah M_

1. [Overview](#1-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
   - [Structure Guidelines](#structure-guidelines)
4. [Redux & API Setup](#4-redux--api-setup)
5. [Routing](#5-routing)
6. [Forms & Validation](#6-forms--validation)
7. [Styling & Design System](#7-styling--design-system)
8. [Testing Strategy](#8-testing-strategy)
9. [Environment Configuration](#9-environment-configuration)
10. [Local File Uploads (LocalStack)](#10-local-file-uploads-localstack)
11. [Code Quality & Tooling](#11-code-quality--tooling)
12. [CI / Workflow](#12-ci--workflow)
13. [Related Documentation](#13-related-documentation)

---

## 1. Overview

`clynsync` is the frontend for **ClinSync** by Mytonomy. It is built with React, Vite and TypeScript. Users sign in, manage a library of clinical content, run scans on that content and review what each scan found.

The application follows modern frontend engineering practices, including:

- Centralized state management
- An API layer kept separate from the UI
- Type-safe development
- Automated linting and formatting
- Automated testing
- A dev-only component playground

The architecture ensures:

- Scalability
- Maintainability
- Clear separation of concerns

---

## 2. Tech Stack

| Category         | Technology                         | Purpose                                                |
| ---------------- | ---------------------------------- | ------------------------------------------------------ |
| Framework        | React 19                           | Building the UI from components                        |
| Build Tool       | Vite 8                             | Fast development server and optimized builds           |
| Language         | TypeScript 6                       | Type safety and maintainable code                      |
| Routing          | React Router 7                     | Client-side routing                                    |
| State Management | Redux Toolkit                      | Global state management                                |
| API Layer        | RTK Query                          | Data fetching, caching and token refresh               |
| Forms            | React Hook Form                    | Fast form handling                                     |
| Validation       | Zod                                | Schema-based form validation                           |
| Styling          | Tailwind CSS 3                     | Utility-first styling                                  |
| Charts           | Recharts                           | Dashboard charts (risk trend, coverage, documents)     |
| Testing          | Vitest + Testing Library           | Unit and component testing                             |
| API Mocking      | Mock Service Worker (MSW)          | Mocking backend calls in tests                         |
| Local Storage    | LocalStack (S3) via Docker Compose | Local S3 bucket for file uploads                       |
| Linting          | ESLint                             | Static code analysis                                   |
| Formatting       | Prettier                           | Code formatting                                        |

---

## 3. Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── apiSlice.ts          # RTK Query base API (auth header, 401 → refresh)
│   └── store.ts                 # Redux store configuration
│
├── feature/
│   └── auth/
│       ├── authSlice.ts         # Authentication Redux slice (token)
│       ├── authApiSlice.ts      # Login / logout / refresh endpoints
│       ├── authApiSlice.types.ts# Request & response types
│       └── __tests__/           # Slice unit tests
│
├── routes/
│   ├── public.routes.tsx        # Public route definitions (login)
│   ├── private.routes.tsx       # Authenticated route definitions
│   ├── ProtectedRoute.tsx       # Auth guard – redirects to /login
│   └── index.tsx                # Central router configuration
│
├── layouts/
│   ├── AuthLayout.tsx           # Layout for login screens
│   └── DashboardLayout.tsx      # Sidebar + content layout for the app
│
├── pages/
│   ├── auth/                    # Login page
│   ├── dashboard/               # Dashboard widgets & review queue
│   ├── content-library/         # Library listing & add content
│   └── scan-history/            # Scan runs, results, document findings
│
├── components/
│   ├── layout/                  # Sidebar, PageHeader
│   ├── ui/                      # Reusable UI (Button, Table, Input, Select,
│   │                            #   DonutChart, ProgressBar, icons, uploadFile …)
│   └── AuthInitializer.tsx      # Restores the session on app load
│
├── hooks/
│   └── useAuth.ts               # Auth state + logout helper
│
├── schemas/
│   └── loginSchema.ts           # Zod form schemas
│
├── styles/
│   ├── theme.css                # Design tokens (colors, fonts, spacing)
│   └── global.css               # Global styles & Tailwind imports
│
├── mocks/
│   ├── handlers.ts              # MSW request handlers
│   └── server.ts                # MSW server for tests
│
├── testing/
│   ├── setup.ts                 # Vitest setup (jest-dom, MSW lifecycle)
│   └── testUtils.tsx            # Render helpers (store + router)
│
├── playground/                  # Dev-only component playground (/playground)
│
├── types/
│   └── api.ts                   # Shared API error types & helpers
│
├── utils/
│   ├── cn.ts                    # className merge helper
│   ├── constants.ts             # App constants
│   ├── formatBytes.ts           # File size formatting
│   ├── addContentValidation.ts  # Upload validation rules
│   └── localstackUpload.ts      # S3 (LocalStack) upload helper
│
├── assets/                      # SVG icons & images
├── main.tsx                     # Application entry point
└── vite-env.d.ts
```

### Structure Guidelines

**app/**
Settings for the whole app: the Redux store and the base API.

**feature/**
Code grouped by domain. Each domain keeps its own Redux slice and API endpoints.

**routes/**
All routing lives here. Public and private routes are kept in separate files, and private routes are protected by a guard component.

**layouts/**
Page shells shared by many pages (the auth screens and the dashboard with its sidebar).

**pages/**
Components for each screen. A page's own mock data, types and sub-components sit in the same folder as the page.

**components/**
Shared components that are used across pages. They don't belong to any one page.

**styles/**
The design tokens and global styles.

**playground/**
Examples of each UI component, rendered at `/playground` in development only.

---

## 4. Redux & API Setup

- The Redux store is set up in `app/store.ts`.
- The RTK Query base API slice is set up in `app/api/apiSlice.ts`. It:
  - adds `Authorization: Bearer <token>` to every request
  - sends cookies with `credentials: 'include'`
  - handles a `401` by calling `/centralauth/refresh` once, then retries the request. If the refresh fails, the user is logged out.
- Feature-level Redux code:
  - `feature/auth` handles login, logout, refresh and the token state.

The session is restored when the app loads: `AuthInitializer` calls the refresh endpoint before the router renders.

This structure lets each feature be developed on its own and makes it easy to add more.

---

## 5. Routing

Routing uses **React Router** (`createBrowserRouter`). Every page is lazy-loaded and shows `PageLoader` while it loads.

### Public Routes

These don't need a login.

Examples:

- Login

```
routes/public.routes.tsx
```

### Private Routes

These need a login. They render inside `DashboardLayout`.

Examples:

- Dashboard
- Library / Add Content
- Scan History / Scan Results / Document Findings / Replace Document

```
routes/private.routes.tsx
```

They use a guard component:

```
ProtectedRoute
```

What it does:

- Checks that an auth token exists
- Sends users who aren't logged in to `/login`

### Central Route Configuration

```
routes/index.tsx
```

All application routes come together here. This file also:

- redirects `/` and unknown paths to `/dashboard`
- adds the `/playground` route in development only

---

## 6. Forms & Validation

Forms use **React Hook Form**.

Validation uses **Zod** schemas, which live in `schemas/` and are connected to the form with `zodResolver`.

Benefits:

- High performance
- Type-safe validation
- Minimal re-renders

Example Flow:

```
Form Component (LoginPage)
   ↓
React Hook Form
   ↓
Zod Schema Validation (loginSchema)
   ↓
API Call (useLoginMutation)
```

---

## 7. Styling & Design System

Styling uses **Tailwind CSS**.

### Design Tokens

Design tokens are defined in:

```
styles/theme.css
```

Examples:

- Colors (primary, surface, border, muted, danger, success …)
- Fonts
- Spacing
- Border radius
- Font sizes

`tailwind.config.js` reads these tokens, so classes like `bg-primary` or `text-muted` stay consistent across the app. Colors are stored as RGB channel values, so opacity modifiers such as `bg-primary/10` work.

### Global Styles

```
styles/global.css
```

Used for:

- Importing the theme tokens
- Tailwind imports
- Base body styles

---

## 8. Testing Strategy

Testing uses:

- Vitest (`jsdom` environment)
- Testing Library
- Mock Service Worker

Tests live in `__tests__/` folders next to the code they test.

### Test Setup

```
testing/setup.ts
testing/testUtils.tsx
```

### Unit Tests

These test utility functions and logic that runs on its own.

Examples:

```
utils/__tests__/cn.test.ts
feature/auth/__tests__/authSlice.test.ts
```

### Component Tests

These test React components with Testing Library.

Examples:

```
Component rendering
User interactions
State updates
```

```
components/ui/Button/__tests__/Button.test.tsx
components/layout/__tests__/Sidebar.test.tsx
pages/auth/__tests__/LoginPage.test.tsx
```

### API Mocking

API calls are mocked with MSW (`mocks/handlers.ts`). If a test makes a request that has no handler, the test fails.

Benefits:

- No dependency on the backend
- The same result on every run
- Faster tests

---

## 9. Environment Configuration

The application supports several environments:

| Environment | Purpose                       |
| ----------- | ----------------------------- |
| Development | Local development             |
| Stage       | Non-prod testing              |
| Production  | Live production environment   |

Environment variables are defined in:

```
.env.development
.env.stage
.env.production
.env.example        # template for new setups
```

Main variables:

| Variable            | Purpose                           |
| ------------------- | --------------------------------- |
| `VITE_APP_ENV`      | Current environment name          |
| `VITE_AUTH_API_URL` | Central Auth Service base URL     |
| `VITE_S3_ENDPOINT`  | S3 / LocalStack endpoint          |
| `VITE_S3_BUCKET`    | Upload bucket name                |

Access pattern:

```
import.meta.env
```

In development, the Vite dev server sends `/api_auth` requests to `VITE_AUTH_API_URL` and `/s3` requests to `VITE_S3_ENDPOINT`, which avoids CORS errors in the browser.

Build commands:

```
npm run dev           # development server
npm run build:stage   # stage build
npm run build:prod    # production build
```

---

## 10. Local File Uploads (LocalStack)

Content uploads are saved to an S3 bucket. In local development, **LocalStack** provides that bucket inside Docker.

```
npm run localstack:up     # start LocalStack (S3) and create the bucket
npm run localstack:down   # stop it
```

The upload helper is `utils/localstackUpload.ts`. See `LOCALSTACK.md` for the full setup.

---

## 11. Code Quality & Tooling

### Linting

Uses **ESLint** (`eslint.config.js`), including the React Hooks, React Refresh and Prettier plugins.

It ensures:

- Consistent coding patterns
- Common errors are caught

### Formatting

Uses **Prettier** (`.prettierrc.json`).

### Type Safety

The TypeScript config is set to `strict`, which gives:

- Strong type checking
- Safer refactoring
- Better IDE support

The `@/` alias points to `src/`.

### Scripts

```
npm run lint            # ESLint
npm run format          # Prettier write
npm run format:check    # Prettier check
npm run typecheck       # tsc --noEmit
npm run test            # Vitest (single run)
npm run test:coverage   # Vitest with coverage
```

---

## 12. CI / Workflow

- Default branch: `main`
- No CI pipeline is set up yet. Until one is, run `lint`, `typecheck`, `format:check` and `test` locally before you push.

---

## 13. Related Documentation

The pages below give more detail about the project:

- `README.md` – getting started
- `PROJECT_OVERVIEW.md` – product and feature overview
- `API_LLD.md` – API low-level design
- `LOCALSTACK.md` – LocalStack / S3 setup
