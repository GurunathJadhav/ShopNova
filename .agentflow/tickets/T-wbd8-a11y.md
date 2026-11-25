---
type: ticket
id: T-wbd8-a11y
project_id: af-prj-ecommerce-2026
schema_version: 1.0.0
created: 20261125T182739Z
actor: Gurunath Jadhav
role: approver
title: "Accessibility audit and fixes: keyboard nav, ARIA, contrast"
ticket_type: story
lane: standard
priority: must
moscow: must
mvp: MVP-3
size: S
req_links:
  - REQ-b1e6-accessibility-keyboard-navigation-aria-lab
dependencies:
  - T-states-polish
effort_budget:
  steps: 3
  retries: 0
  est_minutes: 20
  approx_tokens: "~10k"
---

## Story
As a user with accessibility needs, I want all interactive elements to be keyboard navigable with proper ARIA labels and sufficient contrast.

## Out-of-Scope Notes
- Unrelated modules and unrequested features

## Acceptance Criteria

### Criterion 1
Given I tab through the app When I reach interactive elements Then each has a visible focus indicator and logical tab order

**Verification method:** `automated-test`

### Criterion 2
Given I use a screen reader When interactive elements are focused Then ARIA labels correctly describe the element purpose

**Verification method:** `automated-test`

### Criterion 3
Given the design tokens define colors When checked against WCAG 2.1 AA Then all text meets minimum contrast ratios (4.5:1 normal, 3:1 large)

**Verification method:** `automated-test`

## Test Plan
**Own tests command:** `cd frontend && pnpm build`
**Regression set command:** `cd frontend && pnpm test && cd ../backend && mvn test`
