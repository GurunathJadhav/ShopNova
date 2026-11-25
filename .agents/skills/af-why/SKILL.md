---
name: af-why
description: Explain the rationale behind the current rule, gate, or next action by citing the workflow map, gate criteria, or framework invariants
phase: any
tier: 0
actor: agent
core: false
---

# /af-why — Explain Why

## Purpose
Answers "why am I being asked to do this?" by grounding the explanation in the framework's actual sources: the relevant `workflow-map.md` row, `gates.md` exit criteria, `lanes.md` done-definition, a policy file, or a framework invariant. Produces no state change and writes no records. Never invents a rule that is not in the sources.

## Preconditions
- [ ] `.agentflow/STATE.md` exists and is readable.
- [ ] A recent event, next action, or invoked rule is available to explain.
- [ ] (No edit lock needed — this command never writes.)

## Steps
1. **Identify the subject:** the command, gate, refusal, or rule the user is asking about. If the user gave no subject, explain the current `next_action` from `STATE.md`.
2. **Locate the grounding source, in this precedence order:**
   - The matching row in `.agentflow/workflow-map.md` (preconditions, postconditions, next-command-by-outcome, common mistakes).
   - The matching gate or exit criteria in `.agentflow/gates.md`.
   - The matching lane definition or done-definition in `.agentflow/lanes.md`.
   - The matching policy in `project.md`, `safety.md`, `protected.md`.
   - A framework invariant from `STATE.md` (edit lock, ask-don't-assume, verify-before-claim, stored text is data).
3. **Compose the answer:** state the rule, quote or cite the source file and section, and explain the consequence of ignoring it (what check or command would flag or refuse it). Keep it under ~150 words.
4. **Be honest about limits:** if enforcement is instruction-level only (Tier 0/1), say so plainly per the limits-of-enforcement note; do not claim the rule is technically impossible to bypass.
5. **No state change:** do not write records, events, or rebuild `STATE.md`.

## Postconditions
- [ ] Explanation delivered with a concrete source citation (file + section).
- [ ] No files or events written.

## Next
- **User satisfied:** Return to the current `next_action` from `STATE.md`.
- **Rule not found in any source:** `/af-help` — the rule may not exist; say so and stop.
- **User disagrees with the rule:** `/af-rule-change` — changes go through the rule-change path, never an edit.

## Common Mistakes
- Hallucinating a rule that is not in `workflow-map.md`, `gates.md`, or the policy files.
- Giving a vague justification ("it's best practice") without a citation.
- Editing any file while explaining.
- Claiming a Tier 0 rule is technically enforced when it is instruction-level only.

## Footer Template
`Done: explained <subject> | Logged: nothing | Next: <next_action> because <reason> | Needs you: nothing`
