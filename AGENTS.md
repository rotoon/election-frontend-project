# AGENTS.md - Election Frontend

## Project Overview

Election management system (Thai) — Next.js 16 App Router with voting, admin, and election commission (EC) features. Thai language UI, JWT auth, role-based access (ADMIN, EC, VOTER).

**Stack:** Next.js 16.1.6, React 19, TypeScript (strict), Tailwind CSS v4, Zustand, TanStack React Query v5, React Hook Form + Zod v4, Radix UI (shadcn/ui new-york style), Recharts, Framer Motion, Sonner (toasts), Axios.

---

## Commands

```bash
pnpm run dev          # Start dev server (Next.js on port 3001, API proxy → localhost:3000)
pnpm run build        # Production build
pnpm run lint         # ESLint (flat config, next/core-web-vitals + next/typescript)
pnpm run test         # Jest (all tests)
pnpm run test:watch   # Jest watch mode
pnpm test -- --testPathPattern="use-auth"      # Run single test file by name
pnpm test -- --testPathPattern="components/ui"  # Run tests matching path pattern
pnpm test -- path/to/file.test.ts              # Run specific test file
```

**No tests exist yet.** Test infra is configured: Jest 30 + jsdom + @testing-library/react. Setup in `jest.setup.ts` imports `@testing-library/jest-dom`. Module aliases (`@/components/*`, `@/lib/*`, `@/store/*`) are mapped in `jest.config.ts`.

---

## Architecture

### Directory Structure

```
app/                   # Next.js App Router pages
  (voter)/             # Route group: /vote, /results, /parties, /profile
  admin/               # /admin/users, /admin/constituencies
  auth/                # /auth (login/register)
  ec/                  # /ec/parties, /ec/candidates, /ec/control
  portal/              # Multi-role portal selection
  district/            # District-level results
components/
  ui/                  # shadcn/ui primitives (Button, Card, Dialog, etc.)
  admin/               # Admin-specific components
  ec/                  # EC management components (candidates/, parties/)
  vote/                # Voter-facing components
  dashboard/           # Charts, maps (Recharts, react-simple-maps)
  shared/              # Reusable layout components (pagination-bar, confirm-dialog)
hooks/                 # Custom React hooks (use-*.ts) — all data fetching lives here
store/                 # Zustand stores (useAuthStore.ts)
types/                 # TypeScript type definitions, barrel export via index.ts
lib/                   # Utilities: api.ts, error.ts, utils.ts, transforms.ts, constants/, mock-data/
docs/                  # API documentation (api_docs.md, candidate.md)
```

### Key Files

- `lib/api.ts` — Axios instance with JWT interceptor (reads token from Zustand store)
- `lib/error.ts` — `getApiErrorMessage(error, fallback)` for consistent error extraction
- `lib/transforms.ts` — API response transformers (camelCase API → snake_case frontend legacy types)
- `lib/utils.ts` — `cn()` (clsx + tailwind-merge), `formatCitizenId()`
- `middleware.ts` — Auth protection, role-based route guards (JWT from cookie)
- `components/providers.tsx` — QueryClient setup (staleTime: 60s, retry: 1)
- `types/index.ts` — Barrel export for all types

---

## Code Style

### TypeScript

- **Strict mode** enabled. Never use `as any`, `@ts-ignore`, or `@ts-expect-error`.
- Use `interface` for object shapes, `type` for unions/aliases.
- Export types from `types/` directory; import via `@/types` barrel or `@/types/specific`.
- API response types prefixed with `Api` (e.g., `ApiCandidate`, `ApiParty`) in `types/api.ts`.
- Mutation payloads use `Create*Payload` / `Update*Payload` naming.
- Query params use `Get*Query` naming.

### Imports

- Path alias: `@/*` maps to project root. Always use `@/` imports, never relative `../`.
- Import order (enforced by convention):
  1. React / Next.js (`react`, `next/navigation`, etc.)
  2. External libraries (`@tanstack/react-query`, `axios`, `sonner`, `lucide-react`)
  3. Internal aliases (`@/components/*`, `@/hooks/*`, `@/lib/*`, `@/store/*`, `@/types/*`)
