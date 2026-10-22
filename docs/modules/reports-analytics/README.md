# Reports & Analytics, including Demographics

The main sidebar's **Reports & Analytics** groups two separate internal tabs (from Batch 01): Reports & Analytics and Demographics. Entry point: `components/GroupedWorkspace.tsx`. All legacy `filters` and `demographics` module navigation paths are retained.

- Reports: `components/ReportsLanding.tsx`, `ReportsWorkspace.tsx`, `ReportSpreadsheet.tsx`. Government reports are fictional preparation samples. Existing agency, period, search, branch, CSV, print/PDF and workbook actions remain.
- Demographics: `components/EmployeeDemographicsWorkspace.tsx`, `lib/employeeDemographics.ts`. Reads current branch-scoped Employee 201 data with effective-dated wage references; preserves classification editing for permitted HR users and CSV exports.
- Changes in Batch 02 are primarily compact, purpose-sized layout modifications in `app/globals.css` and `components/HROperationsExtras.module.css`.

No demographic or payroll calculation is fabricated and no wage-order reference has been updated as part of Batch 02 (that belongs to Batch 03).

## 2026-10-22 display/interaction corrections

Metric and breakdown cards plus employee reference listing rows now expose clickable, keyboard-accessible detail drilldowns with filtered actual Employee 201 demographics and pay-reference data; no invented history or salary releases.

See `../../revisions/batches/BATCH-05.md` for scope, remaining QA and operational caveats.
