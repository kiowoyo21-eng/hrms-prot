# UCMM HR: Consolidated Review Fixes + Salary Destination (2026-10-15)

## Installation

This is a **changed/new-files-only patch** relative to the 2026-10-12 integrated full project **after** the 2026-10-13 UI/workflows patch has been applied. Upload the contents at repository root preserving `app/`, `components/`, `lib/`, and `docs/` paths; overwrite matching files. Do not upload the ZIP as a single repository file. GitHub-to-Vercel may trigger automatic builds when you commit; none were triggered while preparing this patch.

## Updates included

1. **Salary destination for payroll** — Employee 201 → Salary & Benefits supports `BDO Payroll`, `Other Bank`, `GCash`, and `GoTyme` (one current payout destination). Records account holder, bank name where relevant, and *dummy last-four digits only*. Any change resets verification. HR may mark `Demo Checked` or `Needs Correction`. This is **not** bank or wallet account validation.
2. **Payroll handoff** — Generate Payslips shows current destination and verification status, blocks **sample** release when destination is missing/unchecked; release keeps a masked destination snapshot. Payslip History and a sample Accounting Handoff CSV show masked reference and payroll figures, **not payment execution**. Demo draft approval and demo release are different steps.
3. **Government deductions** — only `Reviewed for Demo` schedules count as approved. Employee list now distinguishes the reference **monthly SSS, PhilHealth, Pag-IBIG amounts** from amounts withheld for the selected **weekly Thursday–Wednesday cutoff**. The demo's preexisting convention applies monthly amounts to the first cutoff ending each month, so later cutoffs legitimately show zero actual monthly shares. These are provisional estimates, not an official payroll engine.
4. **Holidays** — Add/Edit Holiday context and list show reference worked-day / worked-rest-day percentages for regular holiday, special non-working, and special working classifications. Verify up-to-date law and workplace-specific conditions before real use. Adding a holiday does not itself verify attendance or pay.
5. **Recruitment** — deduplicates Resume/Resume-CV; prevents submitted/verified file statuses without filename metadata; initial screening checklist; position-specific interview ratings, required before recording evaluation and final onboarding decision. `Confirm Hired` now asks for initial salary type and approved base rate, then creates an Employee 201 browser-local record with link to applicant ID, transfer history and requirement status **metadata**. Actual file bytes do not transfer.
6. **Applicant portal preview** — one token for all requirements, expires after 1 hour, rotating token invalidates old URL. `app/requirements` previews the applicant's checklist **only if the same browser has the applicant's localStorage record**. No cross-device upload or real file auto-save is claimed or available; applicant-specific remote uploading needs authenticated backend APIs and secure file storage.
7. **Incident Reports** — supplied missing `lib/incidentRecords.ts` types/seed/document helper, and removed the duplicate in-page notification bell. A single module-header alert remains.
8. **Responsive** — medium 1:1 agency cards (less cramped), compact cards/forms where content is sparse, added hiring, payout, and deductions styling; retained employee-directory responsive fixes from prior patch.

## Important remaining backend / legal tasks

- **Real salary payments:** HR should propose/update payout details; authorized verifier validates beneficiary and bank/wallet ownership through an approved process; Accounting separately approves disbursement and confirms successful bank transfer. Encrypt full bank/wallet account details server-side with role-based controls; do not store them in browser localStorage or CSV exports. This patch intentionally accepts *only fictitious last-four-digit reference data*.
- **Actual applicant uploads:** identity-bound time-limited links, file validation/malware scanning, upload confirmation/auto-save, private object storage, access revocation, versioned verification, rejection/resubmission, and retention rules. The demo link is NOT ready to send to real applicants.
- **E-signatures:** backend-issued and signed tokens, signer verification, immutable signed document, timestamps, audit trail and legal review. Demo canvas or a drawn signature is not a verified e-signature.
- **Government deductions and holidays:** verify current agency schedules, true income bases, taxable benefits/exemptions, applicability, employee vs employer portions, rest days, absences and weekly withholding rules before production. Avoid double withholding across cutoffs and do not infer official compliance from demo statuses.
- **Accounting and audit logs:** authoritative release IDs, approvals/segregation of duties, error handling, immutable audit trail, confidential incident/document access, backend data integrity and monitoring. Existing role flags are not security boundaries.
- **Attendance/payroll:** employer-approved attendance must inform hours, holiday premiums, PTO and payslip before approval and payout. Current browser-local payroll remains a review prototype.

## Validation performed

- **43** TS/TSX source files parsed with the TypeScript parser: **0 syntax errors**.
- Static relative import resolution: **0 missing modules**.
- Patch ZIP paths and archive integrity tested.
- **No `next build`, Vercel deployment, or full dependency-backed typecheck** was performed. Full production integration is not verified.
