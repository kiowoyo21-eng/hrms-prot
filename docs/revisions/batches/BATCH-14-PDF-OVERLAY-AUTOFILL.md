# Batch 14 — PDF overlay field usability, aliases and employer safeguards

**Status:** Source implementation — focused improvements to the existing PDF editor, not a new PDF subsystem.

## Implemented

- Existing PDF source upload, multi-page `pdf-lib` overlay output, IndexedDB original preservation, save/version, editor access requests, PDF export, and generated-copy metadata retained.
- Simple placeholder aliases for mapping text fields: `{{name}}`, `{{employee_id}}`, `{{position}}`, `{{branch}}`, `{{date_hired}}`, `{{date}}`, `{{company_name}}` alongside existing `{{employee.*}}` mappings.
- New overlay defaults to `{{name}}`; mapping dropdown displays `{{token}}` notation and canvas shows placeholders until the user toggles `Preview values`.
- Company display name maps UC LP/MD/QC to Underchargers and MM to Mastermind. New `{{company.legal_name}}` is intentionally blank unless HR manually supplies the verified registered legal employer name. Do not assume corporate legal registration from branch names.
- Kept original PDF unchanged; output is a generated copy. No automatic electronic signature or government filing.
- Onboarding/Offboarding category added to Studio templates and employee-specific PDF output remains linked by employee ID in generated-copy metadata.

## Not implemented / blocked

- No verified cross-browser mobile rendering; no server-backed secure file storage, electronic-signature integration, automated sensitive-data enforcement, typography-perfect overlay guarantees for rotated/cropped PDFs, or external legal/template validation.
- PDF standard fonts can reject uncommon characters; check generated PDFs visually before distribution. DOCX original layout preservation is not guaranteed by DOCX-to-HTML import; use PDF as the source for visual preservation.

## QA

New `scripts/check-lifecycle-studio.cjs` checks catalog, source parsing, simple placeholder wiring and employer mapping. Existing Dashboard and PSA scripts pass. Full Next.js build unavailable without dependencies.
