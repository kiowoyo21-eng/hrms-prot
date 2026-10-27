/** Probationary assessment and decision workflow. Frontend-only review records.
 * These reminders do not determine statutory probation, eligibility or automatic separation.
 */
import type {HRPerson,HRState} from './hrState';
import {isValidISODate} from './dateOnly';


export type ProbationStage = 1 | 3 | 5;
export type ProbationDecision = 'Regularize' | 'Do Not Regularize' | 'Pending Review';
export type ProbationAssessment = {
 id:string;employeeId:string;stage:ProbationStage;dueDate:string;status:'Submitted'|'HR Reviewed';
 submittedBy:string;submittedAt:string;score:number;strengths:string;improvements:string;recommendation:string;
 evidenceReference:string;reviewedBy?:string;reviewedAt?:string;hrReviewNotes?:string;
 decision?:ProbationDecision;qualificationStandardsReference?:string;noticeReference?:string;
};
const stages:readonly ProbationStage[]=[1,3,5];
export function monthAnniversary(date:string,months:number):string{
 if(!isValidISODate(date)||!Number.isInteger(months)||months<0||months>120)throw Error('Invalid anniversary date');
 const [y,m,d]=date.split('-').map(Number);
 const target=new Date(Date.UTC(y,m-1+months,1));
 const last=new Date(Date.UTC(target.getUTCFullYear(),target.getUTCMonth()+1,0)).getUTCDate();
 target.setUTCDate(Math.min(d,last));return target.toISOString().slice(0,10);
}
export function daysUntil(date:string,today:string):number{
 if(!isValidISODate(date)||!isValidISODate(today))throw Error('Invalid calendar date');
 return Math.round((Date.parse(date+'T00:00:00Z')-Date.parse(today+'T00:00:00Z'))/86400000);
}
export function probationStages(person:HRPerson){
 if(person.status!=='Probationary'||!isValidISODate(person.hire))return [];
 return stages.map(stage=>({stage,dueDate:monthAnniversary(person.hire,stage)}));
}
export function probationDueState(person:HRPerson,stage:ProbationStage,records:ProbationAssessment[],today:string){
 const due=monthAnniversary(person.hire,stage);const remaining=daysUntil(due,today);
 const review=records.find(r=>r.employeeId===person.id&&r.stage===stage);
 const completed=Boolean(review?.status==='HR Reviewed'&&(stage!==5||(review?.decision&&review.decision!=='Pending Review')));
 const state=completed?'Completed':remaining<0?'Overdue':remaining===0?'Due Today':remaining<=7?'Due Soon':'Scheduled';
 return {due,remaining,review,state};
}
export function probationDeadline(person:HRPerson){return monthAnniversary(person.hire,Math.min(Math.max(Number.isFinite(person.probation)?person.probation:6,1),6));}
export function probationFinalDecision(state:Pick<HRState,'probationAssessments'>,employeeId:string){
 return (state.probationAssessments||[]).find(r=>r.employeeId===employeeId&&r.stage===5&&r.status==='HR Reviewed'&&r.decision==='Regularize');
}
const hrRoles=['HR','Super Admin','Special Final Approver — Ms Kate'];
export function submitProbationAssessment(state:HRState,input:Omit<ProbationAssessment,'id'|'status'|'submittedAt'|'reviewedBy'|'reviewedAt'|'hrReviewNotes'|'decision'|'noticeReference'|'qualificationStandardsReference'>,role:string,actor:string,now:string,id:string,assignedBranch?:string):{state:HRState}|{error:string}{
 const person=state.people.find(p=>p.id===input.employeeId);
 if(!person||person.status!=='Probationary')return {error:'Select a currently probationary employee.'};
 if(!hrRoles.includes(role)&&role!=='BM')return {error:'Not authorized to submit assessments.'};
 if(role==='BM'&&(!assignedBranch||assignedBranch==='All Shops'||person.branch!==assignedBranch))return {error:'Branch Manager account cannot assess employees outside its assigned branch.'};
 if(!stages.includes(input.stage))return {error:'Invalid probationary assessment stage.'};
 if(input.dueDate!==monthAnniversary(person.hire,input.stage))return {error:'Assessment schedule does not match the recorded hire date.'};
 if((state.probationAssessments||[]).some(r=>r.employeeId===person.id&&r.stage===input.stage))return {error:'This assessment stage is already submitted. HR must review the existing record.'};
 if(!Number.isInteger(input.score)||input.score<1||input.score>5)return {error:'Enter a performance score from 1 to 5.'};
 if(input.strengths.trim().length<10||input.improvements.trim().length<10||input.recommendation.trim().length<10||input.evidenceReference.trim().length<5)return {error:'Complete strengths, development notes, recommendation and evidence reference.'};
 const record:ProbationAssessment={...input,submittedBy:actor,score:input.score,strengths:input.strengths.trim(),improvements:input.improvements.trim(),recommendation:input.recommendation.trim(),evidenceReference:input.evidenceReference.trim(),id,status:'Submitted',submittedAt:now};
 return {state:{...state,probationAssessments:[...(state.probationAssessments||[]),record]}};
}
export function reviewProbationAssessment(state:HRState,id:string,role:string,actor:string,now:string,notes:string,decision?:ProbationDecision,standardsRef?:string,noticeRef?:string):{state:HRState}|{error:string}{
 if(!hrRoles.includes(role))return {error:'Only authorized HR roles can verify probation assessments.'};
 const record=(state.probationAssessments||[]).find(r=>r.id===id);
 if(!record||record.status!=='Submitted')return {error:'Submitted assessment not found or already reviewed.'};
 if(record.submittedBy===actor)return {error:'Assessment submission and HR verification require different reviewers.'};
 if(notes.trim().length<10)return {error:'Enter HR review findings of at least 10 characters.'};
 const person=state.people.find(p=>p.id===record.employeeId);
 if(!person||person.status!=='Probationary')return {error:'Employee status changed. Reconcile Employee 201 first.'};
 if(record.stage===5){
  if(!decision)return {error:'Choose a fifth-month decision or Pending Review.'};
  if(!standardsRef?.trim()||standardsRef.trim().length<5)return {error:'Record evidence that qualification standards were communicated at engagement.'};
  if(decision==='Do Not Regularize'&&(!noticeRef||noticeRef.trim().length<5))return {error:'Record the lawful notice/process evidence before confirming non-regularization.'};
 }
 const updated:ProbationAssessment={...record,status:'HR Reviewed',reviewedBy:actor,reviewedAt:now,hrReviewNotes:notes.trim(),...(record.stage===5?{decision,qualificationStandardsReference:standardsRef?.trim(),noticeReference:noticeRef?.trim()}: {})};
 return {state:{...state,probationAssessments:(state.probationAssessments||[]).map(r=>r.id===id?updated:r)}};
}

