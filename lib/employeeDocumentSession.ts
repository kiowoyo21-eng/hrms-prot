/** Temporary browser-session file evidence. Never a secure or durable HR archive. */
export const EMPLOYEE_DOCUMENT_SESSION_EVENT="uc-hr-document-session-changed";
export type SessionDocumentFile={submissionId:string;employeeId:string;branch:string;type:string;file:File;status:"Pending HR Review"|"Verified"};
const evidence=new Map<string,SessionDocumentFile>();
export function attachEmployeeDocument(record:SessionDocumentFile){evidence.set(record.submissionId,record);if(typeof window!=="undefined")window.dispatchEvent(new Event(EMPLOYEE_DOCUMENT_SESSION_EVENT))}
export function getEmployeeDocument(id:string){return evidence.get(id)}
export function allEmployeeDocumentFiles(){return [...evidence.values()]}
export function approveEmployeeDocument(id:string){const file=evidence.get(id);if(!file)return false;evidence.set(id,{...file,status:"Verified"});if(typeof window!=="undefined")window.dispatchEvent(new Event(EMPLOYEE_DOCUMENT_SESSION_EVENT));return true}
export function rejectEmployeeDocument(id:string){evidence.delete(id);if(typeof window!=="undefined")window.dispatchEvent(new Event(EMPLOYEE_DOCUMENT_SESSION_EVENT))}
