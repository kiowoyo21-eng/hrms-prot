import type {IntakeResponse} from "./intakeForms";

export type ResponseStatusFilter = "All" | "New" | "Reviewed";

/** Read-only selectors: never edit source records or infer remote submissions. */
export function filterLocalResponses(records:IntakeResponse[], formId:string, search="", status:ResponseStatusFilter="All"):IntakeResponse[]{
 const query=search.trim().toLocaleLowerCase();
 return records.filter(r=>r.formId===formId&&(status==="All"||r.status===status)&&(
  !query||[r.id,r.receivedAt,String(r.formVersion),r.status,...Object.entries(r.values).flatMap(([key,value])=>[r.fieldLabels?.[key]||key,String(value??"")])]
  .some(value=>String(value).toLocaleLowerCase().includes(query))
 )).sort((a,b)=>String(b.receivedAt||"").localeCompare(String(a.receivedAt||""))||b.id.localeCompare(a.id));
}
export function localResponseCounts(records:IntakeResponse[],formId:string){
 const matches=records.filter(r=>r.formId===formId);
 return {total:matches.length,new:matches.filter(r=>r.status==="New").length,reviewed:matches.filter(r=>r.status==="Reviewed").length};
}
export function pageLocalResponses(records:IntakeResponse[],page:number,pageSize=10){
 const size=Math.max(1,Math.min(100,Math.floor(pageSize)||10));
 const pages=Math.max(1,Math.ceil(records.length/size));
 const current=Math.min(pages,Math.max(1,Math.floor(page)||1));
 return {rows:records.slice((current-1)*size,current*size),page:current,pages};
}
function csvCell(value:unknown){
 const text=String(value??"");
 // Protect spreadsheet users from executable formulas in employee-entered text.
 const escaped=/^[\s\u0000-\u001f]*[=+\-@]/.test(text)?`'${text}`:text;
 return `"${escaped.replace(/"/g,'""')}"`;
}
/** Keep field IDs in column titles so identical labels in different revisions stay distinct. */
export function exportLocalResponseCsv(records:IntakeResponse[]):string{
 const fields=new Map<string,string>();
 for(const r of records)for(const id of Object.keys(r.values))if(!fields.has(id))fields.set(id,r.fieldLabels?.[id]||id);
 const ids=[...fields.keys()];
 const rows=[
  ["Response ID","Received at","Form version","Review status",...ids.map(id=>`${fields.get(id)} [${id}]`)],
  ...records.map(r=>[r.id,r.receivedAt,String(r.formVersion),r.status,...ids.map(id=>r.values[id]||"")])
 ];
 return rows.map(row=>row.map(csvCell).join(",")).join("\r\n");
}
