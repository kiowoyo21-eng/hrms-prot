"use client";
import {useEffect,useMemo,useState} from "react";
import {ArrowRight,BarChart3,ClipboardCheck,FileWarning,Users,Wallet} from "lucide-react";
import {useHR} from "../lib/hrState";
import {php} from "../lib/people";
import {isHrRole,type Branch,type ModuleId,type Role} from "../lib/mock";
import {FORM_STORE_EVENT,FORM_STORE_KEY,readForms,type HRFormRecord} from "../lib/hrForms";
import {seedIncidents,type IncidentCase} from "../lib/incidentRecords";
import {watchAuditEvents} from "../lib/auditTrail";
import {dashboardEmployeeSummary,dashboardRequestSummary,lastCompletedMonth} from "../lib/dashboardAnalytics";
import styles from "./DashboardOverview.module.css";

const INCIDENT_STORAGE_KEY="uc-hr-ui-incident";
function readIncidents():IncidentCase[]{
 try{const raw=localStorage.getItem(INCIDENT_STORAGE_KEY);if(!raw)return seedIncidents;const parsed=JSON.parse(raw) as unknown;return Array.isArray(parsed)?parsed.filter((c):c is IncidentCase=>!!c&&typeof c==="object"&&typeof c.id==="string"&&typeof c.branch==="string"&&typeof c.stage==="string"&&typeof c.handler==="string").slice(0,1200):seedIncidents;}catch{return seedIncidents}
}
export default function DashboardOverview({branch,role,username,onNavigate}:{branch:Branch;role:Role;username:string;onNavigate:(id:ModuleId)=>void}){
 const {data,ready}=useHR();
 const [forms,setForms]=useState<HRFormRecord[]>([]);
 const [incidents,setIncidents]=useState<IncidentCase[]>([]);
 const [loaded,setLoaded]=useState(false);
 const [month]=useState(()=>lastCompletedMonth());
 useEffect(()=>{
  const sync=()=>{setForms(readForms());setIncidents(readIncidents());setLoaded(true)};
  sync();const unwatch=watchAuditEvents(sync);
  const onStorage=(e:StorageEvent)=>{if(e.key===FORM_STORE_KEY||e.key===INCIDENT_STORAGE_KEY)sync()};
  window.addEventListener(FORM_STORE_EVENT,sync);window.addEventListener("storage",onStorage);window.addEventListener("focus",sync);
  return()=>{unwatch();window.removeEventListener(FORM_STORE_EVENT,sync);window.removeEventListener("storage",onStorage);window.removeEventListener("focus",sync)};
 },[]);
 const employee=useMemo(()=>dashboardEmployeeSummary(data,branch,month),[data,branch,month]);
 const requests=useMemo(()=>dashboardRequestSummary(forms,incidents,branch,role,username),[forms,incidents,branch,role,username]);
 const showHR=isHrRole(role)||role==="Super Admin";
 return <section className={styles.overview} aria-label="Dashboard analytics">
  <div className={styles.heading}><div><h2><BarChart3 size={21}/> Workforce Analytics</h2><p>Branch-scoped HR records · last completed month: <b>{month}</b> · browser-local demo data</p></div>{showHR&&<button className="secondary" type="button" onClick={()=>onNavigate("demographics")}>Demographics <ArrowRight size={15}/></button>}</div>
  <div className={styles.cards}>
   <div className={styles.metric}><small>Employees</small><strong>{ready?employee.total:"—"}</strong><span>Employee 201 records in selected branch</span></div>
   <div className={styles.metric}><small>Male</small><strong>{ready?employee.male:"—"}</strong><span>Recorded gender</span></div>
   <div className={styles.metric}><small>Female</small><strong>{ready?employee.female:"—"}</strong><span>Recorded gender</span></div>
   <div className={styles.metric}><small>Not male/female recorded</small><strong>{ready?employee.unspecified:"—"}</strong><span>No gender inferred</span></div>
   <div className={styles.metric}><small>Hired · {month}</small><strong>{ready?employee.hires:"—"}</strong><span>From Employee 201 hire date</span></div>
   <div className={styles.metric}><small>Separated · {month}</small><strong>{ready?employee.exits:"—"}</strong><span>Applied offboarding, by effective date</span></div>
   {showHR&&<div className={`${styles.metric} ${styles.salary}`}><small>Salary released · {month}</small><strong>{ready?employee.salaryCount?php(employee.salaryGross):"No recorded releases":"—"}</strong><span>{employee.salaryCount} reviewed salary release(s) · gross, not net · {employee.sampleReleasesExcluded} sample releases excluded</span></div>}
  </div>
  <div className={styles.panels}>
   {showHR&&<div className={styles.panel}><h3><Users size={17}/> Hiring & Separation by Position</h3><p>Last completed month. Exits mean applied offboarding at effective date; termination is shown separately from other exits.</p>
    {employee.positions.length?<div className={styles.tablewrap}><table><thead><tr><th>Position</th><th>Gained</th><th>Lost</th><th>Terminated</th></tr></thead><tbody>{employee.positions.map(row=><tr key={row.position}><td>{row.position}</td><td>{row.gained}</td><td>{row.lost}</td><td>{row.terminations}</td></tr>)}</tbody></table></div>:<div className={styles.empty}>No recorded hires or applied offboardings in this period.</div>}
   </div>}
   <div className={styles.panel}><h3><FileWarning size={17}/> Requests & Complaints</h3><p>Internal HR Forms plus accessible Incident Reports; demo cases included when present.</p>
    <div className={styles.mini}><div><small>Requests</small><b>{loaded?requests.totalRequests:"—"}</b></div><div><small>Incident reports</small><b>{loaded?requests.totalReports:"—"}</b></div><div><small>Pending / open</small><b>{loaded?requests.pending:"—"}</b></div><div><small>Resolved / closed</small><b>{loaded?requests.resolved:"—"}</b></div></div>
    <div className={styles.links}><button type="button" onClick={()=>onNavigate("hr-forms")}>Open Forms <ArrowRight size={14}/></button><button type="button" onClick={()=>onNavigate("ir")}>Open Incidents <ArrowRight size={14}/></button></div>
   </div>
   <div className={styles.panel}><h3><ClipboardCheck size={17}/> My Task KPI — {username}</h3><p>Recorded HR Forms assignments only; not a full employee performance score.</p>
    <div className={styles.mini}><div><small>My pending requests</small><b>{loaded?requests.ownPending:"—"}</b></div><div><small>My resolved requests</small><b>{loaded?requests.ownCompleted:"—"}</b></div>{showHR&&<><div><small>Waiting for my review</small><b>{loaded?requests.toReview:"—"}</b></div><div><small>Reviews completed</small><b>{loaded?requests.completedReviews:"—"}</b></div></>}</div>
    <button type="button" className={styles.tasklink} onClick={()=>onNavigate("hr-forms")}>Review My Tasks <ArrowRight size={14}/></button>
   </div>
  </div>
  {showHR&&<p className={styles.disclaimer}><Wallet size={14}/> Salary figure is based on last month’s browser-reviewed gross releases, not projected pay, employee basic rates, or a verified Accounting expense report. Historical branch allocations follow current Employee 201 branch data.</p>}
 </section>;
}
