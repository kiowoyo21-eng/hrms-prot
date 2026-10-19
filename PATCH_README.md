# HRMS Vercel — ExcelJS TypeScript Build Fix

## Error addressed

`lib/sheetExcel.ts:39` — `Operator '>' cannot be applied to types 'string' and 'number'` during Next.js 15 production type checking.

## Change

Use ExcelJS `row.number` (numeric) rather than `c.row` (typed string) when checking Excel row limits and generating cell addresses/format indexes. No feature, user data, or package.json changes.

## Apply

1. Extract this ZIP into the root of your HRMS repository.
2. Overwrite `lib/sheetExcel.ts`.
3. Run `npm run build` locally, then commit and redeploy.

## Verification

Source checked for consistent row-index usage, and static syntax checked. The full Next.js build was **not** verified in the testing environment because dependency installation timed out. This patch addresses the **current** Vercel error, not a guaranteed clean build of all remaining files.
