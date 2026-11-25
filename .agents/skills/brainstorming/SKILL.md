---
name: brainstorming
description: Use when a new feature, project, or vague idea needs divergence and convergence on options BEFORE any requirement is written.
version: 1.0.0
---

# Brainstorming

## Purpose
Run structured divergent/convergent ideation before requirements exist. Produce a ranked set of option sketches, each of which becomes either a candidate requirement or a spike ticket. This skill never starts code; its only output is text that feeds requirements-elicitation.

## When to Use
- The user describes an idea without a concrete feature list.
- A project kickoff session has more unknowns than decisions.
- Multiple plausible solution shapes exist and none is confirmed.
- The user asks "what are our options?" or "help me think this through".

## Inputs
- The user's raw idea statement (verbatim, from intake classification).
- Any existing `.agentflow/project.md`, prior decisions `D-<id>.md`, or lessons `L-<id>.md`.
- Known constraints from prior answers in `questions/Q-<id>.md`.

## Steps
1. **Frame the problem** in one sentence: what outcome, for whom, and why now. Restate it to the user in plain language if `user_level: non-technical`.
2. **Diverge (no evaluation):** Generate 3-5 distinct option sketches. Each sketch = 1-3 sentences: core approach, what makes it different, biggest risk. Keep them genuinely different (vary the mechanism, not the cosmetics).
3. **Converge (explicit criteria):** Pick 2-3 evaluation criteria the user cares about (e.g., time-to-first-value, maintenance cost, risk). Score each option against them in one line.
4. **Ask the user to choose or narrow.** Never pick for them. Present options as short labeled blocks, not a long essay.
5. **Record outcomes:**
   - Confirmed option → write candidate requirements lines (rough, unnumbered) for the next skill.
   - Option with unknown feasibility → create a spike ticket `tickets/T-<id>.md` (`type: spike`, `lane: standard`, size `S`).
   - Rejected option → one line noting why, so it is not re-proposed.
6. **Hand off** to requirements-elicitation with the confirmed option and the open feasibility spikes listed.

## Checklist
- [ ] Problem framed in one sentence and confirmed by the user.
- [ ] At least 3 genuinely distinct options generated.
- [ ] Evaluation criteria named and agreed or defaulted with a stated reason.
- [ ] Every option has a disposition: candidate requirement, spike ticket, or rejected.
- [ ] Spike tickets have `type: spike` and an explicit question they answer.
- [ ] No code written, no files outside `.agentflow/` touched.

## Anti-Patterns
- Writing requirements for the user's first idea without generating alternatives.
- Designing architecture or schema during ideation — that is api-and-data-design territory.
- Presenting options as an unranked wall of text instead of a scored shortlist.
- Starting a spike ticket "to see if it works" without a stated question.
- Quietly dropping rejected options without recording why.

## "Stop and Ask the User If…"
- Two options tie on the criteria and the trade-off is a business decision, not a technical one.
- A spike would cost real time/money (API keys, paid services, >1 day).
- The idea implies changing an existing shipped behavior.
- The user's outcome statement contradicts an earlier decision `D-<id>.md`.

## Next Skills
- requirements-elicitation
- ambiguity-check
- intake

## Worked Example
User: "I want a tool to track my plants."
Options: (a) simple checklist app, (b) schedule/reminder app with watering calendar, (c) sensor-based dashboard.
Criteria: time-to-first-value (a wins), ongoing value (b wins), effort (c loses).
Outcome: user picks (b). Candidate requirements: "watering schedule per plant", "reminders", "history log". Spike ticket T-a1b2-test-reminders: "Can reminders fire without a backend? Answer with a 30-minute prototype of local notifications."
Hand off to requirements-elicitation with option (b) confirmed.
