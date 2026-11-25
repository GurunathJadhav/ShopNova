---
name: security-review
description: Use when a ticket or release touches input handling, authentication, secrets, dependencies, or privileged operations, and a security pass is required.
version: 1.0.0
---

# Security Review

## Purpose
Check code and records for the vulnerability classes that matter in practice, grade findings by severity, and block done or release until blocking findings are resolved. Security review is always done independently — never by the author of the change.

## When to Use
- A project-level security review phase is scheduled.
- A ticket diff touches auth, input parsing, file paths, network calls, or credentials.
- New dependencies are added to `requirements/` or a lockfile.

## Inputs
- Ticket diff against the baseline revision.
- Edit Manifest and dependency list.
- Prior review records (`reviews/R-<id>.md`).
- Project policy on protected paths.

## Steps
1. **Assign an independent reviewer:** The implementer never performs the security review. Use a different agent, a fresh session, or a human, recorded as `reviewer_type` in the review record.
2. **Input validation:** Every external input (user input, API responses, file contents) is validated for type, length, and format before use. Flag missing validation as a finding.
3. **Auth/authz:** Confirm authentication checks and authorization decisions are enforced server-side (or at the trust boundary) — not in client code the user controls.
4. **Injection:** Check SQL, shell, path, and template usage for injection vectors. Parameterised queries, no string-built commands, no unsanitised path joins.
5. **Secrets in diff:** Scan every added line for keys, tokens, passwords, connection strings, and personal data. Any secret in a diff is at minimum a major finding; in a committed record it is blocking.
6. **Dependencies:** For each added or bumped dependency, check known vulnerabilities and confirm the pinned version exists. Unverifiable versions are `unknown` until checked.
7. **Least privilege:** Confirm the change grants only the permissions it needs — file scopes, network access, API scopes, elevated roles.
8. **Record and act:** Write findings to `reviews/R-<id>.md` with severity (`blocking`, `major`, `minor`). Blocking findings stop `/af-done` and stop release. Log the verdict via `/af-log`.

## Checklist
- [ ] Reviewer is not the author (`reviewer_type` recorded).
- [ ] All external inputs validated before use.
- [ ] Auth/authz enforced at the trust boundary.
- [ ] No injection vectors (SQL, shell, path, template).
- [ ] No secrets or credentials in the diff or committed records.
- [ ] Dependencies checked for vulnerabilities and pinned versions.
- [ ] Findings severity-graded in `reviews/R-<id>.md`; blocking ones resolved before done.

## Anti-Patterns
- "It's an internal tool, skip the security pass."
- Author self-certifying the security of their own change.
- Downgrading a blocking finding to ship the release.
- Trusting a dependency's reputation without checking the pinned version.
- Hiding a finding by removing the vulnerable line from the diff instead of the codebase.

## "Stop and Ask the User If…"
- A secret has been committed to git or written into a shared record (rotation is a human decision).
- A finding requires changing a public API, auth model, or protected path.
- A dependency vulnerability needs a major version bump or a waiver.
- The project has no security policy and the ticket touches auth or credentials.

## Next Skills
- `independent-review`
- `git-workflow`
- `documentation`

## Worked Example
Ticket `T-x4kq-login-flow` adds a login endpoint. The fresh-session reviewer checks the diff: input validation present; SQL uses parameterised queries; but `config.py` adds a hardcoded `API_KEY = "sk-..."`. Finding filed in `R-y5nr-auth-pr-review` as `blocking`. The agent moves the key to an environment variable, re-runs `/af-verify`, and notifies the owner that the leaked key must be rotated. Re-review approves before `/af-done`.
