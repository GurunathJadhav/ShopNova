---
name: af-audit
description: Sample recent verification records and re-run their commands to confirm recorded results match reality, reporting discrepancies honestly
phase: any
tier: 1
actor: agent
core: false
---

# /af-audit — Reconciliation and Verification Audit

## Purpose
Periodically reconciles records with actual state: samples recent `verifications/V-*.md` records and **re-runs their commands** to confirm the recorded `result: pass` was genuine, catches fabricated or stale evidence, and compares record state against the actual tree. Findings are reported honestly and logged; discrepancies do not silently auto-fix.

## Preconditions
- [ ] `.agentflow/verifications/` contains at least one record.
- [ ] Tier 1 or higher (commands can run). At Tier 0, `/af-audit` degrades to the user-run variant: present the sampled commands and ask for pasted output.
- [ ] Running sampled commands is permitted by `safety.md` (test/lint/build commands are routine; anything else needs approval).

## Steps
1. **Sample:** pick the most recent N verification records (default 5, or all if fewer), prioritising records supporting `done` or gate decisions.
2. **Re-run each sampled command:**
   - Run exactly the command recorded in the record (same working directory context).
   - Capture output as fresh evidence in `evidence/audit/<UTC-slug>.md`, trimmed to ~200 lines.
3. **Compare and classify each record:**
   - **confirmed:** re-run result matches the recorded result.
   - **discrepant:** recorded pass now fails, or output differs materially — flag; the original `done`/gate that relied on it is suspect.
   - **unrunnable:** command cannot run in the current environment — mark **unverified**, do not treat the original record as confirmed.
4. **Cross-checks (quick pass):**
   - Verification records referenced by recent `done` events all exist and are `pass`.
   - `STATE.md` `built_from` matches the latest event id; derived indexes match record directories (orphan or missing entries noted).
   - Any record with `result: fail` still referenced as supporting evidence is flagged.
5. **Report and log:**
   - Write one audit summary record `.agentflow/verifications/V-<id>-audit.md` (`method: audit`, per-record outcome).
   - Log event `events/<UTC>-none-audit-completed-<V-id>.md`.
   - For each **discrepant** record: propose a follow-up (bug ticket, `/af-stuck`, or escalation) and ask the user — never rewrite the original record.
6. **Rebuild `STATE.md`** with the audit outcome noted.

## Postconditions
- [ ] Audit summary verification record written with per-record outcomes.
- [ ] Fresh evidence saved for every re-run command.
- [ ] Event logged; `STATE.md` updated.
- [ ] Discrepancies surfaced to the user with a recommended follow-up.

## Next
- **All confirmed:** continue the current `next_action`.
- **Discrepancy found:** `/af-ticket` (bug) for the affected ticket, or `/af-incident` if it hid a broken release gate.
- **Records out of sync with disk:** `/af-reconcile` — resolve duplicate or conflicting records.

## Common Mistakes
- Trusting the pasted historical output and skipping the re-run.
- Marking an unrunnable command as confirmed instead of **unverified**.
- Editing or deleting the original verification record to match the new result.
- Sampling only records expected to pass (cherry-picking).

## Footer Template
`Done: audited <N> verification records (<confirmed>/<discrepant>/<unrunnable>) | Logged: <event-id> | Next: <next_action> because <reason> | Needs you: <follow-ups or "nothing">`
