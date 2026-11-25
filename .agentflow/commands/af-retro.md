---
name: af-retro
description: Run an end-of-epic retrospective and record lessons learned
phase: implementation, verification, review, release
tier: 0
actor: both
core: false
---

# /af-retro — Run Retrospective

## Purpose
Runs the `retrospective` skill at the end of each epic (and optionally each significant ticket). Surfaces what went well, what went wrong, and what to do differently. Records formal lessons in `lessons/` so future sessions benefit. Triggered automatically after `/af-accept` succeeds.

## Preconditions
- [ ] The epic (or ticket, if per-ticket retro is configured) has been accepted by the owner
- [ ] An acceptance event record exists for this epic
- [ ] No unprocessed blocking findings remain

## Steps
1. **Load the `retrospective` skill** (`skills/retrospective/SKILL.md`). Follow its full procedure.
2. **Gather data.** Read:
   - All events for this epic (ticket transitions, blockers, stuck events, waivers, verifications)
   - Lessons from prior epics (from `STATE.md` Latest Lessons section)
   - Any `blocker` and `stuck` records created during the epic
3. **Facilitate retrospective.** For each category below, compile observations and present a summary to the owner for comment:
   - **What went well** (processes, decisions, tools that worked)
   - **What went wrong** (blockers, stuck loops, failed verifications, scope drift, wrong assumptions)
   - **What to do differently** (concrete changes to rules, habits, or process)
   - **Surprises** (unexpected technical facts, environment issues)
4. **Record lessons.** For each actionable insight, create `lessons/L-<id>-<slug>.md` with:
   - `what_happened`: brief description
   - `what_was_wrong`: root cause
   - `what_to_do_differently`: specific corrective action
   - `ticket_link`: the ticket(s) where this arose
   - `created`: timestamp
5. **Update `STATE.md`** Latest Lessons section with one-liners from new lessons.
6. **Log retro event.** Write `events/<ts>-none-retro-<epic-id>.md` with `event_type: retro`, summary, and lesson IDs.
7. **Ask owner** if any lesson should become a rule change (via `/af-rule-change`).

## Postconditions
- [ ] At least one `lessons/L-<id>.md` created (or a note that none were warranted)
- [ ] Retro event logged in `events/`
- [ ] `STATE.md` Latest Lessons updated
- [ ] Owner has seen the retrospective summary and had a chance to comment

## Next
- **Success:** `/af-next` — advance to the next epic, planning phase, or release check
- **Failure:** `/af-ask` — if data is insufficient to run a meaningful retro, ask the owner
- **Blocked:** `/af-blockers` — if the owner is unavailable for comment

## Common Mistakes
- Skipping the retro because the epic seemed smooth — always run it; small learnings compound
- Recording generic lessons ("communicate better") instead of specific, actionable ones tied to a ticket
- Not linking lessons to the tickets where they arose — the link enables future traceability
- Failing to check whether a lesson implies a rule change — escalate when appropriate via `/af-rule-change`
- Reading only recent events and missing earlier blockers from the epic

## Footer Template
`Done: retro summary, lessons <lesson-ids> | Logged: <event-id> | Next: /af-next because retro complete | Needs you: review retro summary and confirm any rule changes needed`
