---
type: ticket
id: T-219m-cart
project_id: af-prj-ecommerce-2026
schema_version: 1.0.0
created: 20261125T182739Z
actor: Gurunath Jadhav
role: approver
title: "Shopping cart: drawer, quantity controls, promo code, persistent state"
ticket_type: story
lane: standard
priority: must
moscow: must
mvp: MVP-1
size: M
req_links:
  - REQ-h6zk-persistent-shopping-cart-with-add-remove-u
dependencies:
  - T-pdp
  - T-db-schema-seed
effort_budget:
  steps: 6
  retries: 0
  est_minutes: 35
  approx_tokens: "~22k"
---

## Story
As a shopper, I want a shopping cart that persists across sessions with quantity controls, item removal, promo code entry, and a live subtotal.

## Out-of-Scope Notes
- Unrelated modules and unrequested features

## Acceptance Criteria

### Criterion 1
Given I click Add to Cart on a PDP When the cart drawer opens Then the item appears with correct variant, quantity, and subtotal; badge count updates

**Verification method:** `automated-test`

### Criterion 2
Given items are in the cart When I increase/decrease quantity or remove an item Then the subtotal recalculates in real-time

**Verification method:** `automated-test`

### Criterion 3
Given I am a guest When I close the browser and reopen Then my cart items persist via localStorage; Given I am logged in Then cart persists via API/DB

**Verification method:** `automated-test`

### Criterion 4
Given I enter a valid promo code When I apply it Then the discount is reflected in the total; invalid codes show an error message

**Verification method:** `automated-test`

## Test Plan
**Own tests command:** `cd frontend && pnpm test && cd ../backend && mvn test`
**Regression set command:** `cd frontend && pnpm test && cd ../backend && mvn test`
