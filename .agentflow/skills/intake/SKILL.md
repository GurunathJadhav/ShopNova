---
name: intake
description: Use when any new user message arrives and must be classified before the agent decides whether, what, or how to edit anything.
version: 1.0.0
---

# Intake

## Purpose
Classify every incoming user message into exactly one category and act accordingly. Intake is the gatekeeper: no editing starts until a ticket and approved manifest exist, or the trivial lane is confirmed.

## When to Use
- On every user message, before any other skill or command.
- When a message mixes several intents and needs splitting.
- When the agent is unsure whether a message changes scope.

## Inputs
- The verbatim user message.
- Current open questions `questions/Q-<id>.md` (any with `blocking: true`).
- Current requirements `requirements/REQ-<id>.md` and tickets `tickets/T-<id>.md`.
- `STATE.md` (active ticket, active manifest).

## Steps
1. **Classify the message into exactly one category:**
   - (a) **Answer to an open question** — it resolves a `Q-<id>.md`.
   - (b) **New information** — context, constraints, or facts that change no requirement.
   - (c) **New or changed requirement** — adds, alters, or removes scope → route via `/af-change`.
   - (d) **Trivial-lane request** — tiny, self-contained, no requirement impact (typo fix, one-line config).
   - (e) **Discussion** — question or musing that needs only an answer.
2. **Category (a):** record the answer verbatim in the question record, link question → answer, close the question, then re-check the discovery gate. If the answer reveals a scope change, reclassify to (c).
3. **Category (b):** log it in the relevant record (REQ, ticket, or decision context). Ask nothing unless it creates a new blocking question.
4. **Category (c):** do not edit. Run `/af-change` so the change gets a record and impact analysis.
5. **Category (d):** propose the trivial lane and its scope to the user; editing starts only after the user confirms the lane.
6. **Category (e):** answer only. Record nothing unless the discussion produces a decision.
7. **Gate check before any edit:** a ticket `T-<id>.md` and an approved manifest `manifests/T-<id>.md` exist, or the trivial lane is explicitly confirmed. Otherwise no file outside `.agentflow/` is touched.
8. **Never edit while blocking questions are open** unless the message is itself the blocking answer.

## Checklist
- [ ] Message classified into exactly one category; mixed messages split first.
- [ ] Category (a) answers stored verbatim, not paraphrased, and linked to `Q-<id>.md`.
- [ ] Category (c) routed to `/af-change`, never edited directly.
- [ ] Category (d) lane proposed and confirmed before editing.
- [ ] No edit started without ticket + approved manifest or confirmed trivial lane.
- [ ] No blocking question left silently ignored.

## Anti-Patterns
- Treating a scope statement as "just information" and building it without a change record.
- Paraphrasing user answers instead of storing them verbatim.
- Starting to code because the request "sounds small" without lane confirmation.
- Answering a discussion question and also making an edit in the same turn.
- Silently dropping new information because it does not fit an existing record.

## "Stop and Ask the User If…"
- The message fits two categories and the difference changes what you do next.
- The message seems to be a requirement change but its impact is unclear.
- The gate is unmet and the user expects edits immediately.
- A trivial-lane request touches a file listed in an approved manifest for another ticket.
- The message contradicts a baselined requirement or approved decision `D-<id>.md`.

## Next Skills
- ambiguity-check
- requirements-elicitation
- brainstorming

## Worked Example
User: "Also the export should support CSV — oh and by the way, the deadline moved to Friday."
Split: sentence 1 = (c) new requirement → `/af-change` creates REQ-e5f6-csv-export (`proposed`), impact check finds it touches the export ticket → size increases to M. Sentence 2 = (b) new information → logged in project timeline notes and in the affected tickets' context.
Verbatim answers, no editing started, gate intact.
