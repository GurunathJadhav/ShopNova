---
name: lean-architecture
description: Use when designing a feature, choosing an abstraction, or adding a dependency so the simplest solution that meets the acceptance criteria is chosen before any code is written.
version: 1.0.0
---

# Lean Architecture

## Purpose
Enforce a mandatory simplicity gate before adding **code/infrastructure complexity** (dependencies, wrapper layers, micro-patterns, config knobs). Every addition of architectural complexity must be justified against a concrete requirement, while **visual polish, UX ergonomics, and defensive edge-case handling are never cut in the name of simplicity**.

## When to Use
- Before designing a backend, data model, state architecture, or API contract.
- Before proposing any new third-party dependency, abstraction layer, or config option.
- When building UI components: pair this skill with `frontend-and-ui-craft` so architecture stays lean while UI looks cohesive and complete.

## Inputs
- Ticket `manifests/T-<id>.md` with acceptance criteria.
- Approved decisions `decisions/D-<id>.md`.
- Environment facts `environment/<fact>.md`.
- `project.md` (Complexity Budget: max dependencies, max layers).

## Steps
1. **Run the Simplicity Gate (mandatory, before design or code).** For the proposed solution answer in writing:
   - (a) What is the simplest solution that meets the criteria?
   - (b) Why is anything more needed? Cite a criterion the simple version fails.
   - (c) What would it cost to add it later (YAGNI)? If later cost is low, defer it now.
   - If (b) has no criterion-linked answer, the simple solution wins.
2. **Justify or reject each addition.** Every new dependency, abstraction, pattern, service, or config option needs a one-line justification tied to an acceptance criterion. No justification → rejected.
3. **Respect the Complexity Budget.** Check `project.md` for max dependencies and max layers. A proposal that exceeds the budget is rejected or escalated to the user with a budget-change question.
4. **Prefer boring, standard technology** the user approved. Novel or fashionable choices require an explicit decision record.
5. **Type each decision two-way or one-way:**
   - Two-way (light scrutiny, easily reversible): record as `decisions/D-<id>.md` with `decision_type: two-way`.
   - One-way (data model, public API, hosting, licence, irreversible migrations): record options, trade-offs, and exit cost; status stays `proposed` until the owner approves.
6. **Create design artifacts only on demand.** UX flows, data model, API contract, CI, observability are produced only when a ticket or profile calls for them — never speculatively.
7. **Record the choice** as a decision record and link it from the ticket before implementation begins.

## Checklist
- [ ] Simplicity gate answered (a), (b), (c) in writing before any design or code.
- [ ] Every added dependency/abstraction/pattern/config has a one-line criterion-linked justification.
- [ ] Proposal fits the Complexity Budget in `project.md`.
- [ ] Technology choice is boring, standard, and user-approved.
- [ ] Decision recorded as `decisions/D-<id>.md`; one-way decisions approved before proceeding.
- [ ] No design artifacts created without a ticket or profile calling for them.

## Anti-Patterns
- Designing layers, interfaces, or plugin systems "for later".
- Adding a dependency because it is popular rather than because a criterion demands it.
- Treating the simplicity gate as a formality filled in after the design is fixed.
- Exceeding the Complexity Budget silently and hoping review misses it.
- Writing an API contract or observability plan no ticket asked for.
- **Using "simplicity" as an excuse to ship unstyled HTML, broken responsive layouts, or missing empty/error/loading states.** Keep plumbing simple; keep product quality high.

## "Stop and Ask the User If…"
- The only compliant design exceeds the Complexity Budget.
- A one-way decision (data model, public API, hosting, licence, irreversible migration) has more than one credible option.
- Two acceptance criteria pull toward designs of different complexity.
- You cannot find a boring standard option that meets the criteria.

## Next Skills
- tech-stack-selection
- dependency-vetting
- project-scaffolding
- testing-strategy

## Worked Example
Ticket T-a1b2-add-cache says "reduce p95 read latency to <50ms". Gate: (a) simplest solution — an in-memory LRU map, stdlib only, no new dependency. (b) More needed? Only if multi-process deployment is a criterion — it is not. (c) Later cost of switching to Redis is moderate; accept the risk. Record `decisions/D-c3d4-in-memory-lru.md` as `two-way`. Zero dependencies added; Complexity Budget unchanged; implementation proceeds under a normal manifest.
