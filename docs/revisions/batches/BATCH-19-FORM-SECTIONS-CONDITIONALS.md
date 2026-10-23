# Batch 19 — Form Builder Sections & Conditional Questions

**Date:** October 23, 2026  
**Base:** HRMS with Patch 18 applied  
**Delivery:** changed-files-only patch (not a database/backend integration)

## Implemented

- HR Form Builder questions can be assigned an optional section/group title. Consecutive questions with the same title appear in one section. For custom forms, section navigation becomes step-by-step with a progress indicator, Previous/Next buttons, and per-step validation; the final step retains the same browser-only test/preview action.
- Each question may have a conditional display rule referring only to a preceding dropdown or single-choice question and to one of that question's actual options. The builder validates broken or cyclic/out-of-order conditions before saving/publishing.
- Required-field validation excludes hidden questions. Browser-only custom test responses, HR request form draft records, and demo job applications omit values of hidden extension questions when storing their respective records.
- Existing published local forms are read without destructive migrations; built-in application, incident, and HR request fields remain intact.
- Portable form preview/QR snapshots now support version 2 with sections and conditions. Earlier version-1 links still decode. Links still contain **only the questionnaire** and are **not remotely submittable**.
- The editor is contained in the existing modal. No inline row expansion was added.

## Not implemented

- Live cross-device form submissions, centrally managed responses, stable/revocable server links, authentication, privacy/security backend, spam protections and automatic routing.
- New legal approval flows, file uploads as questionnaire responses, logos/images, or permanent document storage.
- Dedicated multistep navigation for the full built-in Job Application/Incident/Request base forms; their *supplemental questions* support grouped headers and conditional visibility.

## Verification

`node scripts/check-tools-patch19.cjs` tests conditional display and validation, hidden-answer filtering, section grouping, modern/legacy preview schema. Existing form, share/QR, Drive, document, PSA and Dashboard tests also passed at the source level. Full `next build`, TypeScript typecheck with a complete project dependency tree and actual responsive/keyboard browser QA remain unverified.
