# Batch 08 — Universal UI component migration (2026-10-22)

**Requested deliverable:** changed/new files-only patch against the **Batch 07 revised UI Dashboard source**, not the original Batch 04 ZIP.

**Source scope:** shared primitives, identified module tabs, compatibility CSS and dialog keyboard/focus management; no employee, payroll, accounting, audit, or browser-storage schema changes.

| Revision | Actual source paths | Implementation | Verification |
|---|---|---|---|
| UI8-01 | `components/ui/HrmsPrimitives.tsx`, `app/hrms-components.css`, `app/layout.tsx` | Reusable Button, Badge, Card, Field, Input, PageHeader, StatCard, EmptyState, DataTable, Tabs, Dialog, Toast | TSX syntax/CSS/import checks only; browser pending |
| UI8-02 | `components/GroupedWorkspace.tsx`, `components/ReportsLanding.tsx`, `components/HRFormsRequestsWorkspace.tsx`, `components/RecruitmentWorkspace.tsx` | Migrated functional tab switches to shared keyboard-aware `HrmsTabs` | Source checks passed; browser navigation not verified |
| UI8-03 | `components/HelpButton.tsx`, `components/ui/HrmsPrimitives.tsx` | Help guides use accessible portal dialog and persistent action footer; retains all guide text | Source checks passed; keyboard focus/browser pending |
| UI8-04 | `components/ui/useManagedDialog.ts`, `components/PayrollOperationsHub.tsx`, `components/LeaveManagementWorkspace.tsx`, `components/AssetWorkspace.tsx` | Preserve existing portal workflow modals, add topmost Escape/focus trapping/restoration/scroll lock | Source checks passed; live modal workflows not verified |
| UI8-05 | `app/hrms-migration.css`, `app/layout.tsx` | Token-aligned cards, tables, forms, buttons, empty states and modal compatibility across identified operational modules | CSS parsed; screenshots/browser pending |
| UI8-06 | `scripts/check-ui-components.cjs` | Regression smoke checks of component exports/migrated wiring | Passed in local dependency-free run |

## Preserved behaviors

- `lib/hrState.ts`, role permissions and local state/storage keys **not edited**.
- Leave approval/credit logic, Government Deductions schedule/version math, asset device lifecycle, recruitment stages, HR Forms submit/review logic, report exports and working Tools editors **not rewritten**.
- Existing Dashboard YTD calculation and visible Additional Reports remain exactly as in Batch 07.
- ERP connection remains prohibited. CMS/Accounting integrations remain future architecture only.

## Known incomplete work (do not mark verified)

- Not all legacy buttons/tables/tabs/dialogs are yet converted to React primitives; older modules continue under the scoped compatibility layer.
- Broad CSS consolidation (removing all hardcoded colors, arbitrary spacing, duplicated declarations and `!important`) is **outstanding**. Do not delete `app/layout-recovery.css` blindly.
- Stylelint rules and CI enforcement need an installed development toolchain and a staged remediation plan.
- Full `tsc --noEmit`, Next.js build, interactive keyboard testing, responsive screenshots, actual table exports and account/permission browser regression still require dependencies and a running app.
- Sample activity remains removed from the Dashboard by earlier batch; historical audit data remains intact.

## Checks

Run:

```bash
node scripts/check-ui-components.cjs
node scripts/check-dashboard-ytd.cjs
npm run lint
npm run build
```

Only treat the first two as source-level tests. Run the last two in an environment with installed dependencies. Complete browser QA across user roles and screen widths before production approval.
