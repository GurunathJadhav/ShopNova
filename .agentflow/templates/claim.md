<!-- Template: claim
     Record type: claim (CL-xxxx-slug)
     Purpose: Records a factual statement about code, environment, or external APIs
              with a confidence label. Labels: verified (evidence ref), inferred (basis),
              unknown. Unlabelled counts as inferred.
              Inferred facts cannot justify an edit, dependency, or 'done' until promoted.
     Folder: .agentflow/claims/
     Spec ref: §S6.1
-->
---
type: claim
id: CL-XXXX-short-slug
project_id: PROJ-XXXX
schema_version: 1.0.0
created: 20260101T000000Z
actor: "agent | human"
role: "agent | owner | reviewer"
ticket_id: "T-XXXX-slug | none"
label: "verified | inferred | unknown"
evidence_ref: "PLACEHOLDER — path to evidence file (required when label=verified); n/a otherwise"
basis: "PLACEHOLDER — reasoning or source (required when label=inferred); n/a for verified/unknown"
promoted_from: ""
promoted_at: ""
---

## Statement

PLACEHOLDER — state the factual claim in one clear sentence.

**Examples of well-formed claims:**
- "The `bcrypt` package (v4.0.1) is installed and available as a runtime dependency." (verified)
- "The database uses WAL mode for concurrent reads." (inferred from project.md, needs confirmation)
- "The CI environment has Python 3.12 available." (unknown — needs verification before use)

## Label

**Label:** `verified | inferred | unknown`

| Label | Meaning | May justify edit? |
|---|---|---|
| `verified` | Evidence ref exists; fact confirmed by running a command or reading a file | Yes |
| `inferred` | Reasoned from available information but not directly confirmed | No — must be promoted first |
| `unknown` | Not yet determined; look it up or ask | No |

## Evidence / Basis

<!-- For verified: paste the evidence ref.
     For inferred: state the reasoning chain or source.
     For unknown: describe what would be needed to resolve it. -->

PLACEHOLDER — evidence ref path, reasoning, or resolution path.

## Promotion Record

<!-- Filled in when /af-label promotes this claim from inferred/unknown to verified. -->

**Promoted from:** PLACEHOLDER — previous label (blank if created as verified)
**Promoted at:** PLACEHOLDER — compact UTC (blank if created as verified)
**Promotion evidence:** PLACEHOLDER — what confirmed the fact.

---

## Format Spec

| Field | Required | Allowed values / format |
|---|---|---|
| `type` | yes | `claim` |
| `id` | yes | `CL-<4 base32 chars>-<slug>` |
| `project_id` | yes | must match `project.md` |
| `schema_version` | yes | `1.0.0` |
| `created` | yes | compact UTC `20260101T000000Z` |
| `actor` | yes | `agent` or `human` |
| `role` | yes | `agent \| owner \| reviewer` |
| `ticket_id` | yes | ticket id or `none` |
| `label` | yes | `verified \| inferred \| unknown` |
| `evidence_ref` | yes if verified | file path; `n/a` for inferred/unknown |
| `basis` | yes if inferred | reasoning string; `n/a` for verified/unknown |
| `promoted_from` | no | previous label, filled by `/af-label` |
| `promoted_at` | no | compact UTC, filled by `/af-label` |

**Rules:**
- `inferred` and `unknown` claims cannot justify edits, dependencies, or `done`.
- Promote with `/af-label` (adds evidence ref and updates label via a correction event).
- `STATE.md` lists all `unknown` claims as "Unknowns" so the next session resolves them.

---

## Worked Example

```
<!-- Template: claim -->
---
type: claim
id: CL-7N3Q-bcrypt-installed
project_id: PROJ-4B9X
schema_version: 1.0.0
created: 20261117T092000Z
actor: agent
role: agent
ticket_id: T-7K2M-login
label: verified
evidence_ref: evidence/T-7K2M-login/pip-show-bcrypt.md
basis: n/a
promoted_from: ""
promoted_at: ""
---

## Statement

The `bcrypt` package (v4.0.1) is installed in the project's virtual environment and available as a runtime dependency.

## Label

**Label:** `verified` — evidence ref exists (pip show output).

## Evidence / Basis

`evidence/T-7K2M-login/pip-show-bcrypt.md` — output of `pip show bcrypt` showing:
```
Name: bcrypt
Version: 4.0.1
Location: /home/user/.venv/lib/python3.12/site-packages
```

## Promotion Record

(Created as verified — no promotion needed.)
```
