---
name: af-lane-change
description: Move a ticket to a different lane (trivial/standard/incident) with owner confirmation
phase: any
tier: 0
actor: both
core: false
---

# /af-lane-change — Move Ticket to Different Lane

## Purpose
Changes the lane of an in-progress or backlog ticket. Lane changes affect the definition of done and the level of verification required. Moving to a weaker lane (e.g., standard → trivial) after work has started is a significant decision; it requires owner approval. Moving to a stronger lane is allowed by the agent with logging.

## Preconditions
- [ ] The ticket exists and its current lane is known
- [ ] A clear reason exists for the lane change (misclassification, complexity changed, incident discovered)
- [ ] The ticket is not already `done` or `cancelled` (use `/af-reopen` for done tickets)

## Steps
1. **Read the current ticket** from `tickets/<ticket-id>.md`. Note the current lane.
2. **Classify the change direction:**
   - **Upward (stronger lane):** trivial → standard, standard → incident or project-level
   - **Downward (weaker lane):** standard → trivial, incident → standard
3. **Document the justification.** State clearly:
   - Why the current lane is wrong
   - Why the new lane is appropriate
   - What evidence supports the reclassification (complexity estimate, incident discovery, etc.)
4. **For downward changes (weaker lane):** this requires owner approval.
   - Add to `APPROVALS-NEEDED.md`
   - Stop and wait for owner to confirm in chat
   - Record approval in `approvals/A-<id>.md` with verbatim words
5. **For upward changes:** the agent may proceed with logging; notify the owner in the same reply.
6. **Log the lane-change event.** Write `events/<ts>-<ticket-id>-lane-change-<ticket-id>.md`:
   ```
   ---
   type: event
   id: EVT-<id>
   event_type: lane-change
   ticket_id: <ticket-id>
   from_lane: <old>
   to_lane: <new>
   reason: <justification>
   approval_id: <A-id or none>
   ---
   ```
7. **Update the ticket if lane is in the ticket front matter.** If `lane:` is a front-matter field on the ticket, this is the one permitted update — record it as a correction event (records are otherwise immutable).
8. **Adjust the definition of done.** State explicitly in the reply what the new done-definition requires, so the owner understands the implication.
9. **Rebuild `STATE.md`** to reflect the new lane.

## Postconditions
- [ ] Lane-change event logged in `events/`
- [ ] For downward changes: approval record exists
- [ ] Ticket lane updated (correction event if front matter changed)
- [ ] `STATE.md` rebuilt
- [ ] Owner notified of new done-definition

## Next
- **Success:** `/af-next` — continue under new lane rules
- **Failure (owner refuses downward change):** keep current lane; record refusal event
- **Blocked:** `/af-blockers` — if owner unavailable for downward approval

## Common Mistakes
- Moving to trivial lane to avoid verification — the trivial lane still requires a one-line log and diff check
- Not logging the lane change as an event — derived status will be wrong without it
- Changing the lane without informing the owner what the new done-definition means
- Attempting to move a `done` ticket's lane — use `/af-reopen` first
- Treating upward moves as automatically free — always log them even if no approval is needed

## Footer Template
`Done: lane-change event <event-id>, ticket <ticket-id> from <old> to <new> | Logged: <event-ids> | Next: /af-next because lane updated | Needs you: <approve lane change or nothing>`
