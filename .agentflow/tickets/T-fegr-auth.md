---
type: ticket
id: T-fegr-auth
project_id: af-prj-ecommerce-2026
schema_version: 1.0.0
created: 20261125T182739Z
actor: Gurunath Jadhav
role: approver
title: "Customer auth: signup, login, profile, JWT httpOnly cookies, Spring Security"
ticket_type: story
lane: standard
priority: must
moscow: must
mvp: MVP-2
size: M
req_links:
  - REQ-yn28-customer-authentication-signup-login-profi
dependencies:
  - T-scaffolding
  - T-design-system
effort_budget:
  steps: 6
  retries: 0
  est_minutes: 40
  approx_tokens: "~25k"
---

## Story
As a customer, I want to sign up, log in, and manage my profile so I can track my orders and have a personalized experience.

## Out-of-Scope Notes
- Unrelated modules and unrequested features

## Acceptance Criteria

### Criterion 1
Given I am on the signup page When I submit valid email, password, and name Then my account is created, JWT cookie is set, and I am redirected to the homepage

**Verification method:** `automated-test`

### Criterion 2
Given I am on the login page When I submit valid credentials Then JWT httpOnly cookie is set and I see my name in the header; invalid credentials show an error

**Verification method:** `automated-test`

### Criterion 3
Given I am logged in When I visit my profile page Then I see my name, email, and can update my details; When I log out Then the JWT cookie is cleared

**Verification method:** `automated-test`

## Test Plan
**Own tests command:** `cd backend && mvn test && cd ../frontend && pnpm test`
**Regression set command:** `cd backend && mvn test && cd ../frontend && pnpm test`
