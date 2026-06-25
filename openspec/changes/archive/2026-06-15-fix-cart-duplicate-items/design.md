## Context

El endpoint `POST /api/cart/add` en `backend/src/routes/cart.ts` detecta si un producto ya existe en el carrito (línea 48-50) pero en lugar de actualizar la cantidad del registro existente, crea una nueva fila en la tabla `CartItem`. Esto resulta en items duplicados visibles en la UI.

## Goals / Non-Goals

**Goals:**
- Al agregar un producto que ya está en el carrito, incrementar la cantidad en el registro existente
- Mantener la misma estructura de respuesta de la API
- No perder items ni cantidades existentes

**Non-Goals:**
- No se modifica el schema de BD
- No se modifica el frontend
- No se agrega validación de stock (queda para otro cambio)

## Decisions

| Decisión | Opción | Resultado |
|---|---|---|
| Actualizar item existente | `prisma.cartItem.create()` (actual) → `prisma.cartItem.update()` | Se reemplaza el `create()` en el bloque `if (existingItem)` con un `update()` que suma `existingItem.quantity + quantity` |
| Ubicación del cambio | Un solo bloque condicional en `routes/cart.ts:52-60` | Cambio mínimo y localizado, sin efecto en otras rutas |

## Risks / Trade-offs

- **Concurrencia**: Si dos requests llegan casi simultáneamente para el mismo producto, ambos pueden leer `existingItem` antes de que el otro haga update → la segunda sobreescribe en vez de sumar. Para un workshop esto es aceptable; en producción se resolvería con transacciones optimistas o un `updateMany` con incremento atómico.
- **Cantidad mínima**: No se valida que `quantity > 0` antes de sumar — si el cliente envía 0 o negativo, la cantidad podría decrecer o quedar en 0. El frontend actual no envía estos valores.
