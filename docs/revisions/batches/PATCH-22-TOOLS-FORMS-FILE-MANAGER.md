# HRMS Tools & Forms patch — unified file-manager corrections

**Baseline:** User-supplied `hrms-prot-main.zip` (25 October 2026).

Previous HRMS Patches 15–21 are already present in the uploaded source (Source Forms, Form Builder, QR preview links, Tools browser file explorer, response review, Studio route hotfix). Their existing files and the other HRMS modules are retained.

## Changes in this patch

- Drive opens in **icon/grid view**, with list toggle preserved. Better file-type icons and tighter responsive spacing.
- Added **New** menu with Create Folder, Create Document, Create Spreadsheet, Upload Files. Each action uses the existing modules and demo storage. Newly-created Docs open their full-size editor; working Sheets open their workbook.
- Per-file **Move to Trash** action is visible to Super Admin, with confirmation and restore from Trash. This is not permanent deletion of document sources.
- Fixed previously nonexistent `/drive/view/[id]` route for locally uploaded PDF, images, DOCX and text; XLSX files still open the existing Sheets import preview. Unsupported formats allow download only. DOCX previews are sandboxed; previews use browser-local file bytes.
- Added Share / QR access in Form Builder for published built-in Job Application and Incident forms, using the current public routes; preserved compressed custom-form QR snapshots. Existing HR request forms cannot be safely shared without server-backed authenticated routes.
- Maintained authorization: Super Admin creates/organizes Drive items; HR & Ms Kate have HR view access. No ERP integration.

## Limits

This is **frontend-only, browser-local demo functionality**. It does **not** provide production cross-device collection, real response notifications, centrally hosted files, secure share revocation, or true permanent deletion of source documents. PDF/Docx previews are local visualizations; browser compatibility varies. Server-side permission checks and encrypted persistent storage are not present.

## Installation

1. Back up your current HRMS project.
2. Unzip the combined patch at the same directory level as `hrms-prot-main/`, allowing overwrite of named files.
3. From `hrms-prot-main/`, run `npm install` if needed, `node scripts/check-tools-files-2026.cjs`, `npm run lint`, and `npm run build`.
4. QA desktop and phone: Tools → Drive → New; icon/list toggle; uploaded file open and download; Trash/Restore; published Form Builder → Share / QR → test on phone. **Real external submission will not reach HR**.

## Testing

- Existing patch 15–21 check scripts: executed and passed where available.
- Focused TypeScript syntax/parsing checks and static import path validation passed.
- Full Next.js build and real browser interaction are **not verified** in this execution environment (dependencies not installed).
