# Sesión 6: Workflow expandido – Creación e implementación de `fix-pagination` (3 horas)

## Objetivos de la sesión
- Habilitar el perfil expandido de OpenSpec (comandos `new`, `continue`, `ff`, `verify`, `sync`, `bulk-archive`, `onboard`).
- Crear un cambio usando `/opsx:new` y completar artefactos con `/opsx:ff` o `/opsx:continue`.
- Implementar el cambio con `/opsx:apply`.
- Verificar y archivar el cambio dentro de la misma sesión.

---

## Actividad 1: Habilitar el perfil expandido (20 min)

### 1.1 Verificar perfil actual

```bash
openspec config get profile
```

### 1.2 Cambiar a perfil custom con todos los workflows

```bash
openspec config profile
```

**Interacción esperada:**
```
Current configuration:
  Profile: core
  Delivery: both
  Selected workflows: propose, explore, apply, archive

What would you like to change?
  1) Change delivery + workflows
  2) Change delivery only
  3) Change workflows only
  4) Keep current settings

Select option: 3
```

Selecciona los workflows marcando con espacio: `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`.

**Confirmar:**
```
✓ Updated global config
  Profile: custom
  Workflows: propose, explore, new, continue, apply, ff, sync, archive, bulk-archive, verify, onboard
```

### 1.3 Aplicar cambios al proyecto

```bash
openspec update
```

### 1.4 Verificar que los nuevos comandos están disponibles

```bash
ls .opencode/commands/ | grep -E "new|continue|ff"
```

---

## Actividad 2: Teoría - `new`, `continue`, `ff` (20 min)

| Comando              | Qué hace                                                      | Cuándo usar                                      |
| -------------------- | ------------------------------------------------------------- | ------------------------------------------------ |
| `/opsx:new [nombre]` | Crea solo la carpeta del cambio y el archivo `.openspec.yaml` | Quieres control granular, revisar cada artefacto |
| `/opsx:continue`     | Crea el siguiente artefacto disponible (según dependencias)   | Para revisar uno por uno                         |
| `/opsx:ff`           | Crea todos los artefactos de planificación de una vez         | Ya sabes lo que quieres, solo ejecuta            |

- `propose` = `new` + `ff` en un paso (rápido, poco control)
- `new` + `continue` = máximo control
- `new` + `ff` = balance

---

## Actividad 3: Crear cambio `fix-pagination` (30 min)

### 3.1 Crear el scaffold del cambio

```
/opsx:new fix-pagination
```

**Salida esperada:**
```
AI: Created openspec/changes/fix-pagination/
     Schema: spec-driven
     
     Ready to create: proposal
     Use /opsx:continue or /opsx:ff
```

### 3.2 Verificar el estado inicial

```bash
openspec status --change fix-pagination
```

**Salida:**
```
Change: fix-pagination
Progress: 0/4 artifacts complete
[ ] proposal (ready)
[ ] specs (blocked)
[ ] design (blocked)
[ ] tasks (blocked)
```

### 3.3 Generar todos los artefactos con `/opsx:ff`

```
/opsx:ff fix-pagination
```

**Salida esperada:**
```
AI: Fast-forwarding fix-pagination...
     ✓ Creating proposal.md
     ✓ Creating specs/catalog/spec.md (delta)
     ✓ Creating design.md
     ✓ Creating tasks.md
     All planning artifacts complete!
```

### 3.4 Explorar los artefactos generados

```bash
cat openspec/changes/fix-pagination/proposal.md | head -20
cat openspec/changes/fix-pagination/specs/catalog/spec.md
cat openspec/changes/fix-pagination/tasks.md
```

### 3.5 Editar el delta spec (opcional)

Si el delta spec no incluye la corrección del parseo, edítalo:

```bash
code openspec/changes/fix-pagination/specs/catalog/spec.md
```

---

## Actividad 4: Implementar con `/opsx:apply` (50 min)

### 4.1 Ejecutar apply

```
/opsx:apply fix-pagination
```

### 4.2 Verificar progreso en tiempo real

```bash
grep -c '\[x\]' openspec/changes/fix-pagination/tasks.md
```

### 4.3 Al finalizar, verificar que todas las tareas están `[x]`

```bash
grep "\[ \]" openspec/changes/fix-pagination/tasks.md
```

---

## Actividad 5: Verificar y archivar (30 min)

### 5.1 Ejecutar `/opsx:verify`

```
/opsx:verify fix-pagination
```

**Salida esperada:**
```
Verifying fix-pagination...
COMPLETENESS
✓ All tasks complete
CORRECTNESS
✓ Implementation matches spec
COHERENCE
✓ Design decisions followed
Ready to archive.
```

### 5.2 Archivar el cambio

```
/opsx:archive fix-pagination
```

Responde `Y` cuando pregunte.

### 5.3 Verificar que ya no está activo

```bash
openspec list --changes
```

---

## Actividad 6: Explorar resultados (20 min)

### 6.1 Ver spec principal actualizado

```bash
cat openspec/specs/catalog/spec.md | grep -A 20 "Product Pagination"
```

### 6.2 Ver cambio archivado

```bash
ls openspec/changes/archive/ | grep fix-pagination
cat openspec/changes/archive/*fix-pagination*/proposal.md | head -10
```

### 6.3 Probar manualmente la corrección (opcional)

```bash
curl "http://localhost:3001/api/products?page=1&limit=5"
curl "http://localhost:3001/api/products?page=2&limit=5"
```
