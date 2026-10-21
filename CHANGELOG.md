# HRMS Main Extension — Employee Demographics & HR Forms
Date: 2026-10-21

## New: Employee Demographics & Compensation
- Dedicated sidebar module (not merely a filter in Reports).
- Independent **job level** classification: Rank-and-File, Supervisory, Managerial, Not recorded.
- Independent **employment arrangement**: Regular, Probationary (explicit assignment only), Contractual, Project-Based, Seasonal, Casual, Fixed-Term, Other, Not recorded.
- Existing status remains distinct from arrangement. Legacy explicit Regular / Project-Based / etc status can be displayed as a fallback; a probationary lifecycle status alone never implies a contract type.
- Records classification directly on Employee 201 HRPerson objects without altering salary, employment status, approval processes or payroll releases. Displays these fields within the Employee 201 full profile.
- Branch, department, status, level, arrangement, age-band, tenure-band and recorded-gender summaries, including unknowns.
- Male, female and unspecified basic-rate totals (monthly and annualized), with missing-conversion counts. Effective-dated rate changes are considered.
- Daily-paid staff need a recorded monthly working-day divisor for estimated monthly/annualized totals. Monthly-paid staff need that divisor before a daily minimum-wage reference comparison.
- User-selected historical wage-reference comparison: at, above, below or not comparable. This is **NOT a legal minimum-wage determination**.
- Aggregate summary CSV and employee reference CSV, with formula-injection mitigation and without raw government IDs.

## New: HR Forms & Document Requests
- Separate sidebar workspace with a request register, dynamic typed forms, branch-scoped Employee 201 association, validations and searchable statuses.
- 15 internal documentation templates: overtime, internal work authorization, leave documentation, dispute/grievance, document requests, attendance correction, schedule changes, incident statement, asset clearance, COE, policy acknowledgment, Notice to Explain response, return-to-work clearance, field assignment, separation/clearance.
- Save drafts, submit, return for revision, revise/resubmit, approve documentation and reject; reason required for returns/rejections, and self-approval restricted.
- Editable browser-local demo records with decision history, metadata-only audit events, and unsigned TXT draft downloads.
- Browser-local registry is role/branch scoped, and reset-demo actions clear the new local store.
- Universal notification bell shows pending documentation review and returned requests with no extra bell.

## Permissions / preservation
- HR and Ms Kate have normal HR access; Ms Kate retains her separate final-approval authority.
- BM can submit and see only its own UC Mandaluyong demo forms; cannot approve.
- Super Admin access is retained; demo maker-checker check applies.
- Existing Docs, leave, payroll, legal/official forms, final pay and CMS/Accounting workflows are not mutated by documentation decisions.
- No ERP connection. No new external database or service integration.

## Updated or new source files
- app/page.tsx
- lib/mock.ts
- lib/hrState.tsx
- lib/employeeDemographics.ts (new)
- lib/hrForms.ts (new)
- components/EmployeeDemographicsWorkspace.tsx (new)
- components/HRFormsRequestsWorkspace.tsx (new)
- components/HROperationsExtras.module.css (new)
- components/workspace/EmployeeFullRecord.tsx
- components/DashboardExtras.tsx
- components/ModuleAlerts.tsx
