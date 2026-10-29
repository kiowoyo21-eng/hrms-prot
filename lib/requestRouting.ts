/** Browser-local approval routing prototype. Never a security boundary. */
import type {Branch,Role} from "./mock";
export type AssignedApproverRole = "BM" | "Dept Head" | "HR";
export type ReviewerAssignment = {id:string;username:string;role:AssignedApproverRole;branch:Branch;department:string;active:boolean};
export type RequestRoute = {department:string;approverUsername:string;approverRole:AssignedApproverRole;assignedAt:string};
export const ROUTING_KEY="uc-hr-request-routing-v1";
export const ROUTING_EVENT="uc-hr-request-routing-changed";
/** Defaults are examples only; real people and departments must be configured by ADMIN. */
export const DEFAULT_REVIEWERS:ReviewerAssignment[] = [
 {id:"demo-bm",username:"bmaccount",role:"BM",branch:"UC Mandaluyong",department:"Operations",active:true},
 {id:"demo-marketing",username:"marketinghead",role:"Dept Head",branch:"All Shops",department:"Marketing",active:true},
 {id:"demo-project",username:"pmhead",role:"Dept Head",branch:"All Shops",department:"Project Management",active:true},
 {id:"demo-hr",username:"hraccount",role:"HR",branch:"All Shops",department:"*",active:true},
 {id:"demo-hr-review",username:"hrreviewer",role:"HR",branch:"All Shops",department:"*",active:true}
];
const normal=(s:string)=>{const value=s.trim().toLowerCase().replace(/\s+/g," ");return ["pm","project management"].includes(value)?"project management":value};
export const isOpsDepartment=(value:string)=>["ops","operations"].includes(normal(value));
export const HR_CONFIDENTIAL_FORMS=new Set(["Incident Statement","Workplace Dispute / Grievance","Notice to Explain / Employee Response"]);
export function readReviewerAssignments():ReviewerAssignment[]{
 if(typeof window==="undefined")return DEFAULT_REVIEWERS;
 try{
  const raw=localStorage.getItem(ROUTING_KEY);
  if(raw===null)return DEFAULT_REVIEWERS;
  const parsed:unknown=JSON.parse(raw);
  if(!Array.isArray(parsed))return DEFAULT_REVIEWERS;
  return parsed.filter((v):v is ReviewerAssignment=>{
   if(!v||typeof v!=="object")return false;
   const row=v as Partial<ReviewerAssignment>;
   return typeof row.id==="string"&&typeof row.username==="string"&&typeof row.department==="string"&&typeof row.branch==="string"&&["BM","Dept Head","HR"].includes(row.role||"")&&typeof row.active==="boolean";
  }).slice(0,100);
 }catch{return DEFAULT_REVIEWERS}
}
export function saveReviewerAssignments(assignments:ReviewerAssignment[]):boolean{
 if(typeof window==="undefined")return false;
 try{localStorage.setItem(ROUTING_KEY,JSON.stringify(assignments));window.dispatchEvent(new Event(ROUTING_EVENT));return true}catch{return false}
}
/** Deterministic, branch-and-department-scoped selection; HR is review fallback only. */
export function chooseRequestReviewer(department:string,branch:Branch,assignments:ReviewerAssignment[],now:string,kind?:string,requestor?:string):RequestRoute|null{
 const candidates=assignments.filter(a=>a.active&&a.username.trim()&&a.username!==requestor&&((a.branch===branch)||(a.branch==="All Shops")));
 const restricted=Boolean(kind&&HR_CONFIDENTIAL_FORMS.has(kind));
 const ops=isOpsDepartment(department);
 const departmentMatches=(a:ReviewerAssignment)=>normal(a.department)===normal(department)||(ops&&isOpsDepartment(a.department));
 const primary=candidates.find(a=>a.role===(ops?"BM":"Dept Head")&&departmentMatches(a)&&a.branch===branch)
  ||candidates.find(a=>a.role===(ops?"BM":"Dept Head")&&departmentMatches(a)&&a.branch==="All Shops");
 const fallback=candidates.find(a=>a.role==="HR"&&a.department==="*"&&a.branch===branch)||candidates.find(a=>a.role==="HR"&&a.department==="*"&&a.branch==="All Shops");
 const match=restricted?fallback:(primary||fallback);
 return match?{department,approverUsername:match.username,approverRole:match.role,assignedAt:now}:null;
}
export function branchesForBM(username:string,assignments:ReviewerAssignment[]):Branch[]{
 return Array.from(new Set(assignments.filter(r=>r.active&&r.username===username&&r.role==="BM"&&r.branch!=="All Shops").map(r=>r.branch)));
}
export function canActOnAssignedRequest(actor:string,role:Role,route:RequestRoute|undefined):boolean{
 if(!route||!actor.trim()||route.approverUsername!==actor)return false;
 return role===route.approverRole || (route.approverRole==="HR"&&role==="Special Final Approver — Ms Kate");
}
