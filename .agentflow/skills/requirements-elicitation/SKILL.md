---
name: requirements-elicitation
description: Use when a confirmed idea or feature needs a concrete, prioritized, unambiguous requirements baseline before any ticket or code is written.
version: 1.0.0
---

# Requirements Elicitation

## Purpose
Extract requirements from the user through small batches of blocking-first questions, then record them as a requirements baseline (`requirements/REQ-<id>.md`). The baseline becomes the MVP boundary; nothing downstream may exceed it.

## When to Use
- After brainstorming has confirmed an option, or at project start.
- A new feature enters scope and no REQ record covers it.
- The discovery gate is open and unanswered questions remain.

## Inputs
- Confirmed option and candidate requirement lines from brainstorming.
- `user_level` from `.agentflow/project.md` (drives plain-language mode).
- Prior answers in `questions/Q-<id>.md`.

## Steps
1. **Set discovery depth:** `express` (1 batch, launch-blocking only), `standard` (2-3 batches), or `deep` (as many as needed, one per category).
2. **Cover every category at the chosen depth:** goals and success metrics; users and personas; functional scope; non-functional requirements; tech constraints; integrations; data; UX; deployment; budget and timeline; out-of-scope; compliance, legal, and privacy (including the project's own licence); localisation; cost and hosting; support and ownership; third-party accounts needed (API keys, credentials).
3. **Batch questions:** max 5 per batch. Blocking questions first. Every question offers a recommended default plus a one-line reason. Ask via `/af-ask`; log each as `questions/Q-<id>.md` with `blocking` set.
4. **Plain-language mode (`user_level: non-technical`):** explain each technical term on first use, and restate every technical decision in business terms ("a database" → "where the records are stored").
5. **No silent assumptions:** anything not answered is recorded as status `assumed` in the REQ. It does not count as a requirement until the user confirms it. Never write `assumed` without a `source_answer` placeholder naming the question.
6. **Write the baseline:** one file per requirement, `requirements/REQ-<id>.md`, with `priority` (`must`/`should`/`may`) and `status`:
   - `proposed` → written, awaiting owner approval.
   - `baselined` → owner approved; approval creates the scope baseline (MVP boundary).
   - `in-progress` / `delivered` / `descoped` / `dropped` → updated only via `/af-change`.
7. **Close the discovery gate** only when zero blocking questions are open and zero assumptions are unconfirmed.

## Checklist
- [ ] All 16 categories considered; each either covered or explicitly marked not applicable with a reason.
- [ ] No batch exceeded 5 questions; blocking questions came first.
- [ ] Every question recorded as `Q-<id>.md` with a recommended default.
- [ ] No requirement has status other than `proposed` without owner approval on record.
- [ ] Every `assumed` item names its pending question.
- [ ] Discovery gate closed only with zero blocking questions and zero unconfirmed assumptions.

## Anti-Patterns
- Asking open-ended "anything else?" questions instead of concrete defaults.
- Marking an assumption as baselined because the user stayed silent.
- Baseline sprawl: writing 40 requirements for an MVP — cap at what first delivery needs.
- Skipping out-of-scope and compliance categories because they "feel premature".
- Editing an approved REQ in place instead of running `/af-change`.

## "Stop and Ask the User If…"
- Any requirement is genuinely undecidable and no safe default exists (e.g., which payment provider).
- A blocking question is unanswered after two attempts.
- The user proposes scope beyond the agreed MVP boundary mid-session.
- A requirement conflicts with an approved decision `D-<id>.md`.
- The project's licence or data-privacy posture is unclear and the feature touches user data.

## Next Skills
- ambiguity-check
- user-story-writing
- ticket-breakdown
- intake

## Worked Example
Batch (standard depth, blocking first): "1. Must the first version store data locally only, or sync to a cloud account? Default: local only — fastest to ship and no privacy handling needed. 2. Who is the primary user — you alone, or family members too? Default: you alone. 3. Is email login required? Default: no — local app, no auth."
Answers recorded verbatim in Q-<id>.md. Requirements: REQ-a1b2-local-storage (`must`, baselined after owner approval), REQ-c3d4-family-sharing (`assumed`, pending Q-9m2p). Discovery gate stays open until the owner confirms REQ-c3d4-family-sharing.
