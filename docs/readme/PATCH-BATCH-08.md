# Apply HRMS Batch 08 Universal UI patch

This ZIP contains only new/modified files, **not a complete application**.

## Required baseline

The latest **Batch 07 — Revised UI/Dashboard patch** must already be applied on top of the corrected Batch 04 and Dashboard alignment releases. Do **not** apply this Batch 08 patch directly to the original HRMS repository without first applying its earlier changes. The patch does not replace `lib/` data stores or account data.

## Apply

1. Back up or commit the existing HRMS source.
2. Extract the ZIP into the repository's parent folder, merging its `hrms-prot-main/` file paths and overwriting only matching files.
3. Install dependencies in your own development workspace (the ZIP intentionally excludes `node_modules`).
4. Run `npm run lint`, `npm run build`, `node scripts/check-ui-components.cjs`, `node scripts/check-dashboard-ytd.cjs`.
5. Perform browser QA with Super Admin, HR, Ms Kate and BM: tab selection and arrow keys; Leave, Assets and Government Deductions dialogs; record actions; report filters and exports; keyboard Escape/Tab/focus restoration; tablet/mobile breakpoints.

## Actual scope

Adds reusable UI primitives and a compatibility style layer; migrates grouped-module, HR forms, Reports and Hiring stage tabs, and help dialogs. Preserves Leave, Government Deductions and Assets transaction handlers while improving their modal keyboard management. Does **not** claim the full 10-page UI/UX proposal has been migrated or browser-verified.

For exact changed files, limitations and remaining work see `docs/revisions/batches/BATCH-08-UNIVERSAL-UI.md`.
