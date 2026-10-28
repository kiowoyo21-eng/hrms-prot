"use client";
import {INTAKE_EVENT,readIntakeExtensions,validateIntakeFields,cleanIntakeValues,type IntakeField} from "../lib/intakeForms";
import IntakeQuestions from "./intake/IntakeQuestions";
import EmployeeRequestIntake from "./EmployeeRequestIntake";
import Employee201Picker from "./Employee201Picker";
import DocumentIntake from "./DocumentIntake";
import FormPrintPreview from "./formPrint/FormPrintPreview";
import {permittedHRFile,saveHRFormFile,hasHRFormFile,openHRFormFile,type HRFormAttachment} from "../lib/hrFormEvidence";
import {type EmployeeRequestPacket} from "../lib/employeeRequestTransfer";
import {useEffect,useMemo,useState} from "react";
import type {Branch,Role} from "../lib/mock";
import {branches} from "../lib/mock";
import {useHR} from "../lib/hrState";
import {FORM_STORE_EVENT,FORM_STORE_KEY,formSchemas,validateFields,readForms,persistForms,transitionForm,canReviewForm,canViewForm,formDraftText,type FormKind,type HRFormRecord,type FormStatus} from "../lib/hrForms";
import {writeAuditEvent} from "../lib/auditTrail";
import styles from "./HROperationsExtras.module.css";
import {HrmsTabs} from "./ui/HrmsPrimitives";
const nowISO=()=>new Date().toISOString();
const prettyDate=(value:string)=>{try{return new Date(value).toLocaleString("en-PH",{timeZone:"Asia/Manila",dateStyle:"medium",timeStyle:"short"})}catch{return value}};
const downloadForm=(record:HRFormRecord)=>{const link=document.createElement("a"),url=URL.createObjectURL(new Blob([formDraftText(record)],{type:"text/plain;charset=utf-8"}));link.href=url;link.download=`${record.id.replace(/[^a-zA-Z0-9-]/g,"")}-UNSIGNED-DRAFT.txt`;link.click();window.setTimeout(()=>URL.revokeObjectURL(url),500)};
const newId=()=>typeof crypto!=="undefined"&&"randomUUID" in crypto?`HFORM-${crypto.randomUUID()}`:`HFORM-${Date.now()}-${Math.random().toString(36).slice(2,10)}`;
export default function HRFormsRequestsWorkspace({branch,role,username}:{branch:Branch;role:Role;username:string}){
 const {data}=useHR();
 const [items,setItems]=useState<HRFormRecord[]>([]),[ready,setReady]=useState(false);
 const [extensions,setExtensions]=useState<IntakeField[]>([]);
 const [tab,setTab]=useState<"requests"|"create">("requests"),[category,setCategory]=useState<FormKind>(formSchemas[0].kind),[employeeId,setEmployeeId]=useState(""),[requestBranch,setRequestBranch]=useState<Exclude<Branch,"All Shops">>("UC Mandaluyong"),[values,setValues]=useState<Record<string,string>>({}),[evidence,setEvidence]=useState(""),[editingId,setEditingId]=useState("");
 useEffect(()=>{const sync=()=>setExtensions(readIntakeExtensions("request",category));sync();window.addEventListener(INTAKE_EVENT,sync);return()=>window.removeEventListener(INTAKE_EVENT,sync)},[category]);
 const [printing,setPrinting]=useState(false);
 const [selectedId,setSelectedId]=useState(""),[filter,setFilter]=useState("All"),[search,setSearch]=useState(""),[remarks,setRemarks]=useState(""),[message,setMessage]=useState(""),[error,setError]=useState("");
 useEffect(()=>{setItems(readForms());setReady(true);const changed=()=>setItems(readForms());const stored=(e:StorageEvent)=>{if(e.key===FORM_STORE_KEY)changed()};window.addEventListener(FORM_STORE_EVENT,changed);window.addEventListener("storage",stored);return()=>{window.removeEventListener(FORM_STORE_EVENT,changed);window.removeEventListener("storage",stored)}},[]);
 useEffect(()=>{setSelectedId("");setMessage("");setError("");setEditingId("");setTab("requests");setRequestBranch(branch==="All Shops"?"UC Mandaluyong":branch)},[branch]);
 const allowedBranches=branches.filter((b):b is Exclude<Branch,"All Shops">=>b!=="All Shops"&&(role!=="BM"||(branch!=="All Shops"&&b===branch))&&(branch==="All Shops"||b===branch));
 const people=useMemo(()=>data.people.filter(p=>p.branch===requestBranch),[data.people,requestBranch]);
 const visible=useMemo(()=>items.filter(r=>canViewForm(r,username,role,branch)&&(filter==="All"||r.status===filter)&&`${r.id} ${r.kind} ${r.employeeId} ${r.branch}`.toLowerCase().includes(search.trim().toLowerCase())).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)),[items,role,username,branch,filter,search]);
 const selected=visible.find(x=>x.id===selectedId);
 const schema=formSchemas.find(x=>x.kind===category)!;
 const chosenBranch=allowedBranches.includes(requestBranch)?requestBranch:allowedBranches[0];
 const employee=people.find(x=>x.id===employeeId);
 const validation=[...validateFields(category,values),...validateIntakeFields(extensions,values)];
 const setField=(key:string,value:string)=>setValues(s=>({...s,[key]:value}));
 const commit=(updated:HRFormRecord[],action:string,record:HRFormRecord,before?:FormStatus)=>{
  if(!persistForms(updated)){setError("Browser storage could not save this request. No success was recorded.");return false}
  setItems(updated);writeAuditEvent({module:"HR Forms & Requests",action,recordId:record.id,summary:`${record.kind} · metadata only; form contents redacted`,beforeStatus:before,afterStatus:record.status});setError("");setMessage(`${action}: ${record.id} (browser-local only)`);return true;
 };
 const saveDraft=(submit:boolean)=>{
  setMessage("");setError("");
  if(!ready){setError("Form records are still loading");return}
  if(!chosenBranch||!employee||employee.branch!==chosenBranch){setError("Select an employee in the selected branch");return}
  if(values.supervisor&&!people.some(p=>p.id===values.supervisor)){setError("Select a verified supervisor from Employee 201, not a manually entered name.");return}
  if(evidence.length>350){setError("Evidence references cannot exceed 350 characters");return}
  if(submit&&validation.length){setError(validation[0]);return}
  const old=editingId?items.find(r=>r.id===editingId):undefined;
  if(editingId&&(!old||old.requestor!==username||!["Draft","Returned for Revision"].includes(old.status)||old.branch!==chosenBranch||old.employeeId!==employeeId)){setError("This request can no longer be edited");return}
  const visibleAnswers=cleanIntakeValues(extensions,values);const visibleFields={...values,...visibleAnswers};for(const field of extensions){if(!Object.prototype.hasOwnProperty.call(visibleAnswers,field.id))delete visibleFields[field.id];}
  const at=nowISO();const record:HRFormRecord=old?{...old,fields:visibleFields,kind:category,evidenceRefs:evidence,updatedAt:at,additionalLabels:{...(old.additionalLabels||{}),...Object.fromEntries(extensions.map(f=>[f.id,f.label]))}}:{id:newId(),kind:category,branch:chosenBranch,employeeId,requestor:username,status:"Draft",fields:visibleFields,evidenceRefs:evidence,additionalLabels:Object.fromEntries(extensions.map(f=>[f.id,f.label])),remarks:"",createdAt:at,updatedAt:at,history:[{at,actor:username,action:"Created Draft",status:"Draft"}]};
  let next=record;
  try{if(submit)next=transitionForm(record,"Submit",username,role,"",at)}catch(e){setError(e instanceof Error?e.message:"Cannot submit");return}
  if(commit(old?items.map(r=>r.id===old.id?next:r):[...items,next],submit?"Submitted documentation request":old?"Updated draft":"Created draft",next,old?.status)){
   setEditingId("");setValues({});setEvidence("");setEmployeeId("");setSelectedId(next.id);setTab("requests");setFilter("All");setSearch("");
  }
 };
 const addEvidence=(file:File|null)=>{
  if(!selected||!file)return;setError("");if(!(selected.requestor===username||canReviewForm(selected,username,role))||selected.status==="Approved (Documentation Only)"||selected.status==="Rejected"){setError("Only a request participant may add supporting files to an open request");return}
  if(!permittedHRFile(file)){setError("PDF/JPG/PNG/WebP only, 10MB maximum");return}
  const id=newId(),at=nowISO();const attachment:HRFormAttachment={id,name:file.name,mime:file.type,createdAt:at,addedBy:username,status:"Pending Verification"};
  const next={...selected,attachments:[...(selected.attachments||[]),attachment],updatedAt:at,history:[...selected.history,{at,actor:username,action:`Attached ${file.name} for verification`,status:selected.status}]};
  if(commit(items.map(x=>x.id===selected.id?next:x),"Attached request evidence",next,selected.status)){saveHRFormFile(selected.id,id,file)}
 };
 const reviewEvidence=(id:string,decision:"Verified"|"Rejected")=>{
  if(!selected||!canReviewForm(selected,username,role))return setError("HR review rights are required to verify this request's documents");
  const attachment=selected.attachments?.find(a=>a.id===id);if(!attachment)return;
  if(decision==="Verified"&&!hasHRFormFile(selected.id,id))return setError("Original file is unavailable. Reattach before verification; filename alone is not evidence.");
  const note=decision==="Rejected"?window.prompt("Reason for rejecting attachment (required)")||"":"";if(decision==="Rejected"&&!note.trim())return;
  const at=nowISO();const next={...selected,attachments:(selected.attachments||[]).map(a=>a.id===id?{...a,status:decision,reviewedAt:at,reviewedBy:username,remarks:note}:a),updatedAt:at,history:[...selected.history,{at,actor:username,action:`${decision} document ${attachment.name}`,status:selected.status}]};
  commit(items.map(x=>x.id===selected.id?next:x),`${decision} request attachment`,next,selected.status);
 };
 const review=(action:"Approve"|"Return"|"Reject")=>{
  setError("");setMessage("");if(!selected||!canReviewForm(selected,username,role)){setError("This request is not eligible for your review");return}
  if(action==="Approve"&&selected.attachments?.some(a=>a.status!=="Verified"||!hasHRFormFile(selected.id,a.id))){setError("Verify every attached original document in this request before approving. Missing session files must be reattached.");return}if((action==="Return"||action==="Reject")&&!remarks.trim()){setError("Written reason is required");return}
  if(!window.confirm(`${action} request ${selected.id}? This changes documentation status only, not payroll, leave or permits.`))return;
  try{const next=transitionForm(selected,action,username,role,remarks,nowISO());if(commit(items.map(r=>r.id===selected.id?next:r),action==="Approve"?"Approved documentation":action==="Reject"?"Rejected documentation":"Returned documentation",next,selected.status))setRemarks("")}
  catch(e){setError(e instanceof Error?e.message:"Decision not permitted")}
 };
 const importEmployeeForm=(packet:EmployeeRequestPacket)=>{
  if(packet.kind!=="HR Form"||items.some(x=>x.externalId===packet.id)||!allowedBranches.includes(packet.branch))return false;
  const person=data.people.find(p=>p.id===packet.employeeId&&p.branch===packet.branch&&p.name.trim().toLowerCase()===packet.employeeName.trim().toLowerCase());
  if(!person)return false;
  const kind=packet.type as FormKind;if(!formSchemas.some(s=>s.kind===kind)||validateFields(kind,packet.fields).length||(packet.fields.supervisor&&!data.people.some(p=>p.id===packet.fields.supervisor&&p.branch===packet.branch)))return false;
  const at=nowISO();const record:HRFormRecord={id:newId(),externalId:packet.id,source:"Employee Handoff (Unverified)",kind,branch:packet.branch,employeeId:person.id,requestor:`employee:${person.id}`,status:"Submitted",fields:packet.fields,evidenceRefs:"",remarks:"",createdAt:packet.submittedAt,updatedAt:at,history:[{at:packet.submittedAt,actor:`employee:${person.id}`,action:"Handoff prepared (unverified)",status:"Draft"},{at,actor:username,action:"Imported handoff into HR inbox; verify sender",status:"Submitted"}]};
  return commit([record,...items],"Imported employee request for review",record);
 };
 const startEdit=(r:HRFormRecord)=>{if(r.requestor!==username||!(r.status==="Draft"||r.status==="Returned for Revision"))return;setEditingId(r.id);setCategory(r.kind);setEmployeeId(r.employeeId);setRequestBranch(r.branch);setValues({...r.fields});setEvidence(r.evidenceRefs);setMessage("");setError("");setTab("create")};
 const changeType=(v:FormKind)=>{setCategory(v);setValues({});setEditingId("")};
 return <div className={`${styles.wrap} ${styles.requestRegister}`}>
  <div className={styles.head}><div><h2>Employee Requests & HR Documentation</h2><p>Document intake and review register · {branch} · {role}</p></div><div className={styles.actions}><button className={styles.primary} type="button" onClick={()=>{setTab("create");setEditingId("");setValues({});setEvidence("");setEmployeeId("");setMessage("");setError("")}}>Record Paper Request</button></div></div>
  <EmployeeRequestIntake kind="HR Form" branch={branch} people={data.people} onAccept={importEmployeeForm}/>
  <div className={styles.notice}><b>Frontend review only:</b> This module does NOT create official leave approvals, valid work permits, payable overtime, disciplinary judgments, or released documents. Employee-originated requests start at the shared employee form. Use HR-assisted entry only for paper requests. Attachments can be verified inside Request Details, but files remain temporary browser-session evidence and are not signed or securely archived. Keep confidential facts out of browser demo storage. Final legally required wording and signatories require HR/legal review.</div>
  <HrmsTabs label="HR forms and requests" value={tab} onChange={setTab} items={[{id:"requests",label:`Request register (${visible.length})`},{id:"create",label:editingId?"Edit request":"Create / submit"}]} />
  {error&&<div className={styles.error} role="alert">{error}</div>}{message&&<div className={styles.success} role="status">{message}</div>}
  {tab==="requests"&&<details className={styles.panel}><summary style={{cursor:"pointer",fontWeight:600}}>Employee document submissions · Verify files within their request</summary><DocumentIntake branch={branch} role={role}/></details>}
  {tab==="create"?<section className={styles.panel}><h3>{editingId?`Update ${editingId}`:"New HR documentation request"}</h3><div className={styles.formGrid}>
   <label className={styles.field}>Form type<select value={category} disabled={!!editingId} onChange={e=>changeType(e.target.value as FormKind)}>{formSchemas.map(s=><option key={s.kind} disabled={!editingId&&(s.kind==="Leave Documentation"||s.kind==="Employment Certificate Request")}>{s.kind}</option>)}</select></label>
   <label className={styles.field}>Branch<select value={chosenBranch||""} disabled={!!editingId||role==="BM"} onChange={e=>{setRequestBranch(e.target.value as Exclude<Branch,"All Shops">);setEmployeeId("");setValues(v=>({...v,supervisor:""}))}}>{allowedBranches.map(b=><option key={b}>{b}</option>)}</select></label>
   <div className={`${styles.field} ${styles.wide}`}><Employee201Picker label="Employee involved (Employee 201)" people={people} value={employeeId} disabled={!!editingId} onChange={setEmployeeId}/></div>
   <div className={styles.wide}><p className={styles.muted}>{schema.description}</p></div>
   {schema.fields.map(f=>f.key==="supervisor"?
    <div className={styles.field} key={f.key}><Employee201Picker label={f.label} people={people} required={f.required} value={values[f.key]||""} onChange={id=>setField(f.key,id)}/></div>
    :<label className={`${styles.field} ${f.type==="textarea"?styles.wide:""}`} key={f.key}>{f.label}{f.required?" *":" (optional)"}{f.type==="textarea"?<textarea maxLength={1500} value={values[f.key]||""} onChange={e=>setField(f.key,e.target.value)}/>:f.type==="select"?<select value={values[f.key]||""} onChange={e=>setField(f.key,e.target.value)}><option value="">Select</option>{f.options?.map(x=><option key={x}>{x}</option>)}</select>:<input type={f.type} maxLength={1500} value={values[f.key]||""} onChange={e=>setField(f.key,e.target.value)}/>}</label>)}
   {extensions.length>0&&<div className={styles.wide}><h3>Additional questions</h3><IntakeQuestions fields={extensions} values={values} onChange={setField}/></div>}
   <label className={`${styles.field} ${styles.wide}`}>Evidence / supporting document references (optional)<textarea maxLength={350} placeholder="Document IDs or internal references only, no personal ID numbers or confidential document content" value={evidence} onChange={e=>setEvidence(e.target.value)}/></label>
   <div className={styles.wide}><div className={styles.actions}><button className={styles.secondary} type="button" disabled={!ready} onClick={()=>saveDraft(false)}>Save draft</button><button className={styles.primary} type="button" disabled={!ready||validation.length>0} onClick={()=>saveDraft(true)}>Record on behalf & submit</button><button className={styles.secondary} type="button" onClick={()=>{setTab("requests");setError("")}}>Cancel</button></div>{validation.length>0&&<p className={styles.muted}>{validation.length} required/invalid fields before submission. First: {validation[0]}</p>}</div>
  </div></section>:<div className={styles.panels}>
   <section className={styles.panel}><div className={styles.toolbar}><label className={styles.field}>Status<select value={filter} onChange={e=>{setFilter(e.target.value);setSelectedId("")}}><option>All</option>{["Draft","Submitted","Returned for Revision","Approved (Documentation Only)","Rejected"].map(x=><option key={x}>{x}</option>)}</select></label><label className={styles.field}>Search request<input value={search} onChange={e=>{setSearch(e.target.value);setSelectedId("")}} placeholder="ID, employee, type"/></label></div><p className={styles.muted}>{visible.length} visible requests. Browser-only records · no live workflow integration.</p><div className={styles.list}>{visible.map(r=><button key={r.id} type="button" className={styles.item} aria-pressed={selectedId===r.id} onClick={()=>{setSelectedId(r.id);setRemarks("");setError("")}}><b>{r.kind}</b><small>{r.id} · {r.employeeId} · {r.branch}</small><small>{r.status} · {prettyDate(r.updatedAt)}</small></button>)}{!visible.length&&<div className={styles.empty}>No matching form requests. Create a request to start.</div>}</div></section>
   <section className={styles.panel}>{selected?<div className={styles.details}><h3>Request review</h3><span className={styles.pill}>{selected.status}</span><div className={styles.muted}>ID: {selected.id}</div><button className={styles.secondary} type="button" onClick={()=>setPrinting(true)}>Preview / Print A4</button> <button className={styles.secondary} type="button" onClick={()=>downloadForm(selected)}>Download unsigned form draft (.txt)</button><div className={styles.muted}>Submitted by: {selected.requestor}{selected.source?` (${selected.source})`:""}</div><div className={styles.muted}>Employee: {data.people.find(p=>p.id===selected.employeeId)?.name||"Employee record unavailable"} · {selected.employeeId} · {selected.branch}</div>{formSchemas.find(x=>x.kind===selected.kind)?.fields.map(f=><div className={styles.pair} key={f.key}><span>{f.label}</span><strong style={{whiteSpace:"pre-wrap",textAlign:"right",overflowWrap:"anywhere"}}>{(f.key==="supervisor"?data.people.find(p=>p.id===selected.fields[f.key])?.name?`${data.people.find(p=>p.id===selected.fields[f.key])?.name} (${selected.fields[f.key]})`:selected.fields[f.key]:selected.fields[f.key])||"—"}</strong></div>)}{Object.entries(selected.additionalLabels||{}).map(([key,label])=><div className={styles.pair} key={key}><span>{label}</span><strong style={{whiteSpace:"pre-wrap",textAlign:"right",overflowWrap:"anywhere"}}>{selected.fields[key]||"—"}</strong></div>)}<p className={styles.muted}>Evidence references: {selected.evidenceRefs||"None"}</p><section className={styles.panel}><h3>Attached Documents & Verification — Request {selected.id}</h3><p className={styles.muted}>The attachment and its verification decision belong to this request, not a separate verification tab. Actual files are temporary until secure storage is available.</p>
 {selected.attachments?.map(a=><div className={styles.pair} key={a.id}><span><b>{a.name}</b><small style={{display:"block"}}>{a.status} · {a.addedBy} · {a.createdAt.slice(0,10)}</small>{a.reviewedBy&&<small style={{display:"block"}}>Reviewed by {a.reviewedBy} · {a.reviewedAt}</small>}{a.remarks&&<small>{a.remarks}</small>}</span><div className={styles.actions}>{hasHRFormFile(selected.id,a.id)?<button type="button" className={styles.secondary} onClick={()=>openHRFormFile(selected.id,a.id)}>Open</button>:<b>Original unavailable</b>}{canReviewForm(selected,username,role)&&<><button type="button" className={styles.secondary} disabled={!hasHRFormFile(selected.id,a.id)} onClick={()=>reviewEvidence(a.id,"Verified")}>Verify</button><button type="button" className={styles.secondary} onClick={()=>reviewEvidence(a.id,"Rejected")}>Reject file</button></>}</div></div>)}
 {(selected.requestor===username||canReviewForm(selected,username,role))&&!(["Approved (Documentation Only)","Rejected"] as string[]).includes(selected.status)&&<label className={styles.field}>Attach supporting document (PDF / image, max 10 MB)<input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={e=>{addEvidence(e.target.files?.[0]||null);e.target.value=""}}/></label>}</section>{selected.remarks&&<p className={styles.muted}>Last decision remarks: {selected.remarks}</p>}
    {(selected.status==="Draft"||selected.status==="Returned for Revision")&&selected.requestor===username&&<button className={styles.secondary} type="button" onClick={()=>startEdit(selected)}>Edit / resubmit</button>}
    {canReviewForm(selected,username,role)&&<><label className={styles.field}>Reviewer explanation (required for return/reject)<textarea value={remarks} maxLength={1000} onChange={e=>setRemarks(e.target.value)}/></label><div className={styles.actions}><button type="button" className={styles.primary} onClick={()=>review("Approve")}>Approve documentation</button><button type="button" className={styles.secondary} onClick={()=>review("Return")}>Return</button><button type="button" className={styles.secondary} onClick={()=>review("Reject")}>Reject</button></div></>}
    <h3>Decision history</h3><ol className={styles.history}>{selected.history.map((h,i)=><li key={`${h.at}-${i}`}>{prettyDate(h.at)} · {h.actor} · {h.action} → {h.status}</li>)}</ol>
   </div>:<div className={styles.empty}>Select a request to review its documentation and timeline.</div>}</section>
  </div>}
 {printing&&selected&&<FormPrintPreview record={selected} employeeName={data.people.find(p=>p.id===selected.employeeId)?.name||"Employee record unavailable"} position={data.people.find(p=>p.id===selected.employeeId)?.position} department={data.people.find(p=>p.id===selected.employeeId)?.department} onClose={()=>setPrinting(false)}/>}
 </div>;
}
