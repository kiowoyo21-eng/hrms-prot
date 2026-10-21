# Install on GitHub website

This is an **incremental source patch**, not a whole HRMS project. Apply it to the exact current HRMS repo matching the uploaded `hrms-prot-main (1).zip` (or the same source after the previous dashboard/calendar patch). The ZIP includes the previous dashboard/calendar sources, so you do **not** need to upload both patches separately.

1. Unzip this archive on your computer.
2. On GitHub, visit your HRMS `main` branch.
3. Upload/replace the eight source files in their respective `app/`, `components/`, and `lib/` subfolders. **Preserve folder paths**; do not upload the ZIP itself or put all files in repo root.
4. Commit changes together.
5. Wait for Vercel: check `npm run build` succeeded; use a hard browser refresh.
6. Sign in as HR and Ms Kate; verify Dashboard analytics, Employee 201 Add Filter, summary and full record, and the Recruitment Calendar.

If you have edited any listed file directly in GitHub since the last uploaded ZIP, compare/merge before replacing.

### UI regression checklist
- Desktop and mobile: no overlapping quick actions or clipped filters; Add Filter dialog remains in viewport, scrolls, Escape/close/outside click dismisses, Reset and Show Results work.
- Filtering: status, branch, job level, employment arrangement, docs status, gender, salary type/ranges, hire dates, chips, branch-scoped counts; no cross-branch employee detail.
- Employee profile: Overview cards open existing detail dialogs; Complete Employee 201 includes all current personal, government and compensation fields; Edit still saves via existing HR state flow.
- Dashboard: approved local salary release for completed month vs sample releases, missing data, male/female/unspecified totals, gained/lost by position, HR Forms task counts, branch switch.
- Recruitment: three cards on left, calendar on right desktop; stacks vertically on small screens; interview click opens authorized candidate.
- Other modules: existing Ms Kate HR access and exclusive final-approval, payroll, audit and universal notification bell unchanged.

### Limitations
This container had no installed Next.js/React/TipTap dependencies. A full Next.js build and actual React click-through test could not be run. Static HTML/CSS design smoke previews are **not** live HRMS tests.
