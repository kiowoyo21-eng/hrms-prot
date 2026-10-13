"use client";
import type {PayrollRelease} from "./hrState";
import type {Person} from "./people";
import type {PayslipDraft} from "./payrollConfig";

const esc=(value:unknown)=>String(value??"—").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]||char));
const peso=(n:number)=>`₱${Number(n).toLocaleString("en-PH",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const fmt=(s:string)=>new Date(`${s}T12:00:00`).toLocaleDateString("en-PH",{day:"numeric",month:"short",year:"numeric"});
export function printFormalPayslip(release:PayrollRelease,employee:Person|undefined,draft:PayslipDraft|undefined,paper:"A4"|"Letter"="A4"){
 const popup=window.open("","_blank");if(!popup){window.alert("Allow pop-ups to preview the payslip.");return}
 const logo=`${window.location.origin}/underchargers-document-logo.png`;
 const row=(title:string,number:number)=>`<tr><th>${esc(title)}</th><td>${peso(number)}</td></tr>`;
 const line=(title:string,value:unknown)=>`<div class="detail"><span>${esc(title)}</span><strong>${esc(value)}</strong></div>`;
 const complete=Boolean(draft&&typeof draft.basicPay==="number"&&Array.isArray(draft.deductionBreakdown));
 const rate=draft?.dailyRate;
 const balanced=Math.abs((release.gross-release.deductions)-release.net)<0.02;
 const earningsBalance=complete&&draft?Math.abs((draft.basicPay||0)+(draft.otPay||0)+draft.allowances+draft.holidayExtra-release.gross)<0.02:true;
 const deductionBalance=complete&&draft?Math.abs((draft.deductionBreakdown||[]).reduce((s,row)=>s+row.employee,0)+(draft.loanDeduction||0)+(draft.manualDeduction||0)-release.deductions)<0.02:true;
 const items=complete&&draft?[
 row("Basic Pay (including any approved paid leave)",draft.basicPay||0),
 row("Approved Overtime Pay",draft.otPay||0),
 row("Additional Holiday Premium",draft.holidayExtra||0),
 row("Allowances / Bonus",draft.allowances||0),
 `<tr class="total"><th>GROSS EARNINGS</th><td>${peso(release.gross)}</td></tr>`
 ].join(""): `<tr><td colspan="2" class="missing">Legacy record: original itemized earnings were not saved. No amounts have been fabricated.</td></tr><tr class="total"><th>RECORDED GROSS</th><td>${peso(release.gross)}</td></tr>`;
 const deduct=complete&&draft?[
 ...draft.deductionBreakdown!.map(v=>row(`${v.agency} — employee share`,v.employee)),
 row("Loans / Cash Advances",draft.loanDeduction||0),row("Other Authorized Deductions",draft.manualDeduction||0),
 `<tr class="total"><th>TOTAL DEDUCTIONS</th><td>${peso(release.deductions)}</td></tr>`
 ].join(""):`<tr><td colspan="2" class="missing">Legacy record: deduction categories were not saved. Breakdown unavailable.</td></tr><tr class="total"><th>RECORDED DEDUCTIONS</th><td>${peso(release.deductions)}</td></tr>`;
 const attendance=complete&&draft?[
 line("Daily Rate / Equivalent",rate===undefined?"Not recorded":peso(rate)),line("Actually Worked",`${draft.workedDays??draft.days} days`),line("Paid Hours Worked",draft.workedHours===undefined?"Not stored":`${draft.workedHours.toFixed(2)} hours`),
 line("Approved Paid Leave",`${draft.paidLeaveDays??0} days`),line("Unpaid Leave",`${draft.unpaidLeaveDays??0} days`),
 line("Late",`${draft.lateMinutes??0} minutes`),line("Overtime",`${draft.otHours} hours`),
 line("Attendance source",draft.attendanceSource||"Payroll review")
 ].join(""): `<div class="missing">Days worked, daily rate, time records and detailed earnings were not stored with this legacy release. Create a new attendance-linked demo draft for a complete payslip.</div>`;
 popup.document.write(`<!doctype html><html lang="en"><head><meta charset="utf-8"/><title>${esc(`Payslip ${release.employeeId} ${release.periodEnd}`)}</title>
 <style>@page{size:${paper};margin:12mm}*{box-sizing:border-box}body{font:10.5pt/1.45 Arial,Helvetica,sans-serif;color:#182337;background:#fff;max-width:186mm;margin:0 auto;padding:12px 0}.toolbar{display:flex;justify-content:flex-end;gap:8px;margin:0 0 12px}.toolbar button{padding:8px 12px;cursor:pointer;border:1px solid #d6dce6;border-radius:6px;background:#fff}.brand{text-align:center;border-bottom:2px solid #e6b52d;padding-bottom:12px;margin-bottom:16px}.brand img{display:block;object-fit:contain;width:205px;max-height:115px;margin:0 auto 4px}.brand h1{font-size:15pt;letter-spacing:1.2px;margin:4px 0}.sub{font-size:9pt;color:#677488}.blocktitle{font-size:10pt;text-transform:uppercase;letter-spacing:.6px;border-bottom:1px solid #d9dee8;padding-bottom:5px;margin:17px 0 8px}.details{display:grid;grid-template-columns:1fr 1fr;gap:5px 22px}.detail{display:flex;justify-content:space-between;gap:10px;font-size:9.5pt;border-bottom:1px solid #e8ebf0;padding:5px 0}.detail span{color:#596578}.detail strong{text-align:right}.split{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}table{width:100%;border-collapse:collapse;font-size:9pt}th,td{text-align:left;padding:7px 5px;border-bottom:1px solid #e8ebf0}td{text-align:right;white-space:nowrap}.total{background:#f5f7f9;font-weight:700}.missing{white-space:normal;text-align:left;color:#9a6315;background:#fffaf0;line-height:1.6}.net{display:flex;align-items:center;justify-content:space-between;border:2px solid #e1ad21;padding:12px 16px;margin-top:18px;background:#fffbf1}.net b{font-size:17pt}.sign{display:grid;grid-template-columns:1fr 1fr;gap:42px;margin-top:36px}.line{border-top:1px solid #617080;text-align:center;font-size:9pt;padding-top:6px}.disclaimer{font-size:8pt;color:#647184;margin-top:20px;border-top:1px solid #e5e7eb;padding-top:9px}@media print{body{margin:0;padding:0;max-width:none}.toolbar{display:none}.split,.details,.net,.sign{break-inside:avoid}}</style></head><body>
 <div class="toolbar"><button onclick="window.print()">Print / Save PDF</button><button onclick="window.close()">Close</button></div>
 <header class="brand"><img src="${esc(logo)}" alt="Underchargers logo"/><h1>EMPLOYEE PAYSLIP</h1><div class="sub">${complete?"DEMO REVIEW — NOT OFFICIAL PAYROLL":"LEGACY DEMO RECORD — INCOMPLETE DETAIL"} · ${esc(release.id)}</div></header>
 <div class="details">${[
 ["Employee",employee?.name||release.employeeId],["Employee ID",release.employeeId],["Department",employee?.department||"—"],["Branch",employee?.branch||"—"],
 ["Salary Type",draft?.salaryType||employee?.salaryType||"—"],["Rate",draft?.dailyRate!==undefined?(draft.salaryType==="Monthly"?`${peso(draft.dailyRate)} daily equivalent (÷26)`: `${peso(draft.dailyRate)} / day`):"Not stored for this release"],
 ["Pay Period",`${fmt(release.periodStart)} – ${fmt(release.periodEnd)}`],["Release Date",fmt(release.paidAt)]
 ].map(([a,b])=>line(a,b)).join("")}</div>
 <h2 class="blocktitle">Attendance & Rate Summary</h2><div class="details">${attendance}</div>
 <div class="split"><section><h2 class="blocktitle">Earnings</h2><table><tbody>${items}</tbody></table></section><section><h2 class="blocktitle">Deductions</h2><table><tbody>${deduct}</tbody></table></section></div>
 <div class="net"><strong>NET PAY · TAKE-HOME</strong><b>${peso(release.net)}</b></div>${!balanced||!earningsBalance||!deductionBalance?`<p class="missing" style="padding:10px">WARNING: Saved payslip totals require reconciliation. Do not issue until amounts agree.</p>`:""}
 <div class="sign"><div class="line">Prepared / Authorized by</div><div class="line">Employee Acknowledgment / Date</div></div>
 <footer class="disclaimer">${complete?"DEMO ONLY. Time records, salary divisors, rest/holiday rules, government contributions and disbursements must be checked before actual payroll processing.":"Legacy sample totals only. Supporting payroll lines and attendance are unavailable; this is not a verified or issuable payslip."} Normal schedule reference: 08:00–17:00, assuming one unpaid lunch hour.</footer></body></html>`);
 popup.document.close();popup.focus();
}
