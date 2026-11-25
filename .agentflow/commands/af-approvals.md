---
name: af-approvals
description: List all pending approvals and batch them for the owner
phase: any
tier: 0
actor: agent
core: false
---

# /af-approvals — List Pending Approvals

## Purpose
Reads `APPROVALS-NEEDED.md` and `events/` to compile every item currently waiting for a human decision, approval, or countersign. Presents them in a single batched message to the owner, grouped by urgency and type. Never interrupts the owner for individual items — always batch. Also rebuilds `APPROVALS-NEEDED.md` to ensure it reflects actual open items.

## Preconditions
- [ ] `APPROVALS-NEEDED.md` exists (created at `/af-start`)

## Steps
1. **Read `APPROVALS-NEEDED.md`.** Note all listed items.
2. **Cross-reference with `events/`.** For each item in `APPROVALS-NEEDED.md`, check whether an approval event already exists in `events/` matching the item's id. If so, it is resolved and should be removed.
3. **Scan for additional pending items** not yet in `APPROVALS-NEEDED.md`:
   - Open blocking questions: `questions/` where latest event is `open` or `assumed`
   - Open manifests awaiting approval: `manifests/` created but no approval event found
   - Open rule-change requests: events with `event_type: rule-change-request` with no approval
   - Open waivers: `events/` with `event_type: waiver-request` with no grant event
   - Open phase gate advances: gate events pending owner sign-off
   - Pending high-risk countersigns
4. **Rebuild `APPROVALS-NEEDED.md`** with the current accurate list:
   ```markdown
   # Approvals Needed
   Updated: <ts>
   
   ## Urgent (high-risk / blocking)
   | ID | Type | Description | Risk | Recommended |
   |---|---|---|---|---|
   
   ## Standard
   | ID | Type | Description | Risk | Recommended |
   |---|---|---|---|---|
   
   ## Information only
   | ID | Type | Description | — | — |
   |---|---|---|---|---|
   ```
5. **Batch the message to the project GitHub owner (`owner:` from `project.md`).** Present ALL pending items in a single message grouped by urgency. When recording approvals, always write their GitHub username (`actor`, `approved_by`) instead of generic `"owner"`.
6. **Log an approvals-listed event.** Write `events/<ts>-none-approvals-listed-<id>.md` with count of pending items.
7. **Route to unblocked work** if any exists while waiting for responses.

## Postconditions
- [ ] `APPROVALS-NEEDED.md` rebuilt and accurate
- [ ] All pending approvals batched in a single message to the owner
- [ ] Approvals-listed event logged
- [ ] Agent routed to unblocked work while waiting

## Next
- **Success (owner responds):** process each approval via its relevant command (`/af-rule-change`, `/af-waive`, `/af-gate`, etc.)
- **Failure (no unblocked work):** wait for owner responses; do not loop
- **Blocked:** `STATE.md` next_action points to waiting for owner

## Common Mistakes
- Interrupting the owner once per approval item — always batch into one message
- Not cross-referencing with events — `APPROVALS-NEEDED.md` can become stale; always reconcile
- Listing resolved items as pending — this wastes the owner's time and erodes trust
- Not suggesting a recommended answer for each item — the owner appreciates guidance
- Forgetting to route to unblocked work — the agent should not block itself waiting when other work exists

## Footer Template
`Done: APPROVALS-NEEDED.md rebuilt, <N> items batched | Logged: <event-id> | Next: /af-next because routing to unblocked work while awaiting approvals | Needs you: respond to <N> pending approvals listed above`
