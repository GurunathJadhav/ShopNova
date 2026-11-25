---
type: ticket
id: T-s34e-seo
project_id: af-prj-ecommerce-2026
schema_version: 1.0.0
created: 20261125T182739Z
actor: Gurunath Jadhav
role: approver
title: "SEO meta tags and semantic HTML across all pages"
ticket_type: story
lane: standard
priority: should
moscow: should
mvp: MVP-3
size: S
req_links:
  - REQ-9dp1-seo-meta-tags-and-semantic-html
dependencies:
  - T-homepage
  - T-pdp
effort_budget:
  steps: 3
  retries: 0
  est_minutes: 20
  approx_tokens: "~8k"
---

## Story
As the site owner, I want proper meta tags and semantic HTML on all pages so search engines can index the storefront effectively.

## Out-of-Scope Notes
- Unrelated modules and unrequested features

## Acceptance Criteria

### Criterion 1
Given I inspect any page When I check the head tag Then I see unique title, description, and Open Graph (og:title, og:image, og:description) meta tags

**Verification method:** `automated-test`

### Criterion 2
Given the HTML structure When analyzed Then it uses semantic elements (header, nav, main, section, article, footer) throughout

**Verification method:** `automated-test`

## Test Plan
**Own tests command:** `cd frontend && pnpm build`
**Regression set command:** `cd frontend && pnpm test && cd ../backend && mvn test`
