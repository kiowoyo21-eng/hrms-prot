# Recruitment & Hiring — 3 stacked cards + Interview Calendar (October 13, 2026)

**Updated files only**. Based on the previous UCMM combined mock employee/device/hiring/attendance patch. Install that combined patch first if not yet uploaded. Apply these files at the same repository paths; do not create another enclosing directory.

## Scope
- Recruitment & Hiring home only: existing **Hiring Forms**, **Hiring Cycle**, and **Onboarding Process** cards stacked in the left column. Original icon/color panels preserved with compact heights.
- Interview Calendar in the right column, sourced from the applicant interview records already in the browser (branch filter respected). Navigate months, select dates, inspect appointments (time, round, candidate, branch, interviewer, result), open the related applicant, or open Hiring Cycle to schedule.
- Upcoming interview list with clickable dates. Original four recruitment statistics are preserved.
- Responsive: two-column on larger content areas; calendar stacks underneath cards on smaller viewports.

## Deliberately unchanged
Applicant and job-form storage, screening workflows, interview scoring, onboarding, hiring decisions, mock employee and device data, September/October attendance, leave, government holidays, payroll, and Supabase setup.

## Limitations
Interview events are from the existing local/browser review dataset, not real backend/calendar synchronization. No Google Calendar, SMS/email reminders, or cross-device syncing is implemented. TypeScript syntax and ZIP checks are performed here; full Next.js production build and visual testing still required after deployment.
