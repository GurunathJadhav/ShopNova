---
name: af-report
description: Produce a plain-language progress and metrics report for the human, derived from records, without exposing raw internal IDs as the primary content
phase: any
tier: 0
actor: agent
core: false
---

# /af-report — Human Progress Report

## Purpose
Gives the owner a plain-language summary of project health AND keeps the visual HTML dashboard (`.agentflow/report.html`) current: MVPs, user stories, estimated vs actual timings, token consumption (labelled approximate), quality gate coverage, risks, and blockers with inline SVG pie and bar charts.

## Preconditions
- [ ] `.agentflow/STATE.md` exists and is readable.
- [ ] Ticket and event records are readable (list directories, do not read every file — filter by status via latest events).

## Steps
1. **Refresh Visual HTML Dashboard (Tier 1/2):**
   - If `.agentflow/report.js` exists, run `node .agentflow/report.js` (or `agentflow report .`) so `.agentflow/report.html` reflects the latest MVPs, tickets, timings, tokens, and charts.
2. **Gather state (cheaply):**
   - Read `STATE.md` (phase, active ticket, blockers, unknowns, next action).
   - List `tickets/` and `events/` filenames to derive counts per status (filename-as-index rule: never open every file).
   - List `blockers/`, `waivers/`, `risks/`, and open `questions/` filenames.
2. **Compose the report in the user's language (`record_language`):**
   - **Done this period:** tickets completed, one line each in business terms.
   - **In progress:** active ticket, current step, unverified state if any.
   - **Blocked:** what is blocked and **what the human must supply** (batched into one list).
   - **Waiting on you:** open blocking questions and pending approvals (point to `APPROVALS-NEEDED.md`).
   - **Active waivers and top risks:** one line each.
   - **Next action:** the exact recommended command and reason.
3. **Metrics (`/af-report --metrics` only):**
   - Summarise per-ticket approximate tokens/effort (labelled **approximate**, agent estimates), rework loops (reopened/revert events), and scope flags (expansion events).
   - Compare against the baseline golden-project run if one exists; report overhead honestly.
4. **No internal jargon:** describe records in business terms; raw IDs may appear in parentheses only.
5. **Write nothing by default.** If metrics were computed and `strictness` requires logging the report, write a single `events/<UTC>-none-report-generated-none.md` summarising it.

## Postconditions
- [ ] Report delivered in plain language with sections: done / in progress / blocked / waiting on you / waivers and risks / next action.
- [ ] No records modified (optional single report event if configured).

## Next
- **Approvals pending:** `/af-approvals` — batch and present them.
- **Blockers need human input:** `/af-blockers` — consolidate the human-supply list.
- **Otherwise:** resume the current `next_action`.

## Common Mistakes
- Dumping raw record contents and IDs instead of a plain-language summary.
- Reading every event file instead of deriving status from filenames.
- Presenting approximate token figures as exact measurements.
- Hiding bad news (failed verifications, unresolved unknowns) to make the report look good.

## Footer Template
`Done: progress report delivered | Logged: <event-id or nothing> | Next: <next_action> because <reason> | Needs you: <open items or "nothing">`
