# Batch 06 — Dashboard layout correction (2026-10-22)

**Scope:** Dashboard only. **Source state:** Implemented. **Runtime verification:** Pending.

| Problem | Change | Files | State |
|---|---|---|---|
| KPI grid and Quick Actions different left/right boundaries | One centered, bounded Dashboard home wrapper | `app/page.tsx`, `app/globals.css` | Implemented; browser QA pending |
| Oversized Quick Actions outer card and stranded empty space | Compact action chips without a large card background | `app/globals.css` | Implemented; browser QA pending |
| Pending-action alerts mostly below fold | Show pending alerts ahead of shortcuts | `app/page.tsx` | Implemented; browser QA pending |
| Additional reports resembles empty full-width panel | Compact summary row, preserved selector when expanded | `app/globals.css` | Implemented; browser QA pending |
| Illustrative activity adds visual noise | Collapse by default, keeping activity and Audit navigation | `app/page.tsx`, `app/globals.css` | Implemented; browser QA pending |
| Repetitive salary provenance sentence | Concise display, identical limits and data semantics | `components/DashboardOverview.tsx` | Implemented; browser QA pending |

## Preservation / constraints
- No changes to payroll calculations, employee records, release data, access permissions, alert publishers, or role/branch filtering.
- Quick-action destinations, existing report selector, and demo activity entries remain usable.
- Tablet/mobile reflow comes from existing Dashboard component breakpoints plus the scoped Dashboard home CSS; no text zoom/shrink introduced.
- Pending Action counts remain computed from actual published action alerts; no fabricated items.

## Validation required
- `npm run lint` (TypeScript type-check) and `npm run build` in an environment with dependencies installed.
- Browser: HR, Admin, BM, Ms Kate as available; check 1440+, 1024, 768, 390 px; keyboard activation of details and all shortcut links; confirm no horizontal overflow.
