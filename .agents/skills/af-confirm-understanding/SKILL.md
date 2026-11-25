---
name: af-confirm-understanding
description: Synthesize discovery findings into a structured summary for explicit owner confirmation
phase: discovery
tier: 0
actor: both
core: false
---

# /af-confirm-understanding — Confirm Discovery Understanding

## Purpose
Synthesizes all elicited requirements, answered questions, confirmed assumptions, personas, boundaries, and architectural constraints into a cohesive Discovery Summary. Presents this summary to the project owner for formal, explicit confirmation. Passing this confirmation is a mandatory prerequisite for exiting the Discovery phase and opening the Requirements baseline.

## Preconditions
- [ ] Active phase is `discovery`.
- [ ] All blocking questions (`blocking: true` in `questions/Q-*.md`) have been answered.
- [ ] All recorded assumptions have been confirmed by the user.
- [ ] No unresolved human blockers remain in `discovery`.

## Steps
1. **Pre-Audit of Questions & Assumptions:**
   - Scan all `questions/Q-*.md` records.
   - Verify that no question with `blocking: true` has status `open`.
   - Verify that every assumption marked `assumed` has received user confirmation.
   - If any blocking item is open, halt and route to `/af-ask`.
2. **Synthesize Discovery Summary:**
   - Compile the synthesized findings:
     - **Project Vision & Goals:** Primary objective and quantifiable success metrics.
     - **Personas & Users:** Primary user roles and their jobs to be done.
     - **Functional Scope (In-Scope):** Core feature sets, critical capabilities, user flows.
     - **Explicit Out-of-Scope:** Capabilities deliberately deferred or excluded for MVP.
     - **Non-Functional Requirements:** Performance, security posture, accessibility, scaling expectations.
     - **Technical Constraints & Stack:** Approved languages, frameworks, hosting, third-party integrations, licensing.
     - **Key Decisions & Confirmed Assumptions:** Log of agreed architectural foundations.
3. **Format for Audience Level:**
   - If `user_level: non-technical`, explain technical implications using plain business terminology.
   - If `user_level: technical`, state architectural patterns, APIs, and data models explicitly.
4. **Present for Confirmation:**
   - Read the GitHub username `<github-user>` from `.agentflow/project.md` (`owner:`).
   - Output the synthesized summary to `<github-user>` in chat.
   - Request explicit confirmation:
     "`@<github-user>`: please review this discovery summary. Does this accurately represent your project goals and scope boundaries? Please reply with your explicit confirmation (e.g., 'Confirmed' or specific edits)."
5. **Handle Confirmation Response:**
   - Upon confirmation:
     - Write approval record: `.agentflow/approvals/A-<4 base32 chars>-discovery-confirmed.md` with `actor: <github-user>`, `approved_by: <github-user>`, `role: approver` (NEVER write generic `"owner"` or `"<owner-name>"`) quoting the exact words verbatim.
     - Log event:
       `events/<UTC-compact>-none-understanding-confirmed-proj-<project_id>.md`
     - Save baseline summary to `.agentflow/baselines/discovery-summary.md`.
     - Rebuild `STATE.md`.
   - If owner provides corrections or adds scope:
     - Log corrections and route to `/af-ask` or `/af-assume` to capture revisions.

## Postconditions
- [ ] `.agentflow/baselines/discovery-summary.md` written.
- [ ] `.agentflow/approvals/A-<id>.md` created referencing discovery confirmation.
- [ ] Event `events/<UTC-compact>-none-understanding-confirmed-proj-<id>.md` logged.
- [ ] `STATE.md` ready for Discovery phase gate exit.

## Next
- **Success:** `/af-gate` — Advance from `discovery` to `requirements` phase.
- **Corrections Requested:** `/af-ask` — Refine questions and update scope.
- **Blocked:** `/af-ask` — If owner identifies new blocking unknowns.

## Common Mistakes
- Advancing to requirements without waiting for explicit owner confirmation text.
- Overlooking unconfirmed assumptions during the pre-audit step.
- Failing to define explicit out-of-scope boundaries, inviting scope creep.

## Footer Template
`Done: synthesized discovery summary | Logged: <event-id or "none"> | Next: await owner confirmation, then /af-gate | Needs you: confirm discovery summary`
