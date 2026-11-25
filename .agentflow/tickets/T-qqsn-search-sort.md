---
type: ticket
id: T-qqsn-search-sort
project_id: af-prj-ecommerce-2026
schema_version: 1.0.0
created: 20261125T182739Z
actor: Gurunath Jadhav
role: approver
title: "Product search and sort with debounced input"
ticket_type: story
lane: standard
priority: must
moscow: must
mvp: MVP-1
size: S
req_links:
  - REQ-gesk-product-search-and-sort-functionality
dependencies:
  - T-homepage
effort_budget:
  steps: 4
  retries: 0
  est_minutes: 25
  approx_tokens: "~12k"
---

## Story
As a shopper, I want to search for products by name and sort results by price or newness so I can find what I want quickly.

## Out-of-Scope Notes
- Unrelated modules and unrequested features

## Acceptance Criteria

### Criterion 1
Given I type in the search bar When I pause typing for 300ms Then results filter in real-time matching product name or description

**Verification method:** `automated-test`

### Criterion 2
Given search results are displayed When I select Sort by Price Low-High Then products reorder by ascending price; Sort by Price High-Low reorders descending

**Verification method:** `automated-test`

### Criterion 3
Given a search query returns no results When the empty state renders Then I see a friendly message with a suggestion to clear filters

**Verification method:** `automated-test`

## Test Plan
**Own tests command:** `cd frontend && pnpm test && cd ../backend && mvn test`
**Regression set command:** `cd frontend && pnpm test && cd ../backend && mvn test`
