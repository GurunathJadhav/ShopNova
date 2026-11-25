<!-- Template: ticket
     Record type: ticket (T-xxxx-slug)
     Purpose: One ticket per functionality, in user-story format. Holds the story,
              acceptance criteria (Given/When/Then), verification method per criterion,
              MoSCoW priority, size, test plan, and effort budget.
              Status is derived from events — never stored here.
              Ticket files are FROZEN after done; changes need a bug or change ticket.
     Folder: .agentflow/tickets/
     Spec ref: §S4, §S4.2
-->
---
type: ticket
id: T-XXXX-short-slug
project_id: PROJ-XXXX
schema_version: 1.0.0
created: 20260101T000000Z
actor: agent
role: owner
title: "PLACEHOLDER — short imperative title"
ticket_type: "story | task | spike | bug | change"
lane: "trivial | standard | incident | project-level"
moscow: "must | should | could | wont"
mvp: "MVP-1"
size: "S | M | L"
req_links:
  - REQ-XXXX-slug
dependencies:
  - "T-XXXX-slug | none"
effort_budget:
  steps: 0
  retries: 0
  est_minutes: 30
  actual_minutes: 0
  approx_tokens: "~0k (approximate)"
  actual_tokens: "~0k (approximate)"
---

## Story

As a **PLACEHOLDER — persona**,
I want **PLACEHOLDER — capability**,
so that **PLACEHOLDER — benefit**.

## Out-of-Scope Notes

<!-- Explicitly state what this ticket does NOT cover, to prevent scope creep. -->

- PLACEHOLDER

## Acceptance Criteria

### Criterion 1 — PLACEHOLDER title

**Given** PLACEHOLDER — precondition
**When** PLACEHOLDER — action
**Then** PLACEHOLDER — observable outcome

**Verification method:** `automated-test | command-output | manual-check | screenshot-visual | static-check | document-review | user-confirmation`
**Evidence format:** PLACEHOLDER — e.g., "pytest output showing N tests pass"

---

### Criterion 2 — PLACEHOLDER title

**Given** PLACEHOLDER
**When** PLACEHOLDER
**Then** PLACEHOLDER

**Verification method:** PLACEHOLDER
**Evidence format:** PLACEHOLDER

<!-- Add more criteria as needed. Each criterion needs a verification method. -->

## Test Plan

<!-- §S4.2: exact commands for this ticket's tests, the regression set, and mapping from manifest files to test files/tags. -->

**Own tests command:** `PLACEHOLDER — e.g., pytest tests/test_auth.py -v`

**Regression set command:** `PLACEHOLDER — e.g., pytest tests/ --smoke`

**File-to-test mapping:**

| Manifest file | Test file / tag |
|---|---|
| `PLACEHOLDER/file.py` | `tests/test_PLACEHOLDER.py` |

## Evidence Links

<!-- Filled in during implementation. -->

- PLACEHOLDER — e.g., `evidence/T-XXXX-slug/test-run-01.md`

## Notes

<!-- Implementation notes, spike conclusions, related decisions. -->

---

## Format Spec

| Field | Required | Allowed values / format |
|---|---|---|
| `type` | yes | `ticket` |
| `id` | yes | `T-<4 base32 chars>-<slug>` |
| `project_id` | yes | must match `project.md` |
| `schema_version` | yes | `1.0.0` |
| `created` | yes | compact UTC `20260101T000000Z` |
| `actor` | yes | `agent` or `human` |
| `role` | yes | `owner \| approver \| reviewer \| observer \| agent` |
| `title` | yes | short imperative string |
| `ticket_type` | yes | `story \| task \| spike \| bug \| change` |
| `lane` | yes | `trivial \| standard \| incident \| project-level` |
| `moscow` | yes | `must \| should \| could \| wont` |
| `size` | yes | `S \| M \| L` (L must be split before `ready`) |
| `req_links` | yes | list of `REQ-xxxx` ids (or justification if none) |
| `dependencies` | no | list of ticket ids, or `none` |
| `effort_budget` | yes | `steps`, `retries`, `approx_tokens` (labelled approximate) |

**Status** is event-derived: `backlog`, `ready`, `in-progress`, `in-review`, `done`, `blocked`, `deferred`, `cancelled`, `superseded`, `reopened`

`ready` requires: testable criteria, known dependencies, approved Edit Manifest.

**Definition of done by lane:**
- **Trivial:** one verification record, diff check, one-line log entry.
- **Standard:** evidence per criterion, diff check, regression pass, independent review.

---

## Worked Example

```
<!-- Template: ticket -->
---
type: ticket
id: T-7K2M-login
project_id: PROJ-4B9X
schema_version: 1.0.0
created: 20261116T140000Z
actor: agent
role: owner
title: "Implement email/password login endpoint"
ticket_type: story
lane: standard
moscow: must
size: S
req_links:
  - REQ-3P7Q-auth-jwt
dependencies:
  - T-2X9L-walking-skeleton
effort_budget:
  steps: 8
  retries: 2
  approx_tokens: "~15k (approximate)"
---

## Story

As a **registered user**,
I want **to log in with my email and password**,
so that **I can access my account and protected resources**.

## Out-of-Scope Notes

- OAuth2/social login (deferred, see Q-9L4R-oauth-later)
- Password reset flow (separate ticket T-8M3P-password-reset)
- Rate limiting (covered by T-9N4R-rate-limiting)

## Acceptance Criteria

### Criterion 1 — Successful login returns JWT

**Given** a registered user with email `user@example.com` and password `correct-password`
**When** `POST /auth/login` is called with valid credentials
**Then** the response is `200 OK` with a `Set-Cookie: token=<jwt>; HttpOnly; Secure` header and body `{"ok": true}`

**Verification method:** `automated-test`
**Evidence format:** pytest output showing test_login_success passes

---

### Criterion 2 — Wrong password returns 401

**Given** a registered user
**When** `POST /auth/login` is called with an incorrect password
**Then** the response is `401 Unauthorized` with body `{"error": "invalid credentials"}` and no cookie is set

**Verification method:** `automated-test`
**Evidence format:** pytest output showing test_login_wrong_password passes

## Test Plan

**Own tests command:** `pytest tests/test_auth_login.py -v`

**Regression set command:** `pytest tests/ -m smoke`

**File-to-test mapping:**

| Manifest file | Test file / tag |
|---|---|
| `src/auth/login.py` | `tests/test_auth_login.py` |
| `src/auth/jwt_utils.py` | `tests/test_jwt_utils.py` |

## Evidence Links

- `evidence/T-7K2M-login/test-run-final.md`

## Notes

Decision D-4N7P-database-engine: SQLite for MVP.
JWT strategy from Q-7K2M-auth-method answer: httpOnly cookies.
```
