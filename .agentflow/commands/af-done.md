---
name: af-done
description: Complete active ticket after verifying all criteria, diff gate, regression suite, and review sign-off
phase: implementation, verification, review
tier: 0
actor: both
core: true
---

# /af-done — Mark Ticket Done

## Purpose
Formally marks an active ticket as `done`. Enforces the full Definition of Done by lane: ensures every acceptance criterion has verified evidence, `/af-diff-check` has validated all code hunks against criteria, `/af-regression` has passed cleanly, independent review (`/af-review`) has no blocking findings, and quality gates pass. Engages the edit lock upon completion.

## Preconditions
- [ ] Active ticket set in `STATE.md` (`active_ticket: T-...`).
- [ ] No unverified steps pending (`unverified_step: none`).
- [ ] Verification records (`verifications/V-*.md` with `evidence_ref`) exist covering all acceptance criteria (1 combined record per slice valid in `rapid`/`balanced`).
- [ ] `/af-diff-check` and `/af-regression` (including build + live runtime smoke check for UI/apps) passed cleanly.
- [ ] Review completed (`reviews/R-*.md` required in `strict`, `balanced` Standard lane, or when touching protected paths; optional in `rapid` solo mode) with zero blocking findings.
- [ ] For incident lane: reproduction evidence recorded, fix verified, follow-up ticket created.

## Steps
1. **Definition of Done Audit:**
   - Check lane requirements against `lanes.md`:
     - **Trivial Lane:** 1 verification record, diff check against tiny manifest, single log entry.
     - **Standard Lane:** Verification record per criterion, clean diff check, regression pass, independent review, quality profile checks.
     - **Incident Lane:** Reproduction evidence, minimal fix verification, approver sign-off, follow-up ticket for root cause created.
2. **Manifest & Invariant Verification:**
   - Confirm no files outside the approved manifest were modified or left uncommitted.
   - Confirm no assertions were deleted or disabled.
3. **Engage Edit Lock:**
   - Set `edit_lock: locked` in project state. Source editing is immediately disabled.
4. **Close & Refresh (prefer `.agentflow/scripts/af_gate_runner.py` to save tokens):**
   - **Fast Tier 1/2 path:** Run `python .agentflow/scripts/af_gate_runner.py close-ticket --ticket <ticket-id> --actual-min <mins> --actual-tokens "~<N>k" --self-review "<summary>"` — it verifies `V-*` / `R-*`, locks `edit_lock`, logs `ticket-done`, rebuilds `STATE.md`, and refreshes `.agentflow/report.html` + `BUILD-BRIEF.md`.
   - **Manual fallback:** Write `events/<UTC-compact>-<ticket-id>-ticket-done-E-<id>.md` referencing `V-*` and `R-*`, clear `active_ticket`, lock `edit_lock`, rebuild `STATE.md`, and run `node .agentflow/report.js`.

## Postconditions
- [ ] Ticket transition event `events/<UTC-compact>-T-<id>-ticket-done-T-<id>.md` logged.
- [ ] `edit_lock` set to `locked` in `STATE.md`.
- [ ] `active_ticket` and `active_manifest` cleared in `STATE.md`.
- [ ] `STATE.md` rebuilt with ticket reflected as `done`.

## Next
- **Success:** `/af-next` — Determine next ready ticket or advance to epic acceptance/phase gate.
- **Failure (missing evidence):** `/af-verify` — Complete missing criteria verifications.
- **Failure (diff gate unmapped):** `/af-diff-check` — Resolve unmapped diff hunks.
- **Failure (regression failed):** `/af-regression` — Resolve regression failures.
- **Failure (review findings open):** `/af-review` — Resolve open review findings.

## Common Mistakes
- Marking done when an acceptance criterion lacks an associated verification record.
- Skipping independent review before calling `/af-done`.
- Leaving the edit lock unlocked after ticket completion.
- Marking done while modified files contain unmapped debug code or extraneous formatting.

## Footer Template
`Done: closed ticket <ticket-id> as DONE | Logged: <done-event-id> | Next: /af-next because ticket is complete | Needs you: nothing`
