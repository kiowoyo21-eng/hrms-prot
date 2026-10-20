# QA Report — Main Module UI & Data Integrity V2

### Verified
- 25 focused regression checks passed, including branch visibility, asset home-branch precedence, Payroll batch selection, signing request counts and Incident portal presence.
- `lib/branchRecordViews.ts` passed `tsc --noEmit --strict` using ES2022/DOM libs.
- 112 TypeScript/TSX source files passed TypeScript syntax parsing in the reconstructed project with this patch overlaid.
- No unresolved **relative source/style imports** in that reconstructed project.
- No project record or storage schema changes.

### Not verified here
- Full `npm run build` for Next.js 15 (dependencies not installed in the local snapshot).
- Browser interaction tests on Vercel; screen sizes, clipping and focus management in a live page.
- Exact compatibility with GitHub `main` after any unshared edits.
- Production backend role/branch security and cross-device data synchronization.

### Manual browser regression checklist
1. Employee 201: open profile in Shop A, switch to Shop B; old profile must close; visible directory must show Shop B only.
2. Assets: compare header and status counts under each branch; old selected device/process must close when switching branches. Check new device default branch.
3. Payroll: create/view batch in Shop A, switch to Shop B; old selected batch, drafts, history rows and review counts must not persist in Shop B. Verify approved payroll records remain unchanged.
4. Incident: open a case from a scrollable table; dialog must remain in front at narrow/desktop widths. Test backdrop close and Escape. Switch branch then submit a report; branch should match current selection.
5. Run Vercel build; if a TypeScript error appears, share the new commit hash and error log before applying more patches.

**Scope limitation:** This is a targeted main-module revision, not a claim that every HRMS bug has been removed.
