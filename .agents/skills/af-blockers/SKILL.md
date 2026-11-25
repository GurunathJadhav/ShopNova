---
name: af-blockers
description: List and manage human blockers; batch what the owner must supply
phase: any
tier: 0
actor: agent
core: false
---

# /af-blockers — List / Manage Human Blockers

## Purpose
Lists all open human blockers (things only a person can supply: credentials, accounts, approvals, content, decisions) and routes the agent to unblocked work. Presents the owner with a single batched list of everything they must supply so they don't receive piecemeal interruptions. Also used to record new human blockers discovered during work.

## Preconditions
- [ ] Either: at least one open blocker exists in `blockers/` with no resolution event, or a new blocker has just been discovered and needs to be recorded.

## Steps

### View mode (listing existing blockers)
1. **List open blockers.** Scan `events/` to find each `B-<id>` blocker record and its latest event. A blocker is open if its latest event is not `blocker-resolved`.
2. **Read each open blocker file** in `blockers/`. Note:
   - Description and owner
   - Dependent tickets (which tickets are `blocked`)
   - `needed_by` date if set
   - Blocker type: human (credentials, account, decision, content) vs. technical
3. **Batch the ask.** Present ALL open human blockers in a single message to the owner, grouped by urgency. For each: what is needed, which tickets are waiting, recommended default if any.
4. **Route to unblocked work.** Use `/af-next` logic to find tickets that are not waiting on any open blocker and suggest the next action.

### Record mode (new blocker discovered)
1. **Document the blocker.** Create `blockers/B-<id>-<slug>.md`:
   ```
   ---
   type: blocker
   id: B-<id>-<slug>
   project_id: <project_id>
   schema_version: 1.0.0
   created: <ts>
   actor: <agent>
   role: agent
   blocker_type: human | technical
   description: <what is needed and why>
   owner: <who must supply it>
   needed_by: <date or milestone>
   dependent_tickets: [<ticket-ids>]
   ---
   ## What is blocked
   <which tickets and why they cannot proceed>
   ## What is needed
   <exact description of what the owner must supply>
   ## Recommended default
   <if applicable>
   ```
2. **Set dependent tickets to `blocked` status.** Log a status-change event for each.
3. **Log a blocker-added event.** Write `events/<ts>-none-blocker-added-<id>.md`.
4. **Update `APPROVALS-NEEDED.md`** to include this blocker.
5. **Rebuild `STATE.md`** Open Blockers section.

### Resolve mode (blocker resolved)
1. **Confirm the owner has supplied what was needed.**
2. **Log a blocker-resolved event.** Write `events/<ts>-none-blocker-resolved-<id>.md` with what was supplied.
3. **Unblock dependent tickets.** Log status-change events back to `ready` or `in-progress`.
4. **Rebuild `STATE.md`**.

## Postconditions
- [ ] All open blockers listed in a single batch message to owner (view mode)
- [ ] New blocker record created if needed
- [ ] Dependent tickets set to `blocked` status
- [ ] `APPROVALS-NEEDED.md` updated
- [ ] `STATE.md` rebuilt with Open Blockers section updated

## Next
- **Success:** `/af-next` — routes to unblocked work
- **Failure (no unblocked work):** wait for owner to resolve blockers; re-read `STATE.md` when notified
- **Blocked:** continue waiting; do not loop on `/af-blockers` repeatedly

## Common Mistakes
- Interrupting the owner with one blocker at a time — always batch them in a single message
- Not linking blockers to dependent tickets — the board cannot accurately show `blocked` status otherwise
- Leaving resolved blockers in `STATE.md` as still open — always log the resolution event
- Treating technical blockers (stuck after 3 tries) as human blockers — use `/af-stuck` for those
- Forgetting to route to unblocked work after recording a blocker — the owner should not be left with nothing happening

## Footer Template
`Done: <N> open blockers listed, <new blocker B-id if created> | Logged: <event-ids> | Next: /af-next because routing to unblocked work | Needs you: <batch list of what owner must supply>`
