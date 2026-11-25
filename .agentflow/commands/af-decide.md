---
name: af-decide
description: Record an architectural or design decision as an immutable Architecture Decision Record (ADR)
phase: planning, discovery, any
tier: 0
actor: both
core: false
---

# /af-decide — Architecture Decision Record

## Purpose
Documents significant technical, architectural, or design choices as immutable Architecture Decision Records (`decisions/D-<id>-<slug>.md`) (§S9.1). Evaluates alternatives, articulates trade-offs, and distinguishes between **two-way decisions** (reversible with light scrutiny) and **one-way decisions** (high blast radius or exit cost: data models, public APIs, hosting, licensing, database migrations) which require explicit owner approval (§S7).

## Preconditions
- [ ] Project initialized with `.agentflow/project.md`.
- [ ] An architectural, technical, or design question has been identified.

## Steps
1. **Analyze Context & Problem Statement:**
   - Define the architectural decision to be made and why it is necessary.
   - Trace the decision to relevant requirements (`requirements/REQ-*.md`) or constraints.
2. **Evaluate Alternative Options:**
   - Document at least 2 distinct, viable technical alternatives.
   - Contrast pros, cons, complexity, maintenance burden, and performance for each option.
   - For high-impact choices, explicitly evaluate the **Exit Cost** (how difficult and expensive would it be to reverse this decision later?).
3. **Classify Decision Type (§S7):**
   - **Two-way:** Readily reversible, low systemic impact.
   - **One-way:** High impact, irreversible, or severe exit cost (e.g. database paradigm, API contract, security architecture). **Requires mandatory owner approval.**
4. **Draft Decision Record (ADR):**
   - Generate unique ID: `D-<4 base32 chars>-<slug>`.
   - Create `.agentflow/decisions/D-<id>-<slug>.md` with front matter:
     - `type: decision`
     - `id: D-<id>`
     - `project_id: <project_id>`
     - `schema_version: 1.0.0`
     - `created: <UTC-compact>`
     - `actor: agent` (or `<github-username>` from `.agentflow/project.md` `owner:` if human-authored)
     - `role: architect`
     - `approved_by: <github-username from project.md owner:>` (NEVER write literal `"owner"` or `"<owner-name>"`)
     - `decision_type: <one-way|two-way>`
     - `status: proposed` (or `accepted` if confirmed by `<github-username>`)
     - `supersedes: <D-prior-id or none>`
   - **Identity Rule:** Never write generic `"owner"` in decision files — always write the GitHub username from `.agentflow/project.md`.
   - In the body, document:
     - Context & Problem Statement
     - Options Considered (with detailed trade-offs)
     - Decision & Rationale
     - Consequences (positive, negative, risks)
     - Reversibility & Exit Cost Strategy
5. **Handle Approval for One-Way Decisions:**
   - If classified as `one-way`:
     - Present the decision summary and trade-offs to the project owner in chat.
     - Add entry to `.agentflow/APPROVALS-NEEDED.md`.
     - Upon owner approval, write `.agentflow/approvals/A-<id>.md` and update status to `approved`.
6. **Log Event & Update State:**
   - Write event:
     `events/<UTC-compact>-none-decision-recorded-D-<id>.md`
   - Rebuild `STATE.md`: add one-line summary under `## Key Decisions`.

## Postconditions
- [ ] Immutable ADR created in `.agentflow/decisions/`.
- [ ] Owner approval logged if decision was one-way.
- [ ] Event `decision-recorded` logged.
- [ ] `STATE.md` updated with key decision one-liner.

## Next
- **Success (Approved):** `/af-env` or advance to `/af-gate`.
- **Awaiting Owner Approval:** Wait for owner confirmation in chat.
- **Superseding Prior Decision:** Ensure `supersedes: D-...` is recorded on the new record.

## Common Mistakes
- Silently adopting architectural frameworks or libraries without writing an ADR.
- Editing an existing ADR in-place instead of creating a new superseding decision record.
- Classifying irreversible choices (e.g. database schema, core framework) as two-way decisions.
- Omitting negative consequences or trade-offs from the ADR body.

## Footer Template
`Done: recorded decision D-<id> (<title>, type: <one-way|two-way>) | Logged: <event-id> | Next: <next-command> | Needs you: <approve if one-way, else nothing>`
