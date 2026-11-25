---
name: error-handling-and-logging
description: Use when designing failure behaviour for a ticket's code, or when logging framework state changes to the event ledger.
version: 1.0.0
---

# Error Handling and Logging

## Purpose
Two disciplines in one skill: application error handling (failure states are first-class acceptance criteria) and framework logging discipline (the event ledger records state changes only). Both exist so that behaviour and history are deterministic and auditable.

## When to Use
- Writing ticket criteria for code that can fail, time out, or receive empty input.
- Reviewing that failure paths are as specified as the happy path.
- Logging any framework state change via `/af-log`.
- Performing risky multi-file operations.

## Inputs
- Ticket criteria (must include failure and empty states).
- Event ledger (`events/`).
- STATE.md current state.

## Steps
1. **Specify failure states as criteria:** For each ticket, define acceptance criteria for error cases: invalid input, empty result, timeout, and unavailable dependency. Include the exact user-facing message. An error path without a criterion is incomplete.
2. **Handle, don't crash:** Map expected failures to explicit handling (fallback, retry with backoff, or a clear user message). Unexpected errors surface with context — never swallowed silently.
3. **Log STATE CHANGES ONLY to the ledger:** Event records cover: user answers and approvals, decisions, ticket transitions, verifications, blockers, gates, dependency additions, waivers, reverts, scope expansions, renames, external changes, acceptances, rule changes, pauses, handoffs. Write `events/<UTC>-<ticket>-<type>-<id>.md` via `/af-log`.
4. **Do NOT log routine work:** Individual reads, searches, and edits are not state changes — they are never event records. If everything is logged, nothing is signal.
5. **Write-ahead for risky steps:** Before a risky multi-file operation (bulk rename, migration, mass edit), log an `intent` event naming the files and operation. After completion, log the `outcome` event. The pair is the audit trail.
6. **Never edit records:** Records are immutable. Corrections are new, superseding events — e.g. `event_type: correction` referencing the wrong record. Editing history is a framework violation.
7. **Compact, don't delete:** When `events/` grows long, compaction summarises old events into milestone summaries inside STATE.md — raw records always remain on disk.

## Checklist
- [ ] Every error, empty, and timeout state has a criterion and a user message.
- [ ] No silently swallowed exceptions.
- [ ] Only state changes logged as events via `/af-log`; no read/edit logging.
- [ ] Intent logged before risky multi-file steps; outcome logged after.
- [ ] No record ever edited in place — corrections are superseding events.
- [ ] Compaction keeps raw records; only STATE.md summaries are derived.

## Anti-Patterns
- Catching an exception and continuing without a record or a user message.
- Logging every file read as an event "for completeness".
- Editing an event record to fix a typo — write a correction event instead.
- Performing a bulk operation first and writing the intent event afterwards.
- Deleting old events during compaction.

## "Stop and Ask the User If…"
- An error state's correct user message or fallback is a product decision.
- A bulk operation would touch files outside the approved manifest.
- A previous record must be contradicted and the supersession is ambiguous.
- The ledger shows an outcome that contradicts what the user remembers approving.

## Next Skills
- `anti-hallucination-verification`
- `code-review-self-check`
- `git-workflow`

## Worked Example
Ticket `T-x4kq-login-flow` gets criteria for: invalid credentials → "Invalid email or password", DB timeout → retry twice then "Service temporarily unavailable", empty session list → empty-state screen. Before the agent bulk-renames `auth/*` to `login/*`, it logs `events/20261115T093000Z-T-x4kq-intent-B1ka.md` naming all files; afterwards `…-outcome-…`. Later the agent realises it logged the wrong ticket id in an event — it does not edit the record; it appends a `correction` event superseding the original.
