# HRMS Workspace V1 — Cumulative patch handoff

## Apply

1. Back up the target project and local browser demo data first.
2. Extract the ZIP at the **existing project root**, preserving paths. It contains only added or changed files (no `node_modules`, demo database or full project).
3. This patch **includes** the earlier Google Sheets admin approval + Document Studio cumulative patch, so do not apply those separately first.
4. Run `npm install` to install existing editor/PDF dependencies from the patched `package.json`, then run `npm run dev` (and `npm run build` in a normal installed environment).
5. Verify navigation and routes: `/drive`, `/document-library`, `/spreadsheets`, `/spreadsheets/<sheet-id>`, `/studio/docs/<id>`, `/studio/pdf/<id>`.
6. On Vercel, the routes use the existing production host; no localhost links required.

## Visible changes

### Phase 1 — Employee 201
- Full expanded employee record sections: personal details, emergency contact, employment, leave credits, all statutory ID slots (SSS, PhilHealth, Pag-IBIG, TIN), compensation and premium-rate reference amounts.
- Configurable monthly working-day divisor and daily work hours, required to derive rates for monthly employees; no invented monthly-to-daily conversion for legacy records.
- HP, SHP, RDW, RDOT and ordinary OT values computed using existing HRMS premium multipliers. These are preview reference values, not proof of legal correctness or a payroll posting.
- Legacy browser records are compatible through optional fields; no made-up government IDs.
- Employee creation and profile edit surfaces include the expanded fields.

### Phase 2 — HRMS Drive
- New full-page `/drive` file manager: folders/subfolders, uploads to local IndexedDB, browsing/search/list/grid, move, rename supported entities, soft trash and restore, file links.
- Drive lists Document Studio Docs/PDFs and available worksheets via shared references, without duplicating official files or writing into payroll data.
- Drive file organization controls are Super Admin-only in the browser demo. Edits inside protected Docs/Sheets retain their own admin approval controls.
- This is **browser-local storage**, not a network drive; files and approvals do not sync across devices, and browser resets can permanently erase them.

### Phase 3 — Spreadsheets
- Dedicated workspace and individual worksheet paths, top menus and formatting toolbar, selected-cell formatting, formula bar, continuous virtualized rows/columns with sticky headings, worksheet tabs at bottom, admin-created worksheet rename/delete, approval-controlled cell changes.
- Existing reports, CSV, printing, snapshots, formulas, activity and approval modules remain linked.
- Formula library is a **subset**, not full Google Sheets compatibility. Rich charts, import/export `.xlsx`, multi-range selection, comments, cloud coediting, and advanced functions remain future work.

### Phases 4–5 — Docs/PDF and Library
- Earlier cumulative patch carried forward: full-size Docs and PDF workspaces, DOCX/PDF forms, custom templates, inserted merge fields, bulk document generation, PDF form mapping, version history and print/export.
- `/document-library` is now the central template workspace with links to Drive and Spreadsheets; underlying `/studio` editor routes are preserved.
- Extended merge fields cover complete Employee 201 government IDs and preview pay-rate values (daily, hourly, OT, HP, SHP, RDW, RDOT). Blank source data remains blank and should be corrected before generation.
- True Google Docs fidelity, real-time collaboration, native PDF text replacement and advanced DOCX round-tripping require further development/testing.

### Phase 6 — Approvals and audit
- Existing per-document and per-worksheet request → admin approval → expiring edit grant → revoke flow retained. Document revisions and worksheet edits retain local activity histories.
- **The demo authentication/permissions and histories are client-side only; not secure HR production authorization.** Do not input actual employee identity documents or government numbers until secure server-side authentication, database/field encryption, granular access controls, upload scanning, immutable audit logging and backup are in place.

## QA completed
- All 90 TypeScript/TSX sources parse without syntax errors; relative local import references resolve.
- Focused Node tests passed: request/approval/revoke and scope, sheet formatting/create/rename/delete, formula evaluation, Drive folder move cycle prevention/soft trash, role restrictions, and employee auto-fill/pay-rate mapping.
- **Not verified**: full `next build`, browser end-to-end rendering, Vercel deployment, or cross-device persistence. Dependency installation in the test container timed out.

## UI and data boundaries
- Spreadsheet working copies do not modify HRMS master payroll records.
- Docs/PDF auto-fill reads current authorized HRMS browser data; generated copies do not write back to source Employee 201 data.
- Drive Trash changes its listing; it does not securely delete source document binaries from editor storage.
- Uploads up to 25 MB are stored in IndexedDB on this browser. Browser quota and incognito behavior vary.
