# Delta for Catalog

## ADDED Requirements

### Requirement: Category-based Product Filtering
Users SHALL filter products by category slug(s).

#### Scenario: Successful filter by single category
- GIVEN products exist in database with categories
- WHEN user requests products with `?category=rpg`
- THEN results are returned with pagination (20 items per page)
- AND each item includes id, name, price, stock, categories

#### Scenario: Filter by multiple categories
- GIVEN products exist in database with categories
- WHEN user requests products with `?category=rpg,action`
- THEN results include products matching any of the specified categories
- AND results are paginated

#### Scenario: Empty results
- GIVEN no products match the category criteria
- WHEN user requests products with a non-existent category
- THEN an empty array is returned
- AND status code 200 (not 404)

## Performance Requirements (always include)
- Response time MUST be < 500ms for 100 products
- N+1 queries MUST be avoided (use Prisma `include`)
- Images MUST be lazy-loaded
- Cache TTL: 5 minutes for product lists
- Use `parseInt(page, 10)` to avoid NaN in pagination
