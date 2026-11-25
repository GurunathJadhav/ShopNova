---
name: api-and-data-design
description: Use when a ticket's implementation will create or change a public API surface or data model, so the contract is designed and recorded before code.
version: 1.0.0
---

# API and Data Design

## Purpose
Design the interface contract and data model before code, record them as decision records, and keep them minimal. Public APIs and data models are one-way doors: they get an explicit decision `D-<id>.md` before implementation.

## When to Use
- A ticket will add or change an endpoint, module boundary, or schema.
- Two tickets must agree on a shared interface.
- A migration is implied by a data model change.

## Inputs
- The ticket `tickets/T-<id>.md` calling for the design (or a profile requiring design docs).
- Acceptance criteria and NFR criteria attached to that ticket.
- Existing decisions `D-<id>.md` and prior interface contracts.

## Steps
1. **Confirm a design is actually called for:** the ticket or profile requests it. No speculative design docs.
2. **State the problem** in one paragraph: what the ticket's criteria demand from the interface or data model.
3. **Design the simplest thing that meets the criteria (YAGNI):**
   - No endpoints, fields, tables, or abstractions without a criterion or named near-term consumer.
   - Prefer boring, standard shapes; avoid frameworks-of-the-week.
4. **Write the contract** explicitly: inputs, outputs, error cases, and types. For a data model: entities, fields, types, relations, constraints.
5. **Record the decision:** create `decisions/D-<id>.md` with `decision_type: one-way` if it is a public API or data model change (hard to reverse), `two-way` for internal choices. Include alternatives considered and why rejected.
6. **Migration and rollback:** for any data model change, note the migration path (how existing data moves) and the rollback path (how to undo without data loss). If rollback is impossible, say so explicitly — that raises the decision's weight.
7. **Check against criteria:** walk each ticket criterion and confirm the design can satisfy it with a declared verification method. Any gap means the design is not done.
8. **Then implement** in the ticket flow; the decision record is the contract later code must obey. Changing it mid-implementation requires `/af-change` and a superseding decision.

## Checklist
- [ ] Design triggered by a ticket or profile, not by curiosity.
- [ ] Contract states inputs, outputs, errors, and types explicitly.
- [ ] Every element traces to a criterion or named consumer — no speculative surface.
- [ ] `D-<id>.md` exists with `decision_type` set and alternatives noted.
- [ ] Migration and rollback documented for every data model change.
- [ ] All ticket criteria are satisfiable under the design.

## Anti-Patterns
- Designing "for later" — fields and endpoints with no current consumer.
- Changing a public contract silently during implementation instead of superseding the decision.
- Generic repositories, plugin systems, or config layers added "for flexibility".
- Treating a schema change as a two-way decision because the migration "should be easy".
- Writing the design doc after the code exists and calling it a design.

## "Stop and Ask the User If…"
- The design would break an existing public contract used by others.
- Rollback for a data migration is impossible and the change is risky.
- Two competing designs meet the criteria and the trade-off is a product call (e.g., cost vs latency).
- The contract depends on an external API whose version or limits are unknown.
- The design implies new scope beyond the ticket's REQ link.

## Next Skills
- ticket-breakdown
- user-story-writing
- requirements-elicitation

## Worked Example
Ticket T-c3d4-add-plant demands persistence and validation.
Design: single `plants` table — `id` (uuid), `name` (string, non-empty), `watering_interval_days` (int 1-90), `last_watered` (date, nullable). No photo column — no criterion needs one.
Contract: `createPlant(input) -> {id}`; errors: invalid name (400-equivalent), interval out of range.
Decision D-m3n4-plants-schema, `decision_type: one-way` (schema change), alternatives: JSON file store (rejected — no relational filter for overdue queries), full ORM (rejected — YAGNI for one table).
Migration: create table; rollback: drop table (no pre-existing data, loss-free).
Criteria check: list and overdue-query criteria both satisfiable; automated-test method declared per ticket.
