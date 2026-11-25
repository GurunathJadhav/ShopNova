---
name: af-verify
description: Execute verification command for an unverified edit step, record evidence, and clear unverified state
phase: implementation, verification, any
tier: 0
actor: both
core: true
---

# /af-verify — Verify Step

## Purpose
Validates the current provisional code change against acceptance criteria and quality rules during the TDD micro-cycle. Executes relevant automated tests, static checks, or command verifications, captures raw output into an evidence record, generates a formal verification record (`verifications/V-<id>.md`), and clears the unverified step lock. Never permits stacking edits on top of an unverified change.

## Preconditions
- [ ] Active ticket claimed (`active_ticket` set in `STATE.md`).
- [ ] Active Edit Manifest approved (`active_manifest` set in `STATE.md`).
- [ ] Edits stay within the manifest and mode step limit (`rapid`/`balanced`: 1 cohesive vertical slice; `strict`: 1 file / ~50 lines).
- [ ] Verification command or runtime check method is identified from ticket criteria.

## Steps
1. **Preflight Step Inspection:**
   - Confirm modified files are strictly listed on the approved Edit Manifest.
   - In `strict` mode, confirm only 1 file step was taken; in `rapid`/`balanced` mode, confirm all files belong to the current cohesive ticket slice.
2. **Execute Real Verification (prefer `.agentflow/scripts/af_test_runner.py` to save tokens):**
   - **Fast Tier 1/2 path:** Optionally scaffold tests first with `python .agentflow/scripts/af_test_runner.py scaffold --ticket <ticket-id> --out <test-file>`, then run:
     `python .agentflow/scripts/af_test_runner.py verify --ticket <ticket-id> --cmd "<test-cmd>" --cmd "<build-cmd>" --criterion <criterion>`
     It automatically captures trimmed output into `evidence/`, writes `verifications/V-<id>.md`, logs `step-verified`, and clears `unverified_step` in `STATE.md`.
   - **Live Runtime Smoke Check (required for UI/web/app tickets):** Actually run/render the app (dev/preview server, headless browser, or DOM integration check), exercise the interactive flows (create/edit/delete/filter/persist), confirm styling loads cleanly, and assert **zero console errors or uncaught runtime exceptions**.
   - Verify that tests are not skipped, assertions are not weakened, and mocks don't hide broken app wiring.
3. **Capture Evidence:**
   - Capture terminal/command output, trimming to the relevant ~200 lines.
   - Write evidence to `.agentflow/evidence/<ticket-id>/<step-slug>.md` with timestamp and command run.
4. **Evaluate Verification Outcome:**
   - **PASS:**
     - Generate verification record: `.agentflow/verifications/V-<4 base32 chars>-<slug>.md` containing:
       - `type: verification`
       - `id: V-<id>`
       - `project_id: <project_id>`
       - `schema_version: 1.0.0`
       - `created: <UTC-compact>`
       - `actor: agent`
       - `role: implementer`
       - `ticket_id: <ticket-id>`
       - `criterion_id: <criterion>`
       - `method: <automated-test|command-output|static-check|etc>`
       - `result: pass`
       - `evidence_ref: evidence/<ticket-id>/<step-slug>.md`
     - Log event:
       `events/<UTC-compact>-<ticket-id>-step-verified-V-<id>.md`
     - Clear `unverified_step: none` in `STATE.md`.
   - **FAIL:**
     - Increment failure counter for this step.
     - If failures < 3: Diagnose failure, apply minimal in-step fix, and re-run `/af-verify`.
     - If failures >= 3: STOP immediately. Do NOT stack further speculative edits. Run `/af-revert-unverified` or `/af-stuck`.
5. **Rebuild STATE.md:**
   - Update `STATE.md` with verified status, recent event, and next action.

## Postconditions
- [ ] Evidence recorded in `.agentflow/evidence/<ticket-id>/`.
- [ ] `.agentflow/verifications/V-<id>.md` created with `result: pass`.
- [ ] Event `step-verified` recorded in `events/`.
- [ ] `unverified_step` cleared in `STATE.md`.

## Next
- **Success (steps remain in manifest):** Proceed with next micro-edit, then `/af-verify`.
- **Success (all criteria/manifest steps complete):** `/af-diff-check` — Run pre-done diff gate.
- **Failure (< 3 attempts):** Fix error within current step and re-run `/af-verify`.
- **Failure (>= 3 attempts):** `/af-revert-unverified` — Revert back to step baseline, or `/af-stuck`.
- **Blocked:** Ask user for pasted command output if execution cannot run in current tier.

## Common Mistakes
- Stacking a second edit before verifying the first edit.
- Deleting, commenting out, or loosening a test assertion to force verification to pass.
- Claiming verification passed without generating an evidence record containing actual output.
- Modifying files not listed on the approved manifest during verification fixes.

## Footer Template
`Done: verified criterion <criterion_id> with V-<id> | Logged: <event-id> | Next: <next-edit-or-/af-diff-check> | Needs you: nothing`
