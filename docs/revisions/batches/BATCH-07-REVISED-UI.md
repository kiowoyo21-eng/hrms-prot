# Batch 07 — Revised UI/UX foundation and Dashboard YTD (2026-10-22)

**Basis:** Revised `UI UX Proposal — Underchargers HRMS (1).docx`, provided by the user; approved HRMS exceptions take precedence. This is a **progressive migration**, not a claim that every module has adopted the proposed primitives.

**Source baseline:** post-Batch-04 corrected source **plus** Batch 06 Dashboard Alignment patch. **Output:** patch-only changed files.

| ID | Actual files | Source change | Status |
|---|---|---|---|
| UI7-01 | `app/tokens.css`, `app/layout.tsx`, `app/globals.css` | Add shared color/spacing/typography/radius/layer tokens; preserve old CSS aliases | Implemented; browser QA pending |
| UI7-02 | `app/ui.css`, `app/page.tsx`, `lib/mock.ts` | Align 64px shell borders, 1440px shared header/page content frame, 256px sidebar; four labeled nav groups; unique main module icons; visible focus ring | Implemented; browser QA pending |
| DASH7-01 | `lib/dashboardAnalytics.ts`, `components/DashboardOverview.tsx` | Hired/Separated This Year; Jan 1–today in Asia/Manila; eligible reviewed gross salary releases YTD | Implemented; calculation smoke tests passed |
| DASH7-02 | `app/page.tsx` | Remove Sample Activity **UI only**, preserve audit infrastructure | Implemented; browser QA pending |
| DASH7-03 | `components/DashboardExtras.tsx`, `components/DashboardExtras.module.css` | Visible and clickable Employment Status, Basic Pay Rates and Compliance summaries; remove empty-looking collapsed report section | Implemented; browser QA pending |
| DASH7-04 | `components/DashboardOverview.module.css`, `app/ui.css` | Maintain balanced 3-column desktop Workforce grid, aligned content boundaries, compact cards and repositioning breakpoints | Implemented; browser QA pending |

## Data semantics

- **Current headcount / male / female**: source = branch-scoped current Employee 201 records (not annual accumulations).
- **Hired This Year**: recorded hire dates from January 1 through current Manila calendar date, current in-scope Employee 201 records. Historical records removed entirely from local state cannot be reconstructed.
- **Separated This Year**: applied Offboard workflow cases dated January 1–today, scoped by the recorded source branch. These are **frontend demo workflow events**, not authoritative final legal separations. Future, pending, deferred, and declined records are excluded.
- **Gross Salary Released**: uniquely identified `Released` / `Browser Review` / `Salary` records with valid nonnegative gross amounts and a `paidAt` date in the same Jan 1–today range. Branch scope uses linked current Employee 201 employee IDs; an ex-employee with no recoverable branch mapping cannot be assigned to a branch. Sample, pending, bonus/13th, future, prior-year and duplicate release IDs are excluded. This is **not** verified accounting expenditure or estimated basic salary.
- No modifications to employee / payroll / audit data objects or browser-storage keys.

## Current compliance with revised proposal

**Included:** foundations/tokens; app-shell alignment; focus-visible rule; grouped sidebar/icons; dashboard operational data and visible report cards. **Not yet finished across every module:** reusable Button/Field/Tabs/Table/Dialog primitive migration, elimination of all arbitrary CSS values and `!important`, deletion of `layout-recovery.css`, source-level stylelint enforcement, editor-specific migrations, full tab/modals parity, browser responsive screenshots and keyboard/focus-trap QA. These items remain planned, not implemented.

## Checks

- TS/TSX syntax parse and PostCSS CSS parse (source-level only).
- Relative TS import resolution and Markdown links.
- Synthetic Dashboard YTD calculation checks (branch scope, dates, reviewed/sample, duplicate ID exclusion).
- `npm run lint`: blocked by missing React/Next/module types in this environment.
- `npm run build`: blocked (`next: not found`).
- Real browser QA at 1920 / 1440 / 1024 / 768 / 390: **not run**.

## Rollout caution

No production permissions/backend guarantee. These revisions do not connect HRMS to Accounting, Cashier or ERP; ERP remains standalone.

Reproducible focused calculation test (after project dependencies are installed):

```bash
node scripts/check-dashboard-ytd.cjs
```

This test exercises the pure dashboard analytics function and does **not** certify the React UI or production payroll compliance.
