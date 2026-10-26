/** Explicit browser-only handoff for custom form responses. Not a secure submission backend. */
import {activeIntakeFields,cleanIntakeValues,validateIntakeFields,type IntakeForm,type IntakeResponse} from "./intakeForms";
export type IntakeHandoffPacket={version:1;kind:"Intake Response";response:IntakeResponse};
export function validateIntakeHandoff(raw:unknown,form:IntakeForm):IntakeResponse{
 if(!raw||typeof raw!=="object"||Array.isArray(raw))throw Error("Invalid response file");
 const packet=raw as Partial<IntakeHandoffPacket>;
 if(packet.version!==1||packet.kind!=="Intake Response"||!packet.response||typeof packet.response!=="object")throw Error("Invalid response packet");
 const r=packet.response;
 if(typeof r.id!=="string"||!/^INTAKE-[a-zA-Z0-9-]{8,90}$/.test(r.id)||r.formId!==form.id||r.formVersion!==form.version||!Number.isFinite(Date.parse(String(r.receivedAt)))||!r.values||typeof r.values!=="object"||Array.isArray(r.values))throw Error("Form ID or version does not match. Re-share the current template.");
 if(form.target!=="custom"||form.status!=="Published")throw Error("This is not a published custom form");
 const entries=Object.entries(r.values);
 if(entries.length>form.fields.length||entries.some(([k,v])=>!form.fields.some(f=>f.id===k)||typeof v!=="string"||v.length>2000))throw Error("Invalid form answers");
 const answers=r.values as Record<string,string>;const problems=validateIntakeFields(form.fields,answers);if(problems.length)throw Error(problems[0]);
 return {id:r.id,formId:form.id,formTitle:form.title,formVersion:form.version,receivedAt:String(r.receivedAt),values:cleanIntakeValues(form.fields,answers),fieldLabels:Object.fromEntries(activeIntakeFields(form.fields,answers).map(f=>[f.id,f.label])),status:"New"};
}
export function exportIntakeHandoff(response:IntakeResponse){
 const payload:IntakeHandoffPacket={version:1,kind:"Intake Response",response};
 const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}));
 const link=document.createElement("a");link.href=url;link.download=`${response.id}.json`;link.click();window.setTimeout(()=>URL.revokeObjectURL(url),500);
}
export async function importIntakeHandoff(file:File,form:IntakeForm){
 if(file.size>18000)throw Error("Response file exceeds 18KB size limit");
 return validateIntakeHandoff(JSON.parse(await file.text()) as unknown,form);
}
