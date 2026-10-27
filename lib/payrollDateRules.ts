/** Date-scoped payroll rules; statutory floors are references, not a substitute for approval. */
import type {PayRateChange,HolidayRule} from './payrollConfig';
import {basicRateOnDate,roundMoney} from './payrollConfig';
export const isOpsDepartment=(department:string)=>['ops','operations'].includes(department.trim().toLowerCase());
export type WorkdayClassification='Ordinary'|'Rest Day'|'Regular Holiday'|'Special Non-Working Day'|'Special Working Day';
export function holidayWorkedMinimum(type:HolidayRule['type'],restDay:boolean):number{
 if(type==='Regular Holiday')return restDay?260:200;
 if(type==='Special Non-Working Day')return restDay?150:130;
 return restDay?130:100;
}
export function qualifiedHolidayRate(holiday:HolidayRule|undefined,restDay:boolean,employeeId:string,department:string):number{
 if(!holiday)return restDay?130:100;
 const floor=holidayWorkedMinimum(holiday.type,restDay);
 const configured=holiday.employeeId===employeeId?holiday.employeeRate:holiday.department===department?holiday.departmentRate:null;
 // A plain holiday override is not automatically a legal rest-day stacking policy.
 return restDay?floor:Math.max(floor,configured??floor);
}
export function rateSegments(employeeId:string,original:number,start:string,end:string,changes:PayRateChange[]){
 const dates=[start,...changes.filter(r=>r.employeeId===employeeId&&r.effective>start&&r.effective<=end).map(r=>r.effective)].sort();
 const unique=[...new Set(dates)];
 return unique.map((effective,i)=>({start:effective,end:i+1<unique.length?previousDate(unique[i+1]):end,rate:basicRateOnDate(employeeId,original,effective,changes)}));
}
export function previousDate(date:string){const d=new Date(`${date}T12:00:00Z`);d.setUTCDate(d.getUTCDate()-1);return d.toISOString().slice(0,10)}
export function cutoffBasicByWorkDate(employeeId:string,original:number,workDates:string[],changes:PayRateChange[]){
 return roundMoney(workDates.reduce((sum,date)=>sum+basicRateOnDate(employeeId,original,date,changes),0));
}
export function needsHolidayClassification(holidays:HolidayRule[],branch:string,start:string,end:string){return holidays.filter(h=>h.date>=start&&h.date<=end&&(h.branch==='All Branches'||h.branch===branch));}

/** Company before/after attendance check; never a statutory holiday-pay denial. */
export type HolidayAttendanceFinding={holidayDate:string;side:'Before'|'After';checkedDate?:string;status:'Present'|'Approved Paid Leave'|'Needs Review'|'Missing Record';message:string};
export function holidayAttendanceReview(holidayDate:string,rows:{date:string;status:string}[],offDates:string[],paidLeaveDates:string[]=[]):HolidayAttendanceFinding[]{
 const byDate=new Map(rows.map(r=>[r.date,r.status]));
 const off=new Set(offDates),paid=new Set(paidLeaveDates);
 const add=(date:string,delta:number)=>{const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+delta);return d.toISOString().slice(0,10)};
 return ([-1,1] as const).map(delta=>{
  const side=delta<0?'Before' as const:'After' as const;
  let date=holidayDate;let checkedDate:string|undefined;
  for(let i=0;i<14;i++){date=add(date,delta);if(!off.has(date)){checkedDate=date;break}}
  const status=checkedDate?byDate.get(checkedDate):undefined;
  const result:HolidayAttendanceFinding['status']=!checkedDate||!status?'Missing Record':status==='Present'?'Present':paid.has(checkedDate)?'Approved Paid Leave':'Needs Review';
  return {holidayDate,side,checkedDate,status:result,message:result==='Needs Review'?'Company attendance review required; do not automatically forfeit statutory holiday pay':result==='Missing Record'?'Attendance or schedule confirmation needed':result};
 });
}
/** Produces auditable daily basic earnings segments for a daily-paid cutoff. */
export function datedBasicBreakdown(employeeId:string,original:number,workDates:string[],changes:PayRateChange[]){
 return workDates.slice().sort().map(date=>({date,rate:basicRateOnDate(employeeId,original,date,changes)}));
}

/** Review-only, correctly segmented across calendar month boundaries. */
export function monthlyRateSegmentsForReview(employeeId:string,originalMonthly:number,start:string,end:string,changes:PayRateChange[]){
 return calendarMonthlyProrationReview(employeeId,originalMonthly,start,end,changes).segments;
}
/** Split monthly salary histories at BOTH rate effective dates and month boundaries.
 * Calendar-day amounts are REVIEW-ONLY until the employer's payroll divisor is approved.
 */
