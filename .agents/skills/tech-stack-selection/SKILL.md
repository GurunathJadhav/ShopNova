---
name: tech-stack-selection
description: Use when starting a project or a major component and a language, framework, or hosting/runtime choice must be made and recorded as a decision.
version: 1.0.0
---

# Tech Stack Selection

## Purpose
Propose technology stacks as explicit options with trade-offs, anchored to verified environment facts and approved decisions. Stack packs are hints, never overrides. The selected stack is recorded as a decision record; irreversible hosting/runtime choices are one-way decisions requiring owner approval.

## When to Use
- At project start, before scaffolding.
- When a ticket requires adding a framework, runtime, or major library.
- When environment facts contradict a stack pack's assumptions.

## Inputs
- Environment facts `environment/<fact>.md` (OS, installed runtimes, versions).
- Approved decisions `decisions/D-<id>.md`.
- Stack packs `stacks/<name>.md` (HINTS ONLY).
- `project.md` Complexity Budget.

## Steps
1. **Read environment facts first.** Load every `environment/<fact>.md` relevant to runtimes and toolchains. These override stack packs.
2. **Check approved decisions.** An existing `decisions/D-<id>.md` for the same concern is binding; do not re-open it silently.
3. **Propose 2-3 stack options.** For each: language/runtime, key frameworks, testing tooling, hosting. State trade-offs in one line each (learning curve, ecosystem, operational cost, exit cost).
4. **Prefer boring, standard technology** the user has already approved or that the ecosystem treats as default.
5. **Verify versions against the project's actual docs** — package registry, official release notes, or the repository — never against memory or a stack pack. Stack packs are HINTS only.
6. **Never override environment facts.** If a stack pack suggests Node 22 but `environment/node-version.md` says Node 20, the fact wins.
7. **Classify the decision:** language/framework choice is usually two-way; hosting or irreversible runtime choice is one-way (options, trade-offs, exit cost, explicit owner approval).
8. **Record the choice** as `decisions/D-<id>.md` with `decision_type` set, link it from the ticket, and update the profile if one exists.

## Checklist
- [ ] All relevant `environment/<fact>.md` read before proposing options.
- [ ] Existing decisions checked for the same concern.
- [ ] 2-3 options with one-line trade-offs presented.
- [ ] Versions verified against actual project docs, not memory or stack pack.
- [ ] Stack pack suggestions never overrode environment facts or approved decisions.
- [ ] Decision recorded as `decisions/D-<id>.md`; one-way decisions carry exit cost and owner approval.

## Anti-Patterns
- Treating a stack pack's version numbers as facts without verification.
- Proposing the fashionable stack when the boring one meets the criteria.
- Re-opening an approved decision because a stack pack disagrees.
- Choosing hosting before checking whether it can be left later (exit cost).
- Picking a stack the user never approved and calling it "the default".

## "Stop and Ask the User If…"
- Environment facts and an approved decision contradict each other.
- The best option is a one-way decision (hosting, runtime) with real exit cost.
- No option fits both the Complexity Budget and the acceptance criteria.
- A required runtime is not installed and installation needs user action.

## Next Skills
- lean-architecture
- dependency-vetting
- project-scaffolding
- testing-strategy

## Worked Example
Project needs a CLI. Environment facts: Node 20 verified installed, Python 3.11 present. Stack pack `stacks/node-cli.md` hints Commander + Vitest — used only as a hint. Options: (1) Node 20 + Commander + Vitest (boring, matches facts, two-way), (2) Python + Typer (fine, but team already ships Node, two-way), (3) Bun runtime (smaller, but not verified installed — rejected). Choose option 1, verify `commander@12.x` against the registry docs, record `decisions/D-e5f6-node-cli-stack.md` as `two-way`.
