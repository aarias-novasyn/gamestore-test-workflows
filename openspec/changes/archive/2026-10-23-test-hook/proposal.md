## Why

Proveer un endpoint simple de prueba para verificar que el servidor backend responde correctamente. Útil para health checks y validación del pipeline de despliegue.

## What Changes

- Agregar un nuevo endpoint GET `/api/hola` que responda con un mensaje "¡Hola, Mundo!"
- El endpoint no requiere autenticación
- El endpoint retorna JSON con formato estándar `{ success: true, data: { message: "¡Hola, Mundo!" } }`

## Capabilities

### New Capabilities
- `hello-endpoint`: Endpoint público de saludo para health checks y pruebas

### Modified Capabilities
<!-- No existing capabilities are being modified -->

## Impact

- **Backend**: `backend/src/routes/hola.ts` — nuevo archivo con el endpoint
- **Backend**: `backend/src/index.ts` — registrar la nueva ruta
- **Frontend**: Sin impacto
- **Database**: Sin impacto

## Riesgos

- **Riesgo 1**: El endpoint podría interferir con rutas existentes
  - **Mitigación**: Usar un path único `/api/hola` que no coincide con rutas existentes

Complejidad: Baja
Migración de BD: No requiere