---
name: git-workflow
description: Use when a project uses git for change tracking, when committing ticket work, or when recording change evidence in a project without git.
version: 1.0.0
---

# Git Workflow

## Purpose
Git is OPTIONAL in Agentflow — the file records are the source of truth, git is an evidence aid. When git is present, each ticket lives on its own branch and merges to the main branch are performed by a human; when git is absent, recorded file paths and change notes serve as evidence instead.

## When to Use
- A ticket's work must be committed on a branch.
- A baseline is being recorded before implementation.
- `done` requires linking commits to the ticket.
- The project has no git repo and evidence must still be recorded.

## Inputs
- Baseline record (`baselines/`) with `repo_revision` and `tree_status`.
- Ticket ID and approved Edit Manifest.
- Owner policy on protected branches.

## Steps
1. **Initialize Git at Project Start (`/af-start`):** For new applications without a git repo, run `git init -b main`, verify `.gitignore` excludes `.env`/secrets/build outputs/`.agentflow/private/`, and establish an initial baseline commit (`HEAD`) before opening Ticket 1.
2. **Record the baseline:** At ticket start, capture `repo_revision` (commit SHA) and `tree_status` (`clean` or `dirty`) in the baseline record. Never start work from an unrecorded state.
2. **Create a branch per ticket:** Name it `ticket/<id>-slug`, e.g. `ticket/T-x4kq-login-flow`. One branch per ticket — no mixed-work branches.
3. **Commit with the ticket ID:** Every commit message includes the ticket id, e.g. `T-x4kq: add rate limiter to login endpoint`. Reference verification records where relevant.
4. **Link commits at done:** `done` requires the ticket to reference its commits (or file-path evidence if git is absent). Record them in the ticket notes and via `/af-log`.
5. **Never commit or push to the main branch:** Agents NEVER commit or push to the main branch — a human (or a protected-branch workflow) merges. Merge requests are prepared, not executed, by the agent.
6. **Commit what belongs:** project.md, policy files, `requirements/`, `decisions/`, `tickets/`, `manifests/`, `approvals/`, `reviews/`, `lessons/`, `glossary/`, `verifications/`, `events/`, `claims/`, `STATE.md` and derived indexes — rebuild derived files with `/af-rebuild` after merges.
7. **Gitignore what does not:** `private/` and large raw files under `evidence/`. Do not gitignore the record directories.
8. **No-git fallback:** Without git, record modified file paths, a change note describing what changed and why, and the ticket id in the ticket record. This is the evidence trail.
9. **Review before publishing:** Committed records can contain business-sensitive requirements — before pushing to a public repo, review `requirements/`, `decisions/`, and `evidence/` for confidential content.

## Checklist
- [ ] Baseline recorded with `repo_revision` and `tree_status` before work.
- [ ] Branch named `ticket/<id>-slug`; one branch per ticket.
- [ ] Every commit message includes the ticket id.
- [ ] Commits (or file-path change notes) linked at done.
- [ ] No agent commits or pushes to the main branch.
- [ ] `private/` and large raw `evidence/` gitignored; record directories committed.
- [ ] Derived indexes rebuilt with `/af-rebuild` after any merge.
- [ ] Public repos: `requirements/`, `decisions/`, `evidence/` reviewed for sensitive content.

## Anti-Patterns
- Committing straight to main "just this once" — never, even for trivial fixes.
- Bundling several tickets into one branch or one commit.
- Deleting or rewriting `.agentflow/` event history to clean up git history.
- Assuming the human will merge without a linked review record.
- Publishing requirements and decisions to a public repo without an owner review.

## "Stop and Ask the User If…"
- The tree is `dirty` at baseline and the stray changes are unexplained.
- The owner has not said who merges, and the ticket is ready.
- Work must be split across branches or tickets differently than planned.
- Pushing to any remote, especially a public one, is requested.

## Next Skills
- `independent-review`
- `code-review-self-check`
- `documentation`

## Worked Example
Ticket `T-x4kq-login-flow` starts on commit `a1b2c3d` with a clean tree — recorded in the baseline. The agent creates `ticket/T-x4kq-login-flow`, commits `T-x4kq: add login endpoint and rate limiter` and `T-x4kq: add auth tests (V-j8az)`. No-git fallback note exists for a parallel ticket on a machine without git: file paths plus a change note. The agent prepares a merge request, stops there, and tells the owner a human merge is required before `/af-done`.
