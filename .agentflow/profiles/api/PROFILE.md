---
name: api
description: Use when the project is an HTTP API service (REST, GraphQL, or RPC) consumed by other systems or clients.
version: 1.0.0
---

# API Profile

Profiles are defaults and hints — they never override environment facts or approved decisions.

## Question Bank

Ask via `/af-ask` (max 5 per batch, blocking first). Recommended defaults included.

1. **AuthN mechanism?** Default: delegated (JWT/OIDC from an existing identity provider). Why: hand-rolled auth is the highest-bug-risk area of any service. Blocking.
2. **AuthZ model?** Default: role- or scope-based checks enforced at a single middleware/handler layer, not per-code-site. Why: scattered authorization checks are unauditable.
3. **Versioning strategy?** Default: URL-prefix versioning (`/v1/`); additive changes within a version. Why: simplest for clients and routes; decides deprecation policy.
4. **Rate limiting?** Default: yes, per-client token bucket at the gateway or middleware; limits deferred to owner numbers. Why: unbounded public endpoints get abused; even internal APIs need backstop limits.
5. **Idempotency for mutating endpoints?** Default: require idempotency keys on POST endpoints that create money/data-impacting resources; safe-by-design for PUT/DELETE. Why: retries from clients and networks are guaranteed.
6. **Error format?** Default: single machine-readable error envelope (code, message, trace id) documented in one place. Why: clients build error handling once.
7. **Pagination style?** Default: cursor-based for list endpoints. Why: stable under concurrent writes; offset pagination drifts and is slow at depth.
8. **Contract source of truth?** Default: an OpenAPI/GraphQL schema file in-repo, generated types derived from it. Why: contract tests and client SDKs need a single source.
9. **Consumer expectations on downtime?** Default: assume zero-downtime deploys expected; ask owner to confirm. Why: determines migration and backward-compat requirements.
10. **Observability?** Default: structured logs with request IDs, health endpoint, basic latency/error metrics. Why: incidents are undebuggable without request correlation.
11. **Data migration policy?** Default: expand-and-contract (add nullable, backfill, then drop) — never destructive migrations in the same deploy as code changes. Why: enables rollback.
12. **Payload size limits?** Default: enforce documented request size caps (e.g. 1 MB). Why: protects against accidental or malicious large bodies.

## Default Non-Functional Requirements

Defaults only — the user may change any of them. Phrase each as a testable ticket criterion.

- **Latency:** p95 < 300 ms and p99 < 1 s for read endpoints under nominal load; writes p95 < 500 ms excluding external calls.
- **Error rate:** < 0.5% 5xx on healthy dependencies; 4xx responses must use the documented error envelope.
- **Uptime:** 99.9% monthly availability for read paths; graceful 503 with envelope for dependency outages, not hangs.
- **Timeouts:** every outbound call has an explicit timeout < 5 s; no unbounded waits.
- **Idempotency:** retrying any mutating request with the same idempotency key produces no duplicate side effects — verifiable by test.
- **Backwards compatibility:** within a major version, no removing or renaming fields, no new required request fields — verified by contract test.

## Test Strategy

- **Highest value:** contract tests (schema vs implementation) and integration tests against a real datastore; these catch the bugs users actually hit.
- **Unit:** domain logic, validation, auth rules. Keep pure and fast.
- **Integration:** one per endpoint covering success, auth failure, validation failure, and not-found — these four cases are the regression set minimum.
- **Contract:** run contract test in the regression set whenever the schema or handlers change.
- **Load:** automate only a small fixed-shape load test at the release gate (p95/p99 vs targets); not per-ticket.
- **E2E:** a single journey test crossing multiple endpoints (create → read → update → delete) as a release check.
- **Automated:** unit, integration, contract, error-envelope conformance, migration up/down.
- **Manual-check:** unusual client behaviors (huge payloads, malformed content types), gateway/infra routing.
- **User-confirmation:** rate-limit numbers, deprecation timelines, external SLA commitments.

## Typical Risks

| Risk | L | I | Mitigation |
|------|---|---|------------|
| Breaking change shipped inside a major version | Medium | High | Contract tests in regression; expand-and-contract migrations; version review in `/af-diff-check`. |
| Missing authz check on a new endpoint | Medium | High | AuthZ enforced in one middleware layer; checklist requires authorization evidence per new route. |
| Duplicate side effects from client retries | Medium | High | Idempotency keys on risky POSTs; retry test in integration set. |
| Unbounded queries slow down at data growth | Medium | Medium | Pagination mandatory on list endpoints; p95 latency budget in regression. |
| Migration rollback leaves inconsistent schema | Low | High | Expand-and-contract policy; migrations tested up and down before deploy. |
| Error responses leak internals (stack traces, SQL) | Medium | Medium | Single error envelope with allowlisted fields; no raw exception passthrough. |
| Dependency outage cascades into hangs | Medium | Medium | Explicit timeouts + circuit breaker on every outbound call. |

## Ticket Checklist

Add to new-endpoint tickets:

- [ ] AuthN and AuthZ verified: unauthenticated, wrong-role, and valid-role cases all tested (auth).
- [ ] Success, validation-failure, not-found, and auth-failure responses return the documented envelope (errors).
- [ ] List endpoints paginate with a documented cursor contract.
- [ ] New request fields are optional or versioned (backwards compatibility).
- [ ] Idempotency behavior documented and tested for mutating endpoints (idempotency).
- [ ] Latency budget checked under nominal fixture data volume (performance budget).

Add to schema/migration tickets:

- [ ] Migration is expand-and-contract; down path tested.
- [ ] Contract test updated and passing before merge.

Add to all API tickets:

- [ ] No secrets or tokens in logs (errors + auth theme); log entries carry a request ID.
