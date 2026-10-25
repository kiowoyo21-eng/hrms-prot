/** Bulk import contract used by HRMS reference-schedule and attendance workflows.
 * None of these templates contain approved statutory values or authentic punches.
 */
import type {Agency,DeductionBracket} from "./payrollConfig";
import {parseCsv} from "./attendanceUpload";

export type BulkKind=Agency|"Attendance";
export type ColumnHelp={name:string;required:boolean;meaning:string;example:string};
const common=[
 {name:"min",required:true,meaning:"Lower boundary of the COMPENSATION or taxable-pay range, in PHP (inclusive).",example:"0"},
 {name:"max",required:true,meaning:"Upper boundary of the range, in PHP (inclusive). For an open-ended top tier use 999999999 only as this prototype's sentinel, subject to HR verification.",example:"999999999"}
];
const eff={name:"effective",required:true,meaning:"Official schedule effective date; exact YYYY-MM-DD calendar date. Every row in one file MUST use the same date.",example:"2027-01-01"};
export function bulkColumns(kind:BulkKind):ColumnHelp[]{
 if(kind==="Attendance")return [
  {name:"Employee ID",required:true,meaning:"Existing HRMS employee ID (not the employee's name); must belong to the selected branch.",example:"UC-0001"},
  {name:"Date",required:true,meaning:"Attendance date in YYYY-MM-DD, within the selected Thursday–Wednesday cutoff and after hire date.",example:"2027-01-07"},
  {name:"Time In",required:true,meaning:"HH:MM 24-hour time. Required for Present; partial for Incomplete; blank for Absent, Rest Day or On Leave.",example:"08:00"},
  {name:"Time Out",required:true,meaning:"HH:MM; later than Time In on the SAME date (maximum span 16 hours). Required for Present.",example:"17:00"},
  {name:"Status",required:true,meaning:"Present, Absent, Rest Day, On Leave, or Incomplete. One row per employee per cutoff date.",example:"Present"},
  {name:"Approved OT Hours",required:false,meaning:"Number 0–8; only positive when Status is Present and OT Approved is Yes.",example:"0"},
  {name:"OT Approved",required:false,meaning:"Yes or No; positive overtime requires Yes plus independent approval records.",example:"No"},
  {name:"Notes",required:false,meaning:"Attendance remarks, maximum 240 characters; do not paste sensitive personal data.",example:""}
 ];
 if(kind==="SSS")return [...common,{name:"employee",required:true,meaning:"Employee-side contribution AMOUNT in pesos, not percentage.",example:"0"},{name:"employer",required:true,meaning:"Employer-side contribution AMOUNT in pesos, including components per verified source.",example:"0"},eff];
 if(kind==="BIR")return [...common,{name:"rate",required:true,meaning:"Marginal weekly withholding RATE as percent points (e.g., enter 15 for 15%, NOT 0.15).",example:"0"},{name:"fixed",required:true,meaning:"Base withholding AMOUNT in pesos before applying marginal rate above min. Enter the actual source value; do not leave blank.",example:"0"},eff];
 if(kind==="PhilHealth")return [...common,{name:"rate",required:true,meaning:"Total published premium rate expressed as percent points, NOT a fraction; current demo payroll calculator uses a configured premium-base floor/ceiling that must be reviewed separately.",example:"0"},eff];
 return [...common,{name:"rate",required:true,meaning:"Recorded member savings rate as percent points. Current demo payroll calculation has separate hardcoded share rules; a successful import does not update those rules.",example:"0"},eff];
}
export const bulkHeaders=(kind:BulkKind)=>bulkColumns(kind).map(x=>x.name);
export const bulkFileName=(kind:BulkKind)=>kind==="Attendance"?"HRMS-Attendance-Input":`HRMS-${kind.replace(/[^a-z0-9]+/gi,"-")}-Bracket-Input`;
export function bulkCsv(rows:readonly (readonly string[])[]):string{return rows.map(r=>r.map(x=>`"${String(x??"").replace(/"/g,'""')}"`).join(",")).join("\r\n")+"\r\n"}
export function downloadCsv(kind:BulkKind):void{
 const text=bulkCsv([bulkHeaders(kind)]);const blob=new Blob(["\uFEFF",text],{type:"text/csv;charset=utf-8"});
 const url=URL.createObjectURL(blob);const link=document.createElement("a");link.href=url;link.download=`${bulkFileName(kind)}.csv`;link.click();setTimeout(()=>URL.revokeObjectURL(url),2000);
}
export async function downloadXlsx(kind:BulkKind):Promise<void>{
 const {Workbook}=await import("exceljs");const book=new Workbook();book.creator="HRMS bulk-input blank template — not official values";
 const sheet=book.addWorksheet("Input");const cols=bulkColumns(kind);
 sheet.addRow(cols.map(c=>c.name));sheet.views=[{state:"frozen",ySplit:1}];
 sheet.columns=cols.map(c=>({key:c.name,width:Math.max(17,Math.min(28,c.name.length+10))}));
 const row=sheet.getRow(1);row.font={bold:true,color:{argb:"FFFFFFFF"}};row.fill={type:"pattern",pattern:"solid",fgColor:{argb:"FF24354D"}};row.height=25;
 for(let i=2;i<=51;i++){
  const r=sheet.getRow(i);r.height=21;
  r.eachCell({includeEmpty:true},cell=>{cell.numFmt="@";cell.fill={type:"pattern",pattern:"solid",fgColor:{argb:i%2?"FFF7F9FC":"FFFFFFFF"}}});
 }
 sheet.autoFilter={from:"A1",to:`${String.fromCharCode(64+cols.length)}51`};
 const instruction=book.addWorksheet("Guide - Read First");instruction.columns=[{width:24},{width:76},{width:27}];
 instruction.addRow(["HRMS BULK-INPUT TEMPLATE",`${kind} — DATA ENTRY GUIDE`,""]);
 instruction.addRow(["Purpose","Fill only the Input sheet. Do not rename or delete its header row. NO SAMPLE LEGAL RATES ARE SUPPLIED.",""]);
 instruction.addRow(["Workflow","Download → Complete → Save as .xlsx → Upload → Review ALL errors → Stage draft → Independently verify official source.",""]);
 instruction.addRow(["Import safety","Uploads are browser-only review drafts; never official filing, statutory verification, payroll release, or government remittance.",""]);
 instruction.addRow(["Source & version","For deduction brackets, enter the official source URL and verify effective date in the HRMS before saving.",""]);
 instruction.addRow(["Expected worksheet","Input (headers in row 1; data begins row 2). Blank rows are skipped.",""]);
 instruction.addRow(["Numeric format","PHP amounts without ₱, commas or formulas. Percentages as 15, NOT 0.15 or 15%. Date format YYYY-MM-DD.",""]);
 instruction.addRow(["No invented values","Use the actual validated official source schedule. Examples below are format-only, NOT rates to import.",""]);
 instruction.addRow([]);instruction.addRow(["COLUMN","WHAT TO ENTER","FORMAT EXAMPLE ONLY"]);
 for(const c of cols)instruction.addRow([`${c.name}${c.required?" (required)":""}`,c.meaning,c.example]);
 instruction.getRow(1).font={bold:true,size:14};instruction.getRow(10).font={bold:true};
 instruction.eachRow((r,i)=>{if(i!==1&&i!==10){r.alignment={vertical:"top",wrapText:true};r.height=i===3||i===4?34:29}});
 const result=await book.xlsx.writeBuffer();const b=new Blob([new Uint8Array(result)],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
 const url=URL.createObjectURL(b),anchor=document.createElement("a");anchor.href=url;anchor.download=`${bulkFileName(kind)}.xlsx`;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),2000);
}
function asCell(v:unknown):string{
 if(v===null||v===undefined)return "";
 if(typeof v==="string"||typeof v==="number"||typeof v==="boolean")return String(v).trim();
 if(v instanceof Date){const yyyy=v.getFullYear(),mm=String(v.getMonth()+1).padStart(2,"0"),dd=String(v.getDate()).padStart(2,"0");return `${yyyy}-${mm}-${dd}`}
 throw Error("Cell has a formula, rich text, or unsupported data type; paste a plain value only.");
}
/** Same reader for all supported bulk workflows; only the selected Input sheet is parsed. */
export async function readBulkRows(file:File):Promise<string[][]>{
 if(!file.size||file.size>3_000_000)throw Error("File must be between 1 byte and 3 MB. Split larger datasets into separate imports.");
 if(/\.csv$/i.test(file.name))return parseCsv(await file.text());
 if(!/\.xlsx$/i.test(file.name))throw Error("Upload .xlsx or UTF-8 .csv only. Legacy .xls and macro-enabled .xlsm are not accepted.");
 const {Workbook}=await import("exceljs");const book=new Workbook();await book.xlsx.load(await file.arrayBuffer() as never);
 const sh=book.getWorksheet("Input");if(!sh)throw Error('Missing worksheet "Input". Use the downloaded template and keep its sheet name.');
 if(sh.rowCount>6100||sh.columnCount>25)throw Error("Too many spreadsheet rows or columns; use the official HRMS template.");
 const result:string[][]=[];let hasBlankBetweenData=false;let previousBlankRow=0;
 for(let i=1;i<=sh.rowCount;i++){
  const arr:string[]=[];for(let c=1;c<=sh.columnCount;c++){
   try{arr.push(asCell(sh.getRow(i).getCell(c).value))}catch{throw Error(`Cell ${sh.getRow(i).getCell(c).address}: formulas and complex cell values are not allowed.`)}
  }
  if(arr.some(v=>v!=="")){if(hasBlankBetweenData)throw Error(`Input sheet has a blank gap at row ${previousBlankRow}. Move all filled records together without empty rows.`);result.push(arr)}
  else if(i>1&&!hasBlankBetweenData){hasBlankBetweenData=true;previousBlankRow=i}
 }
 return result;
}
const numeric=(s:string)=>s!==""&&/^(?:0|[1-9]\d*)(?:\.\d{1,4})?$/.test(s)&&Number.isFinite(Number(s));
const validDate=(s:string)=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(`${s}T12:00:00`))&&new Date(`${s}T12:00:00`).toISOString().slice(0,10)===s;
export type DeductionImportPreview={rows:DeductionBracket[];errors:string[];warnings:string[];effective:string;dataRowCount:number};
export function validateDeductionRows(grid:string[][],agency:Agency):DeductionImportPreview{
 const errors:string[]=[],warnings:string[]=[],rows:DeductionBracket[]=[];
 const headers=bulkHeaders(agency);const actual=(grid[0]||[]).map(v=>v.trim().toLowerCase());
 if(!grid.length)return {rows,errors:["File has no header or data rows."],warnings,effective:"",dataRowCount:0};
 const absent=headers.filter(h=>!actual.includes(h.toLowerCase()));
 if(absent.length)errors.push(`Row 1: Missing column(s): ${absent.join(", ")}. Download this agency's template; do not rename headers.`);
 if(new Set(actual.filter(Boolean)).size!==actual.filter(Boolean).length)errors.push("Row 1: Duplicate column names are not permitted.");
 const extra=actual.filter(h=>h&&!headers.some(v=>v.toLowerCase()===h));if(extra.length)errors.push(`Row 1: Unexpected columns: ${extra.join(", ")}.`);
 const data=grid.slice(1).filter(r=>r.some(v=>v.trim()!==""));
 if(!data.length)errors.push("No filled data rows. Enter verified official values below the header.");
 if(data.length>500)errors.push(`Maximum 500 bracket rows per upload; found ${data.length}.`);
 if(errors.length)return {rows,errors,warnings,effective:"",dataRowCount:data.length};
 const ix=(col:string)=>actual.indexOf(col);
 for(let j=1;j<grid.length;j++){
  const raw=grid[j];if(!raw.some(v=>v.trim()!==""))continue;
  const rowNumber=j+1;
  const get=(key:string)=>String(raw[ix(key)]??"").trim();
  const numerics=headers.filter(x=>x!=="effective");
  const bad=numerics.filter(key=>!numeric(get(key)));
  if(bad.length){errors.push(`Row ${rowNumber}: ${bad.join(", ")} must be plain nonnegative numbers (no currency symbol, thousands separators, percent sign, or formula).`);continue}
  const date=get("effective");if(!validDate(date)){errors.push(`Row ${rowNumber}: effective must be a valid YYYY-MM-DD date.`);continue}
  const min=Number(get("min")),max=Number(get("max")),employee=actual.includes("employee")?Number(get("employee")):0,employer=actual.includes("employer")?Number(get("employer")):0,rate=actual.includes("rate")?Number(get("rate")):0,fixed=actual.includes("fixed")?Number(get("fixed")):0;
  if(min>=max){errors.push(`Row ${rowNumber}: max must be greater than min.`);continue}
  if(rate>100){errors.push(`Row ${rowNumber}: rate must be from 0 to 100 percent points.`);continue}
  if(rate>0&&rate<1)warnings.push(`Row ${rowNumber}: rate ${rate} means ${rate}% (not ${rate*100}%). Confirm whether you intended a fractional percentage.`);
  rows.push({min,max,employee,employer,rate,fixed,effective:date});
 }
 const days=[...new Set(rows.map(x=>x.effective))];if(days.length>1)errors.push(`Multiple effective dates detected: ${days.join(", ")}. Upload one version/date at a time.`);
 const sorted=rows.slice().sort((a,b)=>a.min-b.min);
 for(let i=1;i<sorted.length;i++){
  if(sorted[i].min<=sorted[i-1].max)errors.push(`Overlapping salary ranges: ${sorted[i-1].min}–${sorted[i-1].max} and ${sorted[i].min}–${sorted[i].max}.`);
  else if(sorted[i].min>sorted[i-1].max+0.011)warnings.push(`Gap between ${sorted[i-1].max} and ${sorted[i].min}; verify against source (not automatically filled).`);
 }
 if(agency==="BIR")warnings.push("BIR template is for WEEKLY taxable compensation only. Rates alone do not validate payroll taxability, exemptions, or year-end adjustments.");
 if(agency==="PhilHealth"||agency==="Pag-IBIG")warnings.push(`The current demo deduction calculator for ${agency} also contains hardcoded salary-base/share rules; CSV import does NOT update those rules.`);
 return {rows:sorted,errors,warnings,effective:days[0]||"",dataRowCount:data.length};
}
