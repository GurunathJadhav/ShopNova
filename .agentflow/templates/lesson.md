<!-- Template: lesson
     Record type: lesson (L-xxxx-slug)
     Purpose: Records what went wrong, why, and what to do differently.
              Lessons are read at session start (within the L0 token cap).
              They improve agent behaviour on future tickets.
     Folder: .agentflow/lessons/
     Spec ref: §S17
-->
---
type: lesson
id: L-XXXX-short-slug
project_id: PROJ-XXXX
schema_version: 1.0.0
created: 20260101T000000Z
actor: "agent | human"
role: "owner | agent | reviewer"
ticket_link: "T-XXXX-slug | none"
category: "wrong-assumption | hallucination | over-engineering | missed-verification | scope-creep | test-weakening | other"
---

## What Happened

PLACEHOLDER — describe the incident or mistake in concrete terms. What did the agent (or human) do, and what was the observable consequence?

## What Was Wrong

PLACEHOLDER — explain the root cause. Was it a wrong assumption, a missing verification step, an unlabelled inferred fact, an over-engineered solution, a scope drift, etc.?

**Rule or principle violated:** PLACEHOLDER — reference the specific spec rule (e.g., "§S6.1 — inferred fact used without promotion") or project convention.

## What to Do Differently

PLACEHOLDER — state the corrective action as a clear, actionable instruction for future agents (or the next session).

**Checklist addition (if any):**
- [ ] PLACEHOLDER — optional: add a new pre-edit checklist item to prevent recurrence.

## Ticket Link

**Ticket:** `T-XXXX-slug` — PLACEHOLDER (the ticket during which this lesson was learned, or `none` for project-level lessons)

## Prevention

PLACEHOLDER — if a skill, template, or rule change would prevent this in future, name it. File a ticket if a framework change is warranted.

---

## Format Spec

| Field | Required | Allowed values / format |
|---|---|---|
| `type` | yes | `lesson` |
| `id` | yes | `L-<4 base32 chars>-<slug>` |
| `project_id` | yes | must match `project.md` |
| `schema_version` | yes | `1.0.0` |
| `created` | yes | compact UTC `20260101T000000Z` |
| `actor` | yes | `agent` or `human` |
| `role` | yes | `owner \| agent \| reviewer` |
| `ticket_link` | yes | ticket id or `none` |
| `category` | yes | see allowed list below |

**Allowed `category` values:**
`wrong-assumption`, `hallucination`, `over-engineering`, `missed-verification`, `scope-creep`, `test-weakening`, `other`

**Rules:**
- Latest lessons are included in `STATE.md` (within the L0 token cap).
- Lessons are read at the start of each session by the `session-handoff-resume` skill.
- If a lesson implies a framework rule or template change, create a ticket for it.

---

## Worked Example

```
<!-- Template: lesson -->
---
type: lesson
id: L-2P8M-inferred-fact-edit
project_id: PROJ-4B9X
schema_version: 1.0.0
created: 20261118T163000Z
actor: agent
role: agent
ticket_link: T-7K2M-login
category: missed-verification
---

## What Happened

During ticket T-7K2M-login, the agent assumed that `bcrypt` was already installed (from a prior session's context), called `bcrypt.checkpw()` in the new login route, and committed the edit. The test runner then failed with `ModuleNotFoundError: No module named 'bcrypt'` because the dependency had not been added to `requirements.txt` and the virtual environment was freshly created.

## What Was Wrong

The agent used an inferred fact ("bcrypt is installed") as the basis for an edit without first promoting it to `verified` via `/af-label`. This violates §S6.1: "Inferred facts cannot justify an edit, dependency, or `done` until promoted."

**Rule violated:** §S6.1 — claim label `inferred`, used as basis for edit without promotion.

## What to Do Differently

Before calling any external library in new code:
1. Check the claim store for a `verified` claim about that library being installed.
2. If no verified claim exists, run `pip show <library>` and record the result as a `verified` claim (or `unknown` if it fails).
3. Only then proceed with the edit.

**Checklist addition:**
- [ ] Before using any library: confirm a `verified` CL-xxxx claim exists for it in the project.

## Ticket Link

**Ticket:** `T-7K2M-login` — discovered during step 2 (login route implementation).

## Prevention

The `tdd-implementation` skill's pre-edit checklist should explicitly include "verify all imported libraries exist as verified claims." Filing follow-up T-9X3R-skill-tdd-checklist-update.
```
