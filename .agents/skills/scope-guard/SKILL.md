---
name: scope-guard
description: Use while implementing a ticket to keep edits inside the manifest and the micro-cycle — one logical change, verify, then next.
version: 1.0.0
---

# Scope Guard

## Purpose
Scope guard keeps every pass small, verifiable, and on-manifest. One logical change, verify, then next. Unverified edits are never stacked. Anything found outside the manifest becomes a new ticket or a lesson — never an in-passing fix.

## When to Use
- Before every edit within an active ticket.
- When tempted to "also clean up" or "quickly rename" something nearby.
- When a needed file is not on the manifest.
- When the edit budget or effort budget is being approached or hit.
- When deciding which files a formatter may touch.

## Inputs
- Approved Edit Manifest `manifests/T-<id>.md` (files, budget, criteria).
- Current strictness setting: light (unverified limit ~150 lines), balanced (~50 lines), strict (one file).
- Ticket effort budget from the ticket record.

## Steps
1. **Run the micro-cycle.** One logical change → verify it (test, lint, command) → next change. Never begin a second edit while the first is unverified.
2. **Stay under the unverified limit.** Default: one file or ~50 lines (balanced); light: ~150 lines; strict: one file. Split larger changes into steps.
3. **Reject drive-by changes** unless they are listed in the manifest with a criterion-linked reason. Forbidden without listing:
   - Reformatting, renaming, moving files.
   - Comment rewrites, general cleanup.
   - Dependency upgrades; lockfile churn beyond justified additions.
   - Editing generated files; changing CI/deploy/config.
   - Deleting "unused" code; introducing abstractions "for later".
4. **Restrict formatters.** Formatters run only on manifest files, never on the whole repo.
5. **Handle out-of-manifest findings.** Problems found outside the manifest become a new ticket or a lesson record — not an in-passing fix.
6. **Expand scope formally when a manifest file is genuinely needed.** Stop editing, run /af-expand-scope with: file, why, linked criterion, and the simpler alternative considered. Proceed only after the user approves the expansion record, or split the work.
7. **Watch the edit budget.** If the change exceeds `edit_budget` (files/lines), re-size it or split into a new ticket before continuing.
8. **Honor the effort budget.** If the effort budget is hit, stop and ask: continue, re-size, split, or abandon — record the user's choice and reason.

## Checklist
- [ ] Current change is one logical unit, tied to one criterion.
- [ ] Change size is within the unverified limit for the active strictness.
- [ ] No edit is stacked on an unverified edit.
- [ ] Every file I touched is on the manifest.
- [ ] No drive-by change (reformat/rename/cleanup/upgrade) is present unless listed with a reason.
- [ ] Formatters ran only on manifest files.
- [ ] Out-of-manifest findings logged as new tickets or lessons.
- [ ] Edit budget and effort budget checked before the next step.

## Anti-Patterns
- "While I'm in this file…" refactors outside the manifest.
- Fixing a spotted typo in a non-manifest file in passing.
- Running `prettier`/`gofmt` over the whole repo.
- Making a 300-line change and verifying once at the end.
- Treating a dependency bump or lockfile churn as harmless.
- Silently growing scope instead of invoking /af-expand-scope.
- Deleting "unused" code because it looks dead today.

## "Stop and Ask the User If…"
- An unlisted file is needed — run /af-expand-scope and wait for approval or a split decision.
- The edit budget would be exceeded — ask to re-size or split.
- The effort budget is hit — ask: continue, re-size, split, or abandon.
- Two criteria seem to require conflicting changes — ask which to do first.
- A drive-by change seems genuinely urgent — ask to list it with a criterion-linked reason.

## Next Skills
- change-control
- change-request
- debugging

## Worked Example
Ticket `T-7f1p-add-retry` budget: 1 file / 40 lines. First step: add retry loop (~25 lines) in `src/client.py`, verify with the new failing-then-passing test. Second step: wire the flag (~10 lines), verify. Mid-pass the agent notices `docs/api.md` is stale — it files ticket `T-9q3w-update-api-docs` instead of fixing in passing. The flag needs a config key in `settings.py` (not on the manifest), so the agent stops and runs /af-expand-scope with a rationale and the simpler alternative (hardcode default), waiting for approval.
