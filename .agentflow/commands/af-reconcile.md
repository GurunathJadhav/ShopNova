---
name: af-reconcile
description: Reconcile duplicate or conflicting records by writing correction events
phase: any
tier: 0
actor: agent
core: false
---

# /af-reconcile — Reconcile Duplicates / Conflicts

## Purpose
Finds and resolves duplicate records, conflicting statuses, and inconsistencies between records and actual state. Uses correction events to establish the canonical state — never deletes records. Triggered by `/af-doctor` when it reports duplicates or conflicts, or manually after a merge or interrupted session.

## Preconditions
- [ ] Either `/af-doctor` has reported duplicates/conflicts, or the agent suspects inconsistency from a merge or interrupted command
- [ ] The correct canonical state can be determined (from events, timestamps, or owner input)

## Steps
1. **Identify the conflict or duplicate.** Common sources:
   - Two events claiming the same ticket transition (from parallel agents or repeated commands)
   - Two records with the same logical content (same question asked twice, same ticket created twice)
   - `STATE.md` showing a different status than what event-derived status says
   - A manifest overlap (two active manifests listing the same file)
   - A merge leaving conflicted or duplicate derived view files
2. **Determine canonical state.** For each conflict:
   - Use timestamp ordering (later event wins) unless the later event is demonstrably wrong
   - For logical duplicates: pick the more complete record as canonical; the other is superseded
   - If canonical state cannot be determined: ask the owner
3. **Write correction events.** For each reconciled conflict, create `events/<ts>-none-reconcile-<id>.md`:
   ```
   ---
   type: event
   id: EVT-<id>
   event_type: reconcile
   conflicts: [<event-id-1>, <event-id-2>]
   canonical: <event-id or record-id>
   resolution: <description of how the conflict was resolved>
   ---
   ## Conflict
   <what conflicted>
   ## Resolution
   <which record is canonical and why>
   ## Superseded records
   <which records are superseded — not deleted, but no longer authoritative>
   ```
4. **For duplicate records:** mark the superseded one with a correction event that sets `superseded_by: <canonical-id>`.
5. **For manifest overlaps:** determine which ticket owns the file (the one with the earlier claim or the one the owner chooses). Log the resolution. The other ticket's manifest must be updated via `/af-expand-scope` or `/af-rule-change`.
6. **Delete conflicted derived view files** (`STATE.md`, `traceability.md`, `glossary.md`, etc.) and rebuild them. Never hand-merge derived views — always rebuild.
7. **Rebuild `STATE.md`** from correction events.
8. **Log a reconcile-done event.** Write `events/<ts>-none-reconcile-done-<id>.md` with the count of reconciled items.

## Postconditions
- [ ] Correction events written for all conflicts (no records deleted)
- [ ] Conflicted derived views deleted and rebuilt
- [ ] `STATE.md` accurate and consistent with event-derived state
- [ ] Reconcile-done event logged

## Next
- **Success:** `/af-next` — continue from reconciled state
- **Failure (cannot determine canonical state):** `/af-ask` — present the conflict to the owner and wait for their decision
- **Blocked:** `/af-doctor` — if reconcile reveals deeper structural issues, run doctor for a full diagnosis

## Common Mistakes
- Deleting conflicting records instead of writing correction events — records are immutable
- Hand-merging derived view files — always delete and rebuild
- Attempting to reconcile without knowing the canonical state — ask the owner if uncertain
- Ignoring manifest overlaps — two tickets claiming the same file will cause conflicts at merge
- Rebuilding STATE.md before writing the correction events — events are the input to STATE.md rebuild

## Footer Template
`Done: <N> conflicts reconciled, correction events <event-ids>, STATE.md rebuilt | Logged: reconcile-done event <event-id> | Next: /af-next because state reconciled | Needs you: <nothing or owner decision on conflict>`
