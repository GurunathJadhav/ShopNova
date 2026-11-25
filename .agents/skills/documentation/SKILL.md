---
name: documentation
description: Use when a ticket, release, or project profile calls for documentation, or when deciding whether documentation should exist at all.
version: 1.0.0
---

# Documentation

## Purpose
Create and maintain documentation only when a ticket or the project profile explicitly calls for it — documentation without a requirement is scope creep. Written docs must state verified facts with confidence labels and record decisions, not code trivia.

## When to Use
- A ticket's acceptance criteria include a documentation deliverable.
- A release requires a changelog entry and rollback note.
- A decision record (`decisions/D-<id>.md`) needs a user-facing counterpart.
- The project profile mandates README upkeep.

## Inputs
- Project profile (`project.md`) with `record_language`.
- Ticket criteria listing documentation deliverables.
- Decisions (`decisions/`), lessons (`lessons/`), and verification records (`verifications/V-<id>.md`).

## Steps
1. **Check the requirement first:** Confirm a ticket criterion, the project profile, or an owner instruction calls for this document. If nothing does, do not write it — propose a ticket instead (YAGNI).
2. **Match the record language:** Write in the language configured by `record_language` in `project.md`. Front-matter keys and status enums stay English regardless.
3. **Document decisions, not code trivia:** Capture why a choice was made, alternatives rejected, and constraints — link to the `D-<id>` record. Never narrate what the code already says.
4. **Label facts:** Every factual statement about code, environment, or external APIs carries `verified` (with an evidence ref), `inferred` (basis stated), or `unknown`. Unlabelled defaults to `inferred`.
5. **Maintain the README:** If the profile requires it, update README sections affected by this ticket — setup, usage, configuration. Keep edits within the ticket's scope.
6. **Write the changelog entry:** Per release, add an entry describing user-visible changes and include a rollback note (how to revert this release and what data/state it changes).
7. **Verify before publishing:** Each claim in the doc must trace to a verification record or be labelled appropriately. Then log a `doc-written` event via `/af-log`.

## Checklist
- [ ] A ticket criterion or profile line authorises this documentation.
- [ ] Language matches `record_language`; keys and enums remain English.
- [ ] Content records decisions and rationale, not code trivia.
- [ ] All factual statements labelled `verified` / `inferred` / `unknown`.
- [ ] README updated only in sections this ticket affects.
- [ ] Changelog entry added per release, including a rollback note.

## Anti-Patterns
- Writing tutorials, API docs, or wikis no ticket asked for.
- Copying code snippets as "documentation" without explaining why.
- Stating benchmark numbers or environment facts without a label.
- Letting the README drift: describing flags and commands that no longer exist.
- Translating front-matter keys or `status` values into the record language.

## "Stop and Ask the User If…"
- No requirement covers the documentation but the work seems to need it.
- The doc must make a claim that is still `unknown` (publish, omit, or investigate?).
- The rollback note requires information only the owner has (data migrations, external systems).
- `record_language` is unset or conflicts with the audience's language.

## Next Skills
- `git-workflow`
- `anti-hallucination-verification`
- `code-review-self-check`

## Worked Example
Ticket `T-x4kq-login-flow` has criterion C4: "update README auth section and add a changelog entry." The agent updates only the auth section of `README.md`, documenting that sessions expire after 24h (`verified` via `V-j8az-auth-unit-tests`) and that token rotation reduces risk (`inferred`: based on the design discussion in `D-k7we-session-tokens`). In `CHANGELOG.md` it adds the release entry with a rollback note: "Revert to v1.2.0 and run `af-rebuild`; no data migration involved." Then `/af-log` records `doc-written`.
