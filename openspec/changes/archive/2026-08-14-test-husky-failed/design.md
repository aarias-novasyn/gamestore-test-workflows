## Context

El backend de GameStore usa Express con TypeScript. Se necesita un endpoint de prueba para validar que los hooks de Husky funcionan correctamente en el pipeline de pre-commit.

## Goals / Non-Goals

**Goals:**
- Agregar endpoint GET `/api/husky-test` que retorna "Prueba Husky"
- Seguir el formato estándar de respuesta JSON: `{ success: true, data: { message: "..." } }`
- No requerir autenticación

**Non-Goals:**
- No se persiste ningún dato en base de datos
- No se agregan dependencias nuevas

## Decisions

| Decisión | Alternativas | Por qué |
|---|---|---|
| Nuevo archivo `routes/husky.ts` | Agregar a ruta existente | Separación limpia, fácil de eliminar después |
| Endpoint público sin auth | Requerir JWT | Es un health check, debe funcionar sin autenticación |

## Archivos

- **Nuevo**: `backend/src/routes/husky.ts`
- **Modificado**: `backend/src/index.ts` (registrar ruta)

## Risks / Trade-offs

- **[Riesgo 1]**: El path `/api/husky-test` podría conflictuar con rutas futuras
  - **Mitigación**: Prefijo suficientemente específico