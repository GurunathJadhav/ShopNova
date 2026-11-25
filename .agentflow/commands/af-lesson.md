---
name: af-lesson
description: Record a lesson learned, optionally linked to a ticket
phase: any
tier: 0
actor: both
core: false
---

# /af-lesson — Record a Lesson Learned

## Purpose
Creates a formal lesson record in `lessons/L-<id>-<slug>.md` when an agent mistake, wrong assumption, or notable process success is identified. Lessons are read at session start (within the L0 token cap) and during retrospectives. Can be called at any point; not just during retros.

## Preconditions
- [ ] A specific event occurred that is worth recording for future sessions
- [ ] The lesson can be linked to at least one ticket or event (or explained without one)

## Steps
1. **Identify the lesson type:**
   - `mistake` — agent did something wrong (wrong assumption, bad edit, skipped step)
   - `success` — something worked notably well and should be repeated
   - `discovery` — an unexpected technical or process fact worth remembering
2. **Draft the lesson.** Answer concisely:
   - **What happened:** one or two sentences describing the event
   - **What was wrong (or right):** root cause or reason for success
   - **What to do differently (or keep doing):** specific, actionable guidance
3. **Link to ticket.** If this arose during a ticket, note the ticket id. If it arose in a retro or discussion, note the event or epic.
4. **Write the lesson file.** Create `lessons/L-<id>-<slug>.md`:
   ```
   ---
   type: lesson
   id: L-<id>-<slug>
   project_id: <project_id>
   schema_version: 1.0.0
   created: <ts>
   actor: <agent-or-user>
   role: <role>
   lesson_type: mistake | success | discovery
   ticket_link: <ticket-id or none>
   ---
   ## What happened
   <description>
   ## What was wrong / what worked
   <root cause or reason>
   ## What to do differently / keep doing
   <actionable guidance>
   ```
5. **Log an event.** Write `events/<ts>-<ticket-or-none>-lesson-<lesson-id>.md` with `event_type: lesson`, lesson id, and a one-line summary.
6. **Update `STATE.md`** Latest Lessons section with a one-liner from this lesson (within the cap).

## Postconditions
- [ ] `lessons/L-<id>-<slug>.md` created
- [ ] Lesson event logged in `events/`
- [ ] `STATE.md` Latest Lessons updated

## Next
- **Success:** `/af-next` — continue the interrupted workflow
- **If lesson implies a rule change:** `/af-rule-change` — propose changing the rule that was violated or missing
- **Blocked:** `/af-ask` — if the cause of the lesson is unclear, ask the owner before recording

## Common Mistakes
- Writing vague lessons ("be more careful") — lessons must be specific and actionable
- Recording the same lesson twice — check `lessons/` for existing similar entries first
- Skipping the lesson event — events are how `STATE.md` picks up new lessons
- Linking to no ticket when one clearly exists — always link when possible for traceability
- Waiting for the retro to record lessons — record them immediately when they happen

## Footer Template
`Done: lessons/L-<id>-<slug>.md | Logged: <event-id> | Next: /af-next because lesson recorded | Needs you: nothing`
