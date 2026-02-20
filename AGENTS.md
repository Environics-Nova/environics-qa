# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Environics QA is an Environmental Site Assessment QA/QC Management System. It's a React SPA frontend that connects to a REST API backend (separate repo). The app manages environmental assessment projects, field events, documents, and automated quality control processes using customizable questionnaires.

Authentication and multi-tenancy are handled via Clerk (auth + organizations). All API requests require an active organization context — pages guard against missing organization selection.

## Build & Development Commands

- `npm run dev` — Start Vite dev server (port 8080, not the default 5173)
- `npm run build` — Production build
- `npm run build:dev` — Development mode build
- `npm run lint` — ESLint check
- `npm run lint -- --fix` — Auto-fix lint issues
- `npx tsc --noEmit` — TypeScript type checking (no test framework is currently configured)

## Environment

Requires a `.env` file (see `.env.example`):
- `VITE_CLERK_PUBLISHABLE_KEY` — Clerk auth key (required, app crashes without it)
- `VITE_API_BASE_URL` — Backend API base URL (defaults to `http://localhost:3000`)

## Architecture

### Routing & Layout

All authenticated routes are wrapped in `ProtectedRoute` (redirects to `/sign-in`) and `AuthenticatedLayout` (sidebar + header with `UserButton`). Public routes (`/`, `/sign-in`, `/sign-up`) use `PublicRoute` which redirects authenticated users to `/dashboard`. Routes are defined in `src/App.tsx`.

Key routes:
- `/dashboard` — Project list (Dashboard.tsx, aliased through Index.tsx)
- `/project/:projectId` — Project detail with events
- `/event/:eventId` — Event detail with documents
- `/document/:documentId` — Document detail with parsed properties
- `/qaqc-processes` and `/qaqc-processes/:processId` — QA/QC process list and detail
- `/questionnaires` and `/questionnaires/:id` — Questionnaire list and detail with questions

### API Client (`src/hooks/use-api-client.ts`)

Central hook for all backend communication. Uses Clerk's `getToken()` with organization context to get JWTs. Provides `get`, `post`, `put`, `patch`, `del` convenience methods. All API calls go through this hook — there is no other data fetching layer.

API endpoints follow the pattern `/api/v1/{resource}`. Responses use `ApiResponse<T>` wrapper (`{ success, data, message, error }`). Paginated endpoints use `PaginatedResponse<T>` with `{ data, pagination: { page, page_size, total, total_pages } }`.

### Type System (`src/types/index.ts`)

Contains both current API types (using `id` field) and legacy types (using `{entity}_id` field, e.g. `project_id`) for backward compatibility. The `sampleData.ts` still uses the legacy type shapes. When working with API responses, use the non-legacy types (`Project`, `Event`, `Document`, etc.). Request DTOs (`Create*Request`, `Update*Request`) are also defined here.

### Domain Model Hierarchy

Project → Event(s) → Document(s) (each with a DocumentType defining expected properties)
Questionnaire → Question(s) (validation rules comparing document properties)
QAQCProcess → runs a Questionnaire against an Event's documents → produces Result(s)

Questions support two comparison modes:
1. Document-to-document: compare a property from one DocumentType against a property from another
2. Fixed value: compare a property against a static `comparison_value`

### UI Components

- `src/components/ui/` — shadcn/ui primitives (do not modify directly; use `npx shadcn-ui@latest add <component>`)
- `src/components/` — Feature components (dialogs, cards, badges)
- Pages handle their own data fetching via `useEffect` + `useApiClient()` (not TanStack Query hooks despite it being installed)

### Styling

Tailwind CSS with CSS variables for theming (defined in `src/index.css`). Custom semantic colors beyond the standard shadcn set: `success`, `warning`, `processing`. Use `cn()` from `src/lib/utils.ts` for conditional class merging. Always use theme variables (`bg-background`, `text-foreground`, etc.) instead of hardcoded colors.

### Path Alias

`@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.json`).

## Conventions

- Functional components only, with arrow function syntax
- Component files use PascalCase, hooks use `use-` prefix with kebab-case
- Interfaces for object shapes/props, type aliases for unions
- Import order: React → third-party → `@/components/ui` → `@/components` → local types/data
- Forms use `react-hook-form` + `zod` for validation
- Toast notifications use both `sonner` (via `toast()` from sonner) and the shadcn `useToast` hook — both are active; check existing page patterns before choosing
- Dates use `date-fns` for formatting
- Icons from `lucide-react`

## TypeScript Config Notes

The tsconfig has relaxed strictness settings: `noImplicitAny: false`, `strictNullChecks: false`, `noUnusedParameters: false`, `noUnusedLocals: false`. The ESLint config also disables `@typescript-eslint/no-unused-vars`.
