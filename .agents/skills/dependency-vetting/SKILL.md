---
name: dependency-vetting
description: Use before adding ANY package or dependency so supply-chain risks are checked, the addition is approved, and the result is recorded in a verification record.
version: 1.0.0
---

# Dependency Vetting

## Purpose
Run mandatory supply-chain checks before any package enters the project. Hallucinated package names, typosquats, install scripts, and unmaintained libraries are real attack routes. Additions require user approval unless covered by standing approvals in `project.md`, and every check is recorded as a verification record.

## When to Use
- Before installing any new package, directly or transitively via a generator.
- Before upgrading a dependency across a major version.
- Whenever a stack pack or scaffold generator would pull in unvetted packages.

## Inputs
- `project.md` — Complexity Budget and standing approvals for dependencies.
- Environment facts `environment/<fact>.md` (registry, package manager).
- Existing dependency list from the package manifest.

## Steps
1. **Confirm the package exists in the official registry.** Query the registry directly (npmjs.com, PyPI, crates.io). Hallucinated names are an attack route — never install from a name you have not confirmed.
2. **Check the name matches the intended project.** Look for typosquats: near-identical names, swapped characters, wrong scope. Verify the exact scope (`@org/pkg`).
3. **Verify publisher and repository match.** The registry entry must point to the expected source repository; author/organization should match the documented maintainer.
4. **Inspect release history and age.** Prefer versions ≥14 days old. A version published days ago without urgency is a red flag.
5. **Check maintenance signals:** recent commits, open issues triaged, downloads, documented maintainers. Abandoned packages need a decision, not a silent install.
6. **Check the licence** is compatible with the project and approved decisions.
7. **Inspect install scripts and size.** Postinstall/preinstall scripts are dangerous by default. Note package size and transitive dependency count against the Complexity Budget.
8. **Prefer alternatives:** standard library first, then an already-used dependency that covers the need.
9. **Run the ecosystem audit before and after** (`npm audit` / `pip-audit` / `cargo audit` — per project toolchain). Record both outputs.
10. **Pin the exact version** — no `^` or `~` ranges — in the package manifest via the package manager.
11. **Get user approval** unless `project.md` lists a standing approval covering this package. Record results in `verifications/V-<id>.md` with `method: audit`.

## Checklist
- [ ] Package confirmed to exist in the official registry.
- [ ] Name checked against typosquats; scope exact.
- [ ] Publisher and repository match the intended project.
- [ ] Release history checked; version ≥14 days old (or justified).
- [ ] Maintenance signals, licence, install scripts, size, transitive count reviewed.
- [ ] Standard library / existing dependency alternative considered first.
- [ ] Audit run before and after; both outputs captured.
- [ ] Exact version pinned; no ranges.
- [ ] Results recorded in `verifications/V-<id>.md`; user approval obtained or standing approval cited.

## Anti-Patterns
- Installing a package because a model or blog post named it, without a registry check.
- Accepting `^`/`~` ranges because "semver is fine".
- Skipping the pre-install audit because "the package is popular".
- Treating a standing approval as covering unrelated packages.
- Adding a dependency when a stdlib or in-repo function already does the job.

## "Stop and Ask the User If…"
- Any red flag appears: new version, mismatched repository, install scripts, single maintainer.
- The package exceeds the Complexity Budget's max dependencies.
- No standing approval covers the package and the user has not responded yet.
- The licence is unclear or copyleft in a way that could affect distribution.

## Next Skills
- lean-architecture
- project-scaffolding
- tech-stack-selection
- refactoring

## Worked Example
Ticket T-b7c8-add-validation wants schema validation. Stdlib check: nothing fits complex nested schemas — one-line justification tied to the criterion. Registry check confirms `zod` exists, scope-free, repository matches `colinhacks/zod`, `3.23.8` published >14 days ago, MIT, no install scripts, 1 transitive dep. `npm audit` before: 0 vulns. Standing approval in `project.md` does not cover it → ask user → approval recorded. Pin `zod@3.23.8`, `npm audit` after: 0 vulns, write `verifications/V-d9e0-zod-vetting.md` with `result: pass`.
