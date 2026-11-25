<!-- Template: manifest
     Record type: manifest (stored at manifests/T-xxxx-slug.md)
     Purpose: Edit Manifest for a ticket. Lists exactly which files may be modified,
              created, or are explicitly off-limits. Anything not listed is FORBIDDEN.
              Overlap rule: two active manifests may not list the same file.
              Must be approved before any editing begins.
     Folder: .agentflow/manifests/
     Spec ref: §S5.2
-->
---
type: manifest
id: MAN-XXXX-short-slug
project_id: PROJ-XXXX
schema_version: 1.0.0
created: 20260101T000000Z
actor: agent
role: owner
ticket_id: T-XXXX-slug
approved_by: ""
approved_at: ""
approval_ref: ""
edit_budget:
  size: "S | M | L"
  max_files: 0
  max_lines: 0
---

## Ticket Reference

**Ticket:** `T-XXXX-slug` — PLACEHOLDER title
**Lane:** `trivial | standard | incident | project-level`

## Allowed to Modify

<!-- List every file or narrow glob that MAY be changed, with the criterion it serves. -->

| Path / glob | Criterion served | Notes |
|---|---|---|
| `PLACEHOLDER/path/to/file.py` | Criterion 1 — PLACEHOLDER | PLACEHOLDER |

## Allowed to Create

<!-- List every NEW file or directory that may be created. Dependencies require highest scrutiny. -->

| Path | Type | Criterion served | Notes |
|---|---|---|---|
| `PLACEHOLDER/new/file.py` | `file \| directory \| dependency` | Criterion 1 | PLACEHOLDER |

## Explicitly NOT Touched

<!-- Files the agent must never open or edit during this ticket, even if they seem relevant. -->

- `PLACEHOLDER — e.g., src/unrelated_module.py`
- `PLACEHOLDER — e.g., .env, secrets/`

## Protected Paths in This Manifest

<!-- Any protected paths (from protected.md) listed here are covered ONLY for this ticket.
     Each needs the approver's explicit sign-off on this manifest. -->

- PLACEHOLDER — or "none"

## Edit Budget

**Size:** PLACEHOLDER (S / M / L)
- S: ≤3 files, ≤100 lines total
- M: ≤7 files, ≤300 lines total
- L: must be split before approval

**Exceeding the budget** requires re-size, split, or scope-expansion (`/af-expand-scope`).

## Overlap Check

<!-- Before approval, confirm no other ACTIVE manifest lists the same files. -->

- [ ] Checked active manifests for overlapping paths — no conflicts found.

## Approval Status

- [ ] Submitted for approval
- [ ] Approved by owner/approver (record `A-XXXX`)

---

## Format Spec

| Field | Required | Allowed values / format |
|---|---|---|
| `type` | yes | `manifest` |
| `id` | yes | `MAN-<4 base32 chars>-<slug>` |
| `project_id` | yes | must match `project.md` |
| `schema_version` | yes | `1.0.0` |
| `created` | yes | compact UTC `20260101T000000Z` |
| `actor` | yes | `agent` |
| `role` | yes | `owner \| approver \| agent` |
| `ticket_id` | yes | `T-xxxx-slug` |
| `approved_by` | no | name/role, empty until approved |
| `approved_at` | no | compact UTC, empty until approved |
| `approval_ref` | no | `A-xxxx` id of the approval record |
| `edit_budget.size` | yes | `S \| M \| L` |
| `edit_budget.max_files` | yes | integer |
| `edit_budget.max_lines` | yes | integer |

**Key rules:**
- Files not listed here are **forbidden**.
- Two active manifests must not share a file (overlap rule).
- Manifests for protected paths need explicit approver sign-off.
- S manifests touching only `src/` and tests are standing-approved (logged with standing-approval reference).

---

## Worked Example

```
<!-- Template: manifest -->
---
type: manifest
id: MAN-9R3T-login-impl
project_id: PROJ-4B9X
schema_version: 1.0.0
created: 20261117T090000Z
actor: agent
role: owner
ticket_id: T-7K2M-login
approved_by: alice (owner)
approved_at: 20261117T091500Z
approval_ref: A-5P2K
edit_budget:
  size: S
  max_files: 3
  max_lines: 100
---

## Ticket Reference

**Ticket:** `T-7K2M-login` — Implement email/password login endpoint
**Lane:** standard

## Allowed to Modify

| Path / glob | Criterion served | Notes |
|---|---|---|
| `src/auth/login.py` | Criterion 1, 2 | New route handler |
| `src/auth/jwt_utils.py` | Criterion 1 | JWT creation helper |
| `tests/test_auth_login.py` | Criterion 1, 2 | New test file |

## Allowed to Create

| Path | Type | Criterion served | Notes |
|---|---|---|---|
| `tests/test_auth_login.py` | file | Criterion 1, 2 | Test suite for login route |

## Explicitly NOT Touched

- `src/auth/register.py`
- `src/users/profile.py`
- `.env`

## Protected Paths in This Manifest

- none

## Edit Budget

**Size:** S — ≤3 files, ≤100 lines total

## Overlap Check

- [x] Checked active manifests — no overlapping paths found (only active manifest is MAN-2X9L-skeleton, no shared files).

## Approval Status

- [x] Submitted for approval
- [x] Approved by alice (owner) — A-5P2K
```
