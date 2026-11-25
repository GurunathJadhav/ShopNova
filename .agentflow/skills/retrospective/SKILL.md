---
name: retrospective
description: Use when an epic ends (after /af-accept) to write dated, ticket-linked lesson records and a prune report from observed skill/command usage.
version: 1.0.0
---

# Retrospective

## Purpose
Turns an epic's raw history into durable, reusable knowledge: short lesson records about what actually happened, plus a usage-driven prune report so unused framework parts can be removed. Prevents the same mistake from recurring in the next epic.

## When to Use
- At each epic end, after `/af-accept` completes.
- After an incident lane ticket or a revert-heavy ticket.
- When the owner explicitly requests `/af-retro`.

## Inputs
- Event log entries for the epic's tickets (`events/`).
- Verification and review records (`verifications/`, `reviews/`).
- Existing lessons (`lessons/`) — read latest entries first; they are part of the session-start L0 cap.
- Usage observations: which skills, rules, and commands were triggered or ignored.

## Steps
1. **Scope the retro:**
   - Confirm the epic is accepted; list its tickets from the event log.
2. **Write lesson records:**
   - Create `lessons/L-<id>.md` per lesson: agent mistakes, wrong assumptions, what worked.
   - Set `category` (`mistake`, `pattern`, `tooling`, `process`) and `ticket_ref`.
   - Keep each lesson short, dated, and concrete — one mistake per record.
3. **Collect usage data:**
   - Note skills/rules/commands never triggered during the epic.
   - Note those that were consistently ignored when applicable.
4. **Write the prune report:**
   - List prune candidates with usage evidence; give the report to the owner. The owner decides — the agent never deletes rules or skills itself.
5. **Close the retro:**
   - Ensure the newest lessons are reachable at session start (within the L0 cap) so the next epic reads them.

## Checklist
- [ ] Every lesson is dated and linked to a ticket via `ticket_ref`.
- [ ] No generic platitudes ("communicate more", "test early").
- [ ] Prune report cites observed non-usage, not opinion.
- [ ] Prune decisions left to the owner.
- [ ] Latest lessons fit within the session-start L0 cap.

## Anti-Patterns
- Writing retro entries mid-epic before evidence exists.
- Generic advice unlinked to any ticket or failure.
- Deleting or editing skills/rules/commands without the owner's decision.
- Writing more lessons than can fit the L0 session-start cap.
- Retro as praise or blame; it is evidence about behavior, not people.

## "Stop and Ask the User If…"
- The epic is not yet accepted and lessons would be based on unfinished work.
- A lesson would expose confidential material the owner has not cleared.
- Prune candidates include core commands the owner may depend on.
- Usage data is missing (no event log) and lessons would be guesswork.

## Next Skills
- session-handoff-resume
- epic-planning
- release-readiness

## Worked Example
Epic "auth-v1" closes after `/af-accept`. Agent writes `lessons/L-1m4z-mock-fs-pitfall.md` (`category: mistake`, `ticket_ref: T-x4kq-login`): "Tests mocked fs at the wrong layer; 3 verify failures before fix. Mock at the adapter boundary." Also `L-2b8n-manifest-early.md` (`category: pattern`, `ticket_ref: T-x7re-signup`): "Pre-approving the manifest with the owner cut one review round." Prune report lists `/af-glossary-export` (never triggered in 14 tickets) and rule `no-inline-sql` (ignored in 4 verifications) for owner review.
