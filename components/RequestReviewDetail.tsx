"use client";
import type {HRFormRecord} from "../lib/hrForms";
import {formSchemas} from "../lib/hrForms";
import {hasHRFormFile,openHRFormFile} from "../lib/hrFormEvidence";
import InlineRequestForm from "./formPrint/InlineRequestForm";
import type {Role} from "../lib/mock";
import {useState} from "react";
import FormPrintPreview from "./formPrint/FormPrintPreview";
import styles from "./RequestReview.module.css";
import {FileText,Printer,Paperclip,ClipboardCheck,Clock3,ArrowLeft} from "lucide-react";
const pretty=(v:string)=>{const d=new Date(v);return Number.isNaN(d.valueOf())?v:d.toLocaleString("en-PH",{timeZone:"Asia/Manila",dateStyle:"medium",timeStyle:"short"})};
export default function RequestReviewDetail({record,employeeName,position,department,username,role,canDecide,remarks,onRemarks,onAction,onAttachment,onVerify,onEdit,onAssistResubmit,onDownload,onBack}:{
 record:HRFormRecord;employeeName:string;position?:string;department?:string;username:string;role:Role;canDecide:boolean;remarks:string;onRemarks:(v:string)=>void;
 onAction:(action:"Approve"|"Reject"|"Return"|"Request Documents")=>void;onAttachment:(file:File|null)=>void;
 onVerify:(id:string,decision:"Verified"|"Rejected")=>void;onEdit:()=>void;onAssistResubmit:()=>void;onDownload:()=>void;onBack:()=>void;
}){
 const [printing,setPrinting]=useState(false);
 const editable=["Draft","Returned for Revision","For Additional Documents"].includes(record.status)&&record.requestor===username;
 const needsDocs=record.status==="For Additional Documents";
 const assistedHandoff=record.source==="Employee Handoff (Unverified)"&&["For Additional Documents","Returned for Revision"].includes(record.status)&&role==="HR"&&record.route?.approverUsername!==username;
 const attachments=record.attachments||[];
 return <section className={styles.detail} aria-label="Request detail and approval">
  <header className={styles.detailHeader}>
   <div><button type="button" onClick={onBack} className={styles.backButton}><ArrowLeft size={15}/> Back to list</button><h3>{record.kind}</h3><p>{record.id} · {employeeName} · {record.branch}</p></div>
   <div className={styles.detailStatus}><span data-status={record.status}>{record.status}</span><small>Assigned to {record.route?.approverUsername||"HR legacy review"}</small></div>
  </header>
  <div className={styles.detailActions}><button type="button" className="secondary" onClick={()=>setPrinting(true)}><Printer size={15}/> Print / PDF</button><button type="button" className="secondary" onClick={onDownload}><FileText size={15}/> Unsigned text copy</button>{editable&&<button type="button" className="secondary" onClick={onEdit}>Edit / resubmit</button>}</div>
  <div className={styles.formPreviewLabel}><FileText size={16}/><b>Submitted Form</b><small>Live preview of the saved request · company-specific layout</small></div>
  <InlineRequestForm record={record} employeeName={employeeName} position={position} department={department}/>
  <section className={styles.subsection}><h4><Paperclip size={16}/> Supporting Documents & Verification</h4><p className={styles.hint}>Attached files are linked to this request. Original files must be available before marking Verified. Browser-local evidence is not secure permanent storage.</p>
   {attachments.length===0?<p className={styles.empty}>No attachments.</p>:attachments.map(a=><div className={styles.attachment} key={a.id}><div><b>{a.name}</b><small>{a.status} · Added by {a.addedBy} · {pretty(a.createdAt)}</small>{a.reviewedBy&&<small>Reviewed by {a.reviewedBy} · {pretty(a.reviewedAt||"")}</small>}{a.remarks&&<small>{a.remarks}</small>}</div><div className={styles.actions}><button type="button" className="secondary" disabled={!hasHRFormFile(record.id,a.id)} onClick={()=>openHRFormFile(record.id,a.id)}>View</button>{canDecide&&<><button type="button" className="secondary" disabled={!hasHRFormFile(record.id,a.id)} onClick={()=>onVerify(a.id,"Verified")}>Verify</button><button type="button" className="secondary" onClick={()=>onVerify(a.id,"Rejected")}>Reject File</button></>}</div></div>)}
   {(canDecide||editable||assistedHandoff||needsDocs&&record.requestor===username)&&!(["Approved (Documentation Only)","Rejected"] as string[]).includes(record.status)&&<label className={styles.fileInput}>Upload supporting PDF / image (max 10 MB)<input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={e=>{onAttachment(e.target.files?.[0]||null);e.target.value=""}}/></label>}
  {assistedHandoff&&<div className={styles.actions}><button type="button" className="secondary" onClick={onAssistResubmit}>Record HR-assisted resubmission</button><span className={styles.hint}>Only after offline identity confirmation and attachment receipt; does not impersonate the employee.</span></div>}
  </section>
  <section className={styles.subsection}><h4><ClipboardCheck size={16}/> Decision & Remarks</h4>
   {record.remarks&&<p className={styles.lastRemarks}><b>Previous remarks:</b> {record.remarks}</p>}
   {canDecide?<><label className={styles.remarks}>Reviewer remarks / requested documents<textarea rows={3} maxLength={1000} placeholder="Required for decline, revision, or requested documents (e.g. medical clearance)" value={remarks} onChange={e=>onRemarks(e.target.value)}/></label><div className={styles.decisionButtons}><button type="button" className="primary" onClick={()=>onAction("Approve")}>Approve Documentation</button><button type="button" className="secondary" onClick={()=>onAction("Request Documents")}>Request Documents</button><button type="button" className="secondary" onClick={()=>onAction("Return")}>Return for Revision</button><button type="button" className="secondary" onClick={()=>onAction("Reject")}>Decline</button></div></>:<p className={styles.hint}>{needsDocs?"Awaiting additional documents and resubmission from the requestor.":"No approval action is assigned to this account for this request."}</p>}
  </section>
  <section className={styles.subsection}><h4><Clock3 size={16}/> Request History & Audit</h4><ol className={styles.timeline}>{record.history.map((h,i)=><li key={`${h.at}-${i}`}><time>{pretty(h.at)}</time><b>{h.actor}</b><span>{h.action} · {h.status}</span></li>)}</ol></section>
  <p className={styles.hint}>Documentation review only. Approval here does not post leave credits, overtime pay, work permits, disciplinary findings or Accounting transactions.</p>
  {printing&&<FormPrintPreview record={record} employeeName={employeeName} position={position} department={department} onClose={()=>setPrinting(false)}/>}
 </section>;
}
