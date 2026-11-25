---
type: ticket
id: T-8tth-states-polish
project_id: af-prj-ecommerce-2026
schema_version: 1.0.0
created: 20261125T182739Z
actor: Gurunath Jadhav
role: approver
title: "Empty, loading, and error states across all views"
ticket_type: story
lane: standard
priority: must
moscow: must
mvp: MVP-3
size: S
req_links:
  - REQ-5hhp-empty-loading-and-error-states-for-all-dat
dependencies:
  - T-homepage
  - T-pdp
  - T-cart
effort_budget:
  steps: 4
  retries: 0
  est_minutes: 25
  approx_tokens: "~12k"
---

## Story
As a user, I want to see polished loading skeletons, meaningful empty states, and graceful error handling so the app never feels broken.

## Out-of-Scope Notes
- Unrelated modules and unrequested features

## Acceptance Criteria

### Criterion 1
Given any data-fetching view is loading When the API call is in progress Then skeleton loaders render in place of content (not spinners)

**Verification method:** `automated-test`

### Criterion 2
Given an API call fails When the error state renders Then I see a user-friendly message with a Retry button that re-fetches data

**Verification method:** `automated-test`

### Criterion 3
Given a list view has no data When the empty state renders Then I see an illustration/icon with a helpful message and a CTA

**Verification method:** `automated-test`

## Test Plan
**Own tests command:** `cd frontend && pnpm test && pnpm build`
**Regression set command:** `cd frontend && pnpm test && cd ../backend && mvn test`
