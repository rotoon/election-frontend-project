# AGENTS.md - Development Guidelines

## Project Overview

Election Frontend - A Next.js 16 application for election management system with voting, admin, and election commission (EC) features.

**Tech Stack:**

- Next.js 16.1.6 (App Router)
- TypeScript
- Tailwind CSS v4
- Zustand (State Management)
- TanStack React Query (Data Fetching)
- React Hook Form + Zod (Forms)
- Radix UI (UI Components)
- Recharts, D3-Geo (Charts & Maps)

---

## Commands

```bash
pnpm run dev      # Start development server
pnpm run build    # Build production
pnpm run start    # Start production server
pnpm run lint     # Run ESLint
pnpm run test     # Run tests
```

---

## Architecture

### Routes Structure

```
/auth/           - Login/Register pages
/portal/         - Main dashboard
/admin/          - Admin management (users, constituencies)
/ec/             - Election Commission (candidates, parties, control)
/( voter)/       - Voter routes (vote, results, profile)
/                - Landing with results visualization
```

### Components Organization

```
components/
├── ui/          - Reusable shadcn-style components
├── admin/       - Admin-specific components
├── ec/          - Election Commission components
├── vote/        - Voter-facing components
├── dashboard/   - Dashboard/charts components
└── shared/      - Shared layouts
```

### Types

```
types/
├── api.ts       - API response types
├── auth.ts      - Auth types
├── candidate.ts - Candidate types
├── party.ts     - Party types
├── constituency.ts
├── location.ts  - Province/District types
├── vote.ts      - Voting types
├── user.ts      - User types
├── dashboard.ts - Dashboard/Charts types
└── common.ts    - Common types
```

### Libraries

- `lib/api.ts` - Axios instance with interceptors
- `lib/utils.ts` - cn() utility (classnames merge)
- `lib/transforms.ts` - Data transformation utilities

---

## API Integration

### Base URL

- Default: `http://localhost:3000`
- Configure in `.env` if needed

### Authentication

- JWT-based authentication
- Token stored and attached via Axios interceptor
- Roles: `ADMIN`, `EC`, `VOTER`

### API Documentation

- See `docs/api_docs.md` for full API reference
- See `docs/candidate.md` for candidate endpoints

### TypeScript Types

All API types are defined in `types/` directory. Use these types when making API calls.

---

## Coding Standards

### UI Components

- Use Radix UI primitives from `@radix-ui/react-*`
- Components in `components/ui/` follow shadcn/ui pattern
- Use `cn()` from `lib/utils.ts` for class merging

### Forms

- Use React Hook Form with Zod validation
- Follow existing form patterns in components

### State Management

- Use Zustand for global state
- Use React Query for server state

### Maps & Charts

- Thailand map: `components/dashboard/thailand-map.tsx` (react-simple-maps)
- Charts: Recharts components

---

## Key Files to Reference

- `components/providers.tsx` - React Query provider setup
- `lib/api.ts` - API client configuration
- `types/index.ts` - All type exports
- `middleware.ts` - Auth protection
