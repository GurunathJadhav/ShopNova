---
type: ticket
id: T-dhn1-design-system
project_id: af-prj-ecommerce-2026
schema_version: 1.0.0
created: 20261125T182739Z
actor: Gurunath Jadhav
role: approver
title: "Design system: Tailwind config, design tokens, reusable UI components, dark/light theme"
ticket_type: story
lane: standard
priority: must
moscow: must
mvp: MVP-1
size: M
req_links:
  - REQ-zbew-design-tokens-and-cohesive-component-libra
  - REQ-nw67-dark-light-mode-with-system-preference-det
dependencies:
  - T-scaffolding
effort_budget:
  steps: 5
  retries: 0
  est_minutes: 35
  approx_tokens: "~20k"
---

## Story
As a user, I want a polished and consistent visual experience with dark/light mode support across the entire application.

## Out-of-Scope Notes
- Unrelated modules and unrequested features

## Acceptance Criteria

### Criterion 1
Given the design system is configured When I view any page Then the typography, colors, and spacing follow the design tokens consistently

**Verification method:** `automated-test`

### Criterion 2
Given system prefers dark mode When the app loads Then it renders in dark mode; When I toggle manually Then the preference persists across sessions

**Verification method:** `automated-test`

### Criterion 3
Given the component library exists When I use Button, Input, Card, Badge, Modal, Drawer Then each renders correctly in both light and dark modes

**Verification method:** `automated-test`

## Test Plan
**Own tests command:** `cd frontend && pnpm test && pnpm build`
**Regression set command:** `cd frontend && pnpm test && pnpm build`
