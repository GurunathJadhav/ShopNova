<!-- Template: waiver
     Record type: waiver (W-xxxx-slug)
     Purpose: Records an authorized exception to skip or modify a specific framework rule
              or gate criterion. The ONLY mechanism to bypass a policy check.
              Must contain the user's verbatim words, role (must be owner), and expiry.
              NEVER covers: policy file protections, secrets safety, or countersigns.
     Folder: .agentflow/waivers/
     Spec ref: §S10.3
-->
---
type: waiver
id: W-XXXX-short-slug
project_id: PROJ-XXXX
schema_version: 1.0.0
created: 20260101T000000Z
actor: human
role: owner
rule_waived: "PLACEHOLDER — exact rule citation (e.g., gates.md#tickets-gate-coverage, lanes.md#trivial-size-limit)"
reason: "PLACEHOLDER — clear justification why strict compliance is not feasible or desired"
user_verbatim: "PLACEHOLDER — verbatim quote of the owner's authorization"
expiry: "PLACEHOLDER — compact UTC timestamp (e.g., 20261120T180000Z) or milestone (e.g., end-of-phase:planning, ticket:T-XXXX)"
status: "active | expired | revoked"
waiver_scope: "PLACEHOLDER — exact boundary of what this waiver permits"
---

## Rule Waived

**Citation:** `PLACEHOLDER — rule identifier or file/section`

**Standard Requirement:**
> PLACEHOLDER — quote the original rule being waived.

## Justification / Reason

PLACEHOLDER — why the rule must be bypassed in this specific situation, and what alternative safeguards or risk mitigations are in place.

## Verbatim User Authorization

<!-- Must be exact, verbatim user statement from chat. Paraphrasing is invalid. -->

> PLACEHOLDER — paste the user's exact words authorizing the waiver.

## Authorized By

**Authorizer:** PLACEHOLDER — name/handle of owner
**Role:** `owner` (waivers may only be granted by the project owner)
**Timestamp:** PLACEHOLDER — compact UTC

## Expiry & Boundaries

**Expiry Condition:** `PLACEHOLDER — compact UTC date or lifecycle milestone`

**Strict Boundaries:**
- PLACEHOLDER — describe the limits of this waiver.
- **Inviolable safety boundaries:** Under no circumstances does this waiver permit editing policy files, bypassing secrets redaction, or avoiding high-risk countersigns.

## Revocation / Resolution History

<!-- When expired or revoked, log the event and reference here. -->

- **Resolution:** `active | expired | revoked`
- **Resolved Date:** PLACEHOLDER — compact UTC
- **Resolution Event:** PLACEHOLDER — EVT-XXXX-slug

---

## Format Spec

| Field | Required | Allowed values / format |
|---|---|---|
| `type` | yes | `waiver` |
| `id` | yes | `W-<4 base32 chars>-<slug>` |
| `project_id` | yes | must match `project.md` |
| `schema_version` | yes | `1.0.0` |
| `created` | yes | compact UTC `20260101T000000Z` |
| `actor` | yes | `human` (only humans can grant waivers) |
| `role` | yes | `owner` |
| `rule_waived` | yes | specific rule citation string |
| `reason` | yes | non-empty justification string |
| `user_verbatim` | yes | exact quote of user statement |
| `expiry` | yes | compact UTC timestamp or milestone identifier |
| `status` | yes | `active \| expired \| revoked` |
| `waiver_scope` | yes | non-empty boundary definition |

**Non-waivable Invariants (§S10.3):**
- Policy file protections (`project.md`, `gates.md`, `lanes.md`, `safety.md`, `protected.md`, `workflow-map.md`).
- Secrets safety & exposure rules (§S8).
- High-risk countersign requirements (§S2.2).

---

## Worked Example

```
<!-- Template: waiver -->
---
type: waiver
id: W-2M8K-skip-visual-check
project_id: PROJ-4B9X
schema_version: 1.0.0
created: 20261118T103000Z
actor: human
role: owner
rule_waived: "gates.md#verification-visual-screenshot"
reason: "CI runs in headless Linux environment with no display server or browser rendering capabilities; screenshot verification cannot run."
user_verbatim: "Waive the screenshot verification requirement for T-7K2M; headless test output showing HTML response is sufficient."
expiry: "ticket:T-7K2M-login"
status: active
waiver_scope: "Applies exclusively to Criterion 3 of ticket T-7K2M-login. Does not waive automated unit or integration test checks."
---

## Rule Waived

**Citation:** `gates.md#verification-visual-screenshot`

**Standard Requirement:**
> UI rendering and visual appearance criteria require an automated screenshot or visual verification record prior to ticket acceptance.

## Justification / Reason

The current test execution environment is an isolated Linux runner without an X11/Wayland display server or installed Chromium binary. The login route HTML structure is fully verified via automated DOM assertion tests (`test_login_markup.py`).

## Verbatim User Authorization

> "Waive the screenshot verification requirement for T-7K2M; headless test output showing HTML response is sufficient."

## Authorized By

**Authorizer:** alice
**Role:** owner
**Timestamp:** 20261118T103000Z

## Expiry & Boundaries

**Expiry Condition:** `ticket:T-7K2M-login` (lapses automatically upon ticket completion)

**Strict Boundaries:**
- Limited solely to the visual screenshot criterion for `T-7K2M-login`.
- Does not waive `automated-test` execution or code coverage thresholds.
- Cannot be applied to any subsequent tickets without a new waiver.

## Revocation / Resolution History

- **Resolution:** active
- **Resolved Date:** (pending ticket completion)
- **Resolution Event:** (pending)
```
