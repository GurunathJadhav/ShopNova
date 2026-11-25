---
name: af-waive
description: Request a targeted waiver to skip a specific rule for a limited scope
phase: any
tier: 0
actor: both
core: false
---

# /af-waive — Request a Rule Waiver

## Purpose
The only legitimate way to skip a framework rule without permanently changing it. Creates a waiver record with the specific rule, reason, the owner's verbatim words, role, and expiry. Active waivers are reported in `STATE.md` and at gate reviews. Waivers never cover policy-file protections, secrets safety, or the countersign requirement for high-risk approvals.

## Preconditions
- [ ] A specific, named rule needs to be skipped (not a general preference to work faster)
- [ ] The scope and expiry of the waiver are defined (not open-ended)
- [ ] The rule is waiveable (not in the never-waive list below)

**Never-waive rules:**
- Policy-file protections (you must use `/af-rule-change` to change policy files)
- Secrets safety (never write secrets to records)
- Countersign requirement for high-risk approvals
- The edit lock itself (no edits without an active ticket and approved manifest)

## Steps
1. **Document the waiver request.** State:
   - **Rule being waived:** exact rule name or section reference (e.g., "S6.4 independent review for Standard tickets")
   - **Reason:** why skipping this rule is necessary or justified right now
   - **Scope:** which ticket, epic, or time period this applies to (narrow as possible)
   - **Expiry:** when the waiver expires (ticket completion, date, or milestone)
   - **Risk:** what this waiver allows that is normally prevented
2. **Add to `APPROVALS-NEEDED.md`.** The owner must approve.
3. **Stop and wait for owner approval.** Present the waiver request and wait for the owner's verbatim reply.
4. **Record the waiver.** Once approved, write `waivers/W-<id>-<slug>.md`:
   ```
   ---
   type: waiver
   id: W-<id>-<slug>
   project_id: <project_id>
   schema_version: 1.0.0
   created: <ts>
   actor: <agent>
   role: agent
   rule: <exact rule name>
   scope: <ticket-id or time period>
   expiry: <condition or date>
   owner_verbatim: "<exact words from the owner>"
   role_of_approver: owner
   ---
   ## Rule being waived
   <full description>
   ## Reason
   <why this is needed>
   ## Risk accepted
   <what this enables that is normally prevented>
   ## Expiry condition
   <exact condition or date>
   ```
5. **Log a waiver-granted event.** Write `events/<ts>-none-waiver-granted-<id>.md`.
6. **Update `STATE.md`** to list this as an active waiver.
7. **On expiry:** log a `waiver-expired` event and remove from active waivers in `STATE.md`.

## Postconditions
- [ ] `waivers/W-<id>.md` created with owner's verbatim words
- [ ] Waiver-granted event logged
- [ ] `STATE.md` active waivers updated
- [ ] `APPROVALS-NEEDED.md` cleared for this item

## Next
- **Success:** `/af-next` — continue under the waiver (noting its scope and expiry)
- **Failure (owner refuses):** record refusal event; find an alternative approach; do not proceed without the waiver
- **Blocked (owner unavailable):** continue on other work; do not proceed with the waived step until approval received

## Common Mistakes
- Using a waiver to permanently skip a rule — that is a rule change (`/af-rule-change`), not a waiver
- Writing a waiver without the owner's verbatim words — the verbatim quote is required
- Setting an open-ended expiry ("until further notice") — always define a specific condition
- Waiving policy-file protections or secrets rules — these are never waiveable
- Forgetting to log waiver expiry when the scope ends — expired waivers must be closed

## Footer Template
`Done: waivers/W-<id>.md, waiver-granted event | Logged: <event-ids> | Next: /af-next because waiver active for <scope> | Needs you: approve waiver for <rule>`
