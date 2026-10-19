# HRMS: Editable Spreadsheet with Admin Approval (Frontend Patch)

## Entry points
- New **Spreadsheets** item in the HRMS sidebar; opens `/spreadsheets` in a NEW browser tab.
- Reports & Analytics → Spreadsheet Workspace → **Open Spreadsheets**.
- Payroll Management → Payslip History / Drafts & Approval → **Separate Sheet**.
- Direct URL `/spreadsheets?sheet=payslip-drafts` or `/spreadsheets?sheet=payroll-releases`.

## Workflow
1. Sign in as HR (`hraccount`) in the prototype.
2. Open Spreadsheets, select an existing worksheet or the blank `Working Sheet`.
3. The grid and formula bar are READ ONLY. Submit a reason (>=12 characters) for that worksheet.
4. Sign out, then sign in as Super Admin (`admin`) in the SAME browser (or a different tab in the same browser profile). Open Spreadsheets → Admin Approvals.
5. Approve / deny the pending request. Approval lasts **60 minutes**, for **that requester and worksheet only**. Super Admin may revoke at any time.
6. Sign in as HR again, return to `/spreadsheets`, select that sheet, and edit values or formulas. Multi-cell tab/newline paste is supported; actions are checked against CURRENT approval at save time.
7. Super Admin can create new blank worksheets. HR must request access separately before editing each of them.

## Grid features
- Column letters, numbered rows, select/edit cells, formula bar
- Worksheet tabs, built-in report data and blank worksheet
- Simple formulas: `=A2+B2`, `=SUM(J2:J10)`, `=AVERAGE(A2:A10)`, `MIN`, `MAX`, `COUNT`
- Multi-cell paste, add rows/columns (approval required), CSV download, print/PDF preview
- On-browser approval / cell-edit activity log

## Boundaries and important cautions
- This is NOT Google Sheets, Excel, or a production-grade spreadsheet engine; it is a lightweight browser-local spreadsheet prototype. No `.xlsx` round-trip, collaboration or protected formula ranges yet.
- **Reports are live read-only data until the first approved edit.** The first edit freezes a local working-copy snapshot to prevent subsequent HRMS record changes from shifting edits onto other employees or payslips. Edits do NOT update payroll releases, payslip drafts, employee basic rates, attendance, bank instructions, or approval statuses. Existing payroll authorization remains separate.
- **ALL requests, approvals, and edits live in the same browser's localStorage.** Requests do not notify an admin on another device/browser and editing does not sync between devices.
- **This is not secure authorization.** Browser storage/session can be altered, the prototype uses demo credentials, and the audit trail is not tamper-proof. Production must implement authenticated accounts, database-backed approvals, fine-grained RBAC checks per write, row/sheet versioning, append-only audit events, secure storage and notification delivery on the backend.
- Only HR may request editing; Super Admin is reviewer (cannot self-approve or directly edit cells); BM cannot access the spreadsheet route.

## Install
Extract the patch ZIP in the *root of the existing HRMS project*, preserve folder paths and overwrite matching files. Run `npm run dev`. Since the patch has no new package dependencies, no package.json changes are required. It is based on the **previous spreadsheet-updated HRMS** version; apply that earlier spreadsheet patch first if not already applied.
