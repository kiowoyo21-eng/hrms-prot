# Reports & Analytics, including Demographics

The main sidebar's **Reports & Analytics** groups two separate internal tabs (from Batch 01): Reports & Analytics and Demographics. Entry point: `components/GroupedWorkspace.tsx`. All legacy `filters` and `demographics` module navigation paths are retained.

- Reports: `components/ReportsLanding.tsx`, `ReportsWorkspace.tsx`, `ReportSpreadsheet.tsx`. Government reports are fictional preparation samples. Existing agency, period, search, branch, CSV, print/PDF and workbook actions remain.
- Demographics: `components/EmployeeDemographicsWorkspace.tsx`, `lib/employeeDemographics.ts`. Reads current branch-scoped Employee 201 data with effective-dated wage references; preserves classification editing for permitted HR users and CSV exports.
- Changes in Batch 02 are primarily compact, purpose-sized layout modifications in `app/globals.css` and `components/HROperationsExtras.module.css`.

No demographic or payroll calculation is fabricated and no wage-order reference has been updated as part of Batch 02 (that belongs to Batch 03).

## 2026-10-22 display/interaction corrections

Metric and breakdown cards plus employee reference listing rows now expose clickable, keyboard-accessible detail drilldowns with filtered actual Employee 201 demographics and pay-reference data; no invented history or salary releases.

See `../../revisions/batches/BATCH-05.md` for scope, remaining QA and operational caveats.

### Batch 08 UI migration note

This module continues to use its existing business data and action handlers. Batch 08 adopts the shared UI tab, dialog accessibility or scoped styling patterns wherever applicable. See [Batch 08 revision record](../../revisions/batches/BATCH-08-UNIVERSAL-UI.md) for exact changed files and **unverified** browser checks; this does not certify the entire module as design-system migrated.

## Batch 10 — PSA Data Support (2026 OWS / ISLE)

`components/ReportsLanding.tsx` now exposes **PSA Data Support** as an internal tab; Demographics remains a separate internal top-level Reports & Analytics tab. The new `components/PsaDataSupportWorkspace.tsx` uses read-only dataset selectors in `lib/psaDataSupport.ts`.

This is **not** a survey form editor, PSA automatic filing/submission feature or automatic questionnaire answer engine. Authorized HR staff can select **one** real reporting establishment, reference/period dates and a requested OWS/ISLE dataset; inspect the source rows, search/paginate, export CSV or print. The filing officer still fills and submits PSA paperwork separately.

Coverage is deliberately conservative. Employee/occupation/pay support is limited by missing historical snapshots, pay/assignment evidence and absent PSOC mapping; ISLE special subjects not recorded reliably in the app appear as **Not tracked**. The panel distinguishes Recorded, Partial, No records and Not tracked and carries visible source limitations. Data are frontend browser-local (including demo seeds), not government-certified figures. Restrict exports to staff already authorized to see employee/pay data.

See [Batch 10 notes](../../revisions/batches/BATCH-10-PSA-DATA-SUPPORT.md).

### Batch 11 PSA reporting entity correction

For the **PSA Data Support** tab only, `Underchargers` is a consolidated reporting entity across UC Las Piñas, UC Mandaluyong and UC Quezon City; `Mastermind` is a separate reporting entity. A UC branch filter maps to UC's entity selection rather than creating a branch-by-branch filing dataset. Table details now open in accessible dialogs, not inline. Employee demo profiles have fictional DOB/age data for preview only; historical and certified source limitations continue to apply. See [Batch 11](../../revisions/batches/BATCH-11-PSA-ENTITY-DEMO-PROFILES.md).
