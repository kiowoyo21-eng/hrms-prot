# UCMM HR — Payslip Details & Payroll Function Fix

**Updated-files-only patch · October 13, 2026**

Apply this ZIP **after** `UCMM_HR_2026-10-13_PORTRAIT_MODAL_FORMAL_PAYSLIP_UPDATE_ONLY.zip`. Upload only the exact paths below to the root of your GitHub repository, preserving folder names. Do **not** upload a containing wrapper folder.

## Changed source paths

- `components/PayrollOperationsHub.tsx`
- `lib/hrState.tsx`
- `lib/demoPayslipSeed.ts` **(new file)**
- `lib/payrollConfig.ts`
- `lib/printPayslip.ts`
- `lib/loanLedger.ts`

## What was fixed

1. **105 original gross-only fictional sample payslips** (35 employees × 3 September 2026 cutoffs) now have deterministic attendance-linked detail records. The matching snapshot includes salary type and exact rate, days worked, OT, hourly/daily rates, gross, employee agency references, late adjustment, deductions and net. The system no longer shows `—` for all the breakdown of an untouched original sample.
2. **Safe migration on load:** only the exact original generated `SAMPLE-PAY-...` records with matching original employee names/rates and untouched original totals can be rebuilt. Records whose amounts have been changed, which have a signing record, which already have a linked detail record, or whose salary history has changed before the cutoff are NOT overwritten. Does not reset localStorage or affect manually released `Browser Review` records.
3. **New drafts** now save the exact salary-rate snapshot and show any *late reduction separately under deductions*, so Gross − Total Deductions = Net Pay with no double charging. Reference BIR calculation continues to use taxable earnings after lateness adjustment.
4. **Print / Preview** displays `Monthly — ₱20,000.00` for the sample Gabriel Aquino, Days Worked, OT, ECOLA (configured demo zero), government deduction lines, late amount, loan/cash advance, Gross and Net. A subtle DEMO DATA indicator appears on illustrative documents; it is not evidence of payment. Unknown data in manually modified historic releases is not fabricated.
5. **Duplicate protection:** releasing a new approved attendance-linked demo payslip for a cutoff removes only the **matching original fictional SAMPLE-PAY release** and its demo detail, so that employee/cutoff is not shown twice. Manually entered historical records remain untouched.
6. The 105 background sample detail records no longer crowd **Generate Payslips → Drafts & Approval**; actionable HR-created drafts remain visible.
7. **Loan repayment:** fixed the biweekly collection anchor, so an authorized loan beginning on a Thursday is first collected on the next eligible Wednesday and every other Wednesday thereafter, not one week late.

## One sample result for QA

Gabriel Aquino · UC-0001 · Sep 10–16, 2026 · illustrative only:
- Monthly salary reference ₱20,000.00
- 5 fictional attendance-worked days out of 6 scheduled days
- Gross ₱3,846.15
- Employee government reference deductions: SSS ₱250.00, PhilHealth ₱125.00, Pag-IBIG ₱50.00, BIR ₱0.00
- Total deductions ₱425.00
- Net ₱3,421.15

These are **new demo calculation results** and intentionally differ from the original fabricated-only ₱5,000.00 / ₱350.00 / ₱4,650.00 sample. They are NOT confirmed payroll amounts.

## QA after Vercel deployment

1. Reload the web app; old *untouched mock sample* records should be upgraded automatically. Do not clear storage to force the upgrade.
2. Payroll → Payslip History → September 2026 → Week Sep 10–16 → Gabriel Aquino → View: confirm monthly ₱20k, five days, detail columns, ₱3,846.15 gross, ₱425 deductions, ₱3,421.15 net.
3. Verify Print → A4 matches View and remains a portrait document with UC logo.
4. For a sample loan, select an authorized biweekly loan, test first payable Wednesday / skipped Wednesday / next due Wednesday.
5. Generate a new demo draft for a past cutoff, verify branch-specific attendance first, move Draft → For Review → Approved → Released (Demo), and confirm the same-cutoff untouched SAMPLE release is replaced only on release. This is a browser-only workflow; no real funds are sent.
6. Check one signed/edited historical record: it must remain unchanged and may still display unavailable itemized details.
7. Inspect mobile UI and actual Vercel build logs; these were not run in this sandbox.

## Important boundaries

- Attendance source remains **fictional September/October 2026 time logs**, not actual time-in/time-out, even if shown with realistic timestamps. CSV import currently saves metadata for preview and does not make imported attendance records a validated payroll source.
- Philippine mandatory contributions, BIR, ECOLA, OT/rest day/holiday calculations and the 26-day monthly divisor are *provisional demo references*, not verified compliance or an official payroll engine. Two fictional zero-work weeks show zero payable gross/net rather than a negative payslip; actual employer remittance obligations require separate review.
- Payslip format customization, approvals and signatures remain browser-local demo. No production multi-user audit integrity or automatic Supabase integration is included.
- The official company address has not been supplied; HR can set it via Customize Format.
- Existing employee pay edits and real historical releases cannot be reconstructed from total-only amounts. Such releases remain incomplete until source payroll documentation is supplied.
- See QA_REPORT.md for tested paths and unverified features.
