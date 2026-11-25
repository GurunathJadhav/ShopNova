---
name: project-status-dashboard
description: Use whenever starting a project, planning tickets/MVPs, completing a ticket, or running /af-report so .agentflow/report.html stays up to date with accurate MVPs, user stories, timings, token estimates, quality metrics, and SVG charts.
version: 1.0.0
---

# Project Status HTML Dashboard

## Purpose
Maintain a live, modern, self-contained HTML project status dashboard at `.agentflow/report.html` showing MVPs, user stories, estimated vs actual timings, token consumption, quality gate coverage, risks/blockers, and accurate SVG pie & bar charts.

## When to Use & Auto-Refresh Cadence
Regenerate `.agentflow/report.html` automatically (without waiting for the user to ask) whenever:
1. Project discovery/tickets baseline is created (`/af-start` or `/af-ticket` batch)
2. A ticket starts (`/af-start-ticket`) or finishes (`/af-done`)
3. `/af-report` or `/af-gate` runs

## How to Record Accurate Telemetry on Tickets & Events
To keep timings, tokens, and MVP charts truthful (never guessed):
1. On every ticket in `.agentflow/tickets/T-*.md`, set:
   - `mvp: MVP-1` (or `MVP-2`, `MVP-3` — if omitted, derived from `moscow`: `must` → MVP 1, `should` → MVP 2, `could` → MVP 3)
   - `effort_budget.est_minutes`: realistic estimated duration in minutes (e.g., `25`)
   - `effort_budget.approx_tokens`: estimated token budget (e.g., `"~15k (approximate)"`)
2. On completion (`/af-done` event or ticket update), record observed metrics honestly:
   - `actual_minutes`: actual minutes spent (if omitted, computed from `ticket-started` → `ticket-done` event UTC timestamps)
   - `actual_tokens`: approximate tokens consumed (labelled approximate; never claim exact metering unless runtime provides it)

## How to Refresh `.agentflow/report.html`
- **Tier 1 / Tier 2 (shell available):** Run `node .agentflow/report.js` (or `npx github:GurunathJadhav/ADM-TOOL report .`). This parses all `.agentflow/` Markdown records and writes `.agentflow/report.html` deterministically with inline SVG pie/donut & bar charts.
- **Tier 0 (chat-only):** Instruct the user to run `node .agentflow/report.js` locally, or output the metrics table via `/af-report --metrics`.

## Anti-Patterns
- Inventing token numbers or pretending estimates are exact metered billing.
- Hand-coding duplicate HTML charts when `node .agentflow/report.js` generates accurate SVG geometry directly from `.agentflow/` records.
- Leaving `.agentflow/report.html` stale after closing tickets or changing MVP scope.
