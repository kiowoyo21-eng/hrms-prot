# Install: HRMS Main V5 (patch only)

**Required baseline:** The consolidated HRMS code with Main V4 Employee Lifecycle and the corrected Ms Kate HR role inheritance (not the earlier approval-only guard). This patch was assembled against the locally available prior patch archives, not a live checkout of GitHub `main`.

## Exact source paths

1. `components/FinalPayReviewPanel.tsx` — NEW
2. `components/FinalPayReviewPanel.module.css` — NEW
3. `components/PayrollOperationsHub.tsx` — REPLACE
4. `lib/finalPayReview.ts` — NEW
5. `lib/hrState.tsx` — REPLACE
6. `lib/payrollConfig.ts` — REPLACE
7. `lib/employeeLifecycle.ts` — REPLACE (Ms Kate HR role access for lifecycle steps)

For GitHub website upload, extract ZIP, upload files into those **existing folders**, commit all seven together to `main`, and verify Vercel. Never upload the ZIP as one repository file. Check for conflicts if your live repository has newer changes in any of the four replaced files.

## Demo exercise

1. Sign in with HR, Ms Kate, or Super Admin and open **Employee 201**. Submit and complete an **Offboard** lifecycle review with required checklists and physical asset returns. Super Admin must apply the lifecycle case (employee becomes Clearance Pending).
2. Open **Payroll Management → Final Pay & Clearance**. Prepare a review from an eligible offboarding handoff.
3. Fill each itemized field from verified source documents and enter the five reconciliation references, then **Save preparation** and **Submit saved draft for HR review**.
4. Sign out and sign in as **another authorized HR user**. Review details, confirm the requirements, add an 8+ character decision reference, and record **HR Reviewed**. You cannot independently review your own preparation.
5. Record **Accounting Handoff (Demo)**: this saves local preparation status only. It is not a real Accounting request, approval, Ms Kate final decision, or fund release.
6. Try switching branches, reopening a returned draft, duplicate preparation, assigning an unreturned asset, or leaving a payslip draft unreleased; the review should block as described.

## Important

- Loan register currently stores an independent browser-local ledger and is not a verified bank/accounting ledger. The loan entry is a **manually reconciled** provisional amount, and a supporting SOA/authorization reference is mandatory. Do not import name-matched loans as definitive deductions.
- Amount inputs are **not statutory entitlement calculations**. Validate applicable Philippine labor rules, final payroll cutoffs, remittances and lawful deductions externally before any payout.
- Browser-local data and audit logs are not tamper-proof. Production requires shared database RLS, server-side access checks and immutable decision logs.
- No connection to ERP under any circumstances.
