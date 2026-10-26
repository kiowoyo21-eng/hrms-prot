# Apply the consolidated HRMS Patch 22–26

1. Back up the existing repository, Vercel deployment, and browser-demo data before applying.
2. Use the repository baseline matching the uploaded `hrms-prot-main(4).zip` (which already contains the Patch 21 Studio fix). The combined ZIP includes Patches 22, 23, 24, 25, navigation hotfix, and new Batch 26 changes. **Do not reapply these separately afterwards.**
3. Extract the ZIP and copy the `hrms-prot-main/` directory contents into the equivalent repository root, overwriting matching paths. This is a **changed-files-only ZIP**.
4. Confirm no `package.json` edits or lockfile changes were made. Run `npm ci` or `npm install` as appropriate for the repo and `npm run build`.
5. Test UC company-wide payroll on a Thursday in Asia/Manila (and disabled button on all other days), Excel/CSV attendance validation, duplicate blocking and separate Mastermind grouping.
6. Test an applied offboarding case with assets outstanding. Confirm clearance remains Outstanding Issues but HR final pay can still be reviewed. Confirm independent clearance and external-payment reference are required before browser-demo separation closure.
7. Check Employee Document Library (no fake files), Templates file list, Verification queue, and sidebar open/close at 390/768/850/1024px.
8. Existing business approval records and local data must not be reset. Revert if unexpected side effects appear.

Source-level checks: `node scripts/check-consolidated-revisions-patch26.cjs` plus other existing `check-*.cjs`. Full build/browser/device QA is still required.
