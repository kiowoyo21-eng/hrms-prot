# HRMS Vercel ExcelJS column-index type fix

## Issue
Vercel Next.js 15.5.27 TypeScript build failed in `lib/sheetExcel.ts` at `c.col > GRID_MAX_COLS`:
`Operator '>' cannot be applied to types 'string' and 'number'.`

ExcelJS `Cell.col` and `Cell.row` are typed as strings by its address interface. The ExcelJS Row.eachCell callback supplies an additional numeric `colNumber` parameter; `row.number` is a numeric row index.

## What changed
Only `lib/sheetExcel.ts` is modified:
- Keeps `row.number` from the prior patch.
- Reads numeric column index from `row.eachCell({includeEmpty:false}, (c, columnNumber) => ...)`.
- Uses `columnNumber` for limits and `columnLabel(columnNumber - 1)` for cell references and format keys.
- Does not change formula evaluation, approved working copies, or payroll records.

## Install
Extract this ZIP to your existing HRMS project root, overwrite `lib/sheetExcel.ts` and run:

```sh
npm run build
```

Then commit and push if the build succeeds.

## Verification
Source syntax parsed without errors. The numeric callback signature was checked against ExcelJS type declarations. Full Next.js production build was **not** run in this environment (npm registry unavailable).
