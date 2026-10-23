/**
 * File inventory derived from the user's Archive(1).zip / Forms directory.
 * This is a reference inventory, NOT copies of private file bytes or legally approved forms.
 * Explicitly excludes all logo/image/media folders, PSA survey questionnaires, and unrelated patch files.
 */
import type {TemplateCategory} from "./types";

export type SourceFormGroup = "Hiring & Onboarding" | "Attendance & Requests" | "Employee Relations" | "Assets & Accountability" | "Policies & Compliance";
export type SourceFormReview = "Company review" | "Legal review" | "Sensitive source";
export type SourceForm = {
 id: string;
 title: string;
 group: SourceFormGroup;
 category: TemplateCategory;
 originalFiles: string[];
 linkedLifecycleIds: string[];
 review: SourceFormReview;
 note: string;
 requiredFields: string[];
};

const source = (id:string,title:string,group:SourceFormGroup,category:TemplateCategory,originalFiles:string[],linkedLifecycleIds:string[],review:SourceFormReview,note:string,requiredFields:string[]):SourceForm=>({id,title,group,category,originalFiles,linkedLifecycleIds,review,note,requiredFields});

export const sourceFormsCatalog: SourceForm[] = [
 source("probation-standards","Probationary Agreement & Regularization Standards","Hiring & Onboarding","Onboarding",["PREVAILING_UC_Probationary Agreement and Standards for Regularization.docx.pdf"],["contract","standards"],"Legal review","UC-specific agreement. Review communicated standards, duration/grounds, actual employer details, and the provision about holding final pay; do not treat source text as legally approved.",["Employee and employer","Start and probationary dates","Position and pay basis","Specific qualification standards","Actual acknowledgment"]),
 source("preemployment-checklist","Pre-employment Requirements Checklist","Hiring & Onboarding","Onboarding",["Pre-employment Checklist.pdf"],["requirements"],"Company review","Customize by position; do not mark every possible certificate as mandatory for every employee.",["Employee and assigned branch","Applicability per requirement","Received and verified dates","Reviewer"]),
 source("statutory-contributions","Statutory Contribution Information Sheet","Hiring & Onboarding","Compliance",["Statutory Contributions.pdf"],["sss-hire","ph-hire","pagibig-bir"],"Sensitive source","Contains blank SSS/Pag-IBIG/PhilHealth/TIN spaces. Treat actual identifiers as restricted, never public demo seed data.",["Employee name and department","Statutory agency reference","Restricted HR verification"]),
 source("nda","Non-disclosure & Confidentiality Agreement","Hiring & Onboarding","Onboarding",["UC_Nondisclosure.docx.pdf"],["nda"],"Legal review","Several UC addresses and duplicated agreement versions appear in source. Choose correct registered employer and review obligations before signing or adapting for MM.",["Employer legal identity","Employee identity","Agreement date","Confidentiality scope","Signatory/acceptance"]),
 source("leave","Leave Application","Attendance & Requests","General",["LEAVE FORM.docx"],[],"Company review","Existing Leave Management already handles requests. Use as printable source only; no separate disconnected filing workflow.",["Employee and position","Branch","Reason","Date applied","Start/end and total days","Review/approval"]),
 source("halfday","Half-day / Attendance Adjustment","Attendance & Requests","General",["HALF DAY.docx"],[],"Company review","Two form copies appear in the same file. Reuse existing attendance/request flow and keep one reusable template.",["Employee and position","Branch and date","Time interval","Reason","Review/approval"]),
 source("overtime","Overtime Request","Attendance & Requests","General",["OVERTIME.docx"],[],"Company review","Reuse existing overtime/request workflows; any compensation rules must be independently validated.",["Employee and position","Branch and date","Requested hours","Reason","Approval"]),
 source("workpermit","Work Permit / Endorsement Letter","Attendance & Requests","General",["WORK PERMIT.docx"],[],"Company review","The same blank form is repeated; normalize to a single reusable template and retain existing request/approval flow.",["Employee","Branch and position","Reason","Requester","Validated by","Approved by"]),
 source("asset-accountability","Asset & Device Accountability","Assets & Accountability","General",[
  "UC Accountability Form 09.12.26.docx",
  "Copy of UC Accountability Form to UCLP Manager 09.12.26.docx",
  "UC Accountability Form to UCLP Manager 09.12.26.docx",
  "UC Accountability Form to UCQC 09.12.26.wps"
 ],["clearance","handover-off"],"Sensitive source","Multiple branch/manager versions, potentially staff- or asset-specific and one .wps file. Start from a blank approved master; distinguish employee acknowledgment from manager custodial duties, and do not impose automatic personal financial liability.",["Custodian and branch","Asset description/serial","Date issued/returned","Condition","Verified acknowledgment"]),
 source("factfinding","Fact-finding Procedure","Employee Relations","Disciplinary",["FactFinding Procedure.pdf"],["hearing"],"Legal review","A procedure/reference document, not itself an NTE or termination decision; follow case-specific due process.",["Incident/case reference","Findings and evidence","Employee response record","Reviewer"]),
 source("nte-nov","Notice of Violation / NTE Source","Employee Relations","Disciplinary",["NTE_NOV.pdf"],["nte"],"Legal review","The uploaded PDF is headed Notice of Violation; do not automatically represent it as a legally sufficient first Notice to Explain. Review allegations, response period, service, and case facts.",["Notice recipient","Date and subject","Specific acts and supporting facts","Opportunity to respond","Service evidence"]),
 source("resolution-nod","Resolution / Notice of Decision Source","Employee Relations","Disciplinary",["RESOLUTION_NOD.pdf"],["decision"],"Sensitive source","Contains sample case dates and wording. Remove sample details and review decision and service process before reusing.",["Employee/case","Factual findings","Applicable decision","Date and signatory","Receipt/service evidence"]),
 source("policies-safety","General Policies, Procedures & Work Safety Protocol","Policies & Compliance","Compliance",["General Policies and Procedure and Work Safety Protocol.docx.pdf"],["orientation"],"Legal review","UC policy reference, not necessarily applicable to Mastermind. Review disciplinary sanction wording, consultation/acknowledgment, safety rules, and effective version before publishing.",["Legal employer","Policy version/date","Applicable employees","Safety coverage","Acknowledgment"]),
];

export const sourceFormById = (id:string)=>sourceFormsCatalog.find(entry=>entry.id===id);
export const linkedSourceForms = (lifecycleId:string)=>sourceFormsCatalog.filter(entry=>entry.linkedLifecycleIds.includes(lifecycleId));