export function calendarMonthlyProrationReview(employeeId:string,monthlyRate:number,start:string,end:string,changes:PayRateChange[]){
 if(start>end)throw new Error('Invalid cutoff date range');
 const pieces:{start:string;end:string;rate:number;calendarDays:number;daysInMonth:number;illustrativeBasic:number}[]=[];
 for(const span of rateSegments(employeeId,monthlyRate,start,end,changes)){
  let cursor=span.start;
  while(cursor<=span.end){
   const year=Number(cursor.slice(0,4)),month=Number(cursor.slice(5,7));
   const daysInMonth=new Date(Date.UTC(year,month,0)).getUTCDate();
   const monthEnd=`${cursor.slice(0,7)}-${String(daysInMonth).padStart(2,'0')}`;
   const pieceEnd=monthEnd<span.end?monthEnd:span.end;
   const a=Date.parse(`${cursor}T12:00:00Z`),b=Date.parse(`${pieceEnd}T12:00:00Z`);
   const calendarDays=Math.round((b-a)/86400000)+1;
   pieces.push({start:cursor,end:pieceEnd,rate:span.rate,calendarDays,daysInMonth,illustrativeBasic:roundMoney(span.rate*calendarDays/daysInMonth)});
   if(pieceEnd===span.end)break;
   const next=new Date(`${pieceEnd}T12:00:00Z`);next.setUTCDate(next.getUTCDate()+1);
   cursor=next.toISOString().slice(0,10);
  }
 }
 return {segments:pieces,totalIllustrativeBasic:roundMoney(pieces.reduce((sum,p)=>sum+p.illustrativeBasic,0)),requiresPayrollApproval:true as const};
}

/** Holiday/rest-day worked value for a given work date, before any base-salary offset.
 * OPS company policy of 200% on an ordinary RD is distinct from statutory holiday overlap.
 * When holiday and RD coincide, this uses the statutory combined floor and flags any
 * unresolved higher company entitlement for HR review rather than guessing at stacking.
 */
export function workedDayPremiumReview(args:{date:string;employeeId:string;department:string;dailyRate:number;hours:number;restDay:boolean;holiday?:HolidayRule;opsRestDayRate?:number}){
 const {date,employeeId,department,dailyRate,hours,restDay,holiday}=args;
 if(!Number.isFinite(dailyRate)||dailyRate<=0||!Number.isFinite(hours)||hours<0||hours>24)throw new Error('Invalid rate or hours');
 if(holiday&&holiday.date!==date)throw new Error('Holiday must match worked date');
 const statutory=holidayWorkedMinimum(holiday?.type??'Special Working Day',restDay);
 const opsOrdinary=restDay&&!holiday&&isOpsDepartment(department);
 const opsRate=opsOrdinary?Math.max(130,args.opsRestDayRate??200):0;
 const multiplier=holiday?qualifiedHolidayRate(holiday,restDay,employeeId,department):Math.max(statutory,opsRate);
 const amount=roundMoney(dailyRate*(Math.min(hours,8)/8)*multiplier/100);
 const requiresPolicyReview=Boolean(holiday&&restDay&&isOpsDepartment(department));
 return {date,classification:holiday?`${holiday.type}${restDay?' + Rest Day':''}`:restDay?'Rest Day':'Ordinary',hours:Math.min(hours,8),multiplier,amount,requiresPolicyReview,extraHours:Math.max(0,hours-8)};
}

/** Audit-facing preview; never used to post unchecked premium amounts. */
export function dateSpecificPremiumReview(args:{employeeId:string;department:string;originalDailyRate:number;rateChanges:PayRateChange[];days:{date:string;workedHours:number;restDay:boolean}[];holidays:HolidayRule[];branch:string;opsRestDayRate?:number}){
 const output=[] as ReturnType<typeof workedDayPremiumReview>[];
 const seen=new Set<string>();
 for(const day of args.days){
  if(seen.has(day.date))throw new Error(`Duplicate attendance date: ${day.date}`);
  seen.add(day.date);
  if(day.workedHours<=0)continue;
  const applicable=args.holidays.filter(h=>h.date===day.date&&(h.branch==='All Branches'||h.branch===args.branch));
  if(applicable.length>1)throw new Error(`Conflicting holiday records: ${day.date}`);
  const dailyRate=basicRateOnDate(args.employeeId,args.originalDailyRate,day.date,args.rateChanges);
  output.push(workedDayPremiumReview({date:day.date,employeeId:args.employeeId,department:args.department,dailyRate,hours:day.workedHours,restDay:day.restDay,holiday:applicable[0],opsRestDayRate:args.opsRestDayRate}));
 }
 return {rows:output,requiresPolicyReview:output.some(r=>r.requiresPolicyReview||r.extraHours>0),totalWorkedValue:roundMoney(output.reduce((n,r)=>n+r.amount,0))};
}
