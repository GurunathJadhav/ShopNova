# Agentflow Command Cheat Sheet
<!-- Template: .agentflow/CHEATSHEET.md — Quick reference for all Agentflow commands. Disposable derived view. -->

Agentflow organizes all agent actions into typed, gated commands.
Every command checks **preconditions** before running, logs **events**, and guarantees **postconditions**.

---

## 1. Core Commands (8)

These 8 commands cover the primary development workflow loop. All other commands are advanced operations recommended via `/af-next`.

| Command | One-Line Description | Allowed Phases |
| :--- | :--- | :--- |
| `/af-start` | Initialize project discovery, answer intake questions, and establish requirements baseline | `discovery` |
| `/af-next` | Inspect `STATE.md`, query workflow map, and recommend the single next valid action | `any` |
| `/af-ask` | Ask the human user a blocking question to resolve ambiguity or missing requirements | `any` |
| `/af-ticket` | Create a new structured ticket with user story, Given/When/Then criteria, and lane | `tickets`, `planning`, `maintenance` |
| `/af-verify` | Execute verification commands (tests, linters, types) and record evidence in a V-record | `implementation`, `verification`, `review` |
| `/af-done` | Mark active ticket completed after verifying criteria, review sign-off, and clean diff | `verification`, `review` |
| `/af-status` | Display current runtime state, active ticket, blockers, open questions, and next action | `any` |
| `/af-help` | Display guidance on commands, workflow rules, phases, lanes, and recovery procedures | `any` |

---

## 2. Advanced Commands

Advanced commands handle specialized lifecycle steps, safety controls, change management, and error recovery.

### Discovery & Baseline
| Command | One-Line Description | Allowed Phases |
| :--- | :--- | :--- |
| `/af-assume` | Record an assumption requiring human confirmation before it can justify edits | `discovery`, `requirements`, `planning` |
| `/af-confirm-understanding` | Present a structured synthesis of project understanding for owner discovery sign-off | `discovery` |
| `/af-env` | Probe and record verified environment facts (OS, runtime, compilers, package manager) | `discovery`, `maintenance`, `any` |
| `/af-glossary` | Record or update a domain concept or project term definition in the glossary register | `discovery`, `requirements`, `any` |

### Requirements & Traceability
| Command | One-Line Description | Allowed Phases |
| :--- | :--- | :--- |
| `/af-requirements` | View the requirements register, priorities (MUST/SHOULD/MAY), and status | `requirements`, `tickets`, `planning`, `any` |
| `/af-coverage` | Analyze requirement-to-ticket and requirement-to-test traceability coverage | `requirements`, `tickets`, `planning`, `verification` |

### Tickets & Intake
| Command | One-Line Description | Allowed Phases |
| :--- | :--- | :--- |
| `/af-intake` | Process an incoming bug report, feature request, or idea through the intake checklist | `tickets`, `maintenance`, `any` |
| `/af-start-ticket` | Claim a ready ticket, create working branch, and initialize Edit Manifest and baseline | `planning`, `implementation` |
| `/af-reopen` | Reopen a previously closed ticket linked to a verified regression or bug report | `tickets`, `maintenance` |
| `/af-lane-change` | Request a ticket lane change (trivial, standard, incident) with recorded justification | `planning`, `implementation` |

### Change Control & Planning
| Command | One-Line Description | Allowed Phases |
| :--- | :--- | :--- |
| `/af-build` | Generate clean `BUILD-BRIEF.md` & fresh-session build loop prompt to prevent context pollution | `planning`, `implementation`, `any` |
| `/af-edit-plan` | Generate and submit an Edit Manifest (allowed files, budgets, criteria) for approval | `planning`, `implementation` |
| `/af-expand-scope` | Request human approval to modify additional files not listed on the active manifest | `implementation` |
| `/af-change` | Process a formal Change Request (CR) modifying requirements, architecture, or scope | `any` |
| `/af-rule-change` | Propose, review, and record an approved alteration to policy files or framework rules | `any` |
| `/af-rename` | Safely rename a file or symbol, checking all references and updating the manifest | `implementation` |
| `/af-sync` | Detect external human changes or out-of-band repository edits and reconcile state | `any` |

