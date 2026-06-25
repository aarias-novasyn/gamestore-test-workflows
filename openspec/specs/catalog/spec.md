# Catalog Specification

## Purpose
Product listing, filtering, and pagination for GameStore.
## Requirements
### Requirement: Product Pagination
Users SHALL browse products in pages of 10 items.

#### Scenario: First page
- **WHEN** a user requests page 1
- **THEN** products 1-10 are returned

#### Scenario: Second page
- **WHEN** a user requests page 2
- **THEN** products 11-20 are returned

**KNOWN BUG:** Page 2 returns the same products as page 1.

### Requirement: Price Filter
Users SHALL filter products by price range.

#### Scenario: Filter by price range
- **WHEN** a user applies a price filter between 10 and 30
- **THEN** products with prices 15 and 25 are shown

#### Scenario: Sort by price ascending
- **WHEN** a user selects "Price: Low to High"
- **THEN** products are ordered from lowest to highest price

#### Scenario: Sort by price descending
- **WHEN** a user selects "Price: High to Low"
- **THEN** products are ordered from highest to lowest price

**KNOWN BUG:** Price filter orders products alphabetically instead of numerically.

### Requirement: Product Images
Users SHALL view product images correctly.

#### Scenario: Display product image
- **WHEN** a user views a product in the catalog
- **THEN** the product image is displayed from the backend URL

#### Scenario: Broken image fallback
- **WHEN** a product image URL is not accessible
- **THEN** a fallback placeholder image is shown

**KNOWN BUG:** Product images use absolute local paths instead of relative or CDN URLs, causing broken images in production.

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

