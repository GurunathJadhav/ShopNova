---
name: change-control
description: Use when editing any source, config, or dependency file, or when deciding whether a file may be touched at all — enforces the Edit Manifest, edit lock, and baseline discipline.
version: 1.0.0
---

# Change Control

## Purpose
Change control is the gate between "an agent wants to edit" and "an edit is authorized". Every source/config/dependency edit must trace to an active claimed ticket with an approved Edit Manifest. Anything not listed in the manifest is forbidden.

## When to Use
- Before making any edit to a source, config, or dependency file.
- Before creating, deleting, or moving files or adding dependencies.
- When asked to "just quickly fix" something outside the active ticket.
- When two tickets could touch the same files.
- When starting a ticket and recording its baseline.

## Inputs
- Active ticket `T-<id>` (claimed via /af-start-ticket) or an approved trivial-lane entry.
- Approved Edit Manifest `manifests/T-<id>.md` with recorded pre-edit checklist.
- Baseline `baselines/T-<id>.md` (repo revision + clean tree, or file checksums).
- `protected.md` listing paths that need per-edit approval.

## Steps
1. **Check the edit lock.** Editing is LOCKED by default. Unlock only when ALL hold:
   - An active claimed ticket exists (or approved trivial-lane entry).
   - Its Edit Manifest `manifests/T-<id>.md` is approved.
   - The pre-edit checklist is recorded in the manifest.
2. **Respect the manifest lists.** A manifest must contain:
   - *Allowed to modify*: exact paths or narrow globs tied to criteria.
   - *Allowed to create*: files, dirs, dependencies — highest scrutiny.
   - *Explicitly not touched*.
   - *Edit budget*: max files and max lines by size.
   Anything not listed is forbidden; propose a scope expansion instead.
3. **Check overlap.** Two active manifests may not list the same file. If a file is claimed, the second ticket waits or the owner approves ordering.
4. **Run the verify-before-edit checklist** once per manifest file per ticket (see Checklist below). Reproduce-first for bugs; failing test (red) first for features.
5. **Confirm the baseline.** `/af-start-ticket` records `baselines/T-<id>.md`: repo revision + tree status if git, otherwise manifest files with checksums/copies. The baseline must be clean before edits start.
6. **Edit within the manifest.** Only manifest files, within budget. Keep each edit small and verify it (see scope-guard).
7. **Run the diff gate before done.** Every changed hunk must map to an acceptance criterion. Unmapped hunks are reverted or get a new ticket.
8. **Respect frozen and protected paths.** Code from accepted tickets is frozen — changes need a change/bug ticket; brownfield code starts frozen. Paths in `protected.md` need owner approval per edit.

## Checklist
- [ ] Active claimed ticket exists and is linked in `STATE.md`.
- [ ] `manifests/T-<id>.md` approved and covers exactly what I will edit.
- [ ] Pre-edit checklist recorded in the manifest.
- [ ] `baselines/T-<id>.md` exists with a clean tree status.
- [ ] For each file: current content read; every symbol/API/config key I will use confirmed to exist.
- [ ] Callers of changed code identified and listed.
- [ ] Bug reproduced (reproduce-first) or failing test written (red first).
- [ ] No manifest file is listed by another active manifest.
- [ ] Protected paths get per-edit approval; frozen paths get a new ticket.

## Anti-Patterns
- Editing "just one small thing" without a manifest — there is no trivial exception without approval.
- Broad globs (`src/**`) instead of exact paths or narrow, criterion-tied globs.
- Creating new files or dependencies silently; creation is the highest-scrutiny list.
- Editing a file another active manifest claims.
- Skipping the verify-before-edit checklist because the file "looks familiar".
- Treating accepted/brownfield code as freely editable; it is frozen.
- Editing `protected.md` paths without recorded per-edit approval.

## "Stop and Ask the User If…"
- No ticket is active but an edit is requested — ask to start a ticket or use the trivial lane.
- The manifest does not list a file the task seems to need — propose /af-expand-scope.
- Two manifests overlap on the same file — ask the owner to order or defer one.
- A protected path needs editing — request per-edit approval.
- The baseline is dirty — ask how to clean or commit the working tree first.
- A hunk at the diff gate maps to no acceptance criterion — revert or ask for a new ticket.

## Next Skills
- scope-guard
- debugging
- change-request
- rule-change

## Worked Example
Ticket `T-8k2m-fix-login-404` claims the bug. Its manifest lists: modify `src/routes/auth.py`, `tests/test_auth.py`; create nothing; not touched `src/db/`; budget 2 files / 60 lines. Baseline `baselines/T-8k2m-fix-login-404.md` records revision `a1b2c3d`, tree clean. The agent reproduces the 404 with a failing test, edits only the two listed files, and at the diff gate every hunk maps to criterion AC-1. A stray reformat in `src/db/pool.py` is reverted — it was not in the manifest.
