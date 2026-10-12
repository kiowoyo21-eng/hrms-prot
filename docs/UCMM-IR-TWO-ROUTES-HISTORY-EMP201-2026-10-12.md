# UCMM HR — Incident Reports Route / Case History / Employee 201 Patch

## Replaced UI

- Incident Reports home: two clickable cards — **Existing Reports** and **IR History**.
- Existing Reports: **HR Routed** and **BM Routed** tabs in the *same screen*, with **All / New / Active** filters and one readable table: Case & Branch, Concern, Stage, Involved Employee, Open Case.
- Closed cases appear in IR History, not the active report lists. A case opens in a dismissible detail dialog (Open Case, click outside, Esc, or Back). Guided case stages only appear after opening a case.
- Open Case includes original unchanged incident narrative, a stage-by-stage review process, case notes, timestamped activity, and categorized document area: Initial Report, Written Explanation & Notices, Evidence, Mediation Records, Final Decision, Closure Summary.

## Routing and authority

- HR / Super Admin can see HR/BM routed cases within the selected branch scope, add notes and evidence, take over BM cases with a reason, issue final decisions, and close cases.
- BM can see **only** BM-routed cases from their assigned branch and can record initial investigations. BM cannot see HR-routed cases, link Employee 201 IDs, approve final decisions or close cases.
- Reports against a BM are HR-routed and hidden from BM. These are frontend role checks only; real cases require server-enforced RLS, private storage and full audit trails.

## Closed IR to Employee 201 linking

- On closing, HR must provide a decision, closure summary and both verified Employee 201 IDs. Case closure creates **no duplicate employee records**; Employee 201 reads the same closed-case record.
- In Employee 201 → Employee Profile, the **Incident Involvement** summary appears separately from any disciplinary findings, identifying Reporter vs Reported Employee.
- In Employee 201 → Documents, the new **Incident Case Records** folder contains available virtual case documents and metadata (including evidence filenames). This is not an actual stored signed PDF or uploaded evidence copy.
- Closed-case linking is deliberately **ID-based**, not name-based. When a name does not match an employee ID, HR must explicitly confirm the link. Original reported names/narratives remain untouched.
- Real-world incidents involving a person outside Employee 201 need a separate verified exception workflow; this browser-review version requires two employee IDs before closure.

## Test fixture

- Fresh browser review state includes fictional closed case `IR-2026-000` tied to sample employees **UC-0001** and **UC-0004**, outcome `No violation found`.
- If older localStorage records override fresh sample data, an authorized HR user can open **IR History** and use **Load Sample Closed Case** when the closed-case list is empty. This does not erase existing local review records.

## Limitations

- This patch is browser-local frontend review, not secure incident processing. Never enter sensitive employee complaints or confidential evidence in this localStorage-based demo.
- PDF/image attachments are session-only. File metadata can remain in the local case, but actual file bytes will be unavailable after the session. Employee 201 clearly labels those as metadata-only.
- The sample stage flow requires notes at each transition. A full production flow will need stage applicability and skip reasons, actual NTE/NOV delivery, signed explanations, acknowledgments, mediation, HR approvals, time stamps, and real protected file storage.
- The public `/report` page is still frontend-only and not connected to these case records.

## Patch file paths

```
app/globals.css
components/IncidentWorkspace.tsx
components/EmployeeWorkspace.tsx
components/EmployeeDocumentLibrary.tsx
lib/incidentRecords.ts
docs/UCMM-IR-TWO-ROUTES-HISTORY-EMP201-2026-10-12.md
```

Retains original GitHub root structure. Apply on the current complete UCMM HR project (including the latest Loans-in-Payroll patch). Do not replace unrelated files. Full Vercel production build and private storage have not been verified in this environment.
