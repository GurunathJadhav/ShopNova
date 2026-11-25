---
type: ticket
id: T-6kx7-admin-orders
project_id: af-prj-ecommerce-2026
schema_version: 1.0.0
created: 20261125T182739Z
actor: Gurunath Jadhav
role: approver
title: "Admin dashboard: order management and status updates"
ticket_type: story
lane: standard
priority: must
moscow: must
mvp: MVP-3
size: M
req_links:
  - REQ-93rg-admin-dashboard-order-management-and-statu
dependencies:
  - T-admin-products
  - T-order-history
effort_budget:
  steps: 5
  retries: 0
  est_minutes: 30
  approx_tokens: "~18k"
---

## Story
As an admin, I want to view all orders, search/filter them, and update order statuses so I can manage fulfillment.

## Out-of-Scope Notes
- Unrelated modules and unrequested features

## Acceptance Criteria

### Criterion 1
Given I am logged in as admin When I visit /admin/orders Then I see a paginated order list with status filters (all/pending/processing/shipped/delivered/cancelled)

**Verification method:** `automated-test`

### Criterion 2
Given I click an order When the detail view opens Then I see customer info, items, payment details, and a status dropdown to update the order

**Verification method:** `automated-test`

### Criterion 3
Given I change an order status to SHIPPED When I save Then the status updates in DB and the customer sees the updated status in their order history

**Verification method:** `automated-test`

## Test Plan
**Own tests command:** `cd frontend && pnpm test && cd ../backend && mvn test`
**Regression set command:** `cd frontend && pnpm test && cd ../backend && mvn test`
