<!-- Template: risk
     Record type: risk (RISK-xxxx-slug)
     Purpose: Tracks a project risk — something that may go wrong. Each risk has
              a likelihood, impact, mitigation plan, and links to related tickets.
              Reviewed at every phase gate.
     Folder: .agentflow/risks/
     Spec ref: §S16
-->
---
type: risk
id: RISK-XXXX-short-slug
project_id: PROJ-XXXX
schema_version: 1.0.0
created: 20260101T000000Z
actor: "agent | human"
role: "owner | agent"
likelihood: "low | medium | high"
impact: "low | medium | high"
status: "open | mitigated | accepted | closed"
ticket_links:
  - "T-XXXX-slug | none"
---

## Description

PLACEHOLDER — describe the risk in one or two sentences. What could go wrong, under what conditions, and what would it affect?

## Likelihood

**Rating:** `low | medium | high`

**Rationale:** PLACEHOLDER — why this likelihood rating was chosen.

## Impact

**Rating:** `low | medium | high`

**Rationale:** PLACEHOLDER — what the consequences would be if this risk materialises (scope, timeline, quality, security).

## Risk Score (optional)

| Likelihood | Impact | Score |
|---|---|---|
| PLACEHOLDER | PLACEHOLDER | `low×low=low, low×high=medium, high×high=high` |

## Mitigation Plan

PLACEHOLDER — describe the specific steps taken or planned to reduce the likelihood or impact of this risk.

**Status:** `open | mitigated | accepted | closed`

- **open** — not yet addressed
- **mitigated** — action taken; risk reduced
- **accepted** — owner has accepted the residual risk (requires owner sign-off)
- **closed** — risk is no longer applicable

## Related Tickets

| Ticket | Relationship |
|---|---|
| `T-XXXX-slug` | PLACEHOLDER — e.g., "mitigation ticket", "affected by this risk" |

## Review History

<!-- Updated at each phase gate review. -->

- PLACEHOLDER — gate name, date, outcome (e.g., "tickets gate 20261116 — still open, mitigation deferred to T-XXXX")

---

## Format Spec

| Field | Required | Allowed values / format |
|---|---|---|
| `type` | yes | `risk` |
| `id` | yes | `RISK-<4 base32 chars>-<slug>` |
| `project_id` | yes | must match `project.md` |
| `schema_version` | yes | `1.0.0` |
| `created` | yes | compact UTC `20260101T000000Z` |
| `actor` | yes | `agent` or `human` |
| `role` | yes | `owner \| agent` |
| `likelihood` | yes | `low \| medium \| high` |
| `impact` | yes | `low \| medium \| high` |
| `status` | yes | `open \| mitigated \| accepted \| closed` |
| `ticket_links` | no | list of ticket ids |

**Review cadence:** risks are reviewed and updated at every phase gate.
**Accepted risks** (residual risk owner accepts after mitigation) need explicit owner sign-off logged as an approval.

---

## Worked Example

```
<!-- Template: risk -->
---
type: risk
id: RISK-7L3Q-sqlite-scale
project_id: PROJ-4B9X
schema_version: 1.0.0
created: 20261116T112500Z
actor: agent
role: owner
likelihood: low
impact: high
status: accepted
ticket_links:
  - T-4R8P-load-testing
---

## Description

SQLite WAL mode may become a bottleneck if concurrent write traffic exceeds approximately 100 req/s, requiring a migration to PostgreSQL mid-project.

## Likelihood

**Rating:** low

**Rationale:** MVP projected traffic is under 50 req/s (Q-5R2X-scale answer); the risk applies only if the product grows faster than expected.

## Impact

**Rating:** high

**Rationale:** A database engine migration post-launch requires a full data migration script, downtime, and re-verification of all data-layer tickets.

## Mitigation Plan

1. Add a load test ticket (T-4R8P-load-testing) to verify WAL performance at 2× projected peak before release.
2. Keep the data access layer (DAL) behind a repository interface so engine migration is isolated.
3. Document the migration path in a decision record (D-4N7P).

**Status:** accepted — owner alice accepted residual risk (approval A-6Q3R) after reviewing mitigation steps.

## Related Tickets

| Ticket | Relationship |
|---|---|
| `T-4R8P-load-testing` | Mitigation ticket — verify SQLite performance at peak load |

## Review History

- planning gate 20261116 — risk opened, mitigation plan agreed, owner accepted residual risk
- verification gate 20261125 — load test passed at 2× peak; risk closed (update pending)
```
