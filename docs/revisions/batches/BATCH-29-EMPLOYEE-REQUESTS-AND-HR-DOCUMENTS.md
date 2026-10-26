# Batch 29 — Employee-Originated Requests & HR-Owned Employee Files

Date: October 26, 2026 (Philippines)

## Operational division

- Employee/worker originates **Leave Requests**, COE/doc requests, attendance correction, schedule change, grievance/incident statements, cash advances, and applicable separation requests.
- HR originates/manages **Employee 201 personnel files, document uploads and verification, master data, payroll and official HR actions**.
- Authorized approver reviews; no employee-created request is automatically approved or posted into actual payroll/Accounting.
- Paper requests remain possible through HR-assisted entry and are clearly distinguished from employee handoffs.

## Applied in the frontend demo

### Employee-facing forms

- `/employee/leave`: basic leave form, branch and Employee 201 identity references, leave dates/type/reason.
- `/employee/request`: employee document requests (including COE), attendance and schedule corrections, grievances, incident statements, cash advance requests, responses and separation/clearance documentary requests.
- HR Forms and Leave Management have **Share Form / QR** and **Import Employee Requests** actions. QR works as a link to the employee form UI; it is not a secure submission endpoint.
- Employees prepare and download a JSON handoff. Same-browser demo queue is available; on a different device HR imports the JSON downloaded by the employee. Do **not** claim live submission or central delivery. Identity matching is a screen-side verification only and is not authentication.
- HR reviews imported packets against existing Employee 201 ID, exact name and branch. Invalid packets, wrong branch and duplicate IDs are rejected.
- Imported leave enters the **Pending** Leave Management queue; imported other requests enter **Submitted** in HR Forms for HR review.
- Official Leave Management is the sole leave approval source. Duplicate Leave Documentation and COE type options are disabled for creating a new internal documentation request, but legacy history is preserved.
- Custom Form Builder QR questionnaire can now produce a respondent handoff JSON. HR can manually import matching current-version responses for local New/Reviewed triage.

### Leave credits / posting

- Pending requests do not deduct leave credits.
- Reviewer must **enter actual chargeable working days** (0.5-day increments, within calendar span) before approving. The previous calendar-span amount is not automatically assumed to be chargeable leave.
- Approved leave uses the verified chargeable days for SIL/VIL balance display. This remains local browser demo data and requires actual scheduling/payroll validation in production.

### Employee files

- Document Verification upload is HR-owned (BM read-only), and the actual PDF/image is kept in a temporary browser-session evidence store. Approved status is blocked when original file bytes are missing.
- HR-approved originals appear in the central Document Library and the Employee 201 document cabinet for that session. Filename-only records, pending/rejected checklist metadata, and demo payroll releases are not presented as real archived original files.
- Existing document-reference CSV manifest is still metadata only; it cannot mark documents verified.

## Limitations / critical backend work

This patch **does not supply secure authentication, a shared database, automatic cross-device delivery, server files, real signature verification, QR access expiry/revocation, spam protection, confidential incident handling, or email/SMS notifications**. The demo JSON handoff is untrusted until HR verifies its provenance. No real confidential employee data should be processed here.

Until an authorized secure backend is connected, publishing actual employee leave links or collecting actual personnel files through this public demo would be inappropriate. These features are a working frontend workflow preview plus explicit manual transfer.

Recruitment/applicant and workplace-incident public routes still require separate secure server-side submission and access controls. Asset acknowledgments, payslip distribution and real accounting interactions remain backend-dependent and are not falsely presented as live.

## Applying patch

- Files in `HRMS_Patch_29_Employee_Request_Workflow_Revisions_Only.zip` overwrite matching paths under `hrms-prot-main/`.
- Use over the source **after Patch 26**; Patch 28's StudioIndex type hotfix is re-included, so Patch 27/28 need not be applied again if using this ZIP over Patch 26.
- Does not overwrite or delete employee records, data migration scripts, or legacy history.
- Run `npm install`, `npm run build`, and app/browser QA on branch and permission scenarios before merging/deploying.

## Local checks

- 12 focused transfer/leave/doc workflow checks passed.
- Original Form Builder / Tools / Patch 26 regression scripts passed.
- TypeScript syntax and local import resolution passed; pure data modules passed strict standalone type checking.
- Full Next.js production build and phone/tablet browser QA **not** verified here (project dependencies could not be installed in this runtime).
