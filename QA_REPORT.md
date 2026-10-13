# UCMM HR — Targeted Function Audit (Oct 13, 2026)

## Passed (run against source in current patch)

- **105/105** fictional September sample release/draft pairs generated and linked by release ID.
- Each generated payslip has a finite/non-negative result, a saved salary rate and worked days, and precise `gross - deductions = net` reconciliation.
- Itemized earnings and deductions sum to the saved release totals; rendered payslip HTML does not show an unexplained reconciliation error.
- Migration upgrades original seeded releases once (idempotent), preserves edited totals, and skips signed originals.
- 35 employees and **2,135** deterministic Sep/Oct sample attendance rows; future demo dates are not treated as genuine payable time punches.
- Monthly SSS reference split across first four Wednesday cutoffs; fifth Wednesday does not collect an extra monthly installment.
- Separate SIL-type paid leave vs VIL unpaid leave classification.
- Loan authorized/frequency check, linked employee-ID validation, balance cap and biweekly first-Wednesday anchor.
- Printable payslip fields, safe escaping of HR-controlled title/address (HTML injection regression test).
- Focused **strict TypeScript** checking of payroll-related pure libraries passed with a temporary React type shim.
- **59 TypeScript/TSX source files** parsed without syntax errors; CSS parsed with PostCSS.

## NOT fully verified / needs actual Vercel browser review

- Complete Next.js `next build` cannot be run here: npm dependency installation timed out; React/Next packages are not present in this runtime.
- Button-by-button browser interactions throughout all HR modules, mobile styles, print output and browser PDF rendering.
- Supabase real-time writes, security, applicant upload links, remote signing, employee permissions, and real file storage.
- Payroll against real employer attendance, actual ECOLA entitlement, latest official government rate schedules, holiday combinations, and employer remittance approval.
- CSV attendance importing has an existing preview-only limitation; uploaded contents are **not** yet posted into payroll calculations.

No assertion of complete production readiness is made.
