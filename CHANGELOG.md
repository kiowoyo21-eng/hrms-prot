# HRMS Universal UI V1 — Incremental Fix Log
Date: 2026-10-20

## Confirmed bugs addressed
- Dashboard **Module Alerts** and **Urgent Alerts** formerly totaled every registry entry regardless of the branch and the user's available modules. Both now use the same branch/permission-scoped counts shown in the module dashboard, with duplicates (same module alert ID) counted once.
- Payroll and loan notifications are grouped once under Payroll Management; branch-scoped sidebar and popover badges use the same shared helper.
- Module notification menus and shared calendar date pickers used absolute positioning inside module panels and could be clipped or appear below other content. They now render in a body portal, with viewport-aware placement and scrolling. Outside-click and Escape close the popover.
- Seven dialogs in Compliance, Leave Management, and Recruitment were rendered inside their modules. They now use body portals so page scroll/overflow stacking cannot obscure them: two compliance dialogs, three leave dialogs, the recruitment decline dialog, and fullscreen résumé viewer.
- Dashboard example activities and audit sample entries are explicitly labeled as demo data instead of implying live transactions.

## Files changed
- `app/layout.tsx`: loads the dedicated global UI overlay stylesheet.
- `app/universal-ui.css`: small style overrides for portaled calendar and notification menus; avoids replacing the large existing `globals.css`.
- `app/page.tsx`: consistent alert counts and honest demo-activity labels.
- `components/ModuleAlerts.tsx`: consistent alert grouping plus body-portal notification menus.
- `components/CalendarDatePicker.tsx`: body-portal calendar picker.
- `components/ComplianceWorkspace.tsx`: two portal dialogs.
- `components/LeaveManagementWorkspace.tsx`: three portal dialogs.
- `components/RecruitmentWorkspace.tsx`: two portal dialogs.
- `components/ui/useFloatingPopover.ts`: reusable popup positioning and viewport tracking.
- `lib/floatingPosition.ts`: tested viewport geometry.
- `lib/moduleAlertViews.ts`: tested branch/role-visible alert grouping and de-duplication.

## Out of scope / still outstanding
- Full cross-module mobile/desktop browser regression across every screen and modal.
- Modal focus trapping, Escape-key handling for all legacy dialogs, and complete keyboard accessibility.
- Data-source de-duplication (underlying local records are intentionally untouched); this patch only de-duplicates alert display identifiers.
- Browser-only auth, approvals and audit storage are not production security or tamper-proof evidence.
- Complete Next.js production build (unavailable here because required packages were absent from the local npm cache). Vercel deployment validation required.
