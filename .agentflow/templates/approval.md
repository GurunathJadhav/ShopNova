<!-- Template: approval
     Record type: approval (A-xxxx-slug)
     Purpose: Records a human approval of a specific record (manifest, dependency,
              rule change, phase advance, etc.). Approvals bind to ONE record.
              Verbatim quote of the user's message is mandatory.
              High-risk approvals additionally require a countersign.
     Folder: .agentflow/approvals/
     Spec ref: §S2.2
-->
---
type: approval
id: A-XXXX-short-slug
project_id: PROJ-XXXX
schema_version: 1.0.0
created: 20260101T000000Z
actor: "<github-username-from-project.md>"
role: "approver"
approved_by: "<github-username-from-project.md>"
approves_id: "PLACEHOLDER — id of the record being approved (e.g., MAN-XXXX, D-XXXX, REQ-XXXX)"
approves_type: "manifest | decision | requirement | dependency | rule-change | phase-gate | scope-expansion | waiver | other"
high_risk: "yes | no"
countersign_method: "user-commit | user-created-file | user-typed-id | n/a"
countersign_ref: "PLACEHOLDER — git commit SHA, file path, or message reference; n/a if not high-risk"
standing_approval_ref: "PLACEHOLDER — id of the standing approval this uses, or 'none' (fresh approval)"
---

## Verbatim User Statement

<!-- Copy the user's exact words. Do not paraphrase. -->

> PLACEHOLDER — paste the user's exact message here, including punctuation and line breaks.

## Record Being Approved

**Record ID:** `PLACEHOLDER — e.g., MAN-9R3T-login-impl`
**Record type:** PLACEHOLDER — manifest / decision / requirement / …
**Brief description:** PLACEHOLDER — one sentence describing what is being approved.

## Approver

**GitHub username / handle:** <github-username from .agentflow/project.md `owner:` — NEVER write generic "owner">
**Role:** approver
**Timestamp:** PLACEHOLDER — compact UTC of when the user gave this approval.

## High-Risk Checklist

<!-- High-risk approvals: rule changes, protected paths, one-way decisions, production, new runtime deps -->

- [ ] Is this a high-risk approval? `yes | no`
- [ ] If yes: countersign method recorded (`user-commit | user-created-file | user-typed-id`)
- [ ] Countersign reference: PLACEHOLDER

## Scope

This approval covers **only** `PLACEHOLDER — id`. It does not cover future records of the same type, related records, or scope expansions.

---

## Format Spec

| Field | Required | Allowed values / format |
|---|---|---|
| `type` | yes | `approval` |
| `id` | yes | `A-<4 base32 chars>-<slug>` |
| `project_id` | yes | must match `project.md` |
| `schema_version` | yes | `1.0.0` |
| `created` | yes | compact UTC `20260101T000000Z` |
| `actor` | yes | `human` (only humans can approve) |
| `role` | yes | `owner \| approver` |
| `approves_id` | yes | id of the record being approved |
| `approves_type` | yes | see allowed list below |
| `high_risk` | yes | `yes` or `no` |
| `countersign_method` | yes | `user-commit \| user-created-file \| user-typed-id \| n/a` |
| `countersign_ref` | yes | reference or `n/a` |
| `standing_approval_ref` | yes | standing-approval id or `none` |

**Allowed `approves_type` values:**
`manifest`, `decision`, `requirement`, `dependency`, `rule-change`, `phase-gate`, `scope-expansion`, `waiver`, `other`

**High-risk categories** (always require countersign):
rule changes, protected paths, one-way decisions, production actions, new runtime dependencies

**Standing approvals** (from `project.md`) cover only their stated bounds; log the reference.
**Protected paths, deletions, production, runtime deps, scope expansion, rule changes** are NEVER covered by standing approvals.

---

## Worked Example

```
<!-- Template: approval -->
---
type: approval
id: A-5P2K-login-manifest
project_id: PROJ-4B9X
schema_version: 1.0.0
created: 20261117T091500Z
actor: human
role: owner
approves_id: MAN-9R3T-login-impl
approves_type: manifest
high_risk: no
countersign_method: n/a
countersign_ref: n/a
standing_approval_ref: SA-01
---

## Verbatim User Statement

> "Looks good, go ahead with the login manifest."

## Record Being Approved

**Record ID:** `MAN-9R3T-login-impl`
**Record type:** manifest
**Brief description:** Edit manifest for ticket T-7K2M-login — allows modification of src/auth/login.py, src/auth/jwt_utils.py, and tests/test_auth_login.py.

## Approver

**Name / handle:** alice
**Role:** owner
**Timestamp:** 20261117T091500Z

## High-Risk Checklist

- [x] Is this a high-risk approval? no
- [ ] ~~Countersign required~~
- Standing approval SA-01 applies (S manifest, files in src/ and tests/ only); logged here.

## Scope

This approval covers only `MAN-9R3T-login-impl`. It does not cover future manifests or scope expansions.
```
