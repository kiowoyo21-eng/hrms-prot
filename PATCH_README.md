# Installation — GitHub website (HRMS Main V9 + PDF build fix)

1. **Prerequisite:** Existing `main` branch includes HRMS Main V8 and the previous Ms Kate HR-role correction. This ZIP only contains incremental changes.
2. Extract this ZIP on your computer. The source paths inside the ZIP begin at `app/`, `components/`, and `lib/` (no extra project root).
3. On GitHub, edit/upload these six files into their exact corresponding paths:
   - `components/SpreadsheetWorkspace.tsx` (replace)
   - `lib/sheetSearch.ts` (new)
   - `app/spreadsheets/spreadsheet.css` (replace)
   - `app/studio/docs/[id]/page.tsx` (replace)
   - `lib/studio/textSearch.ts` (new)
   - `app/studio/pdf/[id]/page.tsx` (replace)
4. Commit all changes together to `main`. Vercel will build the new commit.
5. Check the **first** red error (if any). Do not mistake the nonfatal autoprefixer warnings about `start`/`flex-start` for the blocking error.
6. Browser smoke tests: use Docs Find/Previous/Next in view-only mode; confirm Replace is disabled without approval. Use working sheets Find/Replace, verify formula cells cannot be replaced and HRMS report sheets stay read-only. Generate a fillable PDF and confirm its output opens in Document Library.

**Conflict caution:** This source is based on your latest locally available V8 snapshot, not a fresh checkout of live GitHub commit `9a6b455`. If GitHub has newer edits in these same files, merge changes instead of overwriting them.

No `package.json`/lockfile changes, no data migrations, no ERP, no live CMS or Accounting connection.
