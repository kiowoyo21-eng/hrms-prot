# HRMS Advanced Sheets V4 — QA Report

## Passed checks in source environment

- All **106 TypeScript/TSX files** parsed successfully (syntax checks only; not full Next.js type-check).
- Relative module references across source files: **0 missing imports**.
- Spreadsheet stylesheet parsing (tinycss2): **0 errors**.
- **25 focused automated checks** passed, including cross-sheet arithmetic, quoted sheet names, SUM/AVERAGE, VLOOKUP, missing sheets, safe XLSX formula recognition, external-workbook rejection, copy/fill shifting, pivot counts, sums, averages, non-numeric values, group limits, and 4,000-row cap.
- Strict `tsc` type-check and transpilation passed for the four pure calculation/helper modules (`sheetFormulas`, `sheetRange`, `sheetDataTools`, `sheetInsights`).

## Unverified

- Full Next.js production build (`npm run build`): dependencies unavailable locally.
- Real browser render, chart layout and mobile testing: not completed.
- Actual Excel file round-trip and performance on large workbooks: not fully tested.
- Production authorization and cross-device storage: browser-only prototype, no backend enforcement.

## Suggested smoke checks after deployment

1. Open Employee 201 workbook; click **Pivot & Charts**, group by branch, aggregate COUNT; confirm each branch and row count.
2. Switch chart between Bar and Line; ensure the grid/formula bar remains styled when switching back.
3. Filter a column, then reopen Pivot & Charts; confirm summaries use only visible filtered rows.
4. Open two worksheets in the same working workbook and (with approved edit access) evaluate `=Sheet2!B2` and a quoted-sheet reference. Missing sheet should show `#REF!`.
5. Import an XLSX containing a supported same-workbook formula, then export. Confirm external-book references remain unsupported and do not execute.
6. Verify Super Admin approval/revocation and Payroll/Employee 201 report read-only rules remain intact.
