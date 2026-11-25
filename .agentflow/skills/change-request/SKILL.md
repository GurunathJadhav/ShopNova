---
name: change-request
description: Use when requirements change after the scope baseline is set, or when scope must be dropped or descaled — routes the change through a logged, approved change request.
version: 1.0.0
---

# Change Request

## Purpose
After the scope baseline, requirements do not shift silently. Any change — addition, rewording, drop, or descope — goes through a change request: logged, impact-assessed, ticketed, and decided in a `decisions/D-<id>.md` record. Records are immutable; changes create new records.

## When to Use
- The user asks to add, change, or remove a requirement after the baseline.
- A ticket turns out to be bigger or smaller than scoped and criteria should change.
- A feature is dropped or descoped mid-project.
- A dependency, platform, or constraint underlying the scope changes.
- Someone asks to "just do it differently now" without a record.

## Inputs
- Current scope baseline (requirements and active tickets).
- The requested change in the user's own words.
- Ticket list and any linked decisions (`decisions/D-<id>.md`).

## Steps
1. **Log the request.** Capture the request verbatim (who, what, when) as a record — do not paraphrase it into something smaller or larger.
2. **Assess impact on tickets.** For each affected ticket, determine: criteria changed? size changed? blocked? obsolete? List the impact explicitly.
3. **Update tickets via records.** Apply the change by creating new ticket records or change records — never by editing old records in place. Records are immutable.
4. **Record the decision.** Write `decisions/D-<id>.md` with the decision type (`one-way`/`two-way`), what changed, and what it supersedes.
5. **Record drops and descopes explicitly.** Removed requirements get a status change record; nothing disappears silently.
6. **Mark anything outside the baseline as needing approval.** Work outside the baseline requires the owner's approval before it starts — link the approval, do not assume it.
7. **Rebuild derived views.** Update `STATE.md` and indexes to reflect the new ticket set.

## Checklist
- [ ] Request logged with the requester's verbatim wording.
- [ ] Impact assessed for every affected ticket, listed in the record.
- [ ] New ticket/change records created; no old records edited.
- [ ] `decisions/D-<id>.md` written and linked.
- [ ] Drops and descopes recorded, not silent.
- [ ] Anything outside the baseline is flagged for owner approval.
- [ ] Derived views rebuilt after the change.

## Anti-Patterns
- Editing requirement or ticket records in place instead of creating new records.
- Treating a verbal "oh, and also…" as already-approved scope.
- Descoping by quietly removing a criterion from a ticket.
- Skipping the impact assessment because the change "looks small".
- Logging the request but never recording a decision.
- Assuming owner approval for out-of-baseline work.

## "Stop and Ask the User If…"
- The change contradicts an existing approved decision — ask whether to supersede it.
- The impact is unclear — ask which tickets should be re-scoped or closed.
- The requester is not the owner and the change is out of baseline — ask the owner to approve.
- A drop would orphan in-progress work — ask whether to finish, park, or discard it.
- The change is a weakening of a policy rule — route through /af-rule-change instead.

## Next Skills
- scope-guard
- rule-change
- change-control

## Worked Example
After baseline, the owner asks: "Search should filter by author too, and drop the date-range filter." The agent logs the request verbatim, assesses impact: `T-3a1k-search-api` gains an author criterion; the date-range criterion is descoped with a recorded status change. It writes `decisions/D-2m9c-search-rescope.md` (`two-way`, supersedes none), creates the new ticket records, flags the author filter as new scope needing owner approval before work starts, and rebuilds `STATE.md`.
