---
name: af-env
description: Probe and record verified environment facts, runtime versions, and build commands with evidence
phase: planning, discovery, any
tier: 0
actor: both
core: false
---

# /af-env — Record Environment Facts

## Purpose
Probes, validates, and records concrete facts about the local and target development environment into `.agentflow/environment/<fact>.md` (§S16). Captures operating system details, runtime versions, package managers, test runners, linters, and compiler versions. Labels each fact as `verified` (backed by captured evidence), `inferred` (based on repository analysis), or `unknown`. Prevents agents from hallucinating commands or runtime flags.

## Preconditions
- [ ] Project initialized with `.agentflow/project.md`.
- [ ] Target environment or tool is accessible for probing.

## Steps
0. **Fast Tier 1/2 Path (Recommended):** Run `python .agentflow/scripts/af_records.py env-probe` — automatically detects OS, Node, Python, Git, package manager, and `package.json` scripts, writing `.agentflow/environment/runtime.md`, `.agentflow/environment.md`, and logging the event in one call.
1. **Identify Target Environment Fact:**
   - Determine the fact category:
     - `os-platform`: Operating system, architecture, default shell.
     - `runtime`: Version of Node.js, Python, Rust, Go, Java, .NET, etc.
     - `package-manager`: Version and tool (pnpm, npm, yarn, poetry, cargo, etc.).
     - `test-command`: Exact test invocation command and flags.
     - `regression-command`: Full suite regression command.
     - `build-command`: Project compile/build command.
     - `linter-command`: Linter and typechecker invocation.
2. **Execute Verification Probe:**
   - **Tier 1/2:** Run the probe command (e.g. `node -v`, `pytest --version`, `rustc --version`).
   - **Tier 0:** Ask user for environment details or pasted terminal output.
3. **Capture Evidence & Assign Label (§S6.1):**
   - Save probe terminal output to `.agentflow/evidence/environment/<fact-slug>.md`.
   - Label status:
     - `verified`: Probe executed successfully and output verified.
     - `inferred`: Inferred from config files (e.g. `package.json`, `Cargo.toml`), not yet confirmed by execution.
     - `unknown`: Tool or version could not be determined.
   - *Rule:* Inferred facts cannot justify commands in ticket manifests until promoted.
4. **Write Environment Fact Record:**
   - Create `.agentflow/environment/<fact-slug>.md` with front matter:
     - `type: environment_fact`
     - `id: env-<fact-slug>`
     - `project_id: <project_id>`
     - `schema_version: 1.0.0`
     - `created: <UTC-compact>`
     - `actor: agent`
     - `role: investigator`
     - `label: <verified|inferred|unknown>`
     - `command: <probe-command>`
     - `evidence_path: evidence/environment/<fact-slug>.md`
   - Document the extracted facts, version strings, and usage conventions in the body.
5. **Update Derived Index:**
   - Regenerate `.agentflow/environment.md` summarizing all active environment facts.
6. **Log Event & Update State:**
   - Write event:
     `events/<UTC-compact>-none-env-fact-recorded-env-<fact-slug>.md`
   - Rebuild `STATE.md`: update `Context -> stack` and conventions.

## Postconditions
- [ ] Fact record created in `.agentflow/environment/`.
- [ ] Raw command evidence captured in `evidence/environment/`.
- [ ] Derived index `.agentflow/environment.md` refreshed.
- [ ] Event `env-fact-recorded` logged.
- [ ] `STATE.md` updated.

## Next
- **Success:** `/af-gate` (if completing planning phase) or `/af-decide`.
- **Inferred Fact Found:** Run probe command to promote label to `verified`.
- **Unknown Fact:** Query user via `/af-ask` to establish environment capability.

## Common Mistakes
- Guessing CLI arguments or tool versions instead of running `--version`.
- Treating inferred config files as verified without executing the actual binary.
- Omitting probe output from the evidence directory.

## Footer Template
`Done: recorded environment fact <fact-slug> (label: <verified|inferred>) | Logged: <event-id> | Next: <next-command> | Needs you: nothing`
