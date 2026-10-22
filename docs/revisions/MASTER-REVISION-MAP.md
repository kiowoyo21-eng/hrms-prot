# HRMS master revision map

Status follows **actual code changes**, not intention. `implemented` does not imply browser QA verification. The current source is a frontend-only demo.

| ID | Scope | Batch | Status | Affected paths / reason |
|---|---|---|---|---|
| NAV-01 | Request and Reports grouped nav | 01 | implemented | lib/mock.ts; components/GroupedWorkspace.tsx; app/page.tsx |
| NAV-02 | Reports and Demographics grouped nav | 01 | implemented | lib/mock.ts; components/GroupedWorkspace.tsx; app/page.tsx |
| NAV-03 | Tools grouped nav with existing editors | 01 | implemented | lib/mock.ts; components/GroupedWorkspace.tsx; app/page.tsx |
| NAV-04 | Payroll / Leave grouping | 01 | deferred | No consolidation: separate complex operational workflows; preserve existing modules |
| NAV-05 | Recruitment before Employee 201 | 01 | implemented | lib/mock.ts |
| RBAC-01 | Audit Log for Super Admin only | 01 | implemented | lib/mock.ts; app/page.tsx; components/AuditLogWorkspace.tsx |
| RBAC-02 | Ms Kate HR access plus special final approval | 01 | implemented | lib/mock.ts; components/studio/StudioGate.tsx (existing HR-like gate) |
| UI-01 | Universal grouped tabs, controlled widths and responsive positioning | 01 | implemented | components/GroupedWorkspace.tsx; app/universal-ui.css |
| UI-02 | Entire-app card, popover and modal QA | 01+04 | partial; browser QA outstanding | app/globals.css; app/universal-ui.css; components/LeaveManagementWorkspace.tsx; components/IncidentWorkspace.tsx; page-by-page screenshot check still required |
| DOC-01 | Subject-based Markdown organization | 01 | implemented | docs/INDEX.md; docs/readme/; docs/revisions/; docs/architecture/; docs/workflows/; docs/changelogs/ |
| DASH-01 | Dashboard and pending-action redesign | 02 | implemented (browser QA pending) | app/page.tsx; components/DashboardOverview.tsx; components/DashboardOverview.module.css; components/DashboardExtras.tsx; components/ModuleAlerts.tsx; app/globals.css |
| REP-01 | Analytics and Demographics details | 02 | implemented (browser QA pending) | components/ReportsLanding.tsx; components/EmployeeDemographicsWorkspace.tsx; components/HROperationsExtras.module.css; app/globals.css |
| EMP-01 | Employee 201 parent + 4 cards + history | 03 | implemented (browser QA pending) | components/EmployeeWorkspace.tsx; components/workspace/EmployeeFullRecord.tsx; app/globals.css |
| HIRE-01 | Hiring calendar positioning | 03 | implemented (browser QA pending) | components/RecruitmentInterviewCalendar.tsx; components/RecruitmentWorkspace.tsx; app/globals.css |
| PAY-01 | NCR 755 reference in pay-rate view | 03 | implemented (browser QA pending) | components/PayrollOperationsHub.tsx; app/globals.css; underlying payroll library left unchanged |
| LEAVE-01 | Leave and incentive approval layout | 04 | implemented (browser QA pending) | components/LeaveManagementWorkspace.tsx; app/globals.css |
| RQ-01 | Request/incident feature polish and validation | 04 | implemented (browser QA pending) | components/HRFormsRequestsWorkspace.tsx; components/HROperationsExtras.module.css; app/globals.css; components/GroupedWorkspace.tsx |
| QA-01 | Cross-module UI and approval regressions | 04 | partial; runtime QA blocked | lib/mock.ts; app/page.tsx; components/GroupedWorkspace.tsx; app/drive/; app/spreadsheets/; app/studio/ |

