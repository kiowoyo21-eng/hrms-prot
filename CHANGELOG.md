# HRMS Patch Changelog

## 2026-10-20 — Spreadsheet workbook ID type fix

- **Changed** `components/SpreadsheetPageClient.tsx`.
- Replaced `initialSheetId && LEGACY_SHEET_WORKBOOK[initialSheetId]` with an explicit conditional and `WorkbookId | undefined` annotation. This prevents the empty string from being inferred as a possible workbook ID in the Next.js 15 TypeScript build.
- Kept existing workbook routes, legacy sheet redirects, Drive import handling, UI, and access checks unchanged.

### Verification
- Targeted TypeScript strict type check of the expression: passed.
- TSX syntax parsing: passed.
- Full Next.js production build: not run/verified in this environment; rerun on Vercel after committing.
