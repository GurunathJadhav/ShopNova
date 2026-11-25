---
name: generic
description: "Use when no specific stack pack matches, or the project mixes stacks — discover commands from the repo instead of assuming."
version: 1.0.0
last_verified: 2026-11-16
---

# Generic Stack Pack

Stack packs are hints — verify against the project's actual versions and docs. A stack pack never overrides environment facts (`environment/<fact>.md`) or approved decisions. Record every command you actually ran via `/af-env`.

## Scope & Versions

- Applies to any project where no dedicated stack pack matches (mixed stacks, JVM, Go, Rust, C/C++, shell, unknown).
- No versions are claimed. Discover the toolchain from the repo (`go.mod`, `Cargo.toml`, `pom.xml`, `build.gradle`, `Makefile`, CI configs) and record what you find.
- If a dedicated pack matches the dominant language, use that pack instead; use this one only for gaps.

## Standard Commands

| Purpose | Command |
|---------|---------|
| Test | Read from project config (Makefile target, CI step, task runner) — do not guess |
| Lint | Read from project config — do not guess |
| Typecheck | Read from project config — do not guess |
| Build | Read from project config — do not guess |
| Audit | Read from project config — do not guess |

Precedence for discovery: CI pipeline files → Makefile/task runner → tool manifests (`go.mod`, `Cargo.toml`, `pom.xml`) → README build docs. Any command you run successfully becomes an `environment/<fact>.md` entry via `/af-env`; a command that fails does too, with the error.

## Conventions

- Verify a command exists before citing it; a guessed command is a claim (`label: inferred`), never a fact.
- Run checks from the directory the config expects; build tools are rootdir-sensitive.
- Prefer the project's own entrypoints (`make test`, `./gradlew check`, `just ci`) over raw tool invocations.
- Never hand-edit lockfiles (`go.sum`, `Cargo.lock`, `gradle.lockfile`, `Gemfile.lock`); use the tool's own update command.
- Never edit generated or vendored code (`vendor/`, `target/`, `build/`, protobuf output) — regenerate via the documented command.
- Attach every check result to the ticket via `/af-verify`.

## Common Agent Mistakes

- Inventing commands from training memory (`make test`) without checking a Makefile exists or contains that target.
- Running commands from the wrong directory because the tool's rootdir detection differs from the repo layout.
- Mixing toolchains: `go get` in a modules project with vendoring, `cargo` without the project's pinned toolchain (rust-toolchain.toml).
- Treating a passing build in one module as proof for the whole monorepo; scope checks to what the ticket touched.
- Skipping the audit step because "no standard command exists" — record that fact in `environment/` instead, or ask.
- Editing generated artifacts instead of their sources (`.pb.go`, generated SQL migrations, lockfiles).
- Assuming a wrapper script (`./gradlew`, `mvnw`, `nix develop`) is optional; on this project it may be the only supported entrypoint.

## Version Pitfalls

- Toolchain files (`rust-toolchain.toml`, `.nvmrc`, `.tool-versions`, `go.mod` `go` directive) pin versions; ignoring them produces unreproducible results.
- Wrapper scripts pin the tool version; calling a globally installed tool bypasses the pin.
- CI defines the authoritative check set; a local run may cover fewer checks than the pipeline will.
- JVM/Gradle builds depend on the JDK version; verify `java -version` before diagnosing failures.

## Stop and Ask the User If…

- No test, lint, or build command can be discovered from the repo and the ticket requires verification.
- Two build systems coexist (e.g. Makefile and Bazel) and ownership is unclear.
- The pinned toolchain is unavailable in this environment and installing it needs approval.
- The discovered commands conflict with an approved decision or an existing environment fact.
