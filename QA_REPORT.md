# HRMS Universal Notifications V2 — QA
Date: 2026-10-20

## Passed in the local reconstructed project
- 110 TypeScript/TSX/JS source files parsed without syntax errors.
- 297 relative import statements checked; none missing.
- `app/globals.css` parsed successfully with PostCSS.
- 21 focused regression assertions passed using the notification-view helper functions and interface source: branch isolation, permission-based module groups, no double-counting legacy loan alerts, duplicate IDs, blank states, publisher merge, count and urgency checks, topbar integration and capped previews.
- Diff against Universal UI V1 base contains exactly five modified source files.

## Not verified
- No complete dependency-backed TypeScript typecheck or `next build` completed in this container (project node_modules unavailable).
- No interactive browser/Playwright test completed. Fixed-position popup, tab usability and responsive layout require Vercel browser validation.
- No remote/multidevice notification delivery or backend security exists.

## Known functional limitations
- Notification sources for Recruitment, Leave, Incident and Compliance are currently established when the corresponding module loads. They may be absent in a fresh session until that module is opened.
- Some modules do not generate action alerts at all. They still show the topbar center for cross-module alerts.
- A topbar notification navigates to its owning module; opening a specific record remains a contextual-module function.
- Alerts may become stale if browser-local records change outside the mounted module; true shared real-time status requires a backend/subscription architecture.

## Manual acceptance checklist
1. Confirm Vercel optimized compile and TypeScript checks pass.
2. Confirm bell visible on Dashboard, Employee 201, Payroll, Leave, Incidents, Assets, Recruitment, Compliance, Documents, Drive, Docs, Sheets and Settings.
3. Confirm no role-restricted modules or foreign-branch alerts appear.
4. Confirm bell popup is positioned within viewport on desktop/mobile and closes on Escape/outside click.
5. Confirm two payroll publishers' actions are included after Payroll is opened.
6. Confirm 10-per-group preview cap and working navigation for more actions.
7. Confirm signing out hides all authenticated UI and resets displayed alerts.
