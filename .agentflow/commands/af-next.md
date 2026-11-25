---
name: af-next
description: Determine and output the single recommended next command with rationale and prerequisites
phase: any
tier: 0
actor: both
core: true
---

# /af-next — What to Do Next

## Purpose
Inspects the current project status in `STATE.md`, verifies freshness against the event log, consults `workflow-map.md`, and outputs the single authoritative recommended next command. Details why it is next, what artifacts it will produce, what conditions block it, and what inputs or approvals are needed from the human.

## Preconditions
- [ ] `.agentflow/project.md` exists.
- [ ] `.agentflow/STATE.md` exists and is readable (if missing, run `/af-rebuild` or `/af-doctor`).
- [ ] `.agentflow/workflow-map.md` exists.

## Steps
0. **Fast Tier 1/2 Path (Recommended):** Run `python .agentflow/scripts/af_gate_runner.py next` — deterministically inspects `STATE.md`, `questions/`, `requirements/`, `tickets/`, and outputs the single recommended next command without loading the 29 KB `workflow-map.md`.
1. **Re-grounding & State Inspection:**
   - Read the invariant block of `STATE.md` to re-ground rules.
   - Extract current values: `phase`, `edit_lock`, `tier`, `active_ticket`, `active_manifest`, `unverified_step`, open blockers, and recent events.
2. **Freshness Verification:**
   - Check the newest event filename in `.agentflow/events/` against `built_from` in `STATE.md`.
   - If `STATE.md` is stale, trigger an internal state re-evaluation to bring `STATE.md` up to date.
3. **Workflow Map Matching:**
   - Look up the active `phase` and situation in `.agentflow/workflow-map.md`.
   - Prioritize resolving urgent conditions:
     - If an unverified step exists -> recommend `/af-verify` or `/af-revert-unverified`.
     - If open blockers exist with pending human action -> announce blocker, route to unblocked ticket or `/af-blockers`.
     - If phase exit criteria are satisfied -> recommend `/af-gate`.
     - If in active ticket with approved manifest -> recommend implementation micro-cycle or `/af-verify`.
     - If ticket complete -> recommend `/af-diff-check` -> `/af-regression` -> `/af-review` -> `/af-done`.
4. **Human Action Gate Check:**
   - Review `.agentflow/APPROVALS-NEEDED.md` and open questions in `questions/Q-*.md`.
   - If human input is required (e.g. approval of manifest, answering blocking question, phase gate sign-off), explicitly list what the user must provide. **Never fake or simulate human approval.**
5. **Output Recommendation:**
   - Print the exact command name (e.g. `/af-verify`).
   - Provide the rationale (why this command is next).
   - List expected output artifacts and postconditions.
   - Present any required human prompt clearly.

## Postconditions
- [ ] Next command clearly announced to the user.
- [ ] `STATE.md` `next_action` section matches the announced recommendation.

## Next
- **Success:** `/af-<recommended-command>` — Execute the recommended command.
- **Failure:** `/af-doctor` — If state or workflow map cannot be parsed or is in an invalid state.
- **Blocked:** `/af-blockers` — If all forward paths require external human input or credentials.

## Common Mistakes
- Simulating or assuming human approval instead of waiting for explicit human response.
- Recommending source code edits when `edit_lock: locked` or when no approved manifest exists.
- Recommending an out-of-phase command without explaining gate prerequisites.
- Forgetting to check for unverified steps before recommending a new edit or ticket transition.

## Footer Template
`Done: analyzed state from <built_from> | Logged: none | Next: <recommended-command> because <rationale> | Needs you: <user action or "nothing">`
