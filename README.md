# Underchargers HR PWA — Phase 7 Frontend

A complete replacement of the Phase 6 project, adding **Incident Report Management** UI. All data remains fictional and local to the browser session; no Supabase or backend integration is included.

## Install and build

```bash
npm install
npm run build
```

Deploy by uploading the **contents** of this extracted folder to your existing GitHub repository root. Vercel Next.js build follows your commit.

## Phase 7 contents

- IR intake form, reporting party, respondent, branch, category/summary, urgency and due date
- BM complaint → HR confidential route; other cases → BM with HR copied (UI preview only)
- IR lifecycle, notes, case status and resolution timeline
- Search, stage/urgency/branch filtering, CSV export, print
- Database blueprint and feature checklist under `docs/`

## Frontend-first roadmap

Phases 1–10 are **frontend UI/UX only**. Backend services, Supabase database setup, Auth and actual security enforcement will be planned and implemented only after frontend review, in subsequent phases.

Demo credentials are insecure and must not be used with actual employee data. No backend emails, notices, legal signatures or audit evidence are generated.
