---
name: cli-tool
description: Use when the project is a command-line tool or script distribution users run locally in a terminal.
version: 1.0.0
---

# CLI-Tool Profile

Profiles are defaults and hints — they never override environment facts or approved decisions.

## Question Bank

Ask via `/af-ask` (max 5 per batch, blocking first). Recommended defaults included.

1. **Install method?** Default: language-native package manager (pip/npm/cargo/etc.); offer a single binary later only on demand. Why: the install path decides CI test matrix and upgrade story. Blocking.
2. **Shells supported?** Default: POSIX sh + bash + zsh + PowerShell on Windows. Why: Windows/PowerShell differences (paths, quoting, env vars) are the top cross-platform bug source.
3. **Exit code policy?** Default: 0 = success, 1 = operational failure, 2 = usage error; documented in one place. Why: scripts and CI depend on exit codes; ad-hoc codes are unusable.
4. **Output contract?** Default: human-readable text to stdout, diagnostics to stderr, `--json` flag for machine-readable output on commands that produce structured data. Why: pipes and CI automation both need this.
5. **Config file support?** Default: none until required; environment variables for secrets, flags for behavior. Why: premature config formats are a maintenance trap.
6. **State files?** Default: tool is stateless; any cache goes in the platform cache dir, never the working directory. Why: stateful CLIs that scatter dotfiles get abandoned.
7. **Telemetry?** Default: none. Why: opt-in telemetry only, and it needs an explicit privacy note.
8. **Long-running operations?** Default: progress to stderr, Ctrl-C exits cleanly and atomically (no half-finished work). Why: interactive UX plus data integrity.
9. **Cross-platform priority?** Default: equal, unless the environment facts say the user base is one platform. Why: determines whether Windows CI runs per ticket or per release.
10. **Backward compatibility of CLI interface?** Default: flags and output formats are stable within a minor version; breaking changes require a major bump. Why: downstream scripts break silently otherwise.

## Default Non-Functional Requirements

Defaults only — the user may change any of them. Phrase each as a testable ticket criterion.

- **Startup time:** cold start p95 < 500 ms for commands that touch no external resources.
- **Exit codes:** every error path exits non-zero with a one-line stderr message; success prints nothing to stderr — verifiable by test.
- **Portability:** runs identically on Linux, macOS, and Windows CI for the supported shells; no path/line-ending regressions.
- **Interruption safety:** SIGINT/SIGTERM at any point leaves no partial writes or stale locks — verifiable by test.
- **Error messages:** actionable (what failed, why, next step), never a bare stack trace to users; stack traces only behind a debug flag.
- **Help:** every command has `--help` with usage, examples, and exit codes.

## Test Strategy

- **Highest value:** unit tests for command logic plus end-to-end tests that run the built CLI as a subprocess and assert stdout/stderr/exit code/filesystem side effects.
- **Integration:** run against real temporary directories and sandboxed fixtures; mock external network unless a flag forces real calls.
- **Cross-shell:** regression includes running the key commands under bash and PowerShell (on Windows CI) — this is where CLIs rot.
- **Snapshot/output tests:** pin stdout for representative invocations; update snapshots deliberately, never casually.
- **Regression set:** all unit tests, the E2E invocation suite, exit-code assertions, `--help` smoke for every command, cross-shell run.
- **Automated:** unit, E2E subprocess tests, exit codes, help output, interruption tests (SIGINT), packaging/install check in a clean environment.
- **Manual-check:** interactive UX (progress, color output, terminal resize), shell completion, genuinely weird filesystem states (read-only dirs, symlinks).
- **User-confirmation:** output wording, flag naming, install instructions.

## Typical Risks

| Risk | L | I | Mitigation |
|------|---|---|------------|
| Windows/PowerShell path or quoting bug | High | Medium | PowerShell in CI regression set for every ticket touching commands. |
| Exit code 0 on failure breaks downstream automation | Medium | High | Exit-code assertion tests for every error path; checklist item. |
| Half-written state after interruption (Ctrl-C, crash) | Medium | High | Write to temp file then atomic rename; interruption test in regression. |
| Breaking change to flags/output format | Medium | Medium | Snapshot tests; changelog + major version for breaking changes. |
| Leaked secrets in error messages or logs | Low | High | Redaction helper; security review on any code printing env/request data. |
| Slow startup after adding dependencies | Medium | Low | Startup-time budget check at release gate; lazy imports. |
| Install fails in clean environment | Medium | Medium | CI job installs the package in a fresh container and smoke-tests it. |

## Ticket Checklist

Add to command tickets:

- [ ] Exit codes follow the documented policy for success, failure, and usage error (errors).
- [ ] `--help` updated; stdout/stderr split respected (errors).
- [ ] Behavior verified under bash and PowerShell (portability).
- [ ] No output change for existing flags without a changelog entry (backwards compatibility).
- [ ] No state or cache files written into the user's working directory.

Add to any ticket writing files or network calls:

- [ ] Interrupted runs leave no partial files or stale locks (idempotency: re-running the same command twice yields the same final state).
- [ ] Secrets redacted from all error output and logs (auth + errors).
- [ ] Clean-environment install smoke test passes.
