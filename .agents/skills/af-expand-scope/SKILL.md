---
name: af-expand-scope
description: Request formal approval to expand an active Edit Manifest with additional files or dependencies
phase: implementation, maintenance
tier: 0
actor: both
core: false
---

# /af-expand-scope — Request Scope Expansion

## Purpose
Invoked when an agent discovers during implementation that a file, directory, or package not listed on the approved Edit Manifest must be modified or created. Enforces the strict rule: **stop editing immediately when an unlisted file is needed**. Evaluates why the file is required, confirms criterion linkage, checks budget limits (splitting if budget is exceeded), runs an overlap check, and submits a formal scope expansion request for human approval.

## Preconditions
- [ ] Active ticket claimed and in progress (`active_ticket` set in `STATE.md`).
- [ ] Active Edit Manifest exists (`manifests/T-<id>.md`).
- [ ] No unverified step is currently pending (revert or verify any active step before requesting expansion).
- [ ] Discovered file or dependency is NOT listed on the current manifest.

## Steps
1. **Immediate Edit Halt:**
   - Cease all editing immediately. Do not touch or create the unlisted file.
2. **Justify Scope Addition:**
   - Identify the exact path of the required file or dependency.
   - Map the file to the specific acceptance criterion it serves.
   - State why the current manifest files are insufficient.
   - Assess simpler alternatives: Can the acceptance criteria be satisfied without touching this file?
3. **Budget & Protected Paths Audit:**
   - Calculate updated totals (existing manifest files + newly proposed files).
   - Verify size limits:
     - `S` budget: <= 3 files / 100 lines.
     - `M` budget: <= 7 files / 300 lines.
     - If the addition pushes the ticket beyond size M: HALT — do not expand. Propose splitting the ticket instead.
   - Check against `.agentflow/protected.md`. If the new path is protected, note that explicit user approval is required.
4. **Overlap Verification:**
   - Verify the newly requested file is not claimed in another active manifest.
5. **Draft Expansion Record:**
   - Generate expansion record: `.agentflow/manifests/T-<ticket-id>-expansion-<seq>.md` detailing:
     - Proposed file path / dependency.
     - Justification and acceptance criterion.
     - Impact on edit budget.
     - Protected path status.
6. **Log Event & Present to User:**
   - Write event:
     `events/<UTC-compact>-T-<ticket-id>-scope-expansion-requested-exp-<seq>.md`
   - Present the expansion request clearly to the approver in chat:
     "Approver: implementation of criterion `<criterion-id>` requires modifying unlisted file `<path>`. Rationale: `<reason>`. Updated file count: `<n>`. Do you approve this scope expansion?"
7. **Handle Approver Decision:**
   - **If Approved:**
     - Record approval record: `.agentflow/approvals/A-<4 base32 chars>-scope-expansion.md`.
     - Log event: `events/<UTC-compact>-T-<ticket-id>-scope-expansion-approved-exp-<seq>.md`.
     - Append approved file to active manifest.
     - Rebuild `STATE.md`.
   - **If Rejected:**
     - Agent must devise an alternative design within current manifest bounds or propose a separate ticket.

## Postconditions
- [ ] Expansion record created in `manifests/`.
- [ ] Event `scope-expansion-requested` logged.
- [ ] Approval obtained before any edit to the new file occurs.
- [ ] `STATE.md` updated with revised scope bounds.

## Next
- **Approved:** Resume micro-cycle on approved files, then `/af-verify`.
- **Rejected:** Implement alternative within original manifest, or create follow-up ticket.
- **Budget Exceeded:** Split ticket into two distinct work items.

## Common Mistakes
- Modifying the unlisted file first and asking for expansion afterwards.
- Using scope expansion to sneak in unrelated "drive-by" cleanup or refactoring.
- Allowing scope expansions that push the ticket over size M without splitting.

## Footer Template
`Done: requested scope expansion for <file-path> on <ticket-id> | Logged: <event-id> | Next: await approval before editing | Needs you: approve scope expansion for <file-path>`
