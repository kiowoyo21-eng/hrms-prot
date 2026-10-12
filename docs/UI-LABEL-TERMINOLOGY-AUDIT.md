# UI Terminology & Navigation Audit

This patch changes visible wording only. Existing internal IDs, routing, employee data and workflow state are unchanged.

## Employee 201 Profile
| Previous display | Updated display | Purpose |
|---|---|---|
| Overview | Overview | Snapshot of employee records |
| Personal | Employee Details | Personal, contact and emergency information |
| Employment | Employment Details | Branch, position, start date and work status |
| Compensation | Salary & Benefits | Basic daily/monthly pay, leave credits and premium rates |
| Documents | Documents | Required and submitted employee documents |
| Evaluations | Performance Reviews | Employee assessments and evaluation records |
| History | Employment History | Timeline of employee records and employment changes |
| Clearance | Clearance & Assets | Company asset returns and exit clearance status |

### Why not simply Compensation?
Compensation is a correct HR term. Salary & Benefits is clearer to ordinary HR staff and makes both salary and benefits immediately understandable. It is *not* interchangeable with gross pay, net pay or contributions.

## Wider UI changes
- Main sidebar: Payroll Management, Loans & Cash Advances, Reports & Analytics, Audit Logs, Settings; BM document access labelled Submit Employee Documents.
- Payroll tab labels use terms Employee Pay Rates, Government Deductions, 13th-Month Pay, Payroll Funding & Release, Government Remittances while preserving their underlying navigation IDs.
- Document tabs use Document Verification and Signing Requests; recruitment, reports, assets and compliance headings use consistent task-oriented names.
- Vague UI text such as View 201, Clearance, and Evaluate are replaced by clearer button/section titles.

## Intentionally retained
- Employee Directory filters (quick and advanced), Salary/Type stacked display, and 10/20/50 pagination.
- Current role access rules, document submission, payroll inputs and action workflows.
- Technical internal field names/status codes, so local browser data keys do not change due to a cosmetic rename.

This is a frontend terminology review patch only. All staff profiles in the test app remain fictional. The production build requires separate validation.
