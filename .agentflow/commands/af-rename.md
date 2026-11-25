---
name: af-rename
description: Rename or move a file via an approved manifest, logging a rename event
phase: any
tier: 0
actor: agent
core: false
---

# /af-rename — Rename / Move a File

## Purpose
Renames or moves a source file through the proper change-control process: the rename must be listed in the approved Edit Manifest, a `rename` event is logged with old and new paths, and derived indexes and records are updated to avoid dangling references. Files cannot be renamed as a "drive-by" change.

## Preconditions
- [ ] An active ticket and approved Edit Manifest exist, and the rename is explicitly listed in the manifest
- [ ] The edit lock is UNLOCKED (active ticket with approved manifest)
- [ ] The file to rename actually exists at the old path (verified, not assumed)
- [ ] No other active manifest lists the same file

## Steps
1. **Confirm the rename is in the manifest.** Read `manifests/<ticket-id>.md`. Find the entry listing the old path and the new path. If not listed, run `/af-expand-scope` before proceeding.
2. **Verify the old file exists.** Read or stat the old path. If it does not exist, stop and report as a discrepancy via `/af-doctor`.
3. **Check for references.** Search for the old filename/path in:
   - Ticket files (`tickets/`)
   - Requirements (`requirements/`)
   - Decision records (`decisions/`)
   - `codemap.md` (if it exists)
   - Any import/require statements in source files within the manifest
4. **Perform the rename.** Move or rename the file as listed in the manifest.
5. **Update references.** Update any import/require statements or documentation references that pointed to the old path, but only within files listed in the manifest. References in records are NOT edited — the rename event resolves them.
6. **Log the rename event.** Write `events/<ts>-<ticket-id>-rename-<ticket-id>.md`:
   ```
   ---
   type: event
   id: EVT-<id>
   event_type: rename
   ticket_id: <ticket-id>
   old_path: <original path>
   new_path: <new path>
   ---
   ## References updated
   - <file>: changed import from <old> to <new>
   ## References not updated (resolved via this event)
   - <record files that still reference the old path>
   ```
7. **Rebuild derived indexes** (`codemap.md`, `traceability.md`) if they reference the renamed file.
8. **Verify the rename.** Confirm the new path exists and the old path is gone. Run the relevant test command if applicable.

## Postconditions
- [ ] File exists at new path, old path is gone
- [ ] Rename event logged with both old and new paths
- [ ] In-source references updated (only within manifest scope)
- [ ] Derived indexes updated
- [ ] `STATE.md` rebuilt

## Next
- **Success:** `/af-verify` — verify the rename did not break anything
- **Failure (file not in manifest):** `/af-expand-scope` — add the rename to the manifest before proceeding
- **Blocked (dangling references in protected records):** `/af-doctor` — report and resolve

## Common Mistakes
- Renaming a file not listed in the manifest — this is a drive-by change; expand scope first
- Not logging the rename event — derived views use the event to resolve old references
- Editing record files to update old path references — records are immutable; the rename event resolves them
- Forgetting to update import statements in source files within the manifest scope
- Renaming a protected file without the manifest explicitly listing it and an approver approval

## Footer Template
`Done: rename event <event-id>, <old> → <new> | Logged: <event-id> | Next: /af-verify because rename done | Needs you: nothing`
