"use client";
import {useEffect,useState} from "react";
import {useHR} from "../lib/hrState";
import {opsLeaveCollisions,type LeaveRecordForBalance} from "../lib/leavePolicy";
import {usePublishModuleAlerts} from "./ModuleAlerts";
import type {Branch,Role} from "../lib/mock";

/** Publish BM staffing alerts even when the Leave workspace is not open.
 * Browser-only demo: no email/push delivery, secure server, or durable notification queue. */
export default function LeaveCapacityAlertPublisher({role,branch}:{role:Role;branch:Branch}){
 const {data}=useHR();
 const [requests,setRequests]=useState<LeaveRecordForBalance[]>([]);
 useEffect(()=>{
  const read=()=>{try{const raw=JSON.parse(localStorage.getItem("uc-hr-ui-leave")||"[]");setRequests(Array.isArray(raw)?raw:[])}catch{setRequests([])}};
  const onStore=(e:StorageEvent)=>{if(e.key==="uc-hr-ui-leave")read()};
  const onLocal=(e:Event)=>{if((e as CustomEvent<string>).detail==="leave")read()};
  read();window.addEventListener("storage",onStore);window.addEventListener("hrms:localrecords",onLocal);
  return ()=>{window.removeEventListener("storage",onStore);window.removeEventListener("hrms:localrecords",onLocal)};
 },[]);
 const shops=branch==="All Shops"?(["UC Mandaluyong","UC Las Piñas","UC Quezon City","MM Mandaluyong"] as Branch[]):[branch];
 const alerts=shops.flatMap(shop=>opsLeaveCollisions(requests,data.people,shop)).map(x=>({
  id:`ops-leave-capacity-${x.branch}-${x.date}`,
  title:`OPS leave staffing alert — ${x.count} employees`,
  detail:`${x.date} · ${x.employees.map(e=>e.name).join(", ")}`,
  branch:x.branch,level:"urgent" as const,action:`capacity:${x.date}`
 }));
 usePublishModuleAlerts("leave",alerts,"ops-capacity");
 return null;
}
