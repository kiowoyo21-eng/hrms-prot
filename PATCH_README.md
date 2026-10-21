# Installing HRMS Main V7 via GitHub Web

This is **PATCH FILES ONLY**, built on the latest local V6 source snapshot available in this conversation. Apply after **HRMS Main V6**, preserving Ms Kate HR-role inheritance correction and previous fixes. This is not a full project ZIP.

1. Extract the ZIP on your Mac.
2. On GitHub, open your existing HRMS repository and `main` branch.
3. Upload/replace the files **at the corresponding paths**:
   - `components/RecruitmentWorkspace.tsx` (replace)
   - `components/ComplianceWorkspace.tsx` (replace)
   - `lib/recruitmentChecks.ts` (new)
   - `lib/complianceChecks.ts` (new)
4. Keep all other source files untouched. Commit all four in one commit.
5. Check the new Vercel production build (Webpack **and** TypeScript steps) before accepting the patch.
6. Browser smoke tests: change branches with an applicant/case open; try scheduling an interview for an unshortlisted applicant; try a future valid interview; confirm a non-Passed applicant can't be hired; attempt duplicate compliance requirement; verify status sequence per branch and evidence prompt; check agency/year/branch calendar reviews remain separate. Confirm HR and Ms Kate's inherited HR module permissions.

**Data caution:** Existing applicant/employee identities in this prototype can be stored in the browser only. Do not put real sensitive applicant documents, employer filing proof or payroll identifiers into the frontend prototype. An evidence filename is not an uploaded proof file or legally valid verification. This patch does not integrate government portals, ERP, CMS, or Accounting.

**Fallback:** If your live GitHub files have newer unrelated edits than the locally available source, compare the two TSX components rather than overwrite those changes blindly.
