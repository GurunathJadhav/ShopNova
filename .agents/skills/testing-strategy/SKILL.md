---
name: testing-strategy
description: Use when planning or executing verification for a ticket so test commands, regression gates, flaky-test handling, and test-integrity rules are applied consistently.
version: 1.0.0
---

# Testing Strategy

## Purpose
Define and apply the test selection map per ticket: which exact commands prove the change, which regression set protects the rest, and how evidence is captured when tests cannot be run. Protects test integrity so green results mean something.

## When to Use
- When writing a ticket's verification plan or testing a change.
- When the first ticket of a project establishes default commands.
- Before declaring any ticket done (regression gate).
- When a test is flaky or cannot run in the current tier.

## Inputs
- Ticket `manifests/T-<id>.md` with acceptance criteria.
- Test commands established in `environment/`.
- Test files and tags for the code being changed.

## Steps
1. **Build the test selection map per ticket:**
   - Exact command for the ticket's own tests.
   - Regression set command (full suite or tagged subset).
   - Mapping from each manifest file to its test file or tag.
2. **First ticket establishes defaults in `environment/`:** record the default test, lint, typecheck, and regression commands as environment facts so later tickets reuse them.
3. **Run own tests first, then the regression gate.** Regression failures in OTHER tickets block done and create a bug ticket — they are not yours to silently fix or ignore.
4. **Handle flaky tests as risks:** log a `risks/` record. Never silently retry until green — a retry needs the flake acknowledged, the cause noted, and the retry recorded.
5. **Cannot-run cases → evidence by user:** give the user the exact commands and ask for pasted output. Record it as evidence with `evidence by: user`. Unverified criteria cannot count as done without owner sign-off.
6. **Enforce test integrity:**
   - No deleting, skipping, or disabling tests.
   - No loosened assertions.
   - No changed expected values to match wrong output.
   - No broad mocks that bypass the code under test.
   - No lowered coverage thresholds without explicit user approval.
7. **Change existing tests transparently:** test files are not protected as a class, but an existing-test change must record the old expectation, the new expectation, and why the old was wrong.
8. **Record outcomes** in `verifications/V-<id>.md` with pasted output as evidence.

## Checklist
- [ ] Test selection map built: own-test command, regression command, file→test mapping.
- [ ] Default commands established in `environment/` by the first ticket.
- [ ] Regression gate run before done; other-ticket failures blocked done + bug ticket.
- [ ] Flaky tests logged as risks; no silent retry-to-green.
- [ ] Cannot-run cases handed to user with exact commands; output pasted as evidence.
- [ ] Test integrity rules upheld (no skips, no loosened assertions, no tuned expectations).
- [ ] Existing-test changes record old expectation, new expectation, and why the old was wrong.

## Anti-Patterns
- Re-running a flaky test in a loop until it passes.
- Deleting a "failing" test instead of investigating it.
- Changing `expected` to match actual output to force green.
- Mocking the module under test and calling the result covered.
- Counting unverified criteria as done because "tests mostly pass".

## "Stop and Ask the User If…"
- Tests cannot run in this tier and user-pasted output is the only evidence path.
- A regression failure suggests the ticket's design conflicts with another ticket.
- Lowering a coverage threshold or skipping a test seems needed.
- The regression suite is too slow or broken to serve as a gate.

## Next Skills
- tdd-implementation
- refactoring
- dependency-vetting
- lean-architecture

## Worked Example
Ticket T-m2n3-export-csv. Selection map: own tests `npm test -- csv.test.ts`; regression `npm test`; map `src/csv.ts`→`tests/csv.test.ts`. Own tests: 2 pass with pasted output. Regression: 1 failure in `tests/invoice.test.ts` — another ticket's behavior. Done is BLOCKED; bug ticket T-o4p5-invoice-regression created. Evidence recorded in `verifications/V-q6r7-csv-tests.md` (`result: pass` for own criteria, regression gate open), `STATE.md` reflects the block.
