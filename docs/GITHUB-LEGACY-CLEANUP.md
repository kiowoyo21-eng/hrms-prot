# GitHub Cleanup — after Phase 16 consolidation

## Why deployments failed

Uploads using GitHub's web UI **add/replace files, but do not delete old files**. The previous Phase 14 `components/FrontendQACenter.tsx` remained in the repository and refers to removed navigation IDs such as `completion` and `advanced`. The screenshot shows this TypeScript error, not a Vercel configuration problem.

## Recommended one-time cleanup

Delete the following retired screens from your existing GitHub repository if present. They were intentionally removed after merging their distinct functionality into active modules:

- `components/AdvancedHRWorkspace.tsx`
- `components/DetailedWorkflowForms.tsx`
- `components/FinalReviewHub.tsx`
- `components/FrontendQACenter.tsx`
- `components/WorkflowCompletionWorkspace.tsx`


GitHub web UI: open each file -> select the three-dot menu -> Delete file -> Commit changes. If a file does not exist, skip it. Keep all other components in the new ZIP.

After the cleanup, upload the contents of this ZIP to the **repository root** and commit. Do not upload a top-level wrapper directory. Let Vercel redeploy.

## Build hardening

`tsconfig.json` now lists `app/**` and `lib/**` as entry points rather than `**/*.tsx`. TypeScript automatically follows their imports and still validates every active imported component. Unused historical TSX files no longer affect compilation. This is a temporary guard, not a replacement for cleaning stale source files out of GitHub.

## Testing notes

- Validate the first new Vercel deployment and capture any new first TypeScript error.
- Local Next.js production build could not run because this environment could not resolve npmjs.org (EAI_AGAIN), so successful deployment has not been verified.
- This is a frontend-only review application with fictional records and non-production authentication.
