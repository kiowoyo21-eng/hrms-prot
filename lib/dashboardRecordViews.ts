/** Dashboard drill-down models. Rows are derived from the same selectors as the displayed totals. */
import type {HRState,HRPerson} from "./hrState";
import type {HRFormRecord} from "./hrForms";
import type {IncidentCase} from "./incidentRecords";
import type {Branch,Role} from "./mock";
import {dashboardEmployeeRecords,dashboardRequestRecords} from "./dashboardAnalytics";

export type DashboardRecord={id:string;cells:string[];details?:Array<[string,string]>};
export type DashboardRecordView={title:string;scope:string;columns:string[];rows:DashboardRecord[];note?:string;total?:string};
export type WorkforceKey="Total employees"|"Male"|"Female"|"Hired this year"|"Separated this year"|"Gross salary released";
export type RequestKey="Requests"|"Incident reports"|"Pending / open"|"Resolved / closed"|"My pending"|"My resolved"|"For my review"|"Reviewed";
export type ExtraKey="Employment Status"|"Basic Pay Rates"|"Compliance";

const fmtMoney=(n:number)=>new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP"}).format(n);
const general=(p:HRPerson):DashboardRecord=>({id:p.id,cells:[p.name,p.id,p.branch,p.position,p.status],details:[["Full name",p.name],["Employee ID",p.id],["Branch",p.branch],["Department",p.department],["Position",p.position],["Employment status",p.status],["Gender",p.gender],["Hire date",p.hire||"Not recorded"],["Email",p.email||"Not recorded"],["Contact number",p.phone||"Not recorded"],["Job level",p.jobLevel||"Not recorded"],["Arrangement",p.employmentArrangement||"Not recorded"]]});
const scope=(branch:Branch,period?:string)=>`${branch}${period?` · ${period}`:""}`;
const employeeColumns=["Employee","ID","Branch","Position","Status"];
const iso=(date:string)=>date?.slice(0,10)||"Not recorded";
export function workforceRecordView(state:HRState,branch:Branch,day:string,key:WorkforceKey):DashboardRecordView{
 const d=dashboardEmployeeRecords(state,branch,day);
 const period=`Jan 1 – ${day}`;
 const base={title:key,scope:scope(branch,key==="Total employees"||key==="Male"||key==="Female"?"Current Employee 201 records":period),columns:employeeColumns};
 if(key==="Total employees"||key==="Male"||key==="Female"||key==="Hired this year"){
  const rows=key==="Hired this year"?d.hireRecords:key==="Male"?d.people.filter(p=>p.gender==="Male"):key==="Female"?d.people.filter(p=>p.gender==="Female"):d.people;
  return {...base,rows:rows.map(general),total:`${rows.length} employee(s)`,note:key==="Hired this year"?"Hire dates in Employee 201; employees no longer present in the current directory cannot be reconstructed.":"Current Employee 201 directory; employee status is shown as recorded."};
 }
 if(key==="Separated this year")return {title:key,scope:scope(branch,period),columns:["Employee ID","Previous branch","Position","Effective date","Reason"],rows:d.exitRecords.map(c=>({id:c.id,cells:[c.employeeId,c.sourceBranch,c.snapshot.position,c.effectiveDate,c.separationType||"Not recorded"],details:[["Case ID",c.id],["Employee ID",c.employeeId],["Previous branch",c.sourceBranch],["Previous department",c.snapshot.department],["Position",c.snapshot.position],["Separation type",c.separationType||"Not recorded"],["Effective date",c.effectiveDate],["Decision",c.status],["Submitted by",c.submittedBy],["Reason/reference",c.reason||"Not recorded"]]})),total:`${d.exitRecords.length} applied offboarding case(s)`,note:"Applied offboarding workflow cases, not inferred departures or unapproved requests."};
 return {title:key,scope:scope(branch,period),columns:["Release ID","Employee","Cutoff end","Released","Gross"],rows:d.salaryReleases.map(r=>{const p=d.people.find(person=>person.id===r.employeeId);return {id:r.id,cells:[r.id,p?.name||r.employeeId,r.periodEnd,r.paidAt,fmtMoney(r.gross)],details:[["Release ID",r.id],["Employee",p?.name||r.employeeId],["Employee ID",r.employeeId],["Branch",p?.branch||"Not recorded"],["Period",`${r.periodStart} – ${r.periodEnd}`],["Release date",r.paidAt],["Gross",fmtMoney(r.gross)],["Deductions",fmtMoney(r.deductions)],["Net",fmtMoney(r.net)],["Review source",r.source],["Status",r.status]]};}),total:fmtMoney(d.salaryGross),note:`Only released, browser-reviewed salary entries for employees in the selected current branch. ${d.sampleReleasesExcluded} eligible sample release(s) excluded. Browser-local records, not Accounting-certified expense.`};
}
const formRow=(f:HRFormRecord):DashboardRecord=>({id:`form-${f.id}`,cells:[f.id,"HR Request",f.branch,f.requestor,f.status],details:[["Reference",f.id],["Form type",f.kind],["Branch",f.branch],["Requestor",f.requestor],["Employee ID",f.employeeId||"Not recorded"],["Created",f.createdAt],["Updated",f.updatedAt],["Status",f.status],["Reviewed by",f.reviewedBy||"Not recorded"],["Review notes",f.remarks||"Not recorded"],["Evidence references",f.evidenceRefs||"Not recorded"],...Object.entries(f.fields||{}).map(([key,value])=>[key,value] as [string,string]),...(f.history||[]).map(event=>[`${event.at} · ${event.actor}`,`${event.action}: ${event.status}`] as [string,string])]});
const incidentRow=(c:IncidentCase):DashboardRecord=>({id:`incident-${c.id}`,cells:[c.id,"Incident Report",c.branch,c.reporter,c.stage],details:[["Reference",c.id],["Branch",c.branch],["Reporter",c.reporter],["Respondent",c.respondent],["Stage",c.stage],["Priority",c.priority],["Handler",c.handler],["Summary",c.summary],["Description",c.description],["Target",c.target],["Closure",c.closedAt||"Not recorded"],["Notes",c.notes||"Not recorded"],["Outcome",c.outcome||"Not recorded"],["Decision",c.decision||"Not recorded"],["Written explanation",c.explanation||"Not recorded"],["Evidence notes",c.evidenceNotes||"Not recorded"],["Mediation",c.mediation||"Not recorded"],["Closure summary",c.closureSummary||"Not recorded"],...(c.attachments||[]).map(a=>[`${a.category} attachment`,a.name] as [string,string]),...(c.history||[]).map((h,i)=>[`History ${i+1}`,h] as [string,string]),...(c.actionLog||[]).map(a=>[`${a.at} · ${a.actor}`,`${a.action}: ${a.detail}`] as [string,string])]});
export function requestRecordView(forms:readonly HRFormRecord[],incidents:readonly IncidentCase[],branch:Branch,role:Role,username:string,key:RequestKey):DashboardRecordView{
 const d=dashboardRequestRecords(forms,incidents,branch,role,username);
 let formsShown:readonly HRFormRecord[]=[];let incidentsShown:readonly IncidentCase[]=[];
 switch(key){
  case "Requests":formsShown=d.forms;break;
  case "Incident reports":incidentsShown=d.incidents;break;
  case "Pending / open":formsShown=d.pendingForms;incidentsShown=d.pendingIncidents;break;
  case "Resolved / closed":formsShown=d.resolvedForms;incidentsShown=d.resolvedIncidents;break;
  case "My pending":formsShown=d.mine.filter(f=>f.status==="Submitted"||f.status==="Returned for Revision");break;
  case "My resolved":formsShown=d.mine.filter(f=>f.status==="Approved (Documentation Only)"||f.status==="Rejected");break;
  case "For my review":formsShown=role==="BM"?[]:d.forms.filter(f=>f.status==="Submitted"&&f.requestor!==username);break;
  case "Reviewed":formsShown=role==="BM"?[]:d.forms.filter(f=>f.reviewedBy===username&&["Approved (Documentation Only)","Rejected","Returned for Revision"].includes(f.status));break;
 }
 const result=[...formsShown.map(formRow),...incidentsShown.map(incidentRow)];
 return {title:key,scope:scope(branch,"Visible requests and incidents"),columns:["Reference","Type","Branch","Requestor / Reporter","Status"],rows:result,total:`${result.length} recorded item(s)`,note:"Only records visible to your current role and selected branch. Selecting a record expands its recorded details; HR review is documentation-only in this prototype."};
}
export function reportRecordView(state:HRState,branch:Branch,key:ExtraKey):DashboardRecordView{
 const people=state.people.filter(p=>branch==="All Shops"||p.branch===branch);
 if(key==="Employment Status")return {title:key,scope:scope(branch,"Current Employee 201 records"),columns:employeeColumns,rows:people.map(general),total:`${people.filter(p=>p.status==="Regular").length} Regular · ${people.filter(p=>p.status==="Probationary").length} Probationary`,note:"All recorded statuses shown; summary card highlights Regular and Probationary."};
 if(key==="Basic Pay Rates")return {title:key,scope:scope(branch,"Employee 201 configured basic rates"),columns:["Employee","ID","Branch","Pay basis","Basic rate"],rows:people.map(p=>({id:p.id,cells:[p.name,p.id,p.branch,p.salaryType,fmtMoney(p.rate)],details:[["Employee",p.name],["ID",p.id],["Position",p.position],["Department",p.department],["Branch",p.branch],["Configured salary type",p.salaryType],["Configured basic rate",fmtMoney(p.rate)]]})),total:`${fmtMoney(people.filter(p=>p.salaryType==="Monthly").reduce((v,p)=>v+p.rate,0))} monthly base sum · ${fmtMoney(people.filter(p=>p.salaryType==="Daily").reduce((v,p)=>v+p.rate,0))} daily base sum`,note:"These amounts are configured basic rates, not released payroll. Daily and monthly figures are separate units and should not be combined."};
 return {title:key,scope:scope(branch,"Government identifier record presence"),columns:["Employee","ID","Branch","Recorded IDs","Missing IDs"],rows:people.map(p=>{const identifiers=[p.sssNumber,p.philhealthNumber,p.pagibigNumber,p.tinNumber];const recorded=identifiers.filter(v=>!!v?.trim()).length;return {id:p.id,cells:[p.name,p.id,p.branch,String(recorded),String(4-recorded)],details:[["Employee",p.name],["Branch",p.branch],["SSS",p.sssNumber?.trim()?"Recorded (masked)":"Not recorded"],["PhilHealth",p.philhealthNumber?.trim()?"Recorded (masked)":"Not recorded"],["Pag-IBIG",p.pagibigNumber?.trim()?"Recorded (masked)":"Not recorded"],["TIN",p.tinNumber?.trim()?"Recorded (masked)":"Not recorded"]]}}),total:`${people.length} employee record(s)`,note:"Presence of recorded identifiers only. This does not verify government contributions, statutory compliance or real identifier validity; values are never displayed."};
}
