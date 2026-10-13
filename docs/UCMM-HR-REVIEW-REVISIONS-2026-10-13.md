# UCMM HR — Review Revisions (13 October 2026)

## Install
This is a **PATCH ZIP, not a full rebuilt project**. Upload the ZIP's contents to the root of the existing GitHub repository and overwrite matching files, preserving `app/`, `components/`, and `docs/`. Do not put the ZIP in an extra folder. GitHub/Vercel will run the build after commit when auto-deploy is enabled; **no Next.js build was run to prepare this patch**.

## Revised UI & workflows
- Government Deductions: original four clickable agency cards retained. Each opens a modal with saved reference versions, searchable brackets, version proposal, CSV draft import, and **Approve & Activate (Demo)** after user confirmation. The Employee Deduction List appears below the agency cards, with employee-level calculated preview. Proposed schedules do not alter active calculations until locally reviewed. Source and effective-date verification are still required.
- Loans & Cash Advances: `Add Record` includes SOA image/PDF selection and preview/download from loan details. Browser demo compresses images (maximum 10 MB original) and only accepts small PDFs (under 450 KB). New loans are `Draft — schedule pending`; amortization amount, frequency, start date, and completion remain disabled placeholders. Automatic payroll deduction is **not** triggered. Existing demo cases remain available; a legacy one-click “Review Verify” shortcut has been replaced by record review.
- Documents & Templates: landing page is **three image-style clickable cards** only: Document Library, Document Templates, Document Verification. Standalone Signing Requests removed. Templates support **Upload Template** (PDF/DOCX/images) and **Create from Scratch**, A4/Letter preview, paper-size setting, insert signature fields and export/print; DOCX preview is intentionally not attempted. Document Library handles document uploads directly. Uploads are temporary browser-only previews, not secure server storage.
- Signing: signature preview is not a standalone module. Individual signing choices appear in relevant workflows, including Onboarding, Incident Reports, and Payslip History. On-device signature canvas is **preview-only**; link/QR mode explains that real secure recipient-bound links require backend. Asset Accountability retains its own in-flow signing.
- Government Compliance: smaller square agency cards with balanced gaps and pending badges; progress is inside each agency.
- Employee 201 Directory: advanced filters collapsed by default; compact toolbar, presets, inputs and rows. Desktop table scrolls inside its own region; under compact widths, records appear as complete mobile cards with View/Edit. No page-wide horizontal overflow is intended. The responsive CSS also reduces layout spill across other modules.

## Frontend limitations / safety
This is a **local/browser demo**, not real HR or payroll processing. Role gates are UI-only, source schedules may not match the latest law, approvals do not authorize actual withholding, SOA images may be cached in this browser's local storage, signatures are not legally verified or persisted in tamper-evident form, and no authenticated upload/e-signing backend is connected. Use synthetic/sample employee data and non-confidential test documents. Actual production readiness requires real authentication, per-record permissions, encrypted private storage, official rate validation, immutable approvals, audit logs, and deployment testing.

## Offline checks performed
- TypeScript TS/TSX **syntax parse** across 40 source files: 0 errors.
- CSS parsed successfully with PostCSS.
- Patch path/file consistency and ZIP integrity checks performed.
- **Not run:** dependency installation, full `tsc` type check, Next.js build, Vercel deployment, browser device testing. This patch must be verified on Vercel staging before production use.

## Quick post-upload checks
1. Government Deductions: click SSS/PhilHealth/Pag-IBIG/BIR; open popup, inspect versions and employee breakdown; proposed rows cannot affect calculations without demo approval.
2. Loans: Add Record, attach dummy SOA image, save draft, open details, verify no repayment deduction has been applied.
3. Documents: verify precisely three landing cards, test Upload/Create Template and signature placeholder; no standalone Signing Requests.
4. Onboarding and Incident Reports: choose on-device signing preview vs Link/QR backend-required state.
5. Employee Directory: check standard desktop, narrow laptop, 125%+ browser zoom, tablet and phone; verify employee records remain readable with no clipped page-wide controls.
6. Government Compliance: check square cards, pending counts and dedicated agency pages on desktop and mobile.
