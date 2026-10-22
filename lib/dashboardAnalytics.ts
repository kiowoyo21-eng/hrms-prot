/** Source-aware, branch-scoped frontend dashboard summaries. No inferred pay or invented exits. */
import type {HRState} from "./hrState";
import type {HRFormRecord} from "./hrForms";
import type {IncidentCase} from "./incidentRecords";
import type {Branch,Role} from "./mock";

export function lastCompletedMonth(now=new Date()){
 const local=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Manila",year:"numeric",month:"2-digit"}).formatToParts(now);
 const year=Number(local.find(p=>p.type==="year")?.value),month=Number(local.find(p=>p.type==="month")?.value);
 const d=new Date(Date.UTC(year,month-2,1));
 return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,"0")}`;
}
const inBranch=(record:{branch:string},branch:Branch)=>branch==="All Shops"||record.branch===branch;
const validMoney=(n:number)=>Number.isFinite(n)&&n>=0;
/** Calendar date in Manila, not UTC or the operator's browser time zone. */
export function dashboardTodayPH(now=new Date()){
 const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Manila",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(now);
 const part=(key:"year"|"month"|"day")=>parts.find(p=>p.type===key)?.value||"";
 return `${part("year")}-${part("month")}-${part("day")}`;
}
const recordedOnOrBefore=(date:string,start:string,end:string)=>/^\d{4}-\d{2}-\d{2}/.test(date)&&date.slice(0,10)>=start&&date.slice(0,10)<=end;
/**
 * Current headcount + actual year-to-date recorded movements and payroll releases.
 * "Separated" is based on applied Offboard cases, not an assumed status change.
 * Salary totals count only browser-reviewed, released Salary entries; never basic-pay estimates.
 */
export function dashboardEmployeeSummary(state:HRState,branch:Branch,asOf:string){
 const today=/^\d{4}-\d{2}-\d{2}$/.test(asOf)?asOf:dashboardTodayPH();
 const start=`${today.slice(0,4)}-01-01`;
 const people=state.people.filter(p=>inBranch(p,branch));
 const ids=new Set(people.map(p=>p.id));
 const hires=people.filter(p=>recordedOnOrBefore(p.hire,start,today));
 const byPosition=new Map<string,{position:string;gained:number;lost:number;terminations:number}>();
 const add=(position:string,key:"gained"|"lost",terminated=false)=>{const safe=position.trim()||"Not recorded";const row=byPosition.get(safe)||{position:safe,gained:0,lost:0,terminations:0};row[key]++;if(terminated)row.terminations++;byPosition.set(safe,row)};
 hires.forEach(p=>add(p.position,"gained"));
 // A separated employee may no longer be present in people; the recorded source branch is authoritative.
 const exits=(state.lifecycleCases||[]).filter(c=>c.action==="Offboard"&&c.status==="Applied (Demo)"&&recordedOnOrBefore(c.effectiveDate,start,today)&&(branch==="All Shops"||c.sourceBranch===branch));
 exits.forEach(c=>add(c.snapshot.position,"lost",c.separationType==="Termination"));
 const uniqueReleases=new Map<string,(typeof state.payrollReleases)[number]>();
 for(const r of state.payrollReleases){if(!uniqueReleases.has(r.id))uniqueReleases.set(r.id,r);}
 const eligible=[...uniqueReleases.values()].filter(r=>r.status==="Released"&&r.kind==="Salary"&&recordedOnOrBefore(r.paidAt,start,today)&&ids.has(r.employeeId));
 const salaryReleases=eligible.filter(r=>r.source==="Browser Review"&&validMoney(r.gross));
 const sampleReleasesExcluded=eligible.filter(r=>r.source==="Sample").length;
 return {total:people.length,male:people.filter(p=>p.gender==="Male").length,female:people.filter(p=>p.gender==="Female").length,unspecified:people.filter(p=>p.gender!=="Male"&&p.gender!=="Female").length,hires:hires.length,exits:exits.length,terminations:exits.filter(c=>c.separationType==="Termination").length,positions:[...byPosition.values()].sort((a,b)=>b.gained+b.lost-(a.gained+a.lost)||a.position.localeCompare(b.position)),salaryGross:salaryReleases.reduce((v,r)=>v+r.gross,0),salaryCount:salaryReleases.length,sampleReleasesExcluded};
}
export function dashboardRequestSummary(forms:readonly HRFormRecord[],incidents:readonly IncidentCase[],branch:Branch,role:Role,username:string){
 const visibleForms=forms.filter(f=>inBranch(f,branch)&&(role!=="BM"||(f.branch==="UC Mandaluyong"&&f.requestor===username)));
 const visibleIncidents=incidents.filter(c=>inBranch(c,branch)&&(role!=="BM"||(c.handler==="BM"&&!c.respondentIsBM)));
 const pendingForms=visibleForms.filter(f=>f.status==="Submitted"||f.status==="Returned for Revision");
 const resolvedForms=visibleForms.filter(f=>f.status==="Approved (Documentation Only)"||f.status==="Rejected");
 const pendingIncidents=visibleIncidents.filter(c=>c.stage!=="Closed");
 const resolvedIncidents=visibleIncidents.filter(c=>c.stage==="Closed");
 const mine=visibleForms.filter(f=>f.requestor===username);
 const reviewer=role!=="BM";
 const toReview=reviewer?visibleForms.filter(f=>f.status==="Submitted"&&f.requestor!==username).length:0;
 const completedReviews=reviewer?visibleForms.filter(f=>f.reviewedBy===username&&(f.status==="Approved (Documentation Only)"||f.status==="Rejected"||f.status==="Returned for Revision")).length:0;
 return {totalRequests:visibleForms.length,totalReports:visibleIncidents.length,pending:pendingForms.length+pendingIncidents.length,resolved:resolvedForms.length+resolvedIncidents.length,drafts:visibleForms.filter(f=>f.status==="Draft").length,ownPending:mine.filter(f=>f.status==="Submitted"||f.status==="Returned for Revision").length,ownCompleted:mine.filter(f=>f.status==="Approved (Documentation Only)"||f.status==="Rejected").length,toReview,completedReviews};
}
