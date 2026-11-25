---
name: clean-context-build-loop
description: Use when transitioning from planning to implementation, or between ticket batches, to prevent context pollution via BUILD-BRIEF.md and fresh-session loop rotation.
version: 1.0.0
---

# Clean-Context Build Loop

## Purpose
AI coding quality drops sharply when a single long conversation carries discovery interviews, rejected ideas, and dozens of old verification logs. This skill keeps every build session fast, sharp, and pollution-free using **Clean-Session Batch Loops**.

## When to Use
- Immediately when Planning passes into Implementation (`/af-gate` → `/af-build`).
- When starting a new coding session (`BUILD-BRIEF.md` + `BUILD-PROMPT.txt`).
- After completing a batch of 1–2 tickets (`rapid`/`balanced`: 2 tickets; `strict`: 1 ticket) or an MVP milestone.

## Anti-Context-Pollution Reading Budget
In an implementation session, read **ONLY**:
1. `.agentflow/STATE.md` (status, invariants, active ticket)
2. `.agentflow/BUILD-BRIEF.md` (distilled requirements, ADRs, commands, ticket queue)
3. The **single active** ticket `.agentflow/tickets/T-<id>.md` + its target source files
4. `frontend-and-ui-craft/SKILL.md` (for UI work) or `tdd-implementation/SKILL.md`

**Never** bulk-read `questions/`, old `events/`, or the full `workflow-map.md` during coding.

## The Build Loop (Per Batch of 1–2 Tickets)
1. **Prepare (`node .agentflow/build.js`):** Refresh `BUILD-BRIEF.md` and `BUILD-PROMPT.txt`.
2. **Per Ticket in Batch:**
   - `/af-edit-plan` + `/af-start-ticket` (standing approval SA1 in `rapid`/`balanced` for `src/` + tests; create `ticket/<id>` branch if using branches)
   - Implement cohesive vertical slice (code + responsive styles/states + tests)
   - `/af-verify`: tests + build + lint + **live runtime smoke check** (zero console/runtime errors)
   - `/af-diff-check` → `/af-review` → `/af-done` (record `actual_minutes` & `approx_tokens`)
   - Commit ticket cleanly in git
3. **Refresh & Rotate:**
   - Run `node .agentflow/report.js` (update `.agentflow/report.html` charts/telemetry)
   - Run `node .agentflow/build.js` (refresh `BUILD-BRIEF.md` & `BUILD-PROMPT.txt` for remaining tickets)
   - Tell the user to open a **fresh clean session** and paste the next prompt from `.agentflow/BUILD-PROMPT.txt`.

## Anti-Patterns
- Continuing to build an entire 6-ticket app inside the same bloated discovery chat session.
- Loading every `.md` file in `.agentflow/` "just to be thorough".
- Skipping `report.js` or `build.js` at the end of a ticket batch.
