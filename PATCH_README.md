# GitHub Website Installation — HRMS Dashboard & Recruitment

## Prerequisite
This patch was built against the exact ZIP uploaded by the user in this chat: `hrms-prot-main (1).zip`. If your live GitHub branch has more recent edits to any of the existing files listed below, compare those edits before replacing the file.

## Changed source files (7)
| Path | Action |
|---|---|
| `app/page.tsx` | replace |
| `app/globals.css` | replace |
| `components/DashboardOverview.tsx` | add |
| `components/DashboardOverview.module.css` | add |
| `components/EmployeeWorkspace.tsx` | replace |
| `components/RecruitmentWorkspace.tsx` | replace |
| `lib/dashboardAnalytics.ts` | add |

Extract the ZIP. In your GitHub `main` branch, upload files to their corresponding existing folder paths; do not upload the ZIP itself as a repository file. Commit all seven files together to trigger Vercel.

## Browser verification after deploy
1. Sign in as HR or Super Admin. Dashboard must start with Analytics, followed by Quick Actions, alerts, and the existing demo activity section.
2. Change branch; check headcount, requests and incidents counts. The salary report should never count sample releases as real browser-reviewed salary.
3. Open Recruitment home: three cards on left and Interview Calendar on right at desktop size. Use calendar arrows and date buttons; click an appointment to open the applicant.
4. Change branch and ensure calendar entries respect the selected branch. Check mobile stacking.
5. Open Employee 201. `Full View` opens the same comprehensive profile; Edit must still work under existing permissions.
6. Sign in as BM; sensitive position-separated termination figures and payroll salary totals should not be displayed. Check Ms Kate retains normal HR features and her dedicated final-approval module.
7. Check browser DevTools and Vercel build for any additional errors before merging later revisions.

## Data boundaries
This remains browser-local demo data, not authenticated payroll or employee accounting; `Salary released` uses recorded gross salary releases from last month only. Historical branch attribution requires snapshot branch metadata and a backend in a future revision. Complain/incident totals include current demo incidents if seeded. KPI is a scoped task preview, not a complete productivity score or statutory reporting dataset. ERP stays fully disconnected.
