---
name: af-diff-check
description: Enforce pre-done diff gate by mapping every modified code hunk to an acceptance criterion
phase: implementation, verification
tier: 0
actor: both
core: false
---

# /af-diff-check — Pre-Done Diff Gate

## Purpose
Enforces the mandatory Diff Gate prior to ticket completion (§S5.9). Generates a complete diff of all changes against the ticket baseline, inspects every individual changed hunk, and verifies that each maps directly to an approved acceptance criterion. Detects and rejects unauthorized file edits, whitespace churn, commented-out dead code, unused imports, new unapproved packages, and unrequested deletions.

## Preconditions
- [ ] Active ticket claimed and in progress (`active_ticket` set in `STATE.md`).
- [ ] All planned micro-steps complete and verified (`unverified_step: none`).
- [ ] Baseline snapshot exists in `baselines/T-<id>.md`.

## Steps
0. **Fast Tier 1/2 Path (Recommended):** Run `python .agentflow/scripts/af_test_runner.py diff-check --ticket <ticket-id>` — checks changed files against the approved manifest, scans added lines for accidental secrets or `debugger`/`pdb` leftovers, writes `evidence/` + `verifications/V-*-diff-check.md`, and logs `diff-checked`.
1. **Generate Diff Against Baseline:**
   - Run `git diff <baseline_commit>` (Tier 1/2) or perform unified line-by-line diff comparison against `baselines/T-<ticket-id>.md` (Tier 0).
   - Capture all additions, modifications, and deletions.
2. **Audit File Paths Against Manifest:**
   - Confirm that EVERY file appearing in the diff is explicitly listed on the approved Edit Manifest (`manifests/T-<ticket-id>.md`).
   - If any file in the diff is off-manifest: **REJECT IMMEDIATELY**. The file must be reverted or approved via `/af-expand-scope`.
3. **Map Every Hunk to Acceptance Criteria (§S5.9):**
   - For every diff hunk (contiguous block of changed lines):
     - Identify which acceptance criterion (`Given/When/Then`) necessitates this exact change.
     - Record the mapping: `<file>:<lines> -> <criterion-id>`.
4. **Scan for Prohibited "Drive-by" Changes:**
   - Flag and reject any of the following anti-patterns:
     - Whitespace-only churn or reformatting outside the required logic.
     - Commented-out code or unused debug logging (`console.log`, `print`, etc.).
     - Unused imports or dangling variables.
     - Deletions of existing functions or tests not justified by a criterion.
     - Package additions not explicitly approved in the manifest.
5. **Evaluate Diff Gate Outcome:**
   - **PASS:**
     - 100% of diff hunks map to valid criteria.
     - 0 unmanifested files or drive-by changes exist.
     - Write diff check record: `.agentflow/verifications/V-<4 base32 chars>-diff-check.md`.
     - Log event:
       `events/<UTC-compact>-T-<ticket-id>-diff-checked-diff-<id>.md`
   - **FAIL:**
     - Report specific unmapped hunks by file and line number.
     - Direct agent to revert unmapped changes or remove extraneous edits.
6. **Rebuild STATE.md:**
   - Record diff gate status in `STATE.md`.

## Postconditions
- [ ] Complete diff audit conducted.
- [ ] Verification record created in `verifications/`.
- [ ] Event `diff-checked` logged upon success.
- [ ] `STATE.md` reflects diff gate clearance.

## Next
- **Success:** `/af-regression` — Run the full regression test suite.
- **Fail (unmapped changes):** Revert unmapped hunks, or run `/af-expand-scope` if genuinely required.
- **Fail (off-manifest files):** Revert unmanifested files immediately.

## Common Mistakes
- Permitting whitespace formatting or stylistic refactorings across unrelated files.
- Marking a ticket done when certain diff hunks serve no documented acceptance criterion.
- Leaving commented-out code in the final diff.
- Hand-waving diff analysis instead of inspecting every individual hunk.

## Footer Template
`Done: completed diff check on <ticket-id> (<hunk_count> hunks verified) | Logged: <event-id> | Next: /af-regression | Needs you: nothing`
