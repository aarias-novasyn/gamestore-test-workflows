# Sesión 11: Schemas Personalizados – Creación y Forkeo (3 horas)

## Objetivos de la sesión
- Comprender qué es un schema y cómo se estructura.
- Forkear el schema `spec-driven` a `gamestore-schema`.
- Agregar un nuevo artefacto personalizado (`security-review`) al schema forkeado.
- Crear un schema desde cero (`rapid-workflow`) con solo `proposal` y `tasks`.
- Validar los schemas y probarlos con cambios de prueba.

---

## Actividad 1: Teoría - ¿Qué es un schema? (20 min)

### Definición
Un **schema** es la receta que define:
- Qué artefactos tiene un cambio.
- Cómo dependen entre sí (`requires`).
- Qué templates usar y qué instrucciones adicionales dar a la IA.

### Estructura de un schema
```yaml
name: mi-schema
version: 1
description: Descripción

artifacts:
  - id: proposal
    generates: proposal.md
    requires: []
  - id: design
    generates: design.md
    requires: [proposal]
  - id: tasks
    generates: tasks.md
    requires: [design]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### Comandos útiles
```bash
openspec schemas                     # Listar disponibles
openspec schema fork <source> <dest> # Copiar existente
openspec schema init <nombre>        # Crear desde cero
openspec schema validate <nombre>    # Validar
```

---

## Actividad 2: Forkear `spec-driven` → `gamestore-schema` (30 min)

### 2.1 Ver schemas disponibles

```bash
openspec schemas
```

### 2.2 Ejecutar el fork

```bash
openspec schema fork spec-driven gamestore-schema
```

**Salida esperada:**
```
✓ Copied schema 'spec-driven' to 'gamestore-schema'
  Location: openspec/schemas/gamestore-schema/
```

### 2.3 Explorar la estructura

```bash
ls -la openspec/schemas/gamestore-schema/
tree openspec/schemas/gamestore-schema/  # si tienes tree
cat openspec/schemas/gamestore-schema/schema.yaml
```

### 2.4 Verificar que el schema se reconoce

```bash
openspec schemas | grep gamestore
```

---

## Actividad 3: Agregar artefacto `security-review` al schema (30 min)

### 3.1 Editar `schema.yaml`

```bash
code openspec/schemas/gamestore-schema/schema.yaml
```

Reemplaza el contenido con:

```yaml
name: gamestore-schema
version: 1
description: GameStore workflow with security review

artifacts:
  - id: proposal
    generates: proposal.md
    template: proposal.md
    requires: []

  - id: specs
    generates: specs/**/*.md
    template: specs.md
    requires: [proposal]

  - id: design
    generates: design.md
    template: design.md
    requires: [proposal]

  - id: security-review
    generates: security-review.md
    description: Security review checklist
    template: security-review.md
    requires: [design]

  - id: tasks
    generates: tasks.md
    template: tasks.md
    requires: [specs, design, security-review]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### 3.2 Crear el template para `security-review`

```bash
cat > openspec/schemas/gamestore-schema/templates/security-review.md << 'EOF'
# Security Review

## Authentication & Authorization
- [ ] ¿Los nuevos endpoints requieren autenticación?
- [ ] ¿Se verifican roles (ADMIN vs USER)?

## Input Validation
- [ ] ¿Se validan todos los inputs del usuario?
- [ ] ¿Se previene SQL injection (usando Prisma)?

## Data Protection
- [ ] ¿Se almacenan contraseñas hasheadas (bcrypt)?
- [ ] ¿Se evita loguear información sensible?

## Rate Limiting
- [ ] ¿Se implementó rate limiting en endpoints públicos?

## Checklist Summary
- Critical issues: ___
- High issues: ___
- Medium issues: ___
- Low issues: ___

## Aprobación
- [ ] Seguridad: _____ (nombre)
- [ ] Equipo: _____ (nombre)
EOF
```

### 3.3 Validar el schema modificado

```bash
openspec schema validate gamestore-schema
```

**Salida esperada:** `✓ Schema 'gamestore-schema' is valid`

### 3.4 Probar el nuevo schema con un cambio de prueba

```bash
openspec new change test-security --schema gamestore-schema
openspec status --change test-security
```

```bash
rm -rf openspec/changes/test-security
```

---

## Actividad 4: Crear schema desde cero `rapid-workflow` (30 min)

### 4.1 Inicializar nuevo schema

```bash
openspec schema init rapid-workflow \
  --description "Rapid iteration without design and specs" \
  --artifacts proposal,tasks
```

**Salida esperada:**
```
✓ Created schema 'rapid-workflow' at openspec/schemas/rapid-workflow/
```

### 4.2 Ver la estructura

```bash
cat openspec/schemas/rapid-workflow/schema.yaml
```

### 4.3 Personalizar los templates (opcional)

```bash
code openspec/schemas/rapid-workflow/templates/proposal.md
```

Reemplaza con:

```markdown
# [Nombre del cambio]

## What
<!-- Describe what needs to be done in 1-2 sentences -->

## Why
<!-- Business reason -->

## Quick Plan
- [ ] Step 1
- [ ] Step 2
- [ ] Step 3

## Time Estimate
<!-- Hours -->
```

### 4.4 Validar el nuevo schema

```bash
openspec schema validate rapid-workflow
```

### 4.5 Probar con un cambio rápido

```bash
openspec new change test-rapid --schema rapid-workflow
/opsx:ff test-rapid
ls openspec/changes/test-rapid/
```

```bash
rm -rf openspec/changes/test-rapid
```

---

## Actividad 5: Validar todos los schemas (10 min)

```bash
openspec schema validate
openspec schema which --all
```

**Salida esperada:**
```
spec-driven (package)
gamestore-schema (project)
rapid-workflow (project)
```

---

## Actividad 6: Comparar flujos y casos de uso (25 min)

### 6.1 Tabla comparativa

| Schema             | Artefactos                                          | Cuándo usar                           |
| ------------------ | --------------------------------------------------- | ------------------------------------- |
| `spec-driven`      | proposal, specs, design, tasks                      | Features completas, estándar          |
| `gamestore-schema` | proposal, specs, design, **security-review**, tasks | Proyectos con requisitos de seguridad |
| `rapid-workflow`   | proposal, tasks                                     | Hotfixes, experimentos, prototipos    |

### 6.2 Discusión guiada

- **¿Cuándo agregarías un artefacto como `security-review`?**
- **¿Cuándo usarías `rapid-workflow`?**
- **¿Puedo mezclar schemas en diferentes cambios?**
