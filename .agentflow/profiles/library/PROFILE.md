---
name: library
description: Use when the project is a reusable library, SDK, or package consumed by other developers' code.
version: 1.0.0
---

# Library Profile

Profiles are defaults and hints — they never override environment facts or approved decisions.

## Question Bank

Ask via `/af-ask` (max 5 per batch, blocking first). Recommended defaults included.

1. **Semver policy?** Default: strict semver; breaking changes only in major versions; deprecate first, remove two minors later. Why: consumers plan upgrades around it. Blocking.
2. **Public API definition?** Default: an explicit exported-symbols surface (public module/exports file), not "whatever isn't underscore". Why: determines what contract tests guard. Blocking.
3. **Supported language/runtime versions?** Default: current LTS/stable minus one. Why: declares the test matrix; blocking for CI setup.
4. **Publishing target?** Default: the language's default public registry; ask owner before adding private registries. Why: publish flow affects release gate and rollback (unpublish rules).
5. **Docs?** Default: API reference generated from doc comments; a README with install, quickstart, and one non-trivial example. Why: undiscoverable libraries get reimplemented.
6. **Changelog policy?** Default: changelog entry required for every release; breaking changes called out at the top. Why: consumers' upgrade decisions depend on it.
7. **Dependency policy?** Default: minimize runtime dependencies; prefer peer dependencies for framework integrations. Why: dependency conflicts are the top library complaint.
8. **Stability guarantees?** Default: public API stable within a major; internal APIs may change anytime and must be marked non-public. Why: shapes the backwards-compatibility tests.
9. **Platform coverage?** Default: all platforms the CI matrix covers; no accidental OS-only behavior. Why: silently shipping platform-dependent behavior breaks consumers later.
10. **Contribution flow?** Default: PRs require tests + changelog entry; repo templates provided. Why: keeps the quality bar consistent without gatekeeping debates each time.

## Default Non-Functional Requirements

Defaults only — the user may change any of them. Phrase each as a testable ticket criterion.

- **Zero-warning bar:** build and lint produce zero warnings on supported toolchain versions — warning-free is verifiable.
- **Performance:** no regression > 10% on the benchmark suite without a documented waiver; benchmarks run at release gate.
- **Binary/compile impact (if applicable):** artifact size growth > 10% needs justification in the release note.
- **Install hygiene:** `install` in a clean environment adds only declared dependencies and emits no deprecation warnings.
- **Error quality:** library errors are typed/distinguished and include what was attempted and why it failed — verifiable by test.
- **Backwards compatibility:** public API usable identically on the previous minor release — verified by API-diff check at release gate.

## Test Strategy

- **Highest value:** unit tests of the public API surface from a consumer's perspective — import like a consumer would, not via internal paths.
- **API contract:** an automated public-API snapshot (exported symbols/signatures) diffed per change; unexpected removals fail the build.
- **Integration:** test against the real dependencies at the edges of the supported version matrix (oldest and newest supported).
- **Matrix:** run the regression set on all supported runtime versions and OS platforms in CI.
- **Doctests/examples:** every README/doc example compiles and runs in CI — examples rot first.
- **Regression set:** consumer-perspective unit tests, API surface snapshot, matrix run (versions × platforms), lint/typecheck, benchmark suite at release.
- **Automated:** all of the above plus clean-install check and doc build.
- **Manual-check:** ergonomics of the API (naming, error messages) via a sample consumer app; platform-specific edge behavior.
- **User-confirmation:** deprecation timeline, breaking-change plan, whether an API addition is truly needed or scoped.

## Typical Risks

| Risk | L | I | Mitigation |
|------|---|---|------------|
| Accidental breaking change in a minor release | Medium | High | Automated API-surface diff in regression; release gate blocks undeclared breaks. |
| Runtime dependency bloat causes conflicts for consumers | Medium | Medium | Dependency policy; peer deps for integrations; clean-install check. |
| Undersized test matrix misses version/platform breakage | Medium | High | Matrix CI across supported versions × platforms, required for merge. |
| Public API drift (exported unintentionally) | Medium | Medium | Explicit exports surface; snapshot diff flags new symbols. |
| Examples in docs stop compiling | High | Low | Doctest/example CI job; fails like any test. |
| Performance regression ships silently | Medium | Medium | Benchmark suite at release gate; >10% delta requires waiver. |
| Errors without context force consumers to debug internals | Medium | Low | Typed errors checklist item; error-message tests. |

## Ticket Checklist

Add to any ticket changing behavior or API:

- [ ] Public API surface snapshot updated or unchanged; removals/renames require a major version plan (backwards compatibility).
- [ ] Deprecations documented with removal target version.
- [ ] Changelog entry written; breaking changes flagged.
- [ ] Errors are typed/distinguished and include actionable context (errors).
- [ ] Works on the full supported version matrix (oldest and newest).

Add to docs-facing tickets:

- [ ] New features appear in README quickstart or API reference; example runs in CI (docs).

Add to all tickets:

- [ ] No new runtime dependency without approval; no secrets or credentials in package contents (auth).
- [ ] Empty/no-input edge cases tested (empty inputs return documented results, not panics or silent wrong data).
