# UC Workspace v1.0 — updated PWA review prototype

**Review only — do not use real employee information.** This copy preserves the original HRMS Next.js application and adds a dependency-free, browser-local integration prototype at `public/workspace/index.html`. It is an architectural and UX review, not a production conversion. No live database, source repository, or external service was modified.

## How to open

**Quick review:** open `public/workspace/index.html` directly in a browser. No npm dependencies are needed for the new prototype. For reliable browser-local persistence, serve it over HTTP if your browser restricts localStorage for file URLs. The separate `UC_Workspace_Prototype_Preview.html` is the same file.

**Full original application + new review:**

```sh
npm install
npm run dev
```

Open `http://localhost:3000/`. The existing login screen and signed-in sidebar have a **Workspace v1.0 preview** link. The integration review is at `http://localhost:3000/workspace/index.html`. The application launcher opens original modules; original module access continues to use the existing prototype demo login and role checks. The standalone preview cannot navigate into original modules unless the full Next.js project is running. No new dependencies were added. Run `npm run lint` and `npm run build` in a dependency-enabled environment before any deployment.

## Review walkthrough

1. Choose **Underchargers** or **Mastermind** at the top. Each has its own fictional dataset. Switch among HR, Supervisor, Finance, IT and Employee demo actors.
2. HR: open People, create an onboarding record, activate it with a supporting reference, and inspect the automation event in Configuration > Audit trail.
3. Employee: submit an attendance dispute or leave request. Choose individual approvers, actions and sequential/parallel mode. Switch to the assigned actor and approve/reject/return/reassign the request. An unavailable assignee is labeled On leave.
4. Employee: simulate Time In with a compliant, uncertain or rejected outcome. Guard assists with whole-body capture using the employee's device; guard has no approval authority. Switch to HR to review uncertain attempts. No camera, GPS, or AI inference is actually executed.
5. HR: issue a sample Memo/IR/NTE/NOV/contract or other document and assign a signatory. Employee: open the document, draw a sample signature, explicitly confirm, respond or decline. The status is reflected in HR's document register. Download a **sample text copy**; this is not a signed PDF or legal signature.
6. Employee: compose internal correspondence with To, CC, BCC, submit for approval. Switch to the assigned actor and approve. Recipient sees the correspondence without hidden BCC names. This is UI-only confidentiality, not server-side security.
7. HR: register a sample file's metadata or create a document template with placeholders, edit text, reorder fields, submit for review, publish, and generate a sample document. Original Drive, Docs, Sheets and Studio remain available in the full application.
8. Employee: create support ticket. IT: claim/assign, update status, resolve, inspect health/asset/account/release views and technical controls. No IT actor should access real payroll or confidential HR content.
9. HR/Finance: walk through sample payroll transitions to release, which generates sample payslips in the document register and adds the illustrative net amount to the cumulative figure. No payment is executed.
10. Employee App preview: review the mobile design with current weekly cutoff net earnings, cumulative released net, attendance, requests, documents, inbox and support.

## Architectural decisions represented

- Two companies; company-scoped demo records; primary branch plus authorized roaming concept; one registered employee device and IT-assisted recovery remain production requirements.
- Weekly Thursday–Wednesday cutoff, Saturday release; prominent current cutoff estimated net and smaller cumulative released net. Approved overtime only, pending separate in production.
- Dynamic per-transaction assignment with no universal fixed approver. Multi-stage sequential/parallel demo, availability, reassignment history, return/revision/appeal.
- Guard-assisted whole-body photo on employee device; AI dress-code assessment, manual review, emergency fallback. Time In submission time retained in the sample record. Exact attire, grace/break policies and WFH remain pending.
- Electronic document delivery, acknowledgment vs agreement, explicit signing, refusal and response, document versioning intent, access-controlled download; biometric reauthentication planned.
- Department and company shared drives, internal mail only, no real-time chat or external sharing, personal calendar concept. BCC hidden from ordinary recipients in demo UI.
- Structured template data rendered safely; production OCR/AI conversion and visual layout editor planned, not arbitrary generated code execution.
- Role-based IT module in HRMS, shared support queue, SLA suggestions, controlled feature settings, maintenance, releases/OTA, diagnostics, device/asset support. IT does not make HR decisions.
- Existing CMS/Accounting ownership from `docs/architecture/INTEGRATION-REQUIREMENTS.md` is retained; ERP stays standalone. No actual integration added.

## What is new versus preserved

| Area | Review implementation |
|---|---|
| Original HRMS modules, docs, tests | Preserved; only `app/page.tsx` updated with review link and permission-checked module deep linking |
| Integration review | `public/workspace/index.html` (HTML/CSS/JS; independent of Next.js dependencies) |
| Connected demo state | Separate localStorage namespace `uc-workspace-review-v1.2`; original prototype storage not migrated or overwritten |
| QA | `qa/workspace-review-smoke.py` (requires Python Playwright and Chromium; no npm) |

## Boundaries and limitations

- This is not a replacement for the original PWA or a completed production integration. The new review is a separate workspace within the source package. It uses fictional seed records, not the original HRMS local records. Original modules' own screens and business rules remain unchanged.
- Actor selection, company separation, permissions and BCC visibility are UI simulations, not real authentication or authorization. Anyone who opens browser storage may inspect the fictional data. Never use real employee or confidential information.
- AI results are manually selected simulations, no computer vision or face/body identification. Photo capture input retains only the selected sample filename; no real photos are uploaded. GPS, biometric authentication, emergency login, mobile builds, push notifications, OTA and system health are not connected.
- Templates support manual content/placeholder editing, field ordering, review and publication states; no real OCR, generated TSX, layout reconstruction, icon placement or production template renderer. File registration stores only metadata, not file bytes, compression or cloud storage. Document downloads are sample TXT, not official PDF; drawn sample signatures are stored locally only.
- Approval engine and signatory assignment are illustrative; no server-enforced separation of duties, workflow policy engine, amount thresholds or legally binding signatures. Conditional workflow rules, robust audit, multi-recipient groups, actual SLA timers, notification delivery, retention/deletion, personal calendar, report/dashboard builders, real integrations and payroll statutory computation require further work.
- Attendance disputes create a review request; approval can emit a payroll-adjustment review demo event, not modify actual payroll or original attendance records. Automation rules log simulated events, not real background jobs. Payroll transitions are sample status changes; actual payment is not verified.
- No live Supabase schema inspection, migration, external provider connection or legal sign-off was attempted. Full Next.js build/typecheck was blocked by npm registry DNS/network access in this environment. The added standalone review's JavaScript syntax and browser smoke flows were tested separately.

## Production next step

Inventory actual data and business processes in both repositories, then agree on backend ownership, identity mapping, company isolation, API contracts, transaction state machines, secure storage and permissions. Keep the current HRMS prototype as functional reference; preserve the original implementation and migrate it incrementally. The new workspace review is intended for design feedback, not direct deployment.
