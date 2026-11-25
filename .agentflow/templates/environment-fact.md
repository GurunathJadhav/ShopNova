<!-- Template: environment-fact
     Record type: environment-fact (stored at environment/<fact-name>.md)
     Purpose: Records a verified or inferred environment fact (OS, runtime version,
              package manager, compiler/test runner, available CLI tools).
              Consulted by agents before proposing commands instead of guessing.
     Folder: .agentflow/environment/
     Spec ref: §S16
-->
---
type: environment-fact
id: ENV-XXXX-short-slug
project_id: PROJ-XXXX
schema_version: 1.0.0
created: 20260101T000000Z
actor: "agent | human"
role: "agent | owner"
fact_name: "PLACEHOLDER — slug of the fact (e.g., python-runtime, os-platform, test-runner)"
fact_value: "PLACEHOLDER — precise discovered value (e.g., Python 3.12.3, Windows 11 Pro 23H2)"
label: "verified | inferred"
evidence_ref: "PLACEHOLDER — path to evidence record (e.g., evidence/env/python-v.md) or 'inline'"
command_run: "PLACEHOLDER — command used to detect/probe this fact (e.g., python --version)"
verified_at: ""
verified_by: ""
---

## Fact Name

**`PLACEHOLDER — fact_name`**

## Fact Value

```
PLACEHOLDER — exact value or detailed version string
```

## Confidence Label

**Label:** `verified | inferred`

- **verified:** Directly probed by running a command or inspecting system/package configuration. Evidence reference mandatory.
- **inferred:** Deduced from configuration files or defaults without active command verification. Cannot justify critical environment-dependent steps until verified.

## Detection Evidence

**Command executed:**
```bash
PLACEHOLDER — e.g., node -v
```

**Output:**
```
PLACEHOLDER — raw output excerpt
```

**Evidence file:** `PLACEHOLDER — path or 'inline'`

## Usage & Constraints

PLACEHOLDER — how agents and tools must use this fact. Note any platform-specific quirks, path syntax rules (e.g., Windows backslashes vs POSIX forward slashes), shell caveats, or version incompatibilities.

## Change / Invalidation Triggers

PLACEHOLDER — what events would require re-probing or invalidating this fact (e.g., runtime upgrade, container rebuild, switching virtualenvs).

---

## Format Spec

| Field | Required | Allowed values / format |
|---|---|---|
| `type` | yes | `environment-fact` |
| `id` | yes | `ENV-<4 base32 chars>-<slug>` |
| `project_id` | yes | must match `project.md` |
| `schema_version` | yes | `1.0.0` |
| `created` | yes | compact UTC `20260101T000000Z` |
| `actor` | yes | `agent` or `human` |
| `role` | yes | `agent \| owner` |
| `fact_name` | yes | lowercase hyphenated string matching filename |
| `fact_value` | yes | non-empty string |
| `label` | yes | `verified \| inferred` |
| `evidence_ref` | yes if verified | path to evidence file or `inline` |
| `command_run` | yes if verified | command string |
| `verified_at` | no | compact UTC when verified |
| `verified_by` | no | actor/role that verified the fact |

**Filename:** `environment/<fact-name>.md`
Example: `environment/python-runtime.md`

---

## Worked Example

```
<!-- Template: environment-fact -->
---
type: environment-fact
id: ENV-4K9P-python-runtime
project_id: PROJ-4B9X
schema_version: 1.0.0
created: 20261115T093500Z
actor: agent
role: agent
fact_name: python-runtime
fact_value: "Python 3.12.3 (CPython, 64-bit)"
label: verified
evidence_ref: evidence/env/python-version.md
command_run: "python --version"
verified_at: 20261115T093500Z
verified_by: agent (gemini-2.5-pro)
---

## Fact Name

**`python-runtime`**

## Fact Value

```
Python 3.12.3
```

## Confidence Label

**Label:** `verified`

Probed directly during `/af-start` environment audit using `python --version`.

## Detection Evidence

**Command executed:**
```bash
python --version
```

**Output:**
```
Python 3.12.3
```

**Evidence file:** `evidence/env/python-version.md`

## Usage & Constraints

- Standard CPython 3.12 interpreter available in PATH.
- F-string syntactic nesting (PEP 701) and generic type parameters (PEP 695) supported.
- Virtual environment active at `.venv`. Agents must invoke commands using `.venv/bin/python` or ensure virtualenv activation.

## Change / Invalidation Triggers

- Virtual environment recreation.
- Base interpreter modification or container image swap.
```
