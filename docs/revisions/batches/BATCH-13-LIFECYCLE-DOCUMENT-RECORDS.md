# Batch 13 — Onboarding & Offboarding document support

**Status:** Source implementation — partial fulfillment of the 45 legal/document-workflow revisions. Full legal/production completion not claimed.

## Implemented

- Dedicated `/studio/lifecycle` document checklist, accessible from Studio and Employee 201 Documents, with employee preselection, UC/MM classification, separate Onboarding and Offboarding sections.
- 30 structured document/administrative categories with required-information inventories, conditional/statutory/company labels and reference links for authorized HR review. The inventory is not a determination that every item is mandatory.
- Per-employee manual status and evidence reference tracking (Not started, Pending, Received, Verified, Not applicable) with actor/date status history and audit events; no invented submissions or signatures.
- Modal-based record details and updates (never inline expansions), keyboard Escape, fixed footer, mobile full-screen behavior; responsive table action column.
- Super Admin creation of new **draft** Docs templates in Document Studio from catalog entries, including `{{company.legal_name}}` (must be provided by HR) and employee placeholders. Templates stay Draft until approved and reviewed.

## Not implemented / blocked

- No official completed legal forms, employer-verified employment agreements, legal counsel sign-off, service/delivery evidence verification, secure document repository, deadline notifications, statutory submissions, payment release integration, or end-to-end due-process workflows.
- Frontend-only localStorage/IndexedDB is **not secure production evidence storage**. Legal applicability, notices and exact deadlines must be confirmed against authoritative current sources for each case before production use.
- Employee 201 only links to this tracker; it does not automatically alter employee employment status or finalize separation.

## Files

`lib/studio/lifecycleCatalog.ts`; `lib/studio/lifecycleRecords.ts`; `app/studio/lifecycle/page.tsx`; `app/studio/studio.css`; `app/studio/page.tsx`; `lib/studio/types.ts`; `components/EmployeeDocumentLibrary.tsx`; `app/globals.css`.

## Verification

Focused catalog/TSX checks and relative import checks passed. Full Next.js build/browser QA not performed because dependencies are unavailable in the working environment.
