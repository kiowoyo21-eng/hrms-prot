# Install — HRMS Advanced Sheets

**Requires:** the existing HRMS workspace (including Payroll Batch revision) and the Employee 201 workbook patch. This ZIP is not a standalone project.

## GitHub website installation
1. Extract this ZIP. Do not upload the ZIP itself to the GitHub repository.
2. In `main`, replace/upload each of the seven source files, preserving its folder path.
3. If `app/spreadsheets` does not already contain `layout.tsx` and `spreadsheet.css`, create/upload both. These restore the full spreadsheet styling.
4. Commit all changed files together.
5. Check the NEW Vercel deployment and its full build log before adding another large feature.
6. Hard-refresh `/spreadsheets/working` and `/spreadsheets/employees` in the browser (Cmd+Shift+R on Mac).
7. Test an HR demo request and Super Admin grant, then validate a list rule, reject an invalid value, add conditional formatting, and revoke the grant.

**No npm dependency changes.** Existing `npm run build` applies. The spreadsheet Data menu now offers sorting and Data Tools. Validation/formatting can only be saved in approved custom working sheets; HRMS report sheets remain read-only.

**Validation scope:** static TS/TSX syntax and local import checks, strict TypeScript checks for the new pure functions and store, 43 targeted JS tests, CSS parsing. Full installed-app `next build` and browser E2E were NOT possible in this environment because a complete npm dependency installation was not available. Never assume a clean Vercel deployment until its build completes.
