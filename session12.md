# Sesión 12: Templates por Dominio y Reglas Avanzadas (3 horas)

## Objetivos de la sesión
- Crear templates específicos para los dominios `auth`, `catalog` y `payments`.
- Configurar el `config.yaml` para que la IA reciba instruciones claras sobre el formato esperado según el dominio.
- Modificar el schema `gamestore-schema` para incluir los nuevos templates (como guías).
- Probar los templates generando cambios para cada dominio.
- Verificar que los artefactos sigan la estructura esperada.

---

## Actividad 1: Teoría - Cómo guiar a la IA con templates y reglas (20 min)

### Estrategia práctica
1. Crear templates en `openspec/schemas/gamestore-schema/templates/domains/`.
2. En el `config.yaml`, agregar reglas como: "Para cambios en auth, el delta spec debe seguir la estructura del template `domains/auth-spec.md`".
3. La IA interpretará la regla y tratará de emular el formato.

**Limitación:** No hay garantía de que la IA copie exactamente el template. Es una guía, no una sustitución automática.

---

## Actividad 2: Crear templates específicos (30 min)

### 2.1 Crear directorio para templates de dominio

```bash
mkdir -p openspec/schemas/gamestore-schema/templates/domains
```

### 2.2 Template para `auth`

```bash
cat > openspec/schemas/gamestore-schema/templates/domains/auth-spec.md << 'EOF'
# Delta for Auth

## ADDED Requirements

### Requirement: [NOMBRE_FUNCIONALIDAD]
<!-- Ejemplo: Two-Factor Authentication, Password Reset -->

#### Scenario: Successful authentication flow
- GIVEN a user with valid credentials
- WHEN the user initiates [funcionalidad]
- THEN the system completes the action successfully
- AND a JWT token is issued (if login)
- AND a refresh token is stored in HTTP-only cookie

#### Scenario: Failed authentication
- GIVEN invalid or expired credentials
- WHEN the user attempts [funcionalidad]
- THEN an error message "[mensaje_error]" is displayed
- AND no token is issued

#### Scenario: Rate limiting (if login)
- GIVEN 5 failed attempts in 1 minute
- WHEN a 6th attempt is made
- THEN HTTP 429 (Too Many Requests) is returned

## Security Requirements (always include)
- Passwords MUST be hashed with bcrypt (cost factor 12)
- Tokens MUST expire after [tiempo] minutes
- Refresh tokens MUST be stored in HTTP-only cookies
- All auth endpoints MUST have rate limiting (5 attempts/minute)
EOF
```

### 2.3 Template para `catalog`

```bash
cat > openspec/schemas/gamestore-schema/templates/domains/catalog-spec.md << 'EOF'
# Delta for Catalog

## ADDED Requirements

### Requirement: [NOMBRE_FUNCIONALIDAD]
<!-- Ejemplo: Product Search, Filter by Category -->

#### Scenario: Successful operation
- GIVEN products exist in database
- WHEN user requests [funcionalidad]
- THEN results are returned with pagination ([PAGE_SIZE] items per page)
- AND each item includes id, name, price, stock

#### Scenario: Empty results
- GIVEN no products match the criteria
- WHEN user requests [funcionalidad]
- THEN an empty array is returned
- AND status code 200 (not 404)

## Performance Requirements (always include)
- Response time MUST be < 500ms for 100 products
- N+1 queries MUST be avoided (use Prisma `include`)
- Images MUST be lazy-loaded
- Cache TTL: 5 minutes for product lists
- Use `parseInt(page, 10)` to avoid NaN in pagination
EOF
```

### 2.4 Template para `payments`

```bash
cat > openspec/schemas/gamestore-schema/templates/domains/payments-spec.md << 'EOF'
# Delta for Payments

## ADDED Requirements

### Requirement: [METODO_PAGO]
<!-- Ejemplo: Credit Card, PayPal, MercadoPago -->

#### Scenario: Successful payment
- GIVEN a user with items in cart
- WHEN the user completes checkout with valid payment details
- THEN the order status becomes "PAID"
- AND a confirmation email is sent
- AND the cart is cleared

#### Scenario: Failed payment
- GIVEN invalid payment details
- WHEN payment is attempted
- THEN error message "Payment failed: [razon]" is shown
- AND cart remains unchanged
- AND order status is not updated

#### Scenario: Insufficient stock during checkout
- GIVEN a product with stock = [STOCK]
- WHEN user tries to buy more than available
- THEN payment is rejected
- AND error message "Product out of stock" is shown

## PCI Compliance Requirements (always include)
- NEVER log credit card details (numbers, CVV, expiry)
- Use payment processor SDK (Stripe/PayPal) – never store raw card data
- Store only payment reference ID (e.g., stripe_payment_intent_id)
- All payment requests MUST be over HTTPS
- Webhook endpoints MUST verify signatures
EOF
```

