---
name: af-status
description: Display current project status, phase, active ticket, blockers, and next action
phase: any
tier: 0
actor: both
core: true
---

# /af-status — Project Status

## Purpose
Displays a concise, human-readable summary of the current project health and progress from `STATE.md`. Verifies state freshness against the latest event log, summarizes active tickets, reports open human blockers and unknowns, displays recent milestone events, and confirms the recommended next action.

## Preconditions
- [ ] `.agentflow/project.md` exists.
- [ ] `.agentflow/STATE.md` exists (or event directory is available for rebuild).

## Steps
1. **Verify State Freshness:**
   - Find the latest event filename in `.agentflow/events/`.
   - Compare its ID/timestamp with `built_from` recorded in `STATE.md`.
   - If `STATE.md` is stale or missing, perform a fast rebuild using recent events before rendering.
2. **Extract Key Metrics & Status:**
   - Current Phase (e.g. `discovery`, `requirements`, `tickets`, `planning`, `implementation`, `verification`, `review`, `release`).
   - Edit Lock: `locked` | `unlocked`.
   - Active Ticket: ID and title (or `none`).
   - Active Manifest: path and budget usage (or `none`).
   - Unverified Step: details (or `none`).
   - Declared Tier: 0, 1, or 2.
3. **Summarize Ticket Board:**
   - Display active and actionable tickets (in-progress, in-review, blocked, ready).
   - Display summary counts for other states (`backlog: N`, `done: N`, `deferred: N`).
4. **Highlight Blockers & Human Approvals:**
   - List any unresolved blockers in `blockers/` or entries in `APPROVALS-NEEDED.md`.
   - Clearly delineate what requires human action vs what the agent can proceed on.
5. **Display Recent Events & Next Action:**
   - Display the 5 most recent events from `events/`.
   - Announce the authoritative `next_action` and why it is next.

## Postconditions
- [ ] Status report rendered clearly to user.
- [ ] `STATE.md` verified fresh against latest events.

## Next
- **Success:** `/af-next` (or proceed directly to the command indicated in `next_action`).
- **Failure:** `/af-doctor` — If state file is corrupted or cannot be reconciled.
- **Blocked:** `/af-blockers` — If blockers are impeding progress.

## Common Mistakes
- Opening and scanning every individual event file on each status request instead of reading `STATE.md`.
- Presenting stale status without verifying the latest event timestamp against `built_from`.
- Failing to prominently flag an active unverified step or open human blocker.

## Footer Template
`Done: rendered status for <project_id> at phase <phase> | Logged: none | Next: <next_action> | Needs you: <blockers-summary or "nothing">`
