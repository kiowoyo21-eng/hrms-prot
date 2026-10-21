# INSTALLATION — HRMS Employee Demographics & Forms Patch

This ZIP is **changed/new files only**. It is based on the latest locally available HRMS Main V10 workspace, NOT a live checkout of your GitHub branch.

## GitHub website installation
1. Confirm the HRMS Main V10 and prior Ms Kate HR-role correction and previous patches are in your repository.
2. Download/extract the ZIP. Open the `app/`, `lib/` and `components/` directories.
3. For each source file in this package, upload or replace the corresponding file **at the identical relative repository path**. If GitHub has newer edits to any file, compare and merge rather than blindly overwrite.
4. Commit changes together to `main`. Wait for Vercel and inspect the deployment. If it fails, send the first TypeScript/webpack error log.
5. Sign in with existing HR, Ms Kate or Super Admin demo roles. Open **Employee Demographics**; for forms, open **HR Forms & Requests**. BM sees forms only.
6. Verify the branch selector, missing-field counts, age groups, compensation summary, salary reference date, classification edits, data exports, form drafts, submission and separate reviewer actions, downloaded TXT draft, notification center and reset operation.

## What is NOT in this patch
- NO live CMS, Accounting or ERP integrations.
- NO legal submission, real employment permit, government-certified minimum wage check, biometric verification, verified digital signature or guaranteed lawful employment document.
- NO automatic posting from documentation request to Leave, Payroll, 201 status, attendance, funds release or government filing.
- NO employee self-service login; BM/HR submit demo request records linked to Employee 201.
- Browser localStorage remains demonstration-only and is not safe for real confidential HR or grievance records.

## Pending QA
The npm dependency tree was unavailable locally; an end-to-end Next.js/Vercel build and browser screenshot/click-through were NOT verified. See `QA_REPORT.md`.
