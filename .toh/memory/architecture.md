# 🏗️ Project Architecture

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Backend/DB**: Supabase + Prisma

## Directory Structure

- `app/`: Next.js App Router pages and layouts
- `components/`: UI and feature components
  - `ui/`: shadcn/ui base components
  - `dashboard/`: Components specific to the election dashboard (HeroCard, ResultsSidebar)
- `hooks/`: Custom React hooks (useDashboard, etc.)
- `types/`: TypeScript definitions
- `lib/`: Utility functions and shared library code
