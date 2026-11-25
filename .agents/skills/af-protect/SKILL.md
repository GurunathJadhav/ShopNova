---
name: af-protect
description: Add a path to protected.md, requiring approval for future edits
phase: any
tier: 0
actor: both
core: false
---

# /af-protect — Add a Protected Path

## Purpose
Adds a file or directory pattern to `protected.md` so that future edits to it require explicit owner approval and cannot be covered by a standard manifest standing-approval. This is a high-risk policy-file change (strengthening protection is low-risk; this is always additive). The agent proposes; the owner approves.

## Preconditions
- [ ] A file or pattern exists that needs stronger protection than the current default
- [ ] The reason for protection is clearly justified (security, stability, generated output, compliance)
- [ ] The agent has NOT already edited `protected.md`

## Steps
1. **Identify the path(s) to protect.** Be as specific as possible:
   - Exact file: `.env.production`
   - Directory pattern: `migrations/**`
   - File type pattern: `*.pem`
2. **State the reason for protection.** Choose the category:
   - `secret`: contains or references secrets
   - `config`: CI/CD, deploy, or infrastructure config
   - `migration`: database migration (irreversible)
   - `generated`: build output or generated code (should not be hand-edited)
   - `compliance`: licence, legal, or regulatory file
   - `threshold`: test coverage or quality threshold config
   - `user-added`: the user/owner requested this explicitly
3. **Document the protection request:**
   - Path or pattern
   - Category
   - What edits are blocked and what they'd need (approval at minimum, countersign if high-risk)
4. **Follow the `/af-rule-change` process** because `protected.md` is a policy file. Adding a protection is low-risk; create the request, get owner approval, record approval, then edit.
5. **Edit `protected.md`** to add the new entry:
   ```markdown
   | Path/Pattern | Category | Reason | Added | Approval |
   |---|---|---|---|---|
   | <path> | <category> | <reason> | <ts> | <approval-id> |
   ```
6. **Log a protect event.** Write `events/<ts>-none-protect-add-<id>.md` with the new path and reason.
7. **Rebuild `STATE.md`** if the protected path affects the active manifest.

## Postconditions
- [ ] `protected.md` updated with new path entry
- [ ] Rule-change process completed with approval record
- [ ] Protect event logged
- [ ] Any active manifest that touches this path is flagged for re-approval

## Next
- **Success:** `/af-next` — continue; future edits to this path will require approval
- **Failure (owner refuses):** do not add the protection; record refusal event; use another approach
- **Blocked:** add to `APPROVALS-NEEDED.md`

## Common Mistakes
- Editing `protected.md` directly without the rule-change process — it is a policy file
- Using overly broad patterns (`**/*`) that block routine work — be as specific as possible
- Not flagging existing active manifests that touch the newly protected path — they must be re-approved
- Protecting a path after a secret exposure — also run `/af-incident` for the exposure itself
- Confusing "protecting a path" with "adding it to the manifest" — protection means approval-required; manifests mean this-ticket-may-edit

## Footer Template
`Done: protected.md updated, approve event <approval-id> | Logged: <event-ids> | Next: /af-next because path protected | Needs you: approve adding <path> to protected paths`
