"use client";
import {useEffect,useState} from "react";
import {branches,type Branch,type Role} from "../lib/mock";
import {DEFAULT_REVIEWERS,readReviewerAssignments,saveReviewerAssignments,ROUTING_EVENT,type ReviewerAssignment,type AssignedApproverRole} from "../lib/requestRouting";
import {writeAuditEvent} from "../lib/auditTrail";
import styles from "./RequestReview.module.css";
/** Demo configuration only; authenticated server-side assignments required for production. */
export default function RequestRoutingSettings({role,username}:{role:Role;username:string}){
 const [rows,setRows]=useState<ReviewerAssignment[]>([]),[notice,setNotice]=useState("");
 useEffect(()=>{setRows(readReviewerAssignments());const refresh=()=>setRows(readReviewerAssignments());window.addEventListener(ROUTING_EVENT,refresh);return()=>window.removeEventListener(ROUTING_EVENT,refresh)},[]);
 if(role!=="Super Admin")return null;
 const update=(id:string,fields:Partial<ReviewerAssignment>)=>setRows(items=>items.map(x=>x.id===id?{...x,...fields}:x));
 const save=()=>{
  const seen=new Set<string>();
  for(const r of rows){
   if(!r.username.trim()||!r.department.trim()){setNotice("Account and department are required for each assignment.");return}
   if(r.role==="BM"&&r.branch==="All Shops"){setNotice("Each BM must be assigned to a specific branch, not All Shops.");return}
   if(r.role==="HR"&&r.department!=="*"){setNotice('HR fallback assignments must use * as the department.');return}
   const k=r.role==="HR"?[r.username.trim().toLowerCase(),r.role,r.branch,r.department.trim().toLowerCase()].join("|"):[r.role,r.branch,r.department.trim().toLowerCase()].join("|");
   if(seen.has(k)){setNotice("Duplicate assignment. Remove the repeated entry.");return}seen.add(k);
  }
  if(!saveReviewerAssignments(rows)){setNotice("Could not save local assignments.");return}
  writeAuditEvent({module:"HR Forms & Requests",action:"Updated local reviewer assignments",recordId:"reviewer-routing",summary:`${rows.length} reviewer assignments (without exposing private request content)`});
  setNotice("Local routing configuration saved. Submitted requests keep their recorded approver; changes apply to new submissions.");
 };
 return <section className={styles.settings}>
  <div className={styles.titleRow}><div><h3>Request Approver Assignments</h3><p>ADMIN-managed demonstration routing. OPS → BM; other departments → Dept Head; HR fallback if none assigned.</p></div><button type="button" className="secondary" onClick={()=>setRows([...DEFAULT_REVIEWERS])}>Restore demo defaults</button></div>
  <div className={styles.scrollTable}><table><thead><tr><th>Account</th><th>Role</th><th>Branch</th><th>Department</th><th>Enabled</th><th></th></tr></thead><tbody>{rows.map(r=><tr key={r.id}>
   <td><input aria-label="Approver username" value={r.username} onChange={e=>update(r.id,{username:e.target.value})}/></td>
   <td><select aria-label="Approver role" value={r.role} onChange={e=>update(r.id,{role:e.target.value as AssignedApproverRole})}>{["BM","Dept Head","HR"].map(v=><option key={v}>{v}</option>)}</select></td>
   <td><select aria-label="Assignment branch" value={r.branch} onChange={e=>update(r.id,{branch:e.target.value as Branch})}>{branches.map(b=><option key={b}>{b}</option>)}</select></td>
   <td><input aria-label="Assignment department" value={r.department} placeholder="Operations / Marketing / *" onChange={e=>update(r.id,{department:e.target.value})}/></td>
   <td><input aria-label="Assignment active" type="checkbox" checked={r.active} onChange={e=>update(r.id,{active:e.target.checked})}/></td>
   <td><button type="button" className="secondary" onClick={()=>setRows(items=>items.filter(x=>x.id!==r.id))}>Remove</button></td>
  </tr>)}</tbody></table></div>
  <div className={styles.actions}><button type="button" className="secondary" onClick={()=>setRows(items=>[...items,{id:`local-${Date.now()}-${items.length}`,username:"",role:"Dept Head",branch:"All Shops",department:"",active:true}])}>Add assignment</button><button type="button" className="primary" onClick={save}>Save routing</button></div>
  {notice&&<p role="status">{notice}</p>}
  <p className={styles.hint}>Local demo accounts are defined separately in the login screen. This panel does not create secure accounts, grant backend access, or change already submitted approvals.</p>
 </section>
}
