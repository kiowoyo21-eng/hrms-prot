# HRMS Spreadsheet Advanced Tools — Changelog
2026-10-20 — Advanced Sheets Incremental Revision

## Source changes
- `components/SpreadsheetWorkspace.tsx` — add Data Tools panel, actual view-only sorting/filtering of grid rows (canonical cell references retained), range formatting, list/number validation controls, conditional formatting rules, and expanded formula help. Protect official report rows from editing.
- `lib/sheetFormulas.ts` — extend safe non-eval formula parser with conditionals, comparisons, text and lookup functions, rounding and aggregate conditions; return spreadsheet-style errors for unsupported operations.
- `lib/sheetRange.ts` — allow safe import/export of supported formula subset, reject external references and unsupported formulas (preserve as text).
- `lib/sheetDataTools.ts` (new) — pure helpers for validation, conditional rules, spreadsheet-range inclusion and natural sorting.
- `lib/spreadsheetStore.ts` — require active admin-approved edit grants before saving validation, formatting and conditional rules; validate incoming cell values atomically, audit actions without recording cell contents.
- `app/spreadsheets/spreadsheet.css` — extend route-scoped Google Sheets-style layout with responsive Data Tools panel.
- `app/spreadsheets/layout.tsx` — include previous route-scoped stylesheet import to prevent the previously reported unstyled spreadsheet UI.

## Key invariants
- HRMS Employee 201, Payroll, Payslips, Loan, Incident, and other official source records are NEVER modified through this spreadsheet editor.
- Module-specific workbooks, batch isolation, existing sheets, and original approval requests remain intact.
- Data sorting/filtering is a view operation, not a write or an irreversible row reordering.
- Protected sheet changes still require an active approver grant. Revocation blocks writes.
- Browser-local permissions and audit logs are demo-only. Secure production enforcement requires backend authorization.

## Not in this incremental revision
- Pivot tables, charts, cross-sheet formulas, named ranges, true multiuser collaboration, server-backed storage and Google Sheets feature parity.
