"use client";

import {useMemo,useState,type FormEvent} from "react";
import {ArrowLeft,ArrowRight,Plus,FileText,UserRound,BriefcaseBusiness,ShieldCheck,ClipboardList} from "lucide-react";
import type {Branch,Role} from "../lib/mock";
import {shopNames,type Shop} from "../lib/people";
import {useHR,effectiveRate,type HRPerson} from "../lib/hrState";
import HelpButton from "./HelpButton";

type Action="Evaluate"|"Regularize"|"Promote"|"Transfer"|"Offboard";
type PersonalDraft=Pick<HRPerson,"name"|"gender"|"email"|"phone"|"birthDate"|"civilStatus"|"address"|"emergencyName"|"emergencyRelationship"|"emergencyPhone">;

const stages:Record<Action,string[]>={
 Evaluate:["Assessment details","Evaluator recommendation","Review & record"],
 Regularize:["Check probation & documents","Record HR decision","Confirm effective date"],
 Promote:["New position and approved compensation","Supporting decision","Confirm change"],
 Transfer:["Select receiving branch","Review device and obligation clearance","Confirm transfer"],
 Offboard:["Record separation reason","Device returns and obligations","Clearance & final-pay preparation"]
};
const employmentStatuses=["Probationary","Regular","Fixed-Term","Project-Based","Clearance Pending"];
const departments=["Operations","Service","Administration","Marketing"];
const emptyForm={
 name:"",branch:"" as Shop|"",department:"Operations",position:"",gender:"Prefer not to say",
 status:"Probationary",hire:"2026-10-12",salaryType:"Daily" as "Daily"|"Monthly",
 rate:"",probation:"6",sil:"5",vil:"0",email:"",phone:"",birthDate:"",
 civilStatus:"",address:"",emergencyName:"",emergencyRelationship:"",emergencyPhone:""
};
const toPersonalDraft=(p:HRPerson):PersonalDraft=>({
 name:p.name,gender:p.gender,email:p.email,phone:p.phone,birthDate:p.birthDate||"",
 civilStatus:p.civilStatus||"",address:p.address||"",emergencyName:p.emergencyName||"",
 emergencyRelationship:p.emergencyRelationship||"",emergencyPhone:p.emergencyPhone||""
});
const empty=(v?:string)=>v?.trim()||"Not recorded";
const formatDate=(v?:string)=>{
 if(!v)return "Not recorded";
 const d=new Date(`${v}T00:00:00`);
 return Number.isNaN(d.getTime())?v:d.toLocaleDateString("en-PH",{year:"numeric",month:"short",day:"numeric"});
};
const money=(v:number)=>new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP",maximumFractionDigits:2}).format(v);
const compactMoney=(v:number)=>new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP",minimumFractionDigits:0,maximumFractionDigits:2}).format(v);
const salaryAmount=(p:HRPerson)=>`${compactMoney(p.rate)}/${p.salaryType==="Daily"?"day":"month"}`;

