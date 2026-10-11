# Underchargers HR PWA — Phase 1 Frontend Prototype

A Next.js TypeScript UI prototype for the UC/MM HR Management System.

## Run locally

Requires Node.js 20.9+ and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Demo accounts (development only)

- Super Admin: `admin` / `admin12345`
- HR: `hraccount` / `hraccount12345`
- Branch Manager: `bmaccount` / `bm12345`

**Security:** Demo credentials and role filtering are client-side only. They are unsuitable for production or real HR data. No actual authentication, DB writes, document signing, or secure role enforcement is implemented. Use Supabase Auth, backend permission checks and PostgreSQL RLS before connecting real employee records. Do not use these passwords in a live deployment.

## Phase status

- Implemented: navigation shell, demo login, responsive dashboard, scoped preview menus, sample task counters and filtering, grouped audit UI, account settings preview, and PWA manifest.
- Not implemented: real persistence, attendance integration, payroll processing, government reporting, files/signatures, notifications, offline mode, and production authentication.

See `docs/PHASE-1-CHECKLIST.md`.

## Architecture direction

Frontend-first with incremental schema blueprinting. Implement approved modules end-to-end (API, database, security, audit logs) after interface reviews.
