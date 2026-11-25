---
name: python
description: "Use when the project uses Python (pip, Poetry, uv, or pipenv; pytest; ruff/mypy)."
version: 1.0.0
last_verified: 2026-11-16
---

# Python Stack Pack

Stack packs are hints — verify against the project's actual versions and docs. A stack pack never overrides environment facts (`environment/<fact>.md`) or approved decisions. Record every command you actually ran via `/af-env`.

## Scope & Versions

- Checked against: Python 3.11, 3.12, and 3.13; pip 24/25 line; Poetry 1.8.x; uv 0.9.x line; pytest 8.x; ruff 0.9+; mypy 1.x.
- Not claimed: Python < 3.11, pipenv specifics, Poetry 2.x plugin behavior, hatch/pdm — verify locally before relying on them.
- Tool manager is a project decision: detect `pyproject.toml` + `uv.lock` (uv), `poetry.lock` (Poetry), `Pipfile.lock` (pipenv), or bare `requirements.txt` (pip) before running anything.

## Standard Commands

| Purpose | Command |
|---------|---------|
| Test | `uv run pytest` / `poetry run pytest` / `python -m pytest` |
| Lint | `ruff check .` |
| Typecheck | `mypy .` (or `pyright` where configured) |
| Build | `uv build` / `poetry build` / `python -m build` |
| Audit | `pip-audit` (or `uv audit` where available) |

Run through the project's manager wrapper when one exists (`uv run`, `poetry run`); plain `python` may hit the wrong interpreter or a system site-packages. Record verified commands in `environment/` via `/af-env`.

## Conventions

- Detect the manager from lockfiles first; never mix pip installs into a Poetry/uv project.
- Never hand-edit `uv.lock`, `poetry.lock`, or `Pipfile.lock`; change `pyproject.toml` and run the manager's update/lock command.
- Respect pinned versions in `requirements.txt`/`pyproject.toml`; propose bumps as tickets, not in-passing edits.
- Run pytest from the project root or the directory the config expects; conftest and import paths depend on it.
- Match the project's import style (absolute vs relative) and formatting config (ruff format/black settings) — read the config, do not reformat unasked.
- Attach every check result to the ticket via `/af-verify`.

## Common Agent Mistakes

- Editing lockfiles by hand to "resolve" a conflict instead of running `uv lock` / `poetry lock` (or asking if versions are pinned deliberately).
- pip vs poetry vs uv confusion: `pip install` inside a Poetry/uv project, creating a stray `requirements.txt`, or installing into the global interpreter.
- Running tests from the wrong directory — `pytest src/tests` vs `pytest` from root changes discovery, fixtures, and imports.
- Shadowing stdlib or third-party modules with local filenames (`types.py`, `logging.py`).
- Writing `# type: ignore` or loosening `mypy` config instead of fixing the annotation.
- Ignoring virtual environments: installing deps with system pip, then wondering why `uv run pytest` fails.
- Assuming `python` on PATH is the project interpreter; check `pyproject.toml` `requires-python` and any `.python-version`.
- Adding dependencies without recording an approved decision or `/af-env` fact.

## Version Pitfalls

- Python 3.12 changed packaging/`distutils` removal; code that imports `distutils` fails on 3.12+.
- Ruff lint rule names and defaults change across minor versions; do not copy rule IDs from memory.
- Poetry 1.x vs 2.x CLI (`poetry add --lock` behavior, PEP 621 support) differs; check the installed version.
- `uv run` creates/syncs the environment implicitly; an unexpected install may mean the lockfile was out of date — investigate, don't ignore.
- Type stubs (`types-*`, `py.typed`) affect mypy results; a missing stub is not the same as a type error.
- Test discovery differs between pytest rootdir configs; a green run in one directory proves nothing about another.

## Stop and Ask the User If…

- The project pins an EOL Python version and the ticket touches the runtime.
- Two lockfiles or two manager configs coexist (`uv.lock` + `poetry.lock`) and ownership is unclear.
- Dependency changes are needed but no approved decision covers them.
- Type check or lint failures require config relaxation (ignore lists, lowered strictness).
