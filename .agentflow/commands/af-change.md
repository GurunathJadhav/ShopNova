---
name: af-change
description: Process a formal change request, assess impact on baseline and tickets, and obtain owner approval
phase: any
tier: 0
actor: both
core: false
---

# /af-change — Process Change Request

## Purpose
Manages changes to requirements, scope boundaries, or architectural decisions after the baseline has been established (§S10.4). Analyzes the downstream impact on active and backlog tickets, evaluates complexity and schedule risks, records architectural implications, and secures explicit owner sign-off. Enforces the rule that **no code editing may take place for a new or modified requirement until the change request is formally approved**.

## Preconditions
- [ ] Requirements baseline or active ticket set exists.
- [ ] A request to add, modify, descope, or drop a requirement has been initiated.
- [ ] Edit lock is `locked` (or current micro-step verified).

## Steps
1. **Document the Change Proposal:**
   - Record the source and exact request text from the user/owner.
   - Clarify the driver (e.g. new business priority, customer feedback, technical constraint, dependency issue).
2. **Conduct Comprehensive Impact Assessment (§S10.4):**
   - **Requirements Impact:** Identify which `requirements/REQ-*.md` records are affected, created, modified, or descoped.
   - **Tickets Impact:** Identify affected tickets in `tickets/T-*.md`:
     - Tickets that must be updated with new acceptance criteria.
     - Tickets that must be cancelled or marked `superseded`.
     - New tickets that must be created.
     - Determine if any currently active in-progress ticket is invalidated.
   - **Architecture Impact:** Determine if any approved Architecture Decision Records (`decisions/D-*.md`) must be superseded or if a new ADR is needed.
   - **Budget & Gate Impact:** Assess impact on Complexity Budget, release milestones, and test suite.
3. **Formulate Change Proposal Record:**
   - Create change record or change ticket: `.agentflow/tickets/T-<4 base32 chars>-change-<slug>.md` with front matter:
     - `type: ticket`
     - `id: T-<id>`
     - `ticket_type: change`
     - `status: backlog`
   - Document the full impact assessment, affected tickets, and required modifications in the body.
4. **Submit to Project Owner for Approval:**
   - Present the impact summary to the project owner in chat:
     "Owner: change request `<title>` requires:
     - Modifying requirements: <REQ-ids>
     - Updating tickets: <T-ids>
     - Architectural changes: <details>
     Do you approve this change request and its associated impact?"
   - Add entry to `.agentflow/APPROVALS-NEEDED.md`.
5. **Execute Approved Transitions:**
   - Upon receiving owner approval:
     - Write approval record: `.agentflow/approvals/A-<4 base32 chars>-change-<slug>.md`.
     - Log event: `events/<UTC-compact>-none-change-approved-T-<id>.md`.
     - Update affected requirements (mark descoped/dropped or revise criteria).
     - Update affected tickets (cancel, supersede, or update criteria).
     - Regenerate `.agentflow/traceability.md`.
6. **Rebuild STATE.md:**
   - Refresh ticket board, active unknowns, and set `next_action`.

## Postconditions
- [ ] Change proposal and impact analysis documented.
- [ ] Owner approval record `.agentflow/approvals/A-<id>.md` created.
- [ ] Event `change-approved` logged.
- [ ] Affected requirements, tickets, and traceability matrix updated.
- [ ] `STATE.md` refreshed.

## Next
- **Success:** `/af-ticket` (to draft new or revised tickets) or `/af-edit-plan` (to plan implementation).
- **Rejected:** Close change request with event `change-rejected` and continue original plan.
- **Awaiting Approval:** Wait for owner response in chat.

## Common Mistakes
- Modifying baselined requirements or code immediately upon a user's verbal request without doing an impact analysis.
- Failing to cancel or update dependent tickets when a requirement is descoped.
- Silently expanding scope without obtaining owner sign-off.

## Footer Template
`Done: processed change request <change-id> (impact: <n> tickets, <m> reqs) | Logged: <event-id> | Next: await owner approval or /af-ticket | Needs you: approve change request <change-id>`
