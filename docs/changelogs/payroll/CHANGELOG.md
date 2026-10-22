# Payroll — Implemented changes

## 2026-10-22 · HRMS Batch 03 (source implementation; browser QA pending)

Single ₱755 NCR general non-agriculture reference card on Employee Pay Rates. Existing payroll config and employee salary ledgers unchanged.

Refer to `docs/revisions/batches/BATCH-03.md` for file mapping and validation status.

## 2026-10-22 — Post-Batch-04 UI correction (Batch 05)

Government deduction reference pop-ups use portaled, centered operational dialogs, small version/status/brackets chips, selectable saved version, a searchable 10-row paginated bracket scroller, and persistent approval/propose/import actions. SSS, PhilHealth, Pag-IBIG and BIR share the design; existing schedule versions, validation, handlers, and demo-only approvals remain.

Affected source: `components/PayrollOperationsHub.tsx`, `app/globals.css`. **Source-level changes only; browser QA remains unverified.**
