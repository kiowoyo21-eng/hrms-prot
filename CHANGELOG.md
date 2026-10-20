# HRMS Docs V4 — Incremental editor improvements (2026-10-20)

## Modified/created files

- `app/docs/layout.tsx` (NEW): consistent route-scoped Docs styles for `/docs` and `/docs/[id]`, without the HRMS dashboard chrome.
- `app/docs/page.tsx`: rely on the Docs route layout for stylesheet imports.
- `app/studio/docs/[id]/page.tsx`: paragraph line spacing, indentation, contextual table tools (insert before/after, merge/split, toggle header, delete), explicit page-break command, HTML/TXT import, HTML export, Format menu. DOCX export receives layout and header/footer settings. HTML imports are sanitized, size-limited, confirmed before replacement, and locked without active editing access.
- `app/studio/studio.css`: Docs home styles, contextual table tools, selection/row styling, responsive controls.
- `lib/studio/exportDocx.ts`: DOCX page orientation, paper size, margins, headers/footers, page breaks, heading/paragraph formatting, distinct bulleted and numbered lists.
- `lib/studio/print.ts`: opens a normal browser tab (not a popup-size window) for browser printing; aligns page-break CSS with serialized editor HTML.

## Preserved

- Browser-local HRMS documents and existing saved document format; no schema migration.
- Document-scoped Super Admin approval, expiry/revocation, version-conflict protection and audited saves.
- Employee 201/Payroll values and templates not changed; docs import/edit cannot silently write back to source records.
- Existing `/studio/docs/[id]` links and `/docs/[id]` routing.

## Known limitations

- Not full Google Docs feature parity: no realtime collaboration or cross-device sync, no suggestion mode, comments, exact paginated on-screen layout, or rich DOCX import. HTML/TXT import is supported in this pass.
- DOCX export is best-effort for supported text/table/list formatting; complex images/styles and intricate page layouts may not round-trip perfectly.
- Frontend/browser-local approval and audit are not production-secure. Server-side authorization and persistent storage are still required.
