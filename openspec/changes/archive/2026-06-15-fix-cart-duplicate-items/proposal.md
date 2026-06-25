## Why

Al agregar un producto que ya existe en el carrito, el backend crea una nueva fila en `CartItem` en lugar de incrementar la cantidad del item existente. Esto produce items duplicados en la interfaz y una experiencia de usuario incorrecta.

## What Changes

- Modificar el endpoint `POST /api/cart/add` para que detecte items existentes y actualice su cantidad (sumando la nueva cantidad) en vez de crear un registro duplicado
- No hay cambios en API pública ni cambios breaking

## Capabilities

### New Capabilities
- `cart`: Gestión del carrito de compras — agregar items, actualizar cantidades, eliminar items, calcular total

### Modified Capabilities

_(Ninguna — es una nueva capability)_

## Impact

- **Archivo modificado:** `backend/src/routes/cart.ts`
- **No requiere cambios en BD:** El schema de Prisma ya soporta `update` en `CartItem`
- **No requiere cambios en frontend:** La API response se mantiene idéntica
