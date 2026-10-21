# V8 QA Report — What was actually checked

## Passed

- 44 targeted JavaScript functional/integration-source assertions for PDF field position bounds, annotation rotation conversion, required fields, custom values, checkbox semantics, duplicate IDs/source fields, unsupported glyph warning, generated output registry and approval-invalidation guard.
- `lib/studio/pdfFormTools.ts` passed isolated TypeScript `--strict --noEmit` checking with TypeScript 5.8.3.
- 125 TS/TSX/JS source files parsed with the TypeScript parser; zero parser diagnostics.
- No unresolved relative imports in the assembled source files.
- `app/studio/studio.css` parsed with tinycss2: 0 top-level CSS errors.
- ZIP archive contents and integrity verified.

## Not verified here

- Full `next build`/whole-project type checking (application dependencies were not installed; npm registry access failed).
- Runtime pdf-lib/PDF.js behavior with real PDFs, including form field appearances, page rotation, exact text layout, and viewer fidelity (no application node_modules or browser session available).
- Interactive HR/Super Admin approval workflow, portal stacking, mobile browser operation, or Vercel deployment.
- Actual PDF editor feature parity with commercial PDF tools.

## Risks / follow-up

- Existing PDF widgets with unusual annotations, malformed Acrobat names or unsupported controls may require manual mapping.
- Standard Helvetica cannot display all Unicode characters. Preflight blocks unsupported text rather than silently replacing official names.
- Flattened overlay text placement is approximate; review the final PDF before using it. Unflattened output creates editable widgets for newly mapped fields.
- The form rendering relies on the existing pdf-lib and PDF.js packages already specified in `package.json`.
- Browser storage is demo-only; local data can be erased or altered. Super Admin edit approvals are NOT production-grade permission enforcement until backed by a server.
- The existing Studio template/version store and generated PDF metadata are separate browser-local stores. No cross-device consistency is promised.
