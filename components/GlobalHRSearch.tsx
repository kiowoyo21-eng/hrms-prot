"use client";
import {useEffect,useMemo,useState} from "react";
import {Search} from "lucide-react";
import type {Branch,Role} from "../lib/mock";
import {canViewForm,readForms,FORM_STORE_EVENT,type HRFormRecord} from "../lib/hrForms";
import type {HRPerson} from "../lib/hrState";
import {employeeOpenInHRMS,requestOpenInHRMS} from "../lib/requestNavigation";
import styles from "./RequestReview.module.css";
/** Permission-filtered local search; do not use this as a substitute for server ACLs. */
export default function GlobalHRSearch({username,role,branch,people,canViewEmployees}:{username:string;role:Role;branch:Branch;people:HRPerson[];canViewEmployees:boolean}){
 const [query,setQuery]=useState(""),[open,setOpen]=useState(false),[requests,setRequests]=useState<HRFormRecord[]>([]);
 useEffect(()=>{const sync=()=>setRequests(readForms());sync();window.addEventListener(FORM_STORE_EVENT,sync);return()=>window.removeEventListener(FORM_STORE_EVENT,sync)},[]);
 const results=useMemo(()=>{
  const needle=query.trim().toLowerCase();if(needle.length<2)return [];
  const employees=canViewEmployees?people.filter(p=>(branch==="All Shops"||p.branch===branch)&&`${p.name} ${p.id} ${p.department} ${p.position}`.toLowerCase().includes(needle)).slice(0,5).map(p=>({kind:"employee" as const,id:p.id,title:p.name,detail:`${p.id} · ${p.branch}`})):[];
  const forms=requests.filter(r=>canViewForm(r,username,role,branch)&&`${r.id} ${r.kind} ${r.employeeId}`.toLowerCase().includes(needle)).slice(0,5).map(r=>({kind:"request" as const,id:r.id,title:r.kind,detail:`${r.id} · ${r.status}`}));
  return [...employees,...forms].slice(0,8);
 },[query,people,canViewEmployees,branch,requests,username,role]);
 return <div className={styles.globalSearch}>
  <label><Search size={15}/><input aria-label="Search HRMS employees or requests" placeholder="Search employee / request" value={query} onFocus={()=>setOpen(true)} onChange={e=>{setQuery(e.target.value);setOpen(true)}} onKeyDown={e=>{if(e.key==="Escape")setOpen(false)}}/></label>
  {open&&query.trim().length>=2&&<div className={styles.searchResults} role="listbox" aria-label="HRMS search results">{results.length?results.map(item=><button type="button" key={`${item.kind}-${item.id}`} onClick={()=>{setOpen(false);setQuery("");if(item.kind==="employee")employeeOpenInHRMS(item.id);else requestOpenInHRMS(item.id)}}><strong>{item.title}</strong><small>{item.detail}</small></button>):<p>No authorized records found</p>}</div>}
 </div>;
}
