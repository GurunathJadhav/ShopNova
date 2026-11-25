<!-- Template: baseline
     Record type: baseline (stored at baselines/T-xxxx-slug.md)
     Purpose: Snapshot of repository state at the start of a ticket, before any edits.
              Used by /af-revert-unverified to restore to a known-clean state.
              The baseline must be CLEAN — unrelated uncommitted changes go to the user first.
     Folder: .agentflow/baselines/
     Spec ref: §S5.7
-->
---
type: baseline
id: BAS-XXXX-short-slug
project_id: PROJ-XXXX
schema_version: 1.0.0
created: 20260101T000000Z
actor: agent
role: agent
ticket_id: T-XXXX-slug
repo_revision: "PLACEHOLDER — git commit SHA (full 40-char), or 'no-git' if not using git"
tree_status: "clean | dirty"
recorded_method: "git | checksum | copy"
---

## Ticket Reference

**Ticket:** `T-XXXX-slug` — PLACEHOLDER title

## Repository State

**Revision:** `PLACEHOLDER — git SHA or equivalent`
**Status:** `clean` (no uncommitted changes) or `dirty` (explain below)

> If `dirty`, describe which files have uncommitted changes and confirm the user has acknowledged them before proceeding.

**Dirty files (if any):**
- PLACEHOLDER — or "none"

## Manifest Files at Baseline

<!-- For each file listed in the manifest, record its state at baseline.
     Git: the SHA is sufficient. No-git: record checksum (optional tooling) or note it was copied. -->

| Manifest file | Method | Revision / checksum | Notes |
|---|---|---|---|
| `PLACEHOLDER/path/to/file.py` | `git \| checksum \| copy` | PLACEHOLDER | PLACEHOLDER |

## Notes

<!-- Any context: branch name, workspace copy location, pre-baseline concerns raised. -->

- PLACEHOLDER — e.g., "Working on branch ticket/T-7K2M-login"

---

## Format Spec

| Field | Required | Allowed values / format |
|---|---|---|
| `type` | yes | `baseline` |
| `id` | yes | `BAS-<4 base32 chars>-<slug>` |
| `project_id` | yes | must match `project.md` |
| `schema_version` | yes | `1.0.0` |
| `created` | yes | compact UTC `20260101T000000Z` |
| `actor` | yes | `agent` |
| `role` | yes | `agent` |
| `ticket_id` | yes | `T-xxxx-slug` |
| `repo_revision` | yes | 40-char git SHA, or `no-git` |
| `tree_status` | yes | `clean` or `dirty` |
| `recorded_method` | yes | `git \| checksum \| copy` |

**Rules:**
- Baseline must be recorded BEFORE any edits for the ticket begin (`/af-start-ticket`).
- If tree is dirty, the user must acknowledge or clean up before the baseline is accepted.
- Hashes are optional (LLMs cannot compute them); tooling may add them.

---

## Worked Example

```
<!-- Template: baseline -->
---
type: baseline
id: BAS-3M7P-login-start
project_id: PROJ-4B9X
schema_version: 1.0.0
created: 20261117T091600Z
actor: agent
role: agent
ticket_id: T-7K2M-login
repo_revision: "a3f8b1c2d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9"
tree_status: clean
recorded_method: git
---

## Ticket Reference

**Ticket:** `T-7K2M-login` — Implement email/password login endpoint

## Repository State

**Revision:** `a3f8b1c2d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9`
**Status:** clean — no uncommitted changes.

**Dirty files (if any):** none

## Manifest Files at Baseline

| Manifest file | Method | Revision / checksum | Notes |
|---|---|---|---|
| `src/auth/login.py` | git | `a3f8b1c...` | File did not exist yet — to be created |
| `src/auth/jwt_utils.py` | git | `a3f8b1c...` | File did not exist yet — to be created |
| `tests/test_auth_login.py` | git | `a3f8b1c...` | File did not exist yet — to be created |

## Notes

- Working on branch `ticket/T-7K2M-login`.
- Walking skeleton (T-2X9L) was merged to main before this baseline was taken.
```
