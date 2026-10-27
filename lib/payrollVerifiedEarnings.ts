/** Date-based payroll review engine for verified attendance evidence.
 * NOT a statutory/payroll service: HR must approve rate/divisor, holiday coverage,
 * paid leave, and documented exceptions before release.
 */
import type {Person} from './people';
import type {PayrollConfig,ImportedAttendanceRow,PayslipDraft,HolidayRule} from './payrollConfig';
import {basicRateOnDate,roundMoney} from './payrollConfig';
import {holidayWorkedMinimum,isOpsDepartment,holidayAttendanceReview} from './payrollDateRules';
import {opsDayClassification,type OpsMonth,type OpsPermit} from './opsRestDays';
import {hasOpsPermitFile} from './opsPermitEvidence';
import type {PremiumProfile} from './hrState';

export type EarningsBreakdown={date:string;classification:string;hours:number;multiplier:number;amount:number};
export type DatePayrollResult={ready:boolean;issues:string[];warnings:string[];basic:number;ot:number;holidayExtra:number;gross:number;lateDeduction:number;workedDays:number;scheduledDays:number;lateMinutes:number;otHours:number;basicRates:{date:string;rate:number}[];premiums:EarningsBreakdown[];dailyRate:number;hourlyRate:number};
const money=roundMoney;
const isPaid=(row:ImportedAttendanceRow)=>row.status==='Present';
export function computeVerifiedEarnings(args:{person:Person;cfg:PayrollConfig;summary:ImportedAttendanceRow[];periodStart:string;periodEnd:string;premium?:PremiumProfile;schedules?:OpsMonth[];permits?:OpsPermit[]}):DatePayrollResult{
 const {person,cfg,periodStart,periodEnd}=args;
 const issues:string[]=[],warnings:string[]=[],premiums:EarningsBreakdown[]=[],basicRates:{date:string;rate:number}[]=[];
 const divisor=person.salaryType==='Daily'?1:cfg.monthlySalaryDivisor;
 if(person.salaryType==='Monthly'&&(!divisor||!Number.isFinite(divisor)||divisor<=0||!cfg.monthlyDivisorReviewedAt))issues.push('Monthly-paid automatic payroll requires an HR-reviewed monthly paid-day divisor; configure it in Payroll → Pay Rates');
 const rows=args.summary.slice().sort((a,b)=>a.date.localeCompare(b.date));
 if(rows.some((r,i)=>i>0&&r.date===rows[i-1].date))issues.push('Duplicate attendance date in verified records');
 let basic=0,ot=0,holidayExtra=0,lateDeduction=0;
 let workedDays=0,scheduledDays=0,lateMinutes=0,otHours=0;
 const holidays=cfg.holidayRules.filter(h=>h.date>=periodStart&&h.date<=periodEnd&&(h.branch==='All Branches'||h.branch===person.branch));
 const allAttendance=cfg.attendanceRows.filter(r=>r.employeeId===person.id);
 const isOps=isOpsDepartment(person.department);
 for(const row of rows){
  const ops=isOps?opsDayClassification(person.id,row.date,args.schedules??[],args.permits??[]):null;
  if(ops?.kind==='Missing Schedule'){issues.push(`${row.date}: OPS published monthly OFF schedule not found`);continue}
  const restDay=isOps?(ops?.kind==='Scheduled OFF'||ops?.kind==='Approved Rest Day Work'):Boolean(row.scheduledRestDay||row.status==='Rest Day');
  if(isOps&&row.status==='Rest Day'&&!restDay)issues.push(`${row.date}: rest day attendance status conflicts with OPS published schedule`);
  if(isOps&&restDay&&isPaid(row)){
   if(ops?.kind!=='Approved Rest Day Work')issues.push(`${row.date}: OPS rest-day work requires approved BM permit`);
   else if(!ops.permit||!hasOpsPermitFile(ops.permit.id))issues.push(`${row.date}: RDW work permit attachment is missing or unavailable for audit`);
   else if(row.workedHours>(ops.permit?.hours??0)+0.001)issues.push(`${row.date}: actual hours exceed approved permit`);
  }
  if(ops?.kind==='Approved Rest Day Work'&&!isPaid(row))issues.push(`${row.date}: approved permit has no verified work attendance`);
  const matches=holidays.filter(h=>h.date===row.date);
  if(matches.length>1)issues.push(`${row.date}: conflicting holiday records for branch`);
  const holiday:HolidayRule|undefined=matches[0];
  const monthlyRate=basicRateOnDate(person.id,person.rate,row.date,cfg.rateChanges);
  if(!Number.isFinite(monthlyRate)||monthlyRate<=0){issues.push(`${row.date}: missing or invalid historical rate`);continue}
  const dayRate=money(monthlyRate/(divisor||1));
  basicRates.push({date:row.date,rate:dayRate});
  if(!restDay)scheduledDays++;
  if(row.status==='On Leave'){issues.push(`${row.date}: leave requires approved paid/unpaid leave reconciliation`);continue}
  if(row.status==='Incomplete'){issues.push(`${row.date}: incomplete attendance punches`);continue}
  if(isPaid(row)){
   workedDays++;
   if(!(row.workedHours>0)||row.workedHours>16){issues.push(`${row.date}: worked hours are not within expected range`);continue}
   if(row.workedHours>8&&row.approvedOtHours+0.01<row.workedHours-8)issues.push(`${row.date}: worked hours beyond 8 require verified approved OT`);
   if(row.approvedOtHours>0&&!row.otApproved)issues.push(`${row.date}: OT not approved`);
   if(row.approvedOtHours>Math.max(0,row.workedHours-8)+0.01)issues.push(`${row.date}: approved OT exceeds actual excess hours`);
   const floor=holidayWorkedMinimum(holiday?.type??'Special Working Day',restDay);
   const combinedHoliday=Boolean(holiday&&holiday.type!=='Special Working Day'&&restDay&&isOps);
   const normalRate=restDay&&isOps&&(!holiday||holiday.type==='Special Working Day')?Math.max(floor,200,args.premium?.rdw??200):floor;
   const override=holiday&&!restDay?(holiday.employeeId===person.id?holiday.employeeRate:holiday.department===person.department?holiday.departmentRate:null):null;
   let multiplier=Math.max(normalRate,override??normalRate);
   if(combinedHoliday){
    const policy=cfg.opsCombinedHolidayRates;
    const selected=holiday?.type==='Regular Holiday'?policy?.regular:policy?.special;
    if(!policy?.reviewedAt||!Number.isFinite(selected)||!selected||selected<floor)issues.push(`${row.date}: OPS RD + holiday requires HR-approved combined-rate policy (statutory floor ${floor}%)`);
    else multiplier=Math.max(multiplier,selected);
   }
   const regularHours=Math.min(row.workedHours,8);
   // Allocate a full nominal paid day to ordinary work, then itemize lost scheduled
   // hours ONCE as late/undertime deduction. Avoid deducting the short hours again
   // from a prorated base. An RD permit does not impose an ordinary shift-start time.
   const missingMinutes=restDay?0:Math.min(480,Math.max(row.lateMinutes,Math.ceil((8-regularHours)*60)));
   const dayReduction=restDay?0:money(dayRate*missingMinutes/480);
   const billableHours=restDay?regularHours:Math.min(regularHours,Math.max(0,8-missingMinutes/60));
   const baseValue=restDay?0:dayRate;
   basic+=baseValue;
   lateDeduction+=dayReduction;
   const fullWorkedValue=money(dayRate*billableHours/8*multiplier/100);
   // For a premium day, the supplement is the full due less already allocated
   // nominal basic NET of late reduction. For a normal day there is no premium.
   const additional=holiday||restDay?money(fullWorkedValue-(baseValue-dayReduction)):0;
   if(holiday||restDay)holidayExtra+=additional;
   if(additional)premiums.push({date:row.date,classification:holiday?`${holiday.type}${restDay?' + Rest Day':''}`:'Ordinary Rest Day',hours:billableHours,multiplier,amount:additional});
   const ordinaryOt=isOps?125:Math.max(125,args.premium?.ot??(person.department==='Service'?150:125));
   const otMultiplier=holiday||restDay?multiplier*1.30:ordinaryOt;
   if(row.approvedOtHours>0){const otValue=money(dayRate/8*row.approvedOtHours*otMultiplier/100);ot+=otValue;premiums.push({date:row.date,classification:`${holiday?holiday.type+' ':''}${restDay?'Rest Day ':''}Overtime`.trim(),hours:row.approvedOtHours,multiplier:money(otMultiplier),amount:otValue});}
   otHours+=row.approvedOtHours;lateMinutes+=row.lateMinutes;
  }else if(holiday?.type==='Regular Holiday'){
   // Statutory unworked holiday entitlement depends on qualifying attendance/paid leave
   // before the holiday, potentially in a PREVIOUS cutoff. Unknown != unpaid.
   const history=allAttendance.filter(r=>r.date<row.date).sort((a,b)=>b.date.localeCompare(a.date));
   const previousWork=history.find(r=>r.status!=='Rest Day'&&!r.scheduledRestDay&&(!isOps||opsDayClassification(person.id,r.date,args.schedules??[],args.permits??[]).kind==='Working Day'));
   if(!previousWork){issues.push(`${row.date}: preceding qualifying workday evidence missing for unworked regular holiday`)}
   else if(previousWork.status==='Present'){basic+=dayRate;premiums.push({date:row.date,classification:'Unworked Regular Holiday — Eligible Basic',hours:0,multiplier:100,amount:dayRate})}
   else if(previousWork.status==='On Leave'){issues.push(`${row.date}: preceding approved paid-leave status requires independent review`)}
   else {warnings.push(`${row.date}: preceding workday ${previousWork.date} was ${previousWork.status}; review statutory entitlement`);issues.push(`${row.date}: unworked regular holiday eligibility needs Payroll decision`)}
  }
 }
 // Company attendance rule is monitored on BOTH sides, but must never independently
 // forfeit earned statutory holiday wages.
 for(const h of holidays){
  const offDates=allAttendance.filter(r=>r.status==='Rest Day'||r.scheduledRestDay).map(r=>r.date);
  if(isOps){for(const schedule of args.schedules??[]){if(schedule.employeeId===person.id&&schedule.status==='Published')offDates.push(...schedule.offDates)}}
  const findings=holidayAttendanceReview(h.date,allAttendance.map(r=>({date:r.date,status:r.status})),offDates);
  for(const item of findings){if(item.status==='Needs Review'||item.status==='Missing Record')warnings.push(`${h.date} ${item.side}: ${item.status} (${item.checkedDate??'no schedule'}); HR company-attendance review only`)}
 }
 const outputBasic=money(basic),outputOt=money(ot),extra=money(holidayExtra),late=money(lateDeduction);
 const gross=money(outputBasic+outputOt+extra);
 if(cfg.rateChanges.some(r=>r.employeeId===person.id&&r.effective>periodStart&&r.effective<=periodEnd))warnings.push('Salary changed within cutoff; verify government contribution and withholding bases against period-specific earnings.');
 const uniqueIssues=[...new Set(issues)],uniqueWarnings=[...new Set(warnings)];
 return {ready:uniqueIssues.length===0,issues:uniqueIssues,warnings:uniqueWarnings,basic:outputBasic,ot:outputOt,holidayExtra:extra,gross,lateDeduction:late,workedDays,scheduledDays,lateMinutes,otHours,basicRates,premiums,dailyRate:basicRates[0]?.rate??0,hourlyRate:money((basicRates[0]?.rate??0)/8)};
}
