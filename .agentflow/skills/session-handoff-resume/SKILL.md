---
name: session-handoff-resume
description: Use when starting or ending a session, after context compaction or reset, or after a ticket transition to re-ground from STATE.md and produce a complete handoff.
version: 1.0.0
---

# Session Handoff & Resume

## Purpose
Guarantees that any fresh agent can continue work with no memory of the prior session. Context is layered (L0/L1/L2) so re-grounding is cheap and the active ticket, blockers, and next action are never lost from budget.

## When to Use
- Session start (`/af-resume`).
- After any context compaction, reset, or window restart.
- After every ticket transition (claim, done, accept).
- After every 10 micro-steps of work.
- Session end or `/af-pause` (handoff direction).

## Inputs
- `.agentflow/STATE.md` (L0 — always read first).
- Active ticket file, its manifest, criteria, and linked decisions (L1).
- Full event log or specific records (L2 — targeted lookup only).

## Steps
1. **Re-ground (resume cleanly without pollution):**
   - Read `STATE.md` and (if implementing) `.agentflow/BUILD-BRIEF.md` first — always. Confirm `built_from` revision is current; if stale, rebuild incrementally.
   - Load L1: ONLY the single active ticket, its manifest, criteria, and linked decisions.
   - Use L2 targeted lookups only when needed; **never** bulk-read `questions/`, old `events/`, or unrelated docs during coding.
   - Check invariants in `STATE.md`; if one is violated, stop and reconcile.
2. **Resolve pending intents:**
   - Before creating any record, check whether an equivalent record already exists (idempotency).
   - If a `/af-resume` reveals an intent event without an outcome: inspect actual state, then write the missing outcome event or a failure record. Never assume the step succeeded or failed.
   - Leave duplicate resolution to correction events in `/af-reconcile`.
3. **Maintain budget during work:**
   - After every 10 micro-steps, re-read `STATE.md` and its invariants.
   - Token budget must always keep: active ticket, blockers, next action.
4. **Handoff (pause/end):**
   - Update `STATE.md` to reflect the true current state.
   - Write `handoff/<date>.md` summarizing: last completed step, in-progress step, blockers, next action.
   - Confirm a fresh agent reading only `STATE.md` could continue.

## Checklist
- [ ] `STATE.md` read first, before any other file.
- [ ] `built_from` checked; stale view rebuilt incrementally.
- [ ] Intent events without outcomes resolved by inspecting real state.
- [ ] No new record duplicates an existing equivalent.
- [ ] `handoff/<date>.md` written at pause or session end.
- [ ] Fresh-agent test: could someone continue from `STATE.md` alone?

## Anti-Patterns
- Reading the full event log or all tickets when `STATE.md` answers the question.
- Assuming a step succeeded because an intent event exists.
- Ending a session without updating `STATE.md` or writing a handoff file.
- Duplicating records instead of writing correction events.
- Carrying blockers or the next action out of token budget.

## "Stop and Ask the User If…"
- `STATE.md` is missing entirely or its invariants contradict each other.
- `built_from` is stale and an incremental rebuild cannot resolve the conflict.
- Two claims or records conflict and `/af-reconcile` cannot decide which is real.
- The handoff would need to invent a next action the owner never specified.

## Next Skills
- delegation
- retrospective
- reconciliation-basics

## Worked Example
Agent resumes after a crash. L0: `STATE.md` says `active_ticket: T-x4kq-login`, `unverified_step: edit-3`, blocker `B-81ka-missing-api-credentials`. L1: ticket file shows edit-3 = "add rate limiter". An intent event `step-edited` exists with no outcome. Agent inspects the working tree: the rate limiter is present and compiles, so it writes a `step-outcome: success` event, then proceeds to `/af-verify`. Later, `/af-pause`: agent updates `STATE.md` (next action: verify edit-3) and writes `handoff/20261115.md`.
