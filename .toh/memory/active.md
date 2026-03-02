# 🔥 Active Task

## Current Focus

- File Upload Integration completed for Candidate and Party forms.

## Just Completed

- Created `hooks/use-upload.ts` — React Query mutation hook for POST /upload (multipart/form-data).
- Created `components/ui/image-upload.tsx` — Reusable drag & drop image upload component with preview, loading state, and remove functionality.
- Replaced manual URL input in `app/ec/candidates/page.tsx` with ImageUpload component (folder: `candidates`).
- Replaced manual URL input + preview in `app/ec/parties/page.tsx` with ImageUpload component (folder: `parties`).
- Verified with `pnpm run build` — compiled successfully, all 18 routes generated.

## Next Steps

- Manual testing: verify upload flow on `/ec/candidates` and `/ec/parties` pages with live backend.
- Await further instructions for other features.

---

_Last updated: 2026-03-02_
