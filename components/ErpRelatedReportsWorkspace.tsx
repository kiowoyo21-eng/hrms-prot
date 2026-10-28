"use client";
import {useEffect,useMemo,useState} from "react";
import {Download,FileSpreadsheet,FileUp,Trash2} from "lucide-react";
import type {Branch,Role} from "../lib/mock";
import {branches} from "../lib/mock";
import {writeAuditEvent} from "../lib/auditTrail";
import {ERP_CSV_MAX_BYTES,erpCsvFingerprint,erpReportVisible,parseErpCsv,readErpReports,saveErpReports,type ErpCsvReport,type ParsedErpCsv} from "../lib/erpCsvReports";

const dateToday=()=>new Date().toLocaleDateString("en-CA",{timeZone:"Asia/Manila"});
const localBranches=branches.filter((b):b is Exclude<Branch,"All Shops">=>b!=="All Shops");
export default function ErpRelatedReportsWorkspace({branch,role,username}:{branch:Branch;role:Role;username:string}){
 const [reports,setReports]=useState<ErpCsvReport[]>([]),[ready,setReady]=useState(false);
 const [title,setTitle]=useState(""),[targetBranch,setTargetBranch]=useState<Exclude<Branch,"All Shops">>(branch==="All Shops"?"UC Mandaluyong":branch);
 const [period,setPeriod]=useState(dateToday().slice(0,7)),[notes,setNotes]=useState("");
 const [pending,setPending]=useState<{fileName:string;fileSize:number;csv:string;parsed:ParsedErpCsv}|null>(null);
 const [selectedId,setSelectedId]=useState(""),[search,setSearch]=useState(""),[notice,setNotice]=useState(""),[error,setError]=useState("");
 useEffect(()=>{setReports(readErpReports());setReady(true)},[]);
 useEffect(()=>{setTargetBranch(branch==="All Shops"?"UC Mandaluyong":branch);setPending(null);setSelectedId("");setNotice("");setError("")},[branch]);
 const availableBranches=localBranches.filter(b=>branch==="All Shops"||b===branch);
 const visible=useMemo(()=>reports.filter(r=>erpReportVisible(r,branch,role)).filter(r=>`${r.title} ${r.fileName} ${r.branch} ${r.period}`.toLowerCase().includes(search.trim().toLowerCase())).sort((a,b)=>b.uploadedAt.localeCompare(a.uploadedAt)),[reports,branch,role,search]);
 const selected=visible.find(r=>r.id===selectedId);
 const handleCsv=async(file?:File)=>{
  setPending(null);setError("");setNotice("");if(!file)return;
  if(!/\.csv$/i.test(file.name)){setError("Only .csv files are accepted.");return}
  if(file.size>ERP_CSV_MAX_BYTES){setError("CSV file exceeds the 512 KB limit.");return}
  try{const csv=await file.text();const parsed=parseErpCsv(csv);setPending({fileName:file.name,fileSize:file.size,csv,parsed});if(!title.trim())setTitle(file.name.replace(/\.csv$/i,""));}
  catch(e){setError(e instanceof Error?e.message:"CSV could not be read.")}
 };
 const save=()=>{
  if(!ready||!pending)return setError("Select and preview a valid CSV file.");
  if(!title.trim()||title.length>120)return setError("Enter a report title of 1–120 characters.");
  if(!availableBranches.includes(targetBranch))return setError("Choose an authorized report branch.");
  if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(period))return setError("Choose a valid report month.");
  const checksum=erpCsvFingerprint(pending.csv);
  if(reports.some(r=>r.branch===targetBranch&&r.checksum===checksum&&r.originalCsv===pending.csv))return setError("This CSV was already uploaded for that branch.");
  if(reports.length>=25)return setError("Prototype storage holds at most 25 reports. Archive/remove an older report first.");
  const next:ErpCsvReport={id:`ERP-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,title:title.trim(),branch:targetBranch,period,notes:notes.trim().slice(0,400),fileName:pending.fileName,fileSize:pending.fileSize,checksum,uploadedAt:new Date().toISOString(),uploadedBy:username,headers:pending.parsed.headers,rows:pending.parsed.rows,originalCsv:pending.csv};
  if(!saveErpReports([next,...reports]))return setError("Browser session storage could not save the CSV. Nothing was imported.");
  setReports([next,...reports]);setSelectedId(next.id);setPending(null);setTitle("");setNotes("");setError("");setNotice("CSV report saved for review in this browser session only.");
  writeAuditEvent({module:"ERP Related Reports",action:"Uploaded manual CSV report",recordId:next.id,summary:`${targetBranch} · ${next.fileName} · ${next.rows.length} rows · uploaded by ${username}`});
 };
 const download=(r:ErpCsvReport)=>{const url=URL.createObjectURL(new Blob([r.originalCsv],{type:"text/csv;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download=r.fileName;a.click();window.setTimeout(()=>URL.revokeObjectURL(url),1000)};
 const remove=(r:ErpCsvReport)=>{if(role==="BM"&&r.uploadedBy!==username)return setError("BM may remove only reports uploaded from their own account.");if(!window.confirm(`Remove ERP report ${r.title}? This deletes only the temporary HRMS CSV copy.`))return;const next=reports.filter(x=>x.id!==r.id);if(!saveErpReports(next))return setError("Could not remove record from this browser session.");setReports(next);setSelectedId("");setNotice("Report removed from temporary HRMS records.");writeAuditEvent({module:"ERP Related Reports",action:"Removed manual CSV report",recordId:r.id,summary:`${r.branch} · ${r.fileName}`})};
 return <section className="panel" style={{padding:16}}>
  <div className="pc-header"><div><h2>ERP Related Reports</h2><p>Manual CSV upload and review only · No ERP connection, live sync, or automatic HRMS import</p></div><FileSpreadsheet size={23} aria-hidden="true"/></div>
  <p className="pc-alert subtle"><strong>Prototype storage:</strong> CSV contents remain in this browser session and are not securely archived. Do not use real confidential employee or customer data until secure backend access controls are in place.</p>
  {error&&<p className="pc-alert pc-attendance-warning" role="alert">{error}</p>}{notice&&<p className="pc-alert subtle" role="status">{notice}</p>}
  <div className="rev-form" style={{marginTop:12}}>
   <label>Report Title<input value={title} maxLength={120} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Monthly job-order summary"/></label>
   <label>Branch<select value={targetBranch} onChange={e=>setTargetBranch(e.target.value as Exclude<Branch,"All Shops">)}>{availableBranches.map(b=><option key={b}>{b}</option>)}</select></label>
   <label>Report Month<input type="month" value={period} onChange={e=>setPeriod(e.target.value)}/></label>
   <label>CSV File<input type="file" accept=".csv,text/csv" onChange={e=>void handleCsv(e.target.files?.[0])}/></label>
   <label>Internal Notes<input maxLength={400} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Optional source/reference"/></label>
  </div>
  {pending&&<div style={{marginTop:12}}><h3>Upload Preview · {pending.fileName}</h3><p className="muted">{pending.parsed.rows.length} rows · {pending.parsed.headers.length} columns · original CSV remains unchanged</p><div className="table-wrap" style={{maxHeight:260,overflow:"auto"}}><table><thead><tr>{pending.parsed.headers.map((h,i)=><th key={i}>{h}</th>)}</tr></thead><tbody>{pending.parsed.rows.slice(0,5).map((r,i)=><tr key={i}>{r.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div><button type="button" className="primary" disabled={!ready} onClick={save}><FileUp size={15}/> Save CSV Report</button></div>}
  <hr style={{margin:"20px 0"}}/>
  <div className="pc-header"><h3>Uploaded Reports ({visible.length})</h3><label>Find Report <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search title, branch or file"/></label></div>
  <div className="table-wrap"><table><thead><tr><th>Report</th><th>Branch</th><th>Period</th><th>Rows</th><th>Uploaded By</th><th>Uploaded At</th></tr></thead><tbody>{visible.map(r=><tr key={r.id} onClick={()=>setSelectedId(r.id)} onKeyDown={e=>{if(e.key==="Enter")setSelectedId(r.id)}} tabIndex={0} role="button" aria-label={`Open ERP CSV report ${r.title}`} style={{cursor:"pointer"}}><td><b>{r.title}</b><small style={{display:"block"}}>{r.fileName}</small></td><td>{r.branch}</td><td>{r.period}</td><td>{r.rows.length}</td><td>{r.uploadedBy}</td><td>{new Date(r.uploadedAt).toLocaleString("en-PH",{timeZone:"Asia/Manila"})}</td></tr>)}</tbody></table>{visible.length===0&&<p className="muted">No CSV reports for this branch or filter.</p>}</div>
  {selected&&<div className="panel" style={{marginTop:12}}><div className="pc-header"><div><h3>{selected.title}</h3><p>{selected.branch} · {selected.period} · {selected.fileName} · {selected.rows.length} rows</p></div><div className="rev-actions"><button className="secondary" type="button" onClick={()=>download(selected)}><Download size={15}/> Download CSV</button><button className="secondary" type="button" onClick={()=>remove(selected)}><Trash2 size={15}/> Remove</button><button className="secondary" type="button" onClick={()=>setSelectedId("")}>Close</button></div></div>{selected.notes&&<p>{selected.notes}</p>}<div className="table-wrap" style={{maxHeight:320,overflow:"auto"}}><table><thead><tr>{selected.headers.map((h,i)=><th key={i}>{h}</th>)}</tr></thead><tbody>{selected.rows.slice(0,50).map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j}>{c}</td>)}</tr>)}</tbody></table></div><p className="muted">Preview shows first 50 rows only. Download retains all rows.</p></div>}
 </section>;
}
