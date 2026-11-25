---
name: af-pause
description: Pause a session safely; revert any unverified step, update STATE.md, write handoff document
phase: any
tier: 0
actor: both
core: false
---

# /af-pause — Pause Session with Handoff

## Purpose
Cleanly ends the current agent session at a safe checkpoint. Reverts any unverified step (or records it explicitly as incomplete), updates `STATE.md` to the current state, and writes a `handoff/` document so the next agent (or a fresh session of the same agent) can resume without loss of context. Called when the user wants to stop, the session is ending, or the agent needs to hand off to another agent.

## Preconditions
- [ ] The user has signalled they want to pause, or the session is naturally ending
- [ ] No destructive operation is mid-flight (if one is, complete or cleanly abort it first)

## Steps
1. **Identify the current state.** Read `STATE.md`. Note:
   - Active ticket and manifest (if any)
   - Unverified step (if any)
   - Open blockers
   - Next action
2. **Handle any unverified step.** If `unverified_step` is set in `STATE.md`:
   - **Option A (preferred):** revert the unverified edit via `/af-revert-unverified`, then pause
   - **Option B (if revert is not possible):** record the step explicitly as incomplete in the handoff doc with a warning; mark it in `STATE.md`
3. **Update `STATE.md`** to reflect the current state fully:
   - Set `active_ticket`, `active_manifest`, `unverified_step` accurately
   - Ensure `next_action` is set to exactly the right command and reason for resuming
   - Set `built_from` to the latest event id and repo revision
4. **Write the handoff document.** Create `handoff/<date>-<slug>.md`:
   ```markdown
   ---
   type: handoff
   created: <ts>
   session_ended_by: <agent or user>
   ---
   # Handoff: <date>
   ## What was done this session
   <bullet list of completed steps and tickets>
   ## Where we left off
   <exact state: active ticket, step, manifest, unverified step>
   ## What to do next
   `/af-<command>` — <reason>
   ## Open items requiring human input
   <blockers, pending approvals, questions>
   ## Warnings
   <unverified steps, incomplete edits, risks>
   ## Context
   <key decisions or facts the next session needs>
   ```
5. **Log a pause event.** Write `events/<ts>-none-pause-<id>.md` with `event_type: pause`, handoff doc reference, and summary.
6. **Tell the user** what to type to resume: "Start the next session with `/af-resume`."

## Postconditions
- [ ] Any unverified step reverted or explicitly recorded as incomplete
- [ ] `STATE.md` fully updated and accurate
- [ ] `handoff/<date>.md` written
- [ ] Pause event logged
- [ ] User told how to resume

## Next
- **Success:** session ends; next session starts with `/af-resume`
- **Failure (cannot revert unverified step):** record it as incomplete in the handoff and warn the owner
- **Blocked:** note all blockers in the handoff; `/af-resume` will route around them

## Common Mistakes
- Pausing without reverting or recording the unverified step — the next session will find inconsistent state
- Leaving `STATE.md` stale — the next agent reads `STATE.md` first; it must be accurate
- Writing a vague handoff ("working on ticket X") — the handoff must include exact next command and all open items
- Not logging the pause event — the event log is the basis for STATE.md rebuild
- Forgetting to tell the user how to resume

## Footer Template
`Done: handoff/<date>.md, STATE.md updated | Logged: pause event <event-id> | Next: /af-resume (next session) | Needs you: nothing — resume with /af-resume`
