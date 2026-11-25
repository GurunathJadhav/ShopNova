---
name: debugging
description: Use when a bug must be diagnosed or a fix implemented — enforces reproduce-first, the 3-failure loop limit, and write-ahead intent logging.
version: 1.0.0
---

# Debugging

## Purpose
Debugging in Agentflow is evidence-driven: reproduce first, state cause with evidence, then edit. After 3 similar failed attempts the agent stops and changes approach — never keeps trying random fixes. The eventual fix still goes through a bug ticket and manifest.

## When to Use
- A defect is reported and a source fix is needed.
- A test fails for reasons not yet understood.
- Verification keeps failing on the same step.
- Investigation requires experiments before a fix is possible.

## Inputs
- The bug report or failing behavior, verbatim.
- Environment facts and existing evidence records.
- Current ticket and manifest, if a fix ticket is already open.

## Steps
1. **Reproduce first.** Before ANY source edit, reproduce the bug: a failing test or recorded output. State the suspected cause and the evidence. No reproduction, no edit.
2. **Write the failing test (red).** Prefer a test that fails for the right reason; run it and capture the output as evidence.
3. **Open a bug ticket.** The fix goes through a bug ticket with an approved manifest `manifests/T-<id>.md` — debugging does not bypass change control.
4. **Isolate via spike if needed.** If investigation needs experiments, run them in `spikes/` — spikes are never merged. Copy proven findings back as a manifest-listed change.
5. **Log intent before risky multi-file steps (write-ahead).** Record what you are about to change and why, then act.
6. **Fix within the micro-cycle.** Minimal change, verify, record outcome after the step (what happened, evidence link).
7. **Apply the 3-failure loop limit.** After 3 similar failed attempts: stop. Record a blocker `blockers/B-<id>.md`. Switch hypothesis — change the approach or ask. Never keep trying random fixes.
8. **Ship the regression test.** The fix must include a regression test that fails before and passes after. No regression test, no done.

## Checklist
- [ ] Bug reproduced with a failing test or recorded output, before any source edit.
- [ ] Suspected cause stated with evidence.
- [ ] Bug ticket open and claimed; manifest approved.
- [ ] Experiments confined to `spikes/` and never merged.
- [ ] Intent logged before each risky multi-file step.
- [ ] Outcome logged after each step, with evidence.
- [ ] Failure count tracked; stopped at 3 and recorded `blockers/B-<id>.md`.
- [ ] Regression test included in the fix.

## Anti-Patterns
- Editing source while "investigating" — no reproduce, no edit.
- Toggling things at random hoping the symptom disappears.
- Stacking speculative fixes on unverified edits.
- Deleting or weakening a test to make the suite pass.
- Merging spike code into the fix.
- Exceeding 3 failed attempts without a blocker record or hypothesis switch.
- Fixing without a regression test.

## "Stop and Ask the User If…"
- 3 similar attempts failed — record `blockers/B-<id>.md` and ask which new hypothesis to try.
- The bug cannot be reproduced in this environment — ask for logs, steps, or a session recording.
- The cause needs a risky experiment (data mutation, production access) — ask first.
- The fix would exceed the manifest or need a new file — run /af-expand-scope.
- The bug reveals a requirements conflict — route through a change request.

## Next Skills
- change-control
- scope-guard
- incident-response

## Worked Example
Ticket `T-4n8v-cart-total-wrong` reports a rounding bug. The agent first writes `tests/test_cart_total.py::test_rounding_at_2_items` — it fails with output captured to evidence. Cause stated: float division applied before summation. Manifest lists only `src/cart/total.py` and the test file. First fix attempt fails; second fails; third fails → the agent stops, records `blockers/B-2k7h-rounding-cause-unclear`, switches hypothesis from float precision to per-item rounding order, and asks the user to confirm the expected rounding rule. The accepted fix ships with the regression test passing.
