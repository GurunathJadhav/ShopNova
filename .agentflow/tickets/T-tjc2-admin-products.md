---
type: ticket
id: T-tjc2-admin-products
project_id: af-prj-ecommerce-2026
schema_version: 1.0.0
created: 20261125T182739Z
actor: Gurunath Jadhav
role: approver
title: "Admin dashboard: product CRUD and inventory management"
ticket_type: story
lane: standard
priority: must
moscow: must
mvp: MVP-3
size: M
req_links:
  - REQ-3qmw-admin-dashboard-product-crud-inventory-man
dependencies:
  - T-auth
  - T-db-schema-seed
effort_budget:
  steps: 6
  retries: 0
  est_minutes: 40
  approx_tokens: "~25k"
---

## Story
As an admin, I want to create, edit, and delete products with variants and manage inventory levels from a dashboard.

## Out-of-Scope Notes
- Unrelated modules and unrequested features

## Acceptance Criteria

### Criterion 1
Given I am logged in as admin When I visit /admin/products Then I see a paginated product table with search, sort, and Create Product button

**Verification method:** `automated-test`

### Criterion 2
Given I click Create Product When I fill in name, description, price, category, images, and variants Then the product is saved and appears in the list

**Verification method:** `automated-test`

### Criterion 3
Given I edit a product variant stock When I save Then the inventory count updates in the database and the storefront reflects the change

**Verification method:** `automated-test`

## Test Plan
**Own tests command:** `cd frontend && pnpm test && cd ../backend && mvn test`
**Regression set command:** `cd frontend && pnpm test && cd ../backend && mvn test`
