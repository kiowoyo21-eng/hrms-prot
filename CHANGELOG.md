# HRMS Master Revision — Main Module UI & Data Integrity (2026-10-20)

## Employee 201
- Prevent an already-selected Employee 201 profile from being displayed/edited when the active branch changes.
- Clear open employee edit/detail/action panels when changing the active branch.
- Keep existing salary-type-specific minimum/maximum filters unchanged; the inputs are deliberately disabled until a pay basis is selected.

## Payroll
- Count pending payslip reviews and outstanding signing requests only for the currently accessible branch, with All Shops showing a consolidated count.
- Avoid counting orphan signing requests that cannot be linked to a payroll release.
- Restrict draft/release views to payroll batches permitted under the active branch, including stale selections.
- Block creating a draft while a no-longer-visible batch remains selected, with clear on-screen guidance.
- Clear old batch, payslip, and employee selections on active-branch changes.
- No payroll calculations, source releases, deductions, approvals, or payouts were changed.

## Assets & Devices
- Show accessible-branch totals instead of all-company inventory totals.
- Use registered asset branch first, with accountable employee branch as legacy fallback.
- Prevent opening or processing a device from outside the active branch.
- Clear stale selections and maintain correct default branch after switching branches.

## Incident Reports
- Render the case review dialog in `document.body` via React portal so scrollable containers do not clip the overlay.
- Prevent HR report creation under another branch when a specific branch is active.
- Use more distinctive incident IDs instead of an eight-digit slice of milliseconds alone.
- Align the new incident branch picker with the active branch.

## Quality/Scope
- Added `lib/branchRecordViews.ts` for reusable, unit-tested branch selectors.
- Frontend-only browser-local revision. Real multi-user authorization requires backend enforcement.
- This patch does not modify notification bells, existing records, or persisted storage formats.
