# Sesión 13: Multi‑idioma y Configuración Global (3 horas)

## Objetivos de la sesión
- Configurar el idioma de generación de artefactos mediante el archivo `openspec/config.yaml` (español, portugués, etc.).
- Entender la diferencia entre configuración global del usuario y configuración del proyecto.
- Explorar los comandos de configuración global: `list`, `get`, `set`, `edit`, `profile`.
- Probar la generación de artefactos en diferentes idiomas.
- (Opcional) Configurar el autocompletado de shell para el CLI de OpenSpec.

---

## Actividad 1: Teoría – configuración global vs proyecto (15 min)

### Jerarquía de configuración
1. **CLI flags** (mayor prioridad): `--schema`, `--no-color`, etc.
2. **Change metadata** (`.openspec.yaml` en el directorio del cambio).
3. **Configuración del proyecto** (`openspec/config.yaml`). Se versiona con el código.
4. **Configuración global del usuario** (`~/.config/openspec/config.json`). NO se versiona.
5. **Valores por defecto** (`core` profile con `delivery: both`).

### ¿Qué se puede configurar?
| Configuración           | Dónde               | Propósito                                       |
|-------------------------|---------------------|-------------------------------------------------|
| Idioma                  | `config.yaml` (proyecto) | Generar artefactos en español, portugués, etc. |
| Perfil (core/custom)    | Global (`config profile`) | Controlar qué comandos de workflow están disponibles |
| Modo de entrega         | Global (`config profile`) | `skills`, `commands`, o `both`                  |
| Workflows seleccionados | Global (`config profile`) | `propose`, `new`, `apply`, etc.                |

---

## Actividad 2: Configurar idioma español en `config.yaml` (30 min)

**Importante:** No existe el comando `openspec config set language`. La configuración de idioma se hace únicamente en el campo `context` del archivo `openspec/config.yaml`.

### 2.1 Abrir el archivo de configuración del proyecto

```bash
code openspec/config.yaml
```

### 2.2 Agregar instrucción de idioma español

Agrega al final del bloque `context`:

```yaml
context: |
  Idioma: Español
  Todos los artefactos deben escribirse en español.
  Términos técnicos (API, endpoint, middleware, schema) mantenlos en inglés.
  Nombres de variables, funciones y archivos siempre en inglés.
```

### 2.3 Verificar sintaxis YAML

```bash
python3 -c "import yaml; yaml.safe_load(open('openspec/config.yaml'))"
echo "✓ Sintaxis YAML válida"
```

### 2.4 Probar generación de artefactos en español

```
/opsx-propose test-spanish
```

```bash
cat openspec/changes/test-spanish/proposal.md | head -15
```

**Salida esperada:** `# Propuesta: test-spanish` (no `# Proposal`).

### 2.5 Archivar el cambio de prueba

```
/opsx-archive test-spanish --yes
```

---

## Actividad 3: Explorar comandos de configuración global (30 min)

### 3.1 Ver ubicación del archivo global

```bash
openspec config path
```

### 3.2 Listar toda la configuración actual

```bash
openspec config list
```

### 3.3 Obtener un valor específico

```bash
openspec config get profile
openspec config get delivery
```

### 3.4 Establecer valores adicionales

```bash
openspec config set telemetry.enabled false --allow-unknown
```

### 3.5 Eliminar una clave

```bash
openspec config unset user.name
```

### 3.6 Editar la configuración global con el editor

```bash
openspec config edit
```

### 3.7 Restablecer a valores predeterminados (solo si es necesario)

```bash
openspec config reset --all --yes
```

**⚠️ Borra toda la configuración global.**

---

## Actividad 4: Cambiar a portugués y probar (30 min)

### 4.1 Editar `config.yaml` y cambiar idioma a portugués

```yaml
context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
  Keep technical terms (API, endpoint, middleware, schema) in English.
  Code names (variables, functions, files) always in English.
```

### 4.2 Crear un cambio de prueba en portugués

```
/opsx-propose test-portuguese
```

```bash
cat openspec/changes/test-portuguese/proposal.md | head -15
```

**Salida esperada:** `# Proposta: test-portuguese` (o `# Proposta` con contenido en portugués).

### 4.3 Archivar cambio de prueba

```
/opsx-archive test-portuguese --yes
```

### 4.4 Volver a español (si se prefiere)

```bash
code openspec/config.yaml
```

Revertir el idioma.

---

## Actividad 5: Configurar perfil de workflows (`core` / `custom`) (30 min)

### 5.1 Ver perfil actual y modo de entrega

```bash
openspec config get profile
openspec config get delivery
```

### 5.2 Abrir el asistente interactivo

```bash
openspec config profile
```

### 5.3 Modificar perfil sin modo interactivo

```bash
openspec config profile core
openspec config profile custom
```

### 5.4 Aplicar cambios al proyecto

```bash
openspec update
```

---

## Actividad 6: (Opcional) Configurar autocompletado de shell (15 min)

### 6.1 Instalar autocompletado para la shell actual

```bash
openspec completion install
```

### 6.2 Instalar para una shell específica

```bash
openspec completion install zsh
openspec completion install bash
openspec completion install fish
```

### 6.3 Verificar que funciona

Escribe `openspec ` en la terminal y presiona `TAB`.

---

## Actividad 7: Prueba integrada – Cambio completo en español (20 min)

### 7.1 Asegurarse de que el idioma está en español

```bash
grep -A 2 "Idioma:" openspec/config.yaml
```

### 7.2 Crear un cambio pequeño pero real

```
/opsx-propose mejorar-login
```

### 7.3 Implementar (opcional)

Si hay tiempo, ejecutar `/opsx:apply mejorar-login`.

### 7.4 Validar y archivar (si se completaron las tareas)

```
/opsx:archive mejorar-login
```

### 7.5 Verificar que los artefactos finales están en español

```bash
cat openspec/changes/archive/2025-04-24-mejorar-login/proposal.md | head -10
```
