# Installation: HRMS Missing Module Fix

This is an incremental patch for the Vercel build error:

`./app/studio/page.tsx Module not found: Can't resolve '../../lib/studio/mergePreview'`

1. Extract this ZIP into the **HRMS repository root** (not into an extra nested folder). The ZIP contains `lib/studio/mergePreview.ts`.
2. Verify the file exists at `lib/studio/mergePreview.ts` and its filename capitalization matches exactly (Vercel runs on Linux).
3. Run `npm run build` locally to check for further errors.
4. Commit and push the restored source file:

   git add lib/studio/mergePreview.ts
   git commit -m "fix: restore document merge preflight helper"
   git push

If you already have this file locally, verify it is tracked by Git and that it is not excluded by `.gitignore`.
