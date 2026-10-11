# Underchargers HR PWA — Phase 2 (Frontend)

**Stack:** Next.js 15, React 19, TypeScript, Lucide. This is a UI prototype with in-memory mock data, not a secure production application.

## What's new in Phase 2
- Employee 201 directory with name, ID, branch and employment-status filters.
- New employee wizard-like form (HR / Super Admin in demo) for employment starting status, probation months, daily OR monthly salary and employee-specific SIL/VIL allocation/eligibility.
- Profile view with Overview, Employment, Salary & Benefits, Documents and History tabs.
- Branch filtering and BM access preview; the BM cannot use Add Employee in this UI.
- Existing Phase 1 dashboard, login demo, sidebar, task badges, grouped logs and settings retained.

## Deployment — direct GitHub upload
1. Extract the ZIP.
2. Upload the **contents of this folder**, including `package.json` and `app/`, into the root of your GitHub repo (replace Phase 1 files with same names).
3. Commit. Existing Vercel Git integration should deploy the new commit automatically.
4. Use Next.js Framework Preset and `./` root directory.

If GitHub does not accept folder dragging, upload files with their paths using GitHub web upload or an appropriate repository editor; do not upload the ZIP itself as the app.

## Demo accounts — DEVELOPMENT ONLY
- `admin` / `admin12345`
- `hraccount` / `hraccount12345`
- `bmaccount` / `bm12345`

These credentials are visible in frontend code. **Do not upload employee information, sensitive documents, or use this as an actual HR login.** All Phase 2 employee additions are lost on browser refresh. No live files are uploaded or persisted.

## Run locally (optional)
`npm install` then `npm run dev`; run `npm run build` before production use.

## Next phase
Design and review frontend workflows for hiring, document templates, payroll and calendar; then approve incremental database blueprints, implement proper Supabase Auth and RLS, and connect one module at a time. The Phase 2 UI is not connected to Supabase.
