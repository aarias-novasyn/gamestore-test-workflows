## Why

Validar que el flujo de archivado de OpenSpec funciona correctamente. Actualmente hay cambios completados que ocupan espacio en el directorio `openspec/changes/` y deberían archivarse para mantener el workspace ordenado.

## What Changes

- Archivar el cambio `fix-session-timeout` usando el comando `openspec archive change`
- Verificar que el cambio se mueve correctamente a `openspec/changes/archive/`
- Verificar que el cambio archivado mantiene todos sus artefactos

## Capabilities

### New Capabilities
- `auto-archive`: Flujo de archivado automático de cambios completados en OpenSpec

### Modified Capabilities
<!-- No existing capabilities are being modified -->

## Impact

- **OpenSpec**: Prueba del comando `openspec archive change` y su integración con el workspace
- **Backend**: Sin impacto
- **Frontend**: Sin impacto
- **Database**: Sin impacto

## Riesgos

- **Riesgo 1**: El cambio no existe o ya fue archivado
  - **Mitigación**: Verificar existencia del cambio antes de ejecutar el comando
- **Riesgo 2**: El comando de archivado falla por permisos
  - **Mitigación**: Verificar permisos de escritura en `openspec/changes/archive/`

Complejidad: Baja
Migración de BD: No requiere