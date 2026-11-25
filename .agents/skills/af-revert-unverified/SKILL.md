---
name: af-revert-unverified
description: Discard the current unverified code change and restore files to the last verified baseline
phase: implementation, maintenance, any
tier: 0
actor: both
core: false
---

# /af-revert-unverified — Revert Unverified Step

## Purpose
Safely rolls back the current provisional, unverified code change without discarding previously verified progress on the ticket. Invoked when verification fails repeatedly (preventing stacking broken edits on top of broken edits), when a debugging path proves incorrect, or when pausing a session with incomplete work. Enforces clean recovery back to the last verified baseline state.

## Preconditions
- [ ] Active ticket set in `STATE.md`.
- [ ] An unverified step exists (`unverified_step` is not `none`).
- [ ] Baseline snapshot exists (`baselines/T-<id>.md`) or git revision history is intact.

## Steps
1. **Identify Unverified Step Scope:**
   - Read the unverified step description from `STATE.md`.
   - Identify the specific file(s) modified or created during this micro-step.
   - Note the reason for reverting (e.g. repeated test failures, syntax breakage, scope drift, or session pause).
2. **Execute Targeted Rollback (§S5.4, §S5.7):**
   - Restore ONLY the files involved in the unverified step:
     - **With Git:** Run `git checkout <baseline_commit> -- <file_path>` or restore from the latest verified stash/commit for this ticket.
     - **Without Git:** Restore file contents from the baseline backup snapshot recorded in `baselines/T-<id>.md`.
   - If an unverified file was newly created, delete the unverified file cleanly.
   - **CRITICAL:** Do NOT revert files or changes verified in earlier steps of this ticket.
3. **Verify Clean Working State:**
   - Confirm that remaining files compile, pass baseline checks, and match verified evidence.
   - Confirm git status reflects only previously verified ticket changes.
4. **Log Revert Event:**
   - Write event record:
     `events/<UTC-compact>-T-<ticket-id>-step-reverted-step-<seq>.md`
   - Include details of which files were restored and the reason for the rollback.
5. **Clear Unverified State in STATE.md:**
   - Set `unverified_step: none`.
   - If the rollback was triggered by a flawed hypothesis or API misunderstanding, record a short lesson in `lessons/L-<id>.md`.
   - Rebuild `STATE.md`.

## Postconditions
- [ ] Unverified code modifications cleanly removed.
- [ ] Previously verified step changes remain intact.
- [ ] Event `step-reverted` recorded in `events/`.
- [ ] `unverified_step` reset to `none` in `STATE.md`.

## Next
- **Success:** Reformulate approach, write minimal failing test, and retry micro-step.
- **Repeated Failures (>= 3 attempts):** `/af-stuck` — Trigger structured stuck protocol and switch hypothesis.
- **Blocked:** `/af-ask` — Query user if external API or environment behavior is unclear.

## Common Mistakes
- Running a hard repository reset (`git reset --hard`) that destroys all prior verified work on the ticket.
- Leaving stray unverified files or uncommitted remnants in the workspace.
- Failing to log the revert event, breaking audit traceability.
- Immediately retrying the exact same failed edit without altering the approach.

## Footer Template
`Done: reverted unverified step on <ticket-id> (<files-reverted>) | Logged: <event-id> | Next: reformulate approach or /af-stuck | Needs you: nothing`
