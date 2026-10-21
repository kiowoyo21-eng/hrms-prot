# HRMS Master Revision V6 — Attendance, Leave, Loan and Payroll Controls

Date: 2026-10-21. Scope: browser-local HRMS frontend only. Apply over Main V5 including Ms Kate's HR-role correction.

## New and revised

- Payroll → Generate Payslips → Attendance Upload now supports CSV preview, header validation, branch/cutoff checks, employee-ID matching, duplicate dates, malformed punches, incomplete attendance, and approved-OT evidence checks.
- File import has a 1.5 MB UI cap and a 6,000 attendance-row parser limit. Import is staged and cannot be saved when any error remains.
- Saved attendance rows remain separate from upload metadata. Explicit Uploaded → For Verification → Verified/Needs Correction review is required. Legacy metadata with no matching rows cannot authorize a payslip.
- Before payslip approval, attendance must be Verified for the specific employee's branch/cutoff and complete for all employed dates in the week. A summary flags missing/incomplete rows, leave days and mismatched day/OT figures.
- Prevents replacement of cutoff attendance evidence after submitted/approved drafts or demo payroll release for that branch/cutoff.
- Review Payslip Draft now displays a read-only leave/loan reconciliation summary from existing browser-local records, matched by name and branch as unverified leads. Conflicting leave evidence or outstanding loans require documented reconciliation remarks before demo approval.
- Draft status changes check that submission starts at Draft and approval starts at For Review; recorded demo releases retain existing duplicate/destination checks.
- Branch switching clears stale attendance import/branch and draft-review notes. Changes are recorded through existing audit functions without copying raw CSV or payment amounts into audit summaries.
- New helper modules: `lib/attendanceReview.ts`, `lib/payrollReconciliation.ts`.

## Non-changes and guardrails

- No direct biometric connection, real bank release, statutory entitlement calculation, loan collection, or Accounting integration.
- No automatic leave pay or loan deductions from browser-local name matching. All amounts require independent HR/Accounting verification.
- The existing Ms Kate HR permissions and special approval authority remain unchanged.
- Existing Employee 201, leave records, payroll batches/releases and prior final-pay workflow are not migrated or overwritten.
- No ERP integration or dependency.
