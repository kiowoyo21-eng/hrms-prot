# Underchargers HR PWA — Phase 4 (Frontend Prototype)

Complete replacement repository for GitHub → Vercel. Includes all Phase 1–3 files and the Phase 4 Documents & Templates workspace.

## Run
- Install dependencies: `npm install`
- Development: `npm run dev`
- Build: `npm run build`
- Type check: `npm run lint`

Use Next.js preset in Vercel and repository root containing `package.json`. No Supabase credentials are needed.

## New in Phase 4
- Dynamic document library filters, selection and CSV index export
- One-at-a-time local file upload (PNG/JPG/PDF) with temporary preview and download/print
- Template management interface (no actual autofill engine yet)
- Practice signature drawing on-device
- Sample QR and copyable signing URL (`example.invalid` intentionally cannot perform signing)
- Proposed incremental schema in `docs/PHASE-4-DATABASE-BLUEPRINT.md`

## Do not use with live employee data
Accounts are frontend-only demo logins; uploaded files only exist in browser memory and disappear on refresh. Signatures here are practice images, not completed legal e-signing workflows. No approved document persists, and sample QR URLs are intentionally nonfunctional. Backend, authentication, approval workflow, secure storage, and logs come later.

## GitHub update
Extract ZIP and upload **contents** to repo root, preserving folder names; commit to trigger Vercel redeploy. Never upload ZIP as a file instead of extracting it.
