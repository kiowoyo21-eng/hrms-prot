/** Same-tab, browser-local deep-link bridge; a future backend should use route IDs. */
export const HRMS_OPEN_REQUEST = "uc-hrms-open-request";
export const HRMS_PENDING_REQUEST = "uc-hrms-pending-request-id";
export const HRMS_PENDING_EMPLOYEE = "uc-hrms-pending-employee-id";
export function requestOpenInHRMS(id:string){
 if(typeof window==="undefined")return;
 try{window.sessionStorage.setItem(HRMS_PENDING_REQUEST,id)}catch{}
 window.dispatchEvent(new CustomEvent(HRMS_OPEN_REQUEST,{detail:{id}}));
}
export function employeeOpenInHRMS(id:string){
 if(typeof window==="undefined")return;
 try{window.sessionStorage.setItem(HRMS_PENDING_EMPLOYEE,id)}catch{}
 window.dispatchEvent(new CustomEvent("uc-hrms-open-employee",{detail:{id}}));
}

export const WORKSPACE_OPEN_RECORD="uc-hrms-open-workspace-record";
export function workspaceOpenInHRMS(kind:"document"|"ticket",id:string){if(typeof window==="undefined")return;try{window.sessionStorage.setItem(`uc-workspace-pending-${kind}`,id)}catch{}window.dispatchEvent(new CustomEvent(WORKSPACE_OPEN_RECORD,{detail:{kind,id}}));}
