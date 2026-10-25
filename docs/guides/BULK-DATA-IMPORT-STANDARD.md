# HRMS Bulk Data Upload — Required Download Template & Guide Standard

**Status:** Patch 23 source implementation for existing Payroll / Government Deductions and Attendance CSV/XLSX uploads. Other modules are NOT represented as working importers merely because they contain file-upload controls.

## Non-negotiable UI flow for EVERY future bulk data feature

1. Identify the exact import purpose, source dataset, scope (company, branch, payroll cutoff or agency), and user permission.
2. Display **Download Excel Template** and **Download CSV Template**, using the same exact column names as the accepted importer. Do not deliver a template in a format that the corresponding uploader rejects.
3. Give a prominently visible **Detailed Guide** (modal or dedicated route), with step-by-step actions, every exact column, type, required/optional status, allowed values, examples clearly identified as FORMAT ONLY, limits, restrictions, and troubleshooting.
4. Only non-sensitive, EMPTY downloadable samples; no fictional government rates in rows presented as official.
5. Require correct data scope: employee IDs, employee/branch, effective date, legal employer or government agency as relevant. Provide an explicit current-source warning if data comes from a browser-only mock.
6. Parse both CSV (RFC 4180 quotes, escaped quotes, BOM) and XLSX (.xlsx Input sheet). Reject formulas/macros, unsupported cell content, disallowed extensions and oversized files. CSV uploads must remain Excel/Google Sheets compatible.
7. Show a **modal Import Preview**, including filename, selected scope, number of parsed rows, meaningful sample cells, row-level errors, warnings and **Download Error Report**.
8. Don't save or update existing data when ANY blocking error is present. Keep partial valid rows in memory for PREVIEW only, not as a partial committed dataset. Require reupload to correct errors.
9. Make the final action explicit and reversible where possible: **Stage Draft** for government schedules, not Activate. Preserve existing version/history. Require separate independent verification before any status change; real statutory approval requires a future secured process.
10. Avoid destructive overwrite. Explicitly ask what duplicate records, replacements, effective dates, and history should do before adding another bulk intake. Never silently delete previous data.
11. Respect roles and company/branch access on view, import, and export. Redact sensitive content in logs and export only authorized datasets.
12. Record source file, effective date, uploader, review status, number of imported rows, and audit entry when a persistent backend exists. Browser-only demo does not imply durable, tamper-resistant storage.

## Government deduction / tax reference schedule imports

**Navigation:** Payroll → Government Deductions → select SSS, PhilHealth, Pag-IBIG or BIR → Download Excel Template/CSV Template → Detailed Guide → Import CSV/XLSX.

**Exact schemas, per selected agency:**

| Agency | Input columns in order | Notes |
|---|---|---|
| SSS | `min,max,employee,employer,effective` | Employee / employer **amounts**, PHP, not rates. Employer may involve EC, MPF and applicable components requiring official-source validation. |
| PhilHealth | `min,max,rate,effective` | `rate` is total premium percentage **points** (e.g. 5 means 5%, not 0.05). Current demo floor/ceiling calculations are not dynamically derived from the bracket file. |
| Pag-IBIG | `min,max,rate,effective` | Current demo contribution limits/shares are separately hard-coded; uploading does not update them. Verify latest official circular. |
| BIR | `min,max,rate,fixed,effective` | **Weekly** withholding reference. `rate` is marginal percentage points; `fixed` is base withheld PHP. Bracket basis is taxable weekly compensation, not gross monthly salary. |

### Field-by-field rules

- `min`: inclusive lower boundary of salary/taxable-pay range, PHP. Plain nonnegative numeric input, no comma or currency symbol.
- `max`: inclusive upper boundary, PHP. `max` must not be smaller than `min`. The prototype's open-ended top-range sentinel is `999999999`; this number is a technical placeholder, not a government-prescribed threshold.
- `employee`: fixed employee contribution amount, PHP, when agency requires it; **not** percent.
- `employer`: fixed employer contribution amount, PHP, when agency requires it; **not** percent.
- `rate`: percentage **points**, e.g. `15` means fifteen percent. No `%` sign; do not enter `0.15` to mean 15%.
- `fixed`: BIR base withholding amount for the bracket, PHP. Enter the actual amount from the source; never leave blank and assume zero.
- `effective`: valid `YYYY-MM-DD` date, same on **all** rows in a file. Don't mix dates or versions.

