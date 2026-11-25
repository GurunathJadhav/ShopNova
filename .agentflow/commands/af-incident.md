---
name: af-incident
description: Report a production incident or accidental secret exposure; triggers incident response
phase: any
tier: 0
actor: both
core: false
---

# /af-incident — Report Production / Secret Incident

## Purpose
Triggers the incident response protocol for two classes of event: (1) production is broken or a security issue is active, and (2) a secret has accidentally reached a record, chat, or commit. For secret exposure: the owner must rotate the secret first; the agent then helps purge it. For production incidents: minimal manifest, reproduction evidence before any fix, one approver required, follow-up ticket mandatory. Never skips verification or logging.

## Preconditions
- [ ] A production or security incident is confirmed (not suspected — have evidence)
- [ ] The incident type is known: `production-outage | security-vulnerability | secret-exposure | other`
- [ ] For secret exposure: the secret has NOT yet been rotated (rotation is step 1)

## Steps
1. **Classify the incident.** Determine:
   - Type: production-outage, security-vulnerability, secret-exposure, other
   - Severity: critical (service down / secret live), high (degraded / secret in repo), medium (minor impact)
   - Scope: which users, systems, or data are affected
2. **For secret-exposure incidents (step 2a):**
   - Immediately tell the owner: "A secret was exposed. **Rotate it now before anything else.** Do not paste it again."
   - Wait for owner confirmation that the secret has been rotated
   - Only then proceed to purge it from records and git history with owner approval
   - Log the incident WITHOUT including the secret value
3. **Load `incident-response` skill** (`skills/incident-response/SKILL.md`).
4. **Record the incident event.** Write `events/<ts>-none-incident-<id>.md`:
   ```
   ---
   type: event
   id: INC-<id>
   event_type: incident
   incident_type: <type>
   severity: critical | high | medium
   summary: <one-liner — NO secrets>
   affected_scope: <systems/users>
   ---
   ## Evidence
   <reproduction steps or log output — NO secrets>
   ## Immediate actions taken
   <what was done in first 5 minutes>
   ```
5. **Reproduce the issue before fixing.** For production bugs: a failing test or pasted log that confirms the bug. Never edit without reproduction evidence.
6. **Define a minimal incident manifest.** Only the specific files needed for the fix. Use the incident lane.
7. **Get one approver approval.** Even in an incident, one human must approve the manifest and the fix approach. Add to `APPROVALS-NEEDED.md` with `URGENT` label.
8. **Implement the minimal fix.** Follow the incident lane: minimal manifest, full verification, no scope creep.
9. **Create a follow-up ticket** for root cause analysis and regression test (required, within a defined time window — default 2 business days).
10. **Write a post-incident summary** in the incident event record: timeline, root cause (if known), fix applied, follow-up ticket id.

## Postconditions
- [ ] Incident event record `INC-<id>` created (no secrets in the record)
- [ ] For secret exposure: owner confirmed rotation before any other step
- [ ] Minimal incident manifest approved
- [ ] Fix verified with evidence
- [ ] Follow-up ticket created for root cause + regression test
- [ ] `STATE.md` rebuilt

## Next
- **Success (incident resolved):** `/af-next` — proceed to follow-up ticket for root cause
- **Failure (cannot reproduce):** `/af-stuck` — do not fix without reproduction evidence
- **Blocked (approver unavailable):** add to `APPROVALS-NEEDED.md` URGENT; escalate to owner

## Common Mistakes
- Fixing before reproducing the bug — this is strictly forbidden even in incidents
- Including the secret value in the incident record — log the exposure without the secret
- Skipping the follow-up ticket — root cause analysis is mandatory; mark it Must priority
- Expanding scope beyond the minimal fix during the incident — scope creep in incidents creates new incidents
- Not telling the owner to rotate the secret immediately — rotation must happen before any other action on a secret exposure

## Footer Template
`Done: incident INC-<id>, follow-up ticket <ticket-id> | Logged: <event-ids> | Next: /af-next because incident resolved; root-cause ticket queued | Needs you: <rotate secret / approve manifest / confirm fix>`
