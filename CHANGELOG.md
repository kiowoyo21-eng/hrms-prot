# HRMS Main V9 — Docs & Sheets + V8 PDF Build Fix

## Changed source files (6)
- `components/SpreadsheetWorkspace.tsx` — add inline Find/Replace tools scoped to visible rows in the selected worksheet; next/previous selection, match counts, replacement confirmation, and working-copy approval gate.
- `lib/sheetSearch.ts` — bounded, case-optional literal search; safely generate proposed replacements; prohibit changing formula cells or creating new formulas by replacement.
- `app/spreadsheets/spreadsheet.css` — responsive, route-scoped Find/Replace panel styling.
- `app/studio/docs/[id]/page.tsx` — add previous/next document match navigation for readers, limited-batch Find/Replace under existing editing approval, status feedback.
- `lib/studio/textSearch.ts` — position-preserving, bounded text segment search and match navigation.
- `app/studio/pdf/[id]/page.tsx` — fix TypeScript error reported by Vercel for pdf-lib `FieldAppearanceOptions`: `addToPage()` without unsupported `fontSize`; set the PDF text form field size with `PDFTextField.setFontSize()` instead. Keep output storage and permissions unchanged.

## Compatibility and scope
This is an incremental patch based on the locally available HRMS V8 source. Apply it after the prior releases, including Ms Kate HR role inheritance and Main V8. It does not include any backend/sync changes or ERP integration. Report spreadsheets remain read-only; replacements require an approved working sheet. Document replacements require existing edit rights.

## Remaining work
This is NOT full Google Docs/Sheets parity. Advanced collaboration, complex multi-node text searching, editable pivot objects, enterprise permissions, and a shared database remain future work. The full Vercel production build still needs to be run on the repository/lockfile combination.
