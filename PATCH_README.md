# Installing HRMS Universal Notifications V2 through GitHub website

**Base required:** Apply the HRMS Universal UI V1 patch first, plus your prior HRMS employee/payroll/docs/sheets patches. This ZIP is **incremental**, not the entire app.

1. Download and extract this ZIP locally.
2. Open your `hrms-prot` repository on GitHub, `main` branch.
3. Update the contents of these exact paths, preserving folder names:
   - `app/page.tsx`
   - `app/globals.css`
   - `components/ModuleAlerts.tsx`
   - `components/PayrollCutoffAlertPublisher.tsx`
   - `lib/moduleAlertViews.ts`
4. Commit all five source files together; don't upload the ZIP itself and don't put files in duplicate nested folders.
5. Wait for the Vercel deployment on that new commit. In browser, hard-refresh (Mac: Cmd+Shift+R).
6. Log in with an authorized test role. Confirm the bell appears beside the branch selector on Dashboard and other modules. Test **This module**/**All modules**, Escape, click-outside, changing branches, and module navigation.
7. Open Payroll and confirm cutoff-monitor alerts and pending Payroll Operations alerts can coexist, rather than replacing each other.

Do not claim the patch is production-deployed until the new Vercel build succeeds and basic interactions are browser-tested. See `QA_REPORT.md` and `NOTIFICATION_COVERAGE.md`.
