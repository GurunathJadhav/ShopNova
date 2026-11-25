---
name: anti-hallucination-verification
description: Use whenever making factual claims about code, the environment, or external APIs, and before using any library, API, flag, or config key.
version: 1.0.0
---

# Anti-Hallucination Verification

## Purpose
Prevent invented facts from entering the codebase. Every factual statement about code, environment, or external APIs carries a mandatory confidence label, and every external dependency is verified against a real source before use.

## When to Use
- Writing ticket notes, review findings, or any claim about how the code works.
- Before importing a library, calling an API, using a CLI flag, or reading a config key.
- Promoting `inferred` or `unknown` claims to `verified` with `/af-label`.
- Writing STATE.md or preparing a handoff.

## Inputs
- Edit Manifest and lockfile (source of truth for installed versions).
- Installed package docs, official docs, or a runnable check.
- Existing claims (`claims/CL-<id>.md`) and environment records (`environment/`).

## Steps
1. **Label every factual claim:** `verified` (with an evidence ref), `inferred` (basis stated), or `unknown`. Unlabelled statements count as `inferred` — silence is not neutrality.
2. **Promote before relying:** A claim labelled `inferred` or `unknown` cannot justify an edit, a dependency, or `done`. Promote it with `/af-label` — creating `claims/CL-<id>.md` with `label: verified` and an evidence ref — or drop the claim.
3. **Verify-before-use:** Before using any library, API, flag, or config key, check in order: (a) the manifest or lockfile, (b) installed docs, (c) official docs, (d) a runnable check (a one-liner that proves it works).
4. **Record the check:** Write `verifications/V-<id>.md` with `method: manual` or `audit`, the exact command or source consulted, and `result: pass`.
5. **Follow the unknown protocol:** When you don't know something: say so explicitly, look it up via steps 3–4, or ask the user. NEVER invent a plausible answer. "I don't know" is always an acceptable state.
6. **Surface unknowns in STATE.md and handoffs:** List open unknowns so the next agent resolves them first instead of tripping over them. An unknown passed silently is a landmine.
7. **Trust only re-run commands:** A test output pasted into a conversation is not evidence. Re-run the command yourself or mark the criterion `unverified`.
8. **Red before green:** A test that has never been seen failing is not evidence of anything. Confirm it fails for the right reason, then passes.

## Checklist
- [ ] Every factual statement labelled `verified`, `inferred`, or `unknown`.
- [ ] No edit, dependency, or done justified by an unlabelled or `inferred` claim.
- [ ] Every new library/API/flag/config key checked via manifest, lockfile, docs, or runnable check.
- [ ] Checks recorded in `verifications/V-<id>.md`.
- [ ] Unknowns stated openly, not papered over.
- [ ] STATE.md and handoffs list open unknowns.
- [ ] Every command output re-run locally, not trusted from pasted text.
- [ ] New tests observed failing (red) before passing (green).

## Anti-Patterns
- "I'm pretty sure this library has that function" without checking the lockfile or docs.
- Treating an LLM's training-data memory of an API as a verified source.
- Label stacking: marking a claim `verified` because it was verified once, long ago, in a changed environment.
- Skipping the red phase and writing a test that passes on the first run.
- Hiding unknowns in a handoff to avoid looking uncertain.

## "Stop and Ask the User If…"
- A required fact is `unknown` and lookup failed (which docs, which environment?).
- Using the feature requires a dependency not in the manifest.
- Docs, lockfile, and runtime behaviour contradict each other.
- An `unknown` blocks a Must ticket and only the owner can rule.

## Next Skills
- `code-review-self-check`
- `independent-review`
- `error-handling-and-logging`

## Worked Example
The agent wants to use `bcrypt.hashpw()` for ticket `T-x4kq-login-flow`. It checks `requirements.txt` (bcrypt 4.1.2 pinned — `verified`), runs `python -c "import bcrypt; bcrypt.hashpw(b'x', bcrypt.gensalt())"` as a runnable check, and records `V-j8az-bcrypt-api-check` with `method: manual, result: pass`. The claim "hashing costs ~100ms" stays `inferred` (basis: docs, no benchmark) and cannot justify done until promoted via `/af-label`. It lists "unknown: prod bcrypt cost limit" in STATE.md and asks the owner.
