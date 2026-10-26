/** Company-scoped preparation only: never a verified payroll run or bank release. */
import type {HRState} from "./hrState";
import type {PayrollConfig} from "./payrollConfig";
import {employeeCoverage,addCutoffDays} from "./attendanceUpload";
import {basicRateOnDate} from "./payrollConfig";

export type PayrollCompany="Underchargers"|"Mastermind";
export const companyForBranch=(branch:string):PayrollCompany=>branch.startsWith("MM ")?"Mastermind":"Underchargers";
export const companyBranches=(company:PayrollCompany)=>company==="Mastermind"?["MM Mandaluyong"]:["UC Mandaluyong","UC Las Piñas","UC Quezon City"];
/** Always evaluate in Asia/Manila, not the Vercel/server timezone. */
export const philippineToday=(at:Date=new Date())=>{const parts=new Intl.DateTimeFormat("en-US",{timeZone:"Asia/Manila",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(at);const part=(name:string)=>parts.find(p=>p.type===name)?.value||"";return `${part("year")}-${part("month")}-${part("day")}`;};
export function lastCompletedCutoff(today:string){
 const date=new Date(`${today}T00:00:00Z`);
 if(Number.isNaN(date.getTime()))throw Error("Invalid Philippine date");
 const weekday=date.getUTCDay();
 const daysAfterWednesday=(weekday-3+7)%7;
 const end=new Date(date.getTime()-daysAfterWednesday*86400000);
 const iso=(d:Date)=>d.toISOString().slice(0,10);
 return {start:iso(new Date(end.getTime()-6*86400000)),end:iso(end),isThursday:weekday===4};
}
export type CompanyEmployeeReview={employeeId:string;name:string;branch:string;days:number;basic:number;issues:string[]};
/** No guesses about late time, leave pay, OT, holiday premia or statutory deductions. */
export function reviewCompanyPayroll(data:HRState,cfg:PayrollConfig,company:PayrollCompany,start:string,end:string){
 const branches=companyBranches(company);
 const people=data.people.filter(p=>branches.includes(p.branch)&&p.status!=="Separated"&&p.status!=="Clearance Pending"&&p.hire<=end);
 const rows:CompanyEmployeeReview[]=people.map(p=>{
  const issues:string[]=[];
  const record=cfg.attendanceRecords.find(a=>a.branch===p.branch&&a.periodStart===start&&a.periodEnd===end&&a.status==="Verified");
  if(!record)issues.push("Verified attendance file missing for branch and cutoff");
  const coverage=employeeCoverage(cfg.attendanceRows,p.id,start,p.hire);
  if(!coverage.ready)issues.push(`Attendance incomplete: ${coverage.missing.length} missing, ${coverage.incomplete.length} incomplete date(s)`);
  if(coverage.selected.some(x=>x.status==="On Leave"))issues.push("Leave pay requires manual reconciliation");
  if(coverage.selected.some(x=>x.lateMinutes>0||x.workedHours>0&&x.workedHours<8))issues.push("Late/undertime requires manual computation");
  if(coverage.selected.some(x=>x.approvedOtHours>0))issues.push("Approved overtime requires premium review");
  if(cfg.holidayRules.some(h=>h.date>=start&&h.date<=end&&(h.branch==="All Branches"||h.branch===p.branch)))issues.push("Holiday pay/premium requires review");
  if(p.salaryType==="Monthly"&&coverage.selected.some(x=>x.status==="Absent"))issues.push("Monthly-pay absence requires manual computation");
  if(p.salaryType==="Monthly"&&p.hire>start)issues.push("Partial period monthly compensation requires review");
  const days=coverage.selected.filter(x=>x.status==="Present").length;
  const rate=basicRateOnDate(p.id,p.rate,start,cfg.rateChanges);
  const basic=p.salaryType==="Daily"?rate*days:rate*12/52;
  if(!Number.isFinite(rate)||rate<=0||!Number.isFinite(basic)||basic<=0)issues.push("Missing/invalid verified basic pay rate or attendance");
  if(cfg.payslipDrafts.some(d=>d.employeeId===p.id&&d.periodStart===start&&d.periodEnd===end)||data.payrollReleases.some(x=>x.employeeId===p.id&&x.periodStart===start&&x.periodEnd===end&&x.kind==="Salary"))issues.push("Payroll draft/release already exists for this employee and cutoff");
  return {employeeId:p.id,name:p.name,branch:p.branch,days,basic:Math.round(basic*100)/100,issues};
 });
 return {company,start,end,employees:rows,blocked:rows.filter(p=>p.issues.length>0),missingBranches:branches.filter(b=>people.some(p=>p.branch===b)&&!cfg.attendanceRecords.some(a=>a.branch===b&&a.periodStart===start&&a.periodEnd===end&&a.status==="Verified"))};
}
