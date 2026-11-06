## Context

Endpoint de prueba para validar hooks de Husky luego de corrección exitosa.

## Goals / Non-Goals

**Goals:**
- Endpoint GET `/api/husky-success` que retorna "Prueba Husky success"
- Sin autenticación, respuesta JSON estándar

**Non-Goals:**
- Sin persistencia, sin nuevas dependencias

## Decisions

| Decisión | Alternativas | Por qué |
|---|---|---|
| Nuevo archivo `routes/husky-success.ts` | Ruta existente | Separación limpia |
| Endpoint público | Requerir JWT | Health check, sin auth |

## Archivos

- **Nuevo**: `backend/src/routes/husky-success.ts`
- **Modificado**: `backend/src/index.ts`