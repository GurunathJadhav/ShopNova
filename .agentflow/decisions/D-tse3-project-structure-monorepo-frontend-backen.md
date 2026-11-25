---
type: decision
id: D-tse3-project-structure-monorepo-frontend-backen
project_id: af-prj-ecommerce-2026
schema_version: 1.0.0
created: 20261125T182459Z
actor: Gurunath Jadhav
role: architect
approved_by: Gurunath Jadhav
title: "Project structure: monorepo /frontend + /backend"
decision_type: two-way
status: accepted
---
# D-tse3-project-structure-monorepo-frontend-backen: Project structure: monorepo /frontend + /backend

## Chosen
Monorepo with /frontend (React Vite pnpm) and /backend (Spring Boot Maven) folders

## Reason
Owner prefers single repo; Vite dev proxy to Spring Boot for local development
