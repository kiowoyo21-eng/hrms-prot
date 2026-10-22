# Reports & Analytics change log

## 2026-10-22 — Batch 02 source changes (browser QA pending)

- Retained Batch 01's separate Demographics tab under Reports & Analytics.
- Consolidated report sample metrics, removed hard-coded illustrative-year KPI, and constrained report-card dimensions.
- Added consistent icons, denser metric rows and compact demographic breakdowns.
- Kept report/employee CSVs, government report sample export and print, wage reference filters, and Employee 201 classification controls.

Files: `components/ReportsLanding.tsx`, `components/EmployeeDemographicsWorkspace.tsx`, `components/HROperationsExtras.module.css`, `app/globals.css`.

## 2026-10-22 — Post-Batch-04 UI correction (Batch 05)

Metric and breakdown cards plus employee reference listing rows now expose clickable, keyboard-accessible detail drilldowns with filtered actual Employee 201 demographics and pay-reference data; no invented history or salary releases.

Affected source: `components/EmployeeDemographicsWorkspace.tsx`, `components/DashboardOverview.tsx`. **Source-level changes only; browser QA remains unverified.**

## 2026-10-22 — Batch 10, PSA Data Support (source implementation)

- Added an on-demand OWS/ISLE supporting dataset panel inside Reports & Analytics.
- Added filtered single-establishment record lists, explicit survey time windows, source/coverage warnings, searches, page controls, CSV/print actions, and missing-data status mapping.
- Added read-only dataset selectors and a focused test suite; no employee, payroll or incident stores or workflows were changed.
- The change is **not browser verified** and does not produce government-ready/certified questionnaire answers.
