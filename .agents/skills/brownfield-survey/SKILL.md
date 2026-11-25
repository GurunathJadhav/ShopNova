---
name: brownfield-survey
description: Use when starting work in an existing codebase to run a read-only survey of stack, structure, tests, and conventions before any edit.
version: 1.0.0
---

# Brownfield Survey

## Purpose
Builds a verified factual picture of an existing codebase before the framework touches it. Findings become environment records with evidence, and the first `codemap.md` gives every future session a short trusted map. During the survey the codebase is frozen — no edits.

## When to Use
- First session in an existing (brownfield) repository.
- After a major refactor that invalidated the previous codemap.
- When the owner asks to on-board the framework onto legacy code.

## Inputs
- The repository working tree at a known revision.
- Build files, manifests, lockfiles, CI configs.
- Existing test suites and their runners.

## Steps
1. **Announce and freeze:**
   - State that the survey is read-only. Existing code starts FROZEN; the discovery gate still applies before any later edit. Make no edits during the survey.
2. **Identify the stack:**
   - Languages, frameworks, package managers, runtimes — from lockfiles and build configs, not from memory.
3. **Map the structure:**
   - Top-level directories, entry points, one-line purpose each.
4. **Probe tests and conventions:**
   - Test runner, how to run tests, lint/format commands, naming and layout conventions observed in the code.
5. **Record findings with evidence:**
   - Write one environment record per fact: `environment/<fact>.md` with `label: verified` and an `evidence_ref` (file path + the line or command output backing it).
   - Label anything without direct evidence as `inferred`, or omit it.
6. **Build the first `codemap.md`:**
   - Short map: directories and entry points, one-line purposes, revision built at (record the commit/revision).
   - Label every entry `verified` or `inferred`.
7. **Hand off to planning:**
   - Point the owner at `codemap.md` and open questions; planning uses verified facts only.

## Checklist
- [ ] Zero file edits made during the survey.
- [ ] Every environment record carries evidence and `label: verified` or `inferred`.
- [ ] `codemap.md` states the revision it was built at.
- [ ] Every `codemap.md` entry labelled verified or inferred.
- [ ] Stack facts come from lockfiles/build configs, not assumptions.
- [ ] Discovery gate still required before any post-survey edit.

## Anti-Patterns
- Editing or "fixing" code encountered during the survey.
- Writing inferred facts as verified without evidence.
- A codemap longer than a page — it is a map, not documentation.
- Skipping the revision stamp on `codemap.md`.
- Surveying from memory of "typical" stacks instead of the actual repo.

## "Stop and Ask the User If…"
- The repo revision is unclear (detached, dirty tree, or unknown state).
- Build or test commands fail and the intended entry point is ambiguous.
- Contradictory conventions exist and the owner must pick one.
- Parts of the codebase are off-limits for future work — ask for the boundary now.

## Next Skills
- planning-basics
- ticket-creation
- session-handoff-resume

## Worked Example
Owner adds the framework to a legacy Python service. Agent checks out at revision `a1b2c3d`, surveys read-only: lockfile shows Python 3.11 + FastAPI (verified, `pyproject.toml:12`); entry point `app/main.py` (verified, Dockerfile CMD); tests run with `pytest tests/ -x` (verified, CI config). Writes `environment/python-version.md`, `environment/test-command.md`, `environment/api-framework.md` — all `label: verified` with evidence refs. Builds `codemap.md` (built at revision `a1b2c3d`): `app/` — API routes; `services/` — business logic; `migrations/` — Alembic; entry `app/main.py`. `scripts/legacy-etl/` left unexplored, listed as `inferred: ETL scripts`. No edits made.
