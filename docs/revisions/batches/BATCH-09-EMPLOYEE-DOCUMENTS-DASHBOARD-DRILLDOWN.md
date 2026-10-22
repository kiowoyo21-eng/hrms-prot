# HRMS Batch 09 — Employee 201 Documents & Dashboard Actual Records

Status: **implemented in source, not runtime-verified** · 2026-10-22.

### DOC9-01 · Employee 201 Personal Information

- Source paths: `components/EmployeeWorkspace.tsx`, `app/hrms-migration.css`.
- Show the preexisting `person.documents` checklist with `Missing`/`Submitted`/`Verified` counts and row badges.
- Preserve the independent `data.submissions` HR review status, filename, reason and reference. Missing submission references remain clearly identified; recorded extra submissions stay visible.
- Provide `View / Manage Documents` linking to the existing Employee 201 Documents → Onboarding Files view.
- No auto-verification, new persistent attachments, record editing, or field migration.

### DASH9-01 · Dashboard source-data drill-down

- Existing paths: `components/DashboardOverview.tsx`, `components/DashboardOverview.module.css`, `components/DashboardExtras.tsx`, `components/ModuleAlerts.tsx`, `lib/dashboardAnalytics.ts`.
- New paths: `lib/dashboardRecordViews.ts`, `components/DashboardRecordsDialog.tsx`, `components/DashboardRecordsDialog.module.css`.
- Source-aligned searchable/detailable views for headcount, genders, YTD hires, applied separations, unique eligible YTD gross releases, requests/incidents, workload metrics, current employee employment status, configured pay rates, masked identifier presence and published module alerts.
- Add pagination (15 records), per-record detail expansion and Esc/close behavior via existing shared dialog. Explicit Quick Actions remain navigational.
- Source lists and displayed totals share `dashboardEmployeeRecords` and `dashboardRequestRecords`; no new storage or backend calls.
- Restricted statutory identifiers are *never* shown; payroll gross release details remain HR-only.

### Validation and caveats

- `scripts/check-dashboard-ytd.cjs`, `scripts/check-dashboard-drilldowns.cjs`: targeted unit/smoke assertions for branch/role/date, count parity, unique payroll releases, sample exclusion, read-only detail row wiring.
- TypeScript parser, relative path resolver, PostCSS and local documentation links checked separately.
- Full Next.js build and browser interaction/accessibility checks unavailable without dependencies; source behavior must not be called production-verified.
- Final Payroll/cross-system integrations remain unconnected and out of scope.
