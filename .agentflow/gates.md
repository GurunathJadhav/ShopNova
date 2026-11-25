# Phase Gate Definitions

Policy file — changes require an approved `rule-change` (S2.4).

Gates define the exit criteria for advancing between phases. The agent verifies each criterion and
logs a gate event. **The owner approves each phase advance.**

At every gate, also review: open assumptions, deferred questions, active waivers, and decisions
whose context may have changed.

## Mode-Based Gate Cadence (`project.md` -> `strictness`)
- **`rapid` (3 stages):** Batch *Discovery + Requirements + Tickets + Planning* into **1 single Align & Plan confirmation** with the owner, then **Build Slices** (vertical slices), then **Verify & Ship** (one final regression + live app smoke check).
- **`balanced` (4 stages, default):** Batch *Discovery + Understanding* → *Requirements + Tickets + Planning* (2 owner confirmations instead of 4 separate gates) → *Implementation* → *Verification & Ship*.
- **`strict`:** Full 8-gate enterprise lifecycle below.

---

## Gate: Discovery → Requirements

**Phase:** discovery
**Approver:** owner
**Exit criteria:**
- [ ] All blocking questions are answered (no open blocking questions remain)
- [ ] All assumptions are confirmed by the user (no unconfirmed assumptions)
- [ ] Non-blocking questions are answered or deferred with a logged reason
- [ ] Ambiguity scan complete — no vague terms remain unresolved
- [ ] Agent has summarised its understanding back to the user
- [ ] User has explicitly confirmed the understanding summary
- [ ] Discovery depth was proposed and confirmed by the user
- [ ] Glossary terms are defined and confirmed
- [ ] Owner approves phase advance

**Fails if:**
- Any blocking question is still open
- Any assumption is unconfirmed
- Understanding summary was not explicitly confirmed by user

---

## Gate: Requirements → Tickets

**Phase:** requirements
**Approver:** owner
**Exit criteria:**
- [ ] All in-scope requirements are recorded as `requirements/REQ-<id>.md` files
- [ ] Each requirement has a priority (MoSCoW), source answer, and status `baselined`
- [ ] The scope baseline (MVP boundary) is explicitly approved by the owner
- [ ] Requirements list is complete and approved by the owner
- [ ] Risk register entries created for identified risks
- [ ] Owner approves phase advance

**Fails if:**
- Any requirement lacks a priority or source
- The scope baseline is not explicitly approved
- Owner has not reviewed the full requirements list

---

## Gate: Tickets → Planning

**Phase:** tickets
**Approver:** owner
**Exit criteria:**
- [ ] Every in-scope requirement maps to at least one ticket
- [ ] Every ticket maps to a requirement or has a logged justification
- [ ] `/af-coverage` check passes with no orphans
- [ ] `traceability.md` is generated and correct
- [ ] All tickets have testable acceptance criteria (Given/When/Then)
- [ ] All tickets are sized (S/M/L); any L tickets are split
- [ ] Dependencies between tickets are recorded
- [ ] Build order is defined (walking skeleton first, then vertical slices)
- [ ] Owner approves phase advance

**Fails if:**
- Coverage check fails (orphan requirements or tickets)
- Any ticket lacks testable criteria
- Any L-sized ticket has not been split

---

## Gate: Planning → Implementation

**Phase:** planning
**Approver:** owner
**Exit criteria:**
- [ ] Environment facts recorded in `environment/` with evidence (OS, runtime, tools, commands)
- [ ] Declared tier is recorded (0, 1, or 2)
- [ ] Quality profile is set in `project.md` with commands and pass conditions
- [ ] Test bootstrap plan exists (walking skeleton + test runner setup as first ticket)
- [ ] Tech-stack decisions recorded as decision records (`decisions/D-<id>.md`)
- [ ] One-way decisions have explicit owner approval
- [ ] Conventions are documented
- [ ] Owner approves phase advance

**Fails if:**
- Tier is not declared
- Quality profile is missing or incomplete
- No test bootstrap plan exists

---

## Gate: Implementation (per-ticket done)

**Phase:** implementation
**Approver:** reviewer (independent), owner for acceptance
**Exit criteria (per ticket, by lane — see `lanes.md`):**

