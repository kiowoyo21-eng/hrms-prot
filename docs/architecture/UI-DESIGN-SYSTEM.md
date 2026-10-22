# HRMS UI design system — progressive adoption

Source: revised 2026-10-22 Underchargers HRMS UI/UX proposal. **Approved module-specific instructions override generic proposal rules.**

Current foundation:
- `app/tokens.css` sets neutral/navy/yellow tokens, semantic colors, 4px spacing scale, text/radius/elevation/z-index sizes, and compatibility aliases.
- `app/ui.css` sets shared app-shell width, aligned topbar/content frame, sidebar rhythm and focus outlines.
- `components/DashboardOverview.module.css` and `components/DashboardExtras.module.css` use the foundations for the updated Dashboard.

## Approved exceptions retained

- Demographics is an internal tab of Reports & Analytics; no extra sidebar item.
- Six Workforce KPI cards in three desktop columns, repositioned on tablet/mobile without arbitrary scale reduction.
- Employee 201 Overview is the primary employee view.
- Government Deductions dialogs stay compact (small metadata, scrollable bracket body, fixed actions) rather than adopting the generic xl modal.
- Empty states have content-sized height; no fixed 240px empty boxes.

## Migration progress

Tokens, shell, Dashboard and grouped navigation are updated at source level. Existing module-specific CSS, tabs, dialogs and edit-tool interfaces still require component migration and real browser QA. Do not assert global token-count or contrast-compliance targets as met until verified. Older CSS files still contain legacy hard-coded values and `!important` rules.

## QA acceptance for each future module migration

Shared left/right alignment; no clipped popovers; keyboard focus visibility; controlled responsive positioning; working table actions and data links; no stored-data regression; screenshot/browser verification at 1920, 1440, 1024, 768 and 390px widths.

## Batch 08 — reusable primitives and staged migration

See [UI component catalog](UI-COMPONENT-CATALOG.md) and [Batch 08 revision record](../revisions/batches/BATCH-08-UNIVERSAL-UI.md).

Added `components/ui/HrmsPrimitives.tsx`, `components/ui/useManagedDialog.ts`, `app/hrms-components.css` and `app/hrms-migration.css` as a practical migration layer. Existing grouped-module/HR Forms/Reports/Recruitment tabs were migrated to one accessible tabs component. Help dialogs use one portal shell; existing Government Deductions, Leave and Asset dialogs gain focus and Escape management without changing approvals or record processing.

These are source-level changes, **not** evidence of completed visual QA or full proposal adoption. Legacy CSS variation still exists and must be migrated incrementally after real browser/build testing.
