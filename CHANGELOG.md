# HRMS — Development Changelog

## 2026-10-20 — Advanced Spreadsheets V4: Cross-sheet formulas and chart/pivot previews

### Source file changes

- **Modified `lib/sheetFormulas.ts`** — supports quoted/unquoted *same-workbook* references like `=Sheet2!B2`, `='Compensation & Premiums'!B2`, `=SUM('Earnings'!C2:C20)` and cross-sheet VLOOKUP using a two-argument reference callback. References never resolve outside the open workbook; invalid/missing sheets result in `#REF!`. Cell-level circular-reference detection is preserved by the workspace.
- **Modified `lib/sheetRange.ts`** — safely allows supported Excel formulas with same-workbook references on import/export; external-book links and unsupported formulas remain rejected/imported as text. Relative `$` reference shifting continues to work with qualified sheet names.
- **New `lib/sheetInsights.ts`** — deterministic, read-only pivot-style aggregation (COUNT/SUM/AVERAGE). Explicit handling of blanks, nonnumeric values and negative numbers; limit of 4,000 source rows and 12 visible groups plus aggregated “Other.” No changes to HRMS or sheet storage.
- **Modified `components/SpreadsheetWorkspace.tsx`** — adds a **Pivot & Charts** analysis panel; group/value selection, COUNT/SUM/AVERAGE, bar/line chart previews and CSV summary export. Adds same-workbook formula lookup. Menu actions open the panel; preserves existing admin-approval gates.
- **Modified `app/spreadsheets/spreadsheet.css`** — scoped responsive styles for pivot-table, chart display and controls, preserving the continuous grid and toolbar layout.

### Data integrity and security

- All pivot/charts operate in **view-only analysis mode** from displayed rows after filtering.
- Working-copy edits continue to require approved HR access; source payroll/Employee 201 data remains read-only.
- No new NPM dependencies, no backend changes, no write-through from spreadsheets to official HRMS records.
- Existing browser-only approvals and audit logs are not production security boundaries.

### Known limitations

- Charts and pivot tables are **read-only previews**, not saved draggable chart or Excel pivot objects.
- Cross-sheet reference names are resolved only within the currently open workbook. Excel external-book references are blocked. Excel export may rename/shorten unsupported sheet names, so complex cross-sheet XLSX fidelity is not guaranteed.
- Cross-workbook formulas, large lookup tables, rich chart customizations, and Google Sheets parity still require later work.
- Full `npm run build` and browser end-to-end testing could not be completed because project dependencies were unavailable in the local environment. Verify with Vercel before next major patch.

---

### Earlier change history (retained)

# HRMS Changelog — Spreadsheet Layout Repair

- **Added** `app/spreadsheets/spreadsheet.css`: restored the missing `.sw-*` styles for the workbook home, horizontal top menu, format bar, action buttons, approvals, formula bar, continuous grid, sheet tabs, dropdowns, and responsive breakpoints.
- **Added** `app/spreadsheets/layout.tsx`: imports those styles automatically for both `/spreadsheets` and `/spreadsheets/[id]`.
- Preserved all existing HRMS data, Employee 201, payroll batches, admin approvals, and report mappings. No new dependencies.
- Fixed styling scope instead of replacing `app/globals.css`, to avoid erasing other patches.
