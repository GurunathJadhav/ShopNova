<!-- Template: verification
     Record type: verification (V-xxxx-slug)
     Purpose: Records that a specific claim, criterion, or fact was checked.
              Every claim needs a verification record. The command run, its output
              (or evidence ref), and the result are captured here.
              /af-audit may re-run these commands to confirm recorded results.
     Folder: .agentflow/verifications/
     Spec ref: §S6, §S6.1, §S6.2
-->
---
type: verification
id: V-XXXX-short-slug
project_id: PROJ-XXXX
schema_version: 1.0.0
created: 20260101T000000Z
actor: "agent | human"
role: "agent | owner | approver | reviewer"
ticket_id: "T-XXXX-slug | none"
criterion_ref: "PLACEHOLDER — criterion title or 'general' if not tied to a specific criterion"
method: "automated-test | command-output | manual-check | screenshot-visual | static-check | document-review | user-confirmation"
result: "pass | fail | unverified"
evidence_ref: "PLACEHOLDER — path to evidence file, or 'inline' if pasted below"
checklist_ref: "PLACEHOLDER — pre-edit checklist record or step reference, or 'n/a'"
run_by: "agent | user"
---

## What Was Verified

PLACEHOLDER — one sentence describing the claim or criterion being verified.

## Method

**Method:** `PLACEHOLDER — automated-test | command-output | manual-check | …`

**Command / steps:**

```
PLACEHOLDER — exact command run, e.g.:
pytest tests/test_auth_login.py -v
```

**Expected result:** PLACEHOLDER — what a passing outcome looks like.

## Result

**Outcome:** `pass | fail | unverified`

**Summary:** PLACEHOLDER — one or two sentences describing the actual result.

## Evidence

<!-- Paste trimmed output inline (≤50 lines) OR reference an evidence file. -->

**Evidence ref:** `PLACEHOLDER — evidence/T-XXXX-slug/test-run-01.md` or inline below.

```
PLACEHOLDER — paste command output here if inline, trimmed to relevant lines.
```

## Checklist Reference

**Pre-edit checklist:** PLACEHOLDER — reference to the recorded verify-before-edit checklist for the step this verification closes, or `n/a` for standalone verifications.

## Notes

<!-- Any caveats: flakiness, environment differences, cannot-run cases. -->

- PLACEHOLDER — or "none"

---

## Format Spec

| Field | Required | Allowed values / format |
|---|---|---|
| `type` | yes | `verification` |
| `id` | yes | `V-<4 base32 chars>-<slug>` |
| `project_id` | yes | must match `project.md` |
| `schema_version` | yes | `1.0.0` |
| `created` | yes | compact UTC `20260101T000000Z` |
| `actor` | yes | `agent` or `human` |
| `role` | yes | `agent \| owner \| approver \| reviewer` |
| `ticket_id` | yes | ticket id or `none` |
| `criterion_ref` | yes | criterion title or `general` |
| `method` | yes | see allowed list below |
| `result` | yes | `pass \| fail \| unverified` |
| `evidence_ref` | yes | file path or `inline` |
| `checklist_ref` | yes | checklist reference or `n/a` |
| `run_by` | yes | `agent` or `user` |

**Allowed `method` values:**
- `automated-test` — test runner output is the evidence
- `command-output` — CLI/shell command output
- `manual-check` — human follows documented steps; states expected and actual result
- `screenshot-visual` — visual/UI check with screenshot
- `static-check` — linter, type checker, static analyser
- `document-review` — reading a doc, spec, or policy
- `user-confirmation` — user explicitly confirms in chat

**Cannot-run cases:** Mark result `unverified`, explain why, and note that this criterion cannot count as done without owner sign-off.

---

## Worked Example

```
<!-- Template: verification -->
---
type: verification
id: V-2K4P-login-criterion-1
project_id: PROJ-4B9X
schema_version: 1.0.0
created: 20261118T143000Z
actor: agent
role: agent
ticket_id: T-7K2M-login
criterion_ref: "Criterion 1 — Successful login returns JWT"
method: automated-test
result: pass
evidence_ref: evidence/T-7K2M-login/test-run-01.md
checklist_ref: "pre-edit-checklist step 3 (login.py edit)"
run_by: agent
---

## What Was Verified

POST /auth/login with valid credentials returns 200 OK with an httpOnly JWT cookie.

## Method

**Method:** `automated-test`

**Command / steps:**
pytest tests/test_auth_login.py::test_login_success -v

**Expected result:** test_login_success PASSES; response status 200, Set-Cookie header present.

## Result

**Outcome:** pass

**Summary:** test_login_success passed. Response: 200 OK, Set-Cookie: token=<jwt>; HttpOnly; Secure header confirmed by assertion.

## Evidence

**Evidence ref:** `evidence/T-7K2M-login/test-run-01.md`

## Checklist Reference

**Pre-edit checklist:** pre-edit step 3 — login.py route handler created and confirmed readable before test run.

## Notes

- none
```
