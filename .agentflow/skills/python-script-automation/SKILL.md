---
name: python-script-automation
description: Use whenever creating tickets, manifests, baselines, requirements, decisions, probing environment, checking coverage/diff/next, running tests or live smoke checks, committing, or closing gates so Python scripts do the work instead of burning AI tokens.
version: 1.0.0
---

# Python Script Automation (Token-Saving Execution)

## Purpose
Drastically reduce AI token consumption across the **entire lifecycle** by calling the zero-dependency Python helper scripts installed in `.agentflow/scripts/` instead of manually reading 150-line templates, constructing IDs/tables, or writing boilerplate test/evidence files.

## Available Scripts (`.agentflow/scripts/`)

1. **`.agentflow/scripts/af_records.py` — Create Records, Probe Env & Rebuild State:**
   - **Auto-probe runtime & package scripts (`/af-env`):**
     `python .agentflow/scripts/af_records.py env-probe`
   - **Batch/single requirements & tickets (`--batch-stdin` or CLI flags):**
     `python .agentflow/scripts/af_records.py req --title "..." --moscow must`
     `python .agentflow/scripts/af_records.py ticket --title "..." --story "..." --ac "Given... When... Then..." --mvp MVP-1 --size S --moscow must --req REQ-... --est 25 --tokens "~10k"`
   - **Edit Manifest (+ optional SA1 approval) & Ticket Start (baseline + unlock):**
     `python .agentflow/scripts/af_records.py plan --ticket T-... --modify src/a.ts,src/a.css --create tests/a.test.ts --sa1`
     `python .agentflow/scripts/af_records.py start --ticket T-...`
   - **Questions / Decisions / Approvals / Rebuild State** (always stamps GitHub username from `project.md`, never literal `"owner"`):
     `python .agentflow/scripts/af_records.py question|decision|approval|state-rebuild ...`

2. **`.agentflow/scripts/af_test_runner.py` — Test Scaffolding, Verification, Diff-Check & Live Smoke:**
   - **Scaffold starter tests directly from ticket Acceptance Criteria:**
     `python .agentflow/scripts/af_test_runner.py scaffold --ticket T-... --out tests/feature.test.mjs`
   - **Run tests/build/lint & auto-capture `evidence/` + `verifications/V-*.md`:**
     `python .agentflow/scripts/af_test_runner.py verify --ticket T-... --cmd "npm test" --cmd "npm run build" --criterion AC-all`
   - **Automated Diff-Check & Secrets/Debug Hygiene Scan (`/af-diff-check`):**
     `python .agentflow/scripts/af_test_runner.py diff-check --ticket T-...`
   - **Live Runtime HTTP/Server Smoke Check (starts server, probes URL, stops cleanly, writes `V-*-smoke.md`):**
     `python .agentflow/scripts/af_test_runner.py smoke --ticket T-... --start "npm run dev" --url http://localhost:5173`

3. **`.agentflow/scripts/af_gate_runner.py` — Next Router, Coverage, Gates, Commit & Closure:**
   - **Deterministic `/af-next` without reading `workflow-map.md`:**
     `python .agentflow/scripts/af_gate_runner.py next`
   - **Bidirectional REQ↔Ticket coverage & `traceability.md` (`/af-coverage`):**
     `python .agentflow/scripts/af_gate_runner.py coverage`
   - **Check & Advance Phase Gates (auto-runs `build.js` + `report.js` on `planning -> implementation`):**
     `python .agentflow/scripts/af_gate_runner.py check-gate`
     `python .agentflow/scripts/af_gate_runner.py advance-gate --to implementation --quote "<confirmation>"`
   - **Close Ticket & Clean Git Commit:**
     `python .agentflow/scripts/af_gate_runner.py close-ticket --ticket T-... --actual-min 20 --actual-tokens "~10k" --self-review "..."`
     `python .agentflow/scripts/af_gate_runner.py commit --ticket T-... --msg "Implement feature"`