### 2.5 Verificar que los templates se crearon

```bash
ls -la openspec/schemas/gamestore-schema/templates/domains/
```

---

## Actividad 3: Configurar reglas en `config.yaml` (30 min)

### 3.1 Editar `config.yaml`

```bash
code openspec/config.yaml
```

Agrega al final (dentro de `rules:`):

```yaml
rules:
  specs:
    - "Para cambios que afecten el dominio 'auth', el delta spec debe seguir la estructura del template `domains/auth-spec.md` (disponible en el schema gamestore-schema)."
    - "Para cambios que afecten el dominio 'catalog', el delta spec debe seguir la estructura del template `domains/catalog-spec.md`."
    - "Para cambios que afecten el dominio 'payments', el delta spec debe seguir la estructura del template `domains/payments-spec.md`."
    - "Si el cambio afecta múltiples dominios, crea secciones separadas para cada uno."
    - "Mantén los requisitos de seguridad/rendimiento/compliance especificados en los templates."
```

Opcional: agregar también al `context`:

```yaml
context: |
  ... (contexto existente)
  
  ## Domain-Specific Spec Templates
  
  When writing delta specs for specific domains, follow these templates (available in openspec/schemas/gamestore-schema/templates/domains/):
  
  **Auth Domain**:
  - Include Security Requirements section (bcrypt, rate limiting, JWT expiry)
  - Use scenarios for success, failure, and rate limiting
  
  **Catalog Domain**:
  - Include Performance Requirements section (response time, N+1, pagination)
  - Use pagination metadata (total, page, totalPages)
  
  **Payments Domain**:
  - Include PCI Compliance section
  - Never include card details in examples
```

### 3.2 Verificar la sintaxis

```bash
python3 -c "import yaml; yaml.safe_load(open('openspec/config.yaml'))"
echo "✓ YAML válido"
```

---

## Actividad 4: Modificar el schema `gamestore-schema` (30 min)

### 4.1 Actualizar descripción en `schema.yaml`

```bash
code openspec/schemas/gamestore-schema/schema.yaml
```

```yaml
description: GameStore workflow with security review and domain-specific spec templates (auth, catalog, payments)
```

### 4.2 Validar el schema

```bash
openspec schema validate gamestore-schema
```

---

## Actividad 5: Probar con cambios para cada dominio (30 min)

### 5.1 Crear cambio para dominio `auth`

```
/opsx:propose add-password-reset --schema gamestore-schema
```

```bash
cat openspec/changes/add-password-reset/specs/auth/spec.md
```

### 5.2 Crear cambio para dominio `catalog`

```
/opsx:propose add-category-filter --schema gamestore-schema
```

```bash
cat openspec/changes/add-category-filter/specs/catalog/spec.md
```

### 5.3 Crear cambio para dominio `payments`

```
/opsx:propose add-paypal --schema gamestore-schema
```

```bash
cat openspec/changes/add-paypal/specs/payments/spec.md
```

---

## Actividad 6: Verificar resultados y ajustar (25 min)

### 6.1 Checklist de verificación

| Template           | ¿La IA siguió la estructura? | Observaciones |
| ------------------ | ---------------------------- | ------------- |
| `auth-spec.md`     | [ ]                          | ¿Aparecen bcrypt, rate limiting? |
| `catalog-spec.md`  | [ ]                          | ¿Aparecen <500ms, paginación? |
| `payments-spec.md` | [ ]                          | ¿Aparece PCI compliance? |

### 6.2 Si la IA no siguió bien el template, reforzar la regla

```yaml
rules:
  specs:
    - "Para cambios en auth, el delta spec DEBE incluir explícitamente: 'Passwords MUST be hashed with bcrypt (cost factor 12)'"
```

### 6.3 Re-generar un cambio de prueba

```
/opsx:propose test-auth-fix --schema gamestore-schema
```

### 6.4 Limpiar cambios de prueba

```bash
rm -rf openspec/changes/add-password-reset
rm -rf openspec/changes/add-category-filter
rm -rf openspec/changes/add-paypal
rm -rf openspec/changes/test-auth-fix
```