| FIX-01 | Dashboard common card grid and spacing | 05 | implemented (browser QA pending) | components/DashboardOverview.module.css |
| FIX-02 | Hiring common width and calendar reflow | 05 | implemented (browser QA pending) | app/globals.css |
| FIX-03 | Employee 201 Overview primary, directory rows clickable, editing fields preserved | 05 | implemented (browser QA pending) | components/EmployeeWorkspace.tsx |
| FIX-04 | Payroll/Leave landing card consistency | 05 | implemented (browser QA pending) | app/globals.css |
| FIX-05 | Assets true modal action flows and accessible record rows | 05 | implemented (browser QA pending) | components/AssetWorkspace.tsx; app/globals.css |
| FIX-06 | Dashboard/demographics data card and record drill-downs | 05 | partial overall; named surfaces implemented; browser QA pending | components/DashboardOverview.tsx; components/EmployeeDemographicsWorkspace.tsx; components/EmployeeWorkspace.tsx; components/AssetWorkspace.tsx |
| FIX-07 | SSS/PhilHealth/Pag-IBIG/BIR compact dialog and bracket pagination | 05 | implemented (browser QA pending) | components/PayrollOperationsHub.tsx; app/globals.css |
| FIX-08 | Whole-system interactive controls and responsive QA | 05 | partial; live browser QA blocked | app/globals.css; components/ affected above |

## Original 58-item review checklist

The following tracks each originally numbered requirement. `Implemented (unverified browser)` is **not** equivalent to QA passed. See batch reports for file paths and verification.

