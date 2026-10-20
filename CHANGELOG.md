# HRMS Employee 201 Revision — 2026-10-20

## Changed/new source files

- `lib/employee201Rates.ts` **new** — one shared, read-only calculation of effective basic/daily/hourly/OT/HP/SHP/RDW/RDOT values. Explicit divisor/hour settings are required for derived rates. Provides masked government identifier preview for workbook exports.
- `lib/workbookRegistry.ts` **updated** — 8 Employee 201-specific worksheets: Directory, Personal & Emergency, Employment, Compensation & Premiums, Recorded Rate Changes, Masked Government Details, Document Checklist, Assignment History; source-linked and branch-scoped.
- `lib/reportSheetData.ts` **updated** — Employee Directory now shows effective basic rate after applicable recorded changes instead of the stale original rate.
- `components/EmployeeWorkspace.tsx` **updated** — "Open in Spreadsheet" button in Employee 201; opens new browser tab with the active HRMS branch filter.
- `components/workspace/EmployeeFullRecord.tsx` **updated** — profile rate preview uses the shared calculator and shows the rate-effective date; pay controls stay in Payroll.
- `lib/studio/variables.ts` **updated** — Docs auto-fill uses the same rate preview as Employee 201 and exposes more personnel/emergency/leave allocation and rate-effective-date tokens.

## No changes

- No changes to payroll approvals, released payslips, batch IDs, the login demo accounts, Drive edit restrictions, or back-end authorization.
- Excel workbooks remain read-only source references; approved working-copy edits do not update the master Employee 201 source.

## Not yet production-ready

This is frontend-only. Government IDs are masked for spreadsheet rows, but browser storage and the existing Employee 201 interface are not secure storage. Never enter real employee PII until authenticated backend controls and encrypted storage are implemented. Real DOCX/Sheets parity remains separate work.
