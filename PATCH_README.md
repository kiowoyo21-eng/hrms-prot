# Install — Ms Kate Special Final Approval

## Prerequisites
- Apply this patch on top of the current HRMS project including **HRMS Main V4 — Employee Lifecycle**, and any previously deployed Universal UI/Notifications and Docs/Sheets patches.
- The files were prepared against a locally reconstructed version using the 2026-10-20 consolidated HRMS archive and sequential incremental revisions available in the conversation. If your current GitHub source has additional unshared changes in one of the three modified files, manually merge rather than overwrite them.

## GitHub website only
1. Extract this ZIP on your Mac. **Do not upload the ZIP as a repo file.**
2. In your `kiowoyo21-eng/hrms-prot` GitHub repository, create/upload the new files at exactly:
   - `lib/finalApproval.ts`
   - `components/MsKateApprovalWorkspace.tsx`
   - `components/MsKateApprovalWorkspace.module.css`
3. Replace/merge the modified source files at exactly:
   - `app/page.tsx`
   - `lib/mock.ts`
   - `lib/auditTrail.ts`
4. Commit all six source changes together to `main` and wait for Vercel's Next.js build.
5. If the build fails, send the first actual error with the new commit hash; full Next build could not be completed in the authoring environment.
6. Use the account button **Special Final Approver — Ms Kate** at login to auto-fill demo credentials. If manually signing in, username is `mskate`, demo password is `mskate-demo12345` (never use in production).
7. Navigate **Ms Kate Approvals**, select branch **All Shops**, open `CMS-DEMO-DR-001`, then test Approve, Return, and Reject on separate Accounting-approved demo requests. Confirm pending-accounting and stale-accounting items are action-disabled.
8. Sign in as HR, BM, and Super Admin. Their existing logins must still work; only Ms Kate's assigned demo account may record final approval. Super Admin has overview, not approval delegation.

## Demo data and storage
- Requests are **immutable code fixtures** prefixed `CMS-DEMO-` or `HRMS-DEMO-`, not synchronized live records.
- Browser-local final decisions use a new, separate storage key `uc-hr-final-approval-demo-decisions-v1`; pre-existing HRMS localStorage keys and content are unchanged.
- Approval decisions are isolated from CMS request metadata, HRMS employee/payroll data, and release processing.
- Existing audit trail is reused (`uc-hr-ui-audit-trail-v2`). Approval history and other browser data are not reliable legal audit evidence.
- To retest all actions without removing other HRMS data, use a separate private browser session or clear **only** the final-approval demo decisions key using browser developer tools. No auto-reset is executed by this patch.

## NOT IMPLEMENTED
- Real CMS/Accounting data ingestion or write-back, shared database, Accounting approvals, payment processing, real attachments/downloads, production login or authorization, durable/tamper-evident audit, multi-device sync.
- No ERP APIs, database references, synchronization, dependencies, or status links.

See `INTEGRATION_REQUIREMENTS.md` and `QA_REPORT.md`.
