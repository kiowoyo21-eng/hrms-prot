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

## 2026-10-22 — Revised UI / year-to-date follow-up (Batch 07)

- The Dashboard's active period is **current Manila year to date** (January 1 through today); former completed-month-only KPI behavior was replaced for hires, applied offboarding and reviewed gross salary releases.
- Total Employees, Male, Female remain branch-scoped **current** recorded Employee 201 headcounts.
- Eligible salary totals include only deduplicated ID / Browser Review / Released / Salary records, linked to in-scope employees, with nonnegative gross and dates up to today. No generated salary estimates or sample payslips included.
- Applied Offboard cases are the only available recorded separation-like events; they are not final legal terminations. Pending/future actions are excluded.
- The redundant Sample Activity section is removed from the Dashboard, not from the audit store.
- Additional HR Reports now shows **visible clickable** Employment Status, Basic Pay Rates and Compliance cards, not a collapsed/empty-looking wrapper. Report numbers are actual Employee 201 breakdowns; linked full views reside in their owning modules.
- App shell and Dashboard use aligned content margins and a responsive three-column main grid. Existing role/branch navigation is preserved.

See [Batch 07 revision](../../revisions/batches/BATCH-07-REVISED-UI.md) and [design system](../../architecture/UI-DESIGN-SYSTEM.md). Browser build/screenshot QA remains pending.

## Batch 09 — Actual record drill-downs (source-level)

Clickable **workforce KPI**, **people-movement position**, **Requests & Complaints** count, **My Workload** count, **Additional HR Report** and **Pending Actions by Module** cards now open a read-only **in-dashboard modal** with searchable, expandable actual source records rather than navigating to an unrelated analytics page. Totals and record lists share selectors in `lib/dashboardAnalytics.ts`; transformation models are in `lib/dashboardRecordViews.ts`; common dialog in `components/DashboardRecordsDialog.tsx` and `.module.css`.

Data provenance: live browser Employee 201 records for gender/headcount/hired, recorded applied offboarding events for separated, eligible unique/browser-reviewed Salary releases for gross YTD; filtered browser HR forms and incidents for requests/workload; pending actions are registry alerts published by modules, not their full databases. Report cards disclose configured basic-pay **rate units**, and Government Compliance details show masked identifier-presence only—not legal compliance verification. The selected branch and role rules are preserved. Quick Actions and explicit **Open ...** module buttons remain intentional navigation links, separate from drill-down data cards.

Search, pagination, row expansions, Esc/focus behaviour use the shared UI dialog primitives. UI is source-implemented, but full browser, payroll privacy and responsive interaction QA is still required.
