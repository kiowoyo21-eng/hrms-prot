# UCMM HR — Combined Mock Data Patch · 13 October 2026

**Updated files only.** Apply this one patch to the GitHub repository that already has the Asset View / Filters / Dashboard revision. It includes both **Leave/Holidays** and **Hiring/Attendance** updates which have not yet been uploaded. Do not apply those two separately afterward.

## Contents

- 35 fictional employees: 10 Operations, 5 Office, 5 Admin, 10 Marketing, 5 Branch Supervisors. Operations salary scenario PHP 20,000/month. Office and Marketing PHP 755/day mock NCR reference. Admin PHP 755/day and Supervisors PHP 30,000/month are test placeholders, NOT user-confirmed salaries. The production rates still require HR configuration.
- 50 fictional devices: 20 laptops, 15 mobile phones, 8 desktop/Mac minis, 4 tablets, and 3 printers, with example assignments and statuses.
- 20 hiring applicants, 15 leave requests, and 43 government holiday references (as bundled in the earlier patch).
- 2,135 generated daily attendance rows: September 1–30 (1,050) and October 1–31 (1,085), including rest days, late, absent, incomplete, OT, leave, and simulated future dates after October 13.
- Consistent employee IDs and names across sample assets, approved leave, payroll references, and document index.

## Browser record refresh

On a fresh browser, the new fictional sample scenario loads automatically. Untouched original demo 12-person/4-asset data may migrate automatically if its default values match exactly. **Edited browser-local data is preserved**. To explicitly load this coordinated test scenario, go to **Settings → Local Review Records → Load 35 Employees + 50 Devices Demo Scenario**; confirm the warning before reset, as it replaces browser-local test edits. This does **not** modify Supabase or GitHub data.

## Limitations

This is UI/demo data, not actual attendance, employee payroll records, authenticated signatures, or statutory computation verification. No full Next.js production build or browser user-flow test has been completed in this environment. Run a Vercel deployment preview test after applying files.
