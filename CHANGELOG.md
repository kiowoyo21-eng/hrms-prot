# HRMS Main V7 — Recruitment & Compliance Reliability
**Date:** 2026-10-21  
**Scope:** Incremental HRMS frontend patch; four new/modified source files.

## Recruitment
- Candidate selection is scoped to the active branch, including deep links opened through alerts; stale selected/decline/resume dialogs close when branch changes.
- Applicant edits are blocked when the record is outside the selected branch or the actor is the BM review role. Browser storage remains a demo, not a security boundary.
- Rejects duplicate applications for the same normalized email and position (preserves multiple different-position applications).
- Validates scheduled interview date/time and interviewer, guards unscreened/rejected/hired stages and concurrent pending interviews.
- Final hire requires a previously selected Passed candidate, in addition to existing offer, documents, signing, rate and Employee 201 duplicate checks.
- Prevents manually adding an applicant to a branch other than the currently selected branch.

## Government Compliance
- Detail modal and mutations are limited to requirements in the selected branch.
- Branch completion now requires explicit branch-status and branch-evidence references for shared/multi-branch requirements; legacy single-branch records remain supported.
- Branch-specific progress, calendar urgency and review counts don't inherit other branches' completed work.
- Multi-branch details only expose current branch's status/evidence while viewing a specific branch.
- Adds guarded stage transitions (Draft → For Approval → Approved → In Progress → Submitted → Verified; limited corrections/reopening supported). Per-branch internal verification needs an evidence reference and human confirmation; filename-only data is explicitly not official government verification.
- Rejects overlapping requirements with same agency, normalized title, due date and applicable branch; validates calendar dates.
- Annual schedule-review state is saved by agency, branch, and year, rather than leaking between agency views. Clearly labeled as local review only.

## Preserved
- No changes to payroll, loans, final pay, Ms Kate role/approval authority, Employee 201 calculations, external integrations, app routes or existing credentials.
- Existing local records retained. No migration or deletion.
- ERP remains standalone. No CMS/Accounting live sync.
