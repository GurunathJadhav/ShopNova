---
type: ticket
id: T-36pq-homepage
project_id: af-prj-ecommerce-2026
schema_version: 1.0.0
created: 20261125T182739Z
actor: Gurunath Jadhav
role: approver
title: "Storefront homepage: hero banner, featured collections, category navigation"
ticket_type: story
lane: standard
priority: must
moscow: must
mvp: MVP-1
size: M
req_links:
  - REQ-4k3v-responsive-storefront-homepage-with-hero-f
dependencies:
  - T-design-system
  - T-db-schema-seed
effort_budget:
  steps: 5
  retries: 0
  est_minutes: 35
  approx_tokens: "~20k"
---

## Story
As a shopper, I want an attractive homepage with a hero banner, featured product collections, and category navigation so I can discover products easily.

## Out-of-Scope Notes
- Unrelated modules and unrequested features

## Acceptance Criteria

### Criterion 1
Given I open the homepage When it loads Then I see a hero banner, at least 2 featured collections, and a category navigation bar/sidebar

**Verification method:** `automated-test`

### Criterion 2
Given I click a category When the page updates Then the product grid filters to show only products in that category

**Verification method:** `automated-test`

### Criterion 3
Given I view the homepage on mobile (< 768px) When I interact with it Then all elements are responsive and usable with touch

**Verification method:** `automated-test`

## Test Plan
**Own tests command:** `cd frontend && pnpm test && pnpm build`
**Regression set command:** `cd frontend && pnpm test && cd ../backend && mvn test`
