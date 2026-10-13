# UCMM HR — Vercel TypeScript Hotfix + Recruitment Layout
Date: 2026-10-13 | UPDATED SOURCE FILES ONLY

## Prerequisite
Apply after the **2026-10-13 Batch 1 Payroll & Employees patch**. This hotfix changes just three existing project files. Unzip and upload these files into the same folders in your existing GitHub repository; do not upload a nested folder and do not remove other files.

## Source changes
1. `components/EmployeeWorkspace.tsx` — fix TypeScript TS2367 from redundant `role !== "BM"` check. This comparison is unnecessary because BM was already excluded by an earlier return. Preserve HR salary-rate edit button and safeguards.
2. `components/RecruitmentWorkspace.tsx` — remove redundant applicant summary line and demo loader from the home screen; retain module bell, relocate the demo loader to a collapsed `Demo data tools` section in Hiring Cycle; arrange the three existing Hiring Forms / Hiring Cycle / Onboarding cards above the four Recruitment KPI cards in the left column, with the interview calendar on the right.
3. `app/globals.css` — scoped CSS overrides for horizontal white rectangular hiring cards with a square colored icon tile at left, 2×2 square KPIs underneath, and responsive calendar placement. Other modules keep their original styles.

## Validation
- TypeScript/TSX source syntax parsed successfully in both changed components and all project TS/TSX files.
- CSS stylesheet parsing returned no errors.
- Corrected BM comparison is no longer present in the Employee 201 return markup.
- Full `next build`/browser regression test **NOT verified** in this environment: Next.js/React dependencies cannot be installed from npm due unavailable network (EAI_AGAIN).

## After upload
Confirm Vercel compiles and completes **TypeScript validation**; open Employee 201 -> Edit Basic Pay Rate (authorized HR) and Recruitment & Hiring at desktop and mobile widths. If the build still reports a TypeScript error, send the new log line and file location.

No real employee, Supabase, payroll, attendance or applicant records are modified by this patch.
