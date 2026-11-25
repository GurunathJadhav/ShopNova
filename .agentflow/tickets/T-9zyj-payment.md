---
type: ticket
id: T-9zyj-payment
project_id: af-prj-ecommerce-2026
schema_version: 1.0.0
created: 20261125T182739Z
actor: Gurunath Jadhav
role: approver
title: "Stripe payment integration and order confirmation page"
ticket_type: story
lane: standard
priority: must
moscow: must
mvp: MVP-2
size: M
req_links:
  - REQ-6xpk-stripe-test-mode-payment-integration
  - REQ-jg52-order-confirmation-page-with-order-summary
dependencies:
  - T-checkout
effort_budget:
  steps: 6
  retries: 0
  est_minutes: 40
  approx_tokens: "~25k"
---

## Story
As a shopper, I want to pay securely via Stripe and see a confirmation page after successful payment.

## Out-of-Scope Notes
- Unrelated modules and unrequested features

## Acceptance Criteria

### Criterion 1
Given I am on the payment step When Stripe Elements loads Then I can enter card details in a secure embedded form

**Verification method:** `automated-test`

### Criterion 2
Given I submit payment with a valid test card (4242...) When Stripe processes it Then the order is created in the DB with status PAID and I am redirected to the confirmation page

**Verification method:** `automated-test`

### Criterion 3
Given payment succeeds When the confirmation page loads Then I see order number, item summary, shipping address, payment total, and estimated delivery

**Verification method:** `automated-test`

## Test Plan
**Own tests command:** `cd backend && mvn test && cd ../frontend && pnpm test`
**Regression set command:** `cd backend && mvn test && cd ../frontend && pnpm test`
