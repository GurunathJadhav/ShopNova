---
type: decision
id: D-01xb-auth-jwt-httponly-cookies-with-spring-secu
project_id: af-prj-ecommerce-2026
schema_version: 1.0.0
created: 20261125T182426Z
actor: Gurunath Jadhav
role: architect
approved_by: Gurunath Jadhav
title: "Auth: JWT httpOnly cookies with Spring Security"
decision_type: two-way
status: accepted
---
# D-01xb-auth-jwt-httponly-cookies-with-spring-secu: Auth: JWT httpOnly cookies with Spring Security

## Chosen
JWT stored in httpOnly cookies with Spring Security, username/password login

## Reason
Owner prefers JWT auth; httpOnly cookies are secure against XSS; Spring Security is standard
