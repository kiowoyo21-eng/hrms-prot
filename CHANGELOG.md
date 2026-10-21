# HRMS Master Revision V8 — PDF Forms & Document Library

## Modified/new source files (4)

1. `app/studio/pdf/[id]/page.tsx` — PDF form editor enhancements (modified)
2. `app/studio/pdf-output/[id]/page.tsx` — read-only viewer for generated PDFs (new)
3. `lib/studio/pdfFormTools.ts` — typed geometry, validation, and value helpers (new)
4. `app/studio/studio.css` — PDF output viewer, manual-field inputs, responsive layout (modified)

## Changes

- Save generated PDF copies in the existing browser-local Document Library output store (`storePdfOutput`) before downloading; no server, CMS, Accounting, or ERP integration is implied.
- Fix the existing "Open PDF viewer" link, which previously navigated to a missing route.
- Add a read-only viewer that can reopen and download a generated PDF stored in the same browser.
- Import AcroForm fields from the correct PDF pages with PDF.js annotation rectangles, accounting for page crop and rotation. Unsupported widgets are skipped and missing rectangles are flagged.
- Allow HR to fill unmapped PDF fields for the current output WITHOUT modifying a source template, requesting edit rights, or changing Employee 201 data.
- Preserve manual `custom.*` and `document.reference` values for current-generation output.
- Support both a flattened PDF copy and a PDF with newly added AcroForm text/checkbox widgets when "Flatten" is disabled.
- Validate required output values, page bounds, duplicate field IDs, duplicate AcroForm source mappings, and characters unsupported by standard PDF font encoding before generating.
- Prevent generating outputs from unsaved field-map edits. Existing studio storage enforces active session and approved-template requirements for HR.
- Material modifications to an already-approved PDF template reset it to Draft for review before HR can use it again.
- Keep the original imported PDF unchanged and existing templates/employee/payroll records intact.

## Exclusions

- This is NOT a general-purpose Adobe Acrobat clone: no full PDF content editing, OCR, cryptographic signing, redaction, universal font embedding, or secure permanent storage.
- Printed-name signature fields are NOT legally verified digital signatures.
- PDFs, approvals, and generated outputs remain browser-local demo artifacts pending a backend.
