---
name: release-readiness
description: Use before /af-release-check or a release candidate to verify every Must ticket is accepted, all gates pass, blockers are clear, and release and rollback notes exist.
version: 1.0.0
---

# Release Readiness

## Purpose
Assembles and checks the evidence a release needs, so `/af-release-check` and the owner's go-ahead rest on verified facts, not optimism. The framework prepares releases; it never deploys unless the owner named a deploy command in `safety.md`, and any deploy needs approval each time.

## When to Use
- Before running `/af-release-check` on a release candidate.
- At epic end when the epic targets a release.
- When entering or confirming maintenance mode after a release.

## Inputs
- Tickets for the epic, with lane, priority, and status.
- Verification records for every gate in the quality profile.
- Blockers (`blockers/`), changelog, and `safety.md`.

## Steps
1. **Run the full regression suite** at the verification phase — not just the changed-area tests.
2. **Run the full quality profile:**
   - Every gate states: its command, its pass condition, and when it runs.
   - A gate that cannot run in this environment is unverified — it needs explicit owner sign-off, not a silent skip.
3. **Check epic integration and environment:**
   - Epic integration checks must pass across the epic's tickets.
   - Reproduce the build from a clean checkout to validate environment assumptions.
4. **Verify Must tickets:**
   - Every Must-priority ticket is accepted. No unresolved human blockers remain on Must tickets.
5. **Prepare release documents:**
   - Release note (what changed, for whom), rollback note (how to revert safely), changelog entry (every release gets one).
6. **Gate on the owner:**
   - Present the readiness summary and request the owner's explicit go-ahead.
   - Maintenance entry requires: release record exists, rollback tested or documented, open blockers triaged.
7. **Deploy only if authorized:**
   - Never deploy unless the owner named a deploy command in `safety.md`; even then, deploy is a safe action needing approval each time.

## Checklist
- [ ] Full regression suite run and passing.
- [ ] Full quality profile run; every gate's command, pass condition, and timing recorded.
- [ ] Unrunnable gates flagged and owner-signed off.
- [ ] Epic integration checks pass; clean-checkout reproduction done.
- [ ] All Must tickets accepted; zero unresolved human blockers on Must tickets.
- [ ] Release note, rollback note, and changelog entry written.
- [ ] Owner's explicit go-ahead recorded.
- [ ] No deploy executed without approval, even with a deploy command in `safety.md`.

## Anti-Patterns
- Marking a gate green because "it usually passes".
- Skipping the clean-checkout reproduction because the dev machine builds fine.
- Treating the owner's earlier approval as covering this release.
- Deploying on your own initiative because the pipeline is "obviously safe".
- Shipping with a Should ticket's blocker silently open.

## "Stop and Ask the User If…"
- Any Must ticket is unaccepted or carries an unresolved human blocker.
- A gate cannot run and needs owner sign-off or a waiver.
- The rollback has never been tested and cannot be documented.
- A deploy command exists in `safety.md` and the owner wants it used (confirm each time).

## Next Skills
- retrospective
- verification-discipline
- incident-response

## Worked Example
Epic "auth-v1" targets v0.4.0. Agent runs the full suite (142 pass), then the quality profile: `lint` and `typecheck` gates pass; the `load-test` gate cannot run (no staging env) — flagged unverified, owner signs off. Clean checkout builds and tests green. All 5 Must tickets accepted; blocker `B-81ka-missing-api-credentials` was closed last epic. Agent writes release note, rollback note (`git revert v0.4.0-tag + config flag off`), changelog entry, then asks the owner: "Release v0.4.0 with load-test gate signed off — go?" Owner approves; no deploy, none named in `safety.md`.
