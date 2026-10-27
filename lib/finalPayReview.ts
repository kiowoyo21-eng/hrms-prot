/** Frontend-only final-pay preparation: NOT a legal computation, approval, or payment release. */
import type {HRState} from "./hrState";
import {outstandingCustody} from "./employeeLifecycle";
import type {Role} from "./mock";
import {reconciliationForEmployee,type ThirteenthSettlement} from "./thirteenthSettlement";

export type FinalPayStatus="Draft"|"For HR Review"|"HR Reviewed"|"Returned for Correction"|"Accounting Handoff (Demo)"|"Payment Recorded (Demo)";
export type FinalPayAmounts={unpaidBasic:number;thirteenthAdjustment:number;leaveConversion:number;otherEarnings:number;taxWithholding:number;loanRecovery:number;otherDeductions:number};
export type FinalPayReferences={attendance:string;payroll:string;loans:string;assets:string;statutory:string};
export type FinalPayEvent={at:string;actor:string;action:string;from:string;to:string;reference:string};
export type FinalPayCase={thirteenthSnapshot?:ThirteenthSettlement;clearanceStatus?:"Pending"|"In Progress"|"Cleared"|"Outstanding Issues";clearanceNote?:string;clearanceBy?:string;clearanceAt?:string;paymentReference?:string;paymentAt?:string;paymentRecordedAt?:string;closedAt?:string;closedBy?:string;id:string;lifecycleCaseId:string;employeeId:string;branch:string;createdAt:string;createdBy:string;status:FinalPayStatus;lastWorkingDay:string;amounts:FinalPayAmounts;references:FinalPayReferences;notes:string;reviewedBy?:string;reviewedAt?:string;handoffAt?:string;history:FinalPayEvent[]};
export type FinalPayResult={ok:true;record:FinalPayCase}|{ok:false;error:string};
export const finalPayFields:[keyof FinalPayAmounts,string][]=[
 ["unpaidBasic","Unpaid basic wages (verified)"],["thirteenthAdjustment","13th-month adjustment (verified)"],
 ["leaveConversion","Unused leave conversion (if eligible)"],["otherEarnings","Other verified earnings"],
 ["taxWithholding","Withholding / statutory deductions (verified)"],["loanRecovery","Authorized loan recovery (verified)"],
 ["otherDeductions","Other lawful deductions (verified)"]
];
export const finalPayReferenceFields:[keyof FinalPayReferences,string][]=[
 ["attendance","Final attendance and workday reference"],["payroll","Last payroll and payment reconciliation reference"],
 ["loans","Loan/advance SOA and recovery authorization reference"],["assets","Asset and accountabilities clearance reference"],
 ["statutory","Statutory / 13th-month / leave entitlement review reference"]
];
export const validMoney=(v:number)=>Number.isFinite(v)&&v>=0&&Math.abs(v*100-Math.round(v*100))<1e-6;
export const blankFinalPayAmounts=():FinalPayAmounts=>({unpaidBasic:0,thirteenthAdjustment:0,leaveConversion:0,otherEarnings:0,taxWithholding:0,loanRecovery:0,otherDeductions:0});
export const blankFinalPayReferences=():FinalPayReferences=>({attendance:"",payroll:"",loans:"",assets:"",statutory:""});
export const finalPayRole=(role:Role)=>role==="HR"||role==="Super Admin"||role==="Special Final Approver — Ms Kate";
export function finalPaySummary(a:FinalPayAmounts){
 const gross=a.unpaidBasic+a.thirteenthAdjustment+a.leaveConversion+a.otherEarnings;
 const deductions=a.taxWithholding+a.loanRecovery+a.otherDeductions;
 return {gross:Math.round(gross*100)/100,deductions:Math.round(deductions*100)/100,net:Math.round((gross-deductions)*100)/100};
}
export function finalPayBlockers(state:HRState,record:FinalPayCase):string[]{
 const c=(state.lifecycleCases||[]).find(x=>x.id===record.lifecycleCaseId&&x.employeeId===record.employeeId&&x.action==="Offboard");
 const p=state.people.find(x=>x.id===record.employeeId);
 const errors:string[]=[];
 if(!c||c.status!=="Applied (Demo)")errors.push("A completed offboarding lifecycle review is required.");
 if(c&&p){
  const current=reconciliationForEmployee(state,p,Number(c.effectiveDate.slice(0,4)),c.effectiveDate);
  if(!current.complete)errors.push(`13th-month reconciliation incomplete: ${current.issues[0]}`);
  if(!record.thirteenthSnapshot||JSON.stringify(record.thirteenthSnapshot)!==JSON.stringify(current))errors.push("13th-month calculation has changed or is not yet saved. Reconcile and save the latest calculation.");
  if(current.complete&&Math.abs(record.amounts.thirteenthAdjustment-current.outstanding)>0.009)errors.push("13th-month final-pay amount does not match the verified remaining entitlement.");
 }

 if(!p||p.status!=="Clearance Pending"||p.branch!==record.branch)errors.push("Employee must still be Clearance Pending in the original branch.");
 // Outstanding assets must be visible to HR but must NOT automatically block statutory final-pay review.
 if((state.payrollConfig?.payslipDrafts||[]).some(d=>d.employeeId===record.employeeId&&d.status!=="Released (Demo)"))errors.push("Unreleased regular-payroll drafts must be reviewed for overlap or duplication.");
 if(!/^\d{4}-\d{2}-\d{2}$/.test(record.lastWorkingDay)||!Number.isFinite(Date.parse(record.lastWorkingDay))||new Date(`${record.lastWorkingDay}T00:00:00Z`).toISOString().slice(0,10)!==record.lastWorkingDay)errors.push("A valid last working day is required.");
 else if(c&&record.lastWorkingDay>c.effectiveDate)errors.push("Last working day must not be later than the offboarding effective date.");
 for(const [key,label] of finalPayReferenceFields)if(record.references[key].trim().length<5)errors.push(`${label} is required (5+ characters).`);
 if(finalPayFields.some(([key])=>!validMoney(record.amounts[key])))errors.push("All itemized amounts must be nonnegative and limited to two decimal places.");
 const totals=finalPaySummary(record.amounts);
 if(totals.net<0)errors.push("Estimated net is negative; resolve the deduction discrepancy before handoff.");
 return errors;
}
const event=(now:string,actor:string,action:string,from:string,to:string,reference:string):FinalPayEvent=>({at:now,actor,action,from,to,reference});
export function createFinalPay(state:HRState,caseId:string,actor:string,role:Role,now:string,id:string):FinalPayResult{
 if(!finalPayRole(role)||!actor.trim())return {ok:false,error:"An authenticated HR user is required."};
 const c=(state.lifecycleCases||[]).find(x=>x.id===caseId&&x.action==="Offboard"&&x.status==="Applied (Demo)");
 if(!c)return {ok:false,error:"First complete the offboarding lifecycle review in Employee 201."};
 const p=state.people.find(x=>x.id===c.employeeId);
 if(!p||p.status!=="Clearance Pending"||p.branch!==c.sourceBranch)return {ok:false,error:"Employee is no longer in eligible clearance status."};
 if((state.finalPayCases||[]).some(x=>x.lifecycleCaseId===caseId))return {ok:false,error:"A final-pay preparation already exists for this offboarding case."};
 if((state.finalPayCases||[]).some(x=>x.id===id))return {ok:false,error:"A duplicate final-pay reference was generated."};
 const settlement=reconciliationForEmployee(state,p,Number(c.effectiveDate.slice(0,4)),c.effectiveDate);
 const record:FinalPayCase={thirteenthSnapshot:settlement,id,lifecycleCaseId:c.id,employeeId:p.id,branch:p.branch,createdAt:now,createdBy:actor,status:"Draft",clearanceStatus:"Pending",lastWorkingDay:c.effectiveDate,amounts:{...blankFinalPayAmounts(),thirteenthAdjustment:settlement.complete?settlement.outstanding:0},references:blankFinalPayReferences(),notes:"",history:[event(now,actor,"Created draft","None","Draft","Offboarding checklist handoff") ]};
 return {ok:true,record};
}
export function reviseFinalPay(record:FinalPayCase,actor:string,role:Role,now:string,updates:{amounts:FinalPayAmounts;references:FinalPayReferences;lastWorkingDay:string;notes:string;thirteenthSnapshot?:ThirteenthSettlement}):FinalPayResult{
 if(!finalPayRole(role)||!actor.trim())return {ok:false,error:"HR authorization required."};
 if(!["Draft","Returned for Correction"].includes(record.status))return {ok:false,error:"This review is locked. Return it for correction first."};
 if(finalPayFields.some(([key])=>!validMoney(updates.amounts[key])))return {ok:false,error:"Enter valid nonnegative amounts with at most two decimal places."};
 if(updates.notes.length>1500||finalPayReferenceFields.some(([key])=>updates.references[key].length>300))return {ok:false,error:"Review note/reference exceeds the supported length."};
 return {ok:true,record:{...record,...updates,status:"Draft",reviewedBy:undefined,reviewedAt:undefined,history:[...record.history,event(now,actor,"Revised draft",record.status,"Draft","Review fields edited; values redacted") ]}};
}
export function transitionFinalPay(state:HRState,record:FinalPayCase,action:"Submit"|"Review"|"Return"|"Handoff",actor:string,role:Role,now:string,reason:string):FinalPayResult{
 if(!finalPayRole(role)||!actor.trim())return {ok:false,error:"Only authorized HR staff can manage final-pay preparation."};
 const current=(state.finalPayCases||[]).find(x=>x.id===record.id);
 if(!current||JSON.stringify(current)!==JSON.stringify(record))return {ok:false,error:"Review record changed. Refresh before deciding."};
 const next:Record<typeof action,FinalPayStatus>={Submit:"For HR Review",Review:"HR Reviewed",Return:"Returned for Correction",Handoff:"Accounting Handoff (Demo)"};
 const allowed=(action==="Submit"&&record.status==="Draft")||(action==="Review"&&record.status==="For HR Review")||(action==="Return"&&["For HR Review","HR Reviewed"].includes(record.status))||(action==="Handoff"&&record.status==="HR Reviewed");
 if(!allowed)return {ok:false,error:"Invalid or repeated review transition."};
 if((action==="Review"||action==="Handoff")&&record.createdBy===actor)return {ok:false,error:"Maker-checker restriction: the preparer cannot review or hand off their own record."};
 if((action==="Review"||action==="Return"||action==="Handoff")&&reason.trim().length<8)return {ok:false,error:"Provide a review reason/reference of at least 8 characters."};
 if(action==="Review"||action==="Handoff"){
  const errors=finalPayBlockers(state,record);if(errors.length)return {ok:false,error:errors[0]};
 }
 if(action==="Handoff"&&!record.reviewedAt)return {ok:false,error:"Independent HR review is required before Accounting handoff."};
 const target=next[action];
 return {ok:true,record:{...record,status:target,...(action==="Review"?{reviewedBy:actor,reviewedAt:now}:{}),...(action==="Return"?{reviewedBy:undefined,reviewedAt:undefined}:{}),...(action==="Handoff"?{handoffAt:now}:{}),history:[...record.history,event(now,actor,action,record.status,target,reason.trim()||"Submitted for independent HR review")]}};
}

