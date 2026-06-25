# Sesión 9: Cambios Paralelos y Conflictos (3 horas)

## Objetivos de la sesión
- Crear dos cambios que modifiquen el **mismo requirement** del spec `auth/spec.md`.
- Implementar **solo uno** de los cambios.
- Detectar el conflicto durante el archive.
- Resolver el conflicto manualmente (actualizando el delta del segundo cambio).
- Archivar ambos cambios exitosamente.

---

## Actividad 1: Teoría - Conflictos en cambios paralelos (15 min)

### ¿Cuándo hay conflicto?
Dos cambios tienen conflicto si **modifican el mismo requirement** (no solo el mismo archivo).

### ¿Cómo detecta OpenSpec el conflicto?
Durante `/opsx:bulk-archive` / `/opsx:archive`.

### Estrategias de resolución
| Caso                               | Solución                                           |
| ---------------------------------- | -------------------------------------------------- |
| Un cambio implementado, el otro no | Descartar el no implementado o actualizar su delta |
| Ambos implementados, compatibles   | OpenSpec puede fusionar automáticamente            |
| Ambos implementados, incompatibles | Resolver manual: editar uno de los deltas          |

---

## Actividad 2: Crear Cambio A - `update-session-1hour` (30 min)

### 2.1 Crear el cambio

```
/opsx:propose update-session-1hour
```

### 2.2 Verificar el delta spec generado

```bash
cat openspec/changes/update-session-1hour/specs/auth/spec.md
```

**Debe tener:**
```markdown
## MODIFIED Requirements

### Requirement: Session Persistence
The system SHALL maintain session for 60 minutes of inactivity.
```

Si no es así, edítalo manualmente.

### 2.3 Verificar el estado

```bash
openspec status --change update-session-1hour
```

---

## Actividad 3: Crear Cambio B - `update-session-30min` (30 min)

### 3.1 Crear el cambio

```
/opsx:propose update-session-30min
```

### 3.2 Editar el delta spec para que también modifique `Session Persistence`

```bash
code openspec/changes/update-session-30min/specs/auth/spec.md
```

Reemplaza el contenido con:

```markdown
# Delta for Auth

## MODIFIED Requirements

### Requirement: Session Persistence
The system SHALL maintain session for 30 minutes of inactivity.

#### Scenario: Inactivity timeout
- GIVEN an authenticated user
- WHEN 30 minutes pass without activity
- THEN the session expires
```

### 3.3 Verificar que ambos cambios están activos

```bash
openspec list --changes
```

**Salida:**
```
Active changes:
  update-session-1hour
  update-session-30min
```

---

## Actividad 4: Implementar solo el Cambio A (30 min)

### 4.1 Implementar `update-session-1hour`

```
/opsx:apply update-session-1hour
```

### 4.2 Verificar que el Cambio A está completo

```bash
openspec status --change update-session-1hour
```

### 4.3 NO implementar el Cambio B

---

## Actividad 5: Intentar archivar y detectar conflicto (30 min)

### 5.1 Archivar el Cambio A (implementado)

```
/opsx:archive update-session-1hour
```

Responde `Y`.

### 5.2 Intentar archivar el Cambio B (no implementado)

```
/opsx:archive update-session-30min
```

**Interacción esperada:**
```
AI: Archiving update-session-30min...
     ⚠️ WARNING: Main spec already has Session Persistence with 60 minutes.
     The implementation in code reflects 60 minutes, not 30.
     
     Do you want to update this change's delta to match the current spec? (Y/n)
```

**Responde:** `Y`

```
AI: Updated delta spec to 60 minutes.
     ✓ Synced (no changes, already up to date)
     ✓ Moved to archive/YYYY-MM-DD-update-session-30min/
```

### 5.3 Explicación

OpenSpec detectó que el código implementa 60 minutos (del Cambio A), por lo que el delta de 30 minutos es incorrecto. Ofrece actualizarlo automáticamente.

---

## Actividad 6: Resolución manual alternativa (30 min)

### 6.1 Editar manualmente el delta del Cambio B

```bash
code openspec/changes/update-session-30min/specs/auth/spec.md
```

Cambia `30 minutes` por `60 minutes` en todo el archivo.

### 6.2 Validar el cambio modificado

```bash
openspec validate update-session-30min
```

### 6.3 Archivar nuevamente

```
/opsx:archive update-session-30min --yes
```

---

## Actividad 7: Verificar resultados finales (15 min)

### 7.1 Ver que ambos cambios están en archive

```bash
ls openspec/changes/archive/ | grep update-session
```

### 7.2 Ver spec principal actualizado

```bash
cat openspec/specs/auth/spec.md | grep -A 10 "Session Persistence"
```

Debe mostrar **60 minutes** (el valor del Cambio A).

### 7.3 Listar cambios activos (debe estar vacío)

```bash
openspec list --changes
```
