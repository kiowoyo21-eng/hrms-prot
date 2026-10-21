# Install HRMS Main V8 (GitHub website)

**Baseline:** latest locally assembled HRMS V6 + main V7 Recruitment/Compliance patch. This was not downloaded from the live GitHub main branch. Preserve any newer changes you made to the same files.

**Prerequisites:** Prior Docs/Document Library and Ms Kate HR-role inheritance patches are expected to be present; retain your existing `lib/studio/pdfOutputs.ts`, `lib/studio/pdfAssets.ts` and `lib/studio/store.ts` files. The patch does NOT replace them.

1. Confirm your HRMS V7 deployment on Vercel is working.
2. Unzip this archive on your computer.
3. Upload the **four source files** to exactly their corresponding GitHub folder paths:
   - `app/studio/pdf/[id]/page.tsx` (replace)
   - `app/studio/pdf-output/[id]/page.tsx` (new folder `[id]` under `pdf-output`)
   - `lib/studio/pdfFormTools.ts` (new)
   - `app/studio/studio.css` (replace)
4. Commit the changes to `main` together and inspect the new Vercel production build.
5. Sign in as Super Admin, import an ordinary SAMPLE nonconfidential AcroForm PDF into Document Library, map fields, save, approve the template, then sign in as HR/Ms Kate and fill it.
6. Confirm the downloaded PDF is listed under "Generated PDF copies". Open its read-only viewer and download it again. Test both Flatten on and Flatten off.
7. Check mobile/responsive layout and restore/approve paths. No production data should be uploaded to this browser-only demo.

**Do not upload the ZIP as a file to the GitHub repository.** Upload the individual source files under their intended paths. If your current `app/studio/studio.css` differs, merge the new V8 rules instead of reverting newer CSS.

Troubleshooting: If the generated PDF opens on your device but not another, this is expected: IndexedDB data and document metadata are not synced. A full production backend is a future phase. This patch does not connect ERP or the other apps.
