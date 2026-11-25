---
type: ticket
id: T-aywj-db-schema-seed
project_id: af-prj-ecommerce-2026
schema_version: 1.0.0
created: 20261125T182739Z
actor: Gurunath Jadhav
role: approver
title: "Database schema: JPA entities, repositories, seed data for fashion products"
ticket_type: story
lane: standard
priority: must
moscow: must
mvp: MVP-1
size: M
req_links:
  - REQ-1w8h-mysql-database-with-spring-data-jpa-entiti
  - REQ-vysq-seed-data-15-20-fashion-products-with-vari
dependencies:
  - T-scaffolding
effort_budget:
  steps: 6
  retries: 0
  est_minutes: 40
  approx_tokens: "~22k"
---

## Story
As a developer, I want the full database schema with JPA entities and 15-20 seeded fashion products so the storefront has real data to display.

## Out-of-Scope Notes
- Unrelated modules and unrequested features

## Acceptance Criteria

### Criterion 1
Given the Spring Boot app starts When Hibernate runs Then all entities (Product, ProductVariant, Category, User, Cart, CartItem, Order, OrderItem, Review) are created in MySQL

**Verification method:** `automated-test`

### Criterion 2
Given the data seeder runs When the app starts for the first time Then 15-20 fashion products with variants (size/color), categories, and placeholder images from picsum.photos are inserted

**Verification method:** `automated-test`

### Criterion 3
Given the REST API endpoint GET /api/products exists When called Then it returns paginated product data with variants

**Verification method:** `automated-test`

## Test Plan
**Own tests command:** `cd backend && mvn test`
**Regression set command:** `cd backend && mvn test`
