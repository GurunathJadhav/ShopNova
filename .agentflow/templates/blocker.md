<!-- Template: blocker
     Record type: blocker (B-xxxx-slug)
     Purpose: Records something that prevents progress on one or more tickets.
              Human blockers are things only a person can supply (credentials, accounts,
              approvals, content, decisions). Technical blockers are unresolved technical
              issues. Dependent tickets are set to 'blocked' status via events.
              /af-next routes around blockers to unblocked work.
     Folder: .agentflow/blockers/
     Spec ref: §S3
-->
---
type: blocker
id: B-XXXX-short-slug
project_id: PROJ-XXXX
schema_version: 1.0.0
created: 20260101T000000Z
actor: "agent | human"
role: "agent | owner"
blocker_type: "human | technical"
owner: "PLACEHOLDER — name/role of the person who must unblock this"
needed_by: "PLACEHOLDER — compact UTC deadline, or 'asap' / 'before T-XXXX starts'"
dependent_tickets:
  - T-XXXX-slug
resolved_at: ""
resolved_by: ""
resolution_ref: ""
---

## Description

PLACEHOLDER — describe the blocker in full. What is missing, who is needed, and why work cannot continue without it.

## Why It Blocks

PLACEHOLDER — explain which acceptance criteria or dependencies are blocked and why there is no workaround.

## What Is Needed

<!-- For human blockers: list each concrete deliverable the owner must supply. -->

- [ ] PLACEHOLDER — e.g., "AWS IAM credentials for staging environment"
- [ ] PLACEHOLDER — e.g., "Sign-off on the final colour palette from design team"

## Dependent Tickets

<!-- These tickets are set to 'blocked' via events until this blocker resolves. -->

| Ticket | Why blocked |
|---|---|
| `T-XXXX-slug` | PLACEHOLDER — brief reason |

## Workaround (if any)

PLACEHOLDER — describe any partial work that can proceed, or "none — all dependent tickets must wait."

## Resolution

<!-- Filled in when the blocker is resolved (/af-blockers resolves it, logs an event). -->

**Resolved at:** PLACEHOLDER — compact UTC (blank until resolved)
**Resolved by:** PLACEHOLDER — name/role (blank until resolved)
**Resolution ref:** PLACEHOLDER — event id or approval id (blank until resolved)

---

## Format Spec

| Field | Required | Allowed values / format |
|---|---|---|
| `type` | yes | `blocker` |
| `id` | yes | `B-<4 base32 chars>-<slug>` |
| `project_id` | yes | must match `project.md` |
| `schema_version` | yes | `1.0.0` |
| `created` | yes | compact UTC `20260101T000000Z` |
| `actor` | yes | `agent` or `human` |
| `role` | yes | `agent \| owner` |
| `blocker_type` | yes | `human` or `technical` |
| `owner` | yes | name/role of unblocking party |
| `needed_by` | yes | compact UTC, `asap`, or milestone reference |
| `dependent_tickets` | yes | list of ticket ids |
| `resolved_at` | no | compact UTC, blank until resolved |
| `resolved_by` | no | name/role, blank until resolved |
| `resolution_ref` | no | event id or approval id, blank until resolved |

**Key rules:**
- `/af-next` lists all open human blockers in one batch for the user, with what they must supply.
- Dependent tickets are `blocked` (derived from events) until the blocker resolves.
- Blockers are never deleted; a resolution event changes their derived status.

---

## Worked Example

```
<!-- Template: blocker -->
---
type: blocker
id: B-4L8R-stripe-keys
project_id: PROJ-4B9X
schema_version: 1.0.0
created: 20261119T110000Z
actor: agent
role: owner
blocker_type: human
owner: alice (owner)
needed_by: "before T-9P3M-payments starts"
dependent_tickets:
  - T-9P3M-payments
  - T-9P4N-webhook-handler
resolved_at: ""
resolved_by: ""
resolution_ref: ""
---

## Description

The Stripe test-mode API keys (publishable and secret) are needed to implement and test the payment integration. The agent cannot proceed with T-9P3M-payments or T-9P4N-webhook-handler until these are available.

## Why It Blocks

Acceptance criterion 1 of T-9P3M requires calling the Stripe Charges API; without valid test keys, the automated tests will fail and no evidence can be generated.

## What Is Needed

- [ ] `STRIPE_TEST_PUBLISHABLE_KEY` — test-mode publishable key
- [ ] `STRIPE_TEST_SECRET_KEY` — test-mode secret key (add to `.env`, never paste into chat)

## Dependent Tickets

| Ticket | Why blocked |
|---|---|
| `T-9P3M-payments` | Requires Stripe API calls in tests |
| `T-9P4N-webhook-handler` | Depends on T-9P3M being done first |

## Workaround (if any)

Can implement the payment UI scaffolding (T-9P2L-payment-ui) while waiting — that ticket has no Stripe dependency.

## Resolution

**Resolved at:** (blank)
**Resolved by:** (blank)
**Resolution ref:** (blank)
```
