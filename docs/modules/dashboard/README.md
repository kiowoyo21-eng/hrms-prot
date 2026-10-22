# Dashboard module

Implementation: `app/page.tsx`, `components/DashboardOverview.tsx`, `components/DashboardOverview.module.css`, `components/DashboardExtras.tsx`, `components/ModuleAlerts.tsx`.

Data source: `lib/dashboardAnalytics.ts` (Employee 201/current branch, applied offboarding, browser-reviewed salary releases); `lib/moduleAlertViews.ts` for pending alerts, plus `lib/hrForms.ts` and `lib/incidentRecords.ts` for request summaries.

- Dashboard header follows the topbar's branch picker; period is the last completed month (Manila timezone).
- Cards report headcount, recorded gender, monthly hires and applied separations, and actual reviewed gross salary releases (no salary estimate).
- Workload/request counts are local to visible records and current role/branch.
- Pending Actions shows only actual published pending alerts for allowed modules; urgency is sourced from alert level, not inferred from headcount.
- Actions navigate through the app's existing module routing. Report summary selector is retained in a collapsible section to avoid duplicating primary metrics.

No production authentication, live Accounting releases, secure server storage or real-time alerts are implied.

## 2026-10-22 display/interaction corrections

Removed narrow fixed three-card columns, aligned workforce and movement cards to a common 3-column grid, and made metric cards navigate to source modules.

See `../../revisions/batches/BATCH-05.md` for scope, remaining QA and operational caveats.

## 2026-10-22 Dashboard-only alignment pass (Batch 06)

- Dashboard components share one centered, bounded `.dashboard-home` content grid
  rather than different widths for KPI sections versus Quick Actions/alerts.
- Action alerts are placed before shortcuts to surface actual pending work earlier.
- Quick Actions remain functional but are presented as compact wrapping action chips;
  the report selector and existing illustrative activity remain available in collapsible sections.
- Salary provenance note is shorter with the same exclusion and non-Accounting caveats.
- Data selectors, metric calculations, roles, demo storage, module navigation and
  other module layouts are **unchanged**.
- Browser/responsive validation is required before marking this visual change verified.
