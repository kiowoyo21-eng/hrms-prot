# Built-in spreadsheet reporting (frontend-only)

## Where to find it

- **Reports & Analytics > Spreadsheet Workspace**: live workbook tabs for Payslip Releases, Payslip Drafts, Employee Directory, Attendance Batches, Attendance Rows, and Asset Inventory.
- **Reports & Analytics > Government Reports > chosen sample**: sample report in a spreadsheet-style preview with the original sample table/print controls retained.
- **Reports & Analytics > Employee Analytics > Advanced Employee Report Builder**: Open Spreadsheet for the filtered employee dataset.
- **Payroll Management > Payslip History**: Open Payslip Spreadsheet. Uses the selected month/employee/cutoff week filters.
- **Payroll Management > Generate Payslips > Drafts & Approval**: Open Draft Spreadsheet. Existing review/approval actions remain in the original table and are not exposed as bulk editing shortcuts.

## Worksheet features

- Sheet tabs, column letters, row numbers, searchable cells, sortable columns, selectable cells, read-only formula bar and arrow-key navigation.
- Filtered total row for relevant numeric/money columns. Basic rates do **not** sum across mixed daily/monthly units.
- Copy one cell or all filtered rows as tab-separated values.
- Download filtered rows as UTF-8 CSV (spreadsheet-compatible) with protection against CSV formula injection.
- Print / Save PDF from the currently filtered rows. Sheet data updates when the shared HR browser state changes.
- Paginate rows to avoid rendering all records at once.

## Deliberate guardrails / limitations

- **Read-only data cells.** This is a reporting worksheet, not an alternate path to modify payroll master records, replace attendance evidence, change approved figures, or release funds. Record changes must go through the source HR modules.
- HR and Super Admin access is inherited from the current frontend module/role checks. Frontend permissions and browser localStorage **do not provide production confidentiality or tamper-proofing**.
- This feature does not add a backend, server-side audit trail, immutable ledger, native XLSX writer, spreadsheet formulas/editor, or official government filing support.
- CSV files exported from this prototype are for local reference only and require HR validation before use. Printing an individual payslip still uses the existing Payslip History workflow.
- Leave, recruitment, and incident modules use separate local storage and are not automatically added to the shared HR workbook. Integrate them through a normalized data layer when implementing those report types.

## Validation

- Parsed all 61 TS/TSX files with TypeScript 5.8.3: no syntax errors.
- Runtime/production build was not verifiable because this ZIP does not include node_modules and npm packages were not available from the current build environment.
