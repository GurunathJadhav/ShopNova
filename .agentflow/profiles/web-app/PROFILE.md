---
name: web-app
description: Use when the project is a browser-based web application (SPA, SSR, or hybrid) with a user-facing UI.
version: 1.0.0
---

# Web-App Profile

Profiles are defaults and hints — they never override environment facts or approved decisions.

## Question Bank

Ask via `/af-ask` (max 5 per batch, blocking first). Recommended defaults included.

1. **SPA vs SSR/SSG vs hybrid?** Default: SPA for internal tools, SSR for public/consumer pages. Why: SEO and first-paint requirements usually decide this, not taste. Blocking.
2. **Hosting target?** Default: static CDN (e.g. managed static hosting) for SPA; container platform for SSR. Why: hosting changes the done-definition (headers, env vars, caching) and rollback procedure.
3. **Auth approach?** Default: delegated session-based auth via existing identity provider if one exists; otherwise session cookies + server sessions. Why: avoid building custom auth; tokens in `localStorage` are XSS-risky.
4. **Accessibility target?** Default: WCAG 2.1 AA. Why: legal floor in most jurisdictions and a concrete testable bar.
5. **Browser support matrix?** Default: last 2 versions of major evergreen browsers, no IE. Why: prevents silent edge-case bug reports later; determines whether transpilation/polyfills are needed.
6. **Responsive breakpoints?** Default: mobile-first, single breakpoint at ~768px plus desktop. Why: most traffic is mobile; fewer breakpoints = less CSS to verify.
7. **State management?** Default: server state via query/cache library, minimal local state; no global store unless cross-page shared mutable state exists. Why: prevents over-engineering.
8. **Design & styling approach?** Default: Cohesive design system (CSS tokens/variables or utility/component library) with intentional typography, spacing, light/dark surface contrast, responsive layout, and full interactive/empty/error states — **never raw browser-default unstyled HTML**. Why: UI polish must be designed into slice 1, not bolted on at the end.
9. **i18n needed now?** Default: no, but keep all user-visible strings in one module. Why: retrofitting string extraction is expensive; doing i18n itself before it is required is scope creep.
10. **Analytics/tracking?** Default: none without an explicit requirement. Why: tracking is often legally regulated and adds consent-handling scope.
11. **Error reporting?** Default: client error boundary + console capture; add a hosted error service only if the owner confirms. Why: silent client crashes are invisible to server logs.
12. **API ownership?** Default: the app consumes an API owned elsewhere — confirm who owns endpoints. Why: determines whether contract tests or mocks are needed.

## Default Non-Functional Requirements

Defaults only — the user may change any of them. Phrase each as a testable ticket criterion.

- **First load:** Largest Contentful Paint p95 < 3.0 s on a throttled 4G connection; initial JS bundle < 300 KB gzipped.
- **Interaction:** interaction-to-next-update p95 < 500 ms for common actions (list filter, tab switch).
- **Accessibility:** WCAG 2.1 AA — keyboard-navigable on every screen, visible focus, labels on all form controls, contrast ratio ≥ 4.5:1. Verifiable by axe scan with zero critical violations.
- **Error rate:** client JS error rate < 1% of sessions; every error boundary shows a recoverable message, never a blank screen.
- **Empty states:** every data-dependent view defines its empty state (no results, first use, offline) — a view without one is not done.
- **Uptime:** not owned by the web-app tier unless it also serves SSR; if SSR, p95 TTFB < 800 ms.

## Test Strategy

- **Highest value:** unit tests for pure logic (form validation, state reducers), component/integration tests for interactive views, and accessibility scans per view.
- **Contract:** if the app consumes a owned API, keep generated types or contract fixtures in sync; otherwise use mocked fixtures pinned to a real payload snapshot.
- **Visual & live runtime smoke check:** **mandatory per UI ticket** — start/build the app and verify rendered layout, CSS styling loaded, zero console/runtime errors, interactive controls work, and mobile/desktop widths don't overflow (automate via Playwright/browser check when available).
- **E2E:** automate happy-path journeys for critical user flows (core CRUD/actions, persistence/reload, error handling). Cap at ~5–8 journeys.
- **Regression set:** unit + component tests, build + typecheck + lint, live smoke check, and accessibility check on touched views.
- **Automated:** unit, component, build, E2E/live DOM smoke check, console-error assertion, bundle-size budget check.
- **Manual-check:** final aesthetic check on odd screen sizes and screen-reader walkthrough.
- **User-confirmation:** look-and-feel against design, copy wording, accessibility beyond the automated bar (screen reader flow).

## Typical Risks

| Risk | L | I | Mitigation |
|------|---|---|------------|
| Silent client-side errors in production | High | High | Error boundary + client error capture from ticket one; monitor error count per release. |
| Accessibility regressions during fast UI iteration | Medium | High | Axe scan in regression set; keyboard-only pass before accepting UI tickets. |
| Bundle size creep | Medium | Medium | Bundle-size budget check in CI; fail ticket if budget exceeded without waiver. |
| API contract drift between client and backend | Medium | High | Contract fixtures or generated types owned in one place; contract test in regression. |
| Broken states loading/empty/error untested | Medium | Medium | Checklist requires all three states per view; test fixtures for each. |
| Browser-specific layout bugs found late | Medium | Low | Pin support matrix early; responsive manual smoke before release gate. |
| Auth/session bugs from token storage choices | Low | High | Prefer delegated auth; security review on any custom auth code. |

## Ticket Checklist

Add to UI tickets (pair with `.agentflow/skills/frontend-and-ui-craft/SKILL.md`):

- [ ] Cohesive visual polish applied (design tokens, spacing, typography, hover/focus-visible/active/disabled states — no unstyled defaults).
- [ ] Empty, loading, and error states designed, implemented, and tested.
- [ ] Keyboard navigation (`Enter`, `Escape`, `Tab`) and visible focus verified.
- [ ] Responsive with zero horizontal overflow at mobile (~375px) and desktop (~1280px).
- [ ] Live runtime smoke check passed (app renders cleanly, zero console/uncaught errors, state/persistence verified).

Add to auth-related tickets:

- [ ] Session handling verified: login, expiry, refresh, logout, and invalid-session redirect.
- [ ] Sensitive data never written to `localStorage`/logs (auth + errors theme).
- [ ] Errors from failed auth never leak which accounts exist.

Add to data-display tickets:

- [ ] Long-string and zero-data fixtures tested (overflow, truncation, empty states).
