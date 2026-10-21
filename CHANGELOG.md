# HRMS Main V5 — Payroll + Employee Lifecycle Final-Pay Preparation

## Added
- Payroll Control Center > **Final Pay & Clearance** review area.
- Separate, browser-local `FinalPayCase` records linked by unique Employee 201 offboarding case ID and employee ID.
- Manual, itemized provisional wages/earnings and deductions; review references and explicit separation date.
- Maker-checker workflow: Draft → For HR Review → HR Reviewed → Accounting Handoff (Demo); Return for Correction.
- Review history and events through existing local Audit Trail (no amounts or reference text in audit summaries).
- Clearance blockers for reopened/missing offboarding, branch mismatch, outstanding assets, unreleased regular payroll drafts, missing evidence, or invalid numbers.
- Ms Kate can use normal HR final-pay preparation permissions; her exceptional disbursement final approval is intentionally not exercised here.

## Changed
- `lib/employeeLifecycle.ts`: Ms Kate now inherits HR permissions for lifecycle submission and checklist verification without inheriting Super Admin-only final application.
- `lib/hrState.tsx`: optional persisted `finalPayCases` collection with backward-compatible loading, audit group; existing localStorage key unchanged.
- `lib/payrollConfig.ts`: `PayrollArea` extended with `finalpay`.
- `components/PayrollOperationsHub.tsx`: new category card and integrated review screen; existing payroll approval and payslip paths unchanged.

## Explicit non-features
- No real Accounting/CMS sync, no salary transfer, no government or final-pay legal calculator, no automatic deductions, no payment release, no new Ms Kate disbursement request, no ERP integration.
