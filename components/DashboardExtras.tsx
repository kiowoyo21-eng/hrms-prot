"use client";
import {useEffect,useState} from "react";
import {ArrowRight,BarChart3,ClipboardList,FileText,FolderOpen,Users,Wallet,HardDrive,ShieldCheck,BriefcaseBusiness} from "lucide-react";
import {php} from "../lib/people";
import {useHR} from "../lib/hrState";
import {isHrRole,type Branch,type ModuleId,type Role} from "../lib/mock";
import HelpButton from "./HelpButton";
import styles from "./DashboardExtras.module.css";
import {reportRecordView,type ExtraKey,type DashboardRecordView} from "../lib/dashboardRecordViews";
import DashboardRecordsDialog from "./DashboardRecordsDialog";

const shortcuts=[
 {name:"Employee Demographics",id:"demographics" as ModuleId,roles:["HR","Super Admin"],icon:Users},
 {name:"HR Forms & Requests",id:"hr-forms" as ModuleId,roles:["HR","Super Admin","BM"],icon:ClipboardList},
 {name:"Add / Find Employee",id:"employees" as ModuleId,roles:["HR","Super Admin"],icon:Users},
 {name:"Recruitment",id:"lifecycle" as ModuleId,roles:["HR","Super Admin","BM"],icon:BriefcaseBusiness},
 {name:"Payroll & Rates",id:"payroll" as ModuleId,roles:["HR","Super Admin"],icon:Wallet},
 {name:"Employee Documents",id:"submissions" as ModuleId,roles:["BM"],icon:FileText},
 {name:"Documents & Signing",id:"documents" as ModuleId,roles:["HR","Super Admin"],icon:FolderOpen},
 {name:"Devices & Accountability",id:"assets" as ModuleId,roles:["HR","Super Admin"],icon:HardDrive},
 {name:"Government Compliance",id:"compliance" as ModuleId,roles:["HR","Super Admin"],icon:ShieldCheck},
 {name:"Reports",id:"filters" as ModuleId,roles:["HR","Super Admin"],icon:BarChart3}
];

/** Compact, directly visible report summaries. Do not duplicate headcount or gender KPIs. */
export default function DashboardExtras({branch,role,onNavigate}:{branch:Branch;role:Role;onNavigate:(id:ModuleId)=>void}){
 const {data,ready}=useHR();
 const [recordView,setRecordView]=useState<DashboardRecordView|null>(null);
 useEffect(()=>setRecordView(null),[branch,role]);
 const openReport=(key:ExtraKey)=>setRecordView(reportRecordView(data,branch,key));
 const people=data.people.filter(p=>branch==="All Shops"||p.branch===branch);
 const regular=people.filter(p=>p.status==="Regular").length;
 const probationary=people.filter(p=>p.status==="Probationary").length;
 const monthlyPaid=people.filter(p=>p.salaryType==="Monthly").reduce((sum,p)=>sum+p.rate,0);
 const dailyRates=people.filter(p=>p.salaryType==="Daily").reduce((sum,p)=>sum+p.rate,0);
 const showReports=isHrRole(role)||role==="Super Admin";
 return <div className={styles.root}><DashboardRecordsDialog view={recordView} onClose={()=>setRecordView(null)}/>
  {showReports&&<section aria-label="Additional HR Reports" className={styles.reports}>
    <div className={styles.heading}><h3>Additional HR Reports</h3><span>Based on current Employee 201 records</span></div>
    <div className={styles.reportGrid}>
      <button type="button" className={styles.reportCard} onClick={()=>openReport("Employment Status")} disabled={!ready} aria-label="Show recorded employment status data">
        <span className={styles.cardTitle}><BriefcaseBusiness size={20}/><b>Employment Status</b><ArrowRight className={styles.chevron} size={16}/></span>
        <span className={styles.dataRow}><span>Regular</span><strong>{regular}</strong></span>
        <span className={styles.dataRow}><span>Probationary</span><strong>{probationary}</strong></span>
      </button>
      <button type="button" className={styles.reportCard} onClick={()=>openReport("Basic Pay Rates")} disabled={!ready} aria-label="Show recorded employee basic rates">
        <span className={styles.cardTitle}><Wallet size={20}/><b>Basic Pay Rates</b><ArrowRight className={styles.chevron} size={16}/></span>
        <span className={styles.dataRow}><span>Monthly basic-rate sum</span><strong>{php(monthlyPaid)}</strong></span>
        <span className={styles.dataRow}><span>Daily basic-rate sum</span><strong>{php(dailyRates)}</strong></span>
      </button>
      <button type="button" className={styles.reportCard} onClick={()=>openReport("Compliance")} disabled={!ready} aria-label="Show recorded statutory identifier presence">
        <span className={styles.cardTitle}><ShieldCheck size={20}/><b>Compliance</b><ArrowRight className={styles.chevron} size={16}/></span>
        <span className={styles.complianceTags}>SSS · PhilHealth · Pag-IBIG · BIR</span>
        <span className={styles.cardLink}>View recorded information <ArrowRight size={14}/></span>
      </button>
    </div>
    <p className={styles.rateNote}>Basic-rate sums are reference figures, not gross releases or verified payroll expenses.</p>
  </section>}
  <section aria-label="Quick Actions" className={styles.actions}>
   <div className={styles.heading}><h3>Quick Actions</h3><HelpButton topic="dashboard" label="Dashboard guide"/></div>
   <div className={styles.shortcutGrid}>{shortcuts.filter(x=>x.roles.includes(isHrRole(role)?"HR":role)).map(x=><button key={x.id} type="button" onClick={()=>onNavigate(x.id)}><x.icon size={16}/><span>{x.name}</span><ArrowRight size={15}/></button>)}</div>
  </section>
 </div>;
}
