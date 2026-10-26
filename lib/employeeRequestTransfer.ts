/** Manual, untrusted, browser-only request handoff. Not secure identity verification or live delivery. */
import {formSchemas,validateFields,type FormKind} from "./hrForms";
import type {Branch} from "./mock";

export const PUBLIC_EMPLOYEE_KINDS:FormKind[]=[
 "Employee Document Request","Attendance Correction","Schedule Change",
 "Workplace Dispute / Grievance","Incident Statement","Notice to Explain / Employee Response",
 "Return-to-Work Clearance","Separation & Clearance Request","Cash Advance Request"
];
export const REQUEST_QUEUE_KEY="uc-hr-demo-employee-request-handoff-v1";
export const REQUEST_QUEUE_EVENT="uc-hr-demo-employee-request-changed";
export const REQUEST_BRANCHES=["UC Mandaluyong","UC Las Piñas","UC Quezon City","MM Mandaluyong"] as const;
export type RequestBranch=typeof REQUEST_BRANCHES[number];
export type EmployeeRequestPacket={
 version:1;id:string;kind:"Leave"|"HR Form";employeeId:string;employeeName:string;
 branch:RequestBranch;submittedAt:string;type:string;fields:Record<string,string>;
};
const MAX_PACKET_BYTES=16000;
const validISO=(value:string)=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(`${value}T12:00:00Z`))&&new Date(`${value}T12:00:00Z`).toISOString().slice(0,10)===value;
export function leaveDays(from:string,to:string){
 if(!validISO(from)||!validISO(to)||to<from)throw Error("Enter a valid start and end date");
 const days=Math.round((Date.parse(`${to}T12:00:00Z`)-Date.parse(`${from}T12:00:00Z`))/86400000)+1;
 if(days<1||days>90)throw Error("Leave request must cover 1–90 calendar days. HR will verify chargeable working days.");
 return days;
}
const acceptedLeaveTypes=["SIL","VIL","Company Sick Leave","Unpaid Leave"];
export function validateEmployeePacket(value:unknown):EmployeeRequestPacket{
 if(!value||typeof value!=="object"||Array.isArray(value))throw Error("Not an employee request packet");
 const p=value as Partial<EmployeeRequestPacket>;
 if(p.version!==1||typeof p.id!=="string"||!/^EREQ-[A-Za-z0-9-]{8,80}$/.test(p.id)||!(["Leave","HR Form"] as unknown[]).includes(p.kind)||typeof p.employeeId!=="string"||!/^[-_A-Za-z0-9]{2,60}$/.test(p.employeeId)||typeof p.employeeName!=="string"||!p.employeeName.trim()||p.employeeName.length>120||!REQUEST_BRANCHES.includes(p.branch as RequestBranch)||typeof p.submittedAt!=="string"||!Number.isFinite(Date.parse(p.submittedAt))||typeof p.type!=="string"||typeof p.fields!=="object"||!p.fields||Array.isArray(p.fields))throw Error("Invalid employee request format");
 const fields=p.fields as Record<string,unknown>;
 if(Object.keys(fields).length>25||Object.entries(fields).some(([k,v])=>k.length>100||typeof v!=="string"||v.length>1500))throw Error("Invalid or oversized request answers");
 const validated=p as EmployeeRequestPacket;
 if(validated.kind==="Leave"){
  if(!acceptedLeaveTypes.includes(validated.type))throw Error("Invalid leave type");
  leaveDays(fields.from as string,fields.to as string);
  if(typeof fields.reason!=="string"||!fields.reason.trim())throw Error("Leave reason is required");
 }else{
  if(!PUBLIC_EMPLOYEE_KINDS.includes(validated.type as FormKind))throw Error("Not an employee-facing request");
  const issues=validateFields(validated.type as FormKind,validated.fields);
  if(issues.length)throw Error(issues[0]);
 }
 return validated;
}
export function createEmployeePacket(input:Omit<EmployeeRequestPacket,"version"|"id"|"submittedAt">):EmployeeRequestPacket{
 const id=`EREQ-${typeof crypto!=="undefined"&&crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
 return validateEmployeePacket({...input,id,version:1,submittedAt:new Date().toISOString()});
}
export function readEmployeeQueue():EmployeeRequestPacket[]{
 if(typeof window==="undefined")return [];
 try{const records=JSON.parse(localStorage.getItem(REQUEST_QUEUE_KEY)||"[]");return Array.isArray(records)?records.slice(-100).flatMap(x=>{try{return [validateEmployeePacket(x)]}catch{return []}}):[]}catch{return []}
}
export function saveEmployeeQueue(packet:EmployeeRequestPacket){
 const checked=validateEmployeePacket(packet);
 const rows=readEmployeeQueue();
 if(rows.some(x=>x.id===checked.id))return false;
 localStorage.setItem(REQUEST_QUEUE_KEY,JSON.stringify([...rows,checked].slice(-100)));
 window.dispatchEvent(new Event(REQUEST_QUEUE_EVENT));return true;
}
export function removeEmployeeQueue(id:string){
 localStorage.setItem(REQUEST_QUEUE_KEY,JSON.stringify(readEmployeeQueue().filter(x=>x.id!==id)));
 window.dispatchEvent(new Event(REQUEST_QUEUE_EVENT));
}
export function parseEmployeePacketFile(text:string):EmployeeRequestPacket{
 if(new Blob([text]).size>MAX_PACKET_BYTES)throw Error("File exceeds 16 KB limit");
 return validateEmployeePacket(JSON.parse(text) as unknown);
}
export function downloadEmployeePacket(packet:EmployeeRequestPacket){
 const checked=validateEmployeePacket(packet);
 const url=URL.createObjectURL(new Blob([JSON.stringify(checked,null,2)],{type:"application/json"}));
 const a=document.createElement("a");a.href=url;a.download=`${checked.id}.json`;a.click();window.setTimeout(()=>URL.revokeObjectURL(url),500);
}
export function employeeRequestLink(kind:"Leave"|"HR Form",formType?:FormKind){
 const path=kind==="Leave"?"/employee/leave":"/employee/request";
 return `${window.location.origin}${path}${formType?`?kind=${encodeURIComponent(formType)}`:""}`;
}
export function isEmployeeDocumentRequest(kind:FormKind){return formSchemas.some(s=>s.kind===kind)}
