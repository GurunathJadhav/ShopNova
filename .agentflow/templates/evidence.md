<!-- Template: evidence
     Record type: evidence (E-xxxx-slug)
     Purpose: Captures raw command or tool output proving a verification claim or baseline state.
              Stored at evidence/<ticket>/<name>.md. Raw pasted output is formatted inside a code fence
              and trimmed to approximately 200 lines. Referenced by path from verifications and claims.
     Folder: .agentflow/evidence/<ticket>/
     Spec ref: §S1, §S6.1
-->
---
type: evidence
id: E-XXXX-short-slug
project_id: PROJ-XXXX
schema_version: 1.0.0
created: 20260101T000000Z
actor: "agent | human"
role: "agent | owner | reviewer"
ticket_id: "T-XXXX-slug | none"
source_command: "PLACEHOLDER — exact shell command or tool invocation"
source_type: "test-runner | compiler-build | linter-static | curl-http | git-diff | environment-probe | manual-log"
line_count: 0
trimmed: "yes | no"
---

## Description

PLACEHOLDER — summary of what this output demonstrates (e.g., "Full pytest suite execution for ticket T-XXXX").

## Execution Context

**Command executed:**
```bash
PLACEHOLDER — exact command line executed
```

**Working directory:** `PLACEHOLDER — e.g., project root`
**Executed by:** `PLACEHOLDER — agent (model name) or human`
**Execution timestamp:** `PLACEHOLDER — compact UTC`
**Exit code:** `0 | non-zero`

## Raw Output

<!-- Raw output enclosed in code fence. Trimmed to ~200 lines if output is voluminous. -->

```text
PLACEHOLDER — paste raw execution output here (trimmed to ~200 lines)
```

## Observations / Highlights

<!-- Call out specific lines or key assertions from the output above. -->

- **Line / Section:** PLACEHOLDER — e.g., "Line 42: 14 passed in 0.82s"
- **Key takeaway:** PLACEHOLDER

---

## Format Spec

| Field | Required | Allowed values / format |
|---|---|---|
| `type` | yes | `evidence` |
| `id` | yes | `E-<4 base32 chars>-<slug>` |
| `project_id` | yes | must match `project.md` |
| `schema_version` | yes | `1.0.0` |
| `created` | yes | compact UTC `20260101T000000Z` |
| `actor` | yes | `agent` or `human` |
| `role` | yes | `agent \| owner \| reviewer` |
| `ticket_id` | yes | ticket id or `none` |
| `source_command` | yes | exact command string or `user-paste` |
| `source_type` | yes | `test-runner \| compiler-build \| linter-static \| curl-http \| git-diff \| environment-probe \| manual-log` |
| `line_count` | yes | integer count of output lines |
| `trimmed` | yes | `yes` or `no` (must be `yes` if output was clipped to ~200 lines) |

**Storage path:** `evidence/<ticket-id>/<name>.md` or `evidence/<name>.md` for non-ticket evidence.
**Rules:**
- Output must be in a fenced code block (` ```text ` or appropriate language).
- Cap raw output at approximately 200 lines to preserve token efficiency.
- Gitignore very large raw dumps if necessary, keeping trimmed excerpts in the committed evidence records (§S1).

---

## Worked Example

```
<!-- Template: evidence -->
---
type: evidence
id: E-7M3Q-pytest-auth-login
project_id: PROJ-4B9X
schema_version: 1.0.0
created: 20261118T142500Z
actor: agent
role: agent
ticket_id: T-7K2M-login
source_command: "pytest tests/test_auth_login.py -v --tb=short"
source_type: test-runner
line_count: 24
trimmed: no
---

## Description

Test runner output verifying authentication and JWT cookie generation for ticket T-7K2M-login.

## Execution Context

**Command executed:**
```bash
pytest tests/test_auth_login.py -v --tb=short
```

**Working directory:** `/workspace/app`
**Executed by:** gemini-2.5-pro (agent)
**Execution timestamp:** 20261118T142500Z
**Exit code:** 0

## Raw Output

```text
============================= test session starts ==============================
platform linux -- Python 3.12.3, pytest-8.1.1, pluggy-1.4.0 -- /workspace/.venv/bin/python
cachedir: .pytest_cache
rootdir: /workspace/app
configfile: pyproject.toml
testpaths: tests
collected 2 items

tests/test_auth_login.py::test_login_success PASSED                      [ 50%]
tests/test_auth_login.py::test_login_wrong_password PASSED               [100%]

============================== 2 passed in 0.28s ===============================
```

## Observations / Highlights

- **`test_login_success` (100%):** Verified 200 OK and `Set-Cookie` header containing signed JWT.
- **`test_login_wrong_password` (100%):** Verified 401 Unauthorized response on invalid credentials.
- **Exit code 0:** All test assertions passed cleanly with no warnings or regressions.
```
