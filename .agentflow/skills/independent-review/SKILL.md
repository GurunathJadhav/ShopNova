---
name: independent-review
description: Use when a Standard ticket's work is complete and the implementation must be reviewed by someone other than the author before done.
version: 1.0.0
---

# Independent Review

## Purpose
Self-review is necessary but not sufficient. This skill produces an independent review packet and routes it to a reviewer who did not write the code, so that findings reflect the work, not the author's reasoning.

## When to Use
- Self-check (`code-review-self-check`) passed and all steps are verified.
- A Standard ticket is ready for done.
- The owner requires review for Must tickets or protected paths.

## Inputs
- Completed ticket with acceptance criteria.
- Edit Manifest and baseline.
- Verification records (`verifications/V-<id>.md`) and evidence (`evidence/<ticket>/`).
- Self-review event from `events/`.

## Steps
1. **Assemble the packet with `/af-review`:** Include ONLY the ticket, acceptance criteria, manifest, diff, and evidence. Do NOT include the author's reasoning, self-review commentary, or interpretations. The reviewer must form their own judgement.
2. **Select the reviewer:** One of — a different agent, a fresh session with no conversation history, or a human. Record which kind as `reviewer_type: agent | human | fresh-session` in the review record.
3. **Check escalation rules:** If the ticket is priority `must`, or the diff touches protected paths, the owner may require `reviewer_type: human`. Do not downgrade this unilaterally.
4. **Reviewer re-runs verification:** The reviewer re-executes the verification commands from the ticket instead of trusting pasted output. If a command cannot be re-run, the reviewer marks that criterion `unverified` — never `pass` on trust.
5. **Write findings to `reviews/R-<id>.md`:** Each finding gets a severity (`blocking`, `major`, `minor`). Record `verdict: approved` or `changes-requested` and `findings_count`.
6. **Act on the verdict:**
   - `changes-requested` with blocking findings: STOP. Fix via the normal ticket flow, then re-review. Blocking findings stop done.
   - Major/minor findings: fix and log; re-review only if the diff changes materially.
   - `approved`: log a `review-approved` event via `/af-log`, then proceed to `/af-done`.

## Checklist
- [ ] Packet contains ticket, criteria, manifest, diff, evidence — nothing else.
- [ ] `reviewer_type` recorded (agent / human / fresh-session).
- [ ] Reviewer re-ran verification commands or marked criteria `unverified`.
- [ ] Findings written to `reviews/R-<id>.md` with severity.
- [ ] Blocking findings resolved and re-reviewed before done.
- [ ] Review verdict event logged with `/af-log`.

## Anti-Patterns
- Sending the author's self-review summary "to save the reviewer time" — it biases the review.
- Reviewer accepting pasted test output as proof.
- Reviewing your own work under a fresh session label.
- Marking a criterion verified because "it passed last time".
- Editing the review record after the reviewer signs it.

## "Stop and Ask the User If…"
- No independent reviewer is available (single agent, no human reachable).
- The owner must approve the reviewer type for a Must ticket or protected path.
- The reviewer cannot re-run a critical verification command and asks for a ruling.
- A blocking finding requires scope expansion beyond the manifest.

## Next Skills
- `code-review-self-check`
- `security-review`
- `git-workflow`

## Worked Example
Ticket `T-x4kq-login-flow` (Standard) is implemented. The agent runs `/af-review`, producing a packet with the ticket, criteria C1–C3, the manifest, the diff, and `V-j8az-auth-unit-tests` evidence — no commentary. A fresh session acts as reviewer (`reviewer_type: fresh-session`), re-runs `pytest tests/auth/` itself, finds C3 (rate limit) missing a test, and files `R-y5nr-auth-pr-review` with one blocking finding. The agent adds the test, re-runs `/af-verify`, and the reviewer approves the revised diff before `/af-done`.
