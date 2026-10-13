# UCMM HR — UI Alignment: Formal Payslip, Recruitment, Holiday Calendar, Leave Modal

Updated files only · 2026-10-13 · Frontend demo

## Installation / prerequisites
Apply this incrementally to the repository with the earlier **Combined Mock Dataset**, **Recruitment/Interview Calendar**, **Batch 1 Payroll & Employee**, **Vercel Type Hotfix**, and **Attendance/Formal Payslip** patches already installed. Extract the archive and overwrite **only** matching files, preserving the relative paths. Don't create a nested folder or delete existing modules.

The Underchargers document logo introduced by the previous attendance/formal payslip patch must remain at `public/underchargers-document-logo.png`.

## Changes in this patch
1. **Payslip History → View**: full formal payslip displayed inline inside the viewing modal (same document markup used for printing), with the UC logo at the upper center, employee and attendance/rate details on the left, earnings/deductions/Net Pay on the right. The source document remains a print-friendly A4/Letter layout.
2. **Payslip tools**: informational demo/legacy note above action buttons; `Print ▾` with A4/Letter Print/Save PDF; `Signature ▾` with demo On-Device, Phone/QR and Print/Upload options. The detailed signing panel appears only on request, not on every View. Existing signing-reference controls are preserved. Incomplete legacy records cannot prepare a fresh request or open the on-device signing canvas.
3. **Recruitment**: four summary counters below the existing three horizontal feature cards resized to compact 2 × 2 stats rather than tall square tiles. Calendar stays on the right.
4. **Holiday Calendar**: desktop form/calendar ratio 40%/60%, with single-column portrait form controls and a larger calendar. Small screens stack both sections.
5. **Leave Request Review**: portrait modal with two columns for short details, separate full-width narrative and decision areas, and a sticky review-action footer.
6. **Global consistency**: focused sizing, spacing, borders and responsive adjustments for the affected UI; other module logic untouched.

## Review after Vercel deployment
- Recruitment & Hiring: check desktop and half-screen; 3 cards upper-left, 4 compact summary cards below, calendar right.
- Payroll Management → Holiday Calendar: calendar receives roughly 60% of available width on desktop; form stays portrait and stacked; narrower screens stack sections.
- Leave Management → open a pending request: two-column details; readable portrait dialog; remarks and approve/decline at bottom.
- Payroll Management → Payslip History → View: formal document appears within modal. Check logo, employee details on left, gross/deductions/net on right, notes + Print/Signature menus. Check A4/Letter printing.
- Open legacy payslip: see **LEGACY / INCOMPLETE** warning; itemized values must not be fabricated; signing request action disabled. Confirm existing issued sample references remain intact.

## Validation / limitations
- TypeScript/TSX syntax checked across 58 source files; CSS tokenized without stylesheet parse errors.
- Sample formal payslip markup was generated from TypeScript with the exact UC logo path; actual headless visual capture could not finish in the environment.
- **Full Next.js production build and Vercel/browser visual QA not verified** here because the dependency tree is not available in the local runtime. Validate on Vercel before rollout.
- Demo payroll/signature workflows remain browser-local. No statutory payroll computations, secure identity verification, payment processing, or remote signing backend added in this UI patch.
