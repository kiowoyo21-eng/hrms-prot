import type {IncidentCase} from "./incidentRecords";
import {isValidISODate} from "./dateOnly";
import type {AttendanceRecord,ImportedAttendanceRow} from "./payrollConfig";

export type IncidentAlertPolicy={windowDays:number;secondThreshold:number;thirdThreshold:number};
export const DEFAULT_INCIDENT_POLICY:IncidentAlertPolicy={windowDays:30,secondThreshold:2,thirdThreshold:3};
export type IncidentEscalation={id:string;employeeId:string;branch:string;category:string;occurrences:number;dates:string[];caseIds:string[];severity:"Review"|"High"|"Grave";title:string;detail:string};
export type IncidentEscalationReview={id:string;reviewedBy:string;reviewedAt:string;action:"Counseling Review"|"Investigate Further"|"No Action Now";reason:string};

export const validIncidentDate=isValidISODate;
const dayDiff=(newer:string,older:string)=>Math.floor((Date.parse(`${newer}T00:00:00Z`)-Date.parse(`${older}T00:00:00Z`))/86400000);
export function normalizeIncidentPolicy(policy?:Partial<IncidentAlertPolicy>):IncidentAlertPolicy{
 const days=Number(policy?.windowDays);
 return {windowDays:[30,60,90].includes(days)?days:30,secondThreshold:2,thirdThreshold:3};
}
export function isRecentIncidentDate(date:string,today:string,days:number){return validIncidentDate(date)&&validIncidentDate(today)&&dayDiff(today,date)>=0&&dayDiff(today,date)<days;}
/** Allegations NEVER qualify as confirmed repeat violations. Only verified attendance or an explicit HR finding qualifies. */
export function buildIncidentEscalations({cases,attendance,attendanceBatches,people,today,policy=DEFAULT_INCIDENT_POLICY}:{
 cases:readonly IncidentCase[];attendance:readonly ImportedAttendanceRow[];attendanceBatches:readonly AttendanceRecord[];
 people:readonly {id:string;name:string;branch:string}[];today:string;policy?:IncidentAlertPolicy;
}):IncidentEscalation[]{
 const rules=normalizeIncidentPolicy(policy);
 const employeeById=new Map(people.map(p=>[p.id,p]));
 const groups=new Map<string,{dates:Set<string>;caseIds:Set<string>;employeeId:string;branch:string;category:string}>();
 const add=(id:string,branch:string,category:string,date:string,caseId?:string)=>{
  const person=employeeById.get(id);if(!person||person.branch!==branch||!isRecentIncidentDate(date,today,rules.windowDays))return;
  const key=`${id}|${category}`,g=groups.get(key)||{dates:new Set<string>(),caseIds:new Set<string>(),employeeId:id,branch,category};
  g.dates.add(date);if(caseId)g.caseIds.add(caseId);groups.set(key,g);
 };
 for(const row of attendance){
  if(row.lateMinutes<=0||row.status!=="Present")continue;
  const verified=attendanceBatches.some(b=>b.status==="Verified"&&b.branch===row.branch&&row.date>=b.periodStart&&row.date<=b.periodEnd);
  if(verified)add(row.employeeId,row.branch,"Lateness",row.date);
 }
 for(const c of cases){
  if(!c.respondentEmployeeId)continue;
  if(c.findingStatus==="Substantiated"&&c.incidentDate)add(c.respondentEmployeeId,c.branch,c.category||"Other Policy Violation",c.incidentDate,c.id);
 }
 const alerts:IncidentEscalation[]=[];
 for(const g of groups.values()){
  const count=g.dates.size;if(count<rules.secondThreshold)continue;
  const severity=count>=rules.thirdThreshold?"High" as const:"Review" as const;
  const name=employeeById.get(g.employeeId)?.name||g.employeeId;
  alerts.push({id:`habit-${g.employeeId}-${g.category}-${severity}-${[...g.dates].sort().at(-1)}`,employeeId:g.employeeId,branch:g.branch,category:g.category,occurrences:count,dates:[...g.dates].sort(),caseIds:[...g.caseIds],severity,title:`${severity==="High"?"Repeated violation — urgent HR review":"Repeated pattern — HR review"}: ${name}`,detail:`${g.category} · ${count} verified distinct dates in ${rules.windowDays} days · Determine whether counseling is warranted`});
 }
 for(const c of cases){
  if(c.priority!=="Critical"||c.stage==="Closed"||!c.respondentEmployeeId)continue;
  if(c.findingStatus==="Dismissed")continue;
  const person=employeeById.get(c.respondentEmployeeId);if(!person||person.branch!==c.branch)continue;
  alerts.push({id:`grave-${c.id}`,employeeId:c.respondentEmployeeId,branch:c.branch,category:c.category||"Serious / Grave",occurrences:1,dates:c.incidentDate?[c.incidentDate]:[],caseIds:[c.id],severity:"Grave",title:`Immediate confidential HR screening: ${person.name}`,detail:`${c.id} · Serious allegation (not a disciplinary finding); review promptly`});
 }
 return alerts.sort((a,b)=>(b.severity==="Grave"?3:b.severity==="High"?2:1)-(a.severity==="Grave"?3:a.severity==="High"?2:1)||a.employeeId.localeCompare(b.employeeId));
}
