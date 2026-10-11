# Underchargers HR PWA — Phase 5 Frontend

This is a complete **replacement source project** containing all previous Phase 1–4 frontend modules plus the Phase 5 Payroll Workspace.

## Deploy using GitHub + Vercel (no IDE required)
1. Extract the ZIP on your computer.
2. Upload **the files inside this folder** into your existing GitHub repo root, preserving folders (`app/`, `components/`, `docs/`, `lib/`, `public/`).
3. Replace matching files and commit. The Vercel integration can redeploy automatically.
4. Keep Vercel Framework = Next.js, Root Directory = `./` if `package.json` is at the repo root.

## Phase 5 features
- Thursday–Wednesday cutoff navigation
- Demo payroll register and branch filter
- Rate settings, holiday calendar, attendance CSV preview
- Deduction and computation previews, approval status simulation, payslip list, CSV export
- Architecture notes and checklist at `docs/PHASE-5-*.md`

## Critical warning
All logins and data are frontend mock-ups. Demo payroll uses deliberately simplified formulas and is **not suitable for real pay, legal/tax/benefit compliance, actual approvals or real confidential employee data**. No Supabase backend has been configured. Demo state resets on refresh.

The existing Phase 4 Document Workspace and other preceding modules remain in this project.
