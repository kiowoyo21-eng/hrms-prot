# Installation — HRMS Docs V6 + Universal UI QA

This is **PATCH FILES ONLY**; do not upload the ZIP directly as a repository file.

1. First ensure the GitHub `main` branch includes the HRMS base and earlier Docs V4/V5, Employee 201 and Spreadsheet V3/V4 changes you intend to keep.
2. Extract this ZIP locally. The folders inside mirror the repository paths.
3. On github.com/kiowoyo21-eng/hrms-prot, update the existing files under `app/studio/`, `components/`, and `lib/studio/`. Upload the two new files at `components/studio/FormBuilder.tsx` and `lib/studio/formBuilder.ts`.
4. Optionally add `docs/UNIVERSAL_UI_QA_CHECKLIST.md` and the root changelog/readme/QA report to your repository.
5. Commit all source changes together to `main`. Vercel should start a new deployment automatically.
6. Verify `/studio` as Super Admin. Click **Form Builder** on an active Docs source template, add fields, save. Template becomes Draft. Open in Docs, inspect layout, reapprove. Test manual values and Employee 201 mapped values in Auto-fill and a non-approved HR session.
7. Open the document auto-fill dialog, confirm it overlays above the page rather than appearing underneath or below the content. Test Escape, backdrop click, desktop/mobile viewport and keyboard use. In HRMS Document Operations > Document Templates, verify the central templates link opens in a new tab.
8. If Vercel fails, send the FIRST compiler/type error plus commit hash, not only the final exit code.

**Do not overwrite newer GitHub files with older cumulative ZIPs.** This patch was developed from the latest available Docs V5 source snapshot, not directly from live GitHub.

**Limitations**: Studio data and approvals are local demo state. Full production Next.js build/browser smoke test could not be run in the offline environment. Missing npm packages prevented installation, and the global `tsc` output is not a valid full type check without those dependencies.
