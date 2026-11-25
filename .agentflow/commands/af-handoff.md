---
name: af-handoff
description: Write a formal handoff document for session end or agent handover
phase: any
tier: 0
actor: agent
core: false
---

# /af-handoff — Write Handoff Document

## Purpose
Writes a comprehensive `handoff/<date>.md` document that enables any agent (or a fresh session of the same agent) to resume work correctly with minimal context. This is the structured document-writing step; `/af-pause` calls this as part of the pause flow. Can also be called independently to prepare a handoff for a subagent or a human-assisted session.

## Preconditions
- [ ] `STATE.md` is current and accurate
- [ ] Any unverified step has been reverted or is explicitly noted as incomplete
- [ ] The handoff is being written at a natural checkpoint (ticket done, step verified, or session end)

## Steps
1. **Gather state.** Read `STATE.md` in full. Note all fields needed for the handoff template below.
2. **Read recent events.** List the last 10 events from `events/` to build the "what was done" section.
3. **Read open blockers** from `blockers/` with no resolution event.
4. **Read pending approvals** from `APPROVALS-NEEDED.md`.
5. **Write the handoff document.** Create `handoff/<YYYYMMDD>-<session-slug>.md`:
   ```markdown
   ---
   type: handoff
   id: HO-<id>
   project_id: <project_id>
   schema_version: 1.0.0
   created: <ts>
   session_ended_by: <agent-name or username>
   built_from: <event-id> <revision>
   ---
   # Handoff — <date>
   ## Session Summary
   <2-5 bullet points of what was accomplished this session>
   ## Current State
   - Phase: <phase>
   - Edit lock: <locked | unlocked>
   - Active ticket: <id or none>
   - Active manifest: <path or none>
   - Unverified step: <description or none — WARNING if not none>
   ## Ticket Board Snapshot
   <copy from STATE.md ticket board>
   ## Where to Resume
   **Command:** `/af-<command>`
   **Reason:** <exact reason — what this command will do>
   **Then:** <what comes after>
   ## Open Blockers
   <list each blocker id, description, owner, dependent tickets>
   ## Pending Approvals
   <list from APPROVALS-NEEDED.md>
   ## Open Questions
   <any assumptions still unconfirmed, unknowns in STATE.md>
   ## Key Context for Next Session
   - Stack: <stack>
   - Conventions: <key conventions>
   - Recent decisions: <1-liner each>
   - Latest lessons: <1-liner each>
   ## Warnings
   <unverified steps, frozen file changes, incident follow-ups>
   ```
6. **Log a handoff event & Refresh Clean Build Brief:**
   - Write `events/<ts>-none-handoff-<id>.md` with `event_type: handoff`, handoff doc path, and `built_from`.
   - If in `planning` or `implementation`, run `node .agentflow/build.js` so `.agentflow/BUILD-BRIEF.md` and `.agentflow/BUILD-PROMPT.txt` give the fresh session minimal, pollution-free context + the exact build loop command.
7. **Update `STATE.md`** to point `next_action` to exactly the command the next agent should run, and update `built_from`.

## Postconditions
- [ ] `handoff/<date>-<slug>.md` written with all sections
- [ ] Handoff event logged in `events/`
- [ ] `STATE.md` `next_action` and `built_from` accurate

## Next
- **Success:** session ends; `/af-resume` is next session's first command
- **Failure (STATE.md stale):** `/af-rebuild` to get accurate state before writing handoff
- **Blocked:** record blockers in the handoff; note them under Open Blockers

## Common Mistakes
- Writing vague "where to resume" — must include the exact command and the exact reason
- Omitting warnings about unverified steps — the next agent will find inconsistent state
- Not updating `STATE.md` `built_from` after writing the handoff — the handoff is useless if STATE.md is wrong
- Writing a handoff at mid-step — only write at natural checkpoints
- Not listing pending approvals — the next agent will re-request them and confuse the owner

## Footer Template
`Done: handoff/<date>.md, STATE.md updated | Logged: handoff event <event-id> | Next: /af-resume (next session) | Needs you: nothing — resume with /af-resume`
