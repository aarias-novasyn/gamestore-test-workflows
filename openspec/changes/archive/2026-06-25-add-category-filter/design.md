# Design: Category Filter

## Context

Product catalog needs hierarchical category filtering with paginated results.

## Goals / Non-Goals

**Goals:**
- Filter products by single or multiple categories
- Paginate filtered results
- Support category hierarchy (parent/child)

**Non-Goals:**
- Full-text search within categories
- Faceted search with price ranges

## Decisions

1. **Data model**: `categories` table with `parent_id` self-join, many-to-many via `product_categories`
2. **Filter param**: `?category=slug1,slug2` (comma-separated)
3. **Pagination**: Use existing pagination (20 items/page)
4. **Cache**: Cache category lists for 5 minutes

## Risks / Trade-offs

- Deep category trees could impact query performance → limit to 3 levels
- Many-to-many join could be slow → use indexed join table

## Open Questions

- Should we support AND vs OR logic for multiple categories?
