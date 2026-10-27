"use client";
import {useEffect,useState} from "react";
import type {Role} from "../lib/mock";
import type {IncidentCase} from "../lib/incidentRecords";
/** Restricted summary for authorized Employee 201 reviewers; reporters are NOT subjects of a disciplinary finding. */
export default function EmployeeIncidentHistoryPanel({employeeId,role}:{employeeId:string;role:Role}){
 const [records,setRecords]=useState<IncidentCase[]>([]);
 useEffect(()=>{
  if(role==="BM")return;
  const load=()=>{try{const raw=JSON.parse(localStorage.getItem("uc-hr-ui-incident")||"[]") as IncidentCase[];setRecords(Array.isArray(raw)?raw:[])}catch{setRecords([])}};
  const local=(e:Event)=>{if((e as CustomEvent<string>).detail==="incident")load()};
  const stored=(e:StorageEvent)=>{if(e.key==="uc-hr-ui-incident")load()};
  load();window.addEventListener("hrms:localrecords",local);window.addEventListener("storage",stored);
  return()=>{window.removeEventListener("hrms:localrecords",local);window.removeEventListener("storage",stored)};
 },[role]);
 if(role==="BM")return null;
 const involved=records.filter(c=>c.respondentEmployeeId===employeeId).sort((a,b)=>(b.incidentDate||b.closedAt||"").localeCompare(a.incidentDate||a.closedAt||""));
 return <section className="emp201-ir-restricted" aria-label="Restricted incident case history"><h4>Restricted Incident History ({involved.length})</h4>
  <p className="muted">Authorized HR case references only. Reporters are never counted as offending employees; allegations are not confirmed findings.</p>
  {involved.length?<div className="table-wrap"><table><thead><tr><th>IR Ref.</th><th>Incident Date</th><th>Category</th><th>Review</th><th>Finding</th></tr></thead><tbody>{involved.map(c=><tr key={c.id}><td>{c.id}</td><td>{c.incidentDate||"Undated legacy report"}</td><td>{c.category||"Unclassified"}</td><td>{c.stage}</td><td>{c.findingStatus||"Unverified"}</td></tr>)}</tbody></table></div>:<p className="muted">No employee-linked incident cases in this browser record.</p>}
 </section>;
}
