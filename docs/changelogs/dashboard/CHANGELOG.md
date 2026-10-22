# Dashboard change log

## 2026-10-22 — Batch 02 source changes (browser QA pending)

- Removed duplicate branch/headcount line above dashboard.
- Replaced decorative dashboard hero with compact header, selected branch context and completed-month label.
- Refactored workforce KPIs and movement/request panels into controlled, consistent icons/cards without arbitrary spans/heights.
- Simplified Quick Actions and retained the earlier report selector as a collapsible details section.
- Reworked Pending Actions by Module into actionable, urgency-first cards based on published alert records, preserving role/branch filters.

Files: `app/page.tsx`, `components/DashboardOverview.tsx`, `components/DashboardOverview.module.css`, `components/DashboardExtras.tsx`, `components/ModuleAlerts.tsx`, `app/globals.css`.

## 2026-10-22 — Post-Batch-04 UI correction (Batch 05)

Removed narrow fixed three-card columns, aligned workforce and movement cards to a common 3-column grid, and made metric cards navigate to source modules.

Affected source: `components/DashboardOverview.tsx`, `components/DashboardOverview.module.css`. **Source-level changes only; browser QA remains unverified.**

## 2026-10-22 — Dashboard-only spacing/alignment correction (Batch 06; runtime QA pending)

- Wrapped dashboard metrics, pending alerts, quick links, optional reports and
  demo activity under one max-width-centered dashboard container.
- Moved Pending Actions ahead of shortcuts without altering alert computation.
- Removed the giant Quick Actions wrapper and collapsed illustrative demo activity
  by default while retaining all actions, navigation and content.
- Condensed the salary disclosure without changing the underlying computation.

Files: `app/page.tsx`, `app/globals.css`, `components/DashboardOverview.tsx`.
Static inspection is not browser verification.

## 2026-10-22 — Revised UI and year-to-date data (Batch 07, browser QA pending)

- Changed `Hired this period` and `Separated this period` to year-to-date measures (Jan 1–today Manila time); retained source-based offboarding caveat.
- Changed Gross Salary Released from last completed month to eligible reviewed gross payroll releases year to date, still excluding sample and unreviewed releases.
- Replaced collapsed Additional HR Report summaries with three visible clickable, compact report cards.
- Removed Sample Activity (Demo) from Dashboard without deleting underlying audit events.
- Updated page/section alignment, spacing and shared Dashboard appearance according to the revised UI/UX design document.

Actual sources: `components/DashboardOverview.tsx`, `components/DashboardOverview.module.css`, `components/DashboardExtras.tsx`, `components/DashboardExtras.module.css`, `lib/dashboardAnalytics.ts`, `app/page.tsx`, `app/ui.css`. Full Next.js build and browser tests not verified.

Focused, rerunnable YTD calculation checks: `scripts/check-dashboard-ytd.cjs` (Node + project TypeScript dev dependency).
