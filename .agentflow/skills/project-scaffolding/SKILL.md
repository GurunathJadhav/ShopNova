---
name: project-scaffolding
description: Use when running a scaffolding tool or code generator so the scaffold manifest is approved before execution, output is diffed against it, and lockfiles stay agent-managed.
version: 1.0.0
---

# Project Scaffolding

## Purpose
Scaffolding and generators blast files into the repo faster than a manifest normally allows. This skill makes generator output reviewable: an explicit scaffold manifest is approved before the command runs, the output is diffed against it, and anything unlisted is reverted. The agent runs the package manager and never hand-edits a lockfile.

## When to Use
- Running `npm init`, `create-*`, `npx create-*`, or any code generator.
- Any generator that would create more files than a regular ticket manifest allows.
- The first walking-skeleton scaffold of a new project.

## Inputs
- The exact generator command with its arguments and flags.
- Approved stack decision `decisions/D-<id>.md`.
- Environment facts `environment/<fact>.md`.
- Dependency vetting results `verifications/V-<id>.md` for packages the generator installs.

## Steps
1. **Dry-run the generator first** if it supports it, or list its expected output from its docs.
2. **Write a SCAFFOLD MANIFEST** `manifests/T-<id>.md` listing:
   - The generator command, verbatim, with all flags.
   - Every file the generator will create or modify.
   - `edit_budget` sized for the full generator output.
3. **Get the manifest approved BEFORE running** the command. No approval, no run.
4. **Handle the walking-skeleton exception:** the first scaffold manifest may list protected paths (package manifest, lockfile, test config, CI stub). The approver's approval covers exactly those paths, once — a second run needs a new approval.
5. **Run the generator.** The agent runs the package manager itself; never hand-edit a lockfile.
6. **Diff the output against the manifest.** `git status` / `git diff` plus the lockfile diff.
7. **Revert unlisted files** immediately. If the generator created something not on the manifest, remove it or run `/af-revert-unverified` and re-plan.
8. **Check the lockfile diff** contains only the approved package and its transitive changes. Anything else is a red flag — investigate and revert.
9. **Record verification** `verifications/V-<id>.md` and the diff event, then run `/af-diff-check` before done.

## Checklist
- [ ] Scaffold manifest written with generator command and full file list.
- [ ] Manifest approved before the generator ran.
- [ ] Walking-skeleton protected paths (if any) explicitly listed and approved once.
- [ ] Output diffed against the manifest.
- [ ] Unlisted files reverted.
- [ ] Lockfile edited only by the package manager, never by hand.
- [ ] Lockfile diff contains only approved package + transitive changes.
- [ ] Verification record written.

## Anti-Patterns
- Running `create-*` and asking forgiveness after the files land.
- Hand-editing `package-lock.json` / `pnpm-lock.yaml` to "fix" a resolution.
- Treating generator output as inherently trusted because the tool is popular.
- Re-running the walking-skeleton generator on the strength of the old approval.
- Ignoring lockfile churn because "transitive changes are expected anyway".

## "Stop and Ask the User If…"
- The generator's output cannot be predicted (no dry-run, undocumented behavior).
- The lockfile diff shows changes beyond the approved package and its dependencies.
- Protected-path coverage would need to exceed the first-scaffold allowance.
- The generator wants to install packages with no vetting record.

## Next Skills
- dependency-vetting
- tdd-implementation
- testing-strategy
- lean-architecture

## Worked Example
Ticket T-c4d5-init-repo decides on Vite via `D-f6g7-vite-stack`. Scaffold manifest `manifests/T-c4d5-init-repo.md` lists `npm create vite@latest . -- --template vanilla-ts` and 9 expected files, plus protected paths: `package.json`, `package-lock.json`, `vitest.config.ts`, `.github/workflows/ci.yml`. Approver approves. Agent runs the command; diff shows 9 files + `package.json`/`package-lock.json` — matches. Lockfile diff: only `vite` + transitives. One unlisted `README.md.bak` from the tool → deleted. `/af-verify` records `V-h8i9-scaffold-check.md` as `pass`.
