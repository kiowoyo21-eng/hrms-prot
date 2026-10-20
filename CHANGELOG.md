# HRMS Universal Notifications V2 — Changelog
Date: 2026-10-20

## Changes
1. Added one persistent **all-module notifications bell** in the workspace top bar. Available on every signed-in, authorized HRMS module, including screens with no individual bell.
2. Added **This Module** and **All Modules** notification views, grouped by owning module and filtered by the active user's allowed modules and selected branch.
3. Notification rows navigate to the owning module. The existing contextual per-module buttons remain for record-specific navigation.
4. Reused the viewport-aware floating portal to prevent dropdown clipping by scroll containers or screen edges; added outside-click and Escape closure, and responsive panel styling.
5. Added a 10-item preview limit per module, with an option to open the module for the remaining alerts. Counts still reflect all distinct applicable pending records.
6. Fixed an existing notification publisher collision: Payroll cutoff monitoring and Payroll Operations now publish independently. The merged list deduplicates repeated identifiers.
7. Assets and Employee Document alert feeds now include their known branch; unresolved branch is marked **Unassigned** and excluded from a specific branch filter, without inventing branch membership.
8. Stabilized registry publishing callbacks to avoid redundant publish effects when alert state changes.

## Source files
- `app/page.tsx`
- `app/globals.css`
- `components/ModuleAlerts.tsx`
- `components/PayrollCutoffAlertPublisher.tsx`
- `lib/moduleAlertViews.ts`

## Not changed
Employee 201, payroll computation, payouts, approvals, document content, and stored HR records. No notification emails, browser push notifications, or background service are activated.
