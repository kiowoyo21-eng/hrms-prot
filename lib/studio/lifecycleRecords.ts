import {writeAuditEvent} from "../auditTrail";
import type {LifecycleStage} from "./lifecycleCatalog";
import type {StudioActor} from "./types";
import {canRead,studioActor} from "./store";
/** Browser-only tracker. Records are administrative references, not a secure evidence vault. */
const KEY="uc-hrms-lifecycle-documents-v1",EVENT="uc-hrms-lifecycle-documents-change";
export type LifecycleStatus="Not started"|"Pending"|"Received"|"Verified"|"Not applicable";
export type LifecycleRecord={employeeId:string;stage:LifecycleStage;documentId:string;status:LifecycleStatus;reference:string;note:string;updatedBy:string;updatedAt:string;history:{status:LifecycleStatus;by:string;at:string}[]};
export function readLifecycleRecords():LifecycleRecord[]{if(typeof window==="undefined")return [];try{const v=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(v)?v.filter(x=>typeof x.employeeId==="string"&&typeof x.documentId==="string"&&Array.isArray(x.history)):[]}catch{return []}}
export function saveLifecycleRecord(actor:StudioActor,employeeId:string,stage:LifecycleStage,documentId:string,status:LifecycleStatus,reference:string,note:string){
 const user=studioActor();if(!user||user.username!==actor.username||user.role!==actor.role||!canRead(actor))throw Error("HR session expired or permission denied.");
 if(!employeeId.trim()||!documentId.trim())throw Error("Employee and document are required.");
 if(reference.length>180||note.length>750)throw Error("Reference or note is too long.");
 const records=readLifecycleRecords(),at=new Date().toISOString(),index=records.findIndex(r=>r.employeeId===employeeId&&r.documentId===documentId);
 const before=index>=0?records[index]:undefined;
 const next:LifecycleRecord={employeeId,stage,documentId,status,reference:reference.trim(),note:note.trim(),updatedBy:actor.username,updatedAt:at,history:[...(before?.history||[]),{status,by:actor.username,at}].slice(-80)};
 if(index>=0)records[index]=next;else records.push(next);
 localStorage.setItem(KEY,JSON.stringify(records.slice(-1600)));
 writeAuditEvent({module:"Document Library / Lifecycle",action:"Lifecycle document status updated",recordId:`${employeeId}:${documentId}`,actor:actor.username,role:actor.role,summary:`${stage} / ${documentId} / ${status}; content withheld`});
 window.dispatchEvent(new Event(EVENT));return next;
}
export function watchLifecycleRecords(handler:()=>void){window.addEventListener(EVENT,handler);const onStorage=(event:StorageEvent)=>{if(event.key===KEY)handler()};window.addEventListener("storage",onStorage);return()=>{window.removeEventListener(EVENT,handler);window.removeEventListener("storage",onStorage)}}
