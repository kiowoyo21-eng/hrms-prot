# Underchargers Workspace — Native HRMS PWA patch v3

## Install
Baseline: original `hrms-prot-main.zip` (not the standalone v1/v2 HTML demo). Back up your local working tree. Extract this patch at the root of that project and overwrite the matching paths. No dependency changes or backend migrations are included. If you previously applied v1/v2, this replaces `app/page.tsx` with the original native HRMS navigation plus v3 features. The old `public/workspace/index.html` and v1/v2-specific docs/tests can be removed manually if no longer needed; v3 does not use them. Do not overwrite unrelated developer changes without reviewing the patch.

```sh
npm install
npm run lint
npm run build
npm run dev
node tests/workspace-native-v3-test.cjs
```

Open the native PWA at `/` (not `/workspace/index.html`). Use only the existing fictional demo accounts and fictional records. All changes are browser-local. The employee preview is a role-controlled HR review surface, **not** a deployable Employee App or authenticated employee account. Switch demo accounts in the same browser to exercise approvals. The original modules remain available.

## Review walkthrough
1. **Request and Reports**: create a request, select an employee, enter all required fields, add sequential stages and select eligible personnel. `All` waits for every member; `Any` advances on one approval. Switch to the assigned reviewer, approve each stage or reassign with a recorded reason. Existing legacy records keep their prior route until edited/resubmitted. Imported JSON handoffs explicitly select a single reviewer at import; HR-assisted resubmission restarts the plan.
2. **Employee App Review**: select a fictional Employee 201 record. Home reads current-cutoff draft net if available and cumulative released payroll; no numbers fabricated for missing current drafts. Attendance shows existing imported rows. Submit an attendance correction from a row (or a rejected photo attempt) and select reviewers. This writes to the existing HR forms register, not a second request table.
3. **Payroll Management**: review the linked approved correction queue and original imported row. A released period is flagged for next-cutoff adjustment review. No automatic payroll edits, recomputation, payments or official attendance changes are made. For photo review, select a pending fictional capture, enter a reason and accept/reject. The employee preview displays the same attempt and original submission time.
4. **Incident Reports**: open a case with a linked respondent, then open linked case notices. Create a memo/NTE/NOV/etc., assign a different HR signatory and applicable To/CC/BCC recipients. Switch to the signer, open Employee Documents > Routing & Signing, review the text, draw, preview and explicitly confirm. Switch to Employee App Review, select that employee, open Inbox, sign/acknowledge, decline, or respond. The incident case, document routing panel, Employee 201 history and Drive issued-document index reference the same notice ID. The status is a demonstration, not legally effective service or agreement.
5. **Document Studio**: as Super Admin, use the new import panel to read TXT/MD/DOCX text and map common blank fields. Edit text, save a draft using the original Studio store, then use its existing rich-text editor and publishing controls. Optional TSX export is source only; generated code is never executed. An approved Docs template can populate a new routed notice using Employee 201 values; source template ID/version is preserved. This text import does not preserve scanned layout, images or tables; existing original DOCX/PDF tools remain available.
6. **IT Support**: submit a ticket from either app review or HRMS; sign in as Super Admin to claim and resolve in the shared queue. SLA target, maintenance flag, version setting, audit and existing notifications use local records. Super Admin is a temporary IT demo operator, not the final production permission model.
7. **Global search**: find employee/request, authorized notice or own/scoped support ticket; the record opens in its native module. New signing and IT items also appear in the existing notification registry. Resetting the original sample records clears the v3 demo store.

## Validation completed in the patch environment
- 236 TypeScript/TSX files transpiled without syntax diagnostics.
- Strict standalone type check passed for new pure workflow/store modules, existing HR form transitions and navigation.
- All seven existing regression suites: 145 targeted checks passed.
- New v3 transaction suite: 20 targeted checks passed.
- These are source/logic tests, not a full React/Next.js type check, visual QA or E2E browser test. npm registry DNS failed (`EAI_AGAIN registry.npmjs.org`); dependencies were not installed and the full build was not run.

## Scope limits / production gates
- Shared browser-local store, no real API, authentication, cross-device persistence, secure file store, encryption or reliable production audit. Do not enter real employee data or signatures. BCC visibility and authorization are UI/logic demonstrations only; the browser storage can be inspected.
- No AI, OCR, face identity, live GPS, real biometric confirmation, emergency login, roaming enforcement, actual attendance posting, payroll release, or mobile OTA. Photo input can open gallery; fictional images are compressed in-browser. Manual review is demonstration only.
- The original leave, payroll, recruitment, asset, ERP, compliance and spreadsheet modules remain unchanged except the documented navigation/bridge touchpoints. New HR request approvals are documentation-only; authoritative leave/financial workflows still require integration. Legacy fixed final-approver workspace is retained, not converted to the new engine.
- Production IT role tiers, monitoring, release actions, full no-code configuration, multi-company isolation, external CMS/Accounting and notifications need backend work. Existing branch filtering is used for new records; the original prototype is not a production multitenant security boundary. User availability warning, automatic routing conditions, cross-module scheduling and general mail/chat are not implemented in v3.
- Template source import is text-first; no layout OCR or arbitrary TSX execution. Issued-document download is a plain text demo, not signed PDF. Company/employee drawn signature images are locally persisted and visible within the allowed demo record.
