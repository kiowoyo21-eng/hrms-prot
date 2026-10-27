import {isValidISODate} from "./dateOnly";
export type OpsMonth={id:string;employeeId:string;branch:string;month:string;offDates:string[];status:"Draft"|"Published";version:number;updatedAt:string;updatedBy:string};
export type OpsPermit={id:string;employeeId:string;branch:string;date:string;reason:string;hours:number;status:"Pending"|"Approved"|"Rejected";requestedBy:string;reviewedBy?:string;reviewedAt?:string;createdAt:string;notes?:string};
export const OPS_SCHEDULE_KEY="uc-hr-ops-rest-days-v1";
export const OPS_PERMIT_KEY="uc-hr-ops-permits-v1";
export const OPS_SCHEDULE_HISTORY_KEY="uc-hr-ops-rest-day-revisions-v1";
export type OpsScheduleRevision=OpsMonth&{archivedAt:string};
export const validIsoDate=isValidISODate;
export const permittedOff=(day:string)=>validIsoDate(day)&&[1,2,3,4].includes(new Date(`${day}T00:00:00Z`).getUTCDay());
export function validateOpsMonth(month:string,dates:string[]):string[]{
 const warnings:string[]=[];if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(month))warnings.push("Invalid month");
 for(const date of dates){if(!validIsoDate(date)||!date.startsWith(month))warnings.push(`${date}: outside the month`);else if(!permittedOff(date))warnings.push(`${date}: Friday–Sunday cannot be an OPS scheduled OFF`)}
 if(new Set(dates).size!==dates.length)warnings.push("Duplicate OFF dates");
 const end=new Date(`${month}-01T12:00:00`);end.setMonth(end.getMonth()+1);end.setDate(0);
 // Check only complete Monday–Sunday weeks within this month; boundary weeks
 // require neighboring published schedules and are flagged for manual review.
 const countDays=end.getDate();
 for(let start=1;start<=countDays;start++){
  const first=`${month}-${String(start).padStart(2,"0")}`;
  if(new Date(first+"T12:00:00").getDay()!==1)continue;
  if(start+6>countDays)continue;
  const week=Array.from({length:7},(_,i)=>`${month}-${String(start+i).padStart(2,"0")}`);
  if(!week.some(d=>dates.includes(d)))warnings.push(`No scheduled OFF in Monday–Sunday week starting ${first}`);
 }
 return warnings;
}
/** Prevent removing a published OFF while a live work-permit case relies on it. */
export function opsScheduleChangeIssues(previous:OpsMonth|undefined,nextDates:string[],permits:OpsPermit[]):string[]{
 if(!previous||previous.status!=="Published")return [];
 const removed=previous.offDates.filter(day=>!nextDates.includes(day));
 return removed.filter(day=>permits.some(p=>p.employeeId===previous.employeeId&&p.branch===previous.branch&&p.date===day&&(p.status==="Pending"||p.status==="Approved")))
  .map(day=>`${day}: existing pending/approved work permit must be resolved by HR before removing the OFF`);
}
export function opsDayClassification(employeeId:string,date:string,schedules:OpsMonth[],permits:OpsPermit[]){
 const schedule=schedules.find(s=>s.employeeId===employeeId&&s.month===date.slice(0,7)&&s.status==="Published");
 if(!schedule)return {kind:"Missing Schedule" as const,permit:null};
 if(!schedule.offDates.includes(date))return {kind:"Working Day" as const,permit:null};
 const permit=permits.find(p=>p.employeeId===employeeId&&p.date===date&&p.status==="Approved")||null;
 return {kind:permit?"Approved Rest Day Work" as const:"Scheduled OFF" as const,permit};
}

export type OpsAttendanceException={employeeId:string;date:string;issue:string};
export function reviewOpsAttendance(rows:{employeeId:string;date:string;status:string;workedHours:number}[],schedules:OpsMonth[],permits:OpsPermit[],opsIds:Set<string>):OpsAttendanceException[]{
 const exceptions:OpsAttendanceException[]=[];
 for(const row of rows){
  if(!opsIds.has(row.employeeId))continue;
  const classification=opsDayClassification(row.employeeId,row.date,schedules,permits);
  const worked=row.workedHours>0||row.status==="Present";
  if(classification.kind==="Missing Schedule")exceptions.push({employeeId:row.employeeId,date:row.date,issue:"Missing published OPS OFF schedule"});
  else if(classification.kind==="Scheduled OFF"&&worked)exceptions.push({employeeId:row.employeeId,date:row.date,issue:"Worked on OFF without approved BM permit"});
  else if(classification.kind==="Approved Rest Day Work"&&!worked)exceptions.push({employeeId:row.employeeId,date:row.date,issue:"Approved permit without verified work hours"});
  else if(classification.kind==="Approved Rest Day Work"&&classification.permit&&row.workedHours>classification.permit.hours)exceptions.push({employeeId:row.employeeId,date:row.date,issue:"Actual hours exceed approved permit hours"});
 }
 return exceptions;
}
