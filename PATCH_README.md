# HRMS Advanced Spreadsheets V4 — Incremental Patch

## Installation baseline

Requires the current HRMS project **with Advanced Sheets V3 applied**, including `/app/spreadsheets/layout.tsx` and its route-scoped styles. Do not apply over the original unpatched HRMS ZIP.

This archive is a patch (not a full project). It contains exactly **5 new/modified source files** and three documentation files.

### Exact source paths

1. `components/SpreadsheetWorkspace.tsx` — replace
2. `lib/sheetFormulas.ts` — replace
3. `lib/sheetRange.ts` — replace
4. `lib/sheetInsights.ts` — **add new**
5. `app/spreadsheets/spreadsheet.css` — replace

## GitHub website installation

1. Open `kiowoyo21-eng/hrms-prot` on branch `main`.
2. Extract the ZIP on your computer. **Do not upload the ZIP as a repository file.**
3. Upload/replace each file into the **exact directory** listed above. GitHub's web upload can also be used by opening each folder and choosing `Add file → Upload files`.
4. Confirm all **five source files** are present on `main` (especially new `lib/sheetInsights.ts`).
5. Commit changes. Wait for Vercel deployment.
6. Open `/spreadsheets/<workbook-id>` → **Pivot & Charts**. For cross-sheet formulas, type a supported expression in a **working sheet after admin approval**.

## Examples

- `=Sheet2!B2`
- `='Compensation & Premiums'!B2`
- `=SUM('Earnings'!C2:C20)`
- `=VLOOKUP("BM",Sheet2!A2:B3,2,FALSE)`

The referenced sheet must be in the **same workbook**; if absent, expect `#REF!`.

This release intentionally does **not** add dependencies or modify payroll batches, employee source data, Drive security, Docs, or admin approvals.

## Verification

Run `npm install` and `npm run build` in a full Node/Next.js environment, or inspect Vercel build logs. Targeted tests and source validation are summarized in `QA_REPORT.md`.
