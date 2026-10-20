# HRMS Vercel Spreadsheet Workbook Type Fix — Patch Only

**Target:** Vercel build commit `b9fe8ec` (`components/SpreadsheetPageClient.tsx:17`).

**Only source file to update:** `components/SpreadsheetPageClient.tsx`.

## GitHub Web UI installation
1. Open your HRMS repository on GitHub and select the `main` branch.
2. Navigate to `components/SpreadsheetPageClient.tsx` and edit the file (pencil icon).
3. Replace this line:
   `const legacy=initialSheetId&&LEGACY_SHEET_WORKBOOK[initialSheetId];`
   with:
   `const legacy:WorkbookId|undefined=initialSheetId?LEGACY_SHEET_WORKBOOK[initialSheetId]:undefined;`
4. Commit changes directly to `main`.
5. Review the **new** Vercel deployment for the new commit.

Alternatively, replace the entire matching file using the one in this ZIP, **after confirming your repo file matches the reported version**. Do not upload the ZIP itself to the repository.

No new dependencies. Contains only one changed source file plus documentation.
