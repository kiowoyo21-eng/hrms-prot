# Underchargers HR Management PWA — Phase 11

Complete frontend-only project including Phases 1–10 and the Phase 11 **HR Workflow Center**.

Phase 11 brings previously underrepresented requirements into an interactive, reviewable, multi-tab demo. Included categories: employee lifecycle, payroll controls, documents/signing, evaluations/requests, and administration. Search, status filter, mock add, demo status update, print and CSV export work in browser memory.

## Deploy

Upload the **contents** of this ZIP at the root of your existing GitHub repository (where `package.json` lives) and commit. If already connected, Vercel starts a new deployment.

## Important limitations

- This is a **frontend prototype**, not a complete production HR system or a verified final layout.
- No Supabase, database, secure authentication, live payments/payroll, real approvals, private file storage, or legally sufficient signatures. Do not use sensitive actual employee data.
- The new HR Workflow Center is a consolidated review surface and does not replace in-depth screens/form implementations for each workflow.
- Development-only credentials exist in `lib/mock.ts`; remove before real deployment with authentication.
- No complete `next build` is claimed unless dependencies become available. Check Vercel build logs.

See `docs/PHASE-11-CHECKLIST.md` for coverage and gaps.
