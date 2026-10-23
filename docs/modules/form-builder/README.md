# Form Builder (Tools)

**Status:** Frontend/browser-local implementation (Batch 16). No authenticated cross-device submission, inbox delivery, file upload, public link hosting, or backend data security is implied.

## Where to find it

**HRMS → Tools → Form Builder**. The Tools module is accessible to HR, Ms Kate (HR extension with additional final-approval role), and Super Admin according to existing module permissions; BM is not given Tools access. Editing/publishing is limited at the client UI level to those roles, **not server-enforced security**.

## Form destinations

- **Job Application:** `application` core template. Edits its title/description and additional questions on `/apply`. Existing mandatory application details, published job positions, resume validation and local Recruitment/Hiring record persistence stay unchanged. Additional answers are saved in the existing applicant `answers` map on that same browser.
- **Workplace Incident Report:** `incident` core template. Edits public title/description and supplementary questions on `/report`. **Preview validation only**; no incident report is saved, delivered, or acknowledged. Existing report routing guidance is retained.
- **Existing Employee Requests:** Add an **HR Request**-targeted template for one of the existing `lib/hrForms.ts` request types (Overtime, Leave Documentation, Attendance Correction, COE request, and more). Published additional questions show on the Request and Reports form; responses, snapshot labels, and existing core status workflow persist under that request record. These are documentation requests, not operational approvals.
- **Custom employee intake:** Create a form, add sections/questions (the current editor supports a flat question list), publish in demo, and open `/intake/<form-id>` on the **same browser**. Responses are stored under `uc-hr-intake-responses-v1` and can be viewed and exported as CSV in Form Builder. There is no operational workflow routing for custom intakes yet.

## Supported question types

Short answer, paragraph, email, number, date, dropdown, single-choice radio, multi-choice checkboxes. Configurable help text, required flag, option lists, question ordering, duplicates/cloning of templates. Up to 35 questions per template, 2000 characters per response. Built-in core fields cannot be removed because their workflows require them.

## Response and editor behavior

Editing happens in a responsive modal, not inline. Template list has visible Actions on narrower viewports. Form responses open in a modal; external custom form itself has a dedicated page. Esc, tab focus handling, close and scroll are supported. Editing or deleting a template does not rewrite already-saved answer labels/values or previous local responses. Draft/publish state is local and has no network effect.

## Privacy and production limitations

**Never ask real applicants or employees to submit sensitive data on these browser-only pages.** Publishing is *not* a shareable link on another device. No secure storage, protected real access, notifications, email, server validation, spam prevention, workflow escalation, evidence attachments or production onboarding/incident routing exists. Before a live launch, implement authenticated employee/external intake endpoints, proper backend schema/version snapshots, anti-abuse controls, secure file storage, access enforcement, retention and audit, and notifications according to UC/MM organization boundaries.

## Validation

`NODE_PATH=/opt/nvm/versions/node/v22.16.0/lib/node_modules node scripts/check-intake-forms.cjs` (if globally installed TypeScript is available). Full Next.js build and actual browser testing must run in an installed Next.js environment before deployment.
