"use client";
import {useEffect,useState} from "react";
import {FORM_STORE_EVENT,readForms,type HRFormRecord} from "../lib/hrForms";
import {requestOpenInHRMS} from "../lib/requestNavigation";
import styles from "./RequestReview.module.css";
/** Read-only cross-reference; never edits/duplicates an operational request. */
export default function EmployeeRequestHistoryPanel({employeeId}:{employeeId:string}){
 const [records,setRecords]=useState<HRFormRecord[]>([]);
 useEffect(()=>{const sync=()=>setRecords(readForms().filter(r=>r.employeeId===employeeId).sort((a,b)=>b.createdAt.localeCompare(a.createdAt)));sync();window.addEventListener(FORM_STORE_EVENT,sync);return()=>window.removeEventListener(FORM_STORE_EVENT,sync)},[employeeId]);
 return <section className={styles.subsection}><h4>Linked HR Requests ({records.length})</h4>
  {records.length===0?<p className={styles.hint}>No linked HR form requests recorded.</p>:records.slice(0,20).map(r=><div className={styles.attachment} key={r.id}><div><b>{r.kind}</b><small>{r.id} · {r.status} · {r.createdAt.slice(0,10)}</small><small>Approver: {r.route?.approverUsername||"Legacy HR review"}</small></div><button type="button" className="secondary" onClick={()=>requestOpenInHRMS(r.id)}>Open request</button></div>)}
  <p className={styles.hint}>View and decisions remain in Request and Reports. This is a link to the same request record, not a duplicate.</p>
 </section>
}
