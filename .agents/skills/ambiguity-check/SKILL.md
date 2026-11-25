---
name: ambiguity-check
description: Use when requirement text or a user message contains vague words and must be turned into concrete, testable questions before any ticket is written.
version: 1.0.0
---

# Ambiguity Check

## Purpose
Scan requirement text and user messages for vague, unmeasurable language and convert each hit into a concrete question or measurable criterion. Run this before any ticket is written; ambiguity that survives into a ticket becomes unverifiable criteria.

## When to Use
- Before writing any ticket from a requirement.
- A user answer contains qualitative words that need hard numbers.
- A REQ description was written quickly and never reviewed.
- `/af-ask` answers arrive and must be checked for new vagueness.

## Inputs
- Requirement text from `requirements/REQ-<id>.md`.
- Verbatim user answers from `questions/Q-<id>.md`.
- Draft acceptance criteria before ticket creation.

## Steps
1. **Scan for signal words:** `fast`, `slow`, `scalable`, `user-friendly`, `modern`, `simple`, `intuitive`, `robust`, `flexible`, `clean`, `etc.`, `and so on`, `should probably`, `maybe`, `later`, `some`, `several`, `a few`, `as needed`, `production-ready`, `secure`. Flag every hit.
2. **Classify each hit:**
   - Measurable in principle → convert to a concrete question ("fast" → "what latency, and at the 95th percentile or average?").
   - Convertible to a criterion → propose a measurable criterion ("user-friendly" → "first-time user completes core task unaided in under 2 minutes, verified by manual-check").
   - Genuinely subjective → ask the user to pick an observable proxy.
3. **Never resolve silently:** each conversion is either proposed to the user via `/af-ask` with a recommended default, or recorded as `assumed` pending confirmation — same rule as requirements-elicitation.
4. **Rewrite the requirement text** with the confirmed concrete wording. Keep the original verbatim answer linked as `source_answer` in the REQ.
5. **Re-scan after rewrite.** Repeat until zero signal words remain or each remaining hit has a recorded justification.
6. **Only then** proceed to user-story-writing or ticket-breakdown.

## Checklist
- [ ] All signal-word hits listed with their source file and line.
- [ ] Each hit converted to a question `Q-<id>.md` or a measurable criterion with a verification method.
- [ ] No conversion was decided without user confirmation or a recorded `assumed` status.
- [ ] Rewritten REQ text contains zero unqualified vague words.
- [ ] No ticket was written while an ambiguity hit is unresolved.

## Anti-Patterns
- Letting "fast" survive into an acceptance criterion like "the app is fast".
- Converting vagueness by inventing numbers the user never confirmed.
- Treating "etc." as acceptable scope shorthand in any REQ or ticket.
- Running this check after tickets exist and calling the findings "backlog".
- Flagging style/wording issues that have no testability consequence — stay on vagueness.

## "Stop and Ask the User If…"
- The measurable interpretation changes scope (e.g., "fast" could mean 100ms or 2s, with very different designs).
- A subjective quality has no proxy the user accepts.
- Two confirmed answers contradict each other on the same term.
- Resolving the ambiguity would add a new requirement beyond the MVP baseline (route via `/af-change` instead).

## Next Skills
- user-story-writing
- ticket-breakdown
- intake

## Worked Example
REQ text: "The report page should load fast and be user-friendly, showing recent exports etc."
Hits: "fast", "user-friendly", "etc."
Conversions: Q-a1b2-load-latency: "Default: under 2 seconds for the 95th percentile with 10k rows — cheap to hit now and measurable." → criterion: "P95 load time < 2s at 10k rows, verified by automated-test."
"user-friendly" → criterion: "A first-time user completes 'export last month' unaided in under 2 minutes, verified by user-confirmation."
"etc." → Q-c3d4-export-list: "Default: show the 20 most recent exports only — bounded, no pagination needed in MVP."
Rewritten REQ passes re-scan; tickets may now be written.