**No official values are supplied in sample rows.** Obtain numbers from source circulars and confirm the effective period before entering. One row = one published bracket, including any upper-limit bracket. A gap between brackets is warned about for independent review; overlapping ranges are blocked.

### Save and review

1. Open `.xlsx` with Excel or Google Sheets, preserve **Input** sheet and header row 1, edit row 2 onward. Read the **Guide - Read First** worksheet; do not upload the guide as data.
2. Upload `.xlsx` directly, or export the Input sheet to **CSV UTF-8** preserving the header. `xls`, `xlsm`, PDFs and image copies will not parse.
3. Importer checks required columns, numerical formatting, actual dates, mixed effective dates, invalid bounds, duplicate headers, unexpected columns and interval overlaps. Limit is 500 rows and 3 MB.
4. Review ALL errors in the modal; download the CSV error report; fix and reupload. Do not try to bypass errors by copying only valid rows.
5. Even after technical validation passes, review warnings and compare figures to the authenticated official source, including classification and date.
6. Click **Stage Validated Draft**, record the official source URL, and **Save Proposed Version**. This preserves existing historical schedules and does not apply the new table automatically.
7. Any later **Approve (Demo)** means only an internal browser demonstration; it is not legal approval, filing, actual withholding or remittance.

### Troubleshooting

| Message | Meaning and remedy |
|---|---|
| Missing column | Wrong template / changed headers. Download the correct agency template and copy values into its columns. |
| Invalid numeric | Remove `₱`, thousands separators, percent signs, formulas and negative values; provide plain values in the correct unit. |
| Invalid `effective` | Ensure `YYYY-MM-DD` exists on the calendar and is identical on every row of one schedule version. |
| Mixed effective dates | Split the source into separate files by effective date/version. |
| Overlapping ranges | Compare boundary amounts to the verified source; don't round away meaningful cents without proof. |
| Bracket gaps | Warning only; confirm whether the official schedule genuinely has gaps. |
| Can't parse XLSX | Sheet must be called `Input`, row 1 must use the exact template headers, no macro/formula/password-protection. |
| Legal rate discrepancy | Stop; verify authoritative current source and tax/contribution basis. Never treat the reference table as production-ready without review. |

## Attendance bulk import

**Navigation:** Payroll → Generate Payslips → Attendance Upload & Verification → select Branch and Thursday cutoff.

**Exact columns:** `Employee ID,Date,Time In,Time Out,Status,Approved OT Hours,OT Approved,Notes`.

- `Employee ID`: exact existing HRMS employee identifier, in the selected branch, not name.
- `Date`: `YYYY-MM-DD`, between Thursday and the next Wednesday; not before employee's hire date.
- `Time In`, `Time Out`: 24-hour `HH:MM`. Present requires both; Incomplete requires at least one; Absent/Rest Day/On Leave must have blank punches. Same-day shift only, max 16 elapsed hours. Overnight shifts are not supported by this importer.
- `Status`: `Present`, `Absent`, `Rest Day`, `On Leave`, `Incomplete`.
- `Approved OT Hours`: 0 to 8, only if present and independently approved; `OT Approved` must be `Yes` when OT hours positive.
- `Notes`: optional contextual remark, max 240 characters.

One row per employee/day. Don't skip absent/rest days just because time punches are empty. Save as .xlsx (Input sheet) or UTF-8 CSV. Upload in the selected branch/cutoff context; inspect error preview (wrong branch, date, duplicate employee/day, invalid status/times, unauthorized OT), download error report, correct and reupload. **Record Validated Rows** only when there are zero blocking issues. HR then reviews completeness, leave, OT and rate treatment separately. It is not proof of a biometric punch or a final pay calculation.

## Boundaries & security

These tools run in a **frontend/browser-local prototype**. CSV and XLSX values are not verified against government portals or protected by a production database. No real confidential employee bulk loads should be made until an appropriate secured backend, access controls, audit logging, backups and import rollback are available. Government contribution tracking in this HRMS was planned to begin January 2027; that is a tracking scope choice and does not change independent statutory obligations.
