/** Auditable 13th-month reconciliation for a calendar year or separation period.
 * Only browser-reviewed, released salary payouts with matching released payslips
 * contribute to VERIFIED basic pay; no fictional DTR, estimate, or gross wages.
 * Incomplete payroll periods must be reconciled by HR before any final pay handoff.
 */
import type {HRState,HRPerson} from './hrState';
import {roundMoney} from './payrollConfig';
import {companyManager} from './leavePolicy';
import {isValidISODate as dateOk} from './dateOnly';

export type ThirteenthCutoff={id:string;from:string;to:string;basic:number};
export type ThirteenthSettlement={employeeId:string;year:number;through:string;start:string;cutoffs:ThirteenthCutoff[];eligibleBasic:number;grossEntitlement:number;alreadyPaid:number;outstanding:number;issues:string[];complete:boolean};

const nextDay=(s:string)=>new Date(Date.parse(s+'T00:00:00Z')+86400000).toISOString().slice(0,10);
export function reconciliationForEmployee(state:Pick<HRState,'payrollReleases'|'payrollConfig'>,employee:Pick<HRPerson,'id'|'hire'|'status'|'jobLevel'|'position'>,year:number,through:string):ThirteenthSettlement{
 const issues:string[]=[];
 const from=`${year}-01-01`,until=`${year}-12-31`;
 const start=employee.hire>from?employee.hire:from;
 const end=through<until?through:until;
 if(!Number.isInteger(year)||year<2000||year>2100||!dateOk(through)||!dateOk(employee.hire)||end<start)issues.push('Invalid year, separation date, or employee hire date.');
 const isManager=companyManager(employee);
 const managerPolicy=isManager?state.payrollConfig?.managerialThirteenthCoverage?.[employee.id]:undefined;
 if(isManager&&!managerPolicy?.reviewedAt)issues.push('Managerial 13th-month entitlement requires a documented company policy or contract coverage review.');
 // When reviewed as outside company 13th-month coverage, do NOT infer a statutory payout.
 if(isManager&&managerPolicy&&!managerPolicy.covered){
  const alreadyPaid=roundMoney(state.payrollReleases.filter(r=>r.employeeId===employee.id&&r.kind==='13th-Month Pay'&&r.status==='Released'&&r.source==='Browser Review'&&r.periodEnd.slice(0,4)===String(year)).reduce((sum,r)=>sum+(Number.isFinite(r.gross)?r.gross:0),0));
  if(alreadyPaid>0)issues.push('Previously released 13th-month payment exists although company managerial coverage is marked excluded. Verify policy and payment records.');
  return {employeeId:employee.id,year,through:end,start,cutoffs:[],eligibleBasic:0,grossEntitlement:0,alreadyPaid,outstanding:0,issues,complete:issues.length===0};
 }
 const cutoffs:ThirteenthCutoff[]=[];
 const drafts=state.payrollConfig?.payslipDrafts||[];
 const salary=state.payrollReleases.filter(r=>r.employeeId===employee.id&&r.kind==='Salary'&&r.status==='Released'&&r.source==='Browser Review'&&r.periodEnd>=start&&r.periodStart<=end).sort((a,b)=>a.periodStart.localeCompare(b.periodStart));
 for(const release of salary){
  if(release.periodStart<start||release.periodEnd>end){issues.push(`Salary release ${release.id} crosses the selected eligibility window; allocate verified basic salary for the covered dates.`);continue;}
  const snapshot=drafts.find(d=>d.employeeId===employee.id&&d.releasedId===release.id&&d.periodStart===release.periodStart&&d.periodEnd===release.periodEnd&&d.status==='Released (Demo)');
  if(!snapshot||!Number.isFinite(snapshot.basicPay)||snapshot.basicPay!<0||snapshot.basicPay!>release.gross){issues.push(`Release ${release.id} has no matching verified basic-pay snapshot.`);continue;}
  // 13th-month basis is ACTUAL eligible basic salary earned, not the nominal
  // scheduled basic before verified unpaid late/undertime reductions.
  const shortHours=Number(snapshot.lateDeduction??0);
  if(!Number.isFinite(shortHours)||shortHours<0||shortHours>snapshot.basicPay!){issues.push(`Release ${release.id} has invalid late/undertime basic reduction.`);continue;}
  const earnedBasic=roundMoney(snapshot.basicPay!-shortHours);
  if(cutoffs.some(x=>x.from<=release.periodEnd&&x.to>=release.periodStart)){issues.push(`Overlapping salary release: ${release.id}.`);continue;}
  cutoffs.push({id:release.id,from:release.periodStart,to:release.periodEnd,basic:earnedBasic});
 }
 for(const item of state.payrollConfig?.historicalBasicLedgers||[]){
  if(item.employeeId!==employee.id||item.periodEnd<start||item.periodStart>end||item.status==="Rejected")continue;
  if(item.status!=="Verified"){
   issues.push(`Historical basic-pay ledger ${item.id} awaits independent HR verification.`);
   continue;
  }
  if(!dateOk(item.periodStart)||!dateOk(item.periodEnd)||item.periodStart<start||item.periodEnd>end||item.periodStart>item.periodEnd||!Number.isFinite(item.eligibleBasic)||item.eligibleBasic<0||!item.sourceReference.trim()){
   issues.push(`Historical basic-pay ledger ${item.id} contains invalid dates, amount or evidence.`);
   continue;
  }
  if(cutoffs.some(x=>x.from<=item.periodEnd&&x.to>=item.periodStart)){
   issues.push(`Historical basic-pay ledger ${item.id} overlaps an existing released salary/ledger period.`);
   continue;
  }
  cutoffs.push({id:`LEDGER:${item.id}`,from:item.periodStart,to:item.periodEnd,basic:roundMoney(item.eligibleBasic)});
 }
 cutoffs.sort((a,b)=>a.from.localeCompare(b.from));
 if(end>=start&&dateOk(start)&&dateOk(end)){
  let cursor=start;
  for(const c of cutoffs){if(c.from>cursor)issues.push(`Unverified basic salary for ${cursor} to ${new Date(Date.parse(c.from+'T00:00:00Z')-86400000).toISOString().slice(0,10)}.`);if(c.to>=cursor)cursor=nextDay(c.to);}
  if(cursor<=end)issues.push(`Unverified basic salary for ${cursor} to ${end}.`);
 }
 const eligibleBasic=roundMoney(cutoffs.reduce((s,r)=>s+r.basic,0));
 const grossEntitlement=roundMoney(eligibleBasic/12);
 // Only ACTUAL recorded payouts, not review approvals, are deducted.
 const payments=state.payrollReleases.filter(r=>r.employeeId===employee.id&&r.kind==='13th-Month Pay'&&r.status==='Released'&&r.source==='Browser Review'&&r.periodEnd.slice(0,4)===String(year));
 const seenPaymentIds=new Set<string>();
 for(const payment of payments){if(seenPaymentIds.has(payment.id))issues.push(`Duplicate 13th-month payment release ID: ${payment.id}.`);seenPaymentIds.add(payment.id)}
 if(payments.some(r=>!Number.isFinite(r.gross)||r.gross<0))issues.push('Invalid previously released 13th-month payment.');
 const alreadyPaid=roundMoney(payments.reduce((sum,r)=>sum+(Number.isFinite(r.gross)&&r.gross>0?r.gross:0),0));
 if(alreadyPaid>grossEntitlement)issues.push('Already-paid 13th-month amount exceeds the currently verified entitlement; investigate before deduction or offset.');
 if(!cutoffs.length)issues.push('No verified salary payout snapshots are available for this period.');
 return {employeeId:employee.id,year,through:end,start,cutoffs,eligibleBasic,grossEntitlement,alreadyPaid,outstanding:roundMoney(Math.max(0,grossEntitlement-alreadyPaid)),issues,complete:issues.length===0};
}
export function finalPayDeadline(separationDate:string){if(!dateOk(separationDate))return '';return new Date(Date.parse(separationDate+'T00:00:00Z')+30*86400000).toISOString().slice(0,10)}
export function finalPayDeadlineState(separationDate:string,today:string,paid:boolean){
 const due=finalPayDeadline(separationDate);
 if(!due||!dateOk(today))return {due,status:'Invalid Date' as const,daysRemaining:null};
 const daysRemaining=Math.round((Date.parse(due+'T00:00:00Z')-Date.parse(today+'T00:00:00Z'))/86400000);
 return {due,daysRemaining,status:paid?'Paid':daysRemaining<0?'Overdue':daysRemaining<=3?'Urgent':daysRemaining<=7?'Due Soon':'On Track'};
}
