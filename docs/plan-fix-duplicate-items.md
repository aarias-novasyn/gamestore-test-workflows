# Plan: Items duplicados en el carrito

## Bug

Cuando se agrega un producto que ya existe en el carrito, se crea una **nueva fila** en `CartItem` en lugar de incrementar la cantidad del item existente.

## Ubicación

`backend/src/routes/cart.ts:52-60`

## Código actual

```typescript
if (existingItem) {
  await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity
    }
  });
}
```

## Problema

`prisma.cartItem.create()` inserta un registro duplicado en la BD. Si el usuario agrega el mismo producto dos veces, aparecen dos líneas separadas en el carrito, cada una con cantidad 1, en vez de una sola línea con cantidad 2.

## Corrección

Reemplazar el `create()` con un `update()` que sume la cantidad nueva a la existente:

```typescript
if (existingItem) {
  await prisma.cartItem.update({
    where: { id: existingItem.id },
    data: { quantity: existingItem.quantity + quantity }
  });
}
```

## Impacto

- Archivo modificado: `backend/src/routes/cart.ts`
- No requiere cambios en BD (Prisma schema ya soporta `update`)
- No requiere cambios en frontend
