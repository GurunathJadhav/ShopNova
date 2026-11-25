---
name: mobile
description: Use when the project is a mobile app (iOS, Android, or cross-platform) shipped to app stores.
version: 1.0.0
---

# Mobile Profile

Profiles are defaults and hints — they never override environment facts or approved decisions.

## Question Bank

Ask via `/af-ask` (max 5 per batch, blocking first). Recommended defaults included.

1. **Minimum OS versions?** Default: iOS n-2 major versions, Android API level covering ~95% active devices. Why: tradeoff between modern APIs and install base; blocking for build tooling.
2. **Offline behavior?** Default: read-only offline for previously loaded data; queue writes that are safe; block money/data-impacting writes offline. Why: mobile networks are unreliable by definition; blocking.
3. **Store submission plan?** Default: both stores, staged rollout via test-track first. Why: review processes gate every release; rollback after full rollout is painful.
4. **Auth approach?** Default: platform-native auth (secure keychain/keystore tokens, OS browser for OAuth — never a webview for logins). Why: webview OAuth is rejected by some stores and leaks credentials.
5. **Push notifications in scope?** Default: no, unless the requirement says so. Why: push adds backend, permissions, and store-review scope.
6. **Device coverage?** Default: smallest supported phone + one current phone; tablets unsupported unless required. Why: layout bugs cluster at extremes; unbounded matrices are unverifiable.
7. **Data storage?** Default: local encrypted DB with server as source of truth; sync deferred until a requirement forces it. Why: bidirectional sync is the single hardest mobile problem.
8. **Crash/telemetry reporting?** Default: crash reporting on, analytics off until required. Why: crashes are invisible without reports; analytics has consent implications.
9. **Update policy?** Default: force-update only for broken data writes or security; otherwise optional banners. Why: stores block instant rollbacks; broken-on-device apps cannot be hotfixed quickly.
10. **Platform split?** Default: shared codebase for UI/logic; native modules only where a capability demands it. Why: reduces dual-implementation drift.

## Default Non-Functional Requirements

Defaults only — the user may change any of them. Phrase each as a testable ticket criterion.

- **Cold start:** app interactive p95 < 3 s on the smallest supported device; p95 < 1.5 s on current hardware.
- **Network resilience:** airplane-mode toggle mid-flow never crashes the app or corrupts local state — verifiable by test script.
- **Offline:** all previously-viewed content readable offline; queued writes replay in order with dedupe (idempotency).
- **Battery/data:** no polling loops; background work scheduled via platform APIs, not raw timers.
- **Storage:** all tokens in keychain/keystore, never in plain prefs or logs (auth).
- **Accessibility:** platform accessibility labels on all tappable elements; Dynamic Type / font-scale up to 200% without truncation of primary text.
- **Crash rate:** < 1% of sessions across a release train.

## Test Strategy

- **Highest value:** unit tests for app logic and state, integration tests for the sync/storage layer against a real local DB, and instrumented UI tests for the 3–5 core journeys.
- **E2E:** one happy-path journey per core feature on each platform, run on emulators in CI; real devices only at the release gate.
- **Regression set:** all unit tests, storage/sync integration tests, core UI journeys on both platforms, crash-rate check against previous build.
- **Manual-check (mandatory on mobile):** airplane-mode flows, permission denials/re-grants, push to background and back, interrupted install, low-memory behavior. These cannot be trusted to automation.
- **Visual:** per-platform screenshots on both device extremes (smallest + current) before UI tickets are accepted.
- **User-confirmation:** store listing copy, push permission UX, whether flow feels right on a physical device.

## Typical Risks

| Risk | L | I | Mitigation |
|------|---|---|------------|
| Store review rejection late in release cycle | Medium | High | Test-track submission ahead of need; check store guidelines checklist per feature (payments, permissions, privacy). |
| Sync conflicts corrupt or duplicate user data | Medium | High | Server as source of truth; last-write-wins only with owner approval; conflict tests on integration layer. |
| Crash regression caught only by users | Medium | High | Crash reporting enabled pre-rollout; staged rollout with halt criteria. |
| Permission denial leaves app in broken state | Medium | Medium | Test every permission-gated flow with denial, re-grant, and "don't ask again". |
| Offline queue replays duplicate writes | Medium | High | Idempotency keys on queued writes; replay test in regression. |
| Layout broken on small/large devices | Medium | Low | Screenshot diffs on both device extremes for UI tickets. |
| Token stored insecurely | Low | High | Keychain/keystore policy enforced by checklist; security review on auth tickets. |

## Ticket Checklist

Add to feature tickets:

- [ ] Works in airplane mode or degrades gracefully; offline theme covered (offline).
- [ ] Loading, empty, error, and permission-denied states defined (empty states + errors).
- [ ] No data loss when app is killed at any step — background/foreground test run.
- [ ] Queued writes are idempotent on replay (idempotency).
- [ ] Accessibility labels and font-scale 200% verified (accessibility).
- [ ] Tokens and PII absent from logs and plain storage (auth + errors).

Add to release tickets:

- [ ] Cold-start budget met on smallest supported device (performance budget).
- [ ] Crash rate from previous train within target before next rollout.
- [ ] Store review notes, privacy labels, and screenshot set updated.