### Standard Lane
- [ ] Evidence recorded per acceptance criterion (combined per-slice record valid in `rapid`/`balanced`)
- [ ] Each verification method executed with results in `verifications/V-<id>.md`
- [ ] Clean diff check (`/af-diff-check`) — changes stay within manifest
- [ ] Regression + build + lint/typecheck pass (`/af-regression`)
- [ ] **Live runtime / UI smoke check passes** for user-facing changes (zero console/runtime errors, responsive layout verified)
- [ ] Review completed (`/af-review`: structured self-review + runtime checks in `rapid`/`balanced` solo mode; independent reviewer required in `strict` or for protected paths)
- [ ] No blocking review findings open
- [ ] Effort budget not exceeded (or re-sized with approval)

### Trivial Lane
- [ ] One verification record exists
- [ ] Diff check against tiny manifest passes
- [ ] One-line log entry recorded

### Incident Lane
- [ ] Reproduction or log evidence recorded before fix
- [ ] Minimal fix verified
- [ ] One approver signs off
- [ ] Follow-up ticket created for root cause and regression test

**Fails if:**
- Any criterion lacks evidence
- Diff check shows unmapped changes
- Independent review has unresolved blocking findings
- Regression suite fails

---

## Gate: Implementation → Verification (Phase Advance)

**Phase:** implementation
**Approver:** owner
**Exit criteria:**
- [ ] All in-scope Must and Should tickets have reached `done` status
- [ ] Every completed ticket has verified evidence and clean diff check
- [ ] No unverified steps or uncommitted provisional edits remain
- [ ] All tickets pass their individual regression and review gates
- [ ] Epic integration checks pass for completed implementation slices
- [ ] Owner approves advancing to project-level verification phase

**Fails if:**
- Any in-scope Must ticket is not `done`
- Any open blocker on an active ticket
- Any unmapped diffs or missing verification records
- Owner has not approved phase advance

---

## Gate: Verification (project-level)

**Phase:** verification
**Approver:** owner
**Exit criteria:**
- [ ] Full regression suite passes with verification records
- [ ] Full quality profile passes (all gates from `project.md`)
- [ ] Epic integration checks pass (end-to-end flows)
- [ ] Environment reproduction from clean checkout succeeds
- [ ] All verification records reference evidence
- [ ] Owner approves phase advance

**Fails if:**
- Any quality gate fails or is unverified without owner sign-off
- Integration check fails
- Clean-checkout reproduction fails

---

## Gate: Review (project-level)

**Phase:** review
**Approver:** owner, independent reviewer
**Exit criteria:**
- [ ] Security review completed independently (S6.4)
- [ ] Architecture-versus-decisions review completed (implementation matches ADRs)
- [ ] Licence and dependency review completed (all compliant)
- [ ] No blocking findings remain open in `reviews/R-<id>.md`
- [ ] All review findings with severity ≥ blocking are resolved
- [ ] Owner approves phase advance

**Fails if:**
- Any blocking finding is unresolved
- Any review was not independent (same author reviewed own code)

---

## Gate: Release

**Phase:** release
**Approver:** owner
**Exit criteria:**
- [ ] All Must-priority tickets are accepted by the owner
- [ ] Full quality profile passes
- [ ] No unresolved human blockers on Must tickets
- [ ] Release note exists
- [ ] Rollback note exists (procedure documented or tested)
- [ ] Changelog entry written
- [ ] Owner gives explicit go-ahead for release

**Fails if:**
- Any Must ticket is not accepted
- Quality profile has failures
- Unresolved human blockers exist on Must tickets
- No rollback plan

---

## Gate: Maintenance Entry

**Phase:** maintenance
**Approver:** owner
**Exit criteria:**
- [ ] Release record exists
- [ ] Rollback is tested or documented
- [ ] Open blockers are triaged
- [ ] Bug-intake template is ready
- [ ] Monitoring and support ownership is defined
- [ ] Owner approves entry to maintenance

**Fails if:**
- No release record
- Rollback is neither tested nor documented
- Open blockers are not triaged

---

## Phase Looping Rules

- Phases describe the project lifecycle; epics cycle within it.
- After release, new work (new epic or approved change request) returns the project to **tickets** phase for those items only.
- The baseline and existing decisions remain in force.
- Each gate record names the epic it covers.
- Maintenance bugs use the bug-intake path (S10.7) without reopening discovery.
