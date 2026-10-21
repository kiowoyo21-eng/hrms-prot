# HRMS Main V10 — Universal UI, Audit & Permission Consistency

## Changes — October 21, 2026

### Audit History (functional correction)
- Replace duplicate browser-event and illustrative sample timelines with **one browser-recorded audit workspace**. The Dashboard's separate sample-activity illustration remains untouched.
- Search recorded events by non-sensitive metadata (module, actor, action, IDs, status); filter by module/actor/action; clear filters; paginate 50 at a time.
- CSV download exports **the actual filtered browser events**, not fictional sample activity. CSV is labeled as browser-local demo, timestamps are Asia/Manila, and free-text summary/remarks are excluded.
- Guard against malformed audit records, invalid timestamps, and duplicate event IDs in the *view*, without deleting or migrating saved browser data.
- Show detailed summaries and recorded remarks only to Super Admin; role-specific audit access follows the existing permissions matrix.
- Explicitly warn that legacy audit records lack reliable branch metadata and that localStorage evidence is not tamper-evident.

### Universal UI consistency
- Notification popover closes when the user changes branches or modules, preventing a stale popup after switching views.
- Escape key closes the notification popover and returns keyboard focus to its trigger.
- New Audit History filters and event rows have responsive narrow-screen layouts.

### Preserved
- Existing HRMS employees, payroll calculations, leaves, assets, incidents, Docs/Sheets, final-pay and Ms Kate final-approval logic.
- HR and Ms Kate audit visibility; Ms Kate inherits HR modules while only her special role has final approval. No new account or authentication change.
- Audit storage key (`uc-hr-ui-audit-trail-v2`) and existing audit event writers. No data reset or migration.
- Browser-only design; no CMS/Accounting/ERP integration added.
