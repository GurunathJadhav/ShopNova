<!-- Template: event
     Record type: event (no prefix — filename encodes the facts)
     Purpose: Logs a single state-change. The filename carries all index-searchable
              facts: events/<UTC-compact>-<ticket-or-none>-<event-type>-<id>.md
              Events are immutable; corrections are new events with supersedes.
              Status of any record is read from the LATEST event for its id.
     Folder: .agentflow/events/
     Spec ref: §S9.1
-->
---
type: event
id: EVT-XXXX-short-slug
project_id: PROJ-XXXX
schema_version: 1.0.0
created: 20260101T000000Z
actor: "agent | human"
actor_name: "PLACEHOLDER — agent model name or human name/handle"
role: "owner | approver | reviewer | observer | agent"
event_type: "PLACEHOLDER — see allowed list in Format Spec"
ticket_id: "T-XXXX-slug | none"
target_id: "PLACEHOLDER — id of the record whose state changed (ticket, question, decision, …)"
summary: "PLACEHOLDER — one-line human-readable description of what changed"
evidence_refs: []
supersedes: ""
---

## Event Detail

**What changed:** PLACEHOLDER — describe the state transition (e.g., ticket moved from `in-progress` to `in-review`).

**Actor:** PLACEHOLDER — who or what triggered this event and in what role.

**Context:** PLACEHOLDER — any brief context that helps reconstruct why this event happened (link to blocking question, failing test, user message).

## Evidence

<!-- List evidence file paths or external references that support this event. -->

- PLACEHOLDER — e.g., `evidence/T-XXXX-slug/test-run-01.md` or "user message in chat at 20261115T094200Z"

---

## Format Spec

| Field | Required | Allowed values / format |
|---|---|---|
| `type` | yes | `event` |
| `id` | yes | `EVT-<4 base32 chars>-<slug>` |
| `project_id` | yes | must match `project.md` |
| `schema_version` | yes | `1.0.0` |
| `created` | yes | compact UTC `20260101T000000Z` |
| `actor` | yes | `agent` or `human` |
| `actor_name` | yes | name or model identifier |
| `role` | yes | `owner \| approver \| reviewer \| observer \| agent` |
| `event_type` | yes | see allowed list below |
| `ticket_id` | yes | ticket id or `none` |
| `target_id` | yes | id of the record that changed |
| `summary` | yes | one-line string |
| `evidence_refs` | no | YAML list of paths or references |
| `supersedes` | no | id of the event this corrects, empty otherwise |

**Allowed `event_type` values:**
`question-answered`, `question-assumed`, `question-deferred`,
`ticket-created`, `ticket-ready`, `ticket-claimed`, `ticket-in-progress`,
`ticket-in-review`, `ticket-done`, `ticket-blocked`, `ticket-deferred`,
`ticket-cancelled`, `ticket-superseded`, `ticket-reopened`,
`decision-recorded`, `decision-superseded`,
`requirement-proposed`, `requirement-baselined`, `requirement-in-progress`,
`requirement-delivered`, `requirement-descoped`, `requirement-dropped`,
`manifest-submitted`, `manifest-approved`, `manifest-rejected`,
`baseline-recorded`, `verification-recorded`, `approval-recorded`,
`claim-recorded`, `claim-promoted`,
`blocker-opened`, `blocker-resolved`,
`review-submitted`, `review-approved`, `review-rejected`,
`gate-passed`, `gate-failed`,
`waiver-granted`, `waiver-expired`,
`scope-expansion-requested`, `scope-expansion-approved`, `scope-expansion-rejected`,
`revert-recorded`, `rename-recorded`, `external-change-detected`,
`incident-opened`, `incident-resolved`,
`lesson-recorded`, `risk-recorded`, `risk-mitigated`,
`handoff-recorded`, `session-paused`, `session-resumed`,
`rule-change-requested`, `rule-change-approved`, `rule-change-rejected`,
`correction`

**Filename pattern:** `events/<UTC-compact>-<ticket-id-or-none>-<event-type>-<target-id>.md`

**Example filename:** `events/20261115T093000Z-T-x4kq-login-ticket-in-progress-T-x4kq-login.md`

---

## Worked Example

```
<!-- Template: event -->
---
type: event
id: EVT-9P2R-login-ticket-done
project_id: PROJ-4B9X
schema_version: 1.0.0
created: 20261118T154500Z
actor: agent
actor_name: gemini-2.5-pro
role: agent
event_type: ticket-done
ticket_id: T-7K2M-login
target_id: T-7K2M-login
summary: "Ticket T-7K2M-login marked done: all criteria verified, review passed, diff clean"
evidence_refs:
  - evidence/T-7K2M-login/test-run-final.md
  - reviews/R-3L9Q-login-review.md
supersedes: ""
---

## Event Detail

**What changed:** Ticket T-7K2M-login transitioned from `in-review` to `done`.

**Actor:** gemini-2.5-pro (agent), acting under role `agent` on behalf of owner alice.

**Context:** Independent review by fresh-session agent passed with no blocking findings (R-3L9Q). Full regression suite ran clean (evidence/T-7K2M-login/test-run-final.md). Diff check mapped all 14 changed hunks to acceptance criteria.

## Evidence

- `evidence/T-7K2M-login/test-run-final.md` — pytest output, 42 passed 0 failed
- `reviews/R-3L9Q-login-review.md` — independent review, 0 blocking findings
```