| Review # | Module | Proposed requirement | Batch | Current state |
|---|---|---|---|---|
| 01 | navigation + permissions | Combine HR Forms & Requests and Incident Reports into Request and Reports | 01 | implemented (unverified browser) |
| 02 | navigation + permissions | Combine Reports & Analytics and Demographics | 01 | implemented (unverified browser) |
| 03 | navigation + permissions | Combine Drive, Spreadsheet and Documents Library into Tools | 01 | implemented (unverified browser) |
| 04 | navigation + permissions | Payroll and Leave grouping (review before any merge) | 01 | deferred; keep separate operations |
| 05 | navigation + permissions | Audit Log access restricted to Admin only | 01 | implemented (unverified browser) |
| 06 | navigation + permissions | Recruitment & Hiring directly before Employee 201 | 01 | implemented (unverified browser) |
| 07 | dashboard | Remove redundant dashboard All branches headcount line | 02 | implemented (browser QA pending) |
| 08 | dashboard | Compact dashboard header replacing oversized hero | 02 | implemented (browser QA pending) |
| 09 | dashboard | Uniform workforce overview metric cards | 02 | implemented (browser QA pending) |
| 10 | dashboard | Remove unnecessary Total Employees / Salary Released spans | 02 | implemented (browser QA pending) |
| 11 | dashboard | Reduce workforce demographics whitespace | 02 | implemented (browser QA pending) |
| 12 | dashboard | Redesign Pending Actions by Module cards | 02 | implemented (browser QA pending) |
| 13 | dashboard | Prioritize urgent true pending actions and verify counts | 02 | implemented (browser QA pending) |
| 14 | dashboard | Preserve meaningful dashboard analytics | 02 | implemented (browser QA pending) |
| 15 | employee-201 | Compact Employee 201 full record view | 03 | implemented in source (browser QA pending) |
| 16 | employee-201 | Employee 201 filtering improvements | 03 | preserved existing filters; no new filter rewrite |
| 17 | employee-201 | One parent containing four clickable info cards | 03 | implemented in source (browser QA pending) |
| 18 | employee-201 | Remove oversized individual label-value tiles | 03 | implemented in source (browser QA pending) |
| 19 | employee-201 | History views for individual Employee 201 cards | 03 | implemented in source (browser QA pending) |
| 20 | employee-201 | Preserve all Employee 201 fields and actual data | 03 | implemented in source (browser QA pending) |
| 21 | employee-201 | Sensitive statutory ID role restrictions | 03 | implemented in source (browser QA pending) |
| 22 | payroll | NCR automotive ₱755/day rate reference only | 03 | implemented in source (browser QA pending) |
| 23 | payroll | Remove unrelated regional rate options in reference | 03 | implemented in source (browser QA pending) |
| 24 | payroll | Preserve actual compensation and historic payslips | 03 | implemented in source (browser QA pending) |
| 25 | payroll | Confirm wage classification applicability | 03 | implemented in source (browser QA pending) |
| 26 | payroll | Compact Payroll & Leave internal workflows | 03 | partially implemented; leave cleanup deferred to Batch 04 |
| 27 | hiring | Hiring three stacked cards left, calendar right | 03 | implemented in source (browser QA pending) |
| 28 | hiring | Stable controlled desktop calendar dimensions | 03 | implemented in source (browser QA pending) |
| 29 | hiring | Mobile/tablet repositioning instead of component scaling | 03 | implemented in source (browser QA pending) |
| 30 | hiring | Preserve existing hiring functionality | 03 | implemented in source (browser QA pending) |
| 31 | navigation + permissions | Demographics dedicated internal Reports & Analytics tab | 02 | implemented (unverified browser) |
| 32 | reports-analytics | Preserve demographic and government-relevant breakdowns | 02 | implemented (browser QA pending) |
| 33 | reports-analytics | Compact demographics panels and cards | 02 | implemented (browser QA pending) |
| 34 | reports-analytics | Avoid duplicate analytics KPIs and charts | 02 | implemented (browser QA pending) |
| 35 | reports-analytics | Preserve report exports and data-gap awareness | 02 | implemented (browser QA pending) |
| 36 | leave | Leave Incentive Approval uniform metrics | 04 | implemented in source (browser QA pending) |
| 37 | leave | Fix concatenated number-label KPI values | 04 | implemented in source (browser QA pending) |
| 38 | leave | Reduce oversized Leave search/filter wrapper | 04 | implemented in source (browser QA pending) |
| 39 | leave | Compact honest Leave table empty state | 04 | implemented in source (browser QA pending) |
| 40 | leave | Consistent Leave status and action controls | 04 | implemented in source (browser QA pending) |
| 41 | leave | Preserve Leave credit proposals and approvals | 04 | implemented in source (browser QA pending) |
| 42 | universal-ui | Uniform equivalent card styles globally | 01/04 | partially implemented; final QA pending |
| 43 | universal-ui | Uniform equivalent icon placement | 01/04 | partially implemented; final QA pending |
| 44 | universal-ui | Controlled max widths, no forced stretching | 01/04 | partially implemented; final QA pending |
| 45 | universal-ui | Responsive positioning instead of arbitrary shrinking | 01/04 | partially implemented; final QA pending |
| 46 | universal-ui | Compact label-value details | 03/04 | partial: Employee 201 details completed in source; other modules require visual QA |
| 47 | universal-ui | Remove excessive whitespace | 02/04 | partial: Dashboard, Reports, Leave, Requests and Incident views compacted |
| 48 | universal-ui | Universal popup/modal/dropdown clipping and stacking QA | 01/04 | existing shared controls inspected; full QA pending |
| 49 | universal-ui | Uniform functional buttons, filters and tables | 01/04 | existing shared controls inspected; full QA pending |
| 50 | universal-ui | No promotional or duplicate module copy | 02/04 | partial: dashboard hero replaced; other pages need copy audit |
| 51 | universal-ui | Preserve working features/data with no breaking rewrite | 01/04 | no data migration; regression QA pending |
| 52 | navigation + permissions | Ms Kate retains normal HR access including Document Studio | 01 | implemented (unverified browser) |
| 53 | navigation + permissions | Ms Kate has distinct final-approval authority | 01 | implemented (unverified browser) |
| 54 | navigation + permissions | Ms Kate not automatically Admin | 01 | implemented (unverified browser) |
| 55 | navigation + permissions | Protect Audit Log navigation, deep action and content | 01 | implemented (unverified browser) |
| 56 | navigation + permissions | Permissions retained for all grouped internal modules | 01 | implemented (unverified browser) |
| 57 | architecture/workflows | Future Accounting -> Ms Kate final approval sequence | 01/04 | architecture preserved; no live integration |
| 58 | architecture/workflows | Cross-app workflows planned only; ERP disconnected | 01/04 | architecture preserved; no live integration |

## Batch 03 source check (2026-10-22)

See [Batch 03 revision map](batches/BATCH-03.md) and the Employee 201/Hiring/Payroll module docs. Source and CSS parse, relative imports, and documentation links were checked. Full Next.js type-check/build and real browser testing remain blocked or pending; therefore no Batch 03 item is marked **verified**.



