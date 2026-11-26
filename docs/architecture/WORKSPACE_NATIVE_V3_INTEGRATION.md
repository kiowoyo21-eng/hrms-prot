# Native Workspace v3 — integration map

The v3 patch deliberately extends original Next.js/React pages instead of redirecting to a parallel HTML app. This is a vertical-slice review patch, not completion of Master Architecture v1.0.

| Original component/domain | Native connection |
|---|---|
| `lib/hrForms.ts`, HRFormsRequestsWorkspace, RequestReviewDetail | Same HRFormRecord with optional approvalPlan; existing route compatibility; sequential stages and all/any parallel members; reassignment; legacy records preserved |
| Employee App Review | Reads Employee 201, existing payroll releases/drafts and imported attendance; writes existing HRFormRecord; reads issued notices and submits shared tickets |
| IncidentWorkspace | Case ID and respondent Employee 201 ID linked to issued notice, with explicit company signature before delivery |
| WorkflowSigning | Optional callback for explicit confirmed demo signature; original preview-only callers unaffected |
| DocumentOperationsHub | Native Routing & Signing tab, existing approved Docs template field population |
| EmployeeWorkspace | Read-only notice references in existing Employee 201 history |
| DriveWorkspace | Search-filtered issued-document index, same notice ID; no duplicate file bytes |
| PayrollOperationsHub | Reads approved attendance documentation and flags released vs open cutoff; manual photo-review queue |
| StudioIndex | TXT/MD/DOCX text import into original Studio draft store, field suggestions and optional TSX export |
| IT Support | Shared ticket queue, claim and resolve, local settings, audit |
| GlobalHRSearch + ModuleAlerts | Native navigation and action indicators for accessible new records |

## Storage ownership and eventual API contracts
- Existing HR form register remains authoritative for demo requests (`uc-hr-forms-documentation-v1`). New approval plan lives on the record, not a duplicate table.
- Existing HR state retains employee, payroll, and imported attendance records. No posted values are altered by a document approval.
- Existing Studio store owns editable templates; an issued notice records the source template ID/version plus immutable text snapshot for that demo.
- New `uc-workspace-native-v3` store holds notices, photo attempts, tickets, and technical settings. The data is not a real security boundary. Cross-tab events refresh these new records; full concurrent writes and network sync are out of scope.
- Preserve these IDs on production migration; replace browser-local storage with authenticated server commands, company-scoped permissions, private evidence blobs and durable event/outbox processing. Use transactions, optimistic version checks, idempotency keys and append-only audit. No direct salary/attendance changes from a documentation approval.

## Next implementation batches
1. Audit live attendance schema and original HRMS workflow/permission models; agree company identity mapping and migration ownership with IT.
2. Implement server-side approval and signatory assignments, actual identity/session enforcement and document access policies; wire existing leave, payroll and cases to it.
3. Build actual employee app endpoints and mobile screens; signed immutable PDFs, receipt vs agreement, fallback formal service and privacy retention.
4. Integrate attendance native camera/GPS, authorized roaming, AI with manual review, timestamps and correction-to-payroll reconciliation.
5. Complete IT roles, approved no-code commands, diagnostics, release management and safe recovery; test independent access.
6. Complete template OCR/layout workflow, department drives, notifications, accounting/CMS contract, production security, local build and store readiness.
