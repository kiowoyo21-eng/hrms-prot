# Installation — HRMS Employee 201 Spreadsheet Patch

Base: HRMS consolidated project containing V1–V3 Workspace, V2 resumed revisions and Payroll Batch Management (2026-10-20). Apply missing-component hotfixes first if your GitHub repository omitted files.

1. Extract the ZIP; keep the `components/` and `lib/` folder structure.
2. On the GitHub website, update each listed existing file at its exact path; create `lib/employee201Rates.ts` as a new file.
3. Commit all six source files together to `main`.
4. Let Vercel deploy the new commit; inspect its build log. A full Next.js build was not verified in the packaging environment.
5. Sign in as HR or Super Admin; open Employee 201 → Open in Spreadsheet. Confirm the branch filter, eight related worksheets, masked IDs, and up-to-date rate references.
6. Test Employee Profile compensation and Document Library auto-fill using **fictional** sample data. Verify no sheet operation changes official payroll records.

Do not upload the ZIP itself as a GitHub repository file. The paths in the archive start at project root (no wrapper folder).