## Batch 06 — Dashboard-only polish (2026-10-22)

| Revision ID | Module | Actual paths | Target | Batch | State | Verification |
|---|---|---|---|---|---|---|
| DASH-ALIGN-06 | dashboard | `app/page.tsx`, `app/globals.css` | One coherent centered bounded content grid for KPIs, alerts and shortcuts | 06 | Implemented | Static checks; browser pending |
| DASH-ACTIONS-06 | dashboard | `app/page.tsx`, `app/globals.css` | Alert priority, compact shortcuts, preserved collapsible reports and demo history | 06 | Implemented | Static checks; browser pending |
| DASH-COPY-06 | dashboard | `components/DashboardOverview.tsx` | Shorter accurate salary-source note | 06 | Implemented | Static checks; browser pending |

See [Batch 06](batches/BATCH-06-DASHBOARD.md). No non-dashboard modules changed.

## Batch 07 — revised 2026-10-22 UI/UX proposal, YTD Dashboard and visible reports

| ID | Module | Actual source paths | Outcome | Status | Verification |
|---|---|---|---|---|---|
| UI7-01 | Shared UI | `app/tokens.css`, `app/ui.css`, `app/layout.tsx`, `app/globals.css` | Foundations and aligned shell | implemented | Source syntax/CSS; browser pending |
| UI7-02 | Navigation | `app/page.tsx`, `lib/mock.ts`, `app/ui.css` | Four sidebar groups and distinct main icons | implemented | Source syntax; role browser QA pending |
| DASH7-01 | Dashboard | `lib/dashboardAnalytics.ts`, `components/DashboardOverview.tsx` | Current-year hires, applied offboarding and reviewed gross salary released | implemented | Synthetic YTD calculations passed; browser pending |
| DASH7-02 | Dashboard | `app/page.tsx` | Remove demo Sample Activity UI (retain audit data) | implemented | Source inspection; browser pending |
| DASH7-03 | Dashboard | `components/DashboardExtras.tsx`, `components/DashboardExtras.module.css` | Visible clickable additional reports, compact actions | implemented | Syntax/CSS; browser pending |
| DASH7-04 | Dashboard | `components/DashboardOverview.module.css` | Aligned three-column card layout/reflow | implemented | CSS parse; browser pending |
| UI7-03 | All modules | Existing module-specific CSS and components | Migrate Buttons, Fields, Tabs, Dialogs, Tables and legacy styles to shared primitives | planned | Not implemented in Batch 07; broad runtime QA required |

See [Batch 07](batches/BATCH-07-REVISED-UI.md) for exact data semantics and unresolved QA. All cross-app integrations remain separate and unconnected.

The YTD calculation smoke test is under `scripts/check-dashboard-ytd.cjs` (source-level test, not interactive payroll certification).

## Batch 08 — Universal UI component adoption (source edits; runtime not verified)

| Revision | Real files | Scope | State | Test/remaining work |
|---|---|---|---|---|
| UI8-01 | `components/ui/HrmsPrimitives.tsx`, `app/hrms-components.css`, `app/layout.tsx` | Shared visual/control primitives | implemented | Parse/import checks; use in further legacy screens |
| UI8-02 | `components/GroupedWorkspace.tsx`, `components/ReportsLanding.tsx`, `components/HRFormsRequestsWorkspace.tsx`, `components/RecruitmentWorkspace.tsx` | Consolidated working tabs | implemented | Source checks only; browser interactions outstanding |
| UI8-03 | `components/HelpButton.tsx` | Shared help dialog | implemented | Focus/Escape browser test outstanding |
| UI8-04 | `components/ui/useManagedDialog.ts`, `components/PayrollOperationsHub.tsx`, `components/LeaveManagementWorkspace.tsx`, `components/AssetWorkspace.tsx` | Topmost modal/keyboard behavior | implemented | Browser modal navigation/approvals outstanding |
| UI8-05 | `app/hrms-migration.css` | Scoped legacy card/input/table/modal polish | implemented | Responsive screenshots and full cross-module QA outstanding |
| UI8-06 | `scripts/check-ui-components.cjs` | Shared UI wiring smoke test | implemented | Script test passed; not a full UI test |
| UI8-07 | All legacy UI modules and styles | Complete React primitive migration, strict stylelint/token enforcement, CSS cleanup | **planned** | Do not claim complete until runtime and codebase-wide migration |

