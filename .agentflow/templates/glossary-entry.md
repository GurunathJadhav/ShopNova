<!-- Template: glossary-entry
     Record type: glossary-entry (stored at glossary/<term>.md)
     Purpose: Defines a project-specific term. Agents use defined terms consistently
              and add new ones only after user confirmation.
              Filename is the term (lowercase, hyphens for spaces).
     Folder: .agentflow/glossary/
     Spec ref: §S3
-->
---
type: glossary-entry
id: GLOS-XXXX-term-slug
project_id: PROJ-XXXX
schema_version: 1.0.0
created: 20260101T000000Z
actor: "agent | human"
role: "owner | agent"
term: "PLACEHOLDER — exact term as it appears in the project"
confirmed_by: "PLACEHOLDER — name/role of the person who confirmed this definition"
confirmed_at: "PLACEHOLDER — compact UTC, or 'pending' if awaiting confirmation"
supersedes: ""
---

## Term

**`PLACEHOLDER — term`**

## Definition

PLACEHOLDER — write a precise, unambiguous definition. Avoid circular definitions. Include the domain context (e.g., "In this project, …").

## Usage

PLACEHOLDER — describe how and where this term is used in the project. Include examples of correct usage and common misuses to avoid.

**Correct usage:**
- PLACEHOLDER — example sentence using the term correctly.

**Do NOT confuse with:**
- PLACEHOLDER — a similar term that means something different.

## Source

**Introduced in:** PLACEHOLDER — question id, decision id, or "initial discovery"

**Confirmed by:** PLACEHOLDER — name/role
**Confirmed at:** PLACEHOLDER — compact UTC or "pending"

## Related Terms

- PLACEHOLDER — link to related glossary entries, or "none"

---

## Format Spec

| Field | Required | Allowed values / format |
|---|---|---|
| `type` | yes | `glossary-entry` |
| `id` | yes | `GLOS-<4 base32 chars>-<slug>` |
| `project_id` | yes | must match `project.md` |
| `schema_version` | yes | `1.0.0` |
| `created` | yes | compact UTC `20260101T000000Z` |
| `actor` | yes | `agent` or `human` |
| `role` | yes | `owner \| agent` |
| `term` | yes | exact term string |
| `confirmed_by` | yes | name/role (or `pending`) |
| `confirmed_at` | yes | compact UTC (or `pending`) |
| `supersedes` | no | id of previous definition this replaces |

**Filename:** `glossary/<term-lowercase-hyphenated>.md`
Example: term "Edit Manifest" → `glossary/edit-manifest.md`

**Rules:**
- Agents never invent or redefine terms without user confirmation.
- If a term is used but unconfirmed, its entry is marked `confirmed_by: pending` and listed as an unknown.
- Corrections create a new entry with `supersedes: GLOS-xxxx`.

---

## Worked Example

```
<!-- Template: glossary-entry -->
---
type: glossary-entry
id: GLOS-7P2Q-edit-manifest
project_id: PROJ-4B9X
schema_version: 1.0.0
created: 20261115T102000Z
actor: agent
role: owner
term: "Edit Manifest"
confirmed_by: alice (owner)
confirmed_at: 20261115T104500Z
supersedes: ""
---

## Term

**`Edit Manifest`**

## Definition

In this project, an Edit Manifest is a Markdown record (`manifests/T-xxxx-slug.md`) that lists exactly which files the agent is allowed to modify, create, or leave untouched during a specific ticket. It must be approved by the owner or approver before any editing begins. Files not listed in the manifest are forbidden.

## Usage

**Correct usage:**
- "The agent submitted the Edit Manifest for T-7K2M-login; alice approved it before implementation started."
- "The file `src/payments.py` was not listed in the Edit Manifest, so the agent stopped and ran /af-expand-scope."

**Do NOT confuse with:**
- **Test plan** — the test plan describes what tests to run; the Edit Manifest controls which files may be changed.
- **Baseline** — the baseline records the repo state before edits; the manifest controls what may be edited.

## Source

**Introduced in:** initial discovery (§S5 of the agentflow spec)

**Confirmed by:** alice (owner)
**Confirmed at:** 20261115T104500Z

## Related Terms

- `glossary/baseline.md`
- `glossary/edit-lock.md`
```
