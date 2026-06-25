## 1. Backend — Fix duplicate items in cart

- [x] 1.1 Modify `backend/src/routes/cart.ts`: replace `prisma.cartItem.create()` with `prisma.cartItem.update()` in the `if (existingItem)` block, adding `existingItem.quantity + quantity`
