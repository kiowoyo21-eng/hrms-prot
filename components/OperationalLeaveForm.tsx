"use client";
import {useState} from "react";
import {createPortal} from "react-dom";
import LeaveForm from "./formPrint/templates/LeaveForm";
import type {PrintFormData} from "./formPrint/types";
import styles from "./RequestReview.module.css";
import "./formPrint/printForms.css";
type LeaveSummary={id:number;employee:string;employeeId?:string;branch:string;type:string;from:string;to:string;days:number;status:string;notes:string;decisionHistory?:{at:string;status:string;remarks:string;by?:string}[]};
/** No mutation or second leave decision; this displays the authoritative Leave Management record. */
export default function OperationalLeaveForm({leave,employeeId,position,department}:{leave:LeaveSummary;employeeId?:string;position?:string;department?:string}){
 const [print,setPrint]=useState(false);
 const decision=leave.decisionHistory?.[leave.decisionHistory.length-1];
 const data:PrintFormData={
  company:leave.branch.startsWith("MM")?"MM":"UC",branch:leave.branch,employeeId,employeeName:leave.employee,position,department,
  reference:`LEAVE-${leave.id}`,date:leave.from,status:leave.status,
  approvedBy:decision?.by,reviewedBy:decision?.by,
  values:{leaveType:leave.type,from:leave.from,to:leave.to,totalDays:String(leave.days),reason:leave.notes,decision:decision?.status||leave.status,decisionDate:decision?.at||"",approvalRemarks:decision?.remarks||""}
 };
 return <section className={styles.operationalPreview} aria-label="Completed leave application form"><div className={styles.formPreviewLabel}><b>Leave Application — Completed Form</b><button type="button" className="secondary" onClick={()=>setPrint(true)}>Print / Save PDF</button></div>
  <div className={`hr-print-scope ${styles.inlinePaper}`}><LeaveForm data={data}/></div>
  {print&&typeof document!=="undefined"&&createPortal(<div className="hr-print-overlay hr-print-scope" role="dialog" aria-modal="true" aria-label={`Print leave ${leave.id}`}><div className="hr-print-toolbar hr-print-no-print"><b>Leave Application · LEAVE-{leave.id}</b><button type="button" onClick={()=>window.print()}>Print / Save PDF</button><button type="button" onClick={()=>setPrint(false)}>Close</button></div><div className="hr-print-frame"><LeaveForm data={data}/></div></div>,document.body)}
 </section>;
}
