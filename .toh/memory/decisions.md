# 🧠 Key Decisions

## Architecture Decisions

| Date       | Decision                      | Reason                                                                  |
| ---------- | ----------------------------- | ----------------------------------------------------------------------- |
| 2025-12-16 | ใช้ Toh Framework             | AI-Orchestration Driven Development                                     |
| 2026-02-17 | Normalize Roles to `string[]` | To simplify frontend logic handling multiple roles format from API.     |
| 2026-02-17 | Use `RoleBadge` System        | Visual distinction for multiple roles (Admin=Red, EC=Blue, etc).        |
| 2026-02-17 | Role Selection Portal         | Support multi-role users by providing a context switching page.         |
| 2026-03-04 | Added `setFilters` action     | To handle multiple filter updates atomically and avoid race conditions. |
| 2026-03-05 | Use `z.coerce.number()`       | To allow clearing numeric inputs in forms and convert them correctly.   |
| 2026-03-05 | Numeric Empty Defaults        | Default numeric inputs to `''` instead of `0` for better typing UX.     |

---

_Last updated: 2026-02-17_
