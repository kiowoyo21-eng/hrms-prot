/** Leave entitlement and staffing checks for the frontend HRMS review workspace.
 * Company policy: 5 new paid-leave days annually; managerial employees on hire,
 * covered non-managerial employees on completing one year. Historical balances
 * need HR reconciliation before production payroll/final-pay conversion.
 */
import type {HRPerson} from "./hrState";
import {isValidISODate} from "./dateOnly";

export type LeaveRecordForBalance={id:number;employeeId?:string;employee:string;branch:string;type:string;from:string;to:string;days:number;status:string};
export type CreditForBalance={id:string;employeeId:string;days:number;effectiveDate:string;status:string};
export type LeaveConversionForBalance={id:string;employeeId:string;days:number;effectiveDate:string;status:string;paymentReference?:string};
export const ANNUAL_LEAVE_DAYS=5;
export const PAID_LEAVE_TYPES=["SIL","VIL","Company Sick Leave","Company Paid Leave","Other Paid Leave"] as const;
export const paidLeave=(type:string)=>PAID_LEAVE_TYPES.some(t=>t===type);
export const opsDepartment=(value:string)=>["ops","operations"].includes(value.trim().toLowerCase());
export const validDate=isValidISODate;
const iso=(year:number,month:number,day:number)=>{
 const last=new Date(Date.UTC(year,month,0)).getUTCDate();
 return `${year}-${String(month).padStart(2,"0")}-${String(Math.min(last,day)).padStart(2,"0")}`;
};
/** Managerial classification should normally be verified in Employee 201.
 * The position-name fallback is solely for old demo records without jobLevel. */
export function companyManager(p:Pick<HRPerson,"jobLevel"|"position">){
 return p.jobLevel==="Managerial"||(p.jobLevel===undefined||p.jobLevel==="Not recorded")&&/\b(manager|general manager|branch manager)\b/i.test(p.position);
}
export function annualGrantDates(employee:Pick<HRPerson,"hire"|"jobLevel"|"position">,through:string):string[]{
 if(!validDate(employee.hire)||!validDate(through)||employee.hire>through)return [];
 const [startYear,month,day]=employee.hire.split("-").map(Number);
 const first=companyManager(employee)?0:1;
 const dates:string[]=[];
 for(let n=first;n<=250;n++){
  const date=iso(startYear+n,month,day);
  if(date>through)break;
  dates.push(date);
 }
 return dates;
}
export const sameEmployee=(p:Pick<HRPerson,"id"|"name"|"branch">,r:Pick<LeaveRecordForBalance,"employeeId"|"employee"|"branch">)=>
 r.branch===p.branch&&(r.employeeId? r.employeeId===p.id : r.employee.trim().toLowerCase()===p.name.trim().toLowerCase());
export function verifiedOpeningBalance(p:Pick<HRPerson,"timeline">):{asOf:string;days:number}|null{
 const candidates=p.timeline.flatMap(text=>{
  const match=text.match(/^(\d{4}-\d{2}-\d{2}) · Verified opening leave allocations: SIL (\d+(?:\.\d+)?), VIL (\d+(?:\.\d+)?); source /);
  return match&&validDate(match[1])?[{asOf:match[1],days:Number(match[2])+Number(match[3])}]:[];
 });
 return candidates.sort((a,b)=>b.asOf.localeCompare(a.asOf))[0]||null;
}
export function leaveBalance(p:HRPerson,records:readonly LeaveRecordForBalance[],credits:readonly CreditForBalance[],asOf:string,conversions:readonly LeaveConversionForBalance[]=[]){
 const opening=verifiedOpeningBalance(p);
 const openingValid=opening&&opening.asOf<=asOf;
 // Opening balance is a snapshot; grants and usage before snapshot are excluded.
 const grantDates=annualGrantDates(p,asOf).filter(date=>!openingValid||date>opening!.asOf);
 const annual=grantDates.length*ANNUAL_LEAVE_DAYS;
 const adjustments=credits.filter(c=>c.employeeId===p.id&&c.status==="Approved"&&c.effectiveDate<=asOf&&(!openingValid||c.effectiveDate>opening!.asOf)).reduce((total,c)=>total+c.days,0);
 const used=records.filter(l=>l.status==="Approved"&&paidLeave(l.type)&&sameEmployee(p,l)&&l.from<=asOf&&(!openingValid||l.from>opening!.asOf)).reduce((total,l)=>total+l.days,0);
 const converted=conversions.filter(c=>c.employeeId===p.id&&c.status==="Released"&&c.effectiveDate<=asOf&&(!openingValid||c.effectiveDate>opening!.asOf)).reduce((total,c)=>total+c.days,0);
 const openingDays=openingValid?opening!.days:0;
 const total=openingDays+annual+adjustments;
 return {opening:openingDays,annual,adjustments,allocated:total,used,converted,available:Math.max(0,Math.round((total-used-converted)*100)/100),deficit:Math.max(0,Math.round((used+converted-total)*100)/100),nextGrant:annualGrantDates(p,`${Number(asOf.slice(0,4))+2}-12-31`).find(d=>d>asOf)||null,verifiedOpening:Boolean(openingValid),grantDates};
}
export const eachDate=(from:string,to:string,maxDays=366):string[]=>{
 if(!validDate(from)||!validDate(to)||from>to)return [];
 const list:string[]=[];let day=new Date(from+"T12:00:00Z");
 for(let i=0;i<maxDays&&day.toISOString().slice(0,10)<=to;i++){
  list.push(day.toISOString().slice(0,10));day=new Date(day.getTime()+86400000);
 }
 return list;
};
/** Unique OPS people per branch per date; includes Pending/For Review/Approved. */
export function opsLeaveCollisions(records:readonly LeaveRecordForBalance[],people:readonly HRPerson[],branch:string,threshold=2){
 const buckets=new Map<string,Map<string,{name:string;status:string;id:number}>>();
 for(const leave of records){
  if(!["Pending","For Review","Approved"].includes(leave.status)||leave.branch!==branch)continue;
  const person=people.find(p=>p.branch===branch&&sameEmployee(p,leave));
  if(!person||!opsDepartment(person.department))continue;
  for(const date of eachDate(leave.from,leave.to)){
   const bucket=buckets.get(date)||new Map();
   if(!bucket.has(person.id))bucket.set(person.id,{name:person.name,status:leave.status,id:leave.id});
   buckets.set(date,bucket);
  }
 }
 return [...buckets].filter(([,list])=>list.size>=threshold).map(([date,list])=>({date,branch,count:list.size,employees:[...list.values()]})).sort((a,b)=>a.date.localeCompare(b.date));
}
export function canDecideLeave(role:string,assignedBranch:string,leave:LeaveRecordForBalance,person?:HRPerson){
 if(!person||!sameEmployee(person,leave))return false;
 if(opsDepartment(person.department))return role==="BM"&&assignedBranch!=="All Shops"&&assignedBranch===leave.branch;
 return role==="HR"||role==="Special Final Approver — Ms Kate"||role==="Super Admin";
}

/** Read the same browser-local leave records used by Leave Management.
 * Never use this as proof of a legally verified final-pay leave liability. */
export function browserLeaveBalance(p:HRPerson,asOf:string){
 if(typeof window==="undefined")return leaveBalance(p,[],[],asOf);
 const read=(key:string)=>{try{const value=JSON.parse(window.localStorage.getItem(`uc-hr-ui-${key}`)||"[]");return Array.isArray(value)?value:[]}catch{return []}};
 return leaveBalance(p,read("leave"),read("leave-credit-requests"),asOf,read("leave-conversions"));
}
