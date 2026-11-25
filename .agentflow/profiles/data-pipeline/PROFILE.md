---
name: data-pipeline
description: Use when the project is a data pipeline or ETL/ELT workflow that moves, transforms, or aggregates data.
version: 1.0.0
---

# Data-Pipeline Profile

Profiles are defaults and hints — they never override environment facts or approved decisions.

## Question Bank

Ask via `/af-ask` (max 5 per batch, blocking first). Recommended defaults included.

1. **Volume?** Default: size the design for 10× current volume; confirm current and expected daily row/byte counts. Why: determines batching, partitioning, and cost. Blocking.
2. **Freshness/SLA?** Default: data available within 24 h of source close; blocking asks owner for the real number. Why: freshness decides batch vs streaming and alerting thresholds. Blocking.
3. **Retry policy?** Default: idempotent steps, automatic retry with exponential backoff (3 attempts); a failed step re-runs from its last checkpoint, not from zero. Why: transient source failures are routine, not exceptional.
4. **Backfill support?** Default: yes — any period can be reprocessed deterministically without manual cleanup. Why: the day you need a backfill is the worst day to build one. Blocking.
5. **Late-arriving data?** Default: late data within the SLA window is merged; later data requires explicit repair run. Why: defines correctness semantics for windows.
6. **Schema drift handling?** Default: additive source changes are tolerated; breaking changes fail loudly and alert, never silently coerce. Why: silent coercion corrupts data quietly.
7. **Data quality checks?** Default: row counts, null ratios, and uniqueness on keys checked per run; failures block downstream. Why: bad data propagates to every consumer otherwise.
8. **Downstream consumers?** Default: confirm who reads the output and in what form. Why: output shape changes are contract changes. Blocking.
9. **Secrets/source credentials?** Default: injected via environment/secret store, never in code or config files. Why: pipelines leak credentials constantly through logs.
10. **Cost ceiling?** Default: ask for a monthly cost budget; alert at 80%. Why: runaway pipelines usually surface as a bill, not a bug report.
11. **Orchestrator?** Default: whatever exists in the environment; if greenfield, prefer the platform the user already runs. Why: adding a scheduler is a one-way decision.

## Default Non-Functional Requirements

Defaults only — the user may change any of them. Phrase each as a testable ticket criterion.

- **Freshness:** output ready by the SLA time on 99% of days; misses trigger an alert, not a silent slip.
- **Latency:** a single standard day's run completes in < 30 min on nominal volume.
- **Idempotency:** running any step twice for the same period produces byte-identical output (or explicitly-deduped output) — verifiable by test with a fixture.
- **Backfill:** reprocessing any past 7-day window completes without manual intervention and matches the original output within documented tolerance.
- **Quality gates:** null-count, row-count, and uniqueness checks pass before data is marked available; failures quarantine, never publish.
- **Error visibility:** every failed run produces an alert with the failing step and input period; no step can fail without an event.

## Test Strategy

- **Highest value:** unit tests of transformation logic on small deterministic fixtures, and integration tests running the full pipeline on a small synthetic dataset end-to-end.
- **Fixtures:** golden input/output pairs per transformation; changes to output require deliberate golden-file updates (never auto-accepted).
- **Property checks (where practical):** transformations are pure functions of inputs; property tests for ordering, dedupe, and null handling beat hand-written cases.
- **Idempotency tests:** run the pipeline twice on the same fixture; assert identical output. Include in regression for any step touched.
- **Backfill test:** run a two-period backfill on fixtures after any scheduling/watermark change.
- **Load/volume:** not per ticket; run a volume test at release gate and after volume requirements change.
- **Regression set:** unit tests, golden-file transformation tests, end-to-end small-dataset run, idempotency double-run, quality-check conformance.
- **Automated:** everything above; also lint/validate DAG/flow definitions.
- **Manual-check:** source data semantics (does the column really mean that), first real backfill in staging.
- **User-confirmation:** freshness SLA, quality-check thresholds, tolerance for known source dirty data.

## Typical Risks

| Risk | L | I | Mitigation |
|------|---|---|------------|
| Silent schema drift produces wrong data for weeks | High | High | Fail-loud drift checks; quality gates block publication; alert on failure. |
| Non-idempotent step duplicates or doubles counts after retry | Medium | High | Idempotency double-run test in regression; checkpoint-based retries. |
| Backfill needed but impossible without manual surgery | Medium | High | Backfill capability designed in from ticket one; tested on fixtures. |
| Freshness SLA missed without anyone noticing | Medium | Medium | Freshness monitor with alert; SLA tracked per run. |
| Runaway compute/storage cost | Medium | Medium | Cost budget with 80% alert; partitioning and pruning reviewed in design. |
| Bad data published and consumed downstream | Medium | High | Quarantine-then-publish model; quality gates are blocking. |
| Secrets leaked in logs during failure dumps | Medium | High | Credential injection, log redaction; security review on source tickets. |

## Ticket Checklist

Add to transformation-step tickets:

- [ ] Step is idempotent — double-run test passes on fixture (idempotency).
- [ ] Golden input/output fixtures updated deliberately and reviewed.
- [ ] Handles nulls, empty inputs, and out-of-order records explicitly (empty states + errors).
- [ ] Schema-drift behavior defined: tolerate additive, fail on breaking (errors).
- [ ] Retry-with-backoff configured; failure surfaces an alert with step and period.

Add to pipeline/schedule tickets:

- [ ] Backfill of any past period supported without manual cleanup (backfill).
- [ ] Freshness and quality checks registered and blocking (SLA).
- [ ] Credentials never logged or written to output (auth + errors).

Add to all pipeline tickets:

- [ ] New outputs announced to downstream consumers before shape change (backwards compatibility of the data contract).