/** An HR reviewer can resolve a fifth-month Pending Review without overwriting the previous assessment. */
export function resolvePendingProbationDecision(state:HRState,id:string,role:string,actor:string,now:string,decision:Exclude<ProbationDecision,'Pending Review'>,reviewNotes:string,noticeRef?:string):{state:HRState}|{error:string}{
 if(!hrRoles.includes(role))return {error:'Only authorized HR users can finalize a pending probation decision.'};
 const rec=(state.probationAssessments||[]).find(r=>r.id===id);
 if(!rec||rec.stage!==5||rec.status!=='HR Reviewed'||rec.decision!=='Pending Review')return {error:'Only an existing pending fifth-month decision can be resolved.'};
 if(!['Regularize','Do Not Regularize'].includes(decision))return {error:'Choose a final decision.'};
 const person=state.people.find(p=>p.id===rec.employeeId);
 if(!person||person.status!=='Probationary')return {error:'Employment status changed. Reconcile the employee record first.'};
 if(reviewNotes.trim().length<10)return {error:'Record the HR decision reasons (at least 10 characters).'};
 if(decision==='Do Not Regularize'&&(!noticeRef||noticeRef.trim().length<5))return {error:'Record required legal notice / process reference.'};
 const next:ProbationAssessment={...rec,decision,reviewedBy:actor,reviewedAt:now,hrReviewNotes:`${rec.hrReviewNotes||''} | Final resolution: ${reviewNotes.trim()}`,noticeReference:noticeRef?.trim()||rec.noticeReference};
 return {state:{...state,probationAssessments:(state.probationAssessments||[]).map(r=>r.id===id?next:r)}};
}
