# 🔥 Active Task

## Current Focus

- Constituency CRUD with district selection completed (Create + Edit).

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
- Updated Constituency Toggle API hooks → new `/ec/constituencies/...` endpoints (toggle, open-all, close-all).
- Added `updatedAt` column ("แก้ไขล่าสุด") to candidates table with relative time display, default sort by `updatedAt` desc.
- Added "จำนวนผู้สมัคร" column to /admin/constituencies (clickable) → opens `CandidateListDialog` showing full list with name, party, and number.
- Updated API types + transformers to pass `candidates[]` from constituency API response.
- **Redesigned Candidate List**: Switched to a premium card-based layout with interactive effects.
- **Constituency Edit**: Implemented full edit dialog with district management and validation.
- **Numeric Input UX Fix**: Resolved input clearing issues and set default values to empty strings instead of `0`.
- **Candidate Form Reset UX Fix**: Fixed issue where candidate form kept old data when closing and reopening the modal.
- **Party Form Reset UX Fix**: Applied the same fix to `PartyFormDialog`.

## Next Steps

- Consider: `confirm()` → AlertDialog (3 pages)
- Consider: `<img>` → Next.js `Image` (candidates)
- Manual testing: verify candidate/party CRUD still works

---

_Last updated: 2026-03-05_
