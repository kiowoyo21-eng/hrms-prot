"use client";
import {useEffect,useMemo,useState} from "react";
import {ClipboardCheck,Info,ShieldAlert,CheckCircle2,ArrowRight} from "lucide-react";
import type {Branch,Role} from "../lib/mock";
import {useHR,money} from "../lib/hrState";
import {activeDemoUser} from "../lib/spreadsheetStore";
import {writeAuditEvent} from "../lib/auditTrail";
import {blankFinalPayAmounts,blankFinalPayReferences,createFinalPay,finalPayBlockers,finalPayFields,finalPayReferenceFields,finalPayRole,finalPaySummary,reviseFinalPay,transitionFinalPay,reviewClearance,noteExternalPayment,closeSeparationReview,type FinalPayAmounts,type FinalPayCase,type FinalPayReferences} from "../lib/finalPayReview";
import styles from "./FinalPayReviewPanel.module.css";
import {reconciliationForEmployee,finalPayDeadlineState,type ThirteenthSettlement} from "../lib/thirteenthSettlement";
import {philippineToday} from "../lib/companyWeeklyPayroll";
import {browserLeaveBalance} from "../lib/leavePolicy";
import {HrmsDialog} from "./ui/HrmsPrimitives";

export default function FinalPayReviewPanel({branch,role}:{branch:Branch;role:Role}){
 const {data,update}=useHR();
 const [selectedId,setSelectedId]=useState("");
 const [message,setMessage]=useState("");
 const [reason,setReason]=useState("");
 const [amounts,setAmounts]=useState<FinalPayAmounts>(blankFinalPayAmounts);
 const [references,setReferences]=useState<FinalPayReferences>(blankFinalPayReferences);
 const [lastWorkingDay,setLastWorkingDay]=useState("");
 const [notes,setNotes]=useState("");
 const [clearanceStatus,setClearanceStatus]=useState<"In Progress"|"Cleared"|"Outstanding Issues">("In Progress");
 const [clearanceNote,setClearanceNote]=useState("");
 const [paymentEvidence,setPaymentEvidence]=useState("");
 const [actualPaymentDate,setActualPaymentDate]=useState("");
 const [settlementSnapshot,setSettlementSnapshot]=useState<ThirteenthSettlement|undefined>();
 const cases=useMemo(()=>[...(data.finalPayCases||[])].filter(x=>branch==="All Shops"||x.branch===branch).sort((a,b)=>b.createdAt.localeCompare(a.createdAt)),[data.finalPayCases,branch]);
 const eligible=useMemo(()=>[...(data.lifecycleCases||[])].filter(x=>x.action==="Offboard"&&x.status==="Applied (Demo)"&&(branch==="All Shops"||x.sourceBranch===branch)&&data.people.some(p=>p.id===x.employeeId&&p.status==="Clearance Pending"&&p.branch===x.sourceBranch)&&!(data.finalPayCases||[]).some(f=>f.lifecycleCaseId===x.id)),[data.lifecycleCases,data.people,data.finalPayCases,branch]);
 const record=cases.find(x=>x.id===selectedId);
 useEffect(()=>{if(!record){setAmounts(blankFinalPayAmounts());setReferences(blankFinalPayReferences());setLastWorkingDay("");setNotes("");setSettlementSnapshot(undefined);return;}setAmounts({...record.amounts});setReferences({...record.references});setLastWorkingDay(record.lastWorkingDay);setNotes(record.notes);setSettlementSnapshot(record.thirteenthSnapshot);setReason("");setClearanceStatus(record.clearanceStatus==="Cleared"?"Cleared":record.clearanceStatus==="Outstanding Issues"?"Outstanding Issues":"In Progress");setClearanceNote(record.clearanceNote||"");},[selectedId,record?.status]);
 useEffect(()=>{if(selectedId&&!cases.some(x=>x.id===selectedId)){setSelectedId("");setMessage("");}},[branch,cases,selectedId]);
 const actor=()=>{const active=activeDemoUser();return active&&active.role===role&&finalPayRole(active.role)?active:null;};
 const canEdit=!!record&&["Draft","Returned for Correction"].includes(record.status)&&finalPayRole(role);
 const persist=(next:FinalPayCase,action:string,beforeStatus:string)=>{
  update(state=>({...state,finalPayCases:(state.finalPayCases||[]).map(x=>x.id===next.id?next:x)}));
  writeAuditEvent({module:"Final Pay Review",action,recordId:next.id,beforeStatus,afterStatus:next.status,summary:"Demo review action; amounts and reference contents redacted"});
 };
 const create=(caseId:string)=>{
  const user=actor();if(!user){setMessage("An active HR session is required.");return;}
  const id=`FP-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
  const outcome=createFinalPay(data,caseId,user.username,user.role,new Date().toISOString(),id);
  if(!outcome.ok){setMessage(outcome.error);return;}
  update(state=>{const r=createFinalPay(state,caseId,user.username,user.role,new Date().toISOString(),id);return r.ok?{...state,finalPayCases:[...(state.finalPayCases||[]),r.record]}:state;});
  writeAuditEvent({module:"Final Pay Review",action:"Created draft",recordId:id,beforeStatus:"None",afterStatus:"Draft",summary:"Offboarding final-pay preparation; amounts not verified"});
  setSelectedId(id);setMessage("Final-pay draft created. No payment or final approval has occurred.");
 };
 const save=()=>{
  const user=actor();if(!user||!record){setMessage("HR session or record no longer available.");return;}
  const next=reviseFinalPay(record,user.username,user.role,new Date().toISOString(),{amounts,references,lastWorkingDay,notes,thirteenthSnapshot:settlementSnapshot});
  if(!next.ok){setMessage(next.error);return;}
  persist(next.record,"Updated draft",record.status);setMessage("Browser-only preparation saved. Verify the supporting figures before requesting review.");
 };
 const decide=(action:"Submit"|"Review"|"Return"|"Handoff")=>{
  const user=actor();if(!user||!record){setMessage("HR session or record no longer available.");return;}
  const outcome=transitionFinalPay(data,record,action,user.username,user.role,new Date().toISOString(),reason);
  if(!outcome.ok){setMessage(outcome.error);return;}
  if(action==="Handoff"&&!window.confirm("Record demo Accounting handoff? This does not send data, approve payment, or authorize release."))return;
  persist(outcome.record,action,record.status);setReason("");setMessage(action==="Handoff"?"Accounting handoff recorded LOCALLY only. Actual submission and payment approvals are NOT connected.":`Updated to ${outcome.record.status}.`);
 };

 const saveClearance=()=>{const user=actor();if(!user||!record)return;const out=reviewClearance(data,record,user.username,user.role,new Date().toISOString(),clearanceStatus,clearanceNote);if(!out.ok){setMessage(out.error);return;}persist(out.record,"Updated clearance",record.clearanceStatus||"Pending");setMessage("Clearance review saved separately from final-pay amounts.");};
 const notePayment=()=>{const user=actor();if(!user||!record)return;if(!actualPaymentDate){setMessage("Record the actual external payment date before saving evidence.");return;}if(!window.confirm("Record the EXTERNAL payment reference? This browser demo does not verify or send a bank payment."))return;const out=noteExternalPayment(record,user.username,user.role,new Date().toISOString(),paymentEvidence,actualPaymentDate);if(!out.ok){setMessage(out.error);return;}persist(out.record,"Recorded external payment reference",record.status);setMessage("External payment evidence recorded in demo only; no bank transfer made.");};
 const finishOffboarding=()=>{const user=actor();if(!user||!record)return;const out=closeSeparationReview(data,record,user.username,user.role,new Date().toISOString(),reason);if(!out.ok){setMessage(out.error);return;}update(state=>({...state,finalPayCases:(state.finalPayCases||[]).map(c=>c.id===record.id?out.record:c),people:state.people.map(p=>p.id===record.employeeId?{...p,status:"Separated",timeline:[`${new Date().toISOString().slice(0,10)} · Offboarding record closed (demo) · ${record.id}`,...p.timeline]}:p)}));writeAuditEvent({module:"Final Pay & Clearance",action:"Closed separation (Demo)",recordId:record.id,summary:"Closure recorded; external payment not verified by HRMS"});setMessage("Separation marked Closed (Demo). This is not confirmation by Accounting or the bank.");};
 const lifecycle=record?(data.lifecycleCases||[]).find(c=>c.id===record.lifecycleCaseId):undefined;
 const deadline=lifecycle?.effectiveDate?finalPayDeadlineState(lifecycle.effectiveDate,philippineToday(),Boolean(record?.paymentAt)):null;
 const targetDate=deadline?.due||"";
 const employee=record?data.people.find(p=>p.id===record.employeeId):undefined;
 const currentThirteenth=employee&&lifecycle?reconciliationForEmployee(data,employee,Number(lifecycle.effectiveDate.slice(0,4)),lifecycle.effectiveDate):undefined;
 const leavePreview=employee&&lifecycle?browserLeaveBalance(employee,lifecycle.effectiveDate):null;
 const syncThirteenth=()=>{if(!currentThirteenth)return;setSettlementSnapshot(currentThirteenth);setAmounts(old=>({...old,thirteenthAdjustment:currentThirteenth!.outstanding}));setMessage(currentThirteenth.complete?"Verified 13th-month reconciliation applied; save the draft to retain it.":"Incomplete 13th-month basis. Missing salary periods must be reconciled before review or handoff.");};
 const nextAction=!record?"Select a separation case":record.closedAt?"Completed in browser demo":record.clearanceStatus!=="Cleared"?"HR must finish or document outstanding clearance issues":record.status==="Draft"?"Save preparation and submit for independent HR review":record.status==="For HR Review"?"Independent HR reviewer must check the source figures":record.status==="HR Reviewed"?"Record handoff to Accounting":record.status==="Accounting Handoff (Demo)"?"Record actual external payment evidence after Accounting confirms":record.status==="Payment Recorded (Demo)"?"Review separation closure":"HR review and reconciliation";
 const computed=finalPaySummary(amounts);
 const blockers=record?finalPayBlockers(data,{...record,amounts,references,lastWorkingDay}):[];
 return <div className={styles.root}>
  <div className={styles.notice}><Info size={18}/><div><strong>Final-pay preparation — frontend demonstration only</strong><p>HR verifies the source records and itemizes preliminary amounts. Accounting must independently confirm all liabilities and payment details. Verified 13th-month figures are calculated where complete payslip records exist; all other final-pay components need independent verification. This module does not transmit a request to Accounting, approve disbursement, or release funds.</p></div></div>
  {message&&<div role="status" className={styles.message}>{message}<button type="button" className="secondary" onClick={()=>setMessage("")}>Dismiss</button></div>}
  <div className={styles.twoCols}>
   <section className="panel"><h3>Eligible Offboarding Handoffs</h3><p className="muted">Approved offboarding cases awaiting an independently reviewed clearance and final-pay record.</p>
    {eligible.length?eligible.map(c=>{const person=data.people.find(p=>p.id===c.employeeId);return <div key={c.id} className={styles.listRow}><div><b>{person?.name||c.employeeId}</b><small>{c.sourceBranch} · Case {c.id} · Effective {c.effectiveDate}</small></div><button type="button" className="secondary" disabled={!finalPayRole(role)} onClick={()=>create(c.id)}>Prepare</button></div>}):<p className="muted">No eligible offboarding handoffs awaiting final-pay preparation.</p>}
   </section>
   <section className="panel"><h3>Final-Pay Review Register</h3><p className="muted">Scoped to {branch}. Records remain separate from regular payslip batches.</p>
    {cases.length?cases.map(c=>{const person=data.people.find(p=>p.id===c.employeeId);const linked=(data.lifecycleCases||[]).find(l=>l.id===c.lifecycleCaseId);const deadline=linked?.effectiveDate?finalPayDeadlineState(linked.effectiveDate,philippineToday(),Boolean(c.paymentAt)):null;return <button type="button" key={c.id} className={`${styles.recordChoice} ${selectedId===c.id?styles.active:""}`} onClick={()=>{setSelectedId(c.id);setMessage("")}}><span><b>{person?.name||c.employeeId}</b><small>{c.id} · {c.branch} · Due {deadline?.due||"—"}</small></span><span className={styles.status}>{deadline?.status==="Overdue"?"OVERDUE · ":""}{c.status}</span></button>}):<p className="muted">No final-pay preparation records in this branch.</p>}
   </section>
  </div>
  <HrmsDialog open={Boolean(record)} title={record?`${record.id} — Final Pay & Clearance`:"Final Pay"} onClose={()=>setSelectedId("")} size="xl"><section className="panel" key={record?.id}>
   {record&&<><header className={styles.sectionHead}><div><h3><ClipboardCheck size={19}/> {record.id} — Review Details</h3><p className="muted">Lifecycle: {record.lifecycleCaseId} · Prepared by {record.createdBy} · {record.status}</p></div><button type="button" className="secondary" onClick={()=>setSelectedId("")}>Close</button></header>
   <div className={styles.statusFacts}>
    <div><small>Clearance</small><strong>{record.clearanceStatus||"Pending"}</strong></div>
    <div><small>Final Pay</small><strong>{record.status}</strong></div>
    <div><small>Separation effective</small><strong>{lifecycle?.effectiveDate||"Unrecorded"}</strong></div>
    <div><small>Target final-pay date (30 days)</small><strong>{targetDate||"—"}{deadline&&deadline.status!=="Paid"?` · ${deadline.status}`:""}</strong></div>
   </div>
   {currentThirteenth&&<section className={styles.reviewBox}>
    <h4>Prorated 13th-Month Pay — {currentThirteenth.year}</h4>
    <div className={styles.statusFacts}>
     <div><small>Verified basic salary earned</small><strong>{money(currentThirteenth.eligibleBasic)}</strong></div>
     <div><small>Gross entitlement (÷12)</small><strong>{money(currentThirteenth.grossEntitlement)}</strong></div>
     <div><small>Already released this year</small><strong>{money(currentThirteenth.alreadyPaid)}</strong></div>
     <div><small>Outstanding amount</small><strong>{money(currentThirteenth.outstanding)}</strong></div>
    </div>
    <p className="muted">Only matched released payslip basic-pay figures are counted. Simulated attendance and gross wages are excluded. Partial or missing cutoffs require reconciliation.</p>
    {currentThirteenth.issues.map((issue,i)=><p key={i} className={styles.blockers}>{issue}</p>)}
    <button type="button" className="secondary" disabled={!canEdit||!currentThirteenth.complete} onClick={syncThirteenth}>Apply verified 13th-month amount to final pay</button>
   </section>}
   {leavePreview&&<p className="muted">Unused pooled paid-leave balance as of separation: <strong>{leavePreview.available} day(s)</strong>. Cash conversion must be independently valued and verified by HR based on statutory/company entitlement, salary history, and previously converted or paid leave; this is not an automatic cash liability. {!leavePreview.verifiedOpening&&"Historical opening balances are not verified."}</p>}
   <p role="status" className={styles.nextAction}><b>Next action:</b> {nextAction}. A pending asset is an accountability follow-up, not an automatic wage deduction.</p>
   <div className={styles.twoCols}>
    <div><label className={styles.label}>Last working day<input type="date" disabled={!canEdit} value={lastWorkingDay} onChange={e=>setLastWorkingDay(e.target.value)}/></label><h4>Verified earnings and deductions</h4><p className="muted">Enter documented amounts only; zero means not entered or not applicable and requires independent review.</p>
     <div className={styles.inputs}>{finalPayFields.map(([key,title])=><label key={key} className={styles.label}>{title}<input type="number" min="0" step="0.01" disabled={!canEdit} value={amounts[key]} onChange={e=>setAmounts(v=>({...v,[key]:Number(e.target.value)}))}/></label>)}</div>
     <div className={styles.totals}><span>Provisional gross: <b>{money(computed.gross)}</b></span><span>Deductions: <b>{money(computed.deductions)}</b></span><span>Provisional net: <b>{money(computed.net)}</b></span></div>
    </div>
    <div><h4>Verification references</h4><p className="muted">Reference IDs/notes only. Do not enter bank details or government identification numbers.</p>
     <div className={styles.inputs}>{finalPayReferenceFields.map(([key,title])=><label key={key} className={styles.label}>{title}<input disabled={!canEdit} maxLength={300} value={references[key]} placeholder="Source record / reviewer reference" onChange={e=>setReferences(v=>({...v,[key]:e.target.value}))}/></label>)}</div>
     <label className={styles.label}>Preparation notes<textarea rows={3} maxLength={1500} disabled={!canEdit} value={notes} onChange={e=>setNotes(e.target.value)}/></label>
     {blockers.length>0&&<div className={styles.blockers}><strong><ShieldAlert size={16}/> Review requirements</strong>{blockers.map((b,i)=><p key={i}>{b}</p>)}</div>}
    </div>
   </div>
   <div className={styles.actions}>{canEdit&&<button type="button" className="secondary" onClick={save}>Save preparation</button>}{record.status==="Draft"&&<button type="button" className="primary" onClick={()=>decide("Submit")}>Submit saved draft for HR review <ArrowRight size={15}/></button>}
   {record.status==="For HR Review"&&<button type="button" className="primary" onClick={()=>decide("Review")}>Confirm independent HR review</button>}
   {record.status==="HR Reviewed"&&<button type="button" className="primary" onClick={()=>decide("Handoff")}>Record Accounting handoff (Demo)</button>}
   {["For HR Review","HR Reviewed"].includes(record.status)&&<button type="button" className="secondary" onClick={()=>decide("Return")}>Return for correction</button>}
   </div>
   {["For HR Review","HR Reviewed"].includes(record.status)&&<label className={styles.label}>Review decision reference (required, 8+ characters)<input maxLength={300} placeholder="Review evidence / correction reason" value={reason} onChange={e=>setReason(e.target.value)}/></label>}
   {record.status==="Accounting Handoff (Demo)"&&<p className={styles.notice}><CheckCircle2 size={18}/> Local preparation handoff recorded. Accounting has NOT received this and no disbursement is authorized.</p>}
   <section className={styles.reviewBox}>
    <h4>Independent Clearance Review</h4>
    <p className="muted">Asset custody is tracked separately; an outstanding asset does not automatically reduce or suspend final pay.</p>
    <p>Current: <b>{record.clearanceStatus||"Pending"}</b></p>
    {record.clearanceAt&&<small>Last reviewed: {record.clearanceAt} · {record.clearanceBy}</small>}
    <label className={styles.label}>Clearance status<select value={clearanceStatus} disabled={Boolean(record.closedAt)} onChange={e=>setClearanceStatus(e.target.value as typeof clearanceStatus)}><option>In Progress</option><option>Outstanding Issues</option><option>Cleared</option></select></label>
    <label className={styles.label}>Evidence / outstanding items<textarea value={clearanceNote} onChange={e=>setClearanceNote(e.target.value)} rows={2} placeholder="Reference and accountable reviewer"/></label>
    <button type="button" className="secondary" disabled={Boolean(record.closedAt)} onClick={saveClearance}>Record Clearance Review</button>
   </section>
   <section className={styles.reviewBox}>
    <h4>External Accounting Payment & Separation Closure</h4>
    <p className="muted">HRMS does not send payments. Record external evidence only after Accounting actually confirms release.</p>
    {record.paymentReference&&<p>Recorded reference: <b>{record.paymentReference}</b> · {record.paymentAt}</p>}
    {record.status==="Accounting Handoff (Demo)"&&<><label className={styles.label}>External payment proof reference<input value={paymentEvidence} onChange={e=>setPaymentEvidence(e.target.value)} placeholder="Accounting voucher or payment reference"/></label><label className={styles.label}>Actual payment date<input type="date" max={philippineToday()} value={actualPaymentDate} onChange={e=>setActualPaymentDate(e.target.value)}/></label><button type="button" className="secondary" onClick={notePayment}>Record External Payment Evidence (Demo)</button></>}
    {record.status==="Payment Recorded (Demo)"&&!record.closedAt&&<><label className={styles.label}>Closure review reference<input value={reason} onChange={e=>setReason(e.target.value)} placeholder="Employee exit / clearance closure reference"/></label><button type="button" className="primary" onClick={finishOffboarding}>Close Offboarding Record (Demo)</button></>}
    {record.closedAt&&<p><strong>Closed (Demo)</strong> · {record.closedAt} · {record.closedBy}</p>}
   </section>
   <h4>Review Timeline</h4><div className={styles.timeline}>{[...record.history].reverse().map((e,i)=><div key={`${e.at}-${i}`}><b>{e.from} → {e.to}</b><small>{e.at} · {e.actor} · {e.action}</small><p>{e.reference}</p></div>)}</div>
  </>}</section></HrmsDialog>
 </div>;
}
