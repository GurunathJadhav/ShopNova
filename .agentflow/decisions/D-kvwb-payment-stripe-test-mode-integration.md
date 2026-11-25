---
type: decision
id: D-kvwb-payment-stripe-test-mode-integration
project_id: af-prj-ecommerce-2026
schema_version: 1.0.0
created: 20261125T182440Z
actor: Gurunath Jadhav
role: architect
approved_by: Gurunath Jadhav
title: "Payment: Stripe test mode integration"
decision_type: two-way
status: accepted
---
# D-kvwb-payment-stripe-test-mode-integration: Payment: Stripe test mode integration

## Chosen
Stripe test mode via environment variables, never hardcoded keys

## Reason
Owner will provide Stripe sandbox keys; keys stored in .env only
