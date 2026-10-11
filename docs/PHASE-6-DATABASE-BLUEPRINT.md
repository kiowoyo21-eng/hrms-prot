# Phase 6 — Incremental Database Blueprint (Not Implemented)

## Shared rules
All records carry UUID primary key, legal employer/branch boundaries, employee linkage where appropriate, created/updated metadata, effective dates and audit event references. Server-side RLS and approvals are required; do not trust UI-only permissions.

## Leaves
- `leave_types`: id, organization_id, code, name, statutory_class, paid, active
- `employee_leave_policies`: employee_id, leave_type_id, eligible_from, credits, accrual_rule, effective_from/to, approver_id
- `leave_requests`: id, employee_id, type_id, from/to, requested_days, status, reason, assigned_approver, decision timestamps
- `leave_ledger`: id, employee_id, type_id, event_type, credit_delta, effective_at, request_id, immutable reference

Ensure statutory entitlements cannot be disabled by custom configuration. Accrual and forfeiture require legal/policy review.

## Loans and company cash advances
- `employee_loans`: id, employee_id, provider, loan_type, official_reference, principal, status, start_date
- `loan_amortization`: id, loan_id, period, amount_due, scheduled_cutoff, status, official_version
- `loan_deductions`: id, loan_id, payroll_line_id, amount, recorded_at
- `loan_remittances`: id, loan_id, remittance_ref, amount, remitted_at, confirmed_at
- `loan_statements`: id, loan_id, document_id, statement_date, stated_balance, verified_by
- `loan_notes`: id, loan_id, user_id, note, created_at

Deduction does not imply remittance or balance clearance. SOAs remain versioned; updated balances require reconciliation.

## Devices
- `assets`: id, organization_id, branch_id, name, model, serial_number, condition, inventory_status, created_at
- `asset_assignments`: id, asset_id, employee_id, issued_at, returned_at, signed_document_id, status
- `asset_inspections`: id, assignment_id, inspector_id, condition, findings, cleared_at, evidence_document_id
- `asset_events`: id, asset_id, action, actor_id, metadata, occurred_at

One active assignment per asset; return does not set Free until authorized inspection clearance.

## Shared documents and security
Use `documents` / `document_versions` and private Supabase Storage for SOA, proof, and signed accountability forms. Append-only `audit_events` grouped by module (`leave`, `loans`, `assets`) with branch, actor, record ID and date filters.

## Future integration constraints
Payroll reads approved leave and approved scheduled deductions only. Employee 201 links to all records. Offboarding checks unreturned assets, unsettled loans and applicable leave/final-pay rules. Support organization-specific access and effective-dated policy history.
