---
name: user-story-writing
description: Use when a baselined or proposed requirement must be expressed as a testable user story with acceptance criteria before ticket breakdown.
version: 1.0.0
---

# User Story Writing

## Purpose
Turn requirements into user stories in the standard format, each with testable Given/When/Then acceptance criteria, exactly one declared verification method per criterion, MoSCoW priority, and an S/M/L size. L stories must be split.

## When to Use
- A REQ reached `baselined` status and needs story form.
- An ambiguity-check rewrite produced concrete wording that needs structure.
- A story fails review and its criteria must be rewritten.

## Inputs
- `requirements/REQ-<id>.md` (status `baselined` preferred; `proposed` only for drafts).
- Persona names from the users/personas answers.
- Ambiguity-check conversions and their verification methods.

## Steps
1. **Write the story line:** `As a [persona], I want [capability], so that [benefit]`. The persona must be a named user type from elicitation, not "user". The benefit must state a real outcome.
2. **Write acceptance criteria as Given/When/Then:** each criterion covers one observable behavior. Every criterion must be independently testable — no "and" chains joining two behaviors.
3. **Declare one verification method per criterion**, chosen from:
   - `automated-test` — a test asserts it.
   - `command-output` — a command's output proves it.
   - `manual-check` — a human performs defined steps.
   - `screenshot/visual` — an image or rendered output is compared.
   - `static-check` — lint/typecheck/analysis asserts it.
   - `document-review` — a document's content is reviewed.
   - `user-confirmation` — only the user can confirm it.
4. **Set MoSCoW priority** from the REQ's `priority` (`must`/`should`/`may`; `wont` means record it as out-of-scope, do not write a story).
5. **Set size:** `S` (under a day), `M` (1-3 days), `L` (more). Any `L` story must be split into vertical slices before it proceeds.
6. **Link the story to its REQ** and to any assumptions still pending (`assumed` REQs yield draft stories that cannot enter tickets until confirmed).
7. **Hand the story set to ticket-breakdown**; do not create tickets here.

## Checklist
- [ ] Every story uses the exact persona/capability/benefit format with a named persona.
- [ ] Every criterion is Given/When/Then and tests exactly one behavior.
- [ ] Every criterion declares exactly one verification method.
- [ ] Every criterion is falsifiable — you can name a run that would fail it.
- [ ] No `L` story survives without being split.
- [ ] Stories trace to a REQ id; no orphan stories.

## Anti-Patterns
- "As a user" as persona — too generic to design or test against.
- Criteria like "it works correctly" or "the UI looks good" with no method.
- Combining two behaviors in one criterion to keep the list short.
- Writing stories for `wont`-priority requirements.
- Slipping implementation detail ("add a dropdown") into the capability slot when behavior ("choose export format") is what matters.

## "Stop and Ask the User If…"
- The REQ is still `assumed` and the story would commit to its content.
- A criterion's verification method can only be `user-confirmation` and the user is unavailable.
- Splitting an `L` story changes what the user receives first (delivery order is a product call).
- Two stories conflict or overlap on the same behavior.
- No persona from elicitation fits the capability — a user type may be missing.

## Next Skills
- ticket-breakdown
- ambiguity-check
- api-and-data-design

## Worked Example
REQ-a1b2-plant-reminders (`must`, baselined).
Story: "As a home gardener, I want a reminder when a plant is due for watering, so that no plant dries out."
Criteria:
- Given a plant with a 3-day watering interval, When 3 days pass since the last watering, Then a reminder appears, verified by `automated-test`.
- Given the app was closed for 2 days, When it is reopened with an overdue plant, Then the overdue reminder is shown, verified by `manual-check`.
- Given reminders fire, When the user opens the reminder, Then the plant's name and last-watered date are visible, verified by `screenshot/visual`.
Size: M. No split needed.
