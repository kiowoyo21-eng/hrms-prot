# HRMS Batch 26 — Consolidated operational corrections (26 October 2026)

Status: **Source implemented; source-level QA passed; full Next.js build and browser QA not verified.**

This patch is provided together with earlier Patch 22 (file-style Tools), Patch 23 (guided templates/imports), Patches 24–25 (bulk data imports), and the responsive navigation hotfix, against the uploaded `hrms-prot-main(4).zip` baseline (Patch 21 included).

## 1. Document Library, Templates, Verification
- Employee Document Library is an archive of **only actual attached file copies** in the browser session. Removed fictional, metadata-only seed files that used to look signed or pending. No actual file is invented or misrepresented as an uploaded original.
- File creation opens a proper modal, not an inline expansion. Newly uploaded files display `Stored` and are only browser-session URLs; secure persistent storage is not available.
- Document Templates presents the existing Document Studio **Templates** file view, including its permissions and PDF/DOCX create/upload workflows, instead of a redirect-only button.
- Pending, missing, returned and HR verification records stay in the separate Document Verification section.
- The 3 document workspaces use a compact file-tab toolbar instead of catalog-card navigation.

## 2. Company-wide Thursday payroll
- Calculate today's local date using the **Asia/Manila** time zone. Generate draft button enabled only Thursday.
- The cutoff is **automatically last completed Thursday through Wednesday**; no date range field in Generate Payslips.
- UC Mandaluyong + UC Las Piñas + UC Quezon City are grouped in one UC generation action; Mastermind is a separate company. Existing branch-scoped and individual draft records remain independently identified and historical releases are preserved.
- Branch-restricted sessions cannot generate the other UC branches' drafts; to prepare a consolidated UC run, switch to authorized All Shops view.
- Company generation **does not assume missing attendance means absence**. It checks a verified attendance file and day-by-day coverage for every employee, blocks duplicates and other unresolved salary, leave, tardiness, OT and holiday cases. Missing/incomplete attendance opens a proper upload modal. The modal provides XLSX/CSV templates and the detailed guide, and uses the exact system-selected cutoff.
- Result is **one unreleased browser-local draft per eligible employee**, prepared from documented basic-pay evidence only, using the existing per-branch batch records under a company-wide action. No real payroll payment, release, third-party submission, or automatic legal payroll finalization occurs. Other allowances, statutory deductions, loans, holidays, OT and absences require authorized independent review; the draft must not be mistaken for a finished payslip.

## 3. Final Pay and Clearance
- Distinct **clearance status**, **final-pay review status**, **external payment evidence**, and **closure status**. Display separation effective date, general 30-day target date, overdue reminder and next action.
- Outstanding assets are explicitly a documented **clearance follow-up**, not an automatic lawful pay deduction or an indefinite final-pay-review blocker. An employee may enter the offboarding workflow despite outstanding custody; assets must be resolved or documented during actual clearance. Unresolved asset custody prevents marking **Cleared** and closing the complete record, but does not block final-pay review/handoff.
- The existing draft amounts remain **manual and evidence-based**; no unverified 13th-month, salary, loan or statutory amounts are invented. Approval still enforces maker/checker and source references. Final-pay details now open in a proper portal modal.
- Accounting handoff, payment reference and closure remain **browser-only demo status records**, not actual Accounting integration or confirmation of a bank transaction. A separate external payment reference and an independent Cleared review are required before a case can be closed and the employee status changed to Separated.
- Deadline display follows the usual DOLE Labor Advisory 06-20 30-day final-pay guidance; individual circumstances, law and more favorable policy still need qualified HR review.

## 4. Navigation and UI foundations
- Included earlier mobile/tablet sidebar hotfix: the hamburger becomes available at the same 900px breakpoint at which the sidebar is hidden, and the overlay no longer covers an opened drawer.
- Replaced remaining hardcoded colors in `app/hrms-migration.css` with existing design tokens; the existing shared-component CSS standards check now passes.

## Important unchanged constraints
- Frontend-only Next.js PWA; no production auth, secure central storage, real shared Form Builder submission service or Accounting bank integration has been created.
- HRMS payroll setup is NOT a legally reliable payroll engine until verified employee/attendance/payroll data, policies, statutory schedules and secure controls are connected and audited.
- No live employee data was loaded, and existing browser data was not reset.
- Test on actual phones and tablets and run `npm run build` before deployment. No full build was possible in this working environment without dependencies.