export default function EmployeeWorkspace({branch,role}:{branch:Branch;role:Role}){
 const {data,update}=useHR();
 const [search,setSearch]=useState("");
 const [status,setStatus]=useState("All");
 const [department,setDepartment]=useState("All");
 const [localBranch,setLocalBranch]=useState("All");
 const [order,setOrder]=useState("name");
 const [page,setPage]=useState(1);
 const [rows,setRows]=useState<10|20|50>(10);
 const [selected,setSelected]=useState<string|null>(null);
 const [tab,setTab]=useState("Overview");
 const [add,setAdd]=useState(false);
 const [form,setForm]=useState({...emptyForm});
 const [editing,setEditing]=useState(false);
 const [personal,setPersonal]=useState<PersonalDraft|null>(null);
 const [action,setAction]=useState<Action|null>(null);
 const [step,setStep]=useState(0);
 const [effective,setEffective]=useState("2026-10-12");
 const [dest,setDest]=useState<Shop>("UC Mandaluyong");
 const [newPosition,setNewPosition]=useState("");
 const [newRate,setNewRate]=useState("");
 const [reason,setReason]=useState("");
 const [decision,setDecision]=useState("Approved");
 const [message,setMessage]=useState("");

 const people=useMemo(()=>{
  const result=data.people.filter(p=>
   (branch==="All Shops"||p.branch===branch)&&
   (localBranch==="All"||p.branch===localBranch)&&
   (status==="All"||p.status===status)&&
   (department==="All"||p.department===department)&&
   `${p.name} ${p.id} ${p.position} ${p.department} ${p.branch}`.toLowerCase().includes(search.toLowerCase())
  );
  return result.sort((a,b)=>order==="latest"?b.hire.localeCompare(a.hire):
   order==="oldest"?a.hire.localeCompare(b.hire):
   order==="missing"?a.documents.filter(d=>d.status==="Verified").length/Math.max(a.documents.length,1)-b.documents.filter(d=>d.status==="Verified").length/Math.max(b.documents.length,1):
   a.name.localeCompare(b.name));
 },[data.people,branch,localBranch,status,department,search,order]);
 const pageCount=Math.max(1,Math.ceil(people.length/rows));
 const current=Math.min(page,pageCount);
 const shown=people.slice((current-1)*rows,current*rows);
 const person=data.people.find(p=>p.id===selected);
 const verified=(p:HRPerson)=>p.documents.filter(x=>x.status==="Verified").length;
 const missing=(p:HRPerson)=>p.documents.filter(x=>x.status==="Missing").length;
 const assignedAssets=person?data.assets.filter(a=>a.employeeId===person.id&&["Assigned","For Return","Inspection"].includes(a.status)):[];
 const draft=personal;

 const updatePerson=(fn:(p:HRPerson)=>HRPerson)=>{
  if(!person)return;
  update(s=>({...s,people:s.people.map(p=>p.id===person.id?fn(p):p)}));
 };
 const openProfile=(id:string)=>{
  setSelected(id);setTab("Overview");setAction(null);setEditing(false);setPersonal(null);setMessage("");setAdd(false);
 };
 const backToDirectory=()=>{
  setSelected(null);setAction(null);setEditing(false);setPersonal(null);setMessage("");setAdd(false);
 };
 const setFilter=(fn:()=>void)=>{fn();setPage(1)};
 const startEdit=()=>{if(!person)return;setPersonal(toPersonalDraft(person));setEditing(true);setMessage("")};
 const savePersonal=(e:FormEvent)=>{
  e.preventDefault();if(!draft||!draft.name.trim()){setMessage("Employee full name is required.");return}
  updatePerson(p=>({...p,...draft,name:draft.name.trim(),timeline:[`${new Date().toISOString().slice(0,10)} · Personal details updated`,...p.timeline]}));
  setEditing(false);setPersonal(null);setMessage("Personal details saved to the browser review records.");
 };
 const startAction=(a:Action)=>{
  if(!person)return;
  setAction(a);setStep(0);setReason("");setDecision("Approved");setEffective("2026-10-12");
  setDest(person.branch);setNewPosition(person.position);setNewRate(String(person.rate));setMessage("");
 };
 function create(e:FormEvent){
  e.preventDefault();
  if(!form.branch||!form.name.trim()||!form.position.trim()||!(Number(form.rate)>0)){
   setMessage("Complete full name, assigned branch, position and basic salary.");return;
  }
  const prefix=form.branch.startsWith("MM")?"MM":"UC";
  const max=Math.max(0,...data.people.filter(p=>p.id.startsWith(prefix+"-")).map(p=>Number(p.id.split("-")[1])||0));
  const id=`${prefix}-${String(max+1).padStart(4,"0")}`;
  const p:HRPerson={
   id,name:form.name.trim(),branch:form.branch,department:form.department,position:form.position,
   status:form.status,gender:form.gender,hire:form.hire,salaryType:form.salaryType,
   rate:Number(form.rate),probation:form.status==="Probationary"?Number(form.probation):0,
   sil:Number(form.sil),vil:Number(form.vil),email:form.email,phone:form.phone,
   birthDate:form.birthDate,civilStatus:form.civilStatus,address:form.address,
   emergencyName:form.emergencyName,emergencyRelationship:form.emergencyRelationship,
   emergencyPhone:form.emergencyPhone,
   documents:["Resume","Medical Clearance","Employment Contract","NDA / Company Policies","Government IDs"].map(name=>({name,status:"Missing"})),
   timeline:[`${form.hire} · Employee registered at ${form.branch}`]
  };
  update(s=>({...s,people:[p,...s.people]}));
  setForm({...emptyForm});setAdd(false);openProfile(id);
  setMessage("Employee created. Review the Personal, Employment and Documents tabs.");
 }
 function record(){
  if(!person||!action||!reason.trim()){
   setMessage("Enter a supporting reason, evaluation or approval reference before recording the action.");return;
  }
  if(action==="Transfer"&&dest===person.branch){setMessage("Select a different destination branch.");return}
  if(action==="Promote"&&(!newPosition.trim()||!(Number(newRate)>0))){setMessage("Enter the new position and approved basic rate.");return}
  if(action==="Offboard"&&decision==="Approved"&&assignedAssets.length>0){
   setMessage("Complete device retrieval and inspection before marking offboarding as approved.");return;
  }
  const entry=`${effective} · ${action} (${decision}) · ${reason.trim()}`;
  const employmentChange:Partial<HRPerson>=decision!=="Approved"?{}:
   action==="Regularize"?{status:"Regular",probation:0}:
   action==="Transfer"?{branch:dest}:
   action==="Promote"?{position:newPosition.trim(),rate:Number(newRate)}:
   action==="Offboard"?{status:"Clearance Pending"}:{};
  updatePerson(p=>({...p,...employmentChange,timeline:[entry,...p.timeline]}));
  setAction(null);setStep(0);setMessage(`${action} decision recorded in employee history.`);
 }
 const next=()=>{
  if(!action)return;
  if(step===0&&action==="Promote"&&(!newPosition.trim()||!(Number(newRate)>0))){setMessage("Enter the proposed position and approved basic rate.");return}
  if(step>=1&&!reason.trim()){setMessage("Provide a written reason or approval reference before continuing.");return}
  setMessage("");setStep(n=>Math.min(2,n+1));
 };

 if(role==="BM")return <section className="panel">Employee 201 is restricted to authorized HR personnel. Use Employee Document Submission instead.</section>;

 return <div className="rev-stack employee201">
  <div className="rev-title">
   <div><h3>Employee 201 Files</h3><p>Employee master records, complete HR profile details, documentation and authorized employment actions.</p></div>
   <div className="rev-actions"><HelpButton topic="employee" label="Employee 201 Guide"/>
    {!person&&!add&&<button className="primary" onClick={()=>{setAdd(true);setMessage("")}}><Plus size={16}/> Add Employee</button>}
   </div>
  </div>
  {message&&<div className="rev-note" role="status">{message}</div>}

  {add&&<section className="panel">
   <div className="rev-title"><div><h3>Register Employee</h3><p>Create the employee master file. Related HR modules will use the same Employee ID.</p></div><button className="secondary" onClick={()=>{setAdd(false);setMessage("")}}>Cancel</button></div>
   <form onSubmit={create} className="employee201-registration">
    <div className="employee201-formsection"><h4>Personal & Contact Information</h4><div className="rev-form">
     <label>Full name *<input required value={form.name} onChange={e=>setForm(s=>({...s,name:e.target.value}))}/></label>
     <label>Gender<select value={form.gender} onChange={e=>setForm(s=>({...s,gender:e.target.value}))}>{["Male","Female","Prefer not to say"].map(x=><option key={x}>{x}</option>)}</select></label>
     <label>Date of birth<input type="date" value={form.birthDate} onChange={e=>setForm(s=>({...s,birthDate:e.target.value}))}/></label>
     <label>Civil status<select value={form.civilStatus} onChange={e=>setForm(s=>({...s,civilStatus:e.target.value}))}><option value="">Select status</option>{["Single","Married","Widowed","Separated","Other"].map(x=><option key={x}>{x}</option>)}</select></label>
     <label>Contact number<input type="tel" value={form.phone} onChange={e=>setForm(s=>({...s,phone:e.target.value}))}/></label>
     <label>Email address<input type="email" value={form.email} onChange={e=>setForm(s=>({...s,email:e.target.value}))}/></label>
     <label className="employee201-wide">Residential address<textarea rows={2} value={form.address} onChange={e=>setForm(s=>({...s,address:e.target.value}))}/></label>
    </div></div>
    <div className="employee201-formsection"><h4>Employment Details</h4><div className="rev-form">
     <label>Assigned branch *<select required value={form.branch} onChange={e=>setForm(s=>({...s,branch:e.target.value as Shop}))}><option value="">Select a branch</option>{shopNames.map(x=><option key={x}>{x}</option>)}</select></label>
     <label>Department<select value={form.department} onChange={e=>setForm(s=>({...s,department:e.target.value}))}>{departments.map(x=><option key={x}>{x}</option>)}</select></label>
     <label>Position *<input required value={form.position} onChange={e=>setForm(s=>({...s,position:e.target.value}))}/></label>
     <label>Employment status<select value={form.status} onChange={e=>setForm(s=>({...s,status:e.target.value}))}>{employmentStatuses.filter(x=>x!=="Clearance Pending").map(x=><option key={x}>{x}</option>)}</select></label>
     <label>Hire date *<input required type="date" value={form.hire} onChange={e=>setForm(s=>({...s,hire:e.target.value}))}/></label>
     {form.status==="Probationary"&&<label>Probation period (months)<input type="number" min="1" max="12" value={form.probation} onChange={e=>setForm(s=>({...s,probation:e.target.value}))}/></label>}
     <label>Salary type<select value={form.salaryType} onChange={e=>setForm(s=>({...s,salaryType:e.target.value as "Daily"|"Monthly"}))}><option>Daily</option><option>Monthly</option></select></label>
     <label>Basic rate ({form.salaryType==="Daily"?"per day":"per month"}) *<input required type="number" min="1" value={form.rate} onChange={e=>setForm(s=>({...s,rate:e.target.value}))}/></label>
     <label>SIL allocation (days)<input type="number" min="0" value={form.sil} onChange={e=>setForm(s=>({...s,sil:e.target.value}))}/></label>
     <label>VIL allocation (days)<input type="number" min="0" value={form.vil} onChange={e=>setForm(s=>({...s,vil:e.target.value}))}/></label>
    </div></div>
    <div className="employee201-formsection"><h4>Emergency Contact</h4><div className="rev-form">
     <label>Contact person's name<input value={form.emergencyName} onChange={e=>setForm(s=>({...s,emergencyName:e.target.value}))}/></label>
     <label>Relationship<input value={form.emergencyRelationship} onChange={e=>setForm(s=>({...s,emergencyRelationship:e.target.value}))}/></label>
     <label>Emergency phone<input type="tel" value={form.emergencyPhone} onChange={e=>setForm(s=>({...s,emergencyPhone:e.target.value}))}/></label>
    </div></div>
    <p className="muted">Personnel records are stored in this browser for frontend review only. Do not enter real private employee data until a secure backend is available.</p>
    <div className="rev-actions"><button type="submit" className="primary">Create Employee Record</button><button type="button" className="secondary" onClick={()=>setAdd(false)}>Cancel</button></div>
   </form>
  </section>}

  {!add&&!person&&<>
   <div className="employee201-summary">
    <div><small>Employees in view</small><strong>{people.length}</strong></div>
    <div><small>Regular employees</small><strong>{people.filter(p=>p.status==="Regular").length}</strong></div>
    <div><small>Probationary employees</small><strong>{people.filter(p=>p.status==="Probationary").length}</strong></div>
    <div><small>With missing documents</small><strong>{people.filter(p=>missing(p)>0).length}</strong></div>
   </div>
   <section className="panel"><div className="rev-title"><div><h3>Employee Directory</h3><p>Complete listing of employee assignments, work details and document completion. Open a profile for confidential records.</p></div><span className="tag">{people.length} records</span></div>
    <div className="rev-filters employee201-filters">
     <label>Search<input value={search} onChange={e=>setFilter(()=>setSearch(e.target.value))} placeholder="Name, Employee ID, branch, position..."/></label>
     <label>Branch<select value={localBranch} onChange={e=>setFilter(()=>setLocalBranch(e.target.value))}><option value="All">{branch==="All Shops"?"All branches":"Current branch"}</option>{(branch==="All Shops"?shopNames:[branch]).map(x=><option key={x}>{x}</option>)}</select></label>
     <label>Employment status<select value={status} onChange={e=>setFilter(()=>setStatus(e.target.value))}><option>All</option>{employmentStatuses.map(x=><option key={x}>{x}</option>)}</select></label>
     <label>Department<select value={department} onChange={e=>setFilter(()=>setDepartment(e.target.value))}><option>All</option>{departments.map(x=><option key={x}>{x}</option>)}</select></label>
     <label>Sort by<select value={order} onChange={e=>setFilter(()=>setOrder(e.target.value))}><option value="name">Name A–Z</option><option value="latest">Newest hires</option><option value="oldest">Earliest hires</option><option value="missing">Least documents verified</option></select></label>
     <button className="secondary" onClick={()=>{setSearch("");setLocalBranch("All");setStatus("All");setDepartment("All");setOrder("name");setPage(1)}}>Clear Filters</button>
    </div>
    <p className="employee201-tablehint">Scroll horizontally to view every directory column on smaller screens.</p>
    <div className="table-wrap employee201-tablewrap"><table className="employee201-table"><thead><tr>
     <th>Employee / ID</th><th>Branch</th><th>Department & Position</th><th>Gender</th><th>Employment Status</th><th>Date Hired</th><th>Salary / Type</th><th>Document Progress</th><th>Actions</th>
    </tr></thead><tbody>{shown.map(p=><tr key={p.id}>
     <td><strong>{p.name}</strong><small className="pay-small">{p.id}</small></td>
     <td>{p.branch}</td>
     <td><strong>{p.position}</strong><small className="pay-small">{p.department}</small></td>
     <td>{p.gender}</td>
     <td><span className="tag">{p.status}</span></td>
     <td>{formatDate(p.hire)}</td>
     <td><div className="employee201-salary"><strong className="employee201-salary-amount">{salaryAmount(p)}</strong><small className="employee201-salary-type">{p.salaryType}</small></div></td>
     <td><div className="employee201-docprogress"><strong>{verified(p)}/{p.documents.length} verified</strong><small>{missing(p)>0?`${missing(p)} missing`:"No missing documents"}</small></div></td>
     <td><button className="secondary" onClick={()=>openProfile(p.id)}>View 201 <ArrowRight size={15}/></button></td>
    </tr>)}</tbody></table>
    {shown.length===0&&<div className="empty">No matching employees. Try clearing the filters.</div>}
    </div>
    <div className="rev-pagination employee201-pages" aria-label="Employee directory pagination">
     <span>Showing {people.length?(current-1)*rows+1:0}–{Math.min(current*rows,people.length)} of {people.length}</span>
     <label>Rows per page <select value={rows} onChange={e=>{setRows(Number(e.target.value) as 10|20|50);setPage(1)}}>{[10,20,50].map(x=><option key={x} value={x}>{x}</option>)}</select></label>
     <button className="secondary" disabled={current<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Previous</button>
     <span>Page {current} of {pageCount}</span>
     <button className="secondary" disabled={current>=pageCount} onClick={()=>setPage(p=>Math.min(pageCount,p+1))}>Next</button>
    </div>
   </section>
  </>}

  {person&&!add&&<>
   <button className="rev-back" onClick={backToDirectory}><ArrowLeft size={16}/> Back to Employee Directory</button>
   <section className="panel">
    <div className="rev-title employee201-profiletitle"><div><h3><UserRound size={19}/> {person.name}</h3><p>{person.id} · {person.department} / {person.position} · {person.branch}</p></div><span className="tag">{person.status}</span></div>
    {!action&&<>
     <nav className="rev-tabs" aria-label="Employee 201 sections">{["Overview","Personal","Employment","Compensation","Documents","Evaluations","History","Clearance"].map(x=><button key={x} className={tab===x?"active":""} onClick={()=>{setTab(x);setEditing(false);setPersonal(null);setMessage("")}}>{x}</button>)}</nav>
     <div className="rev-detail employee201-detail">
      {tab==="Overview"&&<>
       <h4>Employee Summary</h4><div className="rev-facts employee201-facts">
        <div><small>Employee ID</small><b>{person.id}</b></div><div><small>Branch</small><b>{person.branch}</b></div><div><small>Department</small><b>{person.department}</b></div><div><small>Position</small><b>{person.position}</b></div>
        <div><small>Employment status</small><b>{person.status}</b></div><div><small>Date hired</small><b>{formatDate(person.hire)}</b></div><div><small>Gender</small><b>{person.gender}</b></div><div><small>Basic Salary</small><span className="employee201-salary"><strong className="employee201-salary-amount">{salaryAmount(person)}</strong><small className="employee201-salary-type">{person.salaryType}</small></span></div>
        <div><small>Phone number</small><b>{empty(person.phone)}</b></div><div><small>Email address</small><b>{empty(person.email)}</b></div><div><small>Required documents</small><b>{verified(person)} of {person.documents.length} verified</b></div><div><small>Assigned equipment</small><b>{assignedAssets.length} item(s)</b></div>
       </div>
       <div className="employee201-overviewnotes"><div><ClipboardList size={18}/><span>{missing(person)} missing required document(s)</span></div><div><ShieldCheck size={18}/><span>Employment actions must be recorded through the Actions section below.</span></div></div>
      </>}
      {tab==="Personal"&&<>
       <div className="rev-title"><div><h4>Personal & Emergency Information</h4><p>Contact information and basic personal details; confidential to authorized HR users.</p></div>{!editing&&<button className="secondary" onClick={startEdit}>Edit Details</button>}</div>
       {!editing&&<div className="rev-facts employee201-facts">
        <div><small>Full name</small><b>{person.name}</b></div><div><small>Gender</small><b>{person.gender}</b></div>
        <div><small>Birth date</small><b>{formatDate(person.birthDate)}</b></div><div><small>Civil status</small><b>{empty(person.civilStatus)}</b></div>
        <div><small>Contact number</small><b>{empty(person.phone)}</b></div><div><small>Email address</small><b>{empty(person.email)}</b></div>
        <div className="employee201-wide"><small>Address</small><b>{empty(person.address)}</b></div>
        <div><small>Emergency contact</small><b>{empty(person.emergencyName)}</b></div><div><small>Relationship</small><b>{empty(person.emergencyRelationship)}</b></div><div><small>Emergency phone</small><b>{empty(person.emergencyPhone)}</b></div>
       </div>}
       {editing&&draft&&<form onSubmit={savePersonal} className="rev-form">
        <label>Full name *<input required value={draft.name} onChange={e=>setPersonal(p=>p?{...p,name:e.target.value}:p)}/></label>
        <label>Gender<select value={draft.gender} onChange={e=>setPersonal(p=>p?{...p,gender:e.target.value}:p)}>{["Male","Female","Prefer not to say"].map(x=><option key={x}>{x}</option>)}</select></label>
        <label>Birth date<input type="date" value={draft.birthDate||""} onChange={e=>setPersonal(p=>p?{...p,birthDate:e.target.value}:p)}/></label>
        <label>Civil status<select value={draft.civilStatus||""} onChange={e=>setPersonal(p=>p?{...p,civilStatus:e.target.value}:p)}><option value="">Select status</option>{["Single","Married","Widowed","Separated","Other"].map(x=><option key={x}>{x}</option>)}</select></label>
        <label>Contact number<input type="tel" value={draft.phone} onChange={e=>setPersonal(p=>p?{...p,phone:e.target.value}:p)}/></label>
        <label>Email address<input type="email" value={draft.email} onChange={e=>setPersonal(p=>p?{...p,email:e.target.value}:p)}/></label>
        <label className="employee201-wide">Residential address<textarea rows={2} value={draft.address||""} onChange={e=>setPersonal(p=>p?{...p,address:e.target.value}:p)}/></label>
        <label>Emergency contact name<input value={draft.emergencyName||""} onChange={e=>setPersonal(p=>p?{...p,emergencyName:e.target.value}:p)}/></label>
        <label>Relationship<input value={draft.emergencyRelationship||""} onChange={e=>setPersonal(p=>p?{...p,emergencyRelationship:e.target.value}:p)}/></label>
        <label>Emergency phone<input type="tel" value={draft.emergencyPhone||""} onChange={e=>setPersonal(p=>p?{...p,emergencyPhone:e.target.value}:p)}/></label>
        <div className="rev-actions employee201-wide"><button type="submit" className="primary">Save Changes</button><button type="button" className="secondary" onClick={()=>{setEditing(false);setPersonal(null)}}>Cancel</button></div>
       </form>}
      </>}
      {tab==="Employment"&&<>
       <h4>Employment & Assignment</h4>
       <div className="rev-facts employee201-facts"><div><small>Employee number</small><b>{person.id}</b></div><div><small>Company branch</small><b>{person.branch}</b></div><div><small>Department</small><b>{person.department}</b></div><div><small>Position / Job title</small><b>{person.position}</b></div><div><small>Employment status</small><b>{person.status}</b></div><div><small>Date hired</small><b>{formatDate(person.hire)}</b></div><div><small>Probation duration</small><b>{person.probation?`${person.probation} months`:"Not applicable"}</b></div><div><small>Pay basis</small><b>{person.salaryType} rate</b></div></div>
       <p className="employee201-hint">Employment changes such as transfer, promotion and regularization are handled through Employee Actions to maintain history.</p>
      </>}
      {tab==="Compensation"&&<>
       <h4>Compensation & Benefits</h4>
       <div className="rev-facts employee201-facts"><div><small>Salary basis</small><b>{person.salaryType}-paid</b></div><div><small>Current basic rate</small><b>{money(person.rate)} / {person.salaryType==="Daily"?"day":"month"}</b></div><div><small>SIL allocation</small><b>{person.sil} days</b></div><div><small>VIL allocation</small><b>{person.vil} days</b></div></div>
       <h4>Applicable Premium Rate Profile</h4>
       <div className="rev-facts employee201-facts">
        <div><small>Regular overtime</small><b>{effectiveRate(person,data.rates).ot}%</b></div><div><small>Rest-day work</small><b>{effectiveRate(person,data.rates).rdw}%</b></div><div><small>Rest-day overtime</small><b>{effectiveRate(person,data.rates).rdot}%</b></div><div><small>Regular holiday</small><b>{effectiveRate(person,data.rates).regular}%</b></div><div><small>Special day</small><b>{effectiveRate(person,data.rates).special}%</b></div>
       </div><p className="employee201-hint">Premium rate changes are managed in Payroll → Employee Rate Management. This tab displays the shared employee profile.</p>
      </>}
      {tab==="Documents"&&<>
       <h4>Employee Document Checklist</h4><p className="muted">BM-submitted documents must be verified by HR before they count as complete. Do not store actual government ID numbers in this unsecured browser prototype.</p>
       <div className="employee201-doclist">{person.documents.map((d,i)=><div className="rev-row" key={`${d.name}-${i}`}><FileText size={17}/><div className="employee201-docitem"><strong>{d.name}</strong><small>{d.status==="Verified"?"Verified and included":d.status==="Submitted"?"For verification":"Required — not yet received"}</small></div><span className="tag">{d.status}</span></div>)}</div>
       <h4>Pending HR Document Submissions</h4>
       {data.submissions.filter(s=>s.employeeId===person.id&&s.status==="Pending HR Review").map(s=><div className="rev-row" key={s.id}><FileText size={17}/><div className="employee201-docitem"><strong>{s.type}</strong><small>{s.fileName} · {s.submittedBy}</small></div><span className="tag">Pending HR Review</span></div>)}
       {!data.submissions.some(s=>s.employeeId===person.id&&s.status==="Pending HR Review")&&<p className="muted">No pending uploads for this employee.</p>}
      </>}
      {tab==="Evaluations"&&<>
       <h4>Employee Evaluations</h4>
       {person.timeline.filter(t=>t.includes("Evaluate")).map((t,i)=><div className="rev-row" key={i}><ClipboardList size={17}/><span>{t}</span></div>)}
       {!person.timeline.some(t=>t.includes("Evaluate"))&&<p className="muted">No recorded evaluation. Use Employee Actions → Evaluate to add one.</p>}
      </>}
      {tab==="History"&&<>
       <h4>Employment Record History</h4>
       {person.timeline.map((x,i)=><div className="rev-row" key={i}><BriefcaseBusiness size={17}/><span>{x}</span></div>)}
      </>}
      {tab==="Clearance"&&<>
       <h4>Employee Clearance & Accountability</h4>
       <div className="rev-facts employee201-facts"><div><small>Employment status</small><b>{person.status}</b></div><div><small>Outstanding assigned equipment</small><b>{assignedAssets.length} item(s)</b></div></div>
       {assignedAssets.map(a=><div className="rev-row" key={a.id}><BriefcaseBusiness size={17}/><span>{a.name} ({a.id})</span><span className="tag">{a.status}</span></div>)}
       <p className="employee201-hint">Clearance requires device retrieval/inspection and HR validation of obligations before completion. Use Employee Actions → Offboard for the employment procedure.</p>
      </>}
     </div>
     <div className="rev-title employee201-actions-title"><h4>Employee Actions</h4><HelpButton topic="workflow" label="About employment actions"/></div>
     <div className="rev-actions rev-wrap">{(["Evaluate","Regularize","Promote","Transfer","Offboard"] as Action[]).filter(a=>a!=="Regularize"||person.status==="Probationary").map(a=><button key={a} className="secondary" onClick={()=>startAction(a)}>{a}</button>)}</div>
    </>}
    {action&&<div className="rev-process">
     <div className="rev-title"><h3>{action} — {person.name}</h3><button className="secondary" onClick={()=>setAction(null)}>Cancel</button></div>
     <div className="rev-steps">{stages[action].map((x,i)=><span key={x} className={i<=step?"active":""}>{i+1}. {x}</span>)}</div>
     <p><strong>Step {step+1}:</strong> {stages[action][step]}</p>
     {action==="Transfer"&&<label>Receiving branch<select value={dest} onChange={e=>setDest(e.target.value as Shop)}>{shopNames.map(x=><option key={x}>{x}</option>)}</select></label>}
     {action==="Promote"&&<div className="rev-form"><label>New position<input value={newPosition} onChange={e=>setNewPosition(e.target.value)}/></label><label>Approved basic rate<input type="number" min="1" value={newRate} onChange={e=>setNewRate(e.target.value)}/></label></div>}
     {action==="Offboard"&&<p className="rev-note">{assignedAssets.length} device(s) require retrieval or inspection. Offboarding cannot be completed with outstanding company assets.</p>}
     <label>Effective date<input type="date" value={effective} onChange={e=>setEffective(e.target.value)}/></label>
     <label>Assessment, supporting reason or approval reference<textarea rows={3} value={reason} onChange={e=>setReason(e.target.value)} placeholder="Explain the decision and supporting information"/></label>
     {step===2&&<label>HR decision<select value={decision} onChange={e=>setDecision(e.target.value)}><option>Approved</option><option>Deferred</option><option>Declined</option></select></label>}
     {step===2&&<div className="rev-document"><h4>Decision Summary</h4><p>Action: {action} · Employee: {person.id}</p><p>Effective: {effective} · Decision: {decision}</p><p>Supporting reason: {reason||"Not provided"}</p><p className="muted">Browser-only review record. This is not a formal signed decision or production approval.</p></div>}
     <div className="rev-actions"><button className="secondary" onClick={()=>step===0?setAction(null):setStep(s=>s-1)}>Back</button><button className="primary" onClick={step===2?record:next}>{step===2?"Record Decision":"Continue"} <ArrowRight size={15}/></button></div>
    </div>}
   </section>
  </>}
 </div>;
}
