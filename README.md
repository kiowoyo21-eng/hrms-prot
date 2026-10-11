# Underchargers HR PWA — Consolidated Frontend Review Patch (Phase 16)

Complete Next.js / TypeScript frontend **review environment** incorporating approved revisions from the Phase 15 source.

## Setup

1. Upload all extracted project files to the root of the existing GitHub repository.
2. Vercel should redeploy automatically if the repository is connected.
3. Build locally when dependencies are available: `npm install && npm run build`.
4. Read **docs/FRONTEND-REVISION-CHECKLIST.md** for an honest completed/partial/pending checklist.

## Review accounts only

- Super Admin: `admin` / `admin12345`
- HR: `hraccount` / `hraccount12345`
- BM: `bmaccount` / `bmaccount12345`

**Do not use these credentials for a real company deployment.** Login state is frontend-only with hardcoded review credentials. The employee records are fictional; actions are in-memory or some browser-session-only previews. Real authentication, row-level authorization, auditable approvals, signed documents, private employee records, payroll calculations and real statutory schedules are **not** installed.

The review environment indicator remains in the UI; feature cards do not repetitively show “Demo.” Do not input real confidential employee information.

## Code organization

- `app/page.tsx`: role-filtered shell and Dashboard.
- `lib/mock.ts`: branches, roles, module permissions, review credentials and tasks.
- `lib/people.ts`: shared fictional employee directory reference data.
- `components/EmployeeWorkspace.tsx`: Employee 201 directory, profiles and HR personnel workflows.
- `components/PayrollOperationsHub.tsx`: employee rates, statutes, funding, remittance and 13th month tabs.
- `components/PayrollWorkspace.tsx`: previous weekly payroll UI with employee OT profile linkage.
- `components/AssetWorkspace.tsx`: per-employee asset assignment and retrieval.
- `components/DocumentOperationsHub.tsx`, `DocumentIntake.tsx`: library, BM submissions and individual signing request preparation.
- `components/DashboardExtras.tsx`: Quick Actions, severity groups and HR reports.
- `components/ReportsLanding.tsx`: guided quick filters, optional advanced reporting.
- `components/HelpButton.tsx`: detailed contextual information dialogs.

## Validation caveat

TypeScript/JSX **syntax** checked using local TypeScript parser. Production compilation / full type checking was not possible because the required React/Next.js packages are not available offline. Please review build logs in Vercel and report the first genuine compiler error for remediation.
