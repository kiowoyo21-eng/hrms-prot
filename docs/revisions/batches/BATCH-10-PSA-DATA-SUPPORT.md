# Batch 10 — PSA Data Support (OWS / ISLE)

**Status:** implemented at source level; full build and interactive browser testing outstanding.

## Purpose and scope

Support manual completion of the official **2026 PSA Occupational Wages Survey (OWS)** and **2026 Integrated Survey on Labor and Employment (ISLE)** by supplying inspectable **record-based data**, not completed answers or a PSA filing workflow.

The official user-supplied 2026 questionnaire PDFs guide the dataset labels. The UI does **not** reproduce, populate, approve, or submit official questionnaires.

### New files
- `components/PsaDataSupportWorkspace.tsx` and `.module.css` — OWS/ISLE selector, single reporting establishment, reference/end and supporting-start dates, dataset catalog, status/coverage notes, record tables, search, 10-row paging, printable and CSV output.
- `lib/psaDataSupport.ts` — read-only data selectors and defensive CSV serialization.
- `scripts/check-psa-data-support.cjs` — dependency-free focused data selector checks.

### Changed existing files
- `components/ReportsLanding.tsx` — additional `PSA Data Support` tab inside Reports & Analytics; existing tabs unmodified.
- `docs/modules/reports-analytics/README.md`, `docs/changelogs/reports-analytics/CHANGELOG.md`, `docs/revisions/MASTER-REVISION-MAP.md` — actual module scope and revision status.

## Dataset coverage

**OWS:** Employee roster, occupation/sex, pay basis/arrangement, basic pay **reference** with historical rate evidence, workers by evidenced rate, browser-reviewed 13th-month/bonus releases; allowances and verified occupation/PSOC codes explicitly *not tracked*.

**ISLE:** Employment roster, age/sex, classification, recorded hires, applied separations, browser-reviewed payroll/payment references. No automated claims for vacancy/applicant sources, training costs, OSH programs, occupational disease/injuries and days lost, union/CBA, AI adoption, productivity/gainsharing or sensitive special worker categories—marked *not tracked*.

All existing HR data remains in the same browser-local stores, unchanged. Dataset rows carry source record IDs where available. Filters are establishment-specific: no `All Shops` consolidated PSA filing unit. Missing records are not silently converted to official zero. Historical as-of dates use only dated assignment evidence and may omit archived employees; **historical summaries remain partial unless manually verified**. Current pay values are not backdated without an applied rate-change event. Payroll releases exclude sample, pending and duplicate release IDs.

## Accessibility and security

- Only existing authorized HR/Final Approver/Super Admin Reports users may reach the feature; BM is denied by the Reports host and component itself. This is frontend-only gating, **not secure backend authorization**.
- Export CSV has formula-injection escaping and prominent unverified-data/filing warnings. Printable view escapes HTML and repeats the caveats.
- Actual government ID numbers and bank account identifiers are never exported by this feature.

## Verification & known limits

- `node scripts/check-psa-data-support.cjs`: passed locally (establishment isolation, historical rate absence, employee grouping, payroll duplicate/sample exclusion, missing-data statuses, CSV escaping and invalid dates).
- TypeScript AST, imports, CSS and Markdown links checked separately in the implementation report.
- Full Next.js build, live browser UI interactions, selected-role navigations, mobile/tablet and actual file export behavior: **not verified** in this environment without installed project dependencies.
- Initial frontend records can be fictional. PSA source records, actual completeness of government survey coverage and external filing acceptance are **not certified** by this patch.
