---
name: ticket-breakdown
description: Use when user stories are ready and must become exactly one implementation ticket per functionality, with coverage verified before any code is written.
version: 1.0.0
---

# Ticket Breakdown

## Purpose
Decompose stories into one ticket per functionality, sliced vertically, ordered walking-skeleton-first. Verify full coverage in both directions: every in-scope requirement maps to at least one ticket, and every ticket maps to a requirement or a logged justification.

## When to Use
- After user-story-writing produces a complete, unambiguous story set.
- At project start, to build the walking skeleton and test setup.
- After `/af-change` adds scope that needs new tickets.

## Inputs
- User stories with criteria, verification methods, MoSCoW, and size.
- `requirements/REQ-<id>.md` (in-scope = `baselined`).
- Existing test setup and repo structure.

## Steps
1. **Order of work:** walking skeleton and test setup first (thin end-to-end path plus the test harness), then vertical slices, each delivering a user-visible behavior end to end.
2. **Create one ticket per functionality** as `tickets/T-<id>.md` with fields:
   - `id`, `title`, `type` (`story`/`task`/`spike`/`bug`/`change`), `lane`, `size` (`S`/`M`/`L` — `L` must be split), `priority` (MoSCoW), `req_links`.
   - `story` — the persona/capability/benefit line or task rationale.
   - `criteria` — Given/When/Then, one behavior each.
   - `verification` — one declared method per criterion (`automated-test`, `command-output`, `manual-check`, `screenshot/visual`, `static-check`, `document-review`, `user-confirmation`).
   - `dependencies` — ticket ids that must land first.
   - `out_of_scope` — explicitly excluded neighbors, so scope creep is visible.
   - `test_plan` — the exact own-test command for this ticket, the regression set command, and the mapping from manifest files to the test files covering them.
   - `effort_budget` — expected effort; exceeding it is a stop-and-report trigger.
3. **NFRs become cross-cutting criteria:** every non-functional requirement (performance, security, accessibility, i18n) attaches as an explicit criterion to each relevant ticket — not one giant "NFR ticket".
4. **Coverage check, both directions:**
   - Every in-scope REQ → ≥1 ticket.
   - Every ticket → ≥1 REQ, or a logged justification (spike, test setup, chore) in the ticket body.
5. **Check slices:** each ticket leaves the system runnable and demonstrable; reject horizontal-layer tickets ("do all the models").
6. **Record dependencies** so implementation order is unambiguous; cycles mean the slicing is wrong — re-slice.
7. **Hand off** to the implementation flow; tickets are claimed via `/af-ticket`.

## Checklist
- [ ] Walking skeleton + test setup tickets exist before feature slices.
- [ ] One ticket per functionality; no horizontal-layer tickets.
- [ ] All fields filled, including per-criterion verification method and test plan with exact commands.
- [ ] Every ticket has `out_of_scope` notes and an `effort_budget`.
- [ ] Coverage verified: all in-scope REQs covered; all tickets justified.
- [ ] NFRs attached as criteria to relevant tickets, not isolated.
- [ ] No `L`-size tickets; dependency graph is acyclic.

## Anti-Patterns
- "Backend", "frontend", "tests" tickets instead of vertical slices.
- A test plan that says "run the test suite" instead of naming exact commands.
- Tickets without REQ links and without a logged justification.
- NFRs written as prose in one place and never tested anywhere.
- Dependencies forming a cycle, or slices that cannot run independently.

## "Stop and Ask the User If…"
- Coverage is impossible: a REQ has no natural ticket, or a ticket has no REQ.
- A ticket's own-test command cannot be determined from the repo.
- Splitting an `L` changes delivery order the user cares about.
- A dependency requires an external integration credential not yet provided.
- The effort budget for a must-have slice exceeds what the user called reasonable.

## Next Skills
- api-and-data-design
- user-story-writing
- ambiguity-check

## Worked Example
Walking skeleton: T-a1b2-walking-skeleton (`task`, S) — app boots, one plant stored and listed; test plan: own-test `npm test -- plant-list.test.ts`, regression `npm test`.
Slice 1: T-c3d4-add-plant (`story`, must, M, REQ-e5f6-plant-crud) — criteria include "Given empty garden, When a plant is added, Then it appears in the list, verified by `automated-test`"; NFR "input validated client-side" attached as a `static-check` criterion. Out of scope: photo upload. Effort budget: 2 days.
Slice 2: T-g7h8-reminders (`story`, must, M, REQ-a1b2-plant-reminders), depends on T-c3d4.
Coverage: REQ-e5f6 ✓, REQ-a1b2 ✓, REQ-i9j0-reporting (`should`) → T-k1l2-export (planned).
