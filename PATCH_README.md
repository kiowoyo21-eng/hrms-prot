# UCMM HR System — Attendance-Linked Payroll + Formal UC Payslip
Updated files only · 13 October 2026 · Demo frontend

## How to apply
This patch is incremental. Start with your GitHub repository AFTER the previously supplied:
1) Combined Mock Employees / Devices / Hiring / Attendance patch
2) Recruitment Stacked Cards / Interview Calendar patch
3) Batch 1 Payroll & Employee patch
4) Vercel Type Fix + Recruitment Layout patch

Extract the ZIP. Upload each listed file to the SAME relative path in your existing repository; overwrite only matching files. Do not upload a parent/nested folder. Include the new `public/underchargers-document-logo.png` asset exactly under `public/` or the logo won't render.

## Changes
- Attendance Records appears first in the Payroll Management feature grid.
- September–October sample records: 35 demo employees and 2,135 daily rows; Time In, Time Out, paid hours, late minutes, overtime, status and CSV.
- Oct 14–31 show simulated future punches visibly but marked `Future Demo`; cannot become payroll drafts.
- Generate Payslips: selected employee + Thursday start automatically loads daily attendance; displays the cutoff records, worked days, provisional daily equivalent, late, paid leave, and OT.
- Drafts calculate a DEMO base from attended days (and matching approved paid leave), late adjustment, approved OT preview, allowances and optional holiday premium. Monthly pay uses provisional `monthly * 12 / 52` with demo unpaid day adjustments based on `monthly / 26`. HR must verify divisor and payroll rules.
- Saved drafts preserve worked days, paid hours, daily equivalent, paid/unpaid leave, late minutes, and earnings/deduction lines for printing.
- Sample batch drafts also derive attendance per employee; skip incomplete/future cutoffs.
- Payslip History → View → Print/Save PDF now opens a formal document with the exact supplied Underchargers black logo at top-center, attendance & rates, itemized earnings/deductions, Net Pay, and signature lines.
- Existing generic HR printable documents also use the UC logo at top-center.
- Old demo payslip releases missing source breakdown are explicitly marked `LEGACY DEMO RECORD — INCOMPLETE DETAIL`; the patch does not invent a basic pay, days worked or statutory deductions for them.

## How to test
1. Payroll Management → Attendance Records → September 2026; select employee, verify Time In/Out and CSV.
2. October 2026 shows simulated future punches clearly marked; Oct 14–31 are NOT payable real records.
3. Payroll Management → Generate Payslips → select employee and a past Thursday cutoff (e.g. September 3, October 1 or October 8). Cutoff preview auto-populates.
4. Review Gross, SSS, PhilHealth, Pag-IBIG, BIR, loans and Net. Create draft. If incomplete punches, enter an HR review note. Attendance-upload verification is still required for approving/releasing the demo.
5. Approve/release a demo draft via existing local workflow. Payslip History → View → Print/Save PDF. Confirm actual logo loads from `/underchargers-document-logo.png` and the document shows daily equivalent, worked days and detailed deductions.
6. View an old sample release; it must show a warning, not misleading `Basic Pay ₱0`.

## Limits / safety
This is NOT production payroll. Sample attendance is synthetic; CSV upload does not store actual clock records securely, and reference statutory tables and pay divisors require HR/Finance validation. The assumption of 8:00 AM–5:00 PM with one unpaid lunch hour is configurable only in a future backend. Government deductions still require approved demo schedules and lawful calculation verification. Real employee pay, signatures and downloads require production backend, audit and verification. Do not enter confidential employee data in local review storage.

## Checks
TypeScript/TSX syntax parsed, isolated payroll utility type checks passed, 35 employees/2,135 demo records checked, print HTML generated with logo and Net Pay; CSS parsed. Full Next.js production build and graphical print-browser testing were NOT completed in this environment: dependencies unavailable and headless screenshot attempt timed out. Run Vercel build and on-device QA before any use.