### Verification & Quality
| Command | One-Line Description | Allowed Phases |
| :--- | :--- | :--- |
| `/af-diff-check` | Compare uncommitted changes against the approved manifest and baseline before review | `implementation`, `verification` |
| `/af-regression` | Run full project test suite to verify untouched areas remain intact and passing | `verification`, `release` |
| `/af-revert-unverified` | Revert unverified, off-manifest, or failing modifications back to clean baseline | `implementation`, `verification` |
| `/af-audit` | Re-run recorded verification commands to independently re-confirm historical claims | `verification`, `review`, `any` |

### Review & Acceptance
| Command | One-Line Description | Allowed Phases |
| :--- | :--- | :--- |
| `/af-review` | Perform independent code and design review with severity-rated findings (P1–P4) | `review` |
| `/af-accept` | Run demonstration script for project owner milestone acceptance or rejection | `review`, `release` |
| `/af-retro` | Facilitate milestone or epic retrospective and extract actionable lessons learned | `review`, `maintenance` |
| `/af-release-check` | Execute comprehensive pre-release quality profile checklist and security audit | `release` |
| `/af-gate` | Evaluate phase exit criteria and advance project to the next lifecycle phase | `any` |

### Decisions & Knowledge
| Command | One-Line Description | Allowed Phases |
| :--- | :--- | :--- |
| `/af-decide` | Record an Architecture Decision Record (ADR) with context, options, and consequences | `discovery`, `planning`, `implementation`, `any` |
| `/af-lesson` | Record an operational lesson, agent error pattern, or reusable implementation tip | `any` |
| `/af-label` | Promote an environment or code fact label from `inferred` to `verified` with evidence | `any` |
| `/af-spike` | Timebox an exploratory spike in `spikes/` with written findings; never merged | `discovery`, `planning`, `implementation` |

### Tracking & Reporting
| Command | One-Line Description | Allowed Phases |
| :--- | :--- | :--- |
| `/af-report` | Generate a plain-language executive status summary (progress, blockers, risks) | `any` |
| `/af-approvals` | Display all pending human approvals, rule changes, and countersign requirements | `any` |
| `/af-blockers` | List and manage open technical and human blockers impeding ticket progress | `any` |
| `/af-log` | Log an explicit state change or operational milestone event into `events/` | `any` |

### Safety & Governance
| Command | One-Line Description | Allowed Phases |
| :--- | :--- | :--- |
| `/af-protect` | Mark a sensitive file or directory path as protected, requiring explicit approval | `any` |
| `/af-waive` | Record an explicit, timebound human owner waiver for a specific gate or rule | `any` |
| `/af-strictness` | Adjust project strictness level (`strict`, `standard`, `permissive`) with owner consent | `any` |
| `/af-incident` | Declare incident lane for emergency fixes, freezing normal ticket work | `any` |
| `/af-stuck` | Trigger stuck/drift diagnostics when repeated attempts or loops fail progress | `any` |

### Recovery & Continuity
| Command | One-Line Description | Allowed Phases |
| :--- | :--- | :--- |
| `/af-why` | Explain why a specific command is recommended or why a gate constraint applies | `any` |
| `/af-pause` | Safely pause active work, write handoff summary, and update `STATE.md` | `any` |
| `/af-resume` | Resume paused work, inspect write-ahead intents, and reconcile idempotency | `any` |
| `/af-handoff` | Generate a formal session handoff document for a fresh incoming agent | `any` |
| `/af-undo-plan` | Safely undo or cancel an action via a compensating correction event (never delete) | `any` |
| `/af-reconcile` | Resolve duplicate records, stale leases, or branch merge discrepancies | `any` |
| `/af-rebuild` | Deterministically rebuild `STATE.md`, indexes, and derived views from raw events | `any` |
| `/af-doctor` | Validate framework integrity, file naming, front-matter schemas, and consistency | `any` |

---

## 3. Workflow Flowchart

```
[discovery] ──/af-start──> [requirements] ──/af-gate──> [tickets]
                                                               │
                                                           /af-gate
                                                               │
                                                               v
[review] <──/af-verify── [implementation] <──/af-edit-plan── [planning]
   │                           │
/af-done                  /af-diff-check
   │                           │
   v                           v
[release] ──/af-release-check──> [maintenance]
```

---

## 4. Standard Reply Footer

Every agent turn modifying state or completing a command MUST terminate with the standardized footer:

```
Done: <files/records produced> | Logged: <event ids> | Next: <command> because <reason> | Needs you: <approvals/questions or "nothing">
```
*(In expert mode without state modification, a short `Next: <command>` line is sufficient.)*
