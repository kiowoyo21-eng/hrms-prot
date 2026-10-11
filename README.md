# Underchargers HR PWA — Phase 8 Frontend

Complete replacement source for phases 1–8. Frontend prototype only (not a real HR/compliance application).

## What's new

Government agency cards, compliance task workspace, search/filters, urgency labels, configurable recurrence previews, annual approval workflow simulation, task notes/status updates, demo evidence attachments (filename only), filtered CSV export, and Mandaluyong permit examples.

Existing Phase 1–7 pages are retained. Agency logos are icon placeholders rather than official logo files.

## GitHub + Vercel

Extract ZIP, upload files in repository root (where `package.json` is located), preserve paths, and commit. `npm run build` on Vercel. No environment variables needed for frontend demo.

## Important

- All accounts are demo-only, insecure, and suitable only for non-sensitive prototypes.
- Records are in memory and disappear on refresh.
- All dates are illustrative; do not use this tool to file real compliance reports.
- No backend, Supabase, secure auth, real file storage, government submission or live notifications.
- Use production build testing before treating this as a working deployment.
