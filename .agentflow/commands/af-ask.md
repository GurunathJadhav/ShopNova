---
name: af-ask
description: Formulate and present structured clarifying questions to the user
phase: discovery, requirements, any
tier: 0
actor: both
core: true
---

# /af-ask — Ask Clarifying Questions

## Purpose
Formulates and records structured question records (`questions/Q-<id>.md`) to resolve ambiguity, gather requirements, clarify architecture, or obtain user decisions. Enforces a maximum batch size of 5 questions, prioritizes blocking questions over non-blocking ones, and always supplies a recommended default with rationale for each question.

## Preconditions
- [ ] `.agentflow/project.md` exists and `project_id` is defined.
- [ ] Requirements or specifications contain ambiguous terms, gaps, or unresolved constraints.
- [ ] No more than 5 unanswered questions are currently pending user response.

## Steps
1. **Identify Ambiguities & Categories:**
   - Scan inputs for vague words ("fast", "user-friendly", "scalable", "etc.", "standard", "robust").
   - Categorize required clarifications: goals/metrics, personas, functional scope, non-functional (security, performance, scale, accessibility), integrations, tech stack, data models, licensing, or compliance.
2. **Formulate Question Batch (Max 5):**
   - Limit the active batch to at most 5 questions.
   - For each question:
     - Determine whether it is `blocking: true` (work cannot proceed without an answer) or `blocking: false`.
     - Provide a clear, actionable recommended default with a technical/business justification.
     - Adapt language based on `user_level` in `project.md` (plain language with real-world examples for non-technical users; precise architectural terms for technical users).
3. **Write Question Records:**
   - For each question, create `.agentflow/questions/Q-<4 base32 chars>-<slug>.md` with front matter:
     - `type: question`
     - `id: Q-<4 base32 chars>-<slug>`
     - `project_id: <project_id>`
     - `schema_version: 1.0.0`
     - `created: <UTC-compact>`
     - `actor: agent`
     - `role: advisor`
     - `category: <category>`
     - `blocking: <true|false>`
     - `status: open` (derived from latest event)
   - Body contains: Question, Why It Matters, Recommended Default & Rationale, Options Considered.
4. **Log Events:**
   - Write event for each question:
     `events/<UTC-compact>-none-question-asked-Q-<id>.md`
5. **Present Questions to User:**
   - Present the numbered questions to the user in chat.
   - Explicitly inform the user they may respond individually, provide custom answers, or reply "accept defaults" for non-critical questions.
6. **Rebuild STATE.md:**
   - Update unknowns, open blockers, and set `next_action`.

## Postconditions
- [ ] `.agentflow/questions/Q-<id>.md` created for each question.
- [ ] Corresponding `question-asked` events recorded in `events/`.
- [ ] Questions presented clearly in conversation with recommended defaults.
- [ ] `.agentflow/STATE.md` updated with open question count and blockers if blocking.

## Next
- **Success:** User responds to questions in chat.
  - If all blocking questions are answered -> `/af-confirm-understanding`.
  - If further questions are needed -> `/af-ask`.
- **Failure:** `/af-ask` — Rephrase questions if user requests clarification or if input was ambiguous.
- **Blocked:** `/af-blockers` — If user cannot provide necessary information immediately and marks question blocked.

## Common Mistakes
- Asking open-ended questions without providing a recommended default and reason.
- Dumping more than 5 questions at once, causing decision fatigue.
- Silently guessing or making implicit assumptions without writing a question or assumption record.
- Proceeding to requirements baseline or coding while blocking questions remain open.

## Footer Template
`Done: asked <count> questions (<Q-ids>) | Logged: <event-ids> | Next: await user reply or /af-confirm-understanding when answered | Needs you: answers to questions <Q-ids> (or reply "accept defaults")`
