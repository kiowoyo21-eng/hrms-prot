# Underchargers HR — Employee 201, Payroll & Hiring Frontend Revision

Date: 2026-10-12  
Scope: Full source archive based on **Underchargers_HR_PWA_Vercel_Asset_Type_Fix_2026-10-12.zip**. Previous system-wide UI/UX and Asset Accountability updates retained.

## Employee 201

- Directory now provides **View** and **Edit** per employee.
- Employee **Profile** and **Documents** are now the only two employee tabs.
- Profile is one continuous scroll through Employee Details, Employment Details, Salary & Benefits, Performance Reviews, Employment History, Clearance & Assigned Assets, with compact anchor links.
- View mode is read-only. Edit mode enables personal information and selected non-controlled employment information, plus direct HR workflows. Branch transfers, promotions and compensation/rate overrides remain controlled processes.
- Profile edit requires **Save Profile Changes**. Unsaved changes prompt before opening cross-module actions.
- From edit mode, **Assign Device** opens the available device inventory with this employee preselected. **Edit Pay Rates** opens Payroll Management with the rate editor for this employee.
- Salary & Benefits shows **Total Salary Received**, total gross, total deductions and release count for This Month / This Year / All Time, plus an expandable Salary History. Totals sum **Released + Salary** net payroll release records only; pending/other categories are excluded.

## Employee Documents

Folders: **Onboarding Files**, **Compliance & Other Forms**, **NOV / NTE**, **Payslips**.

- Folder selection shows a 65% file list + 35% preview area on wide screens. Small screens stack the two areas. Enlarge Preview expands to an overlay.
- File and PDF page Previous/Next controls are available. PDF page count detection is best-effort; browsers' built-in PDF viewer provides its own page navigation.
- Payslips populate from the shared frontend payroll release ledger, rather than independent hard-coded files. The two-page **sample payslip preview** clearly identifies itself as **not officially issued**.
- Existing required-document statuses and prior BM submission filenames **do not contain real file bytes**, so they show honest unavailable-preview messages. PDF/image previews are supported for files chosen while Employee 201 stays open. DOC/DOCX are listed, but need an external viewer; there is no permanent upload/storage.
- Confidential file storage, version history, verification, signed payslips, employee authentication and actual document generation are backend tasks.

## Payroll Management

Payroll main tab order:
1. **Employee Pay Rates** — searchable employee list and individual premium rate editor.
2. **Government Deductions** — with **Employee Deductions** and **Government Deduction Tables** sub-tabs. Employee SSS/PhilHealth/Pag-IBIG/BIR/loan amounts are shown per employee with explicit View/Edit, Save and Cancel. Fictional starting values are **not official rates**.
3. **Payroll Processing** — preserved the existing weekly payroll, Thu–Wed cutoff, attendance preview, premium inputs, approvals, holidays and payslips.
4. **13th-Month Pay** — existing review-only view, still requires an eligible basic salary ledger and applicable company/labor-law calculations.
5. **Payroll Funding & Release** — existing funding comparison plus **Record Sample Salary Release** and ledger for UI testing, linked to Employee 201.
6. **Government Remittances** — existing tracking.

- Government schedule imports: **CSV proposal** (min,max,employee,employer,effective); validation checks for invalid or overlapping bracket rows. XLSX import and activation of official government tables have **not** been implemented. Uploaded rows are for review only, never automatically active for legal deduction calculations.
- All payroll releases in the sample ledger represent **fictional reference records**. Adding a sample release does not approve, fund or disburse actual payroll. Production must use immutable, verified, authorized payroll batches.

## Recruitment & Hiring

- **Shortlist** action is now accessible in the applicant list and applicant details.
- Restricts stage advancement to the next workflow stage. Interview scheduling and Passed outcome are checked before interview advancement. Hired requires verified listed requirements. Real Employee 201 conversion remains pending backend.
- Rejecting requires a written decision reason and user confirmation.
- Screening changes create a browser-stored applicant history; New Applicant screening notifications appear in Recruitment.

## Frontend / Security Limitations

- Existing browser-local sample data and fake login accounts remain for frontend review only. Do **not** use real employee records or confidential government IDs.
- Real upload persistence, document viewing after refresh, actual payslip issuance, statutory deductions, payroll approvals, QR signing, secure authentication/RLS and durable audit logs await the secured backend.
- Reset browser data only using the existing review mechanism if a clean sample state is required; existing profiles may contain browser-saved versions.

## Validation

- Offline TypeScript parse: 31 TS/TSX files, 0 syntax diagnostics.
- All project-relative imports resolvable.
- PostCSS parsed `app/globals.css` without errors.
- Offline TypeScript type check, with local dependency type stubs: 0 diagnostics. This is **not a substitute** for a real dependency installation / `next build`.
- npm registry was unavailable in the execution environment (EAI_AGAIN). Verify final result through a Vercel deployment.

## Manual test sequence after deployment

1. Sign in as a **review-only** HR or Super Admin account and open Employee 201. Verify directory View and Edit buttons.
2. Select one sample employee; confirm two tabs only. Check profile anchor links and continuous scroll.
3. Enter Edit, change non-controlled fields, save and re-open to verify browser persistence. Try action with unsaved changes and confirm prompt.
4. Select Assign Device: verify Assets opens available inventory with selected employee prefilled. Return to Employee 201 and open Edit Pay Rates: verify Payroll rate editor opens for that employee.
5. Open Documents and try all four folders, sample Payslips, Next/Previous pages and Expand; upload a temporary PDF or image for preview and check that it is not claimed as permanently saved.
6. Visit Payroll Management → Government Deductions → Employee Deductions. Edit and save a sample value. Switch to Government Deduction Tables; import a test CSV (proposals only).
7. Visit Payroll Funding & Release. Record a fictional Salary release and verify Employee 201 total and Payslips update. Check month/year/all-time filters.
8. Visit Recruitment. Shortlist a New Applicant from the table, then schedule an interview and verify subsequent stage actions. Check rejection requires a reason.
9. Verify Government Compliance, Leave, Incident Reports, Assets, `/apply`, `/report`, and role-specific menu entries still open as before.
