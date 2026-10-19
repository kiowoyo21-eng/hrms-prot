# Vercel Next.js 15 Spreadsheet PageProps Build Fix

Incremental patch for HRMS Workspace V3 (after V1 + V2 + V3 patches).

## What changed
- `app/spreadsheets/page.tsx`: simple Next.js route with no custom props.
- `app/spreadsheets/[id]/page.tsx`: dynamic route renders shared client component, not an app route module.
- `components/SpreadsheetPageClient.tsx`: migrated original auth/session/UI code; still accepts optional `initialSheetId`.

## Apply
Copy the listed files into the HRMS repository root, preserving paths. Replace both existing page files.

```bash
npm run build
git add app/spreadsheets/page.tsx 'app/spreadsheets/[id]/page.tsx' components/SpreadsheetPageClient.tsx
git commit -m "fix: Next.js spreadsheet route PageProps typing"
git push
```

No new dependencies or changes to spreadsheet data or edit permissions.

The Vercel log showed Webpack compilation passed before Next's page prop/type validation rejected `initialSheetId` on the route entry. CSS Autoprefixer warnings are separate, non-fatal warnings.
