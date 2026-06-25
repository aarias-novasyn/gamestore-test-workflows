## Context

The products listing endpoint (`GET /api/products`) has a pagination bug: `skip` is hardcoded to `0` instead of using the calculated offset (`(page - 1) * limit`). Any page beyond 1 returns identical results to page 1. The frontend pagination controls render correctly (correct `totalPages`), but the actual products never change.

## Goals / Non-Goals

**Goals:**
- Fix the skip parameter so pagination returns the correct products for each page
- Maintain exact API contract (same request/response shape, same query params)
- Zero frontend changes required

**Non-Goals:**
- Do not change price field type (String → Float) — separate concern
- Do not add caching layer — separate concern
- Do not migrate to cursor-based pagination — overkill for current scale
- Do not refactor the route handler structure

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Scope | Single line change (`skip: 0` → `skip`) | Minimal risk, easy to review, immediate fix |
| Not using the `skip` variable was the bug | Use the correctly computed `skip` | Already calculated on line 16, just never wired in |

## Risks / Trade-offs

- [Low] If `page` or `limit` parse to `NaN` (e.g., `page=abc`), `skip` becomes `NaN` and Prisma will likely throw or return empty. This is unchanged from current behavior — the parsing on line 14-16 already has this risk.
