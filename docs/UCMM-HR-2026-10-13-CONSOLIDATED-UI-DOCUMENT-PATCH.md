# UCMM HR — Consolidated UI & Document Workflow Update (October 13, 2026)

## Installation: UPDATED FILES ONLY

This ZIP is a source patch, not the whole project. Extract the ZIP, then copy/overwrite the files at the **same relative paths** in the root of the existing `hrms-prot` GitHub repository. Do not put them inside an extra nested folder. Preserve all existing files not included in this archive. Review Vercel staging after committing.

## UI and module changes

1. **Global shell:** only Workspace breadcrumb and branch selector in topbar; module-specific bell/actions inside the module, no duplicated bell at the top.
2. **Module toolbars:** standardized compact summaries and action placement across Payroll, Incident Reports, Employee 201, Assets and Government Compliance. Compliance `Agency Calendar` and `Add Requirement` are now above the agency cards.
3. **Action badges:** attention counters use subtle red indicator styles, rather than repeating yellow/neutral styling for every action-required state. This is a visual classification of existing demo alerts, not a live backend task engine.
4. **Cards/calendar:** larger balanced navigation-card grids with consistent card internals, controlled Government Compliance tiles and square/date-proportional Holiday Calendar cells.
5. **Employee Directory:** corrected the `.emp201-responsive-cards` vs `.employee201-responsive-cards` selector mismatch so desktop table and compact-screen cards do not render simultaneously.
6. **Leave Management:** Add Leave Request / Incentive Credit form opens in an overlay; records and filters stay visible underneath, and Escape closes the dialog.
7. **Incident Reports:** read-only complete original report is in the RIGHT column, followed by case timeline and HR oversight; stage processing stays on top. Signing UI is collapsed behind the Review / Sign control until needed.
8. **Minimum Wage labels:** automotive-facing small-service/retail reference no longer includes `Agriculture` in the user-facing classification; eligibility must still be independently verified before applying any lower rate.

## Document workflows

- **Onboarding:** separate `Applicant Upload Requirements` from `Company-Issued Forms & Signatures`. Applicant-only upload demo links continue to expire after 1 hour. Company forms are not included as upload requests.
- **Company documents:** company PDF/image must be selected in the current browser to display the REAL content in the document preview. If the file is missing, the on-device signature pad is disabled. The user must check that they reviewed the document before interacting with the demo pad.
- **Incident documents:** review/sign panel is opened explicitly from the document tab and displays the attached PDF/image for that tab. Case notes are not treated as an approved notice or contract.
- **Payslip acknowledgments:** on-device review displays a payroll sample statement tied to the exact sample release. It is explicitly not an official issued payslip and does not create a verified signed record.
- **Asset accountability:** the complete accountability terms/form remain visible when the on-device signature preview is chosen.
- **Recipient upload portal:** only applicant upload requirements have the Choose File control; company-issued forms are identified separately as awaiting secure signing delivery.

## Important limits and security

- There is **no live Supabase authentication, file storage, signing link, signature validity verification, approved template versioning, or cross-device recipient portal** in this frontend snapshot.
- Uploaded company PDF/image bytes are **session-only**, and the existing applicant link stores only filenames in the same browser. Do not test with personal IDs or real confidential employee documents.
- A drawn demo signature is NOT a signed or tamper-evidently archived document; no truthful "Signed" record is created by drawing.
- The generic `HR-Verified Signing Status` in onboarding is still a manual reference for later verified document workflows; it is not proof of a signature. A production release needs document IDs, immutable approved versions, recipient-bound expiring tokens, server-side identity/consent/audit, private signed-copy storage, access permissions and employee-file synchronization.
- Existing rate and contribution examples are for HR review and are not legally validated payroll instructions.

## Validation performed for this patch

- TypeScript/TSX source parsing: **49 files parsed, no parse errors**.
- `app/globals.css`: parsed by `tinycss2` with **0 errors**.
- ZIP has only modified/new source files, not the whole project.
- Cannot claim successful `tsc` semantic check, Next.js build or Vercel device testing: this working environment does not have installed `react`, `next`, and the project dependencies.

## Deployment review checklist

1. Open Employee 201 at desktop, side-by-side browser and phone widths; confirm exactly one directory representation and functional View/Edit.
2. Leave: launch Add Leave Request as a pop-up, submit/cancel, and verify list remains unchanged until saved.
3. Payroll: check card sizes, module-specific bell, minimum wage wording, Holiday Calendar square tiles, and exact payslip preview.
4. Government Compliance: confirm pending indicators and Calendar/Add buttons above agency cards, including narrow desktop.
5. Incident: confirm full Original Report in right-side reference column; verify that attached NTE/notice can be viewed before demo signature, with no signing possible when absent.
6. Recruitment: confirm applicant-upload and company-issued signing documents are separate. Inspect the full PDF in an on-device preview before drawing; confirm missing PDF blocks the signature canvas.
7. Confirm no false cross-device share links or stored signatures are advertised.
