/** Employee 201 attendance file index: links to actual request/permit bytes, never a second approval flow. */
import {readForms} from "./hrForms";
import {getHRFormFile} from "./hrFormEvidence";
import {getOpsPermitFile} from "./opsPermitEvidence";
import {OPS_PERMIT_KEY,type OpsPermit} from "./opsRestDays";

export const attendanceCategories=["Overtime","Work Permit / RDW","Half Day","Leave","Absence","Attendance Correction","Other"] as const;
export type AttendanceCategory=typeof attendanceCategories[number];
export type AttendanceDocumentLink={key:string;name:string;category:AttendanceCategory;status:string;file:File;reference:string;workDate:string;branch:string;reviewedBy?:string;source:"Request"|"OPS Work Permit"};
export function attendanceCategoryForRequest(kind:string,fields:Record<string,string>={}):AttendanceCategory|null{
 const k=kind.toLowerCase();const info=`${kind} ${fields.issue||""} ${fields.reason||""} ${fields.absence||""} ${fields.leaveType||""}`.toLowerCase();
 if(/half[ -]?day/.test(info))return "Half Day";
 if(/overtime|\bot\b/.test(k))return "Overtime";
 if(/work permit|work authorization/.test(k))return "Work Permit / RDW";
 if(/leave/.test(k))return "Leave";
 if(/absence|absent|return.to.work/.test(info))return "Absence";
 if(/attendance correction|schedule change/.test(k))return "Attendance Correction";
 return null;
}
export function readEmployeeAttendanceDocuments(employeeId:string):AttendanceDocumentLink[]{
 if(typeof window==="undefined")return [];
 const results:AttendanceDocumentLink[]=[];
 for(const request of readForms()){
  if(request.employeeId!==employeeId)continue; // Keep prior-branch documents after employee transfers.
  const category=attendanceCategoryForRequest(request.kind,request.fields);
  if(!category)continue;
  for(const attachment of request.attachments||[]){
   const file=getHRFormFile(request.id,attachment.id);
   if(!file)continue; // Metadata alone is not a document.
   results.push({key:`request-${request.id}-${attachment.id}`,name:attachment.name,category,
    status:`${attachment.status} · ${request.status}`,file,reference:request.id,
    workDate:request.fields.workDate||request.fields.from||request.fields.returnDate||"",branch:request.branch,
    reviewedBy:attachment.reviewedBy,source:"Request"});
  }
 }
 let permits:OpsPermit[]=[];
 try{const parsed=JSON.parse(localStorage.getItem(OPS_PERMIT_KEY)||"[]");if(Array.isArray(parsed))permits=parsed}catch{}
 for(const permit of permits){
  if(permit.employeeId!==employeeId)continue;
  const file=getOpsPermitFile(permit.id);
  if(!file)continue;
  results.push({key:`permit-${permit.id}`,name:permit.attachmentName||file.name,category:"Work Permit / RDW",
   status:`${permit.status} · BM: ${permit.reviewedBy||"Pending review"}`,file,reference:permit.id,
   workDate:permit.date,branch:permit.branch,reviewedBy:permit.reviewedBy,source:"OPS Work Permit"});
 }
 return results.sort((a,b)=>b.workDate.localeCompare(a.workDate)||a.key.localeCompare(b.key));
}
