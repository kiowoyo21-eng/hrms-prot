import type {ComponentType} from "react";
import type {PrintTemplateProps,PrintTemplateId} from "./types";
import LeaveForm from "./templates/LeaveForm";
import HalfDayForm from "./templates/HalfDayForm";
import OvertimeForm from "./templates/OvertimeForm";
import WorkPermitForm from "./templates/WorkPermitForm";
import PreemploymentChecklistForm from "./templates/PreemploymentChecklistForm";
import StatutoryContributionsForm from "./templates/StatutoryContributionsForm";
import AssetAccountabilityForm from "./templates/AssetAccountabilityForm";
import ProbationStandardsForm from "./templates/ProbationStandardsForm";
import NdaForm from "./templates/NdaForm";
import FactFindingForm from "./templates/FactFindingForm";
import NteNovForm from "./templates/NteNovForm";
import ResolutionNodForm from "./templates/ResolutionNodForm";
import PoliciesSafetyForm from "./templates/PoliciesSafetyForm";
import EmployeeInformationForm from "./templates/EmployeeInformationForm";
import JobOfferForm from "./templates/JobOfferForm";
import EmploymentContractForm from "./templates/EmploymentContractForm";
import OrientationAcknowledgmentForm from "./templates/OrientationAcknowledgmentForm";
import type {FormKind,HRFormRecord} from "../../lib/hrForms";
import type {PrintFormData} from "./types";
import {sourceFormById} from "../../lib/studio/sourceFormsCatalog";

export const printTemplates: Record<PrintTemplateId,ComponentType<PrintTemplateProps>> = {
 "probation-standards":ProbationStandardsForm,
 "preemployment-checklist":PreemploymentChecklistForm,
 "statutory-contributions":StatutoryContributionsForm,
 "nda":NdaForm,
 "leave":LeaveForm,
 "halfday":HalfDayForm,
 "overtime":OvertimeForm,
 "workpermit":WorkPermitForm,
 "asset-accountability":AssetAccountabilityForm,
 "factfinding":FactFindingForm,
 "nte-nov":NteNovForm,
 "resolution-nod":ResolutionNodForm,
 "policies-safety":PoliciesSafetyForm,
 "employee-information":EmployeeInformationForm,
 "job-offer":JobOfferForm,
 "employment-contract":EmploymentContractForm,
 "orientation-acknowledgment":OrientationAcknowledgmentForm,
};

export const onboardingPrintTemplates: {id:PrintTemplateId;title:string}[] = [
 {id:"employee-information",title:"Employee Information & Emergency Contacts"},
 {id:"preemployment-checklist",title:"Pre-employment Requirements Checklist"},
 {id:"job-offer",title:"Job Offer Letter"},
 {id:"employment-contract",title:"Employment Contract / Terms"},
 {id:"orientation-acknowledgment",title:"Employee Orientation Acknowledgment"}
];

/** Maps printable source types only; never changes request approval or persistence state. */
export const hrRequestPrintTemplate: Partial<Record<FormKind,PrintTemplateId>> = {
 "Overtime Authorization":"overtime",
 "Leave Documentation":"leave",
 "Policy Acknowledgment":"policies-safety"
};
export function validPrintId(id:string):id is PrintTemplateId {return Object.prototype.hasOwnProperty.call(printTemplates,id)}
export function printTitle(id:PrintTemplateId){return sourceFormById(id)?.title||onboardingPrintTemplates.find(item=>item.id===id)?.title||id}
export function hrRequestPrintData(record:HRFormRecord, employeeName:string,position?:string,department?:string):PrintFormData{
 return {
   company: record.branch.startsWith("MM") ? "MM":"UC",
   employeeId: record.employeeId, employeeName, position, department, branch:record.branch,
   reference:record.id, date:record.createdAt.slice(0,10),
   status:record.status, preparedBy:record.requestor, reviewedBy:record.reviewedBy,
   values:{...record.fields,remarks:record.remarks,
     evidenceRefs:record.evidenceRefs,
     attachmentNames:(record.attachments||[]).map(x=>x.name).join(", "),
     reviewDate:record.reviewedAt||""},source:"hr-request"
 };
}
