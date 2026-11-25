---
name: af-intake
description: Classify incoming mid-session user input into structured categories before acting
phase: any
tier: 0
actor: agent
core: false
---

# /af-intake — Message Intake & Classification

## Purpose
Classifies every incoming mid-session user message into one of five canonical categories before any action is taken (§S3). Prevents the critical failure mode where an agent immediately starts modifying code in response to a casual remark or volunteer requirement. Enforces that no editing begins without a ticket and approved Edit Manifest (or confirmed trivial lane).

## Preconditions
- [ ] User message received during an active or ongoing session.

## Steps
1. **Analyze Message Semantics & Intent:**
   - Ingest user message text and evaluate its primary purpose against active project context.
2. **Assign Intake Class (§S3):**
   - **Class A — Answer to Open Question:**
     - User is answering one or more open `questions/Q-*.md` records (or saying "accept defaults").
     - Action: Match answer to question ID, record user's verbatim text, log `question-answered` event, and update question status.
   - **Class B — New Information / Context:**
     - User provides new facts regarding external systems, APIs, design preferences, or credentials that do not alter the requirements baseline.
     - Action: Record fact in `.agentflow/environment/` or append note to relevant ticket/decision.
   - **Class C — New or Changed Requirement:**
     - User requests a new feature, modifications to an existing feature, or a change in scope.
     - Action: **DO NOT TOUCH CODE**. Route immediately to `/af-change` to assess impact on baseline, tickets, and architecture.
   - **Class D — Trivial-Lane Request:**
     - User requests an immediate minor fix (typo, copy edit, single-line config fix: <= 5 lines, 1 file).
     - Action: Verify eligibility against trivial lane rules in `lanes.md`. If eligible, propose trivial lane for confirmation.
   - **Class E — Discussion / General Inquiry:**
     - User is asking a question, exploring an idea, or requesting advice ("How does auth work?", "Show me status").
     - Action: Answer the query directly and politely. Do not modify state or code.
3. **Execute Intake Routing:**
   - Execute the appropriate handling procedure for the determined class.
   - If user request conflicts with current phase (e.g. asking for code implementation during discovery), explain the phase gate constraint and redirect appropriately.
4. **Rebuild STATE.md (if state was modified):**
   - Refresh unknowns, blockers, or `next_action` in `STATE.md`.

## Postconditions
- [ ] Message classified into Class A, B, C, D, or E.
- [ ] Appropriate event or record logged if input altered state.
- [ ] Code files remain untouched until formal process is initiated.
- [ ] `STATE.md` reflects updated next action.

## Next
- **Class A (Answer):** `/af-ask` (if questions remain) or `/af-confirm-understanding`
- **Class B (Info):** `/af-next`
- **Class C (Requirement Change):** `/af-change`
- **Class D (Trivial Request):** `/af-edit-plan` (trivial lane)
- **Class E (Discussion):** `/af-next`

## Common Mistakes
- Jumping directly into code editing because a user asked for a feature in chat.
- Treating a major feature request as a trivial-lane fix.
- Failing to link user answers back to their originating `Q-<id>` question records.
- Silently ignoring new constraints provided by the user.

## Footer Template
`Done: classified user input as Class <A|B|C|D|E> | Logged: <event-id or "none"> | Next: <routed-command> | Needs you: <action or "nothing">`
