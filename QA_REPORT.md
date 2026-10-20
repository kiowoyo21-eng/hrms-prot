# QA Report — HRMS Main V3

## Checks run in this environment
- **28 / 28 focused Node.js assertions passed** for asset-status transition permissions, request reason validation, custody retention, return receipt, inspection closure, reinpection, damaged-asset handling, unique IDs, employee/asset branch compatibility, and incident Employee 201 branch-specific links.
- **4 source files changed/new**, based on Main Modules V2 and Universal Notifications V2/V3 reconstructed source.
- **114 TS/TSX project source files passed TypeScript syntax transpilation** (not semantic project typechecking).
- **0 missing relative imports** across the reconstructed source.
- **2 new lifecycle/rules helpers passed strict standalone TypeScript checking** with structural declaration stubs for their existing project types.

## Not verified
- Full `next build` / Vercel production deployment: dependencies were not installed in this environment. No claim of full project semantic TypeScript success.
- Actual browser click-through, visual scrolling, mobile layout and popup layering.
- Persistence or signatures across devices, concurrency, tamper-evident audit logs and backend authorization.

## Required deployment smoke tests
1. Use an HR/Super Admin demo account and select one branch; check that only that branch's assets and incident case people appear.
2. For an Assigned asset, click **Request Return**, enter a reason, confirm For Return; verify employee custody remains visible.
3. Choose **Receive Return**; verify it cannot advance without both form review and physical receipt confirmation.
4. Finish **Inspect**, choose Available and a Good condition; verify the employee ID and temporary signature status are cleared and the history is retained.
5. Set a Damaged condition: verify Available is rejected; choose Maintenance, then **Reinspect** after repair.
6. Check Retired assets have no Assign button and serial duplicates are rejected on Add Device.
7. In Incident Reports as HR with All Shops, switch the new-case branch. Verify Employee 201 dropdown values follow the case branch and previous selected IDs are cleared.
8. Open an incident case with another branch selected; verify verified-ID choices are restricted to that case's branch.
9. Confirm unrelated/duplicate Employee 201 IDs do not satisfy closure, and raw note text is not repeated in the case action timeline.
10. Check Leave, Payroll, Sheets, Docs, and the global notification bell for unexpected regressions before any further core revision.

## Note on prototype use
Actions in this patch remain browser-local. An on-screen checked box is a demonstration record, **not** independent physical custody verification. Incident notes in localStorage are not encrypted or role-isolated at the server; do not enter genuine sensitive reports.
