# HRMS Bulk Imports — Six Module Data Sets (Patch 25)

Scope: browser-local review only. Do not place actual employees' personal, compensation, medical, banking, or statutory information in this prototype.

## Shared workflow

1. Sign in with a role authorized to manage the specific module and select the correct branch.
2. Open the module's **Bulk Import** button. All dialogs appear as a real modal, not inline after a table.
3. Download the Excel template. Only the **Input** sheet is imported; the **Guide - Read First** tab explains every exact field and contains *format-only* examples. Or download the UTF-8 CSV template with matching headers.
4. Keep the exact header names and column order. Type one record per row from row 2; do not add blank gaps. Each numeric/date field must be plain text/number; use ISO `YYYY-MM-DD` dates, no formulas, special currency characters, commas inside numeric amounts, merged cells, protected sheets or macros.
5. Upload `.xlsx` or UTF-8 `.csv` up to 3 MB and at most 500 rows. Files are parsed in the browser without server storage.
6. Review the parsed totals, each warning, and first 15 rows. **Any error blocks the entire import**. Download the Error/Warning CSV, correct the original file, and upload again.
7. Tick the acknowledgment only after confirming branch/company scope, actual source records, changes about to be made, and storage limitations. Click **Confirm Import** once.
8. Reopen the module to verify every created/updated entry. Never substitute this source-level preview for payroll legal verification, actual agency filing, HR approvals, or a secure data migration.

## Source-by-source data dictionary

### Asset Inventory — Assets & Devices

| Exact column | Required | Input details |
| --- | --- | --- |
| `asset_name` | Yes | Actual device/model, ≤120 characters |
| `serial_number` | Yes | Unique company-wide serial or barcode, ≤100 characters, duplicates rejected |
| `branch` | Yes | UC Mandaluyong / UC Las Piñas / UC Quezon City / MM Mandaluyong |
| `condition` | Yes | New, Good, Fair, or For Inspection |
| `accessories` | No | Itemized existing accessories; may contain CSV-quoted commas |
| `notes` | No | Remarks ≤300 characters |

Effect: **new inventory items only**. A record marked For Inspection opens in Inspection status, otherwise Free. No employee is auto-assigned, no accountability form or signature is generated, and serial duplicates are blocked.

### Leave Opening Balances — Leave Management

| Exact column | Required | Input details |
| --- | --- | --- |
| `employee_id` | Yes | An existing Employee 201 ID matching selected branch |
| `sil_days` | Yes | Verified allocation, 0–365; zero only when verified |
| `vil_days` | Yes | Verified allocation, 0–365; zero only when verified |
| `effective_date` | Yes | **Current date only** because the current model cannot backdate allocations faithfully |
| `source_reference` | Yes | Actual approved balance/worksheet reference |

Effect: **replaces current recorded SIL/VIL allocations** only after explicit acknowledgment, with old/new values and source stored in timeline. Existing leave applications, reviews and approvals are unchanged. Future/opening 2027 amounts may only be entered as current values when their effective date arrives; otherwise wait for historical ledger support.

### Applicant Register — Recruitment & Hiring

| Exact column | Required | Input details |
| --- | --- | --- |
| `full_name` | Yes | Applicant full name, ≤120 characters |
| `email` | Yes | Valid email; dedupe by email + position |
| `phone` | Yes | Applicant contact, ≤40 characters |
| `position` | Yes | Job title, ≤100 characters |
| `branch` | Yes | Exact authorized branch |
| `application_date` | Yes | YYYY-MM-DD date no later than today |
| `education` | No | Applicant-reported highest relevant education, ≤200 characters |
| `relevant_years` | No | Numeric years from 0 to 80 |

Effect: **new applicant registers only**, initially `New Applicant`; no interview, offer acceptance, screening result or hire is synthesized, including for old application dates. Resume files are not imported.

### Salary Rate History — Payroll → Employee Pay Rates

| Exact column | Required | Input details |
| --- | --- | --- |
| `employee_id` | Yes | Existing employee in selected scope |
| `salary_type` | Yes | Daily or Monthly, **must match Employee 201** |
| `amount_php` | Yes | Verified positive basic pay up to 100,000,000; no symbols/separators |
| `effective_date` | Yes | YYYY-MM-DD, same employee/date duplicate blocked |
| `reason` | Yes | Specific actual HR approval/source reference, ≤250 characters |

Effect: adds effective-dated browser-demo salary history. Does not edit Employee 201's original `rate`, prior rate change entries, payslip drafts, already released payroll, or employer statutory schedules. An imported change does **not** prove a real approval.

### Compliance Register — Government Compliance

| Exact column | Required | Input details |
| --- | --- | --- |
| `agency` | Yes | DOLE, BIR, SSS, PhilHealth, Pag-IBIG, BFP, DENR-EMB, PSA, LGU |
| `requirement` | Yes | Filing/requirement name, ≤200 characters |
| `branch` | Yes | Exact branch, or All Shops when authorized |
| `due_date` | Yes | Verified YYYY-MM-DD agency/reference date |
| `frequency` | Yes | Monthly, Quarterly, Semiannual, Annual, Event-based, Custom |
| `owner` | Yes | Responsible department/person, ≤120 characters |
| `source_reference` | Yes | Reference identifier for independent checking |

Effect: add-only `Draft` compliance items. An imported source reference is not a file upload or proof that any government submission was accepted or verified. Compliance approval stages remain separate; statutory due dates must be checked independently.

### Document Reference Manifest — Employee Documents

| Exact column | Required | Input details |
| --- | --- | --- |
| `employee_id` | Yes | Existing employee in selected branch |
| `document_type` | Yes | Name of employee document, ≤120 characters |
| `file_name` | Yes | PDF/DOCX/JPG/JPEG/PNG filename reference, ≤200 characters |
| `source_reference` | Yes | HR file custodian or archive reference, ≤200 characters |

Effect: **file reference metadata only** in a distinct HRMS reference register. The actual file is not uploaded, associated Employee 201 required-document status stays unchanged, and no signed/verified copy is invented. Upload/view/review real files individually in the secure future file-store workflow.

## Existing imports left intact

- Employee 201: Patch 24 add-only bulk employee roster.
- Government Deductions: Patch 23 independent agency schedule drafts; uploads do not activate legal contribution tables.
- Canonical Payroll Attendance: Patch 23 XLSX/CSV with guided validation; legacy `PayrollWorkspace.tsx` CSV preview remains a non-production, unmounted legacy component (do not use it as a second importer).

## Not an import bypass

Actual incident and disciplinary histories, approval decisions, government proof files, employee identity documents, and final-pay evidence should not be batch-created as *approved* or *verified* statuses from unreviewed spreadsheets. Production requires secure file persistence, server-side authorization and rollback.
