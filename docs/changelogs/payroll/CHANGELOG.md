# Payroll — Implemented changes

## 2026-10-22 · HRMS Batch 03 (source implementation; browser QA pending)

Single ₱755 NCR general non-agriculture reference card on Employee Pay Rates. Existing payroll config and employee salary ledgers unchanged.

Refer to `docs/revisions/batches/BATCH-03.md` for file mapping and validation status.

## 2026-10-22 — Post-Batch-04 UI correction (Batch 05)

Government deduction reference pop-ups use portaled, centered operational dialogs, small version/status/brackets chips, selectable saved version, a searchable 10-row paginated bracket scroller, and persistent approval/propose/import actions. SSS, PhilHealth, Pag-IBIG and BIR share the design; existing schedule versions, validation, handlers, and demo-only approvals remain.

Affected source: `components/PayrollOperationsHub.tsx`, `app/globals.css`. **Source-level changes only; browser QA remains unverified.**

## 2026-10-25 — Patch 23: Guided bulk data uploads

- Implemented agency-specific blank XLSX and CSV download templates for SSS, PhilHealth, Pag-IBIG, and weekly BIR withholding reference brackets.
- Added field-by-field, step-by-step in-app guide and maintained a full documented importing standard in `docs/guides/BULK-DATA-IMPORT-STANDARD.md`.
- Replaced naïve CSV parsing with structured CSV/XLSX import, row error messages, strict dates/ranges, overlap detection, scope-labeled preview modal and download error report.
- Government uploads stage a new **draft only** after a clean preview; actual statutory verification, formula correctness and remittance remain outside the browser demo.
- Extended existing Attendance import to accept the same documented downloadable CSV/XLSX templates, modal preview, and downloadable error report.
- No previous schedule or employee data was overwritten. Other potential bulk entry screens remain subject to module-specific integration.
