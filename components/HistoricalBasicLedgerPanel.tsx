"use client";
import {useState} from "react";
import {useHR,money} from "../lib/hrState";
import {normalizePayrollConfig,type HistoricalBasicLedger} from "../lib/payrollConfig";
import {activeDemoUser} from "../lib/spreadsheetStore";
import {writeAuditEvent} from "../lib/auditTrail";
import type {Role} from "../lib/mock";
import {philippineToday} from "../lib/companyWeeklyPayroll";

/** Controlled reconstruction of historical BASIC pay; never bulk-infer from gross wages. */
export default function HistoricalBasicLedgerPanel({employeeId,year,role}:{employeeId:string;year:number;role:Role}){
 const {data,update}=useHR();
 const [from,setFrom]=useState(`${year}-01-01`),[to,setTo]=useState(`${year}-01-07`),[amount,setAmount]=useState(""),[reference,setReference]=useState(""),[message,setMessage]=useState("");
 const rows=(data.payrollConfig?.historicalBasicLedgers||[]).filter(r=>r.employeeId===employeeId&&r.periodStart.slice(0,4)===String(year)).sort((a,b)=>a.periodStart.localeCompare(b.periodStart));
 const person=data.people.find(p=>p.id===employeeId);
 const authorized=["HR","Super Admin","Special Final Approver — Ms Kate"].includes(role);
 const actor=()=>{const user=activeDemoUser();return user&&user.role===role&&authorized?user:null};
 const add=()=>{
  const user=actor();if(!user||!person){setMessage("Authorized HR access is required.");return;}
  if(!/^\d{4}-\d{2}-\d{2}$/.test(from)||!/^\d{4}-\d{2}-\d{2}$/.test(to)||from>to||from.slice(0,4)!==String(year)||to.slice(0,4)!==String(year)||from<person.hire||to>philippineToday()){
   setMessage("Enter valid dates within the employee's employment period and selected calendar year.");return;
  }
  const basic=Number(amount);
  if(!amount.trim()||!Number.isFinite(basic)||basic<0||Math.abs(Math.round(basic*100)-basic*100)>1e-6){setMessage("Enter eligible BASIC earnings in pesos with at most two decimal places.");return;}
  if(reference.trim().length<8){setMessage("Provide a verified payroll ledger/source reference of at least 8 characters.");return;}
  if(rows.some(r=>r.status!=="Rejected"&&r.periodStart<=to&&r.periodEnd>=from)){
   setMessage("This period overlaps an existing historical ledger entry.");return;
  }
  if(data.payrollReleases.some(r=>r.employeeId===employeeId&&r.kind==="Salary"&&r.status==="Released"&&r.source==="Browser Review"&&r.periodStart<=to&&r.periodEnd>=from)){
   setMessage("This period overlaps an existing released payroll cutoff. Reconcile that cutoff instead.");return;
  }
  const record:HistoricalBasicLedger={id:`HBL-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`,employeeId,periodStart:from,periodEnd:to,eligibleBasic:basic,sourceReference:reference.trim(),status:"Pending Review",createdBy:user.username,createdAt:new Date().toISOString()};
  update(old=>{const c=normalizePayrollConfig(old.payrollConfig);return {...old,payrollConfig:{...c,historicalBasicLedgers:[...(c.historicalBasicLedgers||[]),record]}}});
  writeAuditEvent({module:"13th-Month Historical Basic Ledger",action:"Entered historical basic salary for independent review",recordId:record.id,afterStatus:record.status,summary:"Source reference and amount stored with restricted HR review"});
  setMessage("Historical payroll entry submitted for independent HR verification. Not yet counted.");setAmount("");setReference("");
 };
 const decide=(row:HistoricalBasicLedger,status:"Verified"|"Rejected")=>{
  const user=actor();if(!user){setMessage("Authorized HR access is required.");return;}
  if(row.status!=="Pending Review"||row.createdBy===user.username){setMessage("Independent reviewer required; preparer cannot verify or reject their own entry.");return;}
  if(status==="Verified"){
   const conflict=data.payrollReleases.some(r=>r.employeeId===employeeId&&r.kind==="Salary"&&r.status==="Released"&&r.source==="Browser Review"&&r.periodStart<=row.periodEnd&&r.periodEnd>=row.periodStart);
   if(conflict){setMessage("A newly released payroll cutoff overlaps this historical ledger. Review before verification.");return;}
  }
  update(old=>{const c=normalizePayrollConfig(old.payrollConfig);return {...old,payrollConfig:{...c,historicalBasicLedgers:(c.historicalBasicLedgers||[]).map(r=>r.id===row.id?{...r,status,verifiedBy:user.username,verifiedAt:new Date().toISOString()}:r)}}});
  writeAuditEvent({module:"13th-Month Historical Basic Ledger",action:status==="Verified"?"Verified historical basic salary":"Rejected historical basic salary",recordId:row.id,beforeStatus:row.status,afterStatus:status,summary:"Independent reviewer recorded decision; source retained"});
  setMessage(`${status} by independent reviewer. Payroll reconciliation will recalculate.`);
 };
 return <div className="pc-stack">
  <h4>Historical Basic Earnings Reconciliation</h4>
  <p className="muted">For payroll periods not recorded in this browser-only HRMS. One entry per non-overlapping period; a separate HR reviewer must verify the source before the amount contributes to 13th-month pay.</p>
  {message&&<p role="status">{message}</p>}
  <div className="rev-form"><label>From<input type="date" value={from} onChange={e=>setFrom(e.target.value)}/></label><label>To<input type="date" value={to} onChange={e=>setTo(e.target.value)}/></label><label>Eligible basic earnings (₱)<input type="number" min="0" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)}/></label><label>Payroll ledger or payslip reference<input maxLength={300} value={reference} onChange={e=>setReference(e.target.value)}/></label></div>
  <button type="button" className="secondary" disabled={!authorized} onClick={add}>Add Historical Earnings for Review</button>
  <div className="table-wrap"><table><thead><tr><th>Period</th><th>Eligible Basic</th><th>Source</th><th>Review</th><th>Action</th></tr></thead><tbody>{rows.map(row=><tr key={row.id}><td>{row.periodStart} – {row.periodEnd}</td><td>{money(row.eligibleBasic)}</td><td>{row.sourceReference}</td><td>{row.status}{row.verifiedBy?` · ${row.verifiedBy}`:""}</td><td>{row.status==="Pending Review"&&<><button type="button" className="secondary" disabled={!authorized} onClick={()=>decide(row,"Verified")}>Verify</button><button type="button" className="secondary" disabled={!authorized} onClick={()=>decide(row,"Rejected")}>Reject</button></>}</td></tr>)}</tbody></table></div>
 </div>;
}