- Named exports preferred. Default exports only for page components and the Axios instance.

### Naming Conventions

- **Files:** kebab-case for all files (`use-candidates.ts`, `candidate-card.tsx`, `confirm-dialog.tsx`).
- **Stores:** `use[Name]Store.ts` with camelCase (exception to kebab rule): `useAuthStore.ts`.
- **Hooks:** `use-[name].ts` — kebab-case files, camelCase function names.
  - Queries: `use[Entity]()` or `use[Entity]Query()` (e.g., `useCandidates()`, `useMeQuery()`)
  - Mutations: `use[Action][Entity]Mutation()` (e.g., `useCreateCandidateMutation()`, `useDeleteCandidateMutation()`)
- **Components:** PascalCase exports, kebab-case files. (`CandidateCard` in `candidate-card.tsx`)
- **Types:** PascalCase, grouped by domain in `types/` directory.
- **Pages:** Default export only. Wrap with `<Suspense>` if using `useSearchParams`.

### Components

- UI primitives in `components/ui/` follow **shadcn/ui new-york** style (via `components.json`).
- Use `cn()` from `@/lib/utils` for conditional class merging.
- Icons from `lucide-react` exclusively.
- Use `cva` (class-variance-authority) for component variants.
- Client components: add `'use client'` directive at top.
- Animations: Framer Motion (`motion.div` with `initial`/`animate` props).

### Data Fetching

- **All API calls go through hooks in `hooks/`** — never call `api.get/post` directly in components.
- Queries use `useQuery` with descriptive `queryKey` arrays.
- Mutations use `useMutation` with `onSuccess` → `queryClient.invalidateQueries()` + `toast.success()`.
- Error handling in mutations: `onError` → `toast.error(getApiErrorMessage(error, 'fallback message'))`.
- API base URL configured via `NEXT_PUBLIC_API_URL` env var (defaults to `http://localhost:3000`).
- Next.js rewrites proxy `/api/*` to the backend at `localhost:3000`.

### State Management

- **Server state:** TanStack React Query (all data from API).
- **Client state:** Zustand with `persist` middleware for auth. Use `useState` for local UI state.
- **URL state:** `useURLPagination` hook for pagination/filter state synced to URL params.

### Error Handling

- Use `getApiErrorMessage(error, fallbackMessage)` from `@/lib/error` — never inline error parsing.
- Toast notifications via `sonner`: `toast.success()`, `toast.error()`.
- Error boundaries: `app/error.tsx` (global), can add per-route.
- API 401 responses trigger automatic logout via Axios response interceptor.

### Forms

- React Hook Form + Zod validation (`@hookform/resolvers`).
- Follow existing patterns in `components/ec/` and `components/auth/`.

---

## API Integration

- Backend runs at `localhost:3000`. Frontend proxied via Next.js rewrites.
- JWT token stored in Zustand (localStorage via persist) AND as `auth-token` cookie (for middleware).
- Roles: `ROLE_ADMIN`, `ROLE_EC`, `ROLE_VOTER`.
- API docs: `docs/api_docs.md`, `docs/candidate.md`.
- Response format: Backend wraps responses in `{ ok: boolean, data: T }` or returns data directly (inconsistent — check per endpoint).

---

## Testing

- Framework: Jest 30 + jsdom + React Testing Library.
- Place test files as `*.test.ts` or `*.test.tsx` alongside source or in `__tests__/`.
- Jest setup auto-imports `@testing-library/jest-dom` matchers.
- Module path aliases are configured in `jest.config.ts`.

---

## Common Patterns

```tsx
// Hook pattern (query)
export function useParties() {
  return useQuery({
    queryKey: ['parties'],
    queryFn: async () => {
      const { data } = await api.get('/ec/parties')
      return transformParties(data.data || data)
    },
  })
}

// Hook pattern (mutation)
export function useCreatePartyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreatePartyPayload) => {
      await api.post('/ec/parties', payload)
    },
    onSuccess: () => {
      toast.success('Success message')
      queryClient.invalidateQueries({ queryKey: ['parties'] })
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Fallback error'))
    },
  })
}

// Page pattern (with URL pagination)
export default function MyPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <PageContent />
    </Suspense>
  )
}
```
