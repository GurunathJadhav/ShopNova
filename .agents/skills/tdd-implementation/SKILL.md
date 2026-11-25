---
name: tdd-implementation
description: Use when implementing any ticket change so edits follow the micro-cycle and manifest discipline with verify-before-edit, reproduce-first, and one verification record per step.
version: 1.0.0
---

# TDD Implementation

## Purpose
Implement changes as clean vertical slices inside the approved manifest: edit → automated checks + live runtime smoke test → evidence → next. Every feature starts with failing tests (or runtime reproduction for bugs), edits cohesive slice files together (`rapid`/`balanced`: component + styles + tests; `strict`: 1-file micro-step), and never trusts mocked tests without running the real app.

## When to Use
- Implementing any ticket step or vertical slice from an approved manifest `manifests/T-<id>.md`.
- Fixing a bug reported by a failed regression run or manual observation.
- Any source edit, regardless of size or "triviality".

## Inputs
- Approved manifest `manifests/T-<id>.md` and baseline `baselines/T-<id>.md`.
- `project.md` (`strictness`: `rapid` | `balanced` | `strict`) for slice/step limit.
- Ticket acceptance criteria and test/build/start commands from `environment/`.
- Current file contents (plus `frontend-and-ui-craft/SKILL.md` for any UI work).

## Steps
1. **Unit of work (mode-aware):**
   - **`rapid` / `balanced`:** Implement one cohesive **vertical slice** (logic + UI/styling + tests together inside the manifest budget), then verify the working slice with `/af-verify`. Do NOT split component + stylesheet + test into separate stop-and-log cycles.
   - **`strict`:** One micro-step at a time (1 file / ~50 lines) → `/af-verify` → next step.
2. **Verify-before-edit checklist for every manifest file:**
   - Read the current file — do not edit from memory.
   - Confirm every function, type, API, or config key you plan to use actually exists.
   - List the callers of what you are changing.
3. **Features — red first:** write or add failing unit/integration tests for core behavior BEFORE or alongside the slice, observe them failing, then implement to green.
4. **Bugs — reproduce first:** reproduce the bug (failing test or live runtime output) and state the cause before ANY source edit.
5. **Never stack edits across unverified tickets/slices.** Verify or revert the current slice before starting the next.
6. **On failure:** fix within the current slice and re-verify, or run `/af-revert-unverified` back to the baseline. After 3 failures, STOP and run `/af-stuck`.
7. **Complete the slice/step only when all hold:**
   - Automated tests, build, typecheck, and lint pass with pasted output in evidence.
   - **Live runtime smoke check:** Start/render the actual app and verify primary flows + zero console/runtime errors (critical for UI & full-stack slices).
   - Modified files stay within the approved manifest.
   - One verification record `verifications/V-<id>.md` written (1 per ticket/slice in `rapid`/`balanced`).
8. **Advance:** next manifest step, or `/af-diff-check` when all steps are done.

## Checklist
- [ ] Step fits the unverified limit (one file or ~50 lines, per strictness).
- [ ] Verify-before-edit done: file read, APIs confirmed to exist, callers listed.
- [ ] Feature: failing test seen failing first. Bug: reproduced with cause stated first.
- [ ] No second edit made while the current one is unverified.
- [ ] Relevant tests pass with pasted output; build/lint/typecheck pass.
- [ ] Diff matches the manifest; one `verifications/V-<id>.md` written.
- [ ] Failure ≤3 attempts; otherwise `/af-revert-unverified` or `/af-stuck`.

## Anti-Patterns
- Writing the implementation and the test together, then "verifying" both at once.
- Claiming red-green without ever showing the test failing.
- Fixing a bug by reasoning about it without reproducing it.
- Stacking "small" follow-up edits on an unverified step.
- Broadening the diff beyond the manifest to fix something noticed in passing — use a new ticket.

## "Stop and Ask the User If…"
- The step needs to exceed the unverified limit and the strictness profile forbids it.
- You cannot reproduce the bug locally (environment gap, missing credentials).
- Three fix attempts failed for the same step.
- The manifest's file list turns out to be wrong for the change actually needed.

## Next Skills
- testing-strategy
- refactoring
- project-scaffolding
- lean-architecture

## Worked Example
Ticket T-i0j1-username-trim. Manifest allows `src/user.ts` + `src/user.test.ts`. Step 1: read both files; `normalizeUsername` exists, called from `register.ts` (verify-before-edit). Feature, red first: add test `trims surrounding spaces`, run `npm test -- user.test.ts` → fails with pasted output. Implement one-line `.trim()`. `/af-verify`: test green, `tsc --noEmit` and lint pass, diff matches manifest → `verifications/V-k1l2-trim-step.md` as `pass`, unverified lock cleared. Next step begins on a clean, verified baseline.
