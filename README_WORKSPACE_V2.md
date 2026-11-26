# UC Workspace v2.0 — Enhanced review prototype

**Fictional data only.** This package extends the v1 review workspace, preserves the existing HRMS application, and does not modify any remote repository or live database. The browser-local data namespace is new; v1 sample records are not migrated. Read `README_WORKSPACE_V1.md` for the original baseline and limitations; this document supersedes its statements about the features changed below.

## Open

- Standalone: open `public/workspace/index.html` in Chrome or another modern browser. No npm installation required. Browser settings may restrict local persistence on file URLs; use a local static server if needed (`python -m http.server 8000` from `public`, then `/workspace/index.html`).
- Full original PWA: `npm install`, `npm run dev`, then `http://localhost:3000/workspace/index.html`. The original HRMS login and sidebar link into this separate review workspace. The original screens remain distinct and do not yet share runtime data with the review workspace.

## v2 changes

- Updated navy/gold visual hierarchy, responsive toolbar, and personal action center. The action center shows active assigned stages, document actions, relevant tickets, and local automation tasks.
- Role-filtered search over requests, documents, internal messages, tickets and authorized personnel. This is presentation-level filtering only, not security enforcement.
- Personal calendar with month navigation, sample payroll cutoff/release dates, personal event creation/removal, and hooks for document deadlines. Shared calendar, reminders and scheduling sync are not connected.
- Explicit sequential or parallel assignment; add more than two stages, validate distinct eligible assignees, filter by active assignment, and preserve availability warnings and reassignment history.
- Linked attendance disputes can propose a corrected Time In/Out; after approval the sample record retains its original timestamps, records an effective revision, and queues payroll review. Monetary adjustments are not automatically calculated. An active dispute cannot be duplicated for the same linked record. Same-day simulated checkout and duplicate-open-session guard added; no overnight checkout handling or real GPS/photo verification.
- Newly prepared sample documents wait for the explicitly assigned company signatory to draw and confirm a signature before delivery to the employee. Employee can then sign/acknowledge/respond. Pre-seeded sample documents and payroll-generated sample payslips retain existing v1 status behavior. No real biometric authentication or legal signature certification.
- IT tickets may be claimed from the shared queue, and show illustrative resolution countdown based on elapsed wall-clock hours. Actual SLA business-hour calendars, automated alerts and infrastructure controls are not connected.
- Template TXT upload populates editable text and extracts placeholder keys. Safe TSX export is a text-rendering component, not arbitrary AI-generated executable code, and does not reproduce a PDF layout. PDF/DOCX/image uploads retain filename only. OCR/AI, full drag-and-drop document design, file compression and cloud file storage still require implementation.
- Automation triggers create local work queue items that can be marked complete. This does not execute external jobs or actually provision accounts, send messages, or archive a real file.

## Review flows

1. Switch to Employee; create a request with at least three distinct eligible approvers. Switch actors in order for sequential approval. My action center shows active stages.
2. As Employee, open existing attendance record UC-ATT-001, file a dispute with a corrected Time In; as HR approve it. Inspect original/effective timestamps and the Payroll correction queue.
3. As HR, issue a sample document and select Supervisor as company signatory. Switch to Supervisor, open My action center, draw and confirm. Switch to Employee, open Documents, draw and acknowledge. Before company signature the new document is not visible to Employee.
4. As Employee, add a personal calendar event; switch actor to confirm it is not displayed. Use global search to locate relevant records.
5. As IT, claim an unassigned support ticket and update its status. Review the SLA countdown.
6. As HR, import a sample TXT containing `{{employee.name}}`, edit the template and export its illustrative TSX source. Review/publish using the existing prototype controls.

## Validation

`qa/workspace-review-smoke.py` and `qa/workspace-v2-smoke.py` were executed using Python Playwright and Chromium. Existing review regression flows plus new calendar isolation, three-stage approval, attendance correction and adjustment review, company/employee signature sequence, ticket claim, TXT import, TSX download, search and mobile navigation passed. No uncaught browser errors were recorded in these tests. Full Next.js dependency installation/build and production backend tests were not run. No native APK/iOS build was produced.

## Remaining production work

All local actor and company controls are simulations and can be bypassed by browser developer tools. Do not use actual payroll, photos, signatures, credentials or employee records. Server authentication, authorization, company isolation, real database/storage, transactional workflow integrity, real attendance AI/GPS, statutory payroll, document signing integrity, secure BCC, AI template scanning, production IT diagnostics, notifications, OTA and external CMS/accounting integration remain to be implemented. The original HRMS's actual modules are preserved, not migrated to the local review model. Keep original feature coverage and agree on the shared backend contract before converting individual screens.
