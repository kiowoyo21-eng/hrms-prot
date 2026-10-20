# HRMS Docs V4 Patch Installation

## Requirements

Apply over the current HRMS project with Docs/Document Studio already installed. This is **NOT** a full HRMS project. No new npm dependencies are added.

## File paths (exact)

1. `app/docs/layout.tsx` — add
2. `app/docs/page.tsx` — replace
3. `app/studio/docs/[id]/page.tsx` — replace
4. `app/studio/studio.css` — replace
5. `lib/studio/exportDocx.ts` — replace
6. `lib/studio/print.ts` — replace

## GitHub website only

1. Extract the ZIP on your computer. Do **not** upload the ZIP itself as a file in GitHub.
2. On repository branch `main`, upload/replace the six source files to their exact paths. Preserve the literal `[id]` folder name.
3. Commit all six files together. Check that the deployed commit contains `app/docs/layout.tsx` and the updated styles.
4. Watch the Vercel log for a complete `npm run build`. Source-level checks here are not a production build.
5. Test `/docs`, `/docs/starter-employment`, printing, imports, tables and the HR → request approval → Super Admin approve workflow.

## User behavior

- Access Docs using `/docs`; documents open in `/docs/[id]` as a normal browser tab.
- HR users remain view-only until approved; Super Admin retains edit privileges.
- Only HTML and TXT import are added in V4. PDF export uses your browser's Print / Save as PDF.
- Imported changes are saved through the normal document version/audit path, not into official payroll or employee records.
