## Why

The products listing endpoint has a pagination bug: requesting `page=2` (or any page beyond 1) returns the same results as `page=1`. The `skip` offset is hardcoded to `0` instead of using the calculated value. Users browsing the catalog see only the first 10 products regardless of which page they navigate to.

## What Changes

- Fix the hardcoded `skip: 0` to use the calculated `skip` variable in the product listing Prisma query
- No API contract changes — response shape, status codes, and query params remain identical

## Capabilities

### New Capabilities

None — pure bug fix with no new functionality.

### Modified Capabilities

None — no requirement changes, only an implementation error corrected.

## Impact

- Single line change in `backend/src/routes/products.ts` (line 47: `skip: 0` → `skip`)
- Frontend pagination UI begins working correctly without any frontend changes
