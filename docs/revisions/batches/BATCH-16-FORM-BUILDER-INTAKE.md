# Batch 16 — Configurable intake forms (2026-10-23)

**Baseline:** Full source through Patch 14 + Patch 15 overlaid.

## Implemented source scope

- `Tools → Form Builder` tab and modal editor to create, edit, draft, publish and clone templates.
- Core job application and public incident report title, description and supplementary questions configured by Form Builder, retaining existing hardcoded validated base fields.
- Existing HR documentation request types can have additional dynamically validated fields with saved answer-label snapshots and no change to their existing approval semantics.
- Custom employee/public preview forms get dedicated `/intake/[id]` demo URL, local response list with status toggle, and CSV export in Form Builder.
- UI support for short/paragraph/email/date/number/select/radio/multi-checkbox, required/optional, help, option lists, ordering; modal/no-inline editor.
- All form templates, responses, statuses, and links remain browser-local; no images, logos, government auto-filing or separate real backend added.

## Not implemented / required before real intake

- Cross-device persistent submissions, real publish links, secure storage, accounts/identity, real external applicant delivery, real incident case intake, file attachments, anti-spam/rate limiting, actual approval workflow routing for custom forms, backend authorization and legally/privacy approved data retention.
- Full Next.js build and browser viewport/accessibility QA pending.
