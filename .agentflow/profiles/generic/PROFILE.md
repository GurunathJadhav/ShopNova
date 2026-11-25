---
name: generic
description: Use when the project type is unclear, mixed, or not covered by a specific profile.
version: 1.0.0
---

# Generic Profile

Profiles are defaults and hints — they never override environment facts or approved decisions.

Use this profile only as a starting point. Replace it with a specific profile as soon as the project type is known (via `/af-ask`).

## Question Bank

Ask via `/af-ask` (max 5 per batch, blocking first). Recommended defaults included.

1. **What kind of artifact does this project deliver?** Default: infer from environment facts and code structure; confirm with the owner. Why: everything else depends on it. Blocking.
2. **Who is the user of what we build?** Default: the owner themselves, unless stated otherwise. Why: end-user vs internal-user changes the test and quality bar. Blocking.
3. **Where does it run?** Default: read from environment facts first; ask only if unverifiable. Why: runtime decides portability and deployment criteria.
4. **What must never break?** Default: ask for the one or two critical paths; treat them as protected. Why: focuses the regression set and review effort.
5. **Which language/runtime is fixed vs negotiable?** Default: follow what exists; propose changes only as decisions via `/af-decide`. Why: prevents surprise migrations.
6. **Definition of done for "works"?** Default: ask the owner for one concrete example of correct behavior. Why: vague "works" is the top cause of rework.
7. **Any compliance, licensing, or data-sensitivity constraints?** Default: assume no until confirmed; record the answer as an environment fact. Why: changes verification and approval requirements.

Stop the bank here — for deeper discovery, switch to a specific profile once identified.

## Default Non-Functional Requirements

Defaults only — the user may change any of them. Phrase each as a testable ticket criterion.

- **Correctness:** every acceptance criterion has a verification record with method `test` or `manual` and a result (see `/af-verify`).
- **Build health:** build, lint, and typecheck pass with zero new warnings; any new warning needs justification.
- **No regressions:** existing tests keep passing; a failing previously-green test blocks the ticket.
- **Startup/runtime budget:** if the artifact has a measurable startup or main operation, p95 budget = current value or 500 ms, whichever is larger.
- **Error visibility:** failures produce a clear, actionable message; no silent swallowing of exceptions or ignored results.
- **No data loss:** destructive operations (delete, overwrite) are explicit and confirmed or reversible.

## Test Strategy

- **Highest value:** unit tests for new logic and integration tests for anything crossing a boundary (files, network, processes). These catch most bugs with least setup.
- **Regression set:** whatever test suite exists, plus lint and typecheck. If no suite exists, create one for new code — no tests for legacy code until it is touched.
- **E2E:** only if a critical path was identified in the question bank; one happy-path script per critical path.
- **Contract/visual/load:** skip unless a specific requirement justifies them.
- **Automated:** unit, integration, lint, typecheck, the existing regression suite.
- **Manual-check:** anything the automation cannot reach — real environment behavior, visual output, hardware.
- **User-confirmation:** the owner's concrete "works" example from the question bank; final acceptance on that example.

## Typical Risks

| Risk | L | I | Mitigation |
|------|---|---|------------|
| Wrong project-type assumption skews all planning | Medium | High | Question 1 is blocking; switch to a specific profile early. |
| Scope ambiguity causes rework | High | Medium | Concrete "works" example required before tickets are accepted. |
| Missing test infrastructure blocks verification | Medium | Medium | Create tests with new code; do not retrofit the whole legacy codebase at once. |
| Unknown environment facts cause wrong implementation | Medium | Medium | Verify facts via `/af-env`; mark unverifiable ones as `inferred`. |
| Silent failure modes accumulate unnoticed | Medium | Medium | Error-visibility checklist item on every ticket. |
| Destructive operation loses data | Low | High | Explicit confirmation or reversibility required; baseline recorded first. |

## Ticket Checklist

Add to relevant tickets:

- [ ] Errors produce clear, actionable messages — no silent failures (errors).
- [ ] Empty, missing, or no-input cases handled explicitly (empty states).
- [ ] All entry points require proper credentials; no hardcoded secrets (auth).
- [ ] Where the output is user-visible, usability is at least not worse than before (accessibility as applicable).
- [ ] Behavior on repeat runs is the same as the first run where state allows (idempotency as applicable).
- [ ] No regression in existing behavior — regression suite still green (backwards compatibility).
- [ ] Each acceptance criterion has a verification record before the ticket is accepted.
