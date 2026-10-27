# Batch 04 — 13th-Month Pay, Final Pay, Offboarding Deadline

Implementation checkpoint (frontend-only browser-local HRMS). Combined delivery awaits Batch 7 integration/regression QA.

## Implemented
- Verified year-to-date 13th-month entitlement from released salary basic-pay snapshots; excludes overtime, other gross premiums, sample payroll and fictional DTR estimates.
- Annual and separation-period proration using employment date and verified source periods, with hard holds for missing/overlapping or out-of-window records.
- Historical salary basic-pay reconstruction with unique date windows, documented source, maker-checker verification and audit events; pending entries are excluded.
- Prior actual 13th-month releases deducted (same employee/year), with duplicate-ID and overpayment exception flags. Annual review snapshot invalidation when earnings change.
- Managerial 13th-month company/contract coverage review: no automatic statutory assumption; reviewed exclusion returns zero, reviewed inclusion enables evidence-backed calculation.
- Separation Final Pay drafts carry an auditable 13th-month settlement snapshot; changed source evidence, manual amount mismatch, and incomplete cutoffs block HR handoff.
- Final-pay deadline from separation effective date +30 calendar days, including seven-day, three-day and overdue branch-scoped module notifications.
- Final-pay register deadline labels, actual external payment date plus voucher/reference and independent reviewer trail. No actual bank transfer or live Accounting connection.
- Preview of accumulated leave days for HR validation; other final-pay components (unpaid wages, unused leave conversion, tax refunds, lawful deductions, separation/retirement) remain verified manual fields requiring supporting documents, not invented automation.
- Stop new automatic salary drafts for employees in Clearance Pending or Separated state. Reconciliation of unpaid wages remains in Final Pay.
- Actionable payroll notification selection to relevant payroll subarea.

## Tests
- 23 isolated business-logic regression assertions (`tests/batch4-reconciliation-test.cjs`).
- 11 modified source files pass TypeScript syntax parse check.
- Full Next.js production build and browser workflows still require project dependencies and the planned Batch 7 combined QA.

## Legal reference and guardrails
- DOLE Labor Advisory 06-20 — final pay generally within 30 days of separation, unless more favorable agreement.
- PD 851 and implementation guidance — 13th month based on eligible basic salary earned, prorated on separation for covered employees.
- Statutory 13th-month coverage generally targets rank-and-file employees; managerial coverage is separately verified under company policy/contract.
- All calculations are review-oriented browser-local records. Accounting payments, security, database-level immutability and real approvals require backend integration.
