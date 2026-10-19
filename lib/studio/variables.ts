import type {HRPerson} from "../hrState";
export const variableGroups={
 "Employee 201": ["employee.id","employee.name","employee.first_name","employee.last_name","employee.position","employee.department","employee.branch","employee.hire_date","employee.email","employee.phone","employee.status","employee.birth_date","employee.address","employee.civil_status"],
 "Company and document": ["company.name","document.date","document.year","document.reference"],
 "Custom fields": ["custom.subject","custom.message","custom.purpose","custom.amount","custom.remarks"]
} as const;
export const tokens=Object.values(variableGroups).flat();
export function autoValues(p:HRPerson|null,custom:Record<string,string>={}):Record<string,string>{const parts=(p?.name||"").trim().split(/\s+/);const date=new Date();return {
 "employee.id":p?.id||"","employee.name":p?.name||"","employee.first_name":parts[0]||"","employee.last_name":parts.slice(1).join(" "),"employee.position":p?.position||"","employee.department":p?.department||"","employee.branch":p?.branch||"","employee.hire_date":p?.hire||"","employee.email":p?.email||"","employee.phone":p?.phone||"","employee.status":p?.status||"","employee.birth_date":p?.birthDate||"","employee.address":p?.address||"","employee.civil_status":p?.civilStatus||"",
 "company.name":"Underchargers","document.date":date.toLocaleDateString("en-PH",{year:"numeric",month:"long",day:"numeric"}),"document.year":String(date.getFullYear()),"document.reference":custom["document.reference"]||"",...custom};}
export const findTokens=(html:string)=>[...new Set([...html.matchAll(/\{\{([a-z][\w.]*)\}\}/gi)].map(x=>x[1]))];
export const fillTokens=(text:string,values:Record<string,string>)=>text.replace(/\{\{([a-z][\w.]*)\}\}/gi,(token,key:string)=>Object.prototype.hasOwnProperty.call(values,key)&&values[key]?values[key]:token);
export const escapeHtml=(text:string)=>text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
export const fillHtml=(html:string,values:Record<string,string>)=>fillTokens(html,Object.fromEntries(Object.entries(values).map(([key,value])=>[key,escapeHtml(value)])));
