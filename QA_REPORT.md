# QA Report — HRMS Employee Demographics & Forms

## Verified on reconstructed HRMS Main V10 workspace
- 133 TS / TSX files parsed with **0 parser errors**.
- 386 relative imports checked with **0 missing files**.
- Dedicated shared CSS stylesheet parsed (51 rules, 0 errors).
- `lib/hrForms.ts` passes strict standalone TypeScript checking.
- `lib/employeeDemographics.ts` passes strict TypeScript checking using an isolated compatible type stub for HRPerson (full app compilation NOT implied).
- **59 focused assertions passed** on demographic rate conversions, monthly/annual summary (male, female, unspecified), null/missing values, historical rates, reference wage classification, age/tenure, report CSV escaping; form validation, 15 schemas, reviewer authorization, prohibited self-approval, branch isolation, status transitions, final decision duplication, decision history and unsigned draft export.
- Existing module IDs remain intact; new module IDs are included in permissions, navigation, shortcuts and universal notification display.
- No existing source-record release function or cross-app synchronization code modified.

## Not verified
- `npm run build` / Vercel deployment: React/Next/npm dependencies are not installed in the local environment. TypeScript parser checks alone do not guarantee full compilation.
- Actual browser click-through at desktop/mobile breakpoints; responsive CSS is present but untested visually.
- Authentic payroll or legal compliance correctness. Salary annualization excludes bonuses, overtime and actual wages paid; wage comparisons are informational.
- Persistence and multi-user concurrency across devices, due to browser-local-only state.

## Required Vercel / browser smoke checklist
1. Build succeeds on Vercel with no unresolved type errors.
2. HR, Ms Kate and Super Admin open Demographics; BM cannot access Demographics.
3. HR/Ms Kate update classification and confirm Employee 201 profile reflects it.
4. Choose a minimum-wage reference, verify noncomparable records remain noncomparable.
5. Confirm missing daily-rate conversion data does not inflate totals; annualized total is 12x monthly for computable rates.
6. Download aggregate CSV and employee listing; review for raw ID exposure and unsafe formulas.
7. BM submits a form tied to its own branch, HR account can review; BM cannot approve.
8. HR submitting a form cannot self-approve even with HR role.
9. Return with reason, revise/resubmit, reject, approve, confirm statuses and unsigned draft download.
10. Confirm one notification bell across modules, no clipped overlays, responsive tables and forms.
11. Verify existing Payroll, Employee 201, Docs, Assets, Incident, Ms Kate special final approvals and V10 Audit screens continue working.
