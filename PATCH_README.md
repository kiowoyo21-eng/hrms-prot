# HRMS Vercel TypeScript Fix — DOCX list bullets

This patch addresses the Vercel build failure at `lib/studio/exportDocx.ts`:

```
Type error: Property 'level' is missing in type '{ indent: number; }'
```

The `docx` library expects `bullet: { level: number }`, not `bullet: { indent: number }`.
The exporter now sets `bullet: { level: 0 }` for list-item paragraphs.

## Installation
1. Extract this ZIP at the root of your current HRMS project.
2. Overwrite `lib/studio/exportDocx.ts`.
3. Run `npm run build`, then commit and push after confirming the build passes.

No new dependencies. The patch does not alter HRMS employee, payroll, file-storage or admin permission logic.

## Verification scope
This corrects the exact TypeScript type mismatch reported by Vercel. The source passed a TypeScript syntax/transpilation check and a targeted option check. A full Next.js build was not available in this environment, so further errors may still surface during Vercel's type check.
