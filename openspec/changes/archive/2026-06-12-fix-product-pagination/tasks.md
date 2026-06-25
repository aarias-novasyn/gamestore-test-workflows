## 1. Fix Pagination Offset

- [x] 1.1 Change `skip: 0` to `skip` in the product listing query at `backend/src/routes/products.ts:47`

## 2. Verify

- [x] 2.1 Start the backend and confirm `GET /api/products?page=2&limit=10` returns different products than page 1
- [x] 2.2 Confirm `total` and `totalPages` values remain correct
