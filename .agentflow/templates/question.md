<!-- Template: question
     Record type: question (Q-xxxx-slug)
     Purpose: Captures a clarification question during discovery, its recommended default,
              and the user's verbatim answer. Status (open/answered/assumed/deferred) is
              derived from the latest event for this id — never stored here.
     Folder: .agentflow/questions/
     Spec ref: §S3
-->
---
type: question
id: Q-XXXX-short-slug
project_id: PROJ-XXXX
schema_version: 1.0.0
created: 20260101T000000Z
actor: agent
role: owner
category: "goals-and-success-metrics | users-personas | functional-scope | non-functional | tech-constraints | integrations | data | ux | deployment | budget-timeline | out-of-scope | compliance-legal-privacy | licence | localisation | cost-hosting | support-ownership | third-party-accounts"
blocking: "yes | no"
recommended_default: "PLACEHOLDER — state the default and why it is a reasonable assumption"
answered_by: ""
answered_at: ""
---

## Question

> PLACEHOLDER — write the question in full, one sentence.

## Why It Matters

PLACEHOLDER — explain what breaks or gets mis-scoped if this goes unanswered.

## Recommended Default

**Default:** PLACEHOLDER — restate the default from front matter in plain language.

**Reason:** PLACEHOLDER — brief rationale a non-technical reader can follow.

## Answer

<!-- Filled in verbatim when the user replies. Do not paraphrase. -->

PLACEHOLDER — verbatim user answer, or "accept default" if the user accepted the recommended default.

## Notes

<!-- Optional: clarifications, follow-up questions spawned, related questions. -->

---

## Format Spec

| Field | Required | Allowed values / format |
|---|---|---|
| `type` | yes | `question` |
| `id` | yes | `Q-<4 base32 chars>-<slug>` |
| `project_id` | yes | must match `project.md` |
| `schema_version` | yes | `1.0.0` |
| `created` | yes | compact UTC `20260101T000000Z` |
| `actor` | yes | `agent` or `human` |
| `role` | yes | `owner \| approver \| reviewer \| observer` |
| `category` | yes | one value from the allowed list above |
| `blocking` | yes | `yes` or `no` |
| `recommended_default` | yes | non-empty string |
| `answered_by` | no | name/role of the person who answered, empty until answered |
| `answered_at` | no | compact UTC, empty until answered |

**Status** is derived from events — do not add a `status` field here.

Allowed statuses (event-derived): `open`, `answered`, `assumed`, `deferred`

---

## Worked Example

```
<!-- Template: question -->
---
type: question
id: Q-7K2M-auth-method
project_id: PROJ-4B9X
schema_version: 1.0.0
created: 20261115T093000Z
actor: agent
role: owner
category: tech-constraints
blocking: yes
recommended_default: "JWT stored in httpOnly cookies — stateless, widely supported, avoids localStorage XSS risk"
answered_by: alice (owner)
answered_at: 20261115T094200Z
---

## Question

> Which authentication method should the API use — sessions, JWT, or OAuth2?

## Why It Matters

The choice affects how the frontend stores tokens, how logout works, and whether a third-party identity provider is needed; getting it wrong late means rewriting auth middleware.

## Recommended Default

**Default:** JWT in httpOnly cookies.

**Reason:** Stateless, works across multiple API servers without a session store, and avoids the XSS risk of localStorage.

## Answer

"Use JWTs in httpOnly cookies as the default; we may add OAuth2 later but not for MVP."

## Notes

Spawned requirement REQ-3P7Q-auth-jwt. OAuth2 deferred to post-MVP via Q-9L4R-oauth-later.
```
