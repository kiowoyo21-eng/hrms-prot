"use client";
import {useEffect,useState} from "react";
import {useHR} from "../lib/hrState";
import {finalPayDeadlineState} from "../lib/thirteenthSettlement";
import {philippineToday} from "../lib/companyWeeklyPayroll";
import {usePublishModuleAlerts,type ModuleAlert} from "./ModuleAlerts";

/** Calendar-based alerts. No simulated push/email or auto-disbursement. */
export default function FinalPayDeadlinePublisher(){
 const {data}=useHR();
 const [today,setToday]=useState(philippineToday);
 useEffect(()=>{const refresh=()=>setToday(philippineToday());window.addEventListener("focus",refresh);const tick=window.setInterval(refresh,60000);return ()=>{window.removeEventListener("focus",refresh);window.clearInterval(tick)}},[]);
 const alerts:ModuleAlert[]=[];
 for(const c of data.lifecycleCases||[]){
  if(c.action!=="Offboard"||c.status!=="Applied (Demo)")continue;
  const record=(data.finalPayCases||[]).find(r=>r.lifecycleCaseId===c.id);
  const s=finalPayDeadlineState(c.effectiveDate,today,Boolean(record?.paymentAt));
  if(s.status==="Paid")continue;
  const employee=data.people.find(p=>p.id===c.employeeId);
  if(!record||["Due Soon","Urgent","Overdue"].includes(s.status)){
   alerts.push({id:`final-pay-deadline-${c.id}`,title:s.status==="Overdue"?"OVERDUE — Final Pay":s.status==="Urgent"?"Final Pay Due in 3 Days":s.status==="Due Soon"?"Final Pay Due Within 7 Days":"Final Pay Record Needed",detail:`${employee?.name||c.employeeId} · Due ${s.due} · ${record?.status||"Not prepared"} · ${s.daysRemaining??"—"} day(s) left`,level:s.status==="Overdue"||s.status==="Urgent"?"urgent":"normal",branch:c.sourceBranch,action:"payroll:finalpay"});
  }
 }
 usePublishModuleAlerts("payroll",alerts,"final-pay-deadlines");
 return null;
}
