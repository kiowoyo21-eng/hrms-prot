# Underchargers HR — Frontend Workflow Review

Next.js / React / TypeScript frontend review project (post-Phase 16 consolidated workflow simplification release).

## What's different

One local master employee record is used by Employee 201, Payroll Rate Management, Payroll earnings/deduction reference inputs, Asset Accountability, Employee Document Submission, Dashboard and quick Reports. The data is persisted in browser localStorage for testing and can be reset under Account Settings.

For feature-by-feature completed/pending status, see **`docs/WORKFLOW-RELIABILITY-REVIEW.md`**.

## Deploy

Upload the ZIP contents directly into the existing GitHub repository root and commit. Vercel will build the Next.js application from `package.json`. Delete retired components if they still exist in GitHub (see `docs/GITHUB-LEGACY-CLEANUP.md`).

## Important safety and validation

**This is not a real HR database or legally verified payroll system.** Fictional credentials and records are accessible in browser source. Role restrictions are only for review, and localStorage is not suitable for actual employee records. No secure signing links, official contribution tables or real payments are connected. A production-ready system will need Supabase/Auth/RLS, confidential storage, legal rate validation, approval workflows, audit controls and testing.

Full production build could not be run locally because dependencies could not be downloaded from the npm registry in this environment. Do not enter real personal data, upload confidential documents, or process real payroll on this site.
