## Context

Actualmente los cambios completados en OpenSpec permanecen en el directorio `openspec/changes/`. OpenSpec provee el comando `openspec archive change` para mover cambios completados a `openspec/changes/archive/`. Este cambio prueba el flujo completo de archivado usando el cambio `fix-session-timeout` como sujeto de prueba.

## Goals / Non-Goals

**Goals:**
- Ejecutar `openspec archive change fix-session-timeout` correctamente
- Verificar que el cambio se mueve a `openspec/changes/archive/` con todos sus artefactos
- Verificar que el cambio ya no aparece en `openspec list --changes`

**Non-Goals:**
- No se modifica ningún código de backend o frontend
- No se implementa ninguna funcionalidad nueva en GameStore

## Decisions

| Decisión | Alternativas | Por qué |
|---|---|---|
| Usar `fix-session-timeout` como sujeto de prueba | Crear un cambio dummy | Ya está completado y validado, es el candidato ideal para archivado |
| Verificar con `openspec list --changes` después del archivado | Revisar manualmente el filesystem | El CLI es la interfaz oficial y debe reflejar el estado correcto |

## Flujo de Archivado

```ascii
1. Validar que fix-session-timeout existe y está completado
2. Ejecutar: openspec archive change fix-session-timeout
3. Verificar: openspec list --changes (no debe aparecer fix-session-timeout)
4. Verificar: ls openspec/changes/archive/ (debe contener fix-session-timeout)
5. Verificar: los artefactos del cambio están intactos
```

## Risks / Trade-offs

- **[Riesgo 1]**: El comando `openspec archive change` podría no existir o tener una sintaxis diferente
  - **Mitigación**: Consultar `openspec archive --help` antes de ejecutar
- **[Riesgo 2]**: El cambio `fix-session-timeout` ya fue archivado previamente
  - **Mitigación**: Verificar con `openspec list --changes` antes de archivar