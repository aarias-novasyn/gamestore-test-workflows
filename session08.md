# Sesión 8: Verificación y Sincronización (3 horas)

## Objetivos de la sesión
- Crear un cambio `add-stock-validation` con `/opsx:propose`.
- Implementar el cambio **con errores intencionales**.
- Usar `/opsx:verify` para detectar los errores.
- Corregir los errores y volver a verificar.
- Usar `/opsx:sync` para fusionar deltas a los specs principales **sin archivar** el cambio.
- Finalmente archivar el cambio.

---

## Actividad 1: Teoría - `verify` y `sync` (15 min)

### `/opsx:verify` - tres dimensiones
| Dimensión        | Pregunta                      | Ejemplo de fallo                                  |
| ---------------- | ----------------------------- | ------------------------------------------------- |
| **Completeness** | ¿Está todo implementado?      | Task marcada `[x]` pero código no existe          |
| **Correctness**  | ¿Funciona como se especifica? | Condición de stock incorrecta                     |
| **Coherence**    | ¿Sigue el diseño?             | Usa Redis cuando el diseño decía caché en memoria |

### `/opsx:sync`
- Fusiona los delta specs con los specs principales **sin archivar** el cambio.
- El cambio sigue activo después del sync.

**Flujo de hoy:** `propose` → `apply` (con errores) → `verify` → corregir → `verify` → `sync` → `archive`

---

## Actividad 2: Crear cambio `add-stock-validation` (30 min)

### 2.1 Ejecutar `/opsx:propose`

```
/opsx:propose add-stock-validation
```

### 2.2 Verificar los artefactos generados

```bash
ls openspec/changes/add-stock-validation/
cat openspec/changes/add-stock-validation/specs/cart/spec.md
```

**El delta spec debe incluir:**
```markdown
## ADDED Requirements

### Requirement: Stock Validation
The system SHALL prevent adding out-of-stock products to cart.

#### Scenario: Product in stock
- GIVEN a product with stock = 5
- WHEN user adds 1 to cart
- THEN item is added successfully

#### Scenario: Product out of stock
- GIVEN a product with stock = 0
- WHEN user attempts to add to cart
- THEN error message "Product out of stock" is shown
- AND cart remains unchanged
```

Si no aparece, edítalo manualmente.

---

## Actividad 3: Implementar con errores intencionales (30 min)

### 3.1 Ejecutar `apply`

```
/opsx:apply add-stock-validation
```

### 3.2 Introducir errores intencionales

**Error 1: Condición de stock incorrecta (correctness)**

Abre `backend/src/routes/cart.ts` y cambia la condición de validación:

```typescript
if (!product || product.stock < 0) {   // ❌ ERROR INTENCIONAL
```

**Error 2: Marcar tareas como completas sin implementarlas (completeness)**

```bash
code openspec/changes/add-stock-validation/tasks.md
```

Marca todas las tareas como `[x]`, aunque el frontend no tenga manejo de errores.

### 3.3 Verificar que los errores están presentes

```bash
grep -n "product.stock < 0" backend/src/routes/cart.ts
grep -c "\[x\]" openspec/changes/add-stock-validation/tasks.md
```

---

## Actividad 4: Ejecutar `verify` (30 min)

### 4.1 Ejecutar verificación

```
/opsx:verify add-stock-validation
```

**Salida esperada (similar a):**
```
Verifying add-stock-validation...

COMPLETENESS
✓ All tasks in tasks.md are checked
⚠ Task "Add error handling in frontend" - no implementation found

CORRECTNESS
✗ CRITICAL: Stock validation condition is incorrect
   Spec: "stock < quantity" should reject when quantity exceeds stock
   Code: "stock < 0" → always false for stock > 0
   Location: backend/src/routes/cart.ts line 23

COHERENCE
✓ Design decisions match implementation

SUMMARY
Critical issues: 2
Ready to archive: No (fix critical issues first)
```

### 4.2 Analizar los resultados

- ¿Qué error es de completitud? (frontend error handling)
- ¿Qué error es de corrección? (condición `stock < 0`)
- ¿Qué error es de coherencia? (ninguno en este caso)

---

## Actividad 5: Corregir errores y volver a verificar (30 min)

### 5.1 Corregir condición de stock

Abre `backend/src/routes/cart.ts` y cambia la condición a la correcta:

```typescript
if (!product || product.stock < quantity) {   // ✅ CORRECTO
```

### 5.2 Agregar manejo de error en frontend (si falta)

Abre `frontend/src/components/AddToCartButton.tsx` y agrega:

```typescript
catch (error) {
  if (error.response?.status === 400 && 
      error.response?.data?.error === 'Product out of stock') {
    showError('Product out of stock - please check availability');
  } else {
    showError('Failed to add to cart');
  }
}
```

### 5.3 Volver a ejecutar `verify`

```
/opsx:verify add-stock-validation
```

**Salida esperada:**
```
COMPLETENESS: ✓
CORRECTNESS: ✓
COHERENCE: ✓
Critical issues: 0
Ready to archive: Yes
```

---

## Actividad 6: Sincronización (`sync`) sin archivar (15 min)

### 6.1 Ejecutar `sync`

```
/opsx:sync add-stock-validation
```

**Salida esperada:**
```
AI: Syncing add-stock-validation delta specs...
     ✓ ADDED: Stock Validation requirement (2 scenarios)
     ✓ openspec/specs/cart/spec.md updated
     Change remains active. Run /opsx:archive when ready.
```

### 6.2 Verificar que los specs principales se actualizaron

```bash
cat openspec/specs/cart/spec.md | grep -A 15 "Stock Validation"
```

### 6.3 Verificar que el cambio sigue activo

```bash
openspec list --changes
```

---

## Actividad 7: Archivar el cambio (15 min)

### 7.1 Archivar (ahora sí)

```
/opsx:archive add-stock-validation
```

Responde `Y` cuando pregunte.

### 7.2 Verificar que ya no está activo

```bash
openspec list --changes
```

---

## Actividad 8: Verificación final (5 min)

```bash
openspec validate --specs
cat openspec/specs/cart/spec.md | grep -A 10 "Stock Validation"
```
