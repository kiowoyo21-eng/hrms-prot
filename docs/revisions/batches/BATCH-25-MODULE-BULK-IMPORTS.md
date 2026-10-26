# Batch 25 — Combined HRMS Module Bulk Imports

Status: Implemented in frontend source, verified by focused validators, TSX syntax/import check, and regressions. Full Next.js build/browser QA: not verified.

Baseline: `hrms-prot-main(4).zip` with Patches 22, 23 and 24 applied. Combined delivery may include Patch 24 to make deployment a single overlay over Patch 23.

### New implementations

- Asset Inventory: `components/AssetWorkspace.tsx` and shared dialog/library; new unassigned inventory, serial/branch checks.
- Leave Management: actual current opening allocations, explicit replacement acknowledgment and employee timeline entry. No historical ledger backfill.
- Recruitment: add-only applicants in `New Applicant` stage, no retroactive approvals.
- Payroll Employee Pay Rates: effective-dated add-only pay-rate history, source reference and duplicate checking.
- Compliance: add-only `Draft` references. No verified government filings created.
- Employee Documents: separate file-reference manifest ONLY, **not uploads or real submission statuses**.
- Shared validator, Excel/CSV generator, detailed guide, preview, downloadable issue report and modal handling.

### Scope boundaries

No new backend; no secure file storage; no actual employee data upload authorized. No import of verified government remittances, signed forms, case decisions, or actual banking details. No fabricated values. All actions obey existing module editor permissions and branch scopes in current frontend; do not confuse browser UI guards with server enforcement.

### Required QA

Run `node scripts/check-module-bulk-import-patch25.cjs` plus existing Patch 23/24 and other regression suites. Run actual `npm run lint`, `npm run build` and browser (390/768/1024px) tests after install. Verify that all six buttons, guides, downloads and modal confirmations work with a **fictional-only** dataset. Verify storage persistence only in the same browser and check duplicate/add-only/replace limitations.
