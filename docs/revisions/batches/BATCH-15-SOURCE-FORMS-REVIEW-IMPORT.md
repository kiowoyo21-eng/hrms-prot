# Batch 15 — Uploaded source-forms review & draft PDF import

**Scope:** integrate the non-image **form and document reference inventory** from the user's `Archive(1).zip` into Document Studio. This is not an automatic upload of the private files and is not legal approval. This patch contains **no uploaded original PDFs/DOCX, images, logos, signatures, or individual employee documents**.

## Source review inventory

The uploaded archive `Forms/` folder contained employee-facing and company-policy forms, duplicated branch/manager variants, two PSA survey questionnaires, unrelated patch files and a UI proposal. The inventory maps thirteen reusable *types* of source forms: probationary agreement, requirements checklist, statutory contribution sheet, NDA, leave, half-day, overtime, work permit, asset accountability, fact-finding procedure, NTE/NOV, resolution/NOD and company policies/safety protocol.

All original filenames are listed in `lib/studio/sourceFormsCatalog.ts`. Four UC accountability source variants are intentionally **one reference type**, not separate employee request forms. Existing Leave Management, HR Requests, Assets, incidents and PSA data support workflows remain canonical.

## Implemented behavior

- `Document Studio → Source Forms from Uploaded Archive` opens a dedicated page at `/studio/source-forms` with searchable, categorized data table.
- Clicking **View / Import** opens a modal, not an inline expansion. It lists source variants, likely fields, known caveats, associated onboarding/offboarding checklist IDs, and any imported drafts.
- **Super Admin** may choose a user-supplied **PDF only**, up to 20,000,000 bytes and 100 pages. PDF format and readable pages are validated using `pdf-lib` before saving; the original PDF bytes are retained in the existing browser IndexedDB PDF store. The new Studio item receives `sourceCatalogId` and remains `Draft` until properly reviewed.
- The editor is a **dedicated PDF page**. Original page appearance is retained; overlay fields can be added using preexisting Patch 14 PDF editor. No logo auto-insertion.
- To preserve exact layout, **DOCX/WPS source files must first be converted to PDF** by the user. The existing standalone DOCX importer elsewhere in Studio remains unchanged.
- Onboarding/offboarding checklist displays related archive source links for applicable items.

## Legal and privacy flags

- **Probationary agreement:** confirm legal employer, communicated qualification standards and validity of its *final-pay withholding* wording with Philippine labor counsel. Do not use as-is.
- **NTE_NOV:** a titled “Notice of Violation” is **not assumed to satisfy the first Notice to Explain** or due process.
- **RESOLUTION_NOD:** contains sample case details/dates. Do not use as a blank before cleaning.
- **UC NDA:** contains different UC addresses and repeated text; employer identity must be verified. No automatic UC→MM replacement.
- **Asset accountability:** multiple manager/branch variants and possible employee details; remove any employee-specific information before uploading as a reusable blank.
- **Policies:** verify actual effective version and any disciplinary / safety provisions.
- Existing full application is browser-local/demo and not secure enough to store real sensitive documents as a production evidence vault.

## Outside this batch

- No source archive PDF/DOCX bytes are published to frontend `public/` or persisted automatically.
- No separate uploaded logos, testimonial images, media or other image files are used. The proposed 200 KB *image* limit remains pending rather than implemented.
- No live server upload, migration, OCR, automated source-field detection, legal signoff, PDF conversion service, or deployed browser-device verification.
- Survey questionnaires in archive remain **out of scope**; the HRMS PSA role is still supporting data only.

## Verify

`node scripts/check-source-forms.cjs`, `node scripts/check-lifecycle-studio.cjs`, `node scripts/check-dashboard-drilldowns.cjs`, `node scripts/check-psa-data-support.cjs`, source/relative-import and CSS parse checks. Full `next build` requires installed application dependencies.
