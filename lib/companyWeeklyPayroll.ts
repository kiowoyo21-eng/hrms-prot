/** Company-scoped verified attendance review (browser demo, not bank payroll). */
import type {HRState} from './hrState';
import type {PayrollConfig} from './payrollConfig';
import {employeeCoverage} from './attendanceUpload';
import {computeVerifiedEarnings} from './payrollVerifiedEarnings';
import type {OpsMonth,OpsPermit} from './opsRestDays';

export type PayrollCompany='Underchargers'|'Mastermind';
export const companyForBranch=(branch:string):PayrollCompany=>branch.startsWith('MM ')?'Mastermind':'Underchargers';
export const companyBranches=(company:PayrollCompany)=>company==='Mastermind'?['MM Mandaluyong']:['UC Mandaluyong','UC Las Piñas','UC Quezon City'];
/** Philippine calendar dates, regardless of server host timezone. */
export const philippineToday=(at:Date=new Date())=>{const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Manila',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(at);const part=(name:string)=>parts.find(p=>p.type===name)?.value||'';return `${part('year')}-${part('month')}-${part('day')}`;};
export function lastCompletedCutoff(today:string){
 const date=new Date(`${today}T00:00:00Z`);
 if(Number.isNaN(date.getTime()))throw Error('Invalid Philippine date');
 const weekday=date.getUTCDay();const daysAfterWednesday=(weekday-3+7)%7;
 const end=new Date(date.getTime()-daysAfterWednesday*86400000);
 const iso=(d:Date)=>d.toISOString().slice(0,10);
 return {start:iso(new Date(end.getTime()-6*86400000)),end:iso(end),isThursday:weekday===4};
}
export type CompanyEmployeeReview={employeeId:string;name:string;branch:string;days:number;basic:number;issues:string[];warnings:string[]};
export function reviewCompanyPayroll(data:HRState,cfg:PayrollConfig,company:PayrollCompany,start:string,end:string,schedules:OpsMonth[]=[],permits:OpsPermit[]=[]){
 const branches=companyBranches(company);
 const people=data.people.filter(p=>branches.includes(p.branch)&&p.status!=='Separated'&&p.status!=='Clearance Pending'&&p.hire<=end);
 const rows:CompanyEmployeeReview[]=people.map(person=>{
  const issues:string[]=[];
  const record=cfg.attendanceRecords.find(a=>a.branch===person.branch&&a.periodStart===start&&a.periodEnd===end&&a.status==='Verified');
  if(!record)issues.push('Verified attendance file missing for branch and cutoff');
  const coverage=employeeCoverage(cfg.attendanceRows,person.id,start,person.hire);
  if(!coverage.ready)issues.push(`Attendance incomplete: ${coverage.missing.length} missing, ${coverage.incomplete.length} incomplete date(s)`);
  const earned=computeVerifiedEarnings({person,cfg,summary:coverage.selected,periodStart:start,periodEnd:end,premium:data.rates?.[person.id],schedules,permits});
  issues.push(...earned.issues);
  if(!Number.isFinite(earned.gross)||earned.gross<=0)issues.push('Computed gross missing or zero; HR review required');
  if(cfg.payslipDrafts.some(d=>d.employeeId===person.id&&d.periodStart===start&&d.periodEnd===end&&!(d.status==='For Review'&&d.attendanceSource==='Uploaded CSV'))||data.payrollReleases.some(x=>x.employeeId===person.id&&x.periodStart===start&&x.periodEnd===end&&x.kind==='Salary'))issues.push('Non-refreshable draft or release already exists for this employee and cutoff');
  return {employeeId:person.id,name:person.name,branch:person.branch,days:earned.workedDays,basic:earned.gross,issues:[...new Set(issues)],warnings:earned.warnings};
 });
 return {company,start,end,employees:rows,blocked:rows.filter(p=>p.issues.length>0),missingBranches:branches.filter(b=>people.some(p=>p.branch===b)&&!cfg.attendanceRecords.some(a=>a.branch===b&&a.periodStart===start&&a.periodEnd===end&&a.status==='Verified'))};
}
