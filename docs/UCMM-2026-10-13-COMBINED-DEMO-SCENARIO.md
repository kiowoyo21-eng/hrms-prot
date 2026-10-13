# UCMM HR — Coordinated fictional QA scenario (13 Oct 2026)

This combined patch contains **all files** from the not-yet-uploaded **Leave & Official Holidays** and **Hiring & Sep–Oct Attendance** patches plus the coordinated employee/device seed, updated leave references and small state-migration UI. Apply the ZIP to the existing GitHub repository root after the Asset View / Filters / Dashboard update. Do not first upload the two separate newer patches.

## Sample counts / linking

- **35 fictional employees**: 10 Operations (including mechanics/service advisors) at **₱20,000/month**; 5 Office, 5 Administration, 10 Marketing at **₱755/day demo NCR wage reference**; 5 Branch Supervisors at **₱30,000/month illustrative *placeholder*** because no actual rate was supplied. These rates are not HR-approved and must be verified against applicable branch/wage laws. For daily staff, the 26-day reference is **₱19,630 per month**, not a promise of automatic days paid. All hires start no later than 2026-08-24 to cover both sample months.
- **50 fictional devices**: 20 laptops, 15 phones, 8 desktop/Mac mini, 4 tablets, 3 printers. Status counts: Assigned 30; Free 10; Inspection 4; Maintenance 3; Pending Turnover 3. Assigned/pending devices reference actual demo employee IDs. Pre-marked 'signed' states are fictional and not verified signatures.
- **20 mock hiring applicants** from the previous patch, with mixed stages and interviews.
- **15 mock leave requests** linked to the new employee names/branches; selected approved leave dates are represented in the initial attendance preview for matching employee IDs.
- **2,135 September and October 2026 daily attendance rows** = 35 employees × (30 September + 31 October). 2026-10-14 through 2026-10-31 are marked as simulated future dates (with rest days separately marked). There are no actual biometrics, approved timesheets, or live payroll uploads.
- **43 published official holiday entries** (2026/2027 national + 2026 NCR-specific) are carried forward from the prior verified-calendar patch, with their citations/sources in `lib/officialHolidays.ts`.

## How data is applied

Fresh browsers load 35/50 directly. Unchanged legacy browser samples with exactly 12 employees / 4 assets are migrated automatically. Browsers with locally modified data are deliberately NOT overwritten. In those browsers use **Settings → Load 35 Employees + 50 Devices Demo Scenario** (confirmation required), which resets browser-local demo records. It does not delete any Supabase data. Generated daily attendance is deterministic and built from the current employee roster; it is not persisted or editable timesheet data.

Existing browser-specific custom leave records are preserved until users explicitly reset the demo scenario. Loading missing demo applicants may be necessary if the browser already contains the previous 4 applicants; visit Recruitment & Hiring and use its existing additive seed action.

## Validation and limitations

Demo personal details are fictional. Company document signing, government deductions, wage compliance, payroll release and cross-device HR transactions remain frontend-only examples. Inspect the preview and run an actual Vercel build/browser test before using in demos. Never put real employee data in this localStorage prototype.
