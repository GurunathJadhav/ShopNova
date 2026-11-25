---
name: af-requirements
description: Baseline formal project requirements from discovery and establish approved scope boundary
phase: requirements
tier: 0
actor: both
core: false
---

# /af-requirements — Baseline Requirements

## Purpose
Transforms confirmed discovery insights into formal, granular requirement records (`requirements/REQ-<id>.md`). Defines acceptance criteria, source traceability, and MoSCoW priorities (`must`, `should`, `could`, `wont`). Establishes the authoritative Scope Baseline (MVP Boundary) and submits it to the project owner for formal sign-off.

## Preconditions
- [ ] Active phase is `requirements`.
- [ ] Discovery understanding has been confirmed by project owner (`baselines/discovery-summary.md` exists).
- [ ] No unconfirmed assumptions or open blocking questions remain.

## Steps
1. **Extract Atomic Requirements:**
   - Parse confirmed discovery findings into distinct, atomic requirements (functional and non-functional).
   - Ensure each requirement is testable and unambiguous.
2. **Assign Attributes & Traceability:**
   - Assign unique ID: `REQ-<4 base32 chars>-<slug>`.
   - Assign MoSCoW Priority:
     - `must`: Mandatory for MVP release.
     - `should`: High priority, vital if feasible.
     - `could`: Desirable enhancement if budget/time permits.
     - `wont`: Agreed out-of-scope for current milestone.
   - Link to discovery source (referencing question `Q-<id>` or owner decision).
3. **Write Requirement Records:**
   - Create individual files in `.agentflow/requirements/REQ-<id>.md` with front matter:
     - `type: requirement`
     - `id: REQ-<id>`
     - `project_id: <project_id>`
     - `schema_version: 1.0.0`
     - `created: <UTC-compact>`
     - `actor: agent`
     - `role: analyst`
     - `priority: <must|should|could|wont>`
     - `category: <functional|performance|security|accessibility|integration>`
     - `source_question: <Q-id>`
     - `status: proposed`
   - Document statement, rationale, acceptance criteria outline, and boundary constraints in the body.
4. **Compile Scope Baseline & Derived View:**
   - Generate derived index `.agentflow/requirements.md` listing all requirements grouped by priority.
   - Present the comprehensive baseline proposal to the project owner:
     "Owner: please review the proposed Requirements Baseline. Do you approve this as the official Scope Baseline / MVP boundary for the project?"
5. **Record Owner Approval & Seal Baseline:**
   - Upon owner confirmation:
     - Create `.agentflow/approvals/A-<4 base32 chars>-requirements-baseline.md` quoting owner's verbatim confirmation.
     - Write baseline snapshot: `.agentflow/baselines/requirements-baseline.md`.
     - Log event:
       `events/<UTC-compact>-none-requirements-baselined-baseline-req.md`
     - Update requirement status to `baselined`.
6. **Rebuild STATE.md:**
   - Refresh requirements count and set `next_action`: `/af-gate`.

## Postconditions
- [ ] `.agentflow/requirements/REQ-<id>.md` records created.
- [ ] Derived index `.agentflow/requirements.md` generated.
- [ ] Baseline snapshot `.agentflow/baselines/requirements-baseline.md` saved.
- [ ] Owner approval record `.agentflow/approvals/A-<id>.md` logged.
- [ ] Event `requirements-baselined` recorded.
- [ ] `STATE.md` updated.

## Next
- **Success:** `/af-gate` — Advance from `requirements` to `tickets` phase.
- **Scope Adjustments Needed:** `/af-ask` — Refine requirements based on owner feedback.
- **Blocked:** Wait for owner sign-off on the baseline.

## Common Mistakes
- Grouping unrelated features into a single massive requirement.
- Skipping MoSCoW prioritization, resulting in an unbounded MVP.
- Editing requirements files directly later instead of following the formal `/af-change` process.

## Footer Template
`Done: baselined <count> requirements (Must: <n>, Should: <n>) | Logged: <event-id> | Next: /af-gate to enter tickets phase | Needs you: approve requirements baseline`
