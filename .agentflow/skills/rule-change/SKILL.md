---
name: rule-change
description: Use when a policy file or protected asset must change — policy and protected files change only through an approved rule-change request, with countersign for weakenings.
version: 1.0.0
---

# Rule Change

## Purpose
Policy files and protected assets are the framework's constitution; agents never edit them directly. Any change goes through an approved rule-change request stating what, why, and what it weakens or strengthens. Weakening a rule is HIGH-RISK and requires the user's own countersign.

## When to Use
- A change to any policy file is proposed: `project.md`, `gates.md`, `lanes.md`, `safety.md`, `protected.md`, `workflow-map.md`.
- A change to a protected asset is proposed: `AGENTS.md`, adapters, skills, commands, templates, format specs.
- A check reports a policy file differs from its last approved version.
- Someone asks to raise a limit, remove a gate, or shrink protected paths.

## Inputs
- The current approved version of the policy file or asset.
- The proposed change with rationale.
- The last approval record for the file, if any.

## Steps
1. **Confirm the target is policy or protected.** These change ONLY through an approved rule-change request — never by direct edit, even if asked casually.
2. **Write the rule-change request.** State: what changes, why, and what it weakens or strengthens. Be explicit about consequences.
3. **Classify the risk.** Weakening a rule — raising a limit, removing a gate, shrinking protected paths — is HIGH-RISK and needs an additional countersign. Strengthenings follow the normal approval path.
4. **Obtain owner approval.** No edit happens before a recorded approval. Never assume approval.
5. **Obtain the countersign for weakenings.** The countersign must be the user's own act: a user-authored commit, the user personally creating/editing the approval file, or typing the approval id in a separate confirmation message. Agent-written approvals do not count.
6. **Restrict who writes what.** Agents may write records and rebuild derived views only — never policy files. If the framework must reflect a change, rebuild views from the approved file.
7. **Report unapproved drift.** If a check compares a policy file against its last approved version and finds a difference, report the unapproved change; do not bless it after the fact.
8. **Never waive the protection.** Waivers never cover policy-file protections. Do not attempt /af-waive for this.

## Checklist
- [ ] Target confirmed as policy file or protected asset.
- [ ] Request written: what, why, weakened or strengthened.
- [ ] Risk classified; weakenings marked HIGH-RISK.
- [ ] Owner approval recorded before any change.
- [ ] Countersign obtained from the user's own action for weakenings.
- [ ] Agent touched only records and derived views, not the policy file.
- [ ] Policy file compared against last approved version; drift reported.
- [ ] No waiver requested or accepted for the protection.

## Anti-Patterns
- Editing `gates.md` or a skill file directly "because the user asked in chat".
- Counting an agent-written approval note as a countersign.
- Framing a weakening as a "cleanup" to skip the HIGH-RISK path.
- Using a waiver to bypass policy-file protection.
- Retroactively approving a change discovered by a drift check.
- Quietly shrinking protected paths inside an unrelated edit.

## "Stop and Ask the User If…"
- The change weakens a rule and no countersign mechanism is available — ask the user to countersign via one of the accepted actions.
- It is unclear whether a file is policy or protected — ask before touching it.
- A drift check shows an unapproved policy change — ask who made it and whether it was approved.
- The user asks to remove a gate entirely — treat as HIGH-RISK and require explicit countersign.
- Approval exists but the countersign is missing — the change cannot proceed; say so.

## Next Skills
- change-request
- change-control
- secrets-and-redaction

## Worked Example
The team asks to raise the strict unverified limit from one file to three. The agent writes a rule-change request: what (lanes.md strict limit), why (larger verifiable units in this codebase), and classifies it as weakening → HIGH-RISK. The owner approves in a record; the user then types the approval id in a separate confirmation message as countersign. Only then is the policy file updated by the user, and the agent rebuilds derived views. A later request to remove the diff gate is refused a waiver — it needs its own rule-change with countersign.
