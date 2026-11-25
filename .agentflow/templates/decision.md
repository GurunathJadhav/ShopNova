<!-- Template: decision
     Record type: decision (D-xxxx-slug)
     Purpose: Immutable Architecture Decision Record (ADR). Records context, options
              considered, decision type (two-way / one-way), the chosen option,
              consequences, and current status. Never edited — a new decision supersedes.
     Folder: .agentflow/decisions/
     Spec ref: §S9.1, §S7
-->
---
type: decision
id: D-XXXX-short-slug
project_id: PROJ-XXXX
schema_version: 1.0.0
created: 20260101T000000Z
actor: "<github-username-from-project.md | agent-model>"
role: "approver | architect | agent"
approved_by: "<github-username-from-project.md>"
decision_type: "two-way | one-way"
status: "proposed | accepted | superseded | deprecated"
supersedes: ""
superseded_by: ""
---
<!-- NEVER write generic "owner" or "<owner-name>" here — always put the actual GitHub username from .agentflow/project.md (`owner:`). -->

## Context

PLACEHOLDER — describe the situation, constraint, or problem that forced this decision.
Include what was known and unknown at the time, and any relevant requirements (REQ links).

## Options Considered

### Option A: PLACEHOLDER — option name

**Description:** PLACEHOLDER

**Pros:**
- PLACEHOLDER

**Cons:**
- PLACEHOLDER

**Exit cost (one-way only):** PLACEHOLDER — how hard is it to reverse this later?

### Option B: PLACEHOLDER — option name

**Description:** PLACEHOLDER

**Pros:**
- PLACEHOLDER

**Cons:**
- PLACEHOLDER

<!-- Add more options as needed -->

## Decision

**Chosen:** Option PLACEHOLDER — PLACEHOLDER (name)

**Reason:** PLACEHOLDER — one paragraph tying the choice to requirements, constraints, and trade-offs. Reference the criterion or requirement id that drove it.

**Decision type:** `two-way` (can be revisited with low cost) or `one-way` (data model, public API, hosting, licence, irreversible migration — requires explicit owner approval and evidence of trade-off analysis).

## Consequences

**Positive:**
- PLACEHOLDER

**Negative / trade-offs:**
- PLACEHOLDER

**Risks introduced:**
- PLACEHOLDER — link to `risks/RISK-xxxx` if a risk record was created.

## Approval

<!-- One-way decisions require explicit owner approval. -->

Approved by: PLACEHOLDER — name, role, approval record `A-XXXX`
Approved at: PLACEHOLDER — compact UTC

---

## Format Spec

| Field | Required | Allowed values / format |
|---|---|---|
| `type` | yes | `decision` |
| `id` | yes | `D-<4 base32 chars>-<slug>` |
| `project_id` | yes | must match `project.md` |
| `schema_version` | yes | `1.0.0` |
| `created` | yes | compact UTC `20260101T000000Z` |
| `actor` | yes | `agent` or `human` |
| `role` | yes | `owner \| approver \| reviewer \| agent` |
| `decision_type` | yes | `two-way` or `one-way` |
| `status` | yes | `proposed \| accepted \| superseded \| deprecated` |
| `supersedes` | no | id of decision this replaces, empty otherwise |
| `superseded_by` | no | id of the later decision, filled when this is superseded |

**One-way decisions** (data model, public API, hosting, licence, irreversible migrations) require:
- Explicit options with trade-offs and exit cost documented
- Owner approval (`A-XXXX` reference)

---

## Worked Example

```
<!-- Template: decision -->
---
type: decision
id: D-4N7P-database-engine
project_id: PROJ-4B9X
schema_version: 1.0.0
created: 20261116T110000Z
actor: agent
role: owner
decision_type: one-way
status: accepted
supersedes: ""
superseded_by: ""
---

## Context

The API (REQ-2K4M-data-storage) needs a persistent relational store. We are a 2-person team, greenfield project, targeting a single-region VPS deployment. No existing database infrastructure.

## Options Considered

### Option A: PostgreSQL

**Pros:** Full SQL, JSONB, strong ecosystem, managed offerings available, free.
**Cons:** Heavier ops than SQLite for a single server.
**Exit cost:** Medium — migrations portable across RDBMS.

### Option B: SQLite

**Pros:** Zero-ops, single file, great for small traffic.
**Cons:** No concurrent writes in WAL mode under heavy load, no managed failover.
**Exit cost:** Low — schema is portable.

## Decision

**Chosen:** Option B — SQLite (initial deployment)

**Reason:** MVP traffic is projected under 50 req/s (Q-5R2X-scale answer). SQLite WAL mode handles that easily. Zero additional ops burden for a 2-person team. Migrate to PostgreSQL if traffic exceeds threshold (follow-up risk RISK-7L3Q).

**Decision type:** `one-way` — changing the DB engine post-launch requires a data migration.

## Consequences

**Positive:** No database server to manage; faster local dev.
**Negative / trade-offs:** Must migrate if concurrent writes exceed SQLite WAL limits.
**Risks introduced:** See RISK-7L3Q-sqlite-scale.

## Approval

Approved by: alice (owner), A-8P2Q
Approved at: 20261116T112200Z
```
