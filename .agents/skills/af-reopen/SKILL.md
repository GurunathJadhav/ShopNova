---
name: af-reopen
description: Reopen a done ticket when a regression or accepted rejection requires further work
phase: any
tier: 0
actor: both
core: false
---

# /af-reopen — Reopen a Done Ticket

## Purpose
Sets a `done` ticket back to `reopened` status when a regression is discovered or the owner rejects the ticket during acceptance. Requires a linked `bug` or `change` ticket explaining why. Only unfreezes the manifest files needed for the fix, not the entire original scope. Prevents silent re-entry into done tickets without a trace.

## Preconditions
- [ ] The target ticket status is `done` (derived from latest event in `events/`)
- [ ] A `bug` or `change` ticket exists (or will be created immediately) explaining why re-entry is needed
- [ ] The owner is aware that this ticket is being reopened (approval required)

## Steps
1. **Confirm ticket is done.** List `events/` filtered by `<ticket-id>` and find the latest event. Confirm `status: done` or `event_type: status-change to: done`.
2. **Identify or create the linked ticket.** Either:
   - Reference an existing `bug` or `change` ticket that caused this reopen
   - Create a new bug/change ticket now via `/af-ticket` with the reason
3. **Request owner approval.** Add to `APPROVALS-NEEDED.md`:
   - Which done ticket is being reopened
   - Which bug/change ticket is the reason
   - What specific files will be re-unfrozen (narrow scope)
4. **Wait for owner approval.** Record the approval in `approvals/A-<id>.md` with verbatim words.
5. **Log the reopen event.** Write `events/<ts>-<ticket-id>-status-change-<ticket-id>.md`:
   ```
   ---
   event_type: status-change
   from: done
   to: reopened
   linked_ticket: <bug-or-change-ticket-id>
   approval_id: <A-id>
   reason: <brief reason>
   ---
   ```
6. **Define the narrow manifest.** Only the files strictly necessary for the fix may be unfrozen — not the entire original manifest. Document this explicitly.
7. **Rebuild `STATE.md`** — ticket moves from `done` count back to `in-progress` on the board.
8. **Proceed to `/af-edit-plan`** for the fix within the narrow manifest.

## Postconditions
- [ ] Reopen status-change event logged in `events/`
- [ ] Linked bug/change ticket exists and is referenced in the event
- [ ] Approval record `approvals/A-<id>.md` written
- [ ] `STATE.md` rebuilt showing ticket as `reopened`
- [ ] Narrow manifest scope documented (not the full original manifest)

## Next
- **Success:** `/af-edit-plan` — plan the narrow fix within the reopened ticket
- **Failure (no linked ticket):** create a bug/change ticket first, then reopen
- **Blocked (owner unavailable):** add to `APPROVALS-NEEDED.md`; do not reopen until approved

## Common Mistakes
- Reopening a ticket without a linked bug/change ticket — the reason must be traceable
- Unlocking the full original manifest instead of just the files needed for the fix
- Skipping owner approval — done tickets are frozen and need explicit sign-off to unfreeze
- Reopening a ticket to add new features (use a new ticket instead)
- Not rebuilding `STATE.md` — the board will show wrong counts

## Footer Template
`Done: reopen event <event-id>, ticket <ticket-id> status reopened, linked to <bug/change-id> | Logged: <event-ids> | Next: /af-edit-plan because ticket reopened for fix | Needs you: approve reopen of <ticket-id>`
