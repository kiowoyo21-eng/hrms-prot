# Targeted QA — Automatic Cutoff Payroll

## Automated PASS

- RFC4180-style CSV quotes / comma-containing notes.
- Employee ID verified against chosen branch; dates in selected Thursday–Wednesday cutoff.
- Valid 7-day status coverage creates 1 auto payroll record after cutoff.
- Auto record: status For Review, source Uploaded CSV, itemized deductions, reconciled gross-minus-deductions and net.
- Re-running the engine is idempotent and does not make a second record.
- Missing dates, absent Time Out, duplicate employee/date, unknown employee and unapproved OT prevent a payable draft.
- Before-cutoff, on-cutoff and overdue reminder categories.
- Approved payroll records not auto-mutated.
- 62 TypeScript/TSX files parse without errors; PostCSS parse successful.

## Manual deployment checks required

1. Log in as HR or Admin; Dashboard payroll notification should appear on the applicable reminder days.
2. Navigate Payroll → Automatic Payroll & Approval; select a past Thursday cutoff with full records.
3. Upload a CSV matching the template. Verify invalid CSV is rejected with an error and valid CSV previews all rows.
4. Save CSV. Check Attendance Records now lists the persisted actual rows (not merely metadata).
5. Check completed employees appear automatically in For Review, held employees show stated issues; no manual Generate Draft action.
6. Review portrait modal; check deductions add up, HR Approve & Record Payslip only creates one demo release.
7. Open Payslip History; compare Days Worked and Salary Type / Rate with the CSV and Employee 201.
8. Change a saved cutoff after approval: UI must prevent overwriting finalized payroll.
9. Test Vercel build, mobile responsiveness, multiple browsers, role permissions and print output.

## Not verified

Full Next.js build and React browser runtime were unavailable because React/Next dependencies are not installed in this environment. Supabase persistence, app biometrics, real attendance authenticity, secure approvals, legal payroll rules and production readiness are NOT established.
