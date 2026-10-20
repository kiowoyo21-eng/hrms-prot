# HRMS Advanced Spreadsheet — QA Report

| Verification | Result |
|---|---|
| Pure formula, data tools, sheet range, spreadsheet store + dependencies TypeScript strict check | PASS |
| Source TS/TSX parser checks | PASS: 104 source files |
| Relative import paths | PASS: 0 missing |
| Spreadsheet stylesheet parsing | PASS: 0 errors |
| Targeted logic tests: formula, lookup, import formula gate, validation, format, approval, audit | PASS: 43 |
| Full Next.js production build | NOT VERIFIED — npm packages could not be installed from the available local cache |
| Browser layout and end-to-end workflows | NOT VERIFIED — test in deployed browser |

## Manual verification checklist
1. Employee 201 spreadsheet opens at `/spreadsheets/employees` in its own tab, with horizontal menus, compact grid and module-only worksheets.
2. Data → Filter and validation tools shows correctly. Sorting a column changes view only, while row labels keep original worksheet addresses.
3. In `/spreadsheets/working`, HR cannot edit before Super Admin approval.
4. After approval, apply a dropdown list to a cell; allowed values save and invalid/formula values are rejected.
5. Numeric min/max rule and conditional formatting reflect entered cell values.
6. After revoke/expiry, cell edits, formatting and validation saves are blocked.
7. Payroll batch workbook remains isolated; exported report data contains only the selected batch.
8. Docs/PDF and Drive routes still open; no unrelated navigation changes.

## Known limitations
- Basic formula subset, not complete Excel / Google Sheets formula compatibility.
- Conditional rules and validation are stored in browser-local sheet copies, not exported into XLSX metadata.
- Sorting/filtering are view-only and not persisted; original cell coordinates remain canonical.
- Browser-local audit entries are demonstrative, not tamper-proof.
