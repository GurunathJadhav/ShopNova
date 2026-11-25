---
name: incident-response
description: Use when production is broken, a secret is exposed, or data is at risk — switch to the incident lane with minimal manifests, evidence-first fixes, and mandatory follow-up.
version: 1.0.0
---

# Incident Response

## Purpose
When production is broken, a secret leaks, or data is lost, normal flow yields to the incident lane: `/af-incident`. Incidents still never skip verification or logging — but manifests are minimal, evidence comes before fixes, and every incident spawns a follow-up ticket.

## When to Use
- Production is broken or degraded.
- A secret was exposed in a record, chat, or commit.
- Data was lost or is at risk of loss.
- A destructive or high-consequence action is being considered (see safe actions list).

## Inputs
- The incident report: what broke, since when, who noticed.
- Available evidence: logs, error output, monitoring, reproduction steps.
- `safety.md` and `protected.md` constraints.

## Steps
1. **Open the incident lane.** Run /af-incident to create an incident ticket (`lane: incident`) with a minimal manifest covering only the emergency fix.
2. **Gather evidence before any fix.** Reproduce the failure or capture log evidence first — same reproduce-first rule as debugging, no exceptions.
3. **Assign one approver.** A single approver authorizes the emergency change; ambiguous approvals are no approvals.
4. **Fix minimally and verify.** The emergency fix stays within the minimal manifest and still passes verification.
5. **Never skip verification or logging.** Evidence records and event records are written as in any ticket — reduced scope, not reduced rigor.
6. **Create the mandatory follow-up ticket.** Every incident gets a follow-up covering root cause analysis plus a regression test.
7. **Handle secret exposure first.** Tell the user to rotate the credential FIRST. Then, with their approval, purge it from records and history. Log the incident WITHOUT the secret value.
8. **Gate safe actions individually.** Each of these needs approval every time: deleting files/branches, force-push, history rewrites, dropping/migrating databases, touching production, unknown scripts, changing CI/deploy config, global installs.
9. **Prepare destructive actions.** Before any destructive action: log the intent, take a backup or run a dry-run, and state the rollback plan.

## Checklist
- [ ] Incident ticket open in the incident lane with a minimal manifest.
- [ ] Reproduction or log evidence captured before any fix.
- [ ] Exactly one approver recorded.
- [ ] Emergency fix verified; evidence and events logged.
- [ ] Follow-up ticket created (root cause + regression test).
- [ ] For secret exposure: user told to rotate first; purge done with approval; incident logged without the secret.
- [ ] Every safe action individually approved this time.
- [ ] Destructive actions backed by intent log, backup/dry-run, and stated rollback.

## Anti-Patterns
- "Hotfix in prod, paperwork later" — logging is never skipped.
- Emergency edits outside the minimal manifest.
- Two approvers, or an implied approval.
- Logging the leaked secret value into the incident record.
- Purging history before the credential is rotated.
- Treating approval for one destructive action as standing approval.
- Closing the incident without a follow-up ticket.

## "Stop and Ask the User If…"
- The emergency fix would exceed the minimal manifest — ask to approve the expansion.
- A secret is exposed — instruct rotation FIRST and wait for the user's rotation confirmation.
- History rewrite or force-push is proposed — require approval this time, plus backup and rollback plan.
- Production access is needed — ask for explicit, one-time approval.
- No approver is reachable and the fix is not trivially safe — stop and escalate.

## Next Skills
- debugging
- secrets-and-redaction
- change-control

## Worked Example
At 03:12 the API returns 500s after a config deploy. The agent runs /af-incident: ticket `T-6d4r-api-500-outage` (lane: incident), minimal manifest = `config/prod.yaml` rollback only. Evidence: stack trace captured to `evidence/T-6d4r/`. One approver (the on-call owner) approves. Rollback verified with a smoke check, events logged. Follow-up ticket `T-8j2t-config-schema-validation` created for root cause + regression test. The owner also approves the one-time production access used for the rollback; that approval covers nothing else.
