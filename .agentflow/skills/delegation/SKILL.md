---
name: delegation
description: Use when claiming tickets via claims/ or when handing a ticket to a subagent, so two agents never edit the same file and results return as evidence.
version: 1.0.0
---

# Delegation

## Purpose
Coordinates work between the owner agent and subagents (or a second agent session) using file-based claims and manifests. Ensures single ownership of files, merge-safe branches, and evidence-backed results.

## When to Use
- Starting work on any ticket (claim it first).
- Handing subtasks to subagents or worker sessions.
- Multiple agents operate on the same repository.
- Resuming work after another agent paused.

## Inputs
- `.agentflow/claims/` (existing claim records).
- Active ticket with criteria and its approved manifest.
- Relevant decision records and project constraints.
- `.agentflow/safety.md` constraints, if present.

## Steps
1. **Claim before working:**
   - Write `claims/CL-<id>.md` with your agent name and lease expiry before touching any ticket.
   - Check `claims/` first: never work a ticket claimed by someone else or by an unexpired lease.
   - Refresh or re-claim when your own lease nears expiry.
2. **Respect the overlap rule:**
   - Two active manifests may not list the same file. Check other agents' active manifests before approving yours.
   - If overlap is unavoidable, coordinate: one waits, or the owner splits the ticket.
3. **Prepare subagent context packet:**
   - Include exactly: ticket id, acceptance criteria, manifest, relevant decisions, constraints, expected output.
   - Do not dump the full event log; subagents re-ground via `STATE.md` themselves.
4. **Bind subagent to the same rules:**
   - Subagents obey the same edit lock and manifest; no file outside `allowed_to_modify`.
   - One file per record: subagents write their own records, never edit shared ones in place — this keeps branches merge-safe.
5. **Collect results as events:**
   - Results return as evidence-carrying events in `events/`, with `evidence_refs` pointing at real output records.
   - Verify the manifest was honored before accepting the result.

## Checklist
- [ ] `claims/CL-<id>.md` written with agent name and lease expiry.
- [ ] No other agent's active claim or manifest overlaps your files.
- [ ] Subagent packet contains: ticket id, criteria, manifest, decisions, constraints, expected output.
- [ ] Subagent instructed on edit lock and manifest boundaries.
- [ ] Subagent results returned as events with evidence refs.
- [ ] Manifest honored (no files outside `allowed_to_modify`).

## Anti-Patterns
- Working a ticket whose claim lease belongs to another agent.
- Two manifests listing the same file simultaneously.
- Sending a subagent a vague prompt instead of a context packet.
- Letting subagents edit `STATE.md` or shared records directly.
- Accepting a subagent result without evidence refs.

## "Stop and Ask the User If…"
- Another agent holds an active claim on the only ticket that must proceed now.
- Manifest overlap cannot be resolved by splitting or sequencing.
- The subagent reports a failure whose evidence contradicts the manifest or criteria.
- Delegation would require editing policy files or skipping a gate.

## Next Skills
- session-handoff-resume
- verification-discipline
- reconciliation-basics

## Worked Example
Worker A writes `claims/CL-4mbv-login-ratelimit.md` (`actor: worker-a`, `lease: 20261115T120000Z`) then starts `T-x4kq-login`. Later it hands the test-writing subtask to worker B with a packet: ticket id, criteria, `manifests/M-…` (2 files), decision `D-k7we-use-postgresql`, constraint "no new dependencies", expected output "one test file + one event". Worker B claims its own lease, works inside the manifest, and returns event `step-edited` with `evidence_refs: [E-9x8a-pytest-run-output]`. A verifies and accepts.
