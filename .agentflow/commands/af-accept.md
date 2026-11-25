---
name: af-accept
description: Accept an epic or ticket delivery after owner review and integration check
phase: implementation, verification, review
tier: 0
actor: both
core: false
---

# /af-accept — Accept Epic / Ticket Delivery

## Purpose
Formally records the owner's acceptance of a completed epic (or individual ticket when per-ticket acceptance is configured). Called after the integration check passes. The owner runs a demo script, then accepts, rejects, or requests changes verbatim. Rejections become `change` or `bug` tickets; acceptance unfreezes the epic's tickets and advances to retrospective.

## Preconditions
- [ ] All Must tickets in the epic are in `in-review` or `done` state
- [ ] Epic integration check has been run and passed (evidence record exists)
- [ ] A demo script has been written and shared with the owner
- [ ] The active phase is `implementation`, `verification`, or `review`
- [ ] No unresolved blocking findings in review records for this epic

## Steps
1. **Prepare demo script.** Write a short, plain-language walkthrough of each acceptance criterion for the epic. Include exact steps for the owner to follow, expected outputs, and how to verify each one.
2. **Present to owner.** Share the demo script and ask the owner to: (a) run or observe the demo, (b) state acceptance, rejection, or change requests verbatim in chat.
3. **Record acceptance response.** Create `events/<ts>-none-acceptance-<epic-id>.md` with:
   - `event_type: acceptance`
   - `actor: <github-username from project.md owner:>`, `role: approver` (NEVER write generic `"owner"`)
   - Owner's verbatim response quoted exactly
   - `result: accepted | rejected | changes-requested`
   - Evidence refs (integration check record)
4. **If accepted:**
   - Log acceptance event for each ticket in the epic: `events/<ts>-<ticket-id>-status-change-<ticket-id>.md` with `to: done`
   - Update `STATE.md` ticket board counts
   - Create a `lessons/` entry if any notable insight emerged
   - Proceed to `/af-retro`
5. **If rejected or changes requested:**
   - Record the owner's verbatim words in a `change` or `bug` ticket
   - Link the new ticket to the epic
   - Set the relevant tickets back to `reopened` via `/af-reopen`
   - Proceed to `/af-edit-plan` for the fix ticket
6. **Rebuild `STATE.md`** to reflect updated statuses and next action.

## Postconditions
- [ ] Acceptance event record written to `events/`
- [ ] Owner's verbatim response captured in the event record
- [ ] Ticket statuses updated via events (not direct edits)
- [ ] `STATE.md` rebuilt with updated board and `next_action`
- [ ] If accepted: epic frozen, retro queued
- [ ] If rejected: change/bug ticket created and linked

## Next
- **Success (accepted):** `/af-retro` — run retrospective for the completed epic
- **Failure (rejected):** `/af-reopen` then `/af-edit-plan` — address owner's rejection with a fix ticket
- **Blocked:** `/af-blockers` — if the owner is unavailable, log a human blocker

## Common Mistakes
- Recording a summary instead of the owner's verbatim words — always quote exactly
- Skipping the integration check before calling `/af-accept` — integration check is a precondition
- Self-accepting as the agent — only the owner (human) may accept; agents must stop and wait
- Accepting partial epics where Must tickets are still open — all Must tickets must be in review or done first
- Forgetting to create a bug/change ticket when the owner requests changes — rejections must become trackable work

## Footer Template
`Done: acceptance event <event-id>, demo script | Logged: <event-ids> | Next: /af-retro because epic accepted by owner | Needs you: owner demo and acceptance decision`
