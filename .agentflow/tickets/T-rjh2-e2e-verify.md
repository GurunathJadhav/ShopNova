---
type: ticket
id: T-rjh2-e2e-verify
project_id: af-prj-ecommerce-2026
schema_version: 1.0.0
created: 20261125T182739Z
actor: Gurunath Jadhav
role: approver
title: "End-to-end verification: full build, test suite, live smoke check"
ticket_type: story
lane: standard
priority: must
moscow: must
mvp: MVP-3
size: S
req_links:
  - REQ-7kdm-end-to-end-verification-build-test-live-sm
dependencies:
  - T-a11y
  - T-seo
  - T-admin-orders
effort_budget:
  steps: 3
  retries: 0
  est_minutes: 20
  approx_tokens: "~8k"
---

## Story
As a developer, I want to verify the entire app builds, all tests pass, and the live app serves pages correctly before release.

## Out-of-Scope Notes
- Unrelated modules and unrequested features

## Acceptance Criteria

### Criterion 1
Given the full project When I run frontend build and backend build Then both succeed with zero errors

**Verification method:** `automated-test`

### Criterion 2
Given all test suites When run together Then all tests pass with no failures

**Verification method:** `automated-test`

### Criterion 3
Given the app is running live When I navigate to homepage, PDP, cart, checkout, and admin Then each page renders correctly with no console errors

**Verification method:** `automated-test`

## Test Plan
**Own tests command:** `cd frontend && pnpm test && pnpm build && cd ../backend && mvn test`
**Regression set command:** `cd frontend && pnpm test && pnpm build && cd ../backend && mvn test`
