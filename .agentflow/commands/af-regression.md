---
name: af-regression
description: Run the project regression test suite to ensure existing features remain unbroken
phase: implementation, verification, any
tier: 0
actor: both
core: false
---

# /af-regression — Run Regression Tests

## Purpose
Executes the comprehensive project regression test suite (or approved smoke test suite) prior to ticket completion or phase gate advancement (§S6.2). Verifies that newly introduced changes have not broken existing functionality in other modules or prior accepted tickets. Enforces test integrity rules (§S6.3), ensuring no tests were deleted, disabled, or loosened to force a green result.

## Preconditions
- [ ] Pre-done diff check cleared (`/af-diff-check` passed).
- [ ] Active ticket claimed (or project in verification phase).
- [ ] Regression command defined in `environment/` or ticket test selection plan.

## Steps
1. **Identify Regression Test Command:**
   - Consult ticket test plan in `tickets/T-<ticket-id>.md` or project environment setting in `.agentflow/environment/regression-command.md`.
   - Confirm command runs the full relevant test suite or smoke set.
2. **Execute Regression Suite:**
   - **Tier 1/2:** Run command directly in the environment terminal.
   - **Tier 0:** Provide exact regression command to the user and request pasted terminal output.
3. **Audit Test Integrity (§S6.3):**
   - Verify total test count: confirm the number of tests has not dropped.
   - Verify zero skipped tests: confirm no previously active tests were marked skipped, ignored, or disabled.
   - Confirm no test assertions were weakened.
4. **Capture Evidence:**
   - Record test runner output, trimming to summary metrics, test names, and execution times (~200 lines).
   - Write to `.agentflow/evidence/<ticket-id>/regression-<UTC-compact>.md`.
5. **Evaluate Outcome:**
   - **PASS:**
     - All tests pass (0 failures, 0 errors).
     - Write verification record: `.agentflow/verifications/V-<4 base32 chars>-regression.md` containing:
       - `type: verification`
       - `id: V-<id>`
       - `ticket_id: <ticket-id>`
       - `method: automated-test`
       - `command: <regression_cmd>`
       - `result: pass`
       - `evidence_path: evidence/<ticket-id>/regression-<UTC-compact>.md`
     - Log event:
       `events/<UTC-compact>-T-<ticket-id>-regression-passed-V-<id>.md`
   - **FAIL:**
     - Identify failing test cases.
     - If failure is caused by current ticket changes: diagnose and correct the code within manifest bounds.
     - If failure is in unrelated legacy/accepted code: **STOP**. Do not mark ticket done. Create an incident or bug ticket (`/af-ticket`).
6. **Rebuild STATE.md:**
   - Update regression status and set `next_action`.

## Postconditions
- [ ] Raw test output saved in `evidence/<ticket-id>/`.
- [ ] Verification record `verifications/V-<id>.md` created with `result: pass`.
- [ ] Event `regression-passed` logged.
- [ ] `STATE.md` updated with regression pass.

## Next
- **Success:** `/af-review` — Produce independent review packet.
- **Failure (current ticket bug):** Fix failure, run `/af-verify`, then re-run `/af-regression`.
- **Failure (unrelated regression):** Halt `/af-done`, log blocker, and create bug ticket via `/af-ticket`.

## Common Mistakes
- Relying only on unit tests for the current ticket and skipping the broader regression suite.
- Disabling or commenting out failing tests in other modules to achieve a passing build.
- Accepting a regression run that reported skipped or flaky tests without investigation.

## Footer Template
`Done: executed regression suite (<pass_count> passed, 0 failed) | Logged: <event-id> | Next: /af-review | Needs you: nothing`
