<!-- Template: requirement
     Record type: requirement (REQ-xxxx-slug)
     Purpose: A single in-scope requirement derived from the discovery Q&A.
              Requirements form the scope baseline (MVP boundary) approved by the owner.
              Every requirement maps to at least one ticket; every ticket maps to a requirement.
              Status is derived from events.
     Folder: .agentflow/requirements/
     Spec ref: §S3
-->
---
type: requirement
id: REQ-XXXX-short-slug
project_id: PROJ-XXXX
schema_version: 1.0.0
created: 20260101T000000Z
actor: agent
role: owner
source_question_id: "Q-XXXX-slug | none"
priority: "must | should | could | wont"
---

## Description

PLACEHOLDER — write the requirement in plain language. One requirement per record. Use specific, testable language; avoid vague words ("fast", "user-friendly", "etc.").

**Ambiguity check:** PLACEHOLDER — confirm any potentially vague terms have been resolved (or reference the question that resolved them).

## Source

**Source question:** `Q-XXXX-slug` — PLACEHOLDER (verbatim answer that produced this requirement)

**Verbatim user statement:**
> PLACEHOLDER — quote the user's words that defined or confirmed this requirement.

## Priority

**MoSCoW:** `must | should | could | wont`

**Rationale:** PLACEHOLDER — why this priority was chosen.

## Ticket Coverage

<!-- Filled in after tickets are created. Every requirement needs at least one ticket. -->

| Ticket | Description |
|---|---|
| `T-XXXX-slug` | PLACEHOLDER |

**Coverage status:** `covered | uncovered | out-of-scope`

## Status

**Status** is event-derived: `proposed`, `baselined`, `in-progress`, `delivered`, `descoped`, `dropped`

> Do not add a `status` field to the front matter — read the latest event for this id.

## Change History

<!-- Any descope, drop, or change goes through /af-change with a decision record. -->

- PLACEHOLDER — or "no changes"

---

## Format Spec

| Field | Required | Allowed values / format |
|---|---|---|
| `type` | yes | `requirement` |
| `id` | yes | `REQ-<4 base32 chars>-<slug>` |
| `project_id` | yes | must match `project.md` |
| `schema_version` | yes | `1.0.0` |
| `created` | yes | compact UTC `20260101T000000Z` |
| `actor` | yes | `agent` or `human` |
| `role` | yes | `owner \| approver \| agent` |
| `source_question_id` | yes | `Q-xxxx-slug` or `none` |
| `priority` | yes | `must \| should \| could \| wont` |

**Allowed statuses (event-derived):**
`proposed`, `baselined`, `in-progress`, `delivered`, `descoped`, `dropped`

**Rules:**
- Discovery ends only after the owner approves the full requirements list (scope baseline).
- Anything outside the baseline, and any drop or descope, goes through `change-request`.
- Coverage check: every `must`/`should` requirement must map to at least one ticket before the tickets gate passes.

---

## Worked Example

```
<!-- Template: requirement -->
---
type: requirement
id: REQ-3P7Q-auth-jwt
project_id: PROJ-4B9X
schema_version: 1.0.0
created: 20261115T100000Z
actor: agent
role: owner
source_question_id: Q-7K2M-auth-method
priority: must
---

## Description

The API must authenticate users with JWT tokens stored in httpOnly cookies. The login endpoint accepts an email and password, verifies credentials against the user store, and on success returns a signed JWT in a Set-Cookie header with HttpOnly and Secure flags set.

**Ambiguity check:** "Secure flag" confirmed to mean the HTTPS-only cookie attribute (Q-7K2M answer). Token expiry set to 24 hours (Q-8L3N-token-expiry answer).

## Source

**Source question:** `Q-7K2M-auth-method` — "Which authentication method should the API use?"

**Verbatim user statement:**
> "Use JWTs in httpOnly cookies as the default; we may add OAuth2 later but not for MVP."

## Priority

**MoSCoW:** must

**Rationale:** No authenticated features can work without login; this is a core MVP requirement.

## Ticket Coverage

| Ticket | Description |
|---|---|
| `T-7K2M-login` | Implement email/password login endpoint (returns JWT cookie) |
| `T-8M2P-logout` | Implement logout endpoint (clears JWT cookie) |

**Coverage status:** covered

## Change History

- no changes
```
