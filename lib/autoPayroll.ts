/** Cutoff-close -> uploaded punches -> auto computation -> HR approval queue.
 * This engine is browser-local DEMO arithmetic, NOT compliant production payroll.
 */
import type {Person} from './people';
import type {PayrollConfig,PayslipDraft,ImportedAttendanceRow} from './payrollConfig';
import {basicRateOnDate,roundMoney} from './payrollConfig';
import {computeVerifiedEarnings} from './payrollVerifiedEarnings';
import type {OpsMonth,OpsPermit} from './opsRestDays';
import {computeGovernmentDeductions,estimateMonthlyBasis} from './payrollCalculations';
import type {PremiumProfile,PayrollRelease} from './hrState';
import {employeeCoverage,addCutoffDays} from './attendanceUpload';
import {loanInstallments,roundLoan,type LoanRecord} from './loanLedger';

export type AutoPayrollIssue={employeeId:string;name:string;reason:string};
export type AutoPayrollResult={drafts:PayslipDraft[];created:number;refreshed:number;skipped:number;issues:AutoPayrollIssue[]};
type Args={cfg:PayrollConfig;people:readonly Person[];premiums:Record<string,PremiumProfile>;loans:readonly LoanRecord[];releases:readonly PayrollRelease[];today:string;schedules?:OpsMonth[];permits?:OpsPermit[]};
const autoId=(branch:string,start:string,employeeId:string)=>`AUTO-${start}-${employeeId}`;
export function reconcileAutoPayroll({cfg,people,premiums,loans,releases,today,schedules=[],permits=[]}:Args):AutoPayrollResult{
 const next=[...cfg.payslipDrafts],issues:AutoPayrollIssue[]=[];
 let created=0,refreshed=0,skipped=0;
 for(const batch of cfg.attendanceRecords){
  if(batch.status!=='Verified'||batch.periodEnd>today)continue;
  const rows=cfg.attendanceRows.filter(x=>x.branch===batch.branch&&x.date>=batch.periodStart&&x.date<=batch.periodEnd);
  for(const person of people.filter(p=>p.branch===batch.branch&&p.hire<=batch.periodEnd&&p.status!=='Separated'&&p.status!=='Clearance Pending')){
   const existing=next.find(d=>d.employeeId===person.id&&d.periodStart===batch.periodStart&&!d.id.startsWith('SAMPLE-DETAIL-'));
   // An already approved, released, manually drafted or signed snapshot must not be changed automatically.
   if(releases.some(r=>r.employeeId===person.id&&r.periodStart===batch.periodStart&&r.periodEnd===batch.periodEnd&&r.kind==='Salary'&&r.source==='Browser Review')||
    (existing&&(existing.status==='Approved'||existing.status==='Released (Demo)'||(existing.attendanceSource!=='Uploaded CSV'&&!existing.id.startsWith('AUTO-DEMO-'))))){skipped++;continue}
   const c=employeeCoverage(rows,person.id,batch.periodStart,person.hire);
   if(!c.ready){issues.push({employeeId:person.id,name:person.name,reason:c.missing.length?`${c.missing.length} missing date(s): ${c.missing.slice(0,3).join(', ')}`:`${c.incomplete.length} incomplete punch(es)`});continue}
   const summary=c.selected;
   const earnings=computeVerifiedEarnings({person,cfg,summary,periodStart:batch.periodStart,periodEnd:batch.periodEnd,premium:premiums[person.id],schedules,permits});
   if(!earnings.ready){issues.push({employeeId:person.id,name:person.name,reason:earnings.issues.join('; ')});continue}
   if(earnings.gross<=0){issues.push({employeeId:person.id,name:person.name,reason:'Computed gross is zero; verify attendance and pay policy'});continue}
   const rate=basicRateOnDate(person.id,person.rate,batch.periodEnd,cfg.rateChanges);
   const gross=earnings.gross;
   const month=cfg.monthlyBases[person.id]??estimateMonthlyBasis(rate,person.salaryType);
   const gov=computeGovernmentDeductions({monthlyBasis:month,weeklyGross:gross,periodEnd:batch.periodEnd,versions:cfg.deductionVersions,birExempt:cfg.birExemptEmployees.includes(person.id),basisEstimated:person.salaryType==='Daily'&&!cfg.monthlyBases[person.id]});
   const entries=loanInstallments(loans,person.id,person.name,batch.periodEnd).map(x=>({loanId:x.loan.id,amount:x.amount}));
   const loanDeduction=roundLoan(entries.reduce((sum,x)=>sum+x.amount,0));
   const deductions=roundMoney(gov.employeeTotal+loanDeduction+earnings.lateDeduction);
   if(deductions>gross){issues.push({employeeId:person.id,name:person.name,reason:'Deductions exceed gross; manual HR review needed'});continue}
   const fingerprint=JSON.stringify({
    batch:batch.id,
    attendance:summary.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(x=>[x.date,x.status,x.timeIn,x.timeOut,x.workedHours,x.lateMinutes,x.approvedOtHours,x.otApproved,x.scheduledRestDay]),
    rate,rateDates:earnings.basicRates,premiums:earnings.premiums,
    holidays:cfg.holidayRules.filter(h=>h.date>=batch.periodStart&&h.date<=batch.periodEnd&&(h.branch==='All Branches'||h.branch===person.branch)),
    schedules:schedules.filter(x=>x.employeeId===person.id&&x.month>=batch.periodStart.slice(0,7)&&x.month<=batch.periodEnd.slice(0,7)),
    permits:permits.filter(x=>x.employeeId===person.id&&x.date>=batch.periodStart&&x.date<=batch.periodEnd),
    monthlyDivisor:cfg.monthlySalaryDivisor,monthlyDivisorReviewedAt:cfg.monthlyDivisorReviewedAt,opsCombinedHolidayRates:cfg.opsCombinedHolidayRates,
    monthlyBasis:month,contributions:gov.items.map(x=>[x.agency,x.employee,x.version]),loanEntries:entries,
    birExempt:cfg.birExemptEmployees.includes(person.id)
   });
   if(existing&&existing.attendanceFingerprint===fingerprint){skipped++;continue}
   const draft:PayslipDraft={id:existing&&!existing.id.startsWith('AUTO-DEMO-')?existing.id:autoId(batch.branch,batch.periodStart,person.id),employeeId:person.id,
    periodStart:batch.periodStart,periodEnd:batch.periodEnd,days:earnings.workedDays,workedDays:earnings.workedDays,
    workedHours:roundMoney(summary.reduce((n,r)=>n+r.workedHours,0)),paidLeaveDays:0,unpaidLeaveDays:0,lateMinutes:earnings.lateMinutes,scheduledDays:earnings.scheduledDays,
    salaryType:person.salaryType,rateAmount:rate,dailyRate:earnings.dailyRate,hourlyRate:earnings.hourlyRate,
    attendanceSource:'Uploaded CSV',attendanceBatchId:batch.id,attendanceFingerprint:fingerprint,otHours:earnings.otHours,allowances:0,ecolaPay:0,holidayExtra:earnings.holidayExtra,
    basicPay:earnings.basic,basicRateBreakdown:earnings.basicRates,
    premiumBreakdown:earnings.premiums,computationWarnings:earnings.warnings,monthlyDivisorSnapshot:person.salaryType==='Monthly'?cfg.monthlySalaryDivisor:undefined,
    otPay:earnings.ot,lateDeduction:earnings.lateDeduction,gross,deductions,net:roundMoney(gross-deductions),
    deductionBreakdown:gov.items.map(x=>({agency:x.agency,employee:x.employee,employer:x.employer,version:x.version})),
    loanDeduction,loanEntries:entries,manualDeduction:0,status:'For Review',createdAt:existing?.createdAt||today,
    remarks:`Auto-calculated in browser from CSV ${batch.fileName}; date-specific verified attendance and effective pay rates. Review warnings: ${earnings.warnings.join(' | ')||'None'}. HR MUST confirm holiday eligibility, applicable company policy, payroll divisor, leave, deductions and taxable earnings. CSV is not authenticated biometrics.`};
   if(existing){next[next.indexOf(existing)]=draft;refreshed++}else{next.push(draft);created++}
  }
 }
 return {drafts:next,created,refreshed,skipped,issues};
}
