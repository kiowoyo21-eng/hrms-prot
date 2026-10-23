# Tools

Grouped navigation in [`GroupedWorkspace.tsx`](../../../components/GroupedWorkspace.tsx) preserves existing live components: DriveWorkspace, SpreadsheetPageClient, and StudioIndex (Document Studio). Their historical standalone routes are unchanged.

Existing local records are **not migrated, reset, or deleted** by the navigation refactor. Role checks in the individual apps are retained; Ms Kate's special HR role is accepted by StudioGate.

Known prototype limitations: file editing approvals and storage use browser-local/session mechanisms, not production secured shared storage.


**Batch 04:** See [`Tools changelog`](../../changelogs/tools/CHANGELOG.md). Direct browser interactions and data persistence beyond source inspection still require QA.

## Batch 18 — Shared Tools workspace and demo Drive operations (2026-10-23)

The `Tools` tab contains Drive, Spreadsheet, Documents Library/Studio, and Form Builder. These are **embedded views** and share a compact content frame, header rhythm, responsive toolbar widths and standardized actions. Dedicated editing routes remain available for large document/worksheet workflows.

### Drive

- Super Admin can create folders, upload original files (up to 25 MB in browser demo), rename local folders/uploads, move entries, move them to organizational Trash and restore them. Controls reuse the pre-existing `lib/drive/store.ts` operations, including duplicate-name/cycle checks and session validation. File bytes are held in the **same browser's IndexedDB**. Other sessions/devices cannot receive them.
- HR and Ms Kate retain read-only browsing rights. BM remains excluded. Trash for generated document/workbook *references* is organizational only and must **not** delete the source record from its original module.
- Management actions open an accessible shared modal; there are no new inline editors. Folder list reflows above the file list on tablets and phones. Form Builder tables present a visible compact Actions control on tablets/phones and a modal containing existing permitted actions.

### Other Tools

- Spreadsheet workbook launcher uses compact Tools styling and navigates to dedicated workbook editors. Existing edit approvals, audit and export/import procedures remain unchanged.
- Document Studio library uses the common embedded layout without duplicating the `Back to HRMS` and `Open Drive` link cluster inside the Tools tabs. Document template approvals and PDF overlays are unmodified.
- Form Builder form editing, responses, preview link sharing and QR code remain available. **Portable links are preview-only**, and responses on remote devices do not reach the HRMS. This patch does not add cross-device live form submissions or a backend.

### Testing and production limitation

`node scripts/check-tools-patch18.cjs` tests Drive permission/session changes, folder cycle guards, trash/restore, layout integration and form modal actions. Existing Form Builder, source-form, lifecycle, Dashboard and PSA checks should also pass. Browser device QA and a dependency-installed Next.js build are still required. Do not upload real confidential documents to local-only demo storage.

## Batch 19 — Form Builder section navigation & conditional questions

- Form Builder fields now allow a **Section / group** label, plus **Show only when** a preceding radio/dropdown equals an allowed choice. Publish validates the dependency and option.
- Published **custom** forms can display multi-section pages with Previous/Next and section progress; only applicable questions must be answered. Non-applicable hidden answers are excluded from new local test submissions and related request/application record extensions.
- Share/QR snapshots include section/condition metadata (v2), continue to accept older v1 snapshot URLs, and remain explicitly **preview-only** off-device. No remote submission capability or backend has been added.
- For tests: `node scripts/check-tools-patch19.cjs` and the existing `check-intake-forms.cjs` / `check-intake-share.cjs`.

## Batch 20 — Local Form Builder response review

- `Tools → Form Builder → Responses` now opens a compact, searchable local response register with **All / New / Reviewed** filters, counts and 10-row pagination. The individual response **View** action displays full answers in the same modal's detail view, with Back and a working Mark Reviewed / Mark New action. No inline expansion under the Form Builder table.
- CSV export includes **only the currently filtered local responses**, preserves historical form-version field IDs (avoids merging identical question labels), and escapes formula-like user input before opening in spreadsheets.
- The responses action and review/export UI remain available to the existing authorized HR-facing roles, not to read-only roles. No source responses are deleted by filtering, previewing or changing template questions.
- **This is a local-test response viewer, not a live central inbox.** Shared QR/page previews still never transmit answers to HR. Browser storage is not suitable for real applicant/employee PII; do not use this viewer for production records without server-side authorization and secure backend.
- Verification: `node scripts/check-tools-patch20.cjs`; full mobile-browser and installed-dependency Next.js production build remain outstanding.
