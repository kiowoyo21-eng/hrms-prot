# GitHub Web Installation — HRMS Main V6

This is an **incremental patch**, NOT the full HRMS project. It assumes Main V5 and the Ms Kate HR-role inheritance correction are already installed. Prefer the latest repository versions over earlier cumulative archives.

1. Extract the ZIP on your Mac.
2. Open the existing HRMS repository on GitHub (main branch).
3. Upload/replace files **inside matching folders**:
   - `components/PayrollOperationsHub.tsx` (replace)
   - `lib/attendanceUpload.ts` (replace)
   - `lib/attendanceReview.ts` (new)
   - `lib/payrollReconciliation.ts` (new)
4. Keep every other source file and `package.json` unchanged. Commit all four files in one commit.
5. In Vercel, review the new deployment's full build log (including TypeScript). If failed, share the FIRST build error.
6. Test in browser: Payroll → Generate Payslips → attendance CSV import (valid/error), cutoff verification, draft review, branch switch, leave/loan reconciliation, approval/release guarding.

Example CSV columns:

`Employee ID,Date,Time In,Time Out,Status,Approved OT Hours,OT Approved,Notes`

The selected **Cutoff Thursday** starts a seven-day period (Thu–Wed). Use exact Employee 201 IDs and branches. No save when any CSV issue remains. Complete employee/day coverage and human review are required to approve a new draft.

**Important:** In this frontend demo, `Verified` is a manually reviewed state, not proof of biometric authenticity or real approval. Existing browser data is not backed up or synced across devices. Do not upload real sensitive employee punch records or financial details until a secure production backend exists.
