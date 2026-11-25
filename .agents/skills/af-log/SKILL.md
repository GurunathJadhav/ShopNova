---
name: af-log
description: Manually log a state-change event that the agent did not automatically record
phase: any
tier: 0
actor: both
core: false
---

# /af-log — Log a Manual Event

## Purpose
Creates a manual event record when a significant state change happened but was not automatically logged — for example, when a human made a change outside the framework, when a session was interrupted, or when the write-ahead log was missed. All meaningful state changes must exist as event records; this command closes those gaps.

## Preconditions
- [ ] A meaningful state change occurred (ticket transition, decision, verification, blocker, etc.) that is not yet in `events/`
- [ ] The actor, role, and approximate timestamp of the event are known (or can be reasonably stated)

## Steps
1. **Identify the event type.** Choose from the standard set:
   `status-change | question-answered | assumption-confirmed | decision-made | verification-done | blocker-added | blocker-resolved | gate-advanced | dependency-added | waiver-granted | revert | scope-expansion | rename | external-change | acceptance | rule-change | pause | handoff | lesson | retro | incident | stuck | lane-change | other`
2. **Gather facts:**
   - `ticket_id`: the affected ticket (or `none`)
   - `actor`: who performed the action (agent name or human name)
   - `role`: their role (owner, approver, reviewer, agent, observer)
   - `timestamp`: actual time if known; write `ts: unknown` if not, ordered by context
   - `summary`: one or two sentences describing what happened
   - `evidence_refs`: any existing files that support this event (optional but preferred)
3. **Check for duplicates.** List `events/` filtered by ticket id and approximate time. If an equivalent event already exists, do not create a duplicate — reference the existing one instead.
4. **Write the event file.** Create `events/<ts>-<ticket-or-none>-<event-type>-<id>.md`:
   ```
   ---
   type: event
   id: EVT-<id>
   project_id: <project_id>
   schema_version: 1.0.0
   created: <ts>
   actor: <name>
   role: <role>
   event_type: <type>
   ticket_id: <id or none>
   summary: <one-liner>
   evidence_refs: []
   manual: true
   ---
   ## Details
   <full description of what happened, why it was not automatically logged, and any supporting context>
   ```
   The `manual: true` flag marks this as a backfilled record.
5. **Rebuild `STATE.md`** if the event changes the board, blockers, or next action.

## Postconditions
- [ ] Event file created in `events/` with `manual: true`
- [ ] No duplicate of an existing event
- [ ] `STATE.md` rebuilt if the event changes board state

## Next
- **Success:** `/af-next` — continue from the correct state
- **Failure (timestamp unknown):** proceed with `ts: unknown`; flag for resolution via `/af-reconcile`
- **Blocked:** `/af-ask` — if the event details are unclear, ask the owner before logging

## Common Mistakes
- Logging individual micro-steps (reads, searches, minor edits) — log state changes only, not every micro-action
- Creating duplicate events — always check `events/` first
- Inventing a precise timestamp when it is unknown — write `ts: unknown` and flag it
- Using `manual: true` for normal events — this flag is only for backfilled records
- Skipping this command after an interrupted session — missing events leave STATE.md stale

## Footer Template
`Done: events/<filename> (manual) | Logged: <event-id> | Next: /af-next because state gap closed | Needs you: nothing`
