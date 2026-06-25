# Sesión 7: Fast‑Forward y Bulk Archive (3 horas)

## Objetivos de la sesión
- Usar `/opsx:new` + `/opsx:ff` para crear cambios pequeños de forma rápida.
- Implementar cambios simples con `/opsx:apply`.
- Archivar **varios cambios a la vez** con `/opsx:bulk-archive`.
- Manejar conflictos simples entre cambios (si ocurren).
- Comprender cuándo usar bulk archive vs archive individual.

---

## Actividad 1: Teoría - `ff` y `bulk-archive` (15 min)

### Fast‑forward (`/opsx:ff`)
- Crea **todos los artefactos de planificación** de una sola vez (proposal, specs, design, tasks).
- Requiere haber creado el scaffold con `/opsx:new`.
- Ideal para cambios pequeños y bien entendidos.

### Bulk Archive (`/opsx:bulk-archive`)
- Archiva **múltiples cambios completados** en un solo comando.
- Detecta conflictos entre cambios.
- Archiva en orden cronológico.

**Nota:** `bulk-archive` solo archiva cambios que tengan todas las tareas completadas (`tasks.md` sin `[ ]`).

---

## Actividad 2: Crear tres cambios pequeños (30 min)

### 2.1 Cambio 1: `add-logout-button`

```
/opsx:new add-logout-button
/opsx:ff add-logout-button
```

Verificar:
```bash
ls openspec/changes/add-logout-button/
```

### 2.2 Cambio 2: `fix-price-filter`

```
/opsx:new fix-price-filter
/opsx:ff fix-price-filter
```

### 2.3 Cambio 3: `improve-error-messages`

```
/opsx:new improve-error-messages
/opsx:ff improve-error-messages
```

### 2.4 Listar los cambios activos

```bash
openspec list --changes
```

**Salida esperada:**
```
Active changes:
  add-logout-button
  fix-price-filter
  improve-error-messages
```

---

## Actividad 3: Implementar los tres cambios (60 min)

### 3.1 Implementar `add-logout-button`

```
/opsx:apply add-logout-button
```

### 3.2 Implementar `fix-price-filter`

```
/opsx:apply fix-price-filter
```

### 3.3 Implementar `improve-error-messages`

```
/opsx:apply improve-error-messages
```

### 3.4 Verificar que todos tienen las tareas completas

```bash
for change in add-logout-button fix-price-filter improve-error-messages; do
  echo "=== $change ==="
  grep -c "\[ \]" openspec/changes/$change/tasks.md
done
```

Debe mostrar `0` para los tres.

---

## Actividad 4: Bulk Archive (30 min)

### 4.1 Ejecutar bulk archive

```
/opsx:bulk-archive
```

**Interacción esperada:**
```
AI: Found 3 completed changes:
     - add-logout-button (tasks complete)
     - fix-price-filter (tasks complete)
     - improve-error-messages (tasks complete)

     Checking for spec conflicts...
     ✓ No conflicts detected (changes touch different domains)

     Changes will be archived in creation order:
     1. add-logout-button
     2. fix-price-filter
     3. improve-error-messages

     Archive all 3 changes? (Y/n)
```

Responde: `Y`

### 4.2 Verificar que no hay cambios activos

```bash
openspec list --changes
```

### 4.3 Ver los cambios en el archivo

```bash
ls openspec/changes/archive/ | grep -E "add-logout|fix-price|improve-error"
```

---

## Actividad 5: Verificar resultados (30 min)

### 5.1 Ver especificaciones actualizadas

```bash
cat openspec/specs/auth/spec.md | grep -A 5 "Logout"
cat openspec/specs/catalog/spec.md | grep -A 10 "Price Filter"
cat openspec/specs/auth/spec.md | grep -A 5 "error message"
```

### 5.2 Validar todas las especificaciones

```bash
openspec validate --specs
```

### 5.3 Simular un conflicto (opcional)

```bash
/opsx:new change-a
/opsx:new change-b
```

Edita sus delta specs para modificar el mismo requirement. Luego implementa solo uno y ejecuta `bulk-archive` para ver cómo detecta el conflicto.
