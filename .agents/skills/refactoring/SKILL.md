---
name: refactoring
description: Use when restructuring existing code so refactoring happens only via an approved ticket and manifest, stays behaviour-preserving, and drive-by cleanups are refused.
version: 1.0.0
---

# Refactoring

## Purpose
Refactoring is never a drive-by exception. It happens only through an approved ticket and manifest, is behaviour-preserving, and every rename, move, or reformat is recorded so references, indexes, and history stay resolvable.

## When to Use
- A user or review asked for restructuring and a ticket exists.
- A test or build improvement requires restructuring code.
- Deciding whether a noticed cleanup may be folded into the current ticket (it may not).

## Inputs
- Approved ticket and manifest `manifests/T-<id>.md`.
- Baseline `baselines/T-<id>.md` with checksums.
- Regression commands from `environment/`.

## Steps
1. **Require an approved ticket + manifest.** No manifest, no refactoring — regardless of how obvious the improvement looks.
2. **Refuse the drive-by exception.** Reformatting, renaming, moving files, cleanup, comment rewrites, dependency upgrades, lockfile changes, editing generated files, deleting "unused" code, and building abstractions "for later" are all FORBIDDEN unless listed in the manifest with a criterion-linked reason.
3. **Preserve behaviour.** Tests must pass BEFORE the refactor with the same expectations they will have after. Run the regression set before starting; it is the definition of "same behaviour".
4. **Do renames/moves only via the approved manifest**, and record a rename event listing old and new paths. Rename records keep reference paths plus revision/checksum; derived indexes resolve references through rename events; `doctor` reports dangling references after the refactor.
5. **Run formatters only on manifest files.** A formatter run that touches unlisted files is a manifest violation — revert those files.
6. **Work step-by-step** like any implementation: small steps, `/af-verify` after each, never stacking unverified edits.
7. **Close with the regression gate:** full regression set passes with identical expectations, diff matches the manifest, then `/af-diff-check`.

## Checklist
- [ ] Approved ticket + manifest exist; every refactor item has a criterion-linked reason.
- [ ] No forbidden drive-by changes (reformat, rename, move, cleanup, upgrades, deletions).
- [ ] Regression suite passes before starting, with the same expectations after.
- [ ] Renames/moves recorded as rename events with old and new paths.
- [ ] Rename records carry reference paths + revision/checksum; `doctor` shows no dangling references.
- [ ] Formatters ran only on manifest files.
- [ ] Each step verified; diff matches manifest; `/af-diff-check` passed.

## Anti-Patterns
- "While I'm here" reformatting or renaming inside an unrelated ticket.
- Deleting "unused" code without a ticket proving it is unused.
- Upgrading a dependency or touching a lockfile as part of a refactor.
- Editing generated files by hand because regeneration is inconvenient.
- Introducing an abstraction "for later" with no current criterion.
- Loosening a test so the refactored code passes more easily.

## "Stop and Ask the User If…"
- The refactor would exceed the manifest or needs protected paths.
- Tests do not cover the behaviour being restructured (gaps make "behaviour-preserving" unverifiable).
- A rename would break external contracts (public API, published paths).
- The refactor and the ticket's feature turn out to be two separate changes.

## Next Skills
- tdd-implementation
- testing-strategy
- lean-architecture
- project-scaffolding

## Worked Example
Review asks to split `src/parser.ts` (600 lines) into modules. Ticket T-s7t8-split-parser created; manifest lists `src/parser.ts`, new `src/parser/lexer.ts`, `src/parser/ast.ts`, `tests/parser.test.ts`, plus rename events for moved helpers (old path + checksum). Regression run BEFORE: 214 pass. Refactor in 4 verified steps, no expectation changes. Formatters run only on the four manifest files. `doctor`: 0 dangling references. Regression after: 214 pass, same expectations. `/af-diff-check` clean → done.
