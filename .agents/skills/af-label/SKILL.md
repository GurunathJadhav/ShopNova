---
name: af-label
description: Promote a fact's confidence label from inferred to verified, or flag as unknown
phase: any
tier: 0
actor: agent
core: false
---

# /af-label — Promote Fact Label (inferred → verified)

## Purpose
Updates the confidence label on a claim or environment fact record. Inferred facts cannot justify an edit, dependency, or `done` — they must be promoted to `verified` (with an evidence reference) before they are actionable. This command is called when new evidence is obtained that confirms or refutes an inferred fact.

**Labels:**
- `verified`: evidence reference exists; can justify decisions and edits
- `inferred`: reasoned from context but not directly confirmed; cannot justify edits or done
- `unknown`: not enough information; must be resolved before proceeding

## Preconditions
- [ ] The claim or environment fact to be relabelled exists in `claims/CL-<id>.md` or `environment/<fact>.md`
- [ ] Evidence exists that supports the new label (a verification record, pasted output, or official doc reference)
- [ ] If promoting to `verified`: evidence ref is available and recorded

## Steps
1. **Identify the record to relabel.** Find the claim (`claims/CL-<id>.md`) or environment fact (`environment/<fact>.md`) by scanning for `label: inferred` or `label: unknown`.
2. **Obtain and record the evidence.** If not already recorded:
   - Run the verification command or look up the official documentation
   - Create a verification record `verifications/V-<id>.md` with the command and output
   - Or paste the official doc URL and the relevant excerpt
3. **Determine the correct new label:**
   - Fact confirmed → `verified`
   - Fact contradicted → update the fact value to the correct value, label `verified`
   - Still uncertain → keep `inferred` or move to `unknown` with a reason
4. **Write a correction event** (records are immutable — do not edit the original file):
   Write `events/<ts>-none-label-change-<id>.md`:
   ```
   ---
   type: event
   id: EVT-<id>
   event_type: label-change
   record_id: <CL-id or environment-fact>
   old_label: inferred | unknown
   new_label: verified | inferred | unknown
   evidence_ref: <V-id or doc URL>
   ---
   ## Evidence summary
   <what was confirmed and how>
   ```
5. **If the record is a claim (`claims/CL-<id>.md`):** add a `label_updated_by` reference to the correction event in `STATE.md` Unknowns section (remove the fact from Unknowns if now verified).
6. **If the record is an environment fact:** update `STATE.md` Unknowns section accordingly.
7. **Log the correction.** The event record IS the correction; no other file is edited.

## Postconditions
- [ ] Label-change correction event written in `events/`
- [ ] Evidence reference recorded (verification record or doc link)
- [ ] `STATE.md` Unknowns section updated
- [ ] The claim or fact is now actionable (if promoted to `verified`)

## Next
- **Success:** `/af-next` — the blocked action that depended on this fact can now proceed
- **Failure (cannot verify):** leave as `inferred`; do not use the fact to justify an edit; `/af-ask` to get the owner to supply evidence
- **Blocked:** `/af-blockers` — if verification requires a command the agent cannot run, create a human blocker

## Common Mistakes
- Labelling a fact `verified` without an evidence reference — no evidence ref means inferred at best
- Editing the original claim file to change the label — records are immutable; write a correction event
- Using an inferred fact to justify an edit before promoting it — this is a framework violation
- Promoting to `verified` based on inference, not actual evidence — if you reasoned it, it stays inferred
- Forgetting to remove resolved items from `STATE.md` Unknowns — stale unknowns cause confusion

## Footer Template
`Done: label-change event <event-id>, <record-id> promoted to <new-label> | Logged: <event-id> | Next: /af-next because fact verified, dependent step can proceed | Needs you: nothing`
