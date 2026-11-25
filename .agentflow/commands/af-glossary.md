---
name: af-glossary
description: Add or update a glossary term with owner confirmation
phase: any
tier: 0
actor: agent
core: false
---

# /af-glossary — Add / Manage Glossary Terms

## Purpose
Creates or updates a glossary entry in `glossary/<term>.md`. Agents must only use defined terms and may only add new ones after user confirmation. This command ensures terminology is consistent, documented, and owner-approved before it appears in requirements, tickets, or decisions.

## Preconditions
- [ ] The term is not already defined in `glossary/` (or you are updating an existing entry)
- [ ] The term has appeared in requirements, questions, or discussion and needs clarification
- [ ] The owner is available to confirm the definition (or the entry will be marked `unconfirmed` and treated as inferred)

## Steps
1. **Check for duplicates.** List files in `.agentflow/glossary/`. If `<term>.md` already exists, read it; this may be an update, not a new entry.
2. **Draft the definition.** Write a clear, plain-language definition. Include:
   - The term as used in this project specifically (not a generic dictionary definition)
   - Any synonyms or related terms already in the glossary
   - An example sentence or usage context
3. **Present to owner for confirmation.** Show the draft definition and ask: "Is this definition correct for this project?"
4. **Record owner's confirmation.** Note their verbatim answer. If they refine the definition, update it.
5. **Write the glossary file.** Create or overwrite `glossary/<term>.md`:
   ```
   ---
   type: glossary-entry
   id: GLOSS-<term-slug>
   project_id: <project_id>
   schema_version: 1.0.0
   created: <ts>
   actor: <agent>
   role: agent
   term: <term>
   confirmed_by: <github-username from project.md owner:>
   confirmed_at: <ts>
   ---
   # <term>
   <definition>
   **Synonyms:** ...
   **Example:** ...
   ```
6. **Log an event.** Write `events/<ts>-none-glossary-add-GLOSS-<slug>.md` with `event_type: glossary-add`, term, and confirmation status.
7. **Rebuild derived `glossary.md` index** if it exists (append new entry in alphabetical order).

## Postconditions
- [ ] `glossary/<term>.md` written with confirmed definition
- [ ] Owner's confirmation recorded in the file
- [ ] Glossary event logged
- [ ] Derived `glossary.md` index updated if present

## Next
- **Success:** `/af-next` — continue the interrupted workflow
- **Failure (owner disagrees):** revise definition and re-present; do not write until confirmed
- **Blocked (owner unavailable):** mark entry as `unconfirmed`; treat the term as inferred until confirmed; log a human blocker

## Common Mistakes
- Adding a term without owner confirmation and treating it as verified — unconfirmed terms are inferred
- Using a generic dictionary definition instead of the project-specific meaning
- Forgetting to check for existing entries — duplicates create conflicting definitions
- Not updating the derived `glossary.md` index — users rely on it for quick lookup
- Using technical jargon in the definition when the user is non-technical — write in plain language

## Footer Template
`Done: glossary/<term>.md | Logged: <event-id> | Next: /af-next because glossary updated | Needs you: confirm definition of "<term>"`
