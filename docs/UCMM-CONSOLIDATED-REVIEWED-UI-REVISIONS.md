# UCMM HR — Consolidated Reviewed UI/UX Revisions (October 12, 2026)

## Patch installation
- Extract the ZIP. It contains repository-relative paths: `app/`, `components/`, `docs/`.
- Upload the folder contents to the root of the existing GitHub project and commit. Do NOT create a nested `UCMM...` folder in the repo.
- Existing file names are retained. **Never delete unrelated files.**
- `components/CalendarDatePicker.tsx` is included as a required dependency safeguard after the prior missing-module failure; it is unchanged compared with the latest integrated source.
- Compatible baseline: `UCMM_HR_FULL_SYSTEM_Latest_Integrated_2026-10-12.zip` plus Loans Inside Payroll, Incident Reports HR/BM History, and Government Reports Analytics patches. The patch is based on that combined code state.

## Included approved revisions

### Government Compliance
- Main page: clean, square clickable agency icon tiles and **pending requirement badges only**.
- Existing agency workspaces still show completion progress, requirements, milestones, branch applicability and evidence sections.
- Add Government Requirement due date uses the shared click-only date picker.
- Pending badge counts refer to unverified requirements (not individual branch completions).

### Leave Management
- Three consistent, equal-height click-through cards: Pending Leave Requests, Incentive Leave Approval, and Leave History.
- Fix card text/icon/count spacing and preserve existing lists, approvals, history, notifications, and SIL/VIL sample-credit interactions.

### Payroll Management → Holiday Calendar
- Add/Edit Holiday form on the **left**, monthly calendar on the **right**, selected-month holiday list below both.
- Compact Holiday Details, optional expandable Department/Employee pay-rate override controls, supporting memo field inside overrides.
- Calendar date selection and date-picker; existing calculations and approval guardrails preserved.
- Reset unrelated old override fields when choosing a new calendar date.
- NCR-only wage-region presentation retained.

### Incident Reports
- Open Case: Case Processing progress and current-step form are now at the **top**, above Case Details and HR Oversight.
- Routing, restricted case access, HR final authority, document folders, IR History and Employee 201 links preserved.
- New/Active tabs and existing list columns remain unchanged.

### Documents & Templates
- New **Document Templates** tab in Documents & Templates.
- Create a draft template with name, category, A4/Letter page size and text; Upload PDF/JPG/PNG/DOCX for session-only use.
- Click template → inline preview in right ~35% panel; expand fullscreen with Close button, Esc and backdrop exit.
- Print / Save as PDF for draft text, original export for uploaded files. Browser's built-in PDF viewer controls and manual page navigation support.
- No genuine Word rendering for DOCX, no server-based storage, no official-legal approval implied.
- Existing Document Library, Verification, and Individual Signing tabs preserved.

## Frontend limitations
- Uploaded PDF, image and DOCX template files exist only for the current browser session (blob URLs) and disappear after reload.
- Government records and holiday classification are illustrative pending verification; rates do not constitute live government compliance approval.
- All role and permission checks must be enforced in Supabase/backend before production.
- Build: Offline TypeScript and static import checks passed; full Next.js/Vercel production build must still be verified through deployment.

## Quick smoke checks
1. Government Compliance → square DOLE tile → see requirement progress → Back to Agencies.
2. Leave Management → three equal cards → open Pending Leave and back.
3. Payroll → Holiday Calendar → click date → left Add Holiday updates → expand optional override → save/test monthly list.
4. Incident Reports → Existing Reports → Open Case → Case Processing immediately visible; HR has oversight, docs and history below.
5. Documents & Templates → Document Templates → Add Template or Upload PDF → select → Preview → Expand → Close → Export.
6. Check unrelated pages: Recruitment, Employee 201, Reports & Analytics, Payslip History, Loans & Cash Advances.
