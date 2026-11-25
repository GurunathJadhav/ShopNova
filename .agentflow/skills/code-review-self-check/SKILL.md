---
name: code-review-self-check
description: Use when the agent has finished implementing a ticket and must run a self-review pass before requesting independent review or calling /af-done.
version: 1.0.0
---

# Code Review Self-Check

## Purpose
Run a disciplined self-review of your own work before anyone else sees it. The self-review is mandatory but never sufficient: it catches mechanical defects early so that independent review (see `independent-review`) focuses on substance, not noise.

## When to Use
- All ticket steps are implemented and verified.
- Before generating the review packet with `/af-review`.
- After any revert, waiver, or scope expansion touched the diff.

## Inputs
- Active ticket (`tickets/T-<id>.md`) with acceptance criteria.
- Approved Edit Manifest (`manifests/`).
- Baseline record (`baselines/`) for the pre-change state.
- Verification records (`verifications/V-<id>.md`) and evidence (`evidence/<ticket>/`).

## Steps
1. **Produce the diff:** Run `/af-diff-check` or `git diff` against the baseline revision. If the tree is not clean, stop and resolve first.
2. **Map every hunk to a criterion:** Walk the diff hunk by hunk. Each change must trace to a criterion on the ticket or a manifest-listed file. Unmapped hunks are drive-by changes — revert them or justify them via `/af-log`.
3. **Scan for hygiene defects:** Remove dead code, unused imports, commented-out code, and whitespace-only churn. Do not reformat files outside the manifest.
4. **Audit test changes:** For every modified or deleted test, record the old expectation and the new expectation in the review notes. Never loosen or delete an assertion to make verification pass — that is a blocking finding against yourself.
5. **Audit your claims:** Every factual statement in the ticket notes or summary must carry a label (`verified` with an evidence ref, `inferred` with a basis, or `unknown`). Promote labels with `/af-label` before done.
6. **Resolve evidence links:** Open each evidence ref cited in verification records. Confirm the file exists and the output actually matches the claim.
7. **Record the pass:** Log a `self-review` event via `/af-log` referencing the diff and any fixes applied. Then request independent review with `/af-review`.

## Checklist
- [ ] Every diff hunk maps to a ticket criterion or manifest file.
- [ ] No drive-by changes, dead code, unused imports, or commented-out code.
- [ ] No whitespace-only churn outside the manifest.
- [ ] Every test change has the old and new expectation recorded.
- [ ] All factual statements labelled `verified`, `inferred`, or `unknown`.
- [ ] Every evidence ref in verification records resolves and matches.
- [ ] Self-review event logged with `/af-log`.

## Anti-Patterns
- Treating the self-review as a substitute for independent review — it is not.
- "Cleaning up" neighbouring files while the manifest is open.
- Rewriting history in records to hide fixes made during self-review; log a new event instead.
- Skimming the diff instead of walking hunk by hunk.

## "Stop and Ask the User If…"
- A hunk is unmapped and reverting it would break verified behaviour.
- A test must change its expectation for the code to pass.
- The diff exceeds the manifest edit budget.
- Evidence referenced by a verification record is missing or contradicts the claim.

## Next Skills
- `independent-review`
- `anti-hallucination-verification`
- `git-workflow`

## Worked Example
Ticket `T-x4kq-login-flow` has criteria C1 (endpoint) and C2 (tests). The agent runs `git diff`, finds an unused `import os` in `auth.py` (removed), and a test whose timeout changed 5s→10s. Old and new expectation are recorded in the review notes; the timeout change is flagged to the owner. All claims are checked: one is still `inferred` (`inferred`: pool size affects latency), so the agent runs `/af-label` with a benchmark before logging the `self-review` event and calling `/af-review`.
