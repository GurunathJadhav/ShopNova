---
name: af-sync
description: Sync the framework state after a human made changes to the project outside the framework
phase: any
tier: 0
actor: agent
core: false
---

# /af-sync — Sync After External Human Changes

## Purpose
Called when a human has edited project files outside the framework (direct edits, git merges, copy-paste). Compares the current repository state with `built_from` in `STATE.md`, identifies unrecorded changes, logs them as `external-change` events, re-reads affected files before any further edits, and reports frozen-file changes to the owner. Use this after `/af-resume` signals that `built_from` is stale.

## Preconditions
- [ ] `STATE.md` `built_from` is known (the last recorded event id and revision)
- [ ] A human has edited files outside the framework (detected by `/af-resume` or the agent observing file changes)

## Steps
1. **Read `STATE.md`** and note `built_from` (event id and revision).
2. **Determine what changed.** If git is available:
   - Run `git diff <built_from_revision>..HEAD --name-only` to list changed files
   - If git is not available: compare the manifest file list by reading each file's content and noting discrepancies against baseline
3. **For each changed file, classify it:**
   - **In an active manifest:** flag for re-read before next edit; note the diff
   - **A frozen file (accepted ticket scope):** report to owner — frozen file changed outside framework; a change ticket may be needed
   - **A protected file:** report to owner as a potential policy violation; check if there is an approval covering this
   - **An unrelated file:** log as external-change and re-read before any future edit
4. **Re-read all changed files** that are within the active manifest or relevant to the active ticket.
5. **Log external-change events.** For each changed file (or batch per commit if git is available), write `events/<ts>-none-external-change-<id>.md`:
   ```
   ---
   type: event
   event_type: external-change
   changed_files: [<paths>]
   detected_at: <ts>
   source: human-edit | git-merge | unknown
   ---
   ## Changes
   <summary of what changed, based on diff or file comparison>
   ## Impact
   <which active tickets or manifests are affected>
   ```
6. **Report frozen/protected file changes to owner.** For each violation, present to owner and ask whether a change ticket is needed.
7. **Update `STATE.md`** `built_from` to the new revision after sync.
8. **Proceed to `/af-next`** with an updated view of the project state.

## Postconditions
- [ ] All changed files identified and classified
- [ ] External-change events logged in `events/`
- [ ] Active manifest files re-read (not assumed still match the last read)
- [ ] Frozen/protected file changes reported to owner
- [ ] `STATE.md` `built_from` updated

## Next
- **Success:** `/af-next` — continue with accurate state
- **Failure (cannot determine what changed):** `/af-rebuild` — full state rebuild from raw records
- **Blocked (frozen files changed without approval):** `/af-ask` — ask owner how to handle the violation

## Common Mistakes
- Not re-reading changed manifest files before the next edit — stale reads lead to overwriting human changes
- Silently accepting frozen/protected file changes — always report these to the owner
- Assuming git is available — always fall back to file comparison if git cannot be run
- Running this once and not updating `built_from` — subsequent changes will be missed
- Using `/af-sync` as a substitute for `/af-resume` — always run `/af-resume` at session start first

## Footer Template
`Done: external-change events <event-ids>, <N> files re-read, STATE.md built_from updated | Logged: <event-ids> | Next: /af-next because sync complete | Needs you: <review frozen file changes or nothing>`
