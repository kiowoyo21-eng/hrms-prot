# HRMS Main Revision V3 — Asset Custody & Incident Integrity
Date: 2026-10-20
Type: Incremental frontend patch (four source files)

## Assets & Devices
- Add explicit **Request Return** action for Assigned assets. A nonempty reason is required and stored in the asset's browser-local notes. Status becomes **For Return** while the employee remains the custodian.
- Make **Receive Return** available for Assigned and For Return devices. Require separate confirmations of return-document review **and physical receipt** before setting the device to Inspection.
- Add **Reinspect** for devices in Maintenance, so a repair can end in Available, continued Maintenance or Retired.
- Clear current custodian, signing method, officer and temporary signature metadata only after completing the inspection (all three outcomes). Retain a simple previous-custodian reference in history.
- Reject an inspection outcome of Available if its condition is Damaged or For Inspection.
- Block accidental assignments to employees outside the asset's registered branch, including when All Shops is selected.
- Avoid duplicate asset IDs with a dedicated AST-series generator; validate trimmed name and serial.
- Keep the new return-request form in view when opened; use the browser-local date instead of UTC date for new lifecycle entries.
- Preserve V2 branch-filtered list and detail view behavior and existing audit/change tracking.

## Incident Reports
- Restrict new-report Employee 201 selectors to the report branch and case-link selectors to the selected case's branch (including for HR in All Shops).
- When changing report branch, clear old verified employee IDs; reset open case state on role/branch changes.
- Prevent closure unless two distinct, existing Employee 201 IDs match the incident's branch.
- Keep narrative stage reasons, case notes and takeover reasons in the case's restricted local notes without duplicating their text into action timeline entries.
- Reject case comment/file/identity/takeover changes to closed cases at the handler layer, not only by hiding buttons.
- Use collision-resistant session attachment IDs and avoid putting attachment filenames in timeline entries.

## Scope / limitations
- No changes to Employee 201 core data, Payroll, payslips, notification bell, or server permissions.
- Browser-local data is a prototype: not an authoritative custody ledger, compliant confidential incident system, or proof of signed handovers.
- No full Next.js production build or interactive browser regression has been verified yet; see QA_REPORT.md.
