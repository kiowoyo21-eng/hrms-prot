# UCMM HR — Automatic Cutoff Payroll + Attendance Upload Alerts

**Updated-files-only ZIP · October 13, 2026**

Install **after** `UCMM_HR_2026-10-13_PAYSLIP_DETAILS_FUNCTION_AUDIT_UPDATE_ONLY.zip`. Upload the files to your existing GitHub repository **at their exact paths**, replacing matching files. **Do not create a wrapper folder and do not reset existing HR data.**

## Updated / new paths

1. `app/globals.css` — responsive 40/60 upload/status layout, portrait HR approval modal
2. `app/page.tsx` — global payroll-cutoff alert publisher mounted on the dashboard
3. `components/PayrollOperationsHub.tsx` — attendance upload flow, cutoff settings, approval queue and one-click demo release
4. `components/DemoAttendanceExplorer.tsx` — demo attendance no longer copies simulated days to a payroll draft
5. `components/PayrollCutoffAlertPublisher.tsx` — **new**, dashboard/global notification logic
6. `lib/attendanceUpload.ts` — **new**, CSV parse/validation, coverage, cutoff and reminder utilities
7. `lib/autoPayroll.ts` — **new**, idempotent attendance-backed demo payroll computation
8. `lib/payrollConfig.ts` — saved imported punches, batch identifiers, reminder settings and source references

## User workflow

1. Go to **Payroll Management → Automatic Payroll & Approval** or **Attendance Records → Upload Attendance**.
2. Choose **Branch** and the appropriate **Thursday cutoff start** (Wednesday cutoff end is filled automatically).
3. Export your Excel attendance register **as CSV**. Use the Download CSV Template button to see required column headings. **Direct `.xlsx` import is not implemented in this patch.**
4. Provide one row for each employee/date in the cutoff. A complete week has seven statuses per employee: `Present`, `Absent`, `Rest Day`, or `On Leave`. Present rows need both Time In and Time Out (24-hour `HH:MM` or `h:mm AM/PM`). `Approved OT Hours` requires `OT Approved=Yes`.
5. Select CSV and review its preview. Click **Save Attendance & Auto-Compute** once. Rows and upload status save in browser localStorage; a structurally valid upload is marked **Validated CSV**, *not* trusted biometrics.
6. Once the entire Thursday–Wednesday cutoff has ended (on the next date check while the app is open, including on the Dashboard), the system automatically prepares **For Review** payroll records only for employees with complete and valid daily coverage. Missing punches, gaps, unverified leave, zero-pay exceptions and insufficient gross remain on hold with stated reasons.
7. HR opens a compact **portrait approval modal** and selects **Approve & Record Payslip**. This records a **DEMO release only**, with an itemized payslip in Payslip History; no cash is paid or transferred. Already approved/released records are not automatically overwritten.

## Reminder behavior

- Default: alert **two days before cutoff**; configurable in Payroll Management (1–5 days).
- Another alert on **cutoff Wednesday** if the branch has not uploaded attendance.
- **Overdue** attendance and incomplete-employee holds appear in notifications and on the Dashboard when the app is open.
- The reminder rule uses existing **Thursday–Wednesday weekly cutoffs**. Government monthly reference contributions retain the existing maximum four collection slots per month (subject to statutory review).
- Alerts are **in-app, not phone push, email or backend background tasks**. Open tabs refresh cutoff dates periodically; no alerts or calculations run while the app is fully closed, but pending uploads reconcile next time it is opened.

## Protections / preserved functionality

- Employee IDs must match the employee directory **in the chosen branch**, with dates inside the cutoff.
- Quoted CSV fields, duplicated employee/day, invalid times, missing Time Out, incorrect statuses, or unapproved OT are detected; a CSV containing invalid rows is rejected before save.
- Maximum: 6,000 rows or 1.2MB per CSV import. Original file bytes are **not** stored or uploaded to Supabase.
- Existing sample releases and completed approved records are preserved. Old metadata-only attendance uploads must be **re-imported** to supply actual rows; metadata by itself cannot fund payroll.
- Repeated opening of the app does not generate duplicate attendance-linked draft rows; provisional attendance-backed drafts can recalculate after fresh imports or changes to pay rates, deductions or loans.
- Payroll approval requires cutoff closure, matching validated rows and complete date coverage. Employee rates and stored government reference versions drive calculations.
- The employee demo payslip includes worked days, salary type/rate, earnings, reference deductions, loan installments and Net Pay; no separate manual Generate Draft step.

## Critical production limitations

**This remains a browser-local HR prototype**, not a verified production payroll/attendance system. Neither CSV upload status nor its `OT Approved` flag proves manager authentication. Company shifts/rest days, approved leave classifications, holidays, ECOLA, real overtime, pay divisor, tax, current statutory contribution rules and approvals require HR/finance validation. Secure file storage, multi-user synchronization, tamper-resistant audit logs, biometric/app integration and legally enforceable signatures require a real authenticated backend. Avoid actual personal/payroll data in this demo.

## QA performed

- Parsed **62 TS/TSX files** with no syntax errors; PostCSS successfully parsed global stylesheet.
- Focused functional test passed: quoted CSV, valid employee/cutoff mapping, seven-date coverage, gross−deductions=net, no duplicate computation, rejection of incomplete/out-of-period/duplicate/unknown-ID/unapproved-OT rows, reminder timing and prevention of past approval overwrites.
- **Not completed here:** production `next build`, deployed browser click-through, mobile screenshot QA, Supabase/API integration, current Philippine statutory compliance testing.
- Following Vercel deployment, review one uploaded **past** cutoff, one incomplete employee, a repeat upload of the same cutoff and duplicate release protection.
