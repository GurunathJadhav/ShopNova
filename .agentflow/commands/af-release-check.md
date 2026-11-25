---
name: af-release-check
description: Run the pre-release checklist before advancing the release gate
phase: verification, review, release
tier: 0
actor: both
core: false
---

# /af-release-check — Pre-Release Checklist

## Purpose
Runs the full pre-release checklist before the owner approves the release gate advance. Verifies that all Must tickets are accepted, the quality profile passes, human blockers on Must tickets are resolved, release notes and rollback notes exist, and the owner explicitly approves the release. Part of the release gate process defined in `gates.md`.

## Preconditions
- [ ] The project is in `verification` or `review` phase (or the release gate is being checked)
- [ ] All Must (MoSCoW) tickets are in `done` or `accepted` state
- [ ] The full regression suite has been run and passed

## Steps
1. **Verify Must tickets.** List all tickets where `priority: must`. Check that every one has `status: done` or `status: accepted` (derived from latest events). List any that are not — the release is blocked until they are.
2. **Run the quality profile.** For each gate in `project.md` `quality_profile`:
   - **formatter/linter clean:** run the formatter check command; paste output as evidence
   - **type check:** run the type checker; paste output
   - **static analysis:** run the static analyser; paste output
   - **dependency audit:** run the dependency audit; paste output
   - **secret scan:** run the secret scanner; paste output
   - **licence check:** run the licence checker; paste output
   - **coverage:** run the coverage command; confirm it meets the target
   - **accessibility check** (if UI): run the accessibility check
   - **performance budget** (if applicable): confirm metrics meet stated targets
   - For any gate that cannot run: mark `unverified`, note it requires owner sign-off
   - Write a verification record `verifications/V-<id>.md` for each gate result
3. **Check open human blockers.** List `blockers/` where `blocker_type: human` and no resolution event exists. Any blocker on a Must ticket blocks release.
4. **Verify release artefacts exist:**
   - Release notes (changelog entry for this release)
   - Rollback note (documented rollback procedure)
   - `environment/` facts are current
5. **Compile the pre-release report.** Present to the owner:
   - Must tickets: all passed / N blocked
   - Quality profile: N/N gates passed, N unverified (need owner sign-off)
   - Open human blockers: N (list them)
   - Release artefacts: present / missing
   - Recommendation: ready to release / blocked by [items]
6. **Ask the owner for explicit go-ahead.** This is a high-risk approval; record verbatim words and countersign.
7. **Log the release-check event.** Write `events/<ts>-none-release-check-<id>.md` with the checklist results and approval id.
8. **Proceed to `/af-gate`** to formally advance to `release` phase.

## Postconditions
- [ ] Every Must ticket confirmed done/accepted
- [ ] Quality profile verification records written
- [ ] Release artefacts confirmed present
- [ ] Pre-release report presented to owner
- [ ] Owner's explicit go-ahead recorded (verbatim, countersign)
- [ ] Release-check event logged

## Next
- **Success:** `/af-gate` — advance to release phase
- **Failure (checklist items fail):** address each failure (bug tickets, missing artefacts); re-run `/af-release-check`
- **Blocked (owner unavailable):** add to `APPROVALS-NEEDED.md`; do not advance gate

## Common Mistakes
- Running the checklist with Must tickets still in progress — all Must tickets must be done first
- Accepting an unverified quality gate without owner sign-off — unverified gates require explicit countersign
- Skipping the rollback note — the owner must know how to roll back before releasing
- Recording gate results without the pasted command output — evidence is required, not just "passed"
- Advancing the gate before the owner's explicit go-ahead — the release gate always requires human approval

## Footer Template
`Done: pre-release checklist complete, verification records <V-ids> | Logged: release-check event <event-id> | Next: /af-gate because release check passed | Needs you: explicit release go-ahead`
