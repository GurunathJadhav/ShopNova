---
name: af-start-ticket
description: Establish clean baseline, complete pre-edit checklist, and unlock edit lock to begin ticket work
phase: implementation, maintenance
tier: 0
actor: agent
core: false
---

# /af-start-ticket — Begin Ticket Work

## Purpose
Transitions a claimed ticket from ready to in-progress. Verifies manifest approval, confirms working directory cleanliness, records a pristine baseline snapshot (`baselines/T-<id>.md`), executes the mandatory Verify-Before-Edit checklist, unlocks the project edit lock, and sets the active ticket context in `STATE.md`.

## Preconditions
- [ ] Ticket exists in `tickets/T-<id>.md`.
- [ ] Edit Manifest exists in `manifests/T-<id>.md` and has an approved approval record in `approvals/A-*.md` (or valid standing approval log).
- [ ] Working tree is clean: no uncommitted or untracked changes in manifest files.
- [ ] No unverified step is currently pending in `STATE.md`.

## Steps
1. **Verify Manifest Approval:**
   - Confirm that `.agentflow/manifests/T-<ticket-id>.md` is linked to an approved `approvals/A-<id>.md` or standing approval.
   - If unapproved, HALT and prompt user for manifest approval.
2. **Cleanliness & Baseline Snapshot (§S5.7):**
   - Check repository state:
     - With git: record current branch, commit revision SHA, and ensure `git status` has no dirty files touching manifest paths.
     - Without git: compute checksums or store copy of files listed in the manifest.
   - Write `.agentflow/baselines/T-<ticket-id>.md` containing the baseline revision, file listing, and initial hashes.
3. **Execute Verify-Before-Edit Checklist (§S5.3):**
   - Confirm: The agent has directly read the current contents of every file listed to modify.
   - Confirm: All external functions, types, and APIs referenced exist and are verified.
   - Confirm: Callers of the modified code have been reviewed.
   - For bug fixes: verify the bug is reproduced with a failing test or recorded evidence before any source code is changed.
   - For new features: verify the test strategy begins with a failing test (TDD red phase).
4. **Unlock Edit Lock & Set Active Context:**
   - Set `edit_lock: unlocked` in `STATE.md`.
   - Set `active_ticket: T-<ticket-id>`.
   - Set `active_manifest: manifests/T-<ticket-id>.md`.
   - Set `unverified_step: none`.
5. **Log Transition Event:**
   - Write event:
     `events/<UTC-compact>-T-<ticket-id>-ticket-started-T-<ticket-id>.md`
6. **Rebuild STATE.md:**
   - Update ticket board to show ticket as `in-progress`.
   - Set `next_action`: implement cohesive vertical slice + tests (`rapid`/`balanced`) or first micro-step (`strict`), then `/af-verify`.

## Postconditions
- [ ] Baseline snapshot `.agentflow/baselines/T-<ticket-id>.md` created.
- [ ] `edit_lock: unlocked` in `STATE.md`.
- [ ] `active_ticket` and `active_manifest` set in `STATE.md`.
- [ ] Event `events/<UTC-compact>-T-<ticket-id>-ticket-started-T-<ticket-id>.md` logged.
- [ ] `STATE.md` updated and reflects in-progress status.

## Next
- **Success:** Implement vertical slice + tests (`rapid`/`balanced`, styling with `frontend-and-ui-craft`) or minimal step (`strict`), then run `/af-verify`.
- **Failure (unapproved manifest):** Request manifest approval from user.
- **Blocked (dirty tree):** Request user clean or commit unrelated changes before proceeding.

## Common Mistakes
- Unlocking the edit lock without an approved Edit Manifest record.
- Editing code before taking the baseline snapshot.
- Starting to fix a bug without first reproducing the failure with concrete evidence.
- Stacking unverified edits immediately upon start.

## Footer Template
`Done: started ticket <ticket-id> (baseline: <rev>) | Logged: <event-id> | Next: write first provisional edit, then /af-verify | Needs you: nothing`
