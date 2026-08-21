## Why

Proveer un endpoint de prueba para validar que los hooks de Husky funcionan correctamente en el pipeline de pre-commit luego de una corrección exitosa.

## What Changes

- Agregar un nuevo endpoint GET `/api/husky-success` que responda con el mensaje "Prueba Husky success"
- El endpoint no requiere autenticación
- El endpoint retorna JSON: `{ success: true, data: { message: "Prueba Husky success" } }`

## Capabilities

### New Capabilities
- `husky-success`: Endpoint público de prueba para verificar corrección de Husky

### Modified Capabilities
<!-- None -->

## Impact

- **Backend**: `backend/src/routes/husky-success.ts` — nuevo archivo
- **Backend**: `backend/src/index.ts` — registrar nueva ruta

## Riesgos
- **Riesgo 1**: Path `/api/husky-success` podría conflictuar con rutas futuras
  - **Mitigación**: Path suficientemente específico

Complejidad: Baja | Migración BD: No