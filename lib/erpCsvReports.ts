/**
 * Manual, browser-session-only ERP CSV report intake.
 * No ERP API, synchronization, payroll posting, or automatic import to employee records.
 */
export const ERP_CSV_MAX_BYTES=512*1024;
export const ERP_CSV_MAX_ROWS=2000;
export const ERP_CSV_MAX_COLUMNS=48;
export const ERP_REPORT_STORE_KEY="hrms-erp-related-csv-session-v1";
export type ParsedErpCsv={headers:string[];rows:string[][]};
export type ErpCsvReport={
 id:string;title:string;branch:string;period:string;notes:string;
 fileName:string;fileSize:number;checksum:string;uploadedAt:string;uploadedBy:string;
 headers:string[];rows:string[][];originalCsv:string;
};

/** Strict CSV: UTF-8 BOM, quoted commas/line breaks, doubled quotes and CRLF. */
export function parseErpCsv(text:string):ParsedErpCsv{
 if(!text.trim())throw new Error("CSV is empty.");
 if(new TextEncoder().encode(text).length>ERP_CSV_MAX_BYTES)throw new Error("CSV exceeds the 512 KB file limit.");
 const input=text.charCodeAt(0)===0xFEFF?text.slice(1):text;
 const parsed:string[][]=[];let row:string[]=[],value="",quoted=false,closed=false,atStart=true;
 const field=()=>{row.push(value.trim());value="";closed=false;atStart=true;if(row.length>ERP_CSV_MAX_COLUMNS)throw new Error(`CSV has more than ${ERP_CSV_MAX_COLUMNS} columns.`)};
 const finishRow=()=>{field();if(row.some(cell=>cell!=="")){parsed.push(row);if(parsed.length>ERP_CSV_MAX_ROWS+1)throw new Error(`CSV has more than ${ERP_CSV_MAX_ROWS} data rows.`)}row=[]};
 for(let i=0;i<input.length;i++){
  const char=input[i];
  if(quoted){
   if(char==='"'&&input[i+1]==='"'){value+='"';i++}
   else if(char==='"'){quoted=false;closed=true}
   else{value+=char}
   continue;
  }
  if(char==='"'&&atStart){quoted=true;atStart=false;continue}
  if(char===','){field();continue}
  if(char==='\n'||char==='\r'){
   finishRow();if(char==='\r'&&input[i+1]==='\n')i++;continue;
  }
  if(closed){if(char===' '||char==='\t')continue;throw new Error(`Invalid character after closing quote at row ${parsed.length+1}.`)}
  if(char==='"')throw new Error(`Invalid quote at row ${parsed.length+1}. Use doubled quotes inside quoted values.`);
  value+=char;atStart=false;
  if(value.length>12000)throw new Error("A CSV cell is too long (12,000 characters maximum).");
 }
 if(quoted)throw new Error("CSV contains an unclosed quoted field.");
 if(value!==""||row.length||closed)finishRow();
 const [headers,...rows]=parsed;
 if(!headers||headers.length===0||headers.every(h=>h===""))throw new Error("CSV must have a non-empty header row.");
 if(headers.some(h=>!h||h.length>120))throw new Error("CSV headers must be named and at most 120 characters.");
 if(new Set(headers.map(h=>h.toLocaleLowerCase("en"))).size!==headers.length)throw new Error("CSV has duplicate column headers.");
 if(rows.length===0)throw new Error("CSV must contain at least one data row after the headers.");
 for(let i=0;i<rows.length;i++)if(rows[i].length!==headers.length)throw new Error(`CSV row ${i+2} has ${rows[i].length} columns, expected ${headers.length}.`);
 return {headers,rows};
}

/** Content fingerprint is solely for duplicate warnings, not an integrity/security signature. */
export function erpCsvFingerprint(csv:string):string{
 let hash=2166136261;
 for(let i=0;i<csv.length;i++){hash^=csv.charCodeAt(i);hash=Math.imul(hash,16777619)}
 return `${csv.length}-${(hash>>>0).toString(16)}`;
}
export function erpReportVisible(record:ErpCsvReport,branch:string,role:string){
 if(role==="BM")return branch!=="All Shops"&&record.branch===branch;
 return branch==="All Shops"||record.branch===branch;
}
export function validErpReport(record:unknown):record is ErpCsvReport{
 if(!record||typeof record!=="object")return false;
 const r=record as Partial<ErpCsvReport>;
 return typeof r.id==="string"&&typeof r.title==="string"&&typeof r.branch==="string"&&typeof r.uploadedAt==="string"&&typeof r.originalCsv==="string"&&Array.isArray(r.headers)&&Array.isArray(r.rows)&&r.rows.every(row=>Array.isArray(row));
}
export function readErpReports():ErpCsvReport[]{
 if(typeof window==="undefined")return [];
 try{const value=JSON.parse(window.sessionStorage.getItem(ERP_REPORT_STORE_KEY)||"[]");return Array.isArray(value)?value.filter(validErpReport).slice(0,25):[]}catch{return []}
}
export function saveErpReports(reports:ErpCsvReport[]):boolean{
 if(typeof window==="undefined")return false;
 if(reports.length>25)return false;
 try{window.sessionStorage.setItem(ERP_REPORT_STORE_KEY,JSON.stringify(reports));return true}catch{return false}
}
