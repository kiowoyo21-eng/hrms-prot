# Batch 12 — Responsive Table Action Visibility (focused hotfix)

**Source baseline:** Batch 11 + Vercel import hotfix. **Status:** Applied source-level fix; full mobile browser QA pending.

## Problem and change

The shared legacy `.table-wrap` tables are wider than phone/tablet viewports. In most modules, the final Actions cell was only reachable by sideways scrolling. Tapping a record did not expose those hidden controls. On <=1024 px widths, shared table containers now pin *actual final-column action cells* to the right edge if a last cell contains a button or link. Tables whose last column is data-only are unchanged. No inline expansion is introduced. Actions retain original permission checks, click handlers and disabled states.

For **Assets & Devices**, the existing record detail modal additionally includes visible Assign, Continue Turnover, Request Return, Receive Return, Inspect, and Reinspect controls according to the selected asset's status and the user's editing permission. The desktop table controls remain available. Existing validation and physical return/inspection workflow are preserved.

## Scope / known limits

- CSS applies to tables under `.table-wrap`, `.leave-table-wrap`, `.gr-data-table`, and `.hrms-table-scroll` that have an actionable *last* cell.
- The Employee 201 mobile layout already uses compact employee cards and remains unchanged.
- A number of legacy/third-party table layouts use different wrappers or keep actions in non-final cells. These still require targeted review. This is **not** an all-modules mobile-browser sign-off.
- CSS prefers always-visible action cells over hidden action menus. A standardized per-row mobile “View / Actions” modal for every legacy table is **not yet implemented**.
- A modal detail click is not implied to authorize edits; only preexisting permission checks control action availability.
- This patch changes no records, persistence, role assignments, payroll/PSA data logic, or backend connections.

## QA

- TypeScript transpile syntax and PostCSS parse: passed.
- Focused source assertions (sticky selector and status-dependent Asset modal actions): passed.
- Existing PSA/Dashboard analytics tests: passed.
- Full Next.js production build and interactive phone/tablet browser QA: **not verified** in the available environment.
