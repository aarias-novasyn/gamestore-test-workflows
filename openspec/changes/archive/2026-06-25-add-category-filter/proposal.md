# Add Category Filter

## Why

Users cannot filter products by category, making it hard to browse the catalog efficiently.

## What Changes

- Add category entities and relationships to the data model
- Add API endpoint to list products filtered by category
- Add category filtering UI components

## Capabilities

### New Capabilities
- `catalog` - Category-based product filtering

### Modified Capabilities

- `catalog` - Existing catalog spec needs new requirement for category filtering

## Impact

- Catalog module: new query parameter `?category=slug` on products endpoint
- Database: new `categories` table with many-to-many relation to products
- Frontend: category filter sidebar component
