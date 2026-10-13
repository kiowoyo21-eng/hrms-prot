# UCMM HR — Portrait Dialogs and Formal Payslip Layout (October 13, 2026)

**Update-only patch.** This contains three changed source files and this README, not a complete project. Apply after the `UCMM_HR_2026-10-13_UI_PAYSLIP_RECRUITMENT_HOLIDAY_LEAVE_UPDATE_ONLY.zip` patch. Maintain the existing logo at `public/underchargers-document-logo.png` (provided by the earlier Attendance & Formal Payslip patch).

## Changes

1. `lib/printPayslip.ts`: formal, print-friendly portrait payslip with original UC logo at top center, employee payslip title, HR-configurable company address, pay period/date/employee information, salary type and cutoff rate reference, days worked, earnings, deductions, Net Pay, and Received By line. Earnings include Basic, ECOLA, worked days, OT hours/rate/pay, paid leave (split from basic when available), additional rest-day/holiday duty premium, allowances and Gross. Deductions show SSS, PhilHealth, Pag-IBIG, BIR, available loan types, Cash Advance, Late (already reflected in basic pay if applicable), Other, and Total. Removed the standalone Attendance & Rate Summary section and the prepared-by/notes footers. Layout defaults to straight vertical, with an optional side-by-side earnings/deductions choice for HR.
2. `components/PayrollOperationsHub.tsx`: the same payslip format is used in embedded View Payslip and Print/Save PDF; HR has a `Customize Format` control for document title, address, layout and optional employee metadata. Saving these **appearance-only** settings to browser localStorage does not alter payslip financial records and does not synchronize across devices.
3. `app/globals.css`: portrait widths for standard approval/detail dialogs (Leave, Loan, Assets, Employee quick views), with consistent sizing, padding and scroll. Complex full-case workspaces, wide tables, calendars, signing/document previews retain the width required to be usable. The payslip view is now sized as a portrait document rather than a widescreen dashboard.

## Data integrity

- No payroll calculation formulas, attendance logs, employees, loan ledger values, leave approvals, or government tables were changed.
- Never fills in unknown historical amounts. Old gross-only releases show known Gross/Deductions/Net and `—` for unavailable itemized lines. Monthly historical rate also remains unknown unless a saved detailed draft exists. For a complete monthly draft, a *26-day monthly rate reference* is derived from the stored daily equivalent; HR should verify the appropriate rate/divisor.
- ECOLA has no independent stored payroll field; it is shown as `—` rather than a fabricated amount. Paid leave is separated visually from saved Basic Pay only when paid-leave day count and daily equivalent are available. This does not change Gross.
- Separate loan categories appear when saved loan IDs can be matched to local ledger providers; otherwise the deduction is shown as Employee Loan.
- Late adjustments were included in the current demo basic-pay calculation, so the Late line indicates the minutes and does **not** double-deduct them.
- The browser demo is not a legally verified payroll/remote signing workflow. Official payroll release and HR template permissions require production back-end policies and statutory review.

## Test after installing

1. Payroll > Payslip History > View Payslip: portrait preview, logo, date, employee, salary type, days worked, earnings, deductions, Net Pay, Received By.
2. As an authorized HR role, open `Customize Format`, edit the address, set the layout, and `Save Format (This Browser)`; confirm preview and Print/Save PDF match. Reopen the modal after refresh and verify the settings persist on the same browser.
3. Compare one complete saved release and one legacy sample release; legacy must **not** show invented daily rate/days, and actions requiring complete breakdown must remain unavailable.
4. Open an ordinary Leave / Assets / Employee / Loan modal; it should now read as a portrait dialog without pushing a long table off-screen. Complex IR case details are intentionally not compressed.
5. Run the real Next.js/Vercel build and review in desktop, tablet, mobile and printed A4. The full Next.js build is not verified here because Next/React dependencies are not installed in this runtime.
