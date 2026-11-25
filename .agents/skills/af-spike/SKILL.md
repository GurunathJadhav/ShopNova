---
name: af-spike
description: Start a timeboxed spike to explore an unknown; output is a written conclusion, not production code
phase: any
tier: 0
actor: both
core: false
---

# /af-spike — Start a Timeboxed Spike

## Purpose
Creates a formal spike ticket for exploring an unknown (a technology, approach, or feasibility question) within a strict timebox. Spike code lives in `spikes/` and is **never merged into production paths**. The spike's only deliverable is a written conclusion that informs a real ticket. Triggered when an unknown exists that must be investigated before implementation can proceed.

## Preconditions
- [ ] An unresolved unknown exists (in `STATE.md` Unknowns or a `claims/` record labelled `unknown`)
- [ ] The unknown is blocking a real ticket or decision
- [ ] The timebox duration is agreed with the owner (default: 2 hours or 1 session)

## Steps
1. **Define the spike clearly.** State:
   - **Question to answer:** one specific question (not a vague "explore X")
   - **Timebox:** duration or session count after which the spike stops regardless
   - **Success criterion:** what a useful answer looks like
   - **Out of scope:** what this spike will NOT do (especially: no production code, no merged changes)
2. **Create a spike ticket.** Use `/af-ticket` with `type: spike`:
   - Story: "As a developer, I need to know [X] so that I can implement [Y] correctly."
   - Acceptance criteria: the written conclusion exists and answers the question
   - Verification method: `document-review` (owner reads the conclusion)
   - Size: S or M (never L — split the question if it would be L)
   - Lane: standard (spikes always use standard lane, never trivial)
3. **Create the spike directory.** Write spike code, notes, and experiments to `spikes/<ticket-id>-<slug>/`. This directory is gitignored for large outputs; keep only trimmed excerpts if committing.
4. **Log a spike-start event.** Write `events/<ts>-<ticket-id>-spike-start-<id>.md`.
5. **Work within the timebox.** Explore the question. At or before the timebox:
   - Write `spikes/<ticket-id>/conclusion.md`: what was learned, the recommended approach, caveats, links to evidence
   - If the timebox expires without a conclusion, write "inconclusive" and what additional work is needed
6. **Write the conclusion.** The conclusion must answer the question directly and include:
   - Recommended approach (or "not feasible" with reason)
   - Evidence (links to docs, pasted outputs, working example in `spikes/`)
   - Open risks or caveats
   - Suggested real tickets to implement the chosen approach
7. **Log a spike-done event.** Write `events/<ts>-<ticket-id>-spike-done-<id>.md` with conclusion summary.
8. **Present conclusion to owner** and ask if the recommended approach is approved.
9. **Create real implementation tickets** based on the conclusion.

## Postconditions
- [ ] Spike ticket created and in `done` state
- [ ] `spikes/<ticket-id>/conclusion.md` written and answers the question
- [ ] Spike-start and spike-done events logged
- [ ] Spike code stays in `spikes/` — NOT in production paths
- [ ] Real implementation ticket(s) created from the conclusion

## Next
- **Success:** `/af-ticket` — create implementation tickets based on spike conclusion
- **Failure (inconclusive):** `/af-ask` — present inconclusive findings to owner; decide whether to extend timebox or accept the uncertainty
- **Blocked:** `/af-blockers` — if the spike needs access or credentials only the owner can supply

## Common Mistakes
- Merging spike code into production — spike code is exploratory and explicitly not production-quality
- Running over the timebox without stopping — write "inconclusive" and stop at the timebox
- Answering a vague question instead of a specific one — the conclusion must be actionable
- Skipping the conclusion document — the conclusion IS the deliverable of the spike; code is not
- Creating an L-size spike — split the question instead; spikes should be S or M

## Footer Template
`Done: spike ticket <ticket-id>, conclusion at spikes/<slug>/conclusion.md | Logged: <event-ids> | Next: /af-ticket because spike concluded; ready to implement | Needs you: review spike conclusion and approve approach`
