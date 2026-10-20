# HRMS Deploy Hotfix — Missing mergePreview Module

## Changed source files
- `lib/studio/mergePreview.ts` — restored the V3 Document Automation merge-preview/preflight helper that `app/studio/page.tsx` already imports.

## Behavior
- Maintains existing document merging and missing-field preflight logic.
- No changes to the UI, login, payroll, or data storage.
- No new dependencies.

## Validation
- Confirmed file matches the original V3 delivered patch (identical SHA-256).
- Confirmed `app/studio/page.tsx` imports `../../lib/studio/mergePreview`, which resolves to this added file.
- Confirmed related local imports (`lib/hrState.tsx`, `lib/payrollConfig.ts`, `lib/studio/variables.ts`) exist in the reconstructed project.
- Source-only TypeScript syntax validation passed. Production `next build` and Vercel deployment are not verified.
