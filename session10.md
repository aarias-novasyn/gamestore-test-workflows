# Sesión 10: Configuración Avanzada – Contexto y Reglas (3 horas)

## Objetivos de la sesión
- Comprender la estructura de `openspec/config.yaml`.
- Agregar **contexto del proyecto** (tech stack, convenciones, reglas de negocio).
- Definir **reglas específicas** para cada tipo de artefacto (proposal, specs, design, tasks).
- Verificar que la IA inyecta el contexto y las reglas al generar artefactos.
- Crear un cambio de prueba para validar la configuración.

---

## Actividad 1: Teoría - `config.yaml` (15 min)

### Ubicación y propósito
- Archivo: `openspec/config.yaml`
- Controla el comportamiento de OpenSpec en el proyecto.
- El **contexto** se inyecta en **todos** los artefactos.
- Las **reglas** se inyectan **solo** en el artefacto correspondiente.

### Estructura básica
```yaml
schema: spec-driven

context: |
  Texto libre que describe el proyecto.

rules:
  proposal:
    - Regla 1
  specs:
    - Regla para specs
  design:
    - Regla para design
  tasks:
    - Regla para tasks
```

---

## Actividad 2: Configurar contexto del proyecto (30 min)

### 2.1 Verificar si ya existe `config.yaml`

```bash
cat openspec/config.yaml
```

Si no existe, créalo vacío:
```bash
touch openspec/config.yaml
```

### 2.2 Editar el archivo con el siguiente contenido

```bash
code openspec/config.yaml
```

Pega exactamente este contenido:

```yaml
# OpenSpec Project Configuration for GameStore

schema: spec-driven

context: |
  # GameStore - E-commerce de videojuegos
  
  ## Tech Stack
  - Backend: Node.js 20 + Express + TypeScript + Prisma ORM + SQLite
  - Frontend: React 18 + TypeScript + Vite + TailwindCSS
  - Auth: JWT con refresh tokens (HTTP-only cookie)
  - Testing: Jest (backend) + React Testing Library (frontend)
  
  ## Convenciones de código
  - Usar ES modules (import/export, no require)
  - Preferir async/await sobre callbacks
  - Todas las API endpoints devuelven JSON: { success: boolean, data?: any, error?: string }
  
  ## Reglas de negocio
  - Los productos deben validar stock antes de agregar al carrito
  - Las sesiones expiran después de 60 minutos de inactividad
  - Solo usuarios con rol ADMIN pueden modificar productos
  
  ## Bugs conocidos (aún no corregidos)
  - Contraseñas en texto plano (security)
  - No hay rate limiting en login
  - El panel de admin es accesible para cualquier usuario autenticado
```

### 2.3 Guardar y verificar

```bash
cat openspec/config.yaml | head -20
```

---

## Actividad 3: Configurar reglas por artefacto (30 min)

### 3.1 Agregar reglas al `config.yaml`

Agrega al final (después del `context:`):

```yaml
rules:
  proposal:
    - "Incluir una sección 'Impacto' que enumere los componentes afectados (backend, frontend, db)"
    - "Incluir una sección 'Riesgos' con al menos un riesgo y su mitigación"
    - "Estimar complejidad: Baja/Media/Alta"
    - "Mencionar si requiere migración de base de datos"
  
  specs:
    - "Cada requirement DEBE tener al menos un escenario con formato Given/When/Then"
    - "Incluir escenarios de error (ej. producto sin stock, usuario no autorizado)"
    - "Usar SHALL para requisitos obligatorios, SHOULD para recomendados"
    - "Referenciar requisitos existentes si se modifican"
  
  design:
    - "Incluir una tabla de 'Decisiones de Arquitectura' con columnas: Decisión, Alternativas, Por qué"
    - "Agregar un diagrama de flujo para procesos con más de 3 pasos (usar texto o arte ASCII)"
    - "Listar todos los archivos nuevos y modificados"
    - "Incluir consideraciones de seguridad y rendimiento"
  
  tasks:
    - "Agrupar tareas por capa (Backend, Frontend, Database, Testing)"
    - "Cada tarea debe tener un ID jerárquico (1.1, 1.2, 2.1, etc.)"
    - "Estimar tiempo por tarea (máximo 2 horas)"
    - "Incluir tareas de verificación y pruebas"
```

### 3.2 Verificar la sintaxis YAML

```bash
python3 -c "import yaml; yaml.safe_load(open('openspec/config.yaml'))"
echo "✓ Sintaxis YAML válida"
```

### 3.3 Ver el archivo completo

```bash
cat openspec/config.yaml
```

---

## Actividad 4: Verificar inyección con `openspec instructions` (15 min)

### 4.1 Crear un cambio temporal

```
/opsx:propose temp-for-instructions
```

### 4.2 Ver las instrucciones que recibiría la IA para un `proposal`

```bash
openspec instructions proposal --change temp-for-instructions
```

### 4.3 Ver para otros artefactos

```bash
openspec instructions specs --change temp-for-instructions
openspec instructions design --change temp-for-instructions
openspec instructions tasks --change temp-for-instructions
```

### 4.4 Limpiar el cambio temporal

```bash
rm -rf openspec/changes/temp-for-instructions
```

---

## Actividad 5: Crear cambio de prueba `test-config` (30 min)

### 5.1 Crear un cambio para validar la configuración

```
/opsx:propose test-config
```

### 5.2 Explorar los artefactos generados

```bash
cat openspec/changes/test-config/proposal.md
cat openspec/changes/test-config/specs/*/spec.md
cat openspec/changes/test-config/design.md
cat openspec/changes/test-config/tasks.md
```

### 5.3 Verificar que las reglas se aplicaron

| Regla                               | ¿Aparece en el artefacto? |
| ----------------------------------- | ------------------------- |
| Proposal: sección "Impacto"         | [ ] Sí / [ ] No           |
| Proposal: sección "Riesgos"         | [ ] Sí / [ ] No           |
| Proposal: estimación de complejidad | [ ] Sí / [ ] No           |
| Specs: Given/When/Then              | [ ] Sí / [ ] No           |
| Specs: escenarios de error          | [ ] Sí / [ ] No           |
| Design: tabla de decisiones         | [ ] Sí / [ ] No           |
| Design: diagrama de flujo           | [ ] Sí / [ ] No           |
| Tasks: IDs jerárquicos              | [ ] Sí / [ ] No           |
| Tasks: agrupación por capa          | [ ] Sí / [ ] No           |

---

## Actividad 6: Ajustes y refinamiento (15 min)

### 6.1 Si alguna regla no se aplicó, reforzar en el `config.yaml`

```yaml
rules:
  proposal:
    - "DEBE incluir una sección '## Riesgos' con al menos dos riesgos potenciales y sus mitigaciones (no opcional)"
```

### 6.2 Validar nuevamente con otro cambio de prueba

```
/opsx:propose test-config-2
```

### 6.3 Comparar la calidad de los artefactos

```bash
diff openspec/changes/test-config/proposal.md openspec/changes/test-config-2/proposal.md
```

---

## Actividad 7: Limpiar cambios de prueba

```bash
rm -rf openspec/changes/test-config
rm -rf openspec/changes/test-config-2
```
