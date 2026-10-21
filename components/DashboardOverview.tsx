"use client";
import {useEffect,useMemo,useState} from "react";
import {ArrowRight,ArrowUpRight,BriefcaseBusiness,ClipboardCheck,Clock3,FileWarning,ShieldCheck,TrendingDown,TrendingUp,UserRound,Users,Wallet} from "lucide-react";
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
  <header className={styles.hero}>
   <div className={styles.heroCopy}>
    <span className={styles.eyebrow}><span className={styles.liveDot}/> WORKFORCE INTELLIGENCE <span className={styles.separator}>/</span> {branch}</span>
    <h2>People & Operations <span>Overview</span></h2>
    <p>A clear view of your team, compensation, hiring activity and HR requests. Reporting period: <b>{month}</b>.</p>
    <div className={styles.heroFacts}><span><ShieldCheck size={14}/> Branch-scoped records</span><span><Clock3 size={14}/> Last completed month</span><span>Browser-local demonstration</span></div>
   </div>
   <div className={styles.heroAction}>{showHR&&<button type="button" onClick={()=>onNavigate("demographics")}>Explore Demographics <ArrowUpRight size={16}/></button>}</div>
  </header>
  <div className={styles.sectionHeading}><div><span className={styles.sectionNumber}>01</span><div><h3>Workforce at a glance</h3><p>Employee 201 headcount and last month's recorded movements</p></div></div><span className={styles.periodPill}>{month}</span></div>
  <div className={styles.cards}>
   <article className={`${styles.metric} ${styles.featured}`}><div className={styles.metricTop}><span className={styles.iconBox}><Users size={20}/></span><span className={styles.metricBadge}>HEADCOUNT</span></div><small>Total employees</small><strong>{ready?employee.total:"—"}</strong><span>Within your selected branch scope</span><div className={styles.metricRule}/><div className={styles.subFact}>{ready?`${employee.male+employee.female} with male/female recorded · ${employee.unspecified} unspecified`:"Reading records…"}</div></article>
   <article className={styles.metric}><div className={styles.metricTop}><span className={`${styles.iconBox} ${styles.blueIcon}`}><UserRound size={19}/></span></div><small>Male</small><strong>{ready?employee.male:"—"}</strong><span>Recorded gender only</span><div className={styles.barTrack}><i style={{width:ready&&employee.total?`${employee.male/employee.total*100}%`:"0%"}}/></div></article>
   <article className={styles.metric}><div className={styles.metricTop}><span className={`${styles.iconBox} ${styles.plumIcon}`}><Users size={19}/></span></div><small>Female</small><strong>{ready?employee.female:"—"}</strong><span>Recorded gender only</span><div className={`${styles.barTrack} ${styles.plumBar}`}><i style={{width:ready&&employee.total?`${employee.female/employee.total*100}%`:"0%"}}/></div></article>
   <article className={styles.metric}><div className={styles.metricTop}><span className={`${styles.iconBox} ${styles.greenIcon}`}><TrendingUp size={19}/></span></div><small>Hired this period</small><strong>{ready?employee.hires:"—"}</strong><span>From Employee 201 hire dates</span></article>
   <article className={styles.metric}><div className={styles.metricTop}><span className={`${styles.iconBox} ${styles.roseIcon}`}><TrendingDown size={19}/></span></div><small>Separated this period</small><strong>{ready?employee.exits:"—"}</strong><span>Applied offboarding cases only; {employee.terminations} terminations</span></article>
   {showHR&&<article className={`${styles.metric} ${styles.salary}`}><div className={styles.metricTop}><span className={`${styles.iconBox} ${styles.goldIcon}`}><Wallet size={19}/></span><span className={styles.metricBadge}>REVIEWED RELEASES</span></div><small>Gross salary released · {month}</small><strong>{ready?(employee.salaryCount?php(employee.salaryGross):"No releases recorded"):"—"}</strong><span>{employee.salaryCount} browser-reviewed release(s) · excludes {employee.sampleReleasesExcluded} sample record(s)</span></article>}
  </div>
  <div className={styles.sectionHeading}><div><span className={styles.sectionNumber}>02</span><div><h3>People movements & requests</h3><p>Track hiring, separations, open matters and personal workload</p></div></div></div>
  <div className={styles.panels}>
   {showHR&&<section className={`${styles.panel} ${styles.movements}`}><div className={styles.panelTitle}><span className={styles.panelIcon}><BriefcaseBusiness size={18}/></span><div><h3>Hiring & separation by position</h3><p>Position-based movements in {month}</p></div></div>
    {employee.positions.length?<div className={styles.tablewrap}><table><thead><tr><th>Position</th><th>Hired</th><th>Separated</th><th>Terminated</th></tr></thead><tbody>{employee.positions.map(row=><tr key={row.position}><td>{row.position}</td><td><span className={styles.positive}>{row.gained}</span></td><td>{row.lost}</td><td>{row.terminations}</td></tr>)}</tbody></table></div>:<div className={styles.empty}><BriefcaseBusiness size={20}/><b>No recorded movements</b><span>There were no recorded hires or applied separations for this period.</span></div>}
   </section>}
   <section className={styles.panel}><div className={styles.panelTitle}><span className={styles.panelIcon}><FileWarning size={18}/></span><div><h3>Requests & complaints</h3><p>Forms and accessible incident reports</p></div></div>
    <div className={styles.mini}><div><small>Total requests</small><b>{loaded?requests.totalRequests:"—"}</b></div><div><small>Incident reports</small><b>{loaded?requests.totalReports:"—"}</b></div><div><small>Pending / open</small><b>{loaded?requests.pending:"—"}</b></div><div><small>Resolved / closed</small><b>{loaded?requests.resolved:"—"}</b></div></div>
    <div className={styles.links}><button type="button" onClick={()=>onNavigate("hr-forms")}>Forms & Requests <ArrowRight size={14}/></button><button type="button" onClick={()=>onNavigate("ir")}>Incident Reports <ArrowRight size={14}/></button></div>
   </section>
   <section className={styles.panel}><div className={styles.panelTitle}><span className={styles.panelIcon}><ClipboardCheck size={18}/></span><div><h3>My workload</h3><p>Documented tasks for {username}</p></div></div>
    <div className={styles.mini}><div><small>My pending requests</small><b>{loaded?requests.ownPending:"—"}</b></div><div><small>My resolved requests</small><b>{loaded?requests.ownCompleted:"—"}</b></div>{showHR&&<><div><small>Waiting for my review</small><b>{loaded?requests.toReview:"—"}</b></div><div><small>Reviews completed</small><b>{loaded?requests.completedReviews:"—"}</b></div></>}</div>
    <div className={styles.links}><button type="button" onClick={()=>onNavigate("hr-forms")}>Open My Tasks <ArrowRight size={14}/></button></div>
   </section>
  </div>
  {showHR&&<p className={styles.disclaimer}><ShieldCheck size={16}/> Salary figures are from last month's browser-reviewed gross releases, not estimated basic pay or a verified Accounting expense report. Current Employee 201 branches are used for attribution. Missing and sample data are not invented.</p>}
 </section>;
}
