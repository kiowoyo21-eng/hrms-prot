# Installation — HRMS Main Module UI & Data Integrity V2

This ZIP contains **five source files only**, plus documentation. This is NOT a full project.

**Required base:** Latest HRMS project including Employee 201 V2, Payroll Batches, Docs V6, Universal UI V1 and Universal Notifications V2/V3. The patch was developed against the latest source snapshot available in this conversation, not pulled live from your GitHub repository.

Use the GitHub website (`kiowoyo21-eng/hrms-prot`, `main` branch):

1. Extract the ZIP on your device. Do NOT upload the ZIP file itself.
2. Create a new `lib/branchRecordViews.ts` in the repository and paste/upload the file.
3. Replace these four files at their exact matching paths:
   - `components/EmployeeWorkspace.tsx`
   - `components/PayrollOperationsHub.tsx`
   - `components/AssetWorkspace.tsx`
   - `components/IncidentWorkspace.tsx`
4. Commit **all five changes together** to `main`.
5. Wait for Vercel to build commit and hard-refresh browser (`Cmd+Shift+R` on Mac).
6. Confirm the Employee 201, Payroll, Asset, and Incident flows described in `QA_REPORT.md`.

**Merge warning:** If these four existing components were separately edited in your GitHub repo after the Universal Notifications V2 baseline, review and merge conflicting changes instead of overwriting blindly. Universal Notifications V3 changed `components/ModuleAlerts.tsx` only and is not touched by this patch.

**Safety:** These checks improve UI scoping, not secure backend authorization. All underlying HRMS data remains browser-local. A successful syntax check does not establish a successful Next.js/Vercel build.
