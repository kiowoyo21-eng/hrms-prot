# Employee 201 — working UI and data (Batch 03)

Current source: `components/EmployeeWorkspace.tsx`, `components/workspace/EmployeeFullRecord.tsx`, `lib/hrState.tsx`, `app/globals.css`.

## Employee Full View

One **Employee Information** parent houses exactly four independently clickable compact cards in desktop 2×2 reading order:
Personal Information, Emergency Contact, Employment & Assignment, Government & Statutory. On narrow screens they stack. Compensations & Premium Rates and separate Performance/History/Assets sections remain outside this information group, preserving prior actions and records.

Card headers and bodies open corresponding existing portal-based detail dialogs; Escape, close button and backdrop can dismiss them. Editing mode retains current field editing in the four cards and uses the existing Save Profile Changes action. Current complete field values are shown in dialogs; summaries are intentionally abbreviated to reduce whitespace.

### Histories

- Employment & Assignment reuses persisted `person.assignmentHistory` records, with effective dates and memo links. Current assignment remains separately visible when no historical records exist. Earlier browser records with no history show an explicit empty state, rather than invented transitions.
- Personal, Emergency, and Government detail dialogs surface **actual matching employee update events** from the existing browser-local audit trail, including actor, time and changed **field names only**. When none exist, a truthful "No field-change history recorded" message appears. No before/after values are fabricated and older edits may be absent.
- Existing overview/history, documents, assessments, payroll and employee lifecycle actions remain unchanged.

### Confidentiality

SSS, PhilHealth, Pag-IBIG and TIN are masked in **read-only summary/detail views**. Authorized HR profile editing retains existing browser-stored values so it can save without data loss; this browser-only demo is not production-secure. Real identifiers require server authorization and encryption before launch. Do not enter real government identifiers into the demo.

Browser/history regression testing remains necessary before calling this fully verified.

## 2026-10-22 display/interaction corrections

Overview is now the primary read-only Employee 201 entry, with separate interactive Emergency and Government detail cards; redundant Full/Complete view links were removed from read-only navigation. The existing FullRecord remains exclusively accessible for editing; all field values, dialogs, and histories remain. Employee directory table rows and compact cards open Overview directly.

See `../../revisions/batches/BATCH-05.md` for scope, remaining QA and operational caveats.

## Batch 09 — Restored required documents in Overview (source-level)

The Personal Information **Overview detail dialog** now displays its existing `person.documents` required-document checklist, counts of `Missing` / `Submitted` / `Verified`, available checklist filenames, and matching `data.submissions` filename + HR review state (`Pending HR Review`, `Approved`, `Rejected`). Submission and verification are shown as **distinct** facts; an uploaded file does not automatically certify verification. An additional recorded submission is shown separately when it does not match a checklist label. The summary card shows checklist counts. **View / Manage Documents** opens the original Employee 201 `Documents` tab / `Onboarding Files` folder. No document storage or review workflow was changed.

Sources: `components/EmployeeWorkspace.tsx`, `lib/hrState.tsx`, `components/EmployeeDocumentLibrary.tsx`, `app/hrms-migration.css`. Full browser click/attachment persistence test pending.

### Batch 11 fictional profile enrichment

The 35 original demonstration employees have fictional DOB, age, contact/emergency and demographic test fields; profile age is derived from DOB using the Philippine date. An existing browser seed is enriched once on empty fields without overwriting nonempty edits, unrelated identities or government ID values. These are neither verified identities nor production records. See [Batch 11](../../revisions/batches/BATCH-11-PSA-ENTITY-DEMO-PROFILES.md).
