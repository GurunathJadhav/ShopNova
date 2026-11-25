---
name: frontend-and-ui-craft
description: Use when building or modifying any user-facing UI, component, page, or styling so the result is cohesive, responsive, polished, and verified in a live browser/runtime rather than bare unstyled boilerplate.
version: 1.0.0
---

# Frontend and UI Craft

## Purpose
Ensure AI agents ship user-facing applications that feel thoughtfully designed, cohesive, accessible, and bug-free in real usage — never raw browser-default HTML or half-styled boxes. Architectural leanness (`lean-architecture`) means avoiding unnecessary code abstractions, **never** cutting corners on visual design, UX clarity, or interaction polish.

## When to Use
- Creating or editing any frontend view, component, form, dashboard, or stylesheet.
- Reviewing a UI ticket before marking it verified or done.

## Standards (Non-Negotiable for UI Work)
1. **Design Tokens First:** Establish cohesive CSS variables / theme tokens before building components:
   - Background & elevated surface colors with clear contrast
   - Primary accent, secondary/muted text, subtle borders, semantic status colors (success, warning, danger)
   - Consistent typography scale, line-height, spacing rhythm (4px/8px grid), border radii, and subtle shadows
2. **Every State Designed:** Every data-driven or interactive component must style and handle:
   - **Default / populated** state with crisp alignment and truncation for long text
   - **Empty** state (helpful guidance + primary action, never blank space)
   - **Loading** and **error** states (clear feedback + retry/recovery path)
   - **Interactive states:** `:hover`, `:focus-visible`, `:active`, disabled, and invalid/validation feedback
3. **Input & Persistence Edge Cases:**
   - Guard empty/whitespace-only submissions, duplicates where relevant, rapid double-clicks, and failed storage/API calls.
   - Support keyboard navigation (`Enter` to submit, `Escape` to cancel/close, logical `Tab` order).
4. **Responsive Layout:** Must work cleanly at mobile (`~375px`) and desktop (`~1280px`) with zero horizontal overflow and comfortable touch/click targets (≥ 36px).
5. **Cohesive Component Slices:** Edit component markup, its styles, and its tests together as a single vertical slice — never ship unstyled markup "to style later".

## Live Runtime Verification (Mandatory Before Done)
Unit tests with mocked DOM are NOT sufficient for UI tickets. Before closing a UI slice:
1. Build and run tests + typecheck + lint.
2. Start or render the live app (dev/preview server or headless browser/DOM runner) and exercise the primary user flows end-to-end.
3. Confirm: **zero runtime console errors / uncaught exceptions**, visual elements render cleanly with styling applied, interactive controls respond, and persistence/state survives reload if applicable.

## Anti-Patterns
- Shipping unstyled `<input>` / `<button>` browser defaults because "styling wasn't an acceptance criterion."
- Writing inline throwaway styles everywhere instead of shared theme tokens.
- Relying solely on mocked unit tests while the real browser app crashes or renders broken layout.
- Splitting a single UI feature into tiny isolated 1-file edits that leave components half-wired.
