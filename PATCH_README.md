# Installation — HRMS Main V10 (GitHub website only)

**Prerequisite:** Your GitHub `main` branch should already contain V9, the combined PDF build fix, and Ms Kate's corrected HR inheritance.

1. Extract this ZIP. Source files have relative paths starting at `app/`, `components/`, or `lib/` (no extra root folder).
2. On GitHub, upload/replace **only** the five files listed below in their exact folders:
   - `app/page.tsx` — **replace**
   - `components/ModuleAlerts.tsx` — **replace**
   - `components/AuditLogWorkspace.tsx` — **add**
   - `components/AuditLogWorkspace.module.css` — **add**
   - `lib/auditViews.ts` — **add**
3. Commit them together to the `main` branch; check the resulting Vercel build before proceeding.
4. Browser QA: sign in as HR, open Audit Logs, create a test action in a module, return to Audit Logs, search/filter and export; confirm the CSV contains the browser event, **not** the Dashboard sample activity. Repeat as Ms Kate. BM should have no Audit Logs menu; final approval remains Ms Kate-only.
5. Open the universal bell, switch branch, confirm the popup closes. Reopen and press Escape: keyboard focus should return to the bell.
6. Verify no old locally saved data is erased and that payroll, Docs, Sheets, and final-pay pages still open.

**Important:** The source is reconstructed from the latest *locally available* V9 HRMS project, **not** fetched from your current live GitHub commit. If you've changed `app/page.tsx` or `components/ModuleAlerts.tsx` since V9, compare/merge before overwriting.

**Known limitations:** Full Next.js production build/browser click-through could not be run in this environment because npm's offline cache lacked required project dependencies. Live Vercel deployment verification is still required. This patch doesn't add server-side tamper-proof auditing, branch-scoped audit metadata for older events, or production authorization.
