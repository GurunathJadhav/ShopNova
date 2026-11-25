---
name: af-coverage
description: Verify bidirectional traceability between requirements and tickets, detecting gaps or orphans
phase: tickets, planning, any
tier: 0
actor: both
core: false
---

# /af-coverage — Requirement-Ticket Coverage

## Purpose
Performs a rigorous bidirectional coverage audit between baselined requirements (`requirements/REQ-*.md`) and implementation tickets (`tickets/T-*.md`). Enforces two golden coverage rules: (1) every in-scope requirement must map to at least one ticket, and (2) every ticket must trace back to an approved requirement. Generates the derived `traceability.md` matrix and gates transition to planning.

## Preconditions
- [ ] Requirements baseline approved (`requirements/REQ-*.md` baselined).
- [ ] Tickets drafted in `tickets/T-*.md`.

## Steps
0. **Fast Tier 1/2 Path (Recommended):** Run `python .agentflow/scripts/af_gate_runner.py coverage` — audits all requirements vs tickets, detects gaps/orphans, writes `.agentflow/traceability.md`, and logs `coverage-verified` automatically.
1. **Audit Requirements Coverage:**
   - Enumerate all requirements with status `baselined`.
   - Cross-reference with all tickets in `.agentflow/tickets/`.
   - Identify any requirement (especially `priority: must` or `should`) lacking an associated ticket (`uncovered requirement`).
2. **Audit Orphan Tickets:**
   - Inspect every ticket file in `.agentflow/tickets/`.
   - Verify that its `req_id` links to a legitimate, active requirement.
   - Flag any ticket lacking a valid requirement link as an `orphan ticket` (unjustified work).
3. **Build Derived Traceability Matrix:**
   - Generate or overwrite `.agentflow/traceability.md`:
     - Markdown table mapping: `Requirement ID` | `Priority` | `Ticket ID` | `Lane` | `Test Selection Command` | `Status`.
     - Explicitly highlight any uncovered requirements or orphan tickets in an attention section.
4. **Evaluate Gate Criteria:**
   - **PASS:**
     - 100% of `must` and `should` requirements have at least one ticket.
     - 0 orphan tickets exist.
     - Log event:
       `events/<UTC-compact>-none-coverage-verified-trace.md`
   - **FAIL / GAP:**
     - Report missing ticket coverage for specific REQ IDs.
     - Report orphan tickets requiring change justification.
5. **Rebuild STATE.md:**
   - Update coverage metrics and set `next_action`.

## Postconditions
- [ ] Derived matrix `.agentflow/traceability.md` generated.
- [ ] If 100% coverage achieved, `coverage-verified` event recorded.
- [ ] Coverage status and metrics updated in `STATE.md`.

## Next
- **Success (100% coverage):** `/af-gate` — Advance from `tickets` to `planning` phase.
- **Gap (uncovered requirements):** `/af-ticket` — Create missing tickets for uncovered requirements.
- **Orphan tickets found:** Relink tickets to valid requirements or run `/af-change`.

## Common Mistakes
- Advancing past the tickets phase gate while Must requirements remain without tickets.
- Introducing extra tickets with features not specified in any approved requirement.
- Hand-editing `traceability.md` directly instead of letting `/af-coverage` generate it from source records.

## Footer Template
`Done: audit coverage (Reqs: <n>, Tickets: <m>, Coverage: <pct>%) | Logged: <event-id or "none"> | Next: <af-gate or /af-ticket> | Needs you: <action or "nothing">`
