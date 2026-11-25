---
type: ticket
id: T-1f2w-pdp
project_id: af-prj-ecommerce-2026
schema_version: 1.0.0
created: 20261125T182739Z
actor: Gurunath Jadhav
role: approver
title: "Product detail page: gallery, variants, stock, reviews preview, add-to-cart"
ticket_type: story
lane: standard
priority: must
moscow: must
mvp: MVP-1
size: M
req_links:
  - REQ-caht-product-detail-page-with-image-gallery-var
dependencies:
  - T-db-schema-seed
  - T-design-system
effort_budget:
  steps: 5
  retries: 0
  est_minutes: 35
  approx_tokens: "~20k"
---

## Story
As a shopper, I want to see product details with an image gallery, select size/color variants, check stock, and read reviews before adding to cart.

## Out-of-Scope Notes
- Unrelated modules and unrequested features

## Acceptance Criteria

### Criterion 1
Given I click a product card When the PDP loads Then I see an image gallery (thumbnail navigation), product name, price, description, and stock status badge

**Verification method:** `automated-test`

### Criterion 2
Given the product has size and color variants When I select a combination Then the price, stock status, and main image update accordingly

**Verification method:** `automated-test`

### Criterion 3
Given reviews exist for the product When the PDP loads Then I see an average rating, review count, and the 3 most recent reviews with a View All link

**Verification method:** `automated-test`

## Test Plan
**Own tests command:** `cd frontend && pnpm test && pnpm build`
**Regression set command:** `cd frontend && pnpm test && cd ../backend && mvn test`
