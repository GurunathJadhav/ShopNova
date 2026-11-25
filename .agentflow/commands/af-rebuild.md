---
name: af-rebuild
description: Rebuild STATE.md and all derived views from raw event records
phase: any
tier: 0
actor: agent
core: false
---

# /af-rebuild — Rebuild STATE.md and Derived Views

## Purpose
Performs a full rebuild of `STATE.md` and all derived index views from raw event records. Used as a recovery operation after: a merge that conflicted derived files, a corrupted or stale `STATE.md`, an interrupted rebuild, or when the agent needs a guaranteed-fresh state. Incremental rebuilds are the normal path; this is the full recovery path.

## Preconditions
- [ ] `STATE.md` is known to be stale, corrupted, or conflicted (or a full rebuild is explicitly needed)
- [ ] The raw event records in `events/` are intact (they are the source of truth)

## Steps
1. **Delete or move conflicted derived files.** The following are always safe to delete and rebuild:
   - `STATE.md`
   - `requirements.md` (derived index)
   - `glossary.md` (derived index)
   - `risks.md` (derived index)
   - `lessons.md` (derived index)
   - `traceability.md` (derived index)
   - `environment.md` (derived index)
   - `codemap.md` (derived)
   - `APPROVALS-NEEDED.md` (derived)
   - `CHEATSHEET.md` (derived)
   - **Never delete:** raw records (`tickets/`, `events/`, `decisions/`, `questions/`, `manifests/`, `approvals/`, `claims/`, `blockers/`, `verifications/`, `lessons/`, `glossary/`, `requirements/`, `waivers/`, `evidence/`, `handoff/`, policy files)
2. **Read `project.md`** for `project_id`, `strictness`, `guidance`, `quality_profile`, and other settings.
3. **Build the events index.** List ALL files in `events/` sorted by filename (which sorts by UTC timestamp). Read each in order:
   - For each ticket id: derive latest status from latest `status-change` event
   - For each question: derive status from latest event
   - For each blocker: derive open/resolved from latest event
   - For each approval: index by record-id
   - For each correction: apply it (correction supersedes the event it references)
4. **Rebuild the ticket board.** Identify tickets in `in-progress`, `in-review`, `blocked`, and `ready` states. Count all others by status.
5. **Rebuild `STATE.md`.** Follow the invariant structure (see build reference). Set `built_from` to the latest event id and repo revision. Keep within the ~1,000 token cap.
6. **Rebuild derived indexes** from individual record files:
   - `requirements.md`: list all `requirements/REQ-*.md` with status
   - `glossary.md`: alphabetical list from `glossary/*.md`
   - `lessons.md`: chronological list from `lessons/L-*.md`
   - `risks.md`: list from `risks/RISK-*.md`
   - `traceability.md`: map from `requirements/` → `tickets/` → `verifications/` using ticket `req_link` fields
   - `environment.md`: list from `environment/*.md`
   - `APPROVALS-NEEDED.md`: items in `events/` with `rule-change-request` or `waiver-request` and no matching approval; open manifests with no approval
7. **Verify the rebuild.** Check that `STATE.md` phase, edit lock, active ticket, and next_action are consistent with the latest events.
8. **Log a rebuild event.** Write `events/<ts>-none-rebuild-<id>.md` with `event_type: rebuild` and `built_from`.

## Postconditions
- [ ] `STATE.md` rebuilt from raw events, within ~1,000 token cap
- [ ] All derived indexes rebuilt
- [ ] No raw records deleted
- [ ] `built_from` set to latest event id and revision
- [ ] Rebuild event logged

## Next
- **Success:** `/af-next` — continue from verified clean state
- **Failure (events inconsistent):** `/af-reconcile` — resolve conflicts before rebuilding
- **Blocked (project.md missing):** `/af-doctor` — diagnose structural issues first

## Common Mistakes
- Deleting raw records instead of only derived views — raw records are the source of truth
- Rebuilding without sorting events by timestamp — out-of-order processing gives wrong status
- Not applying correction events — corrections supersede their targets; always apply them
- Skipping the rebuild event log — the new `built_from` must be recorded
- Exceeding the STATE.md token cap — trim in order: older events, done-ticket detail, older lessons; never drop invariants or active state

## Footer Template
`Done: STATE.md rebuilt, all derived indexes rebuilt | Logged: rebuild event <event-id> | Next: /af-next because rebuild complete | Needs you: nothing`
