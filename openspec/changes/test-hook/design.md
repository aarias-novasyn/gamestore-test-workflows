## Context

El backend de GameStore usa Express con TypeScript. Las rutas existentes están organizadas en `backend/src/routes/` y se registran en `backend/src/index.ts`. Se necesita un endpoint simple de prueba.

## Goals / Non-Goals

**Goals:**
- Agregar endpoint GET `/api/hola` que retorna un mensaje de saludo
- Seguir el formato estándar de respuesta JSON: `{ success: true, data: { message: "..." } }`
- No requerir autenticación

**Non-Goals:**
- No se persiste ningún dato en base de datos
- No se agregan dependencias nuevas

## Decisions

| Decisión | Alternativas | Por qué |
|---|---|---|
| Nuevo archivo `routes/hola.ts` | Agregar a `routes/auth.ts` o `routes/index.ts` | Separación limpia, fácil de eliminar después |
| Endpoint público sin auth | Requerir JWT | Es un health check, debe funcionar sin autenticación |

## Archivos

- **Nuevo**: `backend/src/routes/hola.ts`
- **Modificado**: `backend/src/index.ts` (registrar ruta)

## Risks / Trade-offs

- **[Riesgo 1]**: El path `/api/hola` podría conflictuar con rutas futuras
  - **Mitigación**: Prefijo `/api/hola` es suficientemente específico