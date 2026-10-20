# HRMS Main V3 — GitHub Website Installation

This ZIP contains **changed/new source files only**, not a full project.

## Required base
Latest HRMS project with **Main Modules V2 — UI & Data Integrity** already applied, together with Universal Notifications V2 and V3. This patch was assembled against source files available in this conversation; it was not pulled from your current live GitHub `main` branch.

## Files to upload together
- `components/AssetWorkspace.tsx` (replace existing)
- `components/IncidentWorkspace.tsx` (replace existing)
- `lib/assetLifecycle.ts` (new)
- `lib/incidentCaseRules.ts` (new)

## Installation through the GitHub website
1. Extract this ZIP locally; DO NOT upload the ZIP itself to the repository.
2. Open `github.com/kiowoyo21-eng/hrms-prot`, branch `main`.
3. Upload the two new `lib` files into `lib/`.
4. Replace the two existing files in `components/` with the patch copies. Make sure folder paths are exact.
5. Commit all four source files in **one commit**.
6. Wait for the Vercel production deployment; if the build fails, send the error log before applying another major revision.
7. Once deployed, perform the manual smoke tests in QA_REPORT.md (branch switching, asset custody stages, incident links, document review).

**Merge caution:** If AssetWorkspace or IncidentWorkspace has been edited in GitHub since Main V2, merge those new changes into these replacements rather than overwriting later work.

**Security:** This frontend-only localStorage prototype MUST NOT contain real confidential complaints, real handover signatures or legally significant employee/asset records without a secure backend, authenticated permissions and verified storage.
