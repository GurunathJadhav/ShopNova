---
name: af-stuck
description: Report being stuck after 3 similar failures; records a blocker and switches hypothesis
phase: any
tier: 0
actor: agent
core: false
---

# /af-stuck — Report Being Stuck After 3 Failures

## Purpose
Called when the agent has made 3 similar failed attempts at the same step without success. Prevents the agent from looping indefinitely. Records a formal blocker, requires a hypothesis change or owner input before continuing, and may invoke the `debugging` skill. The agent must stop, not guess again with the same approach.

## Preconditions
- [ ] The agent has attempted the same logical step at least 3 times without success
- [ ] Each failure has been documented (evidence of what was tried and what failed)
- [ ] The agent cannot resolve the issue independently with its current information

## Steps
1. **Summarise the attempts.** Write a brief account of:
   - What was attempted (all 3 approaches)
   - What failed in each case (exact error, test failure, or unexpected output)
   - What hypothesis each attempt was based on
2. **Record a blocker.** Create `blockers/B-<id>-<slug>.md`:
   ```
   ---
   type: blocker
   id: B-<id>-<slug>
   project_id: <project_id>
   schema_version: 1.0.0
   created: <ts>
   actor: <agent>
   role: agent
   blocker_type: technical
   description: <what is blocked>
   dependent_tickets: [<ticket-id>]
   needed_by: <owner, unblocked by new hypothesis or owner input>
   ---
   ## Attempts
   1. Hypothesis: <> | Action: <> | Result: <>
   2. Hypothesis: <> | Action: <> | Result: <>
   3. Hypothesis: <> | Action: <> | Result: <>
   ## Why these failed
   <analysis>
   ## What is needed to unblock
   <options: new hypothesis, owner input, additional verification>
   ```
3. **Log a stuck event.** Write `events/<ts>-<ticket-id>-stuck-<id>.md` with `event_type: stuck`, blocker id, and summary.
4. **Switch mode to `debugging`.** Load `skills/debugging/SKILL.md` and follow the debugging protocol:
   - Change the hypothesis
   - Identify the smallest possible reproduction
   - Ask a clarifying question rather than guessing
5. **Ask the owner.** Present the problem plainly:
   - What you are trying to do
   - What you have tried
   - Your new hypothesis
   - What you need from the owner (a command output, a clarification, a decision)
6. **Update `STATE.md`** with the blocker under Open Blockers and updated `next_action`.

## Postconditions
- [ ] `blockers/B-<id>.md` created
- [ ] Stuck event logged in `events/`
- [ ] `STATE.md` updated with blocker and new `next_action`
- [ ] Owner asked with a specific, answerable question

## Next
- **Success (new hypothesis works):** resolve blocker via `/af-log` (blocker-resolved event); continue with `/af-verify`
- **Failure (owner cannot unblock):** `/af-blockers` — escalate; consider splitting or deferring the ticket
- **Blocked (waiting on owner answer):** wait; `/af-next` will route to other unblocked work

## Common Mistakes
- Calling `/af-stuck` after 1 or 2 failures — only after 3 similar attempts
- Logging stuck but then trying the same approach a 4th time — a hypothesis change is required
- Presenting the problem without a specific question — vague "I'm stuck" messages don't help the owner
- Not loading the debugging skill — it has specific protocols for changing hypothesis and minimising reproduction
- Continuing on the same ticket without resolving the blocker — route to other unblocked work via `/af-next`

## Footer Template
`Done: blockers/B-<id>.md, stuck event <event-id> | Logged: <event-ids> | Next: /af-ask because stuck after 3 attempts | Needs you: <specific question for owner>`
