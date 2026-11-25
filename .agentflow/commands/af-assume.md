---
name: af-assume
description: Record an explicit provisional assumption and request user confirmation
phase: discovery, requirements, any
tier: 0
actor: both
core: false
---

# /af-assume — Record Assumption

## Purpose
Records an explicit provisional assumption when a non-blocking detail or sensible default is needed to make progress. Enforces the core invariant: **"Ask, don't assume"**. The agent never silently assumes; any assumption must be documented as an explicit record (`questions/Q-<id>.md` with `status: assumed`), logged, and surfaced to the user for formal confirmation before it can justify an architectural decision, requirement baseline, or code edit.

## Preconditions
- [ ] Active project initialized.
- [ ] An assumption is being made regarding requirements, scope, architecture, or environment.
- [ ] The assumption is non-blocking (blocking unknowns must be queried via `/af-ask` and answered directly).

## Steps
1. **Analyze Assumption & Impact:**
   - Define the assumption clearly in concrete terms.
   - Articulate why the assumption is reasonable (e.g. industry best practice, standard framework convention).
   - Evaluate the risk and impact if the assumption proves incorrect.
   - List alternative possibilities.
2. **Create Assumption Record:**
   - Generate ID `Q-<4 base32 chars>-<slug>`.
   - Write `.agentflow/questions/Q-<id>.md` with front matter:
     - `type: question`
     - `id: Q-<id>`
     - `project_id: <project_id>`
     - `schema_version: 1.0.0`
     - `created: <UTC-compact>`
     - `actor: agent`
     - `role: advisor`
     - `category: <category>`
     - `blocking: false`
     - `status: assumed`
   - In the body, document:
     - The assumption statement.
     - Basis / justification.
     - Alternatives considered.
     - Confirmation criteria.
3. **Log Event:**
   - Write event record:
     `events/<UTC-compact>-none-assumption-recorded-Q-<id>.md`
4. **Prompt User for Confirmation:**
   - Present the assumption clearly to the user:
     "I am recording the following assumption: `<statement>`. Reason: `<reason>`. If this is incorrect, please provide your preference; otherwise, please confirm."
5. **Rebuild STATE.md:**
   - Include the unconfirmed assumption in `STATE.md` under Unknowns / Open Assumptions.

## Postconditions
- [ ] `.agentflow/questions/Q-<id>.md` created with `status: assumed`.
- [ ] Event `events/<UTC-compact>-none-assumption-recorded-Q-<id>.md` logged.
- [ ] Unconfirmed assumption tracked in `STATE.md`.

## Next
- **Success (user confirms):** Log `assumption-confirmed` event and proceed to `/af-ask` or `/af-confirm-understanding`.
- **Correction (user overrides):** Log `question-answered` event with user's explicit directive.
- **Blocked:** Wait for user confirmation if downstream decisions depend on this assumption.

## Common Mistakes
- Silently adopting assumptions in code or design without writing an assumption record.
- Using `/af-assume` for critical, high-risk, or irreversible choices (e.g. database choice, licensing) instead of asking blocking questions.
- Treating an unconfirmed assumption as verified fact when advancing phase gates.

## Footer Template
`Done: recorded assumption Q-<id> (<summary>) | Logged: <event-id> | Next: await confirmation or /af-ask | Needs you: confirm or correct assumption Q-<id>`
