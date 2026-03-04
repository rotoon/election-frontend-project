# 🔥 Active Task

## Current Focus

- EC Module Refactoring completed.

## Just Completed

- Extracted `components/ec/candidate-form-dialog.tsx` — RHF+Zod form (9 fields) from 916-line God Component.
- Migrated `app/ec/parties/page.tsx` form to react-hook-form + zod.
- Fixed barrel import `@/types` → `@/types/party`.
- Created `app/ec/control/loading.tsx`.
- Updated `app/ec/error.tsx` to Thai.
- Fixed auth infinite loop bugs (Zustand selector + register form useEffect deps).
- Verified with `tsc --noEmit` (0 errors) and `npm run build` (14/14 routes).
- Fixed Province Filter bug by implementing `setFilters` in `useURLPagination` to handle multipart filter updates atomically.
- Added Province Filter dropdown to Admin Users management page.

## Next Steps

- Consider: `confirm()` → AlertDialog (3 pages)
- Consider: `<img>` → Next.js `Image` (candidates)
- Manual testing: verify candidate/party CRUD still works

---

_Last updated: 2026-03-03_
