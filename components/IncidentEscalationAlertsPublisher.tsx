"use client";
import {useEffect,useMemo,useState} from "react";
import type {Branch,Role} from "../lib/mock";
import {useHR} from "../lib/hrState";
import {seedIncidents,type IncidentCase} from "../lib/incidentRecords";
import {buildIncidentEscalations,DEFAULT_INCIDENT_POLICY,normalizeIncidentPolicy,type IncidentAlertPolicy,type IncidentEscalationReview} from "../lib/incidentEscalations";
import {philippineToday} from "../lib/companyWeeklyPayroll";
import {usePublishModuleAlerts,type ModuleAlert} from "./ModuleAlerts";

/** Reads only local review records; never sends HR case information to a network or push service.
 * Server authorization and confidential persistence are mandatory before production use. */
export default function IncidentEscalationAlertsPublisher({role,branch}:{role:Role;branch:Branch}){
 const {data}=useHR();
 const [cases,setCases]=useState<IncidentCase[]>([]);
 const [reviews,setReviews]=useState<IncidentEscalationReview[]>([]);
 const [policy,setPolicy]=useState<IncidentAlertPolicy>(DEFAULT_INCIDENT_POLICY);
 const [today,setToday]=useState(philippineToday);
 useEffect(()=>{
  const refresh=()=>{
   try{const raw=window.localStorage.getItem("uc-hr-ui-incident");const parsed=raw===null?seedIncidents:JSON.parse(raw);setCases(Array.isArray(parsed)?parsed:[])}catch{setCases([])}
   try{const parsed=JSON.parse(window.localStorage.getItem("uc-hr-ui-incident-hr-triage")||"[]");setReviews(Array.isArray(parsed)?parsed:[])}catch{setReviews([])}
   try{setPolicy(normalizeIncidentPolicy(JSON.parse(window.localStorage.getItem("uc-hr-ui-incident-alert-policy")||"null")||{}))}catch{setPolicy(DEFAULT_INCIDENT_POLICY)}
   setToday(philippineToday());
  };
  const local=(e:Event)=>{if(["incident","incident-hr-triage","incident-alert-policy"].includes((e as CustomEvent<string>).detail))refresh()};
  const stored=(e:StorageEvent)=>{if(e.key?.startsWith("uc-hr-ui-incident"))refresh()};
  refresh();window.addEventListener("hrms:localrecords",local);window.addEventListener("storage",stored);window.addEventListener("focus",refresh);
  return()=>{window.removeEventListener("hrms:localrecords",local);window.removeEventListener("storage",stored);window.removeEventListener("focus",refresh)};
 },[]);
 const alerts=useMemo<ModuleAlert[]>(()=>{
  if(role==="BM")return [];
  const done=new Set(reviews.map(r=>r.id));
  return buildIncidentEscalations({cases,attendance:data.payrollConfig?.attendanceRows||[],attendanceBatches:data.payrollConfig?.attendanceRecords||[],people:data.people,today,policy})
   .filter(a=>(branch==="All Shops"||a.branch===branch)&&!done.has(a.id))
   .map(a=>({id:a.id,title:a.title,detail:a.detail,branch:a.branch,level:a.severity==="Review"?"normal":"urgent",action:`review:${a.id}`}));
 },[role,branch,reviews,cases,data.payrollConfig,data.people,today,policy]);
 usePublishModuleAlerts("ir",alerts,"hr-escalations");
 return null;
}
