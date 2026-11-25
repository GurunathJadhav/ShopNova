---
type: ticket
id: T-f60a-checkout
project_id: af-prj-ecommerce-2026
schema_version: 1.0.0
created: 20261125T182739Z
actor: Gurunath Jadhav
role: approver
title: "Multi-step checkout: shipping form, shipping options, order review"
ticket_type: story
lane: standard
priority: must
moscow: must
mvp: MVP-2
size: M
req_links:
  - REQ-ysc7-multi-step-checkout-flow-with-form-validat
dependencies:
  - T-cart
  - T-auth
effort_budget:
  steps: 6
  retries: 0
  est_minutes: 35
  approx_tokens: "~22k"
---

## Story
As a shopper, I want a multi-step checkout with form validation, shipping method selection, and an order review step before payment.

## Out-of-Scope Notes
- Unrelated modules and unrequested features

## Acceptance Criteria

### Criterion 1
Given I proceed to checkout When the shipping form loads Then I see fields for name, email, address, city, state, zip, phone with real-time validation

**Verification method:** `automated-test`

### Criterion 2
Given I complete the shipping form When I proceed Then I see shipping options (standard/express) with estimated delivery dates and prices

**Verification method:** `automated-test`

### Criterion 3
Given I select a shipping option When I proceed to review Then I see a full order summary with items, shipping, and total before payment

**Verification method:** `automated-test`

## Test Plan
**Own tests command:** `cd frontend && pnpm test && cd ../backend && mvn test`
**Regression set command:** `cd frontend && pnpm test && cd ../backend && mvn test`
