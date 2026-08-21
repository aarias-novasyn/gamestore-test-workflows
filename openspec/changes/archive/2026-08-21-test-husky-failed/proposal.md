## Why

Proveer un endpoint de prueba para validar que el servidor backend está funcionando correctamente después de configurar hooks de Husky. Útil para verificar el pipeline de pre-commit y CI.

## What Changes

- Agregar un nuevo endpoint GET `/api/husky-test` que responda con el mensaje "Prueba Husky"
- El endpoint no requiere autenticación
- El endpoint retorna JSON con formato estándar: `{ success: true, data: { message: "Prueba Husky" } }`

## Capabilities

### New Capabilities
- `husky-test`: Endpoint público de prueba para verificar configuración de Husky

### Modified Capabilities
<!-- No existing capabilities are being modified -->

## Impact

- **Backend**: `backend/src/routes/husky.ts` — nuevo archivo con el endpoint
- **Backend**: `backend/src/index.ts` — registrar la nueva ruta
- **Frontend**: Sin impacto
- **Database**: Sin impacto

## Riesgos

- **Riesgo 1**: El endpoint podría interferir con rutas existentes
  - **Mitigación**: Usar un path único `/api/husky-test` que no coincide con rutas existentes

Complejidad: Baja
Migración de BD: No requiere