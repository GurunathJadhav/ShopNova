---
name: af-undo-plan
description: Plan and execute an undo via a correction event; never deletes records
phase: any
tier: 0
actor: both
core: false
---

# /af-undo-plan — Undo via Correction Event

## Purpose
Plans and executes an undo of a previous action using correction events, not record deletion. Records are immutable; the correction event supersedes the earlier one and derived views rebuild. Used when a step, decision, ticket transition, or other state change must be reversed. Covers both file-level reverts (via `/af-revert-unverified`) and logical state reversals (incorrect event, wrong ticket status, bad decision).

## Preconditions
- [ ] The action to undo is identified by its event id or record id
- [ ] The undo is possible (i.e., the action has not triggered irreversible downstream effects without approval)
- [ ] The owner is aware that this undo is being performed (approval required for significant undos)

## Steps
1. **Identify what to undo.** State:
   - Which event or record is being corrected (by id)
   - What was recorded incorrectly or what needs reversal
   - What the correct state should be
2. **Assess reversibility:**
   - **Fully reversible:** ticket status changes, event entries, decision drafts
   - **Partially reversible:** file edits (use `/af-revert-unverified` for the file part)
   - **Irreversible with risk:** merged changes, published releases, database migrations — these need a new corrective action, not a simple undo
3. **For irreversible actions:** create a new corrective ticket instead of undoing; explain to owner.
4. **Plan the correction.** Write a brief plan:
   - Correction event to write
   - Derived views to rebuild
   - File reverts needed (call `/af-revert-unverified` if applicable)
   - Any downstream records that reference the old state
5. **Get owner approval** if the undo affects a gate, ticket status, or other significant state.
6. **Write the correction event.** Create `events/<ts>-<ticket-or-none>-correction-<id>.md`:
   ```
   ---
   type: event
   id: EVT-<id>
   event_type: correction
   supersedes: <original-event-id>
   reason: <why the original event was wrong>
   corrected_by: <agent or owner>
   new_state: <what the state should be after correction>
   ---
   ## What was wrong
   <description of the error>
   ## Correct state
   <what the state should be>
   ## Evidence
   <why this correction is correct>
   ```
7. **Revert file changes** if applicable: use `/af-revert-unverified` for file-level reverts.
8. **Rebuild derived views.** `STATE.md`, status indexes, `traceability.md`, `codemap.md` as needed. Derived views use the correction event to reflect the new state.
9. **Log the correction** and confirm the state is correct.

## Postconditions
- [ ] Correction event written in `events/` (original event NOT deleted)
- [ ] File reverts completed if applicable
- [ ] Derived views rebuilt to reflect corrected state
- [ ] `STATE.md` updated and accurate

## Next
- **Success:** `/af-next` — continue from the corrected state
- **Failure (irreversible):** `/af-ticket` — create a corrective action ticket instead
- **Blocked (owner approval needed):** add to `APPROVALS-NEEDED.md`

## Common Mistakes
- Deleting or editing the original event record — records are immutable; only correction events are written
- Undoing a gate advance without owner approval — gate reversals are significant
- Not rebuilding derived views — `STATE.md` and indexes will show stale state
- Attempting to undo a released/deployed change as a simple correction — these need corrective action tickets
- Writing a correction without saying what the correct state is

## Footer Template
`Done: correction event <event-id> superseding <original-id>, views rebuilt | Logged: <event-id> | Next: /af-next because state corrected | Needs you: <approve undo or nothing>`
