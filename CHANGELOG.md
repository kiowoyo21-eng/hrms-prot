# CHANGELOG — Ms Kate HR Role Inheritance Correction (2026-10-21)

## Intended permission architecture

Ms Kate is a dedicated *HR + Final Approval* role, not an approval-only user:

- Ms Kate has exactly the same module navigation access as HR, **plus** `final-approvals`.
- HR retains existing modules and may not enter the final-approval queue through HR permissions.
- Ms Kate does not inherit Super Admin privileges or the ability to grant edit requests, approve templates, or create privileged source templates.
- The single `mskate` demo login and the existing Super Admin, HR, and BM logins are preserved.
- Final decisions still require the special role AND assigned Ms Kate demo account; Accounting approval must precede them.

## Code changes

1. `lib/mock.ts` — shared `isHrRole` helper; Ms Kate inherits HR modules plus final approvals.
2. `lib/studio/types.ts`, `lib/studio/store.ts` — retain actual role identity, permit HR-equivalent Document Studio access/request flows, and keep Super Admin-only grants and template approval protected. Replaces/supersedes prior Studio actor type workaround.
3. `lib/spreadsheetStore.ts`, `components/SpreadsheetWorkspace.tsx` — permit HR-equivalent editing requests and approved working-sheet edits only; still require Super Admin grant.
4. `app/studio/page.tsx`, `app/studio/docs/[id]/page.tsx`, `app/studio/pdf/[id]/page.tsx`, `lib/studio/pdfOutputs.ts` — apply HR-equivalent template restrictions and edit-request UI to Ms Kate.
5. `components/AssetWorkspace.tsx`, `components/ComplianceWorkspace.tsx`, `components/TemplateLibraryWorkspace.tsx` — align HR-equivalent controls and actions.
6. `components/RecruitmentWorkspace.tsx` — preserve Ms Kate role in local recruitment history, rather than mislabel it BM.
7. `components/DashboardExtras.tsx` — show normal HR quick-action shortcuts for Ms Kate.

**No payroll computation, official employee data, existing demo credentials, CMS integration, Accounting integration, ERP integration, or disbursement release function changed.**
