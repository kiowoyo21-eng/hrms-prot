"use client";
import {useMemo,useState} from "react";
import {useHR,money} from "../lib/hrState";
import {activeDemoUser} from "../lib/spreadsheetStore";
import {writeAuditEvent} from "../lib/auditTrail";
import {reconciliationForEmployee} from "../lib/thirteenthSettlement";
import {normalizePayrollConfig,type ThirteenthReview} from "../lib/payrollConfig";
import type {Branch,Role} from "../lib/mock";
import {philippineToday} from "../lib/companyWeeklyPayroll";
import HistoricalBasicLedgerPanel from "./HistoricalBasicLedgerPanel";
import {companyManager} from "../lib/leavePolicy";

/** Review and approval of 13th-month entitlements only; no disbursement is issued. */
export default function ThirteenthMonthReviewPanel({branch,role}:{branch:Branch;role:Role}){
 const {data,update}=useHR();
 const [year,setYear]=useState(Number(philippineToday().slice(0,4)));
 const [selected,setSelected]=useState("");
 const [reference,setReference]=useState("");
 const [message,setMessage]=useState("");
 const [managerCoverageChoice,setManagerCoverageChoice]=useState("included");
 const [managerCoverageReason,setManagerCoverageReason]=useState("");
 const cutoff=`${year}-12-31`<philippineToday()?`${year}-12-31`:philippineToday();
 const cfg=normalizePayrollConfig(data.payrollConfig);
 const employees=data.people.filter(p=>branch==="All Shops"||p.branch===branch);
 const person=employees.find(p=>p.id===selected);
 const preview=person?reconciliationForEmployee(data,person,year,cutoff):undefined;
 const current=cfg.thirteenthReviews.find(r=>r.employeeId===selected&&r.year===year);
 const isFresh=!!preview&&!!current&&current.fingerprint===JSON.stringify(preview);
 const managerial=Boolean(person&&companyManager(person));
 const managerialReview=person?cfg.managerialThirteenthCoverage?.[person.id]:undefined;
 const editable=["HR","Super Admin","Special Final Approver — Ms Kate"].includes(role);
 const user=activeDemoUser();
 const recordManagerialCoverage=()=>{
  if(!editable||!user||user.role!==role||!person||!managerial){setMessage("Authorized HR approval is required.");return;}
  if(managerCoverageReason.trim().length<8){setMessage("Provide an employment-contract or company-policy reference (8+ characters).");return;}
  const covered=managerCoverageChoice==="included";
  if(!window.confirm(`Record managerial 13th-month company coverage as ${covered?"INCLUDED":"EXCLUDED"} for this employee? A legal/policy review must support this decision.`))return;
  const policy={covered,reviewedAt:new Date().toISOString(),reviewedBy:user.username,notes:managerCoverageReason.trim()};
  update(old=>{const c=normalizePayrollConfig(old.payrollConfig);return {...old,payrollConfig:{...c,managerialThirteenthCoverage:{...c.managerialThirteenthCoverage,[person.id]:policy}}}});
  writeAuditEvent({module:"13th-Month Policy Coverage",action:"Reviewed managerial coverage",recordId:person.id,afterStatus:covered?"Included":"Excluded",summary:"Company policy coverage decision, reviewer and evidence reference recorded"});
  setMessage("Managerial 13th-month coverage decision recorded for this employee.");
 };
 const save=(action:"Save"|"Submit"|"Approve")=>{
  if(!editable||!user||user.role!==role||!person||!preview){setMessage("An authorized HR session and employee are required.");return;}
  if(reference.trim().length<8){setMessage("Enter an audit/evidence reference of at least 8 characters.");return;}
  if(!preview.complete){setMessage(`Reconciliation incomplete: ${preview.issues[0]}`);return;}
  if(action==="Submit"&&(!current||current.status!=="Draft"||!isFresh)){setMessage("Save a current draft first.");return;}
  if(action==="Approve"&&(!current||current.status!=="For Review"||!isFresh)){setMessage("Current HR review is required before approval.");return;}
  if(action==="Approve"&&current?.preparedBy===user.username){setMessage("Maker-checker: the preparer cannot approve their own 13th-month review.");return;}
  if(action==="Save"&&current?.status==="Approved"){setMessage("An approved review is locked. Correct this through a separate documented adjustment.");return;}
  const status:ThirteenthReview['status']=action==="Save"?"Draft":action==="Submit"?"For Review":"Approved";
  const saved:ThirteenthReview={employeeId:person.id,year,eligibleBasic:preview.eligibleBasic,amount:preview.outstanding,status,notes:reference.trim(),alreadyPaid:preview.alreadyPaid,preparedBy:action==="Save"?user.username:current?.preparedBy,reviewedBy:action==="Approve"?user.username:undefined,fingerprint:JSON.stringify(preview),updatedAt:new Date().toISOString()};
  update(old=>{const c=normalizePayrollConfig(old.payrollConfig);return {...old,payrollConfig:{...c,thirteenthReviews:[...c.thirteenthReviews.filter(r=>r.employeeId!==selected||r.year!==year),saved]}}});
  writeAuditEvent({module:"13th-Month Review",action:`${action} 13th-month reconciliation`,recordId:`${selected}-${year}`,beforeStatus:current?.status||"None",afterStatus:status,summary:"Verified source snapshot, prior payouts, and review reference recorded; amounts redacted"});
  setMessage(`${status} saved locally. This does not release payment.`);
 };
 return <div className="pc-stack">
  <section className="panel">
   <div className="pc-header"><div><h3>13th-Month Pay · Verified Earnings</h3><p>Basic salary earned ÷ 12, less released 13th-month payments for the same year</p></div><label>Year<input type="number" min="2000" max="2100" value={year} onChange={e=>{setYear(Number(e.target.value));setReference("");setSelected("")}}/></label></div>
   <p className="muted">Only released payroll records with matching basic-pay snapshots count. Missing payroll periods, salary adjustments, and historical imports must be reconciled before approval. Approval is not a payment.</p>
   {message&&<p role="status">{message}</p>}
   <div className="table-wrap"><table><thead><tr><th>Employee</th><th>Verified Basic</th><th>Gross 13th</th><th>Previously Paid</th><th>Balance</th><th>Review</th></tr></thead><tbody>
    {employees.map(p=>{const r=reconciliationForEmployee(data,p,year,cutoff);const saved=cfg.thirteenthReviews.find(x=>x.employeeId===p.id&&x.year===year);const stale=saved&&saved.fingerprint!==JSON.stringify(r);return <tr key={p.id}><td><button type="button" className="secondary" onClick={()=>{setSelected(p.id);setReference(saved?.notes||"");setMessage("")}}>{p.name}</button></td><td>{money(r.eligibleBasic)}</td><td>{money(r.grossEntitlement)}</td><td>{money(r.alreadyPaid)}</td><td>{money(r.outstanding)}</td><td>{!r.complete?`Needs source reconciliation (${r.issues.length})`:stale?"Recheck updated ledger":saved?.status||"Ready for draft"}</td></tr>})}
   </tbody></table></div>
  </section>
  {person&&preview&&<section className="panel"><h3>{person.name} — Calendar Year {year}</h3>
   <div className="pc-field-grid"><div><small>Covered period</small><strong>{preview.start} to {preview.through}</strong></div><div><small>Verified basic earnings</small><strong>{money(preview.eligibleBasic)}</strong></div><div><small>13th-month entitlement</small><strong>{money(preview.grossEntitlement)}</strong></div><div><small>Previously released</small><strong>{money(preview.alreadyPaid)}</strong></div><div><small>Remaining entitlement</small><strong>{money(preview.outstanding)}</strong></div><div><small>Review status</small><strong>{current?.status||"Not started"}{current&&!isFresh?" — stale":""}</strong></div></div>
   {preview.issues.length>0&&<div className="pc-alert pc-attendance-warning"><strong>Not ready for approval</strong>{preview.issues.map((issue,i)=><p key={i}>{issue}</p>)}</div>}
   <div className="table-wrap"><table><thead><tr><th>Released payroll</th><th>From</th><th>To</th><th>Eligible basic salary</th></tr></thead><tbody>{preview.cutoffs.map(c=><tr key={c.id}><td>{c.id}</td><td>{c.from}</td><td>{c.to}</td><td>{money(c.basic)}</td></tr>)}</tbody></table></div>
   {managerial&&<div className="pc-alert subtle"><h4>Managerial 13th-Month Coverage</h4><p>Statutory coverage generally applies to rank-and-file employees. A managerial employee's 13th-month entitlement must be confirmed under an applicable company policy or contract. Do not infer automatic statutory eligibility.</p><p>Current policy: <b>{managerialReview?managerialReview.covered?"Company benefit included":"Reviewed as not included":"Unreviewed"}</b>{managerialReview&&` · ${managerialReview.reviewedBy} · ${managerialReview.reviewedAt.slice(0,10)}`}</p>
    <div className="rev-form"><label>Documented company coverage<select value={managerCoverageChoice} onChange={e=>setManagerCoverageChoice(e.target.value)}><option value="included">Included as company benefit</option><option value="excluded">Not included under reviewed policy</option></select></label><label>Contract / company-policy evidence<input maxLength={300} value={managerCoverageReason} onChange={e=>setManagerCoverageReason(e.target.value)}/></label></div>
    <button type="button" className="secondary" disabled={!editable} onClick={recordManagerialCoverage}>Record Managerial Coverage Review</button>
   </div>}
   <HistoricalBasicLedgerPanel key={`${selected}-${year}`} employeeId={selected} year={year} role={role}/>
   <label className="pc-label">Verification reference / review reason<input value={reference} maxLength={300} onChange={e=>setReference(e.target.value)} placeholder="Verified cutoff reconciliation reference (8+ characters)"/></label>
   <div className="rev-actions"><button className="secondary" disabled={!editable||!preview.complete||current?.status==="Approved"} onClick={()=>save("Save")}>Save Verified Draft</button><button className="secondary" disabled={!editable||!preview.complete||!current||current.status!=="Draft"||!isFresh} onClick={()=>save("Submit")}>Submit for Review</button><button className="primary" disabled={!editable||!preview.complete||!current||current.status!=="For Review"||!isFresh} onClick={()=>save("Approve")}>Approve Review Only</button></div>
  </section>}
 </div>;
}
