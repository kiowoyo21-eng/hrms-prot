# Batch 11 — PSA entities, modal-only drill-down and complete fictional profiles

**Status:** source-level implementation; browser/build verification not completed.
**Apply over:** Batch 10 PSA Data Support patch.

## Approved correction

- **Reporting entities:** Underchargers combines UC Las Piñas, UC Mandaluyong and UC Quezon City. Mastermind Mandaluyong remains separate. One PSA entity selector per report. Individual UC branches appear as traceable breakdown data, not filing entities.
- **Datasets:** The OWS and ISLE read-only selectors group by reporting entity and use dated assignment evidence for historical snapshots, hires, exits and payroll transaction attribution. Deduplicate reviewed release IDs; exclude Sample payroll releases and records without dated attribution.
- **Interaction:** Clicking a PSA dataset opens an accessible `HrmsDialog` with source notes, search, 10-row pagination and export/print actions. No inline expansion inside the Reports & Analytics catalog. Dashboard record-row details also open a second modal rather than expanding below the row. Keep filters and survey tabs as page-level controls.
- **Fictional demo profiles:** All 35 original employee fixtures now have test-only birth dates, calculable ages, civil status, email (reserved `.invalid`), demonstrably fictitious addresses and phones, fictional emergency contacts, job level/arrangement, hours and nominal workday configuration. Dates and demographics are for **testing only** and must not be copied into a real PSA filing without HR replacement/verification.
- **Existing browser data:** A once-only, **blank-fields-only** seed enrichment matches original demo employee ID, name and hire date. User-provided nonempty values and unrelated employees are preserved. No fabricated government ID numbers, purported official uploaded files, official filing answers or financial transactions were introduced.
- **Employee 201:** Age is calculated from DOB using Manila's calendar date; birthdate and age appear in Personal Information details. ISLE/OWS rosters expose birthdate + age **at selected reference date** for inspection.

## Limitations

- The existing HRMS is browser-local with historical record gaps. Employee counts, current employment statuses, rates and survey-specific classifications are not certified official data.
- Existing PSOC codes, dated allowance ledgers, OSHA-style injury measures, formal training, etc. are still untracked and remain visibly marked so.
- PSA dataset details and Dashboard supporting record rows were migrated to a modal pattern in this patch. A universal **no-inline interactive-panel** audit of all other legacy modules is still outstanding. This patch does not claim a production-ready build.
- Fields are added to a fictional test fixture, not a production database or a live shared HR system.

## Focused verification

Run `node scripts/check-psa-data-support.cjs` in the updated project to test entity grouping, historic transfers and wage attribution, double count, age calculations and 35-person demo enrichment. `node scripts/check-dashboard-ytd.cjs` and `node scripts/check-dashboard-drilldowns.cjs` cover existing shared KPI behavior.