[Full Batch 08 mapping and limits](batches/BATCH-08-UNIVERSAL-UI.md).

## Batch 09 — Employee 201 Overview required documents + Dashboard actual records

| Revision | Actual source paths | Desired and implemented behavior | Status | Validation / outstanding |
|---|---|---|---|---|
| DOC9-01 | `components/EmployeeWorkspace.tsx`, `app/hrms-migration.css` | Restore Required Documents statuses/filename/HR review in Personal Information; working Documents tab action | implemented (source) | Source inspection + smoke assertion; browser attachment/navigation check pending |
| DASH9-01 | `lib/dashboardAnalytics.ts`, `lib/dashboardRecordViews.ts`, `components/DashboardOverview.tsx`, `components/DashboardExtras.tsx`, `components/ModuleAlerts.tsx`, `components/DashboardRecordsDialog.tsx`, module CSS | In-dashboard actual-data popups for displayed data cards, parity with filtered KPIs, expandable records | implemented (source) | Count/branch/date/role unit checks + parse/import; browser actions/responsive pending |
| DASH9-02 | Same | Full browser accessibility/regression across users/modules | blocked / not yet verified | Requires installed Next.js/React dependencies and interactive QA |

See [Batch 09 scope](batches/BATCH-09-EMPLOYEE-DOCUMENTS-DASHBOARD-DRILLDOWN.md).

## Batch 10 — PSA OWS / ISLE supporting datasets (manual government filing aid)

| Revision | Files | Status | Checks / constraints |
|---|---|---|---|
| PSA10-01 — Reports integration | `components/ReportsLanding.tsx`, `components/PsaDataSupportWorkspace.tsx`, `.module.css` | implemented (source) | Separate OWS/ISLE, single establishment/date filters, traceable tables; browser tab navigation pending |
| PSA10-02 — read-only datasets | `lib/psaDataSupport.ts` | implemented (source) | Employment, occupation, evidenced basic pay, dated releases, hires/separations; absent datasets flagged; historical records partial |
| PSA10-03 — file support | `components/PsaDataSupportWorkspace.tsx`, `lib/psaDataSupport.ts` | implemented (source) | CSV+print supporting rows with explicit warnings; export/browser interaction unverified |
| PSA10-04 — QA & documentation | `scripts/check-psa-data-support.cjs`, module README, changelog, this map and `docs/revisions/batches/BATCH-10-PSA-DATA-SUPPORT.md` | source checks completed | Full Next.js build and interactive desktop/mobile tests outstanding |

[Batch 10 detailed scope](batches/BATCH-10-PSA-DATA-SUPPORT.md).

## Batch 11 — PSA Entity + Dataset Popup + Demo Profile Review (2026-10-22)

| ID | Scope | State | Paths |
|---|---|---|---|
| PSA-11-01 | UC LP + MD + QC combined; MM fully separate, correct historical grouping | Implemented; browser QA pending | `lib/psaReportingEntity.ts`, `lib/psaDataSupport.ts`, `components/PsaDataSupportWorkspace.tsx` |
| PSA-11-02 | PSA dataset click opens modal, no inline dataset detail | Implemented; browser QA pending | `components/PsaDataSupportWorkspace.tsx`, `.module.css` |
| EMP-11-01 | Fictional DOB, age and personal/emergency/demographic sample fields across 35 original demo employees | Implemented; browser QA pending | `lib/demoEmployeeProfiles.ts`, `lib/hrState.tsx`, `lib/employeeDemographics.ts`, `components/EmployeeWorkspace.tsx` |
| UI-11-01 | Dashboard record-row details now open a modal; remaining legacy no-inline surfaces | Dashboard implemented; **system-wide audit pending** | `components/DashboardRecordsDialog.tsx` and `.module.css`; other legacy modules untouched |

See [Batch 11](batches/BATCH-11-PSA-ENTITY-DEMO-PROFILES.md). The HRMS is frontend/browser-local; no official PSA submission or certified data output.