/** Clearance is independently recorded and never creates a payroll deduction. */
export function reviewClearance(state:HRState,record:FinalPayCase,actor:string,role:Role,now:string,status:"In Progress"|"Cleared"|"Outstanding Issues",note:string):FinalPayResult{
 if(!finalPayRole(role)||!actor.trim())return {ok:false,error:"HR authorization required."};
 if(note.trim().length<8)return {ok:false,error:"Record a clearance reference/reason of at least 8 characters."};
 if(record.closedAt)return {ok:false,error:"Separation case is already closed."};
 const issued=outstandingCustody(state,record.employeeId);
 if(status==="Cleared"&&issued.length)return {ok:false,error:"Outstanding assets remain. Mark Outstanding Issues and document follow-up instead."};
 return {ok:true,record:{...record,clearanceStatus:status,clearanceNote:note.trim(),clearanceBy:actor,clearanceAt:now,history:[...record.history,event(now,actor,"Clearance review",record.clearanceStatus||"Pending",status,note.trim())]}};
}
/** Demo-only acknowledgement of external payment evidence. Not an actual Accounting transaction. */
export function noteExternalPayment(record:FinalPayCase,actor:string,role:Role,now:string,reference:string,actualPaymentDate?:string):FinalPayResult{
 if(!finalPayRole(role)||!actor.trim())return {ok:false,error:"HR authorization required."};
 if(record.status!=="Accounting Handoff (Demo)")return {ok:false,error:"Record Accounting handoff first."};
 if(record.createdBy===actor)return {ok:false,error:"Independent reviewer must record the external payment reference."};
 if(reference.trim().length<8)return {ok:false,error:"Provide an external Accounting/payment reference of at least 8 characters."};
 const paid=actualPaymentDate||now.slice(0,10);
 if(!/^\d{4}-\d{2}-\d{2}$/.test(paid)||Number.isNaN(Date.parse(`${paid}T00:00:00Z`))||new Date(`${paid}T00:00:00Z`).toISOString().slice(0,10)!==paid||paid>now.slice(0,10))return {ok:false,error:"Enter the actual (not future) payment date."};
 return {ok:true,record:{...record,status:"Payment Recorded (Demo)",paymentReference:reference.trim(),paymentAt:paid,paymentRecordedAt:now,history:[...record.history,event(now,actor,"External payment reference recorded",record.status,"Payment Recorded (Demo)",reference.trim())]}};
}
export function closeSeparationReview(state:HRState,record:FinalPayCase,actor:string,role:Role,now:string,reference:string):FinalPayResult{
 if(!finalPayRole(role)||!actor.trim())return {ok:false,error:"HR authorization required."};
 if(record.closedAt)return {ok:false,error:"Already closed."};
 const p=state.people.find(x=>x.id===record.employeeId);
 if(!p||p.status!=="Clearance Pending"||p.branch!==record.branch)return {ok:false,error:"Linked employee must still be in the original clearance-pending status."};
 if(record.clearanceStatus!=="Cleared")return {ok:false,error:"Clearance must be independently recorded as Cleared before closing the employee lifecycle."};
 if(record.status!=="Payment Recorded (Demo)"||!record.paymentReference)return {ok:false,error:"Record an external payment reference first; HRMS cannot confirm bank settlement."};
 if(reference.trim().length<8)return {ok:false,error:"Enter a closure reference (8+ characters)."};
 if(outstandingCustody(state,record.employeeId).length)return {ok:false,error:"Assets still assigned to employee."};
 return {ok:true,record:{...record,closedAt:now,closedBy:actor,history:[...record.history,event(now,actor,"Closed separation review","Open","Closed (Demo)",reference.trim())]}};
}
