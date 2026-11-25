---
name: af-build
description: Generate a clean zero-pollution BUILD-BRIEF.md and copy-pasteable fresh-session build loop prompt once planning is done
phase: planning, implementation, maintenance, any
tier: 0
actor: both
core: false
---

# /af-build — Clean-Context Build Brief & Loop Launcher

## Purpose
Prevents **context pollution** after discovery, requirements, tickets, and planning. Instead of forcing an agent to carry noisy Q&A history into coding, `/af-build` distills all approved requirements, design/stack decisions, environment commands, and remaining tickets into a compact `.agentflow/BUILD-BRIEF.md` (<1,000 tokens) and produces a **ready-to-paste build loop prompt** (`.agentflow/BUILD-PROMPT.txt`) for starting a brand-new clean agent session.

## Preconditions
- [ ] `.agentflow/` exists with `STATE.md` and `project.md`.
- [ ] Discovery, requirements, and tickets exist (typically run right as Planning advances to Implementation, or between ticket batches).
- [ ] No unverified edits left dangling in `STATE.md` (`unverified_step: none`).

## Steps
1. **Generate Clean Build Context (Tier 1/2):**
   - Run `node .agentflow/build.js` (or `agentflow build . --batch=2`).
   - This writes:
     - `.agentflow/BUILD-BRIEF.md` — distilled goal, mode, requirements, ADRs, verified test/build/smoke commands, and MVP-ordered ticket queue.
     - `.agentflow/BUILD-PROMPT.txt` — ready-to-paste fresh-session loop instructions.
   - *(Tier 0 chat-only fallback: write `.agentflow/BUILD-BRIEF.md` directly using `clean-context-build-loop/SKILL.md` and output the loop prompt block in chat.)*
2. **Present the New-Session Build Command & Loop Prompt:**
   - Tell the owner clearly:
     - **"Context checkpoint ready — open a NEW clean chat session (to avoid discovery context pollution) and paste the build loop prompt below (also saved in `.agentflow/BUILD-PROMPT.txt`)."**
   - Print the generated loop prompt verbatim in a copyable fenced block, along with the CLI command `node .agentflow/build.js` for rotating between batches.
3. **Update `STATE.md`:**
   - Ensure `next_action` points to starting the next ready ticket using `.agentflow/BUILD-BRIEF.md`.

## Postconditions
- [ ] `.agentflow/BUILD-BRIEF.md` created/refreshed cleanly (<1,000 tokens).
- [ ] `.agentflow/BUILD-PROMPT.txt` created/refreshed with concrete next-batch ticket IDs.
- [ ] Owner given exact command/prompt to start coding in a fresh clean session.

## Next
- **Owner opens fresh session & pastes prompt:** Agent runs the build loop (`edit-plan → start-ticket → build slice → /af-verify + live smoke → report.js → /af-done → build.js`).
- **Batch completes:** Re-run `/af-build` (`node .agentflow/build.js`) and rotate to a fresh session for the next batch.

## Footer Template
`Done: generated BUILD-BRIEF.md & BUILD-PROMPT.txt (<pending> tickets ready) | Logged: none (derived context brief) | Next: open a new clean session and paste the build loop prompt | Needs you: paste the prompt into a fresh session to start building cleanly`
