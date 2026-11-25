---
name: af-ticket
description: Create a structured user-story ticket with Given/When/Then criteria and verification methods
phase: tickets, implementation, maintenance, any
tier: 0
actor: both
core: true
---

# /af-ticket — Create Ticket

## Purpose
Creates a user-story ticket (`tickets/T-<id>.md`) for a discrete unit of functionality, bug fix, task, spike, or change request. Enforces testable Given/When/Then acceptance criteria, binds each criterion to an explicit verification method, establishes test selection commands, and enforces sizing limits (L-sized tickets must be split).

## Preconditions
- [ ] Requirements baseline exists in `requirements/REQ-*.md` (or a bug/change source is identified).
- [ ] Requirements coverage check is in progress or a new work item is approved.
- [ ] Ticket size does not exceed M (if size is L, split into multiple S/M tickets before creation).

## Steps
1. **Define Story & Metadata:**
   - Define type: `story` | `task` | `spike` | `bug` | `change`.
   - Assign lane: `standard` | `trivial` | `incident`.
   - Format user story: *As a [persona], I want [capability], so that [benefit]*.
   - Link requirement: reference `requirements/REQ-<id>.md` (or provide explicit justification).
   - Set MoSCoW priority: `must` | `should` | `could` | `wont`.
   - Estimate size:
     - `S`: <= 3 files / 100 lines
     - `M`: <= 7 files / 300 lines
     - `L`: FORBIDDEN — must be broken down into separate tickets.
2. **Draft Acceptance Criteria & Verification Mapping:**
   - Write clear Given/When/Then criteria.
   - For **every** criterion, assign an explicit verification method:
     - `automated-test`
     - `command-output`
     - `manual-check`
     - `screenshot/visual`
     - `static-check`
     - `document-review`
     - `user-confirmation`
3. **Establish Test Selection Plan (§S4.2):**
   - Own test command: specific command to test this ticket's changes.
   - Regression set: command for regression suite or smoke set.
   - File-to-test mapping: manifest file paths mapped to test files or test tags.
4. **Define Scope Bounds & Telemetry:**
   - List explicit dependencies (`depends_on: [T-...]`).
   - List explicit out-of-scope items to prevent scope creep.
   - Assign `mvp:` wave (`MVP-1`, `MVP-2`, or derived from `moscow`) and `effort_budget` (`est_minutes`, `approx_tokens`, steps, retry limit max 3) so `.agentflow/report.html` tracks MVP progress, time estimates, and tokens accurately.
5. **Write Ticket Record (prefer `.agentflow/scripts/af_records.py` to save tokens):**
   - **Fast Tier 1/2 path:** Run `python .agentflow/scripts/af_records.py ticket --title "..." --story "..." --ac "Given... When... Then..." --mvp MVP-1 --size S --moscow must --req <REQ-id> --est 25 --tokens "~12k"` (or pass a JSON array via `--batch-stdin`). It auto-generates IDs, compact UTC, `events/`, and refreshes `STATE.md`.
   - **Tier 0 fallback:** Generate ticket ID `T-<4 base32 chars>-<slug>`, write `.agentflow/tickets/T-<id>.md` manually, log `events/<UTC>-T-<id>-ticket-created-<eid>.md`, and refresh `STATE.md`.

## Postconditions
- [ ] `.agentflow/tickets/T-<id>.md` created with complete Given/When/Then criteria and verification mapping.
- [ ] Event `events/<UTC-compact>-T-<id>-ticket-created-T-<id>.md` logged.
- [ ] `STATE.md` ticket board reflects the new ticket in `backlog`.

## Next
- **Success (during tickets phase):** `/af-coverage` — Verify all requirements have ticket coverage.
- **Success (during implementation phase):** `/af-edit-plan` — Create Edit Manifest to prepare for work.
- **Failure:** `/af-ticket` — Adjust criteria or split ticket if size was L.
- **Blocked:** `/af-ask` — If requirements or dependencies are missing.

## Common Mistakes
- Creating an L-sized ticket without splitting into smaller stories.
- Writing vague acceptance criteria without Given/When/Then format.
- Leaving criteria without an assigned verification method.
- Creating tickets that do not trace back to an approved requirement or justified change.

## Footer Template
`Done: created ticket <ticket-id> (<title>) | Logged: <event-id> | Next: /af-coverage or /af-edit-plan | Needs you: nothing`
