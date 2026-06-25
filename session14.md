# Sesión 14: Integración Continua y Automatización (3 horas)

## Objetivos de la sesión
- Usar comandos OpenSpec con `--json` para scripting.
- Crear scripts de validación y archivado automático.
- Configurar GitHub Actions para validar OpenSpec en cada PR.
- Configurar un pre-commit hook local con Husky.
- Automatizar el archivado de cambios completados.

---

## Actividad 1: Teoría - OpenSpec en CI/CD (15 min)

### Comandos compatibles con `--json`
| Comando                                  | Uso en CI               |
| ---------------------------------------- | ----------------------- |
| `openspec list --json`                   | Listar cambios activos  |
| `openspec validate --all --json`         | Validar todo y reportar |
| `openspec status --change <name> --json` | Ver progreso            |

### Variables de entorno útiles en CI
```bash
NO_COLOR=1                # Deshabilitar colores
OPENSPEC_CONCURRENCY=8    # Paralelismo en validaciones
CI=true                   # OpenSpec ajusta su comportamiento (ej. no prompts)
```

---

## Actividad 2: Practicar comandos con `--json` (30 min)

### 2.1 Crear algunos cambios de prueba

```
/opsx:propose test-ci-1
/opsx:propose test-ci-2
```

### 2.2 Listar cambios en JSON

```bash
openspec list --json
```

### 2.3 Filtrar con `jq` (instalar si no está)

```bash
# Instalar jq (si es necesario)
# Ubuntu: sudo apt-get install jq
# macOS: brew install jq

openspec list --json | jq '.changes[].name'
```

### 2.4 Validar todo y obtener resumen

```bash
openspec validate --all --json | jq '.summary'
```

### 2.5 Ver estado de un cambio en JSON

```bash
openspec status --change test-ci-1 --json | jq '.artifacts[] | {id, status}'
```

### 2.6 Limpiar cambios de prueba

```bash
rm -rf openspec/changes/test-ci-1 openspec/changes/test-ci-2
```

---

## Actividad 3: Crear scripts de validación y archivado (30 min)

### 3.1 Crear script de validación (`scripts/validate-openspec.sh`)

```bash
mkdir -p scripts
```

```bash
cat > scripts/validate-openspec.sh << 'EOF'
#!/bin/bash
echo "🔍 Validando OpenSpec..."

OUTPUT=$(openspec validate --all --json 2>/dev/null)
INVALID=$(echo "$OUTPUT" | jq '.summary.totals.failed')

if [ "$INVALID" -eq "0" ]; then
    echo "✅ Todos los cambios son válidos"
    exit 0
else
    echo "❌ Se encontraron $INVALID cambios inválidos:"
    echo "$OUTPUT" | jq -r '.results.changes[] | select(.valid == false) | "  - \(.name): \(.errors[])"'
    exit 1
fi
EOF

chmod +x scripts/validate-openspec.sh
```

### 3.2 Probar el script

```bash
./scripts/validate-openspec.sh
```

### 3.3 Crear script de auto-archivado (`scripts/archive-completed.sh`)

```bash
cat > scripts/archive-completed.sh << 'EOF'
#!/bin/bash
echo "📦 Buscando cambios completados..."

CHANGES=$(openspec list --json | jq -r '.changes[].name')
ARCHIVED=0

for change in $CHANGES; do
    STATUS=$(openspec status --change "$change" --json)
    COMPLETE=$(echo "$STATUS" | jq '.isComplete')
    
    if [ "$COMPLETE" = "true" ]; then
        echo "Archivando $change..."
        openspec archive "$change" --yes
        ARCHIVED=$((ARCHIVED + 1))
    fi
done

echo "✅ Archivados $ARCHIVED cambios"
EOF

chmod +x scripts/archive-completed.sh
```

### 3.4 Probar el script

```
/opsx:propose test-auto-archive
/opsx:apply test-auto-archive
```

```bash
./scripts/archive-completed.sh
```

### 3.5 Verificar que se archivó

```bash
ls openspec/changes/archive/ | grep test-auto-archive
```

---

## Actividad 4: Configurar GitHub Actions (30 min)

### 4.1 Crear directorio de workflows

```bash
mkdir -p .github/workflows
```

### 4.2 Workflow de validación en PR

```bash
cat > .github/workflows/openspec-validate.yml << 'EOF'
name: OpenSpec Validation

on:
  pull_request:
    branches: [main, develop]
    paths:
      - 'openspec/**'
  push:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install OpenSpec
        run: npm install -g @fission-ai/openspec@latest
      
      - name: Validate OpenSpec
        id: validate
        run: |
          openspec validate --all --json > validation.json
          cat validation.json
      
      - name: Check validation result
        run: |
          INVALID=$(jq '.summary.invalid' validation.json)
          if [ "$INVALID" -ne 0 ]; then
            echo "❌ Validation failed: $INVALID invalid changes"
            exit 1
          fi
          echo "✅ All OpenSpec changes valid!"
EOF
```

### 4.3 Workflow de auto-archivado (programado)

```bash
cat > .github/workflows/openspec-auto-archive.yml << 'EOF'
name: Auto-Archive Completed Changes

on:
  schedule:
    - cron: '0 18 * * 5'  # Viernes 6 PM (UTC)
  workflow_dispatch:
permissions:
  contents: write

jobs:
  archive:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install OpenSpec
        run: npm install -g @fission-ai/openspec@latest
      
      - name: Archive completed changes
        run: |
          ./scripts/archive-completed.sh
      
      - name: Commit archived changes
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add openspec/specs/ openspec/changes/archive/
          git commit -m "chore: auto-archive completed changes" || echo "No changes to commit"
          git push
EOF
```

### 4.4 Verificar sintaxis de los workflows

```bash
for file in .github/workflows/*.yml; do
  echo "Checking $file"
  cat "$file" | grep -E "name:|on:|jobs:"
done
```

---

## Actividad 5: Configurar pre-commit hook con Husky (30 min)

### 5.1 Instalar Husky (si no está instalado)

```bash
npm install -D husky
npx husky init
```

### 5.2 Crear hook pre-commit

```bash
cat > .husky/pre-commit << 'EOF'

echo "🔍 Validating OpenSpec changes..."

CHANGED_CHANGES=$(git diff --cached --name-only | grep "openspec/changes/" | cut -d'/' -f3 | sort -u | sed '/^archive$/d')

if [ -n "$CHANGED_CHANGES" ]; then
  for change in $CHANGED_CHANGES; do
    echo "Validating $change..."
    openspec validate "$change" --strict
    if [ $? -ne 0 ]; then
      echo "❌ Validation failed for $change"
      exit 1
    fi
  done
fi

openspec validate --specs

echo "✅ OpenSpec validation passed!"
EOF

chmod +x .husky/pre-commit
```

### 5.3 Probar el hook

```
/opsx:propose test-hook
git add .
git commit -m "test: test pre-commit hook"
```

### 5.4 Verificar que el hook falla con cambios inválidos (opcional)

Edita un spec para hacerlo inválido y prueba commit.

---

## Actividad 6: Probar todo el flujo localmente (30 min)

### 6.1 Simular un PR completo

```bash
git checkout -b feature/test-ci

/opsx:propose add-valid-feature
/opsx:apply add-valid-feature

./scripts/validate-openspec.sh

git add .
git commit -m "feat: add valid feature"
```

### 6.2 Verificar que los scripts funcionan en CI (simulado)

```bash
export CI=true
export NO_COLOR=1

./scripts/validate-openspec.sh
```

### 6.3 Probar auto-archivado manualmente

```bash
./scripts/archive-completed.sh
```
