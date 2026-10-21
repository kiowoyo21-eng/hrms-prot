# QA Report — V9 + V8 PDF Type Fix

## Passed locally
- 33 focused assertions across search navigation, case handling, bounded matching, safe replacements, formula protection, edit-gate source checks, and the PDF export API correction.
- 128 TS/TSX files parsed without syntax errors.
- 356 relative imports checked; no missing imports.
- New `textSearch.ts`, `sheetSearch.ts`, and `sheetFormulas.ts` passed strict TypeScript checks with globally installed TypeScript 5.8.3.
- The route-scoped spreadsheet stylesheet parsed successfully.
- ZIP integrity checked when archived.

## Vercel error addressed
Commit `9a6b455`: `app/studio/pdf/[id]/page.tsx:103:105` — `fontSize` is not accepted in `FieldAppearanceOptions` passed to `PDFTextField.addToPage`. The patch calls `textField.setFontSize()` instead. The TypeScript error is thus specifically addressed; this does not establish successful complete deployment.

## Not verified here
- Full Next.js `npm run build`: npm packages were not present; offline npm installation returned `ENOTCACHED` for `@tiptap/core`.
- Interactive browser tests in deployed Vercel site and real PDF rendering with installed `pdf-lib` were unavailable.
- Integration/compatibility with any GitHub changes later than the local V8 snapshot.

## Expected user acceptance tests
1. Navigate a Docs file and test Find/Previous/Next when view-only; test approved Replace.
2. Search and replace literal text in an approved working spreadsheet and verify `=...` cells cannot change.
3. Verify HRMS report worksheets remain read-only.
4. Generate editable and flattened PDFs and reopen a saved output from Document Library.
5. Verify Ms Kate retains HR access and only she has special final-approval authority.
6. Check Vercel build status after the combined commit.
