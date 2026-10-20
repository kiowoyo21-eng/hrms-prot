# HRMS Docs V5 Incremental Patch

## Prerequisites
Apply this **after Docs V4** (`hrms-docs-v4-editor-incremental-patch-only.zip`) on the HRMS project. Existing `/docs` and `/docs/[id]` routes must be present.

## GitHub web installation
1. Extract the ZIP to a local folder.
2. Open your HRMS GitHub repository, branch `main`.
3. In GitHub, update each of the five source files while preserving its relative path. Do not commit this ZIP as a repo file.
4. Commit all five files together.
5. Check Vercel Build Logs and manually test the Docs editor.

## Testing steps
1. Login as **Super Admin** demo role. Open `/docs`, select a document, add a comment to selected text, reply, resolve, reopen.
2. Check Document Library card: open comment count must update.
3. Login as **HR** without edit permission: comments are readable, but no new/reply/resolve writes are allowed.
4. HR requests edit access. Admin approves. HR can now leave review comments.
5. Admin revokes access. Further HR comment writes must fail.
6. Check Audit Logs for comment action events; comment text must not appear in audit summaries.
7. Save a document and check document versions and template generation still work.

## Dependencies
No new npm dependencies.

## Security
This is for the **frontend-only demonstration**. Client localStorage and role flags are not secure cross-device authorization; do not use real employee/confidential records in this demo environment.
