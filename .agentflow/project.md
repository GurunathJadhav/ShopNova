---
project_id: af-prj-ecommerce-2026
name: TEST-ADM-APP
description: Full-stack modern E-Commerce web application with storefront, checkout, auth, and admin dashboard
record_language: en
schema_version: 1.0.0
framework_version: 1.0.0
owner: Gurunath Jadhav
approvers:
  - Gurunath Jadhav
reviewers:
  - Gurunath Jadhav
observers: []
user_level: technical
guidance: expert
discovery_depth: adaptive
strictness: balanced
quality_profile: web-app
---

# Project Configuration
<!-- Template: copied to .agentflow/project.md at bootstrap. Fill in placeholder values during /af-start. -->

## Workflow Modes (`strictness`)
- **`rapid`**: Small apps, MVPs, solo prototypes. 3 fast stages (*Align → Build Slices → Verify & Ship*). Slice-level verification + live app smoke test; self-review allowed in solo mode.
- **`balanced` (default)**: Production apps & daily development. Concise discovery + batched plan confirmation; multi-file vertical slices (`S`/`M` standing approvals in `src/` + tests); runtime + test verification per ticket; structured self-review + automated checks in solo mode.
- **`strict`**: Regulated, high-assurance, or multi-team repos. Full 9-phase lifecycle, 1-file unverified step limit, and mandatory independent review on every Standard ticket.

## Roles

Solo mode: the owner holds all roles (owner, approver, reviewer, observer).
Multi-user: list each person under the appropriate field above.

## Complexity Budget

| Constraint       | Limit                        |
|------------------|------------------------------|
| max_dependencies | <set-during-discovery>       |
| max_layers       | <set-during-discovery>       |

## Standing Approvals

Standing approvals allow the agent to skip per-item approval for low-risk, well-defined actions.
Each use is logged with a reference to the standing approval. Protected paths, deletions, production,
runtime dependencies, scope expansion, and rule changes are **never** covered by a standing approval.

| ID  | Scope                                                                 | Conditions                                  |
|-----|-----------------------------------------------------------------------|---------------------------------------------|
| SA1 | S or M feature manifests touching `src/` and test files (`rapid`/`balanced`) | Files within `src/` and tests; no protected paths (`strict`: S-size only) |
| SA2 | Dev dependencies (permissive licence, ≤2 packages per addition)       | Permissive licence (MIT, Apache-2.0, BSD), max 2 packages |
| SA3 | Trivial-lane tasks (≤10 lines, ≤2 files, non-logic)                    | Meets trivial-lane criteria in `lanes.md`   |

## Quality Profile

Quality gates checked at the indicated frequency. Skip unconfigured tools only with explicit note; core build, test, and live smoke checks are never skipped.

| Gate                  | Command                      | Pass Condition                | Frequency          |
|-----------------------|------------------------------|-------------------------------|---------------------|
| Type check / Build    | `<typecheck-or-build-cmd>`   | Zero errors                   | Per slice / ticket  |
| Linter / Formatter    | `<linter-cmd>`               | Zero errors                   | Per slice / ticket  |
| Automated tests       | `<test-cmd>`                 | All relevant tests pass       | Per slice / ticket  |
| Live app smoke check  | `<start-or-e2e-cmd>`         | Renders/runs, 0 console errors| Per slice / ticket  |
| Accessibility check   | `<a11y-cmd>`                 | Keyboard nav + contrast/labels| Per ticket (UI)     |
| Coverage target       | `<coverage-cmd>`             | ≥ 80% (or mode target)        | Per release (`strict`: per ticket) |
| Dependency & secret scan | `<audit-secret-cmd>`      | Zero findings / vulns         | Per release (`strict`: per ticket) |
| Licence & perf budget | `<perf-licence-cmd>`         | Permissive & within budget    | Per release         |

## Effort Budgets

Size limits for tickets. Exceeding a budget triggers stop-and-ask.

| Size | Max Files | Max Lines | Approx Steps | Approx Retries | Notes                              |
|------|-----------|-----------|---------------|----------------|------------------------------------|
| S    | 5         | 250       | ~4            | 3              | Fits component + styles + tests    |
| M    | 12        | 800       | ~8            | 3              | Fits cohesive vertical feature     |
| L    | —         | —         | —             | —              | Must be split into S or M tickets  |

## Profile

profile: web-app

## Stack

stack: <to-be-determined-during-discovery>
conventions: <to-be-determined-during-discovery>
