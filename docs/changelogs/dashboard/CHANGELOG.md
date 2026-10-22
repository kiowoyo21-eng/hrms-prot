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
