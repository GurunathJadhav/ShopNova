---
name: af-rule-change
description: Request a change to a framework policy file; requires owner approval and countersign for weakening changes
phase: any
tier: 0
actor: both
core: false
---

# /af-rule-change — Request a Rule Change

## Purpose
The only legitimate path to changing any policy file (`project.md` policy fields, `gates.md`, `lanes.md`, `safety.md`, `protected.md`, `workflow-map.md`, `AGENTS.md` outside the managed block, `skills/`, `commands/`). The agent proposes the change; the owner approves it; the agent records the approval before making any edit. Weakening rules (raising limits, removing gates, shrinking protected paths) is high-risk and requires the owner's countersign.

## Preconditions
- [ ] A specific policy file or rule needs to change
- [ ] The reason for the change is documented (not just preference — must be tied to a project need)
- [ ] The agent has NOT already edited the policy file (the edit lock covers framework files)

## Steps
1. **Document the proposed change.** Write out clearly:
   - **What:** exact rule or policy field to change, old value → new value
   - **Why:** the project need or problem it solves
   - **What it weakens or strengthens:** honest assessment of the security or quality impact
   - **Risk level:** high-risk if weakening (raises limit, removes gate, removes protected path, production, one-way); low-risk if strengthening
2. **Create a rule-change request record.** Write `events/<ts>-none-rule-change-request-<id>.md`:
   ```
   ---
   type: event
   id: RC-<id>
   project_id: <project_id>
   schema_version: 1.0.0
   created: <ts>
   actor: <agent>
   role: agent
   event_type: rule-change-request
   ticket_id: none
   summary: <one-liner>
   risk_level: high | low
   ---
   ## Proposed Change
   **File:** <policy file>
   **Old:** <current rule>
   **New:** <proposed rule>
   **Why:** <reason tied to project need>
   **Weakens / Strengthens:** <honest assessment>
   ```
3. **Add to `APPROVALS-NEEDED.md`.** List this rule change with its risk level and recommended answer.
4. **Stop and wait for owner approval in chat.** Do not edit the policy file. The agent must receive explicit approval naming this request's id before proceeding.
5. **For high-risk changes:** additionally require the owner's countersign (a separate confirmation message quoting the request id, or the owner editing the approval file themselves).
6. **Record the approval.** Once received, write `approvals/A-<id>.md` with the owner's verbatim words, the rule-change request id, the role, and the countersign reference if high-risk.
7. **Make the approved edit** to the policy file. The edit must match exactly what was approved — no extra changes.
8. **Log the completion event.** Write `events/<ts>-none-rule-change-done-<id>.md` with `event_type: rule-change`, the approval id, and what changed.
9. **Rebuild `STATE.md`** to reflect the new rule.

## Postconditions
- [ ] Rule-change request record exists
- [ ] Approval record `approvals/A-<id>.md` written with verbatim owner words
- [ ] High-risk changes have countersign documented
- [ ] Policy file edited to match approved change only
- [ ] Rule-change completion event logged
- [ ] `STATE.md` rebuilt

## Next
- **Success:** `/af-next` — continue from updated rules
- **Failure (owner refuses):** record refusal event; keep original rule; log a lesson if the request was premature
- **Blocked (owner unavailable):** add to `APPROVALS-NEEDED.md` and use `/af-next` to find unblocked work

## Common Mistakes
- Editing a policy file before getting approval — this is a framework violation; revert immediately and start this process
- Proposing vague changes ("relax the manifest rule a bit") — changes must be exact old → new values
- Omitting the honest risk assessment — the owner must know what weakens before deciding
- Skipping the countersign for high-risk changes — weakening changes require extra verification
- Bundling multiple rule changes into one request — each change is its own request and approval

## Footer Template
`Done: rule-change request RC-<id>, approval A-<id>, policy edit | Logged: <event-ids> | Next: /af-next because rule updated | Needs you: approve rule change RC-<id> (risk: <level>)`
