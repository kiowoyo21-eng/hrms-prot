# Batch 06 — HR Forms, Employee 201 Identity Links and Incident Escalation

Status: **Code implemented; isolated tests passed.** Combined build and browser regression testing reserved for Batch 07.

## Delivered in the frontend-only checkpoint

1. HR-assisted Forms & Requests now select involved employees through a searchable, branch-scoped Employee 201 directory. Employee ID is the stored identity; related supervisor selectors also select Employee 201 IDs. Legacy/manual names remain read-only in existing records.
2. Internal Incident Reports require two distinct Employee 201 identities (reporter and involved employee), an incident date, category, severity and narrative. A separate public reporting preview remains separate and does not submit any cases.
3. Urgent/grave reports are routed to HR immediately and excluded from BM investigation access. Pending complaints remain allegations, not disciplinary findings.
4. Verified attendance imports produce lateness pattern alerts at 2nd and 3rd distinct late dates within a configurable 30-, 60- or 90-day window. Attendance is counted only from verified attendance batches. Verified same-day attendance and substantiated IR records are deduplicated.
5. Only explicit HR-substantiated IR findings count toward repeat violation thresholds, after a recorded case decision. Dismissed and unverified incidents do not count as confirmed violations.
6. HR review queue records recommended counseling, further investigation, or no action now with justification and reviewer identity. New occurrences re-alert HR without duplicating the same unchanged event.
7. Employee 201 history shows restricted IR metadata only to authorized Employee 201 reviewers; reporters are never counted as offenders. Case records remain browser-local and are **not secure storage**.
8. Global in-app HR-only incident notifications are published while HR is on other modules. No email/push notifications, live server delivery or authenticated confidentiality is claimed.

## Review and limitations

- Backend authorization, secure evidence storage, durable confidential notifications, authenticated approver identities and protected audit integrity are required before real HR/disciplinary data can be used.
- IR severity/category labels are triage classifications only. No automatic NTE, counseling obligation, guilt finding, warning, suspension or termination is generated.
- Real HR policy/legal review is required for each disciplinary action and Philippine labor due-process requirements.
- Automatic alerts require verified Employee 201 IDs and source data. Older cases without link/date/finding are not treated as substantiated.
- Source-only syntax checks and isolated unit tests are not equivalent to a complete Next.js build or user/browser acceptance test.
