# HRMS Docs V6 QA Report

## Passed in reconstructed local source
- 35 focused JavaScript/TypeScript logic checks (form mapping, validation, optional fields, empty/invalid fields, duplicate selections, no duplicate appended tokens, version conflicts, audit and Super Admin-only approval control).
- 109 TypeScript/TSX source files parsed: zero syntax errors.
- Relative-import filesystem scan: zero missing local modules.
- Dedicated Studio CSS parsed: no syntax errors.
- File-by-file incremental diff verified: 7 changed/new source files plus documentation.

## Not yet verified
- A full `npm run build` / Vercel deployment. `npm install --offline` failed with ENOTCACHED for @tiptap/core. A global `tsc --noEmit` attempt produced missing dependency and React JSX type errors, so it cannot establish a valid full project build result.
- Actual Chrome/Safari/mobile browser appearance, focus trapping, sidebar and dropdown positioning across all HRMS modules.
- Multi-browser cross-device persistence and security: no production server or secure data store connected.

## Manual acceptance checklist
- Super Admin can add multiple fields, save, reopen builder; labels/options/mappings persist in browser.
- Approved template moves to Draft after form edits and HR cannot generate from it until Super Admin reapproves.
- HR with time-limited edit access cannot approve templates or restore source template approval.
- Employee 201 mapped field uses selected employee's value; manual values remain scoped to current document generation.
- Required empty, invalid numeric/date/select data block all outputs; optional empty fields produce blank text without blocking.
- Autofill dialog appears over page, scrolls within viewport, dismisses with Escape and clicking backdrop.
- Document Operations > Document Templates directs to one central source rather than displaying unrelated sample/session-only templates.
- No existing payroll, official Employee 201, incident, or asset records are changed by generating Docs copies.

Full universal UI audit remains an active project requirement (see `docs/UNIVERSAL_UI_QA_CHECKLIST.md`).
