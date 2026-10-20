# HRMS Docs V6 + Universal UI QA — Incremental Changelog
Date: 2026-10-20
Base: Docs V5 Review Comments; apply over its latest source (and previously installed Sheets/Employee 201 patches).

## Features
- Added Super Admin-only Document Library Custom Form Builder: up to 30 fields, labels, stable manual token keys, required flags, Employee 201 mappings, text/number/date/allowed-value dropdown validation and defaults.
- Configured fields are rendered in auto-fill; mapped data comes from Employee 201 and other supported HRMS document values, manual fields are entered during generation. Preflight blocks unresolved required/invalid values for any employee; optional blanks render blank rather than unresolved tokens.
- New placeholders append only when absent; removing managed fields clears their old placeholders. Review source document layout after schema changes.
- The inline builder scrolls into view when opened, avoiding an off-screen panel that appears to do nothing.
- Form schema edits create a Studio revision, audit event, increment version, and reset previously approved source templates to Draft. Super Admin must reapprove for HR generation.
- HR cannot approve a source template through a temporary document edit grant, and HR edits to approved source content return status to Draft. HR cannot restore a source template version.
- Removed duplicate legacy Document Templates path from the Document Operations Hub. That entry now directs users to the central Document Library (/studio) rather than an unrelated session-only template list.
- Changed the hub Studio link from popup-window scripting to a normal new-tab link to avoid blocked/misplaced popup windows.
- Moved the Document Library auto-fill dialog to a viewport-level React portal, with backdrop click, Escape, body scroll lock, responsive height, and isolated stacking context to prevent it rendering below/clipped by content.
- Increased Docs menu stacking/clipping safeguards, added responsive form builder and dialog styles.
- Added `docs/UNIVERSAL_UI_QA_CHECKLIST.md`: persistent cross-module regression list for modal placement, dead controls, unexpected data, duplicated rows and responsive layouts.

## Source changes
- app/studio/page.tsx
- app/studio/studio.css
- components/DocumentOperationsHub.tsx
- components/studio/FormBuilder.tsx (new)
- lib/studio/formBuilder.ts (new)
- lib/studio/store.ts
- lib/studio/types.ts

## Scope and safety
- Browser-only demo: localStorage is not a secure multiuser backend. No payroll, Employee 201 source data, releases, or accounting records are modified by form generation.
- UI remediation here is Document Studio/Document Operations-specific; the cross-module UI audit is ongoing, not claimed fully fixed.
