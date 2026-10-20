# Installing HRMS Universal UI V1 (GitHub website)

**Prerequisite:** Latest consolidated HRMS plus the previous Docs V6 / Advanced Sheets patches applied to the same `main` branch. This is **NOT** a full project.

1. Download and extract the ZIP. The folder structure inside the ZIP starts at `app/`, `components/`, and `lib/`.
2. Open your HRMS GitHub repository and update/replace each file at its matching path. For new directories create `components/ui/` and add `useFloatingPopover.ts`.
3. Ensure both new helper files exist in `lib/`: `moduleAlertViews.ts` and `floatingPosition.ts`.
4. Ensure `app/universal-ui.css` exists and that `app/layout.tsx` imports it after `globals.css`.
5. Commit **all 11 source files together** to `main`. Vercel will build the new commit. Do not upload the ZIP as a single repository file.
6. Review the fresh build log. After successful deployment, hard-refresh (`Cmd+Shift+R` on Mac) and test dashboard counts, notification bells, date calendars and the Leave / Recruitment / Compliance modal workflows.

**Warning:** `app/page.tsx` and the five edited component files must reflect your latest repository edits. If your GitHub versions have been independently modified since Docs V6, merge instead of blindly replacing them; the patch was developed against the available Docs V6 source snapshot, not fetched from your live repository.

Changed files only; no `node_modules` or full project files are included.
