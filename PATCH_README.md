# PATCH README — Ms Kate inherits HR rights + unique final approval

## Apply order

1. Existing HRMS main project and Ms Kate Special Final Approver V1 patch must already be present.
2. Apply the previous `ShieldCheck` navigation icon fix (`app/page.tsx`) if the Vercel deployment has not yet passed that check.
3. **Apply THIS patch instead of the old `hrms-vercel-ms-kate-studio-actor-type-fix-patch-only.zip`.** It safely supersedes that `lib/studio/store.ts` workaround by preserving Ms Kate's full role identity.
4. Extract this ZIP, preserving paths. In GitHub Web, update/upload the source files to their *matching folders*, commit them together to `main`, then review the new Vercel deployment.
5. Do not upload the ZIP itself into the GitHub repository; don't delete or reset any localStorage keys.

## Expected account behavior

- `hraccount`: existing HR features; no special final approvals.
- `mskate`: all existing HR modules plus Ms Kate Approvals; HR-based edit requests work but still need Super Admin review. All audit/session records retain the Ms Kate role.
- `admin`: existing Super Admin features; can oversee the Ms Kate queue but cannot execute Ms Kate's final-approval action via Super Admin authority.
- `bmaccount`: existing BM permissions only.

## Manual browser checks after build

- Log in as Ms Kate: Dashboard, Employee 201, Payroll, Leave, Assets, Recruitment, Compliance, Documents, Drive, Spreadsheets, Document Library, Audit Logs and Settings must be visible alongside Ms Kate Approvals.
- Use a standalone Docs editor and Spreadsheet working copy: Ms Kate can request edit approval; she cannot grant herself one. Super Admin can grant the usual HR edit approval; Ms Kate can then edit that approved item while the grant remains valid.
- Verify Ms Kate cannot change template approval states, approve spreadsheet edit requests, or bypass payroll release/Accounting-first checks.
- Confirm HR cannot access Ms Kate final-approval decisions; BM still has BM navigation; Super Admin retains its existing functions.

## Scope limits

**Browser-local prototype only.** The UI permissions are NOT server-side authorization. The CMS/Accounting request queue remains DEMO, has no live sync, and does not authorize real payment. No ERP connection exists or is proposed. Production requires shared-database authentication, RLS, atomic versioned approvals, event delivery, and tamper-evident audit.
