# Lane Definitions

Policy file — changes require an approved `rule-change` (S2.4).

Lanes control how much process a change goes through. The agent proposes the lane; the user confirms.

---

## Lane: Trivial

**Criteria:**
- Change is ≤ 10 lines of code (`strict`: ≤ 5 lines)
- Change touches ≤ 2 files (`strict`: ≤ 1 file)
- Change is a typo fix, copy edit, comment correction, single CSS token tweak, or tiny config tweak
- No logic change, no new behaviour, no API change
- No protected or frozen files involved

**Done definition:**
- [ ] One verification record exists
- [ ] Diff check against the tiny pre-approved manifest passes
- [ ] One-line log entry recorded as an event

**Manifest:** A tiny pre-approved manifest (covered by standing approval SA3 if configured).
No full interview or ticket lifecycle required.

**Classification examples:**
| Change | Lane | Reason |
|--------|------|--------|
| Fix typo in README | Trivial | 1 file, 1 line, no logic |
| Fix comment spelling | Trivial | 1 file, ≤5 lines, no logic |
| Update copyright year in LICENSE | Trivial | 1 file, 1 line, no logic |
| Change a log message string | Trivial | 1 file, 1 line, no logic change |
| Add a new error message constant | **Not trivial** → Standard | Adds new behaviour |
| Fix CSS colour value | Trivial | 1 file, 1 line, visual only |

**Misclassification rules:**
- If the change touches > 1 file → auto-escalate to Standard
- If the change exceeds 5 lines → auto-escalate to Standard
- If the change modifies logic, control flow, or APIs → auto-escalate to Standard
- If the change touches a protected or frozen file → auto-escalate to Standard (requires approval)
- If the agent proposes Trivial but the change was rejected or reverted → escalate to Standard

---

## Lane: Standard

**Criteria:**
- Any change that does not meet Trivial, Incident, or Project-level criteria
- Normal feature work, refactoring, bug fixes, enhancements
- Full ticket lifecycle applies

**Done definition (by mode in `project.md`):**
- [ ] Evidence recorded per acceptance criterion (`rapid`/`balanced`: 1 combined verification + evidence record per ticket/slice is valid)
- [ ] Each verification method executed with results in `verifications/V-<id>.md`
- [ ] Clean diff check — changed files stay within manifest; no broken dead code
- [ ] Regression + build + lint + typecheck pass
- [ ] **Live runtime smoke check** passes for user-facing/app tickets (renders cleanly, interactive flows work, zero console/runtime errors)
- [ ] Review completed:
  - `rapid` / `balanced` (solo): structured self-review + automated checks (`R-<id>` optional in `rapid`, recommended with `reviewer_type: fresh-session` or `agent` in `balanced`)
  - `strict` or protected paths: mandatory independent review (`reviews/R-<id>.md`)
- [ ] Effort budget not exceeded (or re-sized with approval)

**Process:**
- **`rapid` / `balanced`:** claim + manifest (standing approval SA1 for `src/`+tests) → baseline → build vertical slice (logic + UI/styles + tests together) → run tests, build, and live runtime smoke check (`/af-verify`) → diff/self-check → `/af-done`
- **`strict`:** claim → edit plan and manifest → simplicity check → baseline → 1-file TDD micro-cycles with verification → diff check → regression → independent review → evidence → done

**Classification examples:**
| Change | Lane | Reason |
|--------|------|--------|
| Add user login feature | Standard | New functionality, multiple files |
| Refactor auth module | Standard | Logic change across files |
| Fix pagination bug | Standard | Logic fix requiring investigation |
| Add API endpoint | Standard | New behaviour, tests needed |
| Update dependencies (>2 pkgs) | Standard | Risk, multiple changes |

**Misclassification rules:**
- If the change is a production incident or security issue → auto-escalate to Incident
- If the change requires full discovery (new project, major architecture change) → auto-escalate to Project-level
- A ticket may move to a lane with a weaker done-definition after work has started only through a logged `/af-lane-change` approved by the user

---

## Lane: Incident

**Criteria:**
- Production is broken or degraded
- Security vulnerability actively exploited or critical
- Data loss or corruption in progress
- Time-critical fix where delay causes ongoing harm

**Done definition:**
- [ ] Reproduction or log evidence recorded **before any fix** (reproduce-first rule)
- [ ] Minimal fix applied and verified
- [ ] One approver signs off
- [ ] Follow-up ticket created for root cause analysis and regression test (mandatory, within set time)
- [ ] Incident event logged

**Process:**
- Minimal manifest (only files needed for the fix)
- No full interview or discovery required
- Still requires: verification, logging, and evidence
- **Never** skips verification or logging
- Follow-up ticket is mandatory — the incident lane does not replace proper engineering

**Classification examples:**
| Change | Lane | Reason |
|--------|------|--------|
| Production server returning 500 | Incident | Active production failure |
| Secret exposed in public repo | Incident | Active security incident |
| Database migration corrupting data | Incident | Active data loss |
| Performance degradation in prod | Incident | Active user impact |
| Potential vulnerability found in audit | **Not incident** → Standard | Not actively exploited |

**Misclassification rules:**
- If there is no active production impact → use Standard lane
- If the "incident" is a hypothetical risk → use Standard lane with a risk record
- If the follow-up ticket is not created → incident is not done

---

## Lane: Project-level

**Criteria:**
- New project being started from scratch (greenfield)
- Major architectural change requiring full re-evaluation
- Major platform migration
- Fundamental change to the project's scope or direction

**Done definition:**
- All phase gates in `gates.md` are satisfied (full lifecycle)
- Discovery through release phases completed

**Process:**
- Full discovery gate with blocking questions resolved
- Requirements baseline approved
- Tickets created with coverage check
- Planning with environment facts and quality profile
- Implementation through all gates
- Full verification, review, and release gates

**Classification examples:**
| Change | Lane | Reason |
|--------|------|--------|
| Start a new web application | Project-level | Greenfield project |
| Migrate from monolith to microservices | Project-level | Fundamental architecture change |
| Rewrite backend in different language | Project-level | Major platform migration |
| Add a new module to existing app | **Not project-level** → Standard | Extension, not fundamental change |

**Misclassification rules:**
- If the work is an extension of an existing project → use Standard lane
- If the work is a bug fix or incident → use appropriate lane
- Adding a feature, even a large one, is Standard unless it fundamentally changes the architecture

---

## General Lane Rules

1. **Agent proposes, user confirms.** The agent always proposes a lane with reasoning; the user confirms or overrides.
2. **Auto-escalation is mandatory.** If any misclassification rule triggers, the agent must escalate automatically.
3. **Lane changes after start require `/af-lane-change`.** Moving to a weaker lane after work has started needs user approval and a logged event.
4. **De-escalation is a weakening.** Moving from Standard to Trivial after work started is high-risk and requires justification.
5. **When in doubt, use Standard.** Standard is the safe default for anything that doesn't clearly fit another lane.
