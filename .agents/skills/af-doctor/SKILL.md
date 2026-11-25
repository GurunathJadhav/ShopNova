---
name: af-doctor
description: Diagnose framework health; report issues with fix commands for each
phase: any
tier: 0
actor: agent
core: false
---

# /af-doctor — Diagnose Framework Health

## Purpose
Runs a comprehensive health check on the `.agentflow/` folder structure, record integrity, policy consistency, and state accuracy. Reports every issue found with a specific fix command for each. Called at session start when something seems wrong, after merges, periodically in maintenance, or when `/af-rebuild` or `/af-reconcile` is about to run.

## Preconditions
- [ ] `.agentflow/` exists (if not, run `/af-start` instead)

## Steps

### 1. Structural checks
- [ ] All required directories exist: `questions/ events/ decisions/ tickets/ manifests/ baselines/ verifications/ approvals/ claims/ blockers/ reviews/ requirements/ glossary/ risks/ lessons/ environment/ waivers/ evidence/ handoff/ spikes/`
- [ ] Required policy files exist: `project.md gates.md lanes.md safety.md protected.md workflow-map.md`
- [ ] Required derived views exist: `STATE.md CHEATSHEET.md APPROVALS-NEEDED.md` (can be rebuilt if missing)

### 2. Project integrity checks
- [ ] Every record file contains `project_id` matching `project.md`
- [ ] No `project_id` mismatches (would indicate a file copied from another project)
- [ ] `schema_version` present in all records

### 3. Event consistency checks
- [ ] Every event filename follows the format: `<UTC-compact>-<ticket-or-none>-<event-type>-<id>.md`
- [ ] No two events have identical filenames
- [ ] Correction events reference existing event ids (no dangling supersedes)
- [ ] No duplicate status-change events for the same ticket to the same status at the same time

### 4. Ticket checks
- [ ] No orphan tickets (tickets with no requirement link and no logged justification)
- [ ] No tickets with `status: in-progress` and no associated manifest
- [ ] No manifests with `status: approved` where the ticket is `done` or `cancelled`
- [ ] No overlapping manifests (two active manifests listing the same file)

### 5. Assumption and question checks
- [ ] No unconfirmed assumptions (`questions/` with `status: assumed` and no user-confirmation event)
- [ ] No open blocking questions while phase is past `discovery`

### 6. Policy file checks
- [ ] `project.md`, `gates.md`, `lanes.md`, `safety.md`, `protected.md` have not been edited without an approved rule-change event
- [ ] `AGENTS.md` managed block matches the current framework version
- [ ] Adapters are not older than the configured staleness period

### 7. STATE.md freshness check
- [ ] `built_from` event id exists in `events/`
- [ ] The derived status of the active ticket in STATE.md matches the event-derived status

### 8. Dangling reference check
- [ ] All `evidence_refs` in event files point to existing files
- [ ] All `req_link` fields in tickets point to existing requirement files
- [ ] Rename events have no dangling old-path references in source files (from outside the rename scope)

### 9. Secret scan (surface-level)
- [ ] Scan record files for patterns matching common secret formats (API key patterns, PEM headers, etc.) — report any found as a potential secret exposure

**For each issue found:** report the specific file, the type of issue, and the exact command to fix it (`/af-reconcile`, `/af-undo-plan`, `/af-rebuild`, `/af-sync`, `/af-rule-change`, `/af-protect`, etc.).

**Output the doctor report** as a structured list. If all checks pass, say so explicitly.

**Log a doctor event.** Write `events/<ts>-none-doctor-<id>.md` with issue count and summary.

## Postconditions
- [ ] Doctor report produced listing all issues found
- [ ] Each issue has a specific fix command
- [ ] Doctor event logged

## Next
- **Success (no issues):** `/af-next` — framework is healthy; continue
- **Issues found:** run the fix command for each issue in severity order; re-run `/af-doctor` after
- **Critical issues (missing policy files, secret exposure):** address these first before any other work

## Common Mistakes
- Running doctor and ignoring the report — every issue must be triaged even if not immediately fixed
- Not re-running doctor after fixes — fixes can introduce new issues
- Treating doctor as a one-time tool — run it periodically and always after merges
- Skipping the secret scan step — a surface-level scan is part of the health check
- Reporting issues without fix commands — every issue in the report must have an actionable fix

## Footer Template
`Done: doctor report — <N> issues found | Logged: doctor event <event-id> | Next: <fix command for highest-severity issue> because <reason> | Needs you: <review report or nothing if healthy>`
