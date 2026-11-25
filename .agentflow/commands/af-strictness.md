---
name: af-strictness
description: Change the project strictness level (light/balanced/strict) via the rule-change process
phase: any
tier: 0
actor: both
core: false
---

# /af-strictness — Change Strictness Level

## Purpose
Changes `strictness` in `project.md` from its current level (`light | balanced | strict`) to a different one. This is a specialised wrapper around `/af-rule-change` because strictness governs discovery depth, approval frequency, review requirements, and the unverified-step limit. Raising strictness is a low-risk change; lowering it is high-risk and requires the owner's countersign.

## Preconditions
- [ ] There is a justified reason to change strictness (not just convenience)
- [ ] The current strictness level is known (read `project.md`)
- [ ] The agent has NOT already changed `project.md`

## Steps
1. **Read current strictness** from `project.md`. Note the current level and what it implies (see below).
2. **Assess the change:**
   - `strict → balanced` or `strict → light`: **high-risk** (weakening)
   - `balanced → light`: **high-risk** (weakening)
   - `light → balanced`, `balanced → strict`, `light → strict`: **low-risk** (strengthening)
3. **Document the reason.** State concisely why the current level is impeding progress or why a stricter level is now warranted.
4. **Follow the `/af-rule-change` process** for the `strictness` field in `project.md`:
   - Create rule-change request record
   - Add to `APPROVALS-NEEDED.md`
   - Wait for owner approval (and countersign if high-risk)
   - Record approval
   - Edit `project.md` strictness field
   - Log completion event
5. **Document the implications** of the new level to the owner:
   - **light:** express discovery, larger trivial-lane limit (auto-approve S manifests), fresh-session review only, minimal quality profile, unverified step up to ~150 lines
   - **balanced:** standard discovery, batched approvals, independent review for Must tickets and protected paths, standard quality profile, unverified step ~50 lines
   - **strict:** deep discovery, human approval of every manifest, human review of every Standard ticket, full quality profile, unverified step = 1 file
6. **Rebuild `STATE.md`** to reflect the new strictness setting.

## Postconditions
- [ ] Rule-change process completed with approval record
- [ ] `project.md` strictness field updated
- [ ] Strictness change event logged
- [ ] Owner informed of what changes in day-to-day workflow
- [ ] `STATE.md` rebuilt showing new strictness level

## Next
- **Success:** `/af-next` — continue under new strictness rules
- **Failure (owner refuses):** keep current strictness; record refusal event; log lesson
- **Blocked:** `/af-blockers` — if owner is unavailable, add to `APPROVALS-NEEDED.md`

## Common Mistakes
- Treating strictness as a minor config change — it is a policy file edit requiring full rule-change process
- Lowering strictness without countersign — high-risk changes always need owner countersign
- Changing strictness mid-ticket — apply the new strictness starting at the next ticket boundary to avoid inconsistent records
- Not informing the owner what changes in practice — the owner must understand the trade-offs before approving
- Proposing a strictness change to bypass a specific rule — use `/af-waive` for a targeted exception instead

## Footer Template
`Done: rule-change approved, project.md strictness updated to <level> | Logged: <event-ids> | Next: /af-next because strictness changed | Needs you: approve strictness change (risk: <high|low>)`
