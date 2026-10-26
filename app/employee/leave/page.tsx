"use client";
import {useState,type FormEvent} from "react";
import {createEmployeePacket,downloadEmployeePacket,leaveDays,REQUEST_BRANCHES,saveEmployeeQueue,type EmployeeRequestPacket,type RequestBranch} from "../../../lib/employeeRequestTransfer";

export default function EmployeeLeaveRequestPage(){
 const [employeeId,setEmployeeId]=useState(""),[employeeName,setEmployeeName]=useState(""),[branch,setBranch]=useState<RequestBranch>("UC Mandaluyong");
 const [type,setType]=useState("SIL"),[from,setFrom]=useState(""),[to,setTo]=useState(""),[reason,setReason]=useState("");
 const [error,setError]=useState(""),[packet,setPacket]=useState<EmployeeRequestPacket|null>(null),[local,setLocal]=useState(false);
 const submit=(e:FormEvent)=>{e.preventDefault();setError("");try{
  leaveDays(from,to);
  const next=createEmployeePacket({kind:"Leave",employeeId:employeeId.trim(),employeeName:employeeName.trim(),branch,type,fields:{from,to,reason:reason.trim()}});
  setPacket(next);try{setLocal(saveEmployeeQueue(next))}catch{setLocal(false)}
  downloadEmployeePacket(next);
 }catch(err){setError(err instanceof Error?err.message:"Invalid leave request")}};
 return <main className="intake-public"><div className="intake-public-card employee-request-card"><a href="/">HRMS</a><h1>Employee Leave Request</h1><p>Employee submits the application; HR or an assigned approver reviews it. Filing is not approval and does not change leave credits.</p>
 <div className="intake-warning"><b>Browser-only test:</b> This app has no secure central submission server. A copy is stored only on this device, and a JSON handoff file is downloaded. Send the file to HR through an approved channel; HR must import and verify it. Do not enter real sensitive information in this demo.</div>
 {!packet?<form onSubmit={submit} className="employee-request-form"><label>Employee ID<input required maxLength={60} value={employeeId} onChange={e=>setEmployeeId(e.target.value)} placeholder="Employee 201 ID"/></label><label>Full name<input required maxLength={120} value={employeeName} onChange={e=>setEmployeeName(e.target.value)}/></label><label>Branch<select value={branch} onChange={e=>setBranch(e.target.value as RequestBranch)}>{REQUEST_BRANCHES.map(x=><option key={x}>{x}</option>)}</select></label><label>Leave type<select value={type} onChange={e=>setType(e.target.value)}>{["SIL","VIL","Company Sick Leave","Unpaid Leave"].map(x=><option key={x}>{x}</option>)}</select></label><label>From<input required type="date" value={from} onChange={e=>setFrom(e.target.value)}/></label><label>To<input required type="date" value={to} min={from||undefined} onChange={e=>setTo(e.target.value)}/></label><label className="employee-request-full">Reason<textarea required rows={3} maxLength={1500} value={reason} onChange={e=>setReason(e.target.value)}/></label>{error&&<p role="alert" className="intake-error employee-request-full">{error}</p>}<button className="intake-primary employee-request-full" type="submit">Prepare Leave Request & Download Handoff File</button></form>:<div className="employee-request-result" role="status"><h2>Request prepared · Not yet received by HR</h2><p>Reference: <b>{packet.id}</b></p><p>{local?"A test copy is also saved on this browser. HR can import it from their Leave Management inbox when using this same browser.":"No local copy was saved."} For another device, send the downloaded JSON file to HR using an approved channel.</p><button className="intake-primary" onClick={()=>downloadEmployeePacket(packet)}>Download request again</button><button className="intake-secondary" onClick={()=>{setPacket(null);setReason("")}}>New request</button></div>}
 </div></main>;
}
