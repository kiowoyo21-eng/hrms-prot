# HRMS — Dashboard Analytics & Recruitment Calendar Revision

Base: the user-uploaded `hrms-prot-main (1).zip` (not an older consolidated snapshot). Patch contains only seven new/changed source files.

## Dashboard
- An analytics-first dashboard precedes Quick Actions and existing Module Alerts.
- Employee 201: branch-specific headcount and recorded Male/Female/Other or unspecified counts; no invented gender values.
- Last completed Philippine calendar month: new hires from recorded hire date; separations from *applied* Employee Lifecycle Offboard effective dates; terminations separated from other exits; role-protected position breakdown for HR/Super Admin/Ms Kate.
- Last-month gross salary releases: only `Browser Review`, `Released`, `Salary` transactions actually recorded in HRMS. Excludes seeded sample releases, other kinds, and pending releases. Shows empty state if none exist. Branch is based on the employee's **current** branch; this is not a historical branch payroll ledger.
- HR Forms and Incident Reports: counts of submitted/pending and documentation-approved/rejected or closed records, respecting available role/branch visibility. Demo incidents remain labeled.
- Account-holder KPI: own pending/decided HR documentation requests and, for HR reviewers, submitted requests available for review and reviews recorded under their username. Does not pretend to be a complete employee performance KPI.
- Quick Actions, alerts, links, and existing modules remain available.

## Recruitment & Hiring
- Restored previously existing `RecruitmentInterviewCalendar` on Recruitment home, showing actual available applicant interview schedules.
- Desktop: three workflow cards stacked on the left, calendar on the right; responsive layout for smaller screens.
- Calendar agenda and upcoming appointments link to the respective applicant; respects current branch filtering.
- Restored calendar component styles, which were not present in the uploaded `app/globals.css`.

## Employee 201
- Renamed directory's `View` action to `Full View` in table and compact cards. Reuses the existing Employee 201 complete record and edit workflow; no duplicate data views created.

## Preserved
- No mutations to employee, payroll, CMS, Accounting, incident, form, or Ms Kate approval stores.
- Existing Super Admin / HR / BM / Ms Kate role definitions retained.
- No ERP or external system integration.
