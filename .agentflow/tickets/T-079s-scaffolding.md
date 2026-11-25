---
type: ticket
id: T-079s-scaffolding
project_id: af-prj-ecommerce-2026
schema_version: 1.0.0
created: 20261125T182739Z
actor: Gurunath Jadhav
role: approver
title: "Project scaffolding: monorepo, React Vite frontend, Spring Boot backend, MySQL config"
ticket_type: story
lane: standard
priority: must
moscow: must
mvp: MVP-1
size: M
req_links:
  - REQ-mn8y-project-scaffolding-monorepo-with-frontend
  - REQ-1w8h-mysql-database-with-spring-data-jpa-entiti
dependencies:
  - none
effort_budget:
  steps: 6
  retries: 0
  est_minutes: 40
  approx_tokens: "~25k"
---

## Story
As a developer, I want the monorepo initialized with React Vite (pnpm) + Spring Boot (Maven) + MySQL connection so the team can start building features on a working skeleton.

## Out-of-Scope Notes
- Unrelated modules and unrequested features

## Acceptance Criteria

### Criterion 1
Given a fresh clone When I run `pnpm install` in /frontend and `mvn clean install` in /backend Then both build successfully with zero errors

**Verification method:** `automated-test`

### Criterion 2
Given the Spring Boot app starts When it connects to MySQL Then the schema is auto-created via JPA/Hibernate and the app responds on /api/health

**Verification method:** `automated-test`

### Criterion 3
Given the React dev server starts When I open http://localhost:5173 Then a placeholder homepage renders and API proxy to Spring Boot works

**Verification method:** `automated-test`

## Test Plan
**Own tests command:** `cd frontend && pnpm build && cd ../backend && mvn test`
**Regression set command:** `cd frontend && pnpm build && cd ../backend && mvn test`
