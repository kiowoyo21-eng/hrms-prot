# HRMS Docs V5 — Review Comments (2026-10-20)

## Modified source files (5)
- `lib/studio/types.ts`: Added document-specific review comment and reply types. Kept comments optional for backward compatibility with older browser data.
- `lib/studio/store.ts`: Added create/reply/resolve/reopen operations with in-transaction edit approval, record validation, limits, and audit events. Existing persisted documents migrate without losing records when they lack a comments array.
- `app/studio/docs/[id]/page.tsx`: Added Comments side panel, selected-text quote snapshot, review threads, replies, and resolution controls. Review-only users can read comments, but mutations require an active editing grant.
- `app/studio/page.tsx`: Added open review-comment counts to Docs cards in Document Library.
- `app/studio/studio.css`: Styled review comments, replies, and edit controls inside the full-page editor.

## Unchanged
- Official Employee 201 and payroll data
- Original Docs/PDF content and versioning logic
- Existing approval queue and document generation
- Drive view-only configuration

## Boundaries
- Comments are anchored to a **snapshot of selected text**; they do not track moving document offsets or add Word-style inline markup.
- Audit activity **does not include comment bodies**; comment text is stored only in the existing local browser demo store.
- A genuine cross-user comments/audit system requires backend authentication, access controls, and durable storage.
