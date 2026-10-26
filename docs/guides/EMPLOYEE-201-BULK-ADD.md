# Employee 201 — Bulk Add Guide (CSV / XLSX)

**Current scope:** Browser-only Employee 201 **add new** import. Not a secure production migration system, mass editing tool, government registration uploader, payroll-release import, or employee document upload.

**Navigation:** Employee 201 Files → **Bulk Add Employees** → **Download Excel Template** (or **Download CSV Template**) → **Detailed Guide** → choose file → **Import Preview** → resolve errors → **Confirm Import**.

## Preparation instructions

1. Select the correct Employee 201 branch scope in the HRMS. A selected single branch restricts file rows to that branch; All Shops (where authorized) may include branches of both employers but preserves their separate employee records.
2. Download a NEW blank template from the modal. The Excel template has **Input** and **Guide - Read First** worksheets. CSV uses the identical header row. Do not rename or reorder columns; other spreadsheets or freeform lists cannot be imported directly.
3. Fill the **Input** sheet (one employee per row, data starts in row 2). Use verified source data only. No source employee payroll rates or government ID values are included in the downloaded template. Do not copy fictional demo salaries as real values.
4. Enter dates as TEXT in exact ISO format `YYYY-MM-DD` (e.g. `2025-06-10`), and numerical pay/leave values as plain numbers without currency symbols, commas, formulas, or units. Keep rows contiguous.
5. Employee ID is optional. If blank, the importer generates a new `UC-####` or `MM-####` ID based on the employee's employer. Supplied IDs must have the correct company prefix. Existing IDs and persons cannot be overwritten.
6. Every employee requires a legal display name, branch, department, position, employment status, sex, actual hire date, salary type, verified basic pay rate, and verified opening SIL/VIL days. Enter `0` only where an actual zero is verified; do not leave credits blank or assume a default.
7. Probationary employees also require Probation Months `1–12` based on their agreed employment conditions; other categories must have blank or `0` in that column. Date of birth, contact and emergency information are optional if unverified; missing birth dates will be flagged.
8. Save as `.xlsx`, or CSV UTF-8 with the exact template headers. Files must be 1 byte to 3 MB, and contain no more than 500 employee rows. Do not use legacy `.xls`, `.xlsm`, password-locked sheets, merged/fancy data cells, or formulas.
9. Upload the completed file via the Employee 201 modal. Preview shows imported row count, valid records, errors, warnings, generated IDs, selected scope, and up to 20 validated employees. It is NOT yet saved.
10. If there is **any** blocking error, **Confirm Import** is disabled; download the error/warning report, correct all rows in the original file, and upload again. The importer is ALL-OR-NOTHING; do not expect silently skipped rows.
11. Only with zero blocking errors, verify the summary then click **Confirm Import**. New records obtain their own initial assignment and **Missing** document checklist. No signed files or fabricated verification status are created.
12. Search for the new Employee ID in Employee 201 and validate the basic rate, employee branch, birth date, leave allocations, and required-document status. Other modules may rely on these facts.

## Field dictionary

| Exact column name | Required | Allowed value / validation | Format-only example |
|---|---|---|---|
| Employee ID | No | Blank or unique `UC-####` / `MM-####`, correct employer prefix | UC-0040 |
| Full Name | Yes | Actual legal display name, <=120 characters | Maria Dela Cruz |
| Branch | Yes | UC Mandaluyong / UC Las Piñas / UC Quezon City / MM Mandaluyong | UC Las Piñas |
| Department | Yes | Actual department name, <=80 chars | Operations |
| Position | Yes | Official position, <=100 chars | Service Advisor |
| Employment Status | Yes | Probationary / Regular / Fixed-Term / Project-Based | Regular |
| Sex | Yes | Male / Female / Prefer not to say | Female |
| Hire Date | Yes | Real `YYYY-MM-DD` date | 2025-06-10 |
| Salary Type | Yes | Daily or Monthly | Monthly |
| Basic Rate | Yes | Actual positive PHP amount, <=100,000,000, decimal max 2 places | 20000 |
| Date of Birth | No | Real ISO date <= Hire Date, or blank | 1995-02-18 |
| Civil Status | No | Single / Married / Widowed / Separated / Other, or blank | Single |
| Email | No | Valid email address or blank | employee@example.com |
| Phone | No | Actual number as text, <=40 characters | 09XXXXXXXXX |
| Residential Address | No | Actual address or blank, <=240 characters | City, Province |
| Emergency Contact Name | No | Name or blank, <=240 chars | Juan Dela Cruz |
| Emergency Relationship | No | Relationship or blank, <=240 chars | Spouse |
| Emergency Contact Phone | No | Number or blank, <=40 chars | 09XXXXXXXXX |
| Nationality | No | Recorded nationality or blank | Filipino |
| Job Level | No | Rank-and-File / Supervisory / Managerial / Not recorded | Rank-and-File |
| Employment Arrangement | No | Regular / Probationary / Contractual / Project-Based / Seasonal / Casual / Fixed-Term / Other / Not recorded | Regular |
| SIL Days | Yes | Verified amount of days from 0 to 365; up to 2 decimal places | 0 |
| VIL Days | Yes | Verified amount of days from 0 to 365; up to 2 decimal places | 0 |
| Probation Months | Conditional | 1–12 integer for Probationary; otherwise blank or 0 | 6 |
| Middle Name | No | Legal middle name, <=80 characters, or blank | Santos |

These examples show **format only**. They are not sample employees or recommended/legally approved pay values. Age is computed from Date of Birth instead of imported as a static number.

## Checks performed

- Correct 25-column header order; file size 3 MB maximum; 500 employee rows per upload.
- CSV quoted fields and escaped quotation marks, XLSX Input sheet and rejection of formula/complex cell values (shared Patch 23 parsing).
- Branch scope, company-prefixed unique IDs, names and date-of-hire dedupe within each employer, intra-upload duplicates.
- ISO calendar dates, date of birth not after hire, proper wage type and strictly positive verified rate, explicit SIL/VIL days, conditional probation months.
- No replacement of existing employee data; full-file atomic import only; new records begin with missing document requirements and initial assignment history.
- Error reports with Excel row references; preview and guide in accessible portal modal instead of inline expansion.

## Troubleshooting

| Issue | Solution |
|---|---|
| Wrong/missing header | Download current template and paste **values** only into original columns. |
| Duplicate ID | Remove the existing employee row or correct the unique ID; bulk add is not mass update. |
| Duplicate name + hire date | Verify whether the person already exists; fix mistaken name/date or do not re-add. |
| Wrong branch / company | Choose the correct HRMS branch filter and set exact Branch text. UC and MM stay separate legal employers. |
| Invalid date | Format cell as TEXT, re-enter valid `YYYY-MM-DD` (not Excel serial dates). |
| Currency / decimals rejected | Enter `20000` or `20000.50`, not `₱20,000` or `20,000.00` with thousands separator. |
| Missing leave allocation | Enter the verified opening SIL/VIL amount; enter `0` only if confirmed. |
| Formulas / merged cells | Paste plain text/numeric values, unmerge cells, preserve header and Input sheet. |
| Too many records / file too large | Split by branch or cohort; <=500 employees and <=3 MB per import. |

## Security / production limitation

This frontend prototype uses browser local storage. The imported rows are **not shared across devices**, are not protected with server-enforced authorization, may be lost with local browser data, and do not replace a verified HR source of truth. No authentic personally identifiable, payroll, banking, statutory ID, or medical data should be uploaded until a secure backend and controlled migration process are operational. Sensitive government ID scans and signed contracts are intentionally not part of the employee bulk sheet.
