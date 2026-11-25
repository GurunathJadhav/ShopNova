<!-- Template: review
     Record type: review (R-xxxx-slug)
     Purpose: Records an independent review of a ticket. The reviewer re-runs
              verification commands rather than trusting pasted output.
              Self-review is necessary but not sufficient for Standard tickets.
              Blocking findings prevent 'done'.
     Folder: .agentflow/reviews/
     Spec ref: §S6.4
-->
---
type: review
id: R-XXXX-short-slug
project_id: PROJ-XXXX
schema_version: 1.0.0
created: 20260101T000000Z
actor: "agent | human"
role: "reviewer | owner | approver"
ticket_id: T-XXXX-slug
review_packet_ref: "PLACEHOLDER — path to the review packet (ticket, criteria, manifest, diff, evidence)"
reviewer_identity: "PLACEHOLDER — agent session id, model name, or human name/handle"
reviewer_type: "agent | human | fresh-session"
overall_result: "approved | approved-with-minor | rejected"
---

## Review Packet

**Packet ref:** `PLACEHOLDER — e.g., reviews/packets/T-XXXX-review-packet.md`

**Packet contents verified:**
- [ ] Ticket and acceptance criteria reviewed
- [ ] Approved manifest reviewed
- [ ] Diff reviewed (all hunks mapped to criteria)
- [ ] Evidence files reviewed

## Verification Re-runs

<!-- The reviewer re-runs verification commands independently.
     Record each command, its result, and whether it matched the original evidence. -->

| Criterion | Command re-run | Result | Matches original evidence? |
|---|---|---|---|
| Criterion 1 — PLACEHOLDER | `PLACEHOLDER — command` | `pass \| fail \| unverified` | `yes \| no \| unverified` |
| Criterion 2 — PLACEHOLDER | `PLACEHOLDER — command` | `pass \| fail \| unverified` | `yes \| no \| unverified` |

## Findings

<!-- Each finding has a severity. Blocking findings stop 'done'. -->

### Finding 1 — PLACEHOLDER title

**Severity:** `blocking | major | minor | info`

**Description:** PLACEHOLDER — describe the problem clearly.

**Location:** PLACEHOLDER — file, line, or criterion reference.

**Required action:** PLACEHOLDER — what must be fixed before approval (for blocking/major).

---

<!-- Add more findings as needed, or remove this section if no findings. -->

## Overall Result

**Result:** `approved | approved-with-minor | rejected`

**Summary:** PLACEHOLDER — one paragraph summarising the review outcome and any conditions.

**Blocking findings count:** PLACEHOLDER (0 = may proceed to done)

---

## Format Spec

| Field | Required | Allowed values / format |
|---|---|---|
| `type` | yes | `review` |
| `id` | yes | `R-<4 base32 chars>-<slug>` |
| `project_id` | yes | must match `project.md` |
| `schema_version` | yes | `1.0.0` |
| `created` | yes | compact UTC `20260101T000000Z` |
| `actor` | yes | `agent` or `human` |
| `role` | yes | `reviewer \| owner \| approver` |
| `ticket_id` | yes | `T-xxxx-slug` |
| `review_packet_ref` | yes | path to review packet |
| `reviewer_identity` | yes | session id, model name, or human name |
| `reviewer_type` | yes | `agent \| human \| fresh-session` |
| `overall_result` | yes | `approved \| approved-with-minor \| rejected` |

**Finding severity levels:**
- `blocking` — must be fixed before `done`; rejects the review
- `major` — should be fixed; requires owner sign-off to proceed
- `minor` — noted; can be fixed in a follow-up ticket
- `info` — observation only; no action required

**Rules:**
- Reviewer must be different from the author (different agent session, fresh session, or human).
- Reviewer re-runs verification commands; marks criterion `unverified` if unable to run.
- Owner may require human review for protected paths or Must tickets.

---

## Worked Example

```
<!-- Template: review -->
---
type: review
id: R-3L9Q-login-review
project_id: PROJ-4B9X
schema_version: 1.0.0
created: 20261118T150000Z
actor: agent
role: reviewer
ticket_id: T-7K2M-login
review_packet_ref: reviews/packets/T-7K2M-login-review-packet.md
reviewer_identity: gemini-2.5-flash (fresh session, no prior context of T-7K2M)
reviewer_type: fresh-session
overall_result: approved
---

## Review Packet

**Packet ref:** `reviews/packets/T-7K2M-login-review-packet.md`

**Packet contents verified:**
- [x] Ticket and acceptance criteria reviewed
- [x] Approved manifest reviewed (MAN-9R3T-login-impl)
- [x] Diff reviewed — 14 hunks, all mapped to criteria 1 and 2
- [x] Evidence files reviewed

## Verification Re-runs

| Criterion | Command re-run | Result | Matches original evidence? |
|---|---|---|---|
| Criterion 1 — Successful login returns JWT | `pytest tests/test_auth_login.py::test_login_success -v` | pass | yes |
| Criterion 2 — Wrong password returns 401 | `pytest tests/test_auth_login.py::test_login_wrong_password -v` | pass | yes |

## Findings

No blocking or major findings.

### Finding 1 — Missing docstring on jwt_utils.sign()

**Severity:** `minor`
**Description:** `jwt_utils.sign()` has no docstring explaining the payload structure and expiry policy.
**Location:** `src/auth/jwt_utils.py` line 12.
**Required action:** None for this ticket; created follow-up T-9X2L-docstrings.

## Overall Result

**Result:** approved

**Summary:** All verification commands re-ran successfully with results matching the original evidence. Diff maps cleanly to both criteria. One minor documentation finding logged as a follow-up ticket.

**Blocking findings count:** 0
```
