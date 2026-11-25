---
name: af-start
description: Bootstrap a fresh Agentflow installation and initialize project configuration
phase: none
tier: 0
actor: both
core: true
---

# /af-start — Bootstrap Project

## Purpose
Initialize Agentflow in a new or existing repository. Probes agent runtime capabilities to declare an enforcement tier (Tier 0, 1, or 2), proposes a baseline defaults configuration sheet to the project owner, generates a unique `project_id`, initializes `.agentflow/` directory structure, copies policy files, and establishes the initial `STATE.md`.

## Preconditions
- [ ] No active `.agentflow/project.md` exists in the repository root (if `.agentflow/` exists, run `/af-doctor` or `/af-resume` instead).
- [ ] Working directory is repository root.

## Steps
1. **Capability Probe:**
   - Test read/write capabilities (can the agent write files directly to disk? If no -> declare Tier 0).
   - Test command execution capabilities (can the agent execute terminal commands? If yes -> declare Tier 1).
   - Check if automated git hooks, CI pipelines, or MCP servers are available (if yes -> declare Tier 2).
   - Record declared tier (`tier: 0 | 1 | 2`) for environment configuration.
2. **Present Defaults Sheet (with Mode Preset):**
   - Ask project scale first or propose the defaults sheet with recommended preset for explicit owner approval:
     - `strictness`: **`balanced` (recommended default)** | `rapid` (fast MVPs/small solo apps: 3 stages, slice-level verify, solo self-review) | `strict` (full 9-phase enterprise governance)
     - `guidance`: expert (or guided / standard)
     - `user_level`: technical (or non-technical)
     - `discovery_depth`: adaptive (`express` for simple apps, `standard`, or `deep`)
     - `roles`: solo (owner holds all roles) or team
     - `record_language`: en
     - `trivial_lane`: <= 10 lines, <= 2 files (`strict`: <= 5 lines, <= 1 file)
     - `unverified_step_limit`: `1 feature slice` (`rapid`/`balanced`) or `1 file` (`strict`)
     - `edit_budgets`: S = 5 files / 250 lines, M = 12 files / 800 lines, L = must split
     - `ui_craft`: cohesive design tokens + responsive polish (`frontend-and-ui-craft`) + live smoke verification for any UI app
     - `coverage_target`: 80% (per release in `rapid`/`balanced`; per ticket in `strict`)
     - `framework_license`: MIT
   - Request explicit owner approval or customized values (in `rapid` mode, combine defaults approval + initial clarifying questions in one message).
3. **Generate Identity & Directory Layout:**
   - Generate a unique `project_id` (e.g., `proj-4 random base32 chars-name`).
   - Create directory structure under `.agentflow/`:
     - `questions/`, `events/`, `decisions/`, `tickets/`, `manifests/`, `baselines/`, `verifications/`, `approvals/`, `claims/`, `blockers/`, `reviews/`, `requirements/`, `glossary/`, `risks/`, `lessons/`, `environment/`, `waivers/`, `evidence/`, `handoff/`, `spikes/`, `private/`
4. **Initialize Policy Files, GitHub Owner & Git Repository:**
   - Resolve the developer's **current GitHub username** (check `.agentflow/project.md` `owner:` first, or run `gh api user -q .login`, `git config github.user`, `git remote get-url origin` owner, or `git config user.name`). Write that exact username into `project.md` (`owner:`, `approvers:`, `reviewers:`). **Never leave `<owner-name>` or write generic `"owner"` in decisions, confirmations, or approval records.**
   - Write `.agentflow/project.md` with approved defaults, `project_id`, schema version `1.0.0`, and declared tier.
   - Install core policy files: `gates.md`, `lanes.md`, `safety.md`, `protected.md`, and `workflow-map.md`.
   - **Ensure Git is initialized (Tier 1/2):** If `.git/` does not exist (and not inside a parent repo), run `git init -b main`. Ensure `.gitignore` covers `.env`, secrets, dependencies, and `.agentflow/private/`. If `git rev-parse --verify HEAD` fails (no initial commit yet), stage `.gitignore` + `.agentflow/` + `AGENTS.md` and ask owner / create a clean baseline commit so baselines and diffs work from Ticket 1.
5. **Record Initial Facts & Log Bootstrap:**
   - Record initial environment facts in `.agentflow/environment/tier.md` and OS/runtime facts if available.
   - Write initial event record:
     `events/<UTC-compact>-none-bootstrap-project.md`
6. **Build Initial STATE.md & HTML Status Dashboard:**
   - Set `phase: discovery`, `edit_lock: locked`, `tier: <tier>`, `active_ticket: none`, `active_manifest: none`, `unverified_step: none`.
   - Set `next_action`: `/af-ask` — begin requirement and project discovery.
   - Include standard invariants block.
   - Run `node .agentflow/report.js` (if present in Tier 1/2) so `.agentflow/report.html` is initialized from day one.

## Postconditions
- [ ] `.agentflow/project.md` created with valid `project_id` and schema version `1.0.0`.
- [ ] Core policy files present in `.agentflow/` (`gates.md`, `lanes.md`, `safety.md`, `protected.md`, `workflow-map.md`).
- [ ] Directory layout created.
- [ ] Event `events/<UTC-compact>-none-bootstrap-project.md` logged.
- [ ] Initial `.agentflow/STATE.md` generated with invariants and `phase: discovery`.

## Next
- **Success:** `/af-ask` — Start discovery questions to elicit project requirements and scope.
- **Failure:** `/af-start` — Re-probe capabilities and resolve filesystem write permissions.
- **Blocked:** `/af-ask` — If awaiting owner defaults confirmation, wait for owner approval.

## Common Mistakes
- Overwriting an existing `.agentflow/` without running `/af-doctor` or archiving prior state.
- Assuming Tier 1 or Tier 2 without running an actual execution probe.
- Omitting owner approval on the defaults sheet before writing `project.md`.
- Unlocking the edit lock during bootstrap (edit lock MUST remain locked).

## Footer Template
`Done: bootstrapped .agentflow for <project_id> | Logged: <bootstrap-event-id> | Next: /af-ask because discovery phase requires requirement elicitation | Needs you: approve discovery questions`
