---
type: ticket
id: T-kyt6-order-history
project_id: af-prj-ecommerce-2026
schema_version: 1.0.0
created: 20261125T182739Z
actor: Gurunath Jadhav
role: approver
title: "Order history page for authenticated users"
ticket_type: story
lane: standard
priority: must
moscow: must
mvp: MVP-2
size: S
req_links:
  - REQ-04d7-order-history-for-authenticated-users
dependencies:
  - T-payment
  - T-auth
effort_budget:
  steps: 4
  retries: 0
  est_minutes: 25
  approx_tokens: "~12k"
---

## Story
As a registered customer, I want to view my past orders with status and details so I can track my purchases.

## Out-of-Scope Notes
- Unrelated modules and unrequested features

## Acceptance Criteria

### Criterion 1
Given I am logged in When I visit My Orders Then I see a list of past orders with order number, date, status, and total

**Verification method:** `automated-test`

### Criterion 2
Given I click on an order When the detail view opens Then I see all items, quantities, prices, shipping address, and status timeline

**Verification method:** `automated-test`

### Criterion 3
Given I have no past orders When I visit My Orders Then I see a friendly empty state with a Shop Now link

**Verification method:** `automated-test`

## Test Plan
**Own tests command:** `cd frontend && pnpm test && cd ../backend && mvn test`
**Regression set command:** `cd frontend && pnpm test && cd ../backend && mvn test`
