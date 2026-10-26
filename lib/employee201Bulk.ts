/** Browser-local Employee 201 ADD-ONLY import. Never assumes that a CSV/XLSX is a trusted personnel register. */
import type {HRPerson} from "./hrState";
import type {Shop} from "./people";
import {shopNames} from "./people";
import {jobLevels,employmentArrangements} from "./employeeDemographics";
import {bulkCsv,readBulkRows} from "./hrmsBulkImport";

export type EmployeeColumn={name:string;required:boolean;instruction:string;example:string};
export const employee201Columns:EmployeeColumn[]=[
 {name:"Employee ID",required:false,instruction:"Unique permanent employee identifier. Leave BLANK to generate UC-#### or MM-####; existing IDs are never overwritten. If provided, use UC-#### for UC or MM-#### for Mastermind.",example:"UC-0040"},
 {name:"Full Name",required:true,instruction:"Employee's complete legal display name, up to 120 characters. Do not add dummy/sample employees to a real roster.",example:"Maria Dela Cruz"},
 {name:"Branch",required:true,instruction:`Exactly one of: ${shopNames.join("; ")}. UC branches belong to Underchargers; MM to Mastermind.`,example:"UC Las Piñas"},
 {name:"Department",required:true,instruction:"Actual department name (up to 80 characters), not an assumed sample department.",example:"Operations"},
 {name:"Position",required:true,instruction:"Official job title (up to 100 characters).",example:"Service Advisor"},
 {name:"Employment Status",required:true,instruction:"Use Probationary, Regular, Fixed-Term or Project-Based. Not for offboarding/status changes.",example:"Regular"},
 {name:"Sex",required:true,instruction:"Use Male, Female or Prefer not to say. Do not infer from name.",example:"Female"},
 {name:"Hire Date",required:true,instruction:"True initial date of employment, YYYY-MM-DD. Do not replace with date of import.",example:"2025-06-10"},
 {name:"Salary Type",required:true,instruction:"Daily or Monthly. Must match Basic Rate unit.",example:"Monthly"},
 {name:"Basic Rate",required:true,instruction:"Actual verified employee-specific basic rate in PHP for the selected salary type; plain positive number without ₱, commas, formulas or sample wage rates.",example:"20000"},
 {name:"Date of Birth",required:false,instruction:"YYYY-MM-DD (age computed by HRMS). Must not be after hire date. Leave blank if not verified.",example:"1995-02-18"},
 {name:"Civil Status",required:false,instruction:"Single, Married, Widowed, Separated, Other; or blank if unknown.",example:"Single"},
 {name:"Email",required:false,instruction:"Valid email address if available; do not invent an email.",example:"employee@example.com"},
 {name:"Phone",required:false,instruction:"Employee's actual contact number (text), up to 40 characters.",example:"09XXXXXXXXX"},
 {name:"Residential Address",required:false,instruction:"Current address. Avoid unnecessary sensitive notes.",example:"City, Province"},
 {name:"Emergency Contact Name",required:false,instruction:"Person to contact in an emergency, if provided by employee.",example:"Juan Dela Cruz"},
 {name:"Emergency Relationship",required:false,instruction:"Relationship to employee.",example:"Spouse"},
 {name:"Emergency Contact Phone",required:false,instruction:"Actual emergency phone, if available.",example:"09XXXXXXXXX"},
 {name:"Nationality",required:false,instruction:"Nationality as recorded; leave empty if unverified.",example:"Filipino"},
 {name:"Job Level",required:false,instruction:`One of: ${jobLevels.join("; ")}; or blank.`,example:"Rank-and-File"},
 {name:"Employment Arrangement",required:false,instruction:`One of: ${employmentArrangements.join("; ")}; or blank.`,example:"Regular"},
 {name:"SIL Days",required:true,instruction:"Actual verified opening SIL days, 0 or greater; NEVER leave blank and assume 5 days.",example:"0"},
 {name:"VIL Days",required:true,instruction:"Actual verified opening VIL days, 0 or greater; NEVER leave blank and assume credits.",example:"0"},
 {name:"Probation Months",required:false,instruction:"Required ONLY for Probationary; positive integer 1–12. Confirm actual contract/policy. Leave blank for non-probationary.",example:"6"},
 {name:"Middle Name",required:false,instruction:"Optional legal middle name (up to 80 characters).",example:"Santos"}
];
export const employee201Headers=employee201Columns.map(x=>x.name);
export const employee201TemplateName="HRMS-Employee-201-Bulk-Add";
const statuses=["Probationary","Regular","Fixed-Term","Project-Based"];
const sexes=["Male","Female","Prefer not to say"];
const civilStatuses=["Single","Married","Widowed","Separated","Other"];
const isoDate=(s:string):boolean=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(`${s}T12:00:00Z`))&&new Date(`${s}T12:00:00Z`).toISOString().slice(0,10)===s;
const decimal=(s:string):boolean=>/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/.test(s)&&Number.isFinite(Number(s));
const normalized=(s:string)=>s.trim().toLocaleLowerCase("en-PH").replace(/\s+/g," ");
const company=(branch:string)=>branch.startsWith("MM ")?"MM":"UC";
const makeDocuments=()=>["Resume","Medical Clearance","Employment Contract","NDA / Company Policies","Government IDs"].map(name=>({name,status:"Missing" as const}));
export type Employee201ImportPreview={rows:HRPerson[];errors:string[];warnings:string[];total:number;autoIds:number;requestedScope:string};
export function validateEmployee201Import(grid:string[][],existing:readonly HRPerson[],scope:string="All Shops"):Employee201ImportPreview{
 const errors:string[]=[],warnings:string[]=[],people:HRPerson[]=[];let autoIds=0;
 const result=(total:number):Employee201ImportPreview=>({rows:people,errors,warnings,total,autoIds,requestedScope:scope});
 if(!grid.length){errors.push("File is empty; download the Employee 201 template.");return result(0)}
 const actual=grid[0].map(v=>v.trim().replace(/^\uFEFF/,""));
 if(actual.length!==employee201Headers.length||actual.some((x,i)=>x!==employee201Headers[i])){
  errors.push(`Row 1: Headers must match the ${employee201Headers.length}-column official template in order. Download a fresh Excel or CSV template.`);return result(Math.max(0,grid.length-1));
 }
 const total=grid.length-1;
 if(total===0){errors.push("No employee rows found. Enter employees on row 2 onward.");return result(0)}
 if(total>500){errors.push("Limit 500 employees per import. Split larger registers into separate files.");return result(total)}
 const usedIds=new Set(existing.map(p=>p.id.toUpperCase()));
 // Explicit IDs are reserved before auto-allocation so generated IDs never collide with later rows.
 for(const r of grid.slice(1)){const id=(r[0]||"").trim().toUpperCase();if(id)usedIds.add(id)}
 const maxNumeric:Record<string,number>={UC:0,MM:0};
 for(const id of usedIds)for(const prefix of ["UC","MM"]){const match=new RegExp(`^${prefix}-(\\d+)$`).exec(id);if(match)maxNumeric[prefix]=Math.max(maxNumeric[prefix],Number(match[1]))}
 const existingIdentity=new Set(existing.map(p=>`${company(p.branch)}|${normalized(p.name)}|${p.hire}`));
 const batchIdentity=new Set<string>();const batchIds=new Set<string>();
 const requiredIndex=[1,2,3,4,5,6,7,8,9,21,22];
 for(let i=1;i<grid.length;i++){
  const row=grid[i],line=i+1,fail=(msg:string)=>errors.push(`Row ${line}: ${msg}`);
  const v=(j:number)=>(row[j]||"").trim();
  if(row.length>employee201Headers.length&&row.slice(employee201Headers.length).some(x=>x.trim())){fail("Unexpected extra cells beyond the template headers.");continue}
  const missing=requiredIndex.filter(j=>!v(j));if(missing.length){fail(`Required values missing: ${missing.map(j=>employee201Headers[j]).join(", ")}.`);continue}
  const branch=v(2),name=v(1),status=v(5),gender=v(6),hire=v(7),payType=v(8),rate=v(9),dob=v(10);
  if(!shopNames.includes(branch as Shop)){fail(`Branch must match one of: ${shopNames.join(", ")}.`);continue}
  if(scope!=="All Shops"&&branch!==scope){fail(`Branch ${branch} does not match selected HRMS scope ${scope}.`);continue}
  if(name.length>120||v(3).length>80||v(4).length>100||v(24).length>80){fail("Name, department, position, or middle name exceeds allowed length.");continue}
  if(!statuses.includes(status)||!sexes.includes(gender)||!["Daily","Monthly"].includes(payType)){fail("Invalid employment status, sex, or salary type. See Detailed Guide.");continue}
  if(!isoDate(hire)){fail("Hire Date must be a real YYYY-MM-DD calendar date.");continue}
  if(dob&&(!isoDate(dob)||dob>hire)){fail("Date of Birth must be a valid YYYY-MM-DD date on/before hire date.");continue}
  if(v(11)&&!civilStatuses.includes(v(11))){fail("Invalid Civil Status. See allowed values.");continue}
  if(v(12)&&(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v(12))||v(12).length>160)){fail("Invalid Email.");continue}
  if([v(13),v(17)].some(x=>x.length>40)||[v(14),v(15),v(16),v(18)].some(x=>x.length>240)){fail("A contact/address field exceeds the allowed length.");continue}
  if(v(19)&&!jobLevels.includes(v(19) as typeof jobLevels[number])){fail("Invalid Job Level.");continue}
  if(v(20)&&!employmentArrangements.includes(v(20) as typeof employmentArrangements[number])){fail("Invalid Employment Arrangement.");continue}
  if(!decimal(rate)||Number(rate)<=0||Number(rate)>100_000_000){fail("Basic Rate must be an actual positive PHP amount (max 100,000,000), without separators or currency symbols.");continue}
  if(!decimal(v(21))||!decimal(v(22))||Number(v(21))>365||Number(v(22))>365){fail("SIL Days/VIL Days must be verified nonnegative days (max 365), explicitly enter 0 if none.");continue}
  if(status==="Probationary"&&(!/^[1-9]\d*$/.test(v(23))||Number(v(23))>12)){fail("Probationary employees require Probation Months 1–12.");continue}
  if(status!=="Probationary"&&v(23)&&v(23)!=="0"){fail("Probation Months must be blank or 0 for non-probationary employees.");continue}
  const identity=`${company(branch)}|${normalized(name)}|${hire}`;
  if(existingIdentity.has(identity)||batchIdentity.has(identity)){fail("Duplicate employee name + hire date within the same employer; review before adding.");continue}
  batchIdentity.add(identity);
  let id=v(0).toUpperCase();const prefix=company(branch);
  if(id){
   if(!new RegExp(`^${prefix}-\\d{4,}$`).test(id)){fail(`Employee ID for ${branch} must use ${prefix}- followed by at least 4 digits.`);continue}
   if(existing.some(p=>p.id.toUpperCase()===id)||batchIds.has(id)){fail(`Employee ID ${id} already exists or is repeated in this file. No overwrite is allowed.`);continue}
  }else{
   do{maxNumeric[prefix]++;id=`${prefix}-${String(maxNumeric[prefix]).padStart(4,"0")}`}while(usedIds.has(id)||batchIds.has(id));autoIds++;
  }
  batchIds.add(id);
  if(!dob)warnings.push(`Row ${line}: Date of Birth not supplied; age-related reports will show missing data.`);
  const person:HRPerson={
   id,name,branch:branch as Shop,department:v(3),position:v(4),status,gender,hire,salaryType:payType as "Daily"|"Monthly",rate:Number(rate),
   email:v(12),phone:v(13),birthDate:dob,civilStatus:v(11),address:v(14),emergencyName:v(15),emergencyRelationship:v(16),emergencyPhone:v(17),
   nationality:v(18),middleName:v(24),jobLevel:v(19)?v(19) as HRPerson["jobLevel"]:undefined,employmentArrangement:v(20)?v(20) as HRPerson["employmentArrangement"]:undefined,
   probation:status==="Probationary"?Number(v(23)):0,sil:Number(v(21)),vil:Number(v(22)),documents:makeDocuments(),
   timeline:[`${hire} · Employee imported into Employee 201 for ${branch} (browser-local review)`],
   assignmentHistory:[{id:`initial-${id}`,effectiveDate:hire,kind:"Initial Assignment",branch,department:v(3),position:v(4)}]
  };
  people.push(person);
 }
 return result(total);
}
export async function readEmployee201File(file:File){return readBulkRows(file)}
function saveDownload(blob:Blob,filename:string){const link=document.createElement("a"),url=URL.createObjectURL(blob);link.href=url;link.download=filename;link.click();setTimeout(()=>URL.revokeObjectURL(url),2000)}
export function downloadEmployee201Csv(){saveDownload(new Blob(["\uFEFF",bulkCsv([employee201Headers])],{type:"text/csv;charset=utf-8"}),`${employee201TemplateName}.csv`)}
export async function downloadEmployee201Xlsx(){
 const {Workbook}=await import("exceljs");const book=new Workbook();book.creator="HRMS employee intake template — blank";
 const sheet=book.addWorksheet("Input");sheet.columns=employee201Columns.map(c=>({header:c.name,key:c.name,width:Math.min(32,Math.max(16,c.name.length+5))}));sheet.views=[{state:"frozen",ySplit:1}];
 sheet.getRow(1).font={bold:true,color:{argb:"FFFFFFFF"}};sheet.getRow(1).fill={type:"pattern",pattern:"solid",fgColor:{argb:"FF24354D"}};sheet.getRow(1).height=28;
 for(let i=2;i<=101;i++){const row=sheet.getRow(i);row.height=21;for(let c=1;c<=employee201Columns.length;c++){const cell=row.getCell(c);cell.numFmt="@";cell.fill={type:"pattern",pattern:"solid",fgColor:{argb:i%2?"FFF7F9FC":"FFFFFFFF"}}}}
 sheet.autoFilter={from:"A1",to:"Y101"};
 const guide=book.addWorksheet("Guide - Read First");guide.columns=[{width:30},{width:100},{width:30}];
 const lines=[
  ["HRMS EMPLOYEE 201 BULK ADD","Blank input template — not an official employee record",""],
  ["1. Scope","HR or authorized admin only; select a branch in HRMS to restrict imported employees, or All Shops if authorized.",""],
  ["2. Fill the Input sheet","Preserve exact 25-column header order. One employee per row. Input starts on row 2.",""],
  ["3. Salary and leave","Actual verified basic rate AND opening SIL/VIL credits required; never copy demo salary figures. Enter 0 when verified zero.",""],
  ["4. Employee ID","Leave blank to auto-generate or specify a unique UC-####/MM-#### matching the legal employer. Existing employees are NEVER edited.",""],
  ["5. Dates & numeric cells","Use ISO YYYY-MM-DD typed as text and amounts without separators, PHP symbols, %, or formulas.",""],
  ["6. Review","Upload CSV/XLSX (max 3 MB, max 500 records) → preview → download error report → correct and reupload → confirm import.",""],
  ["7. Confidentiality","Browser storage is NOT secure shared storage; use fictional/test employees only until a production backend is live.",""],
  ["8. Documents","Creates Missing status for the standard 5-document checklist; actual files and approvals are not uploaded by this import.",""],
  ["9. Legal entities","UC LP+MD+QC are Underchargers, MM Mandaluyong is Mastermind. Never mix employer records.",""],
  ["10. File hygiene","No blank gaps between employees, no merged cells or macros; remove formulas; choose the Input tab for data.",""],
  [],["COLUMN (REQUIRED?)","EXACT VALUE / ALLOWED FORMAT","EXAMPLE — FORMAT ONLY"]
 ];
 for(const row of lines)guide.addRow(row);
 for(const c of employee201Columns)guide.addRow([`${c.name}${c.required?" *":""}`,c.instruction,c.example]);
 guide.getRow(1).font={bold:true,size:14};guide.getRow(13).font={bold:true};guide.eachRow((row,index)=>{row.alignment={vertical:"middle",wrapText:true};row.height=index>=14?44:32});
 const buffer=await book.xlsx.writeBuffer();saveDownload(new Blob([new Uint8Array(buffer)],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}),`${employee201TemplateName}.xlsx`);
}
export function downloadEmployee201Errors(preview:Employee201ImportPreview){const rows=[['Issue Type','Message'],...preview.errors.map(s=>['Error',s]),...preview.warnings.map(s=>['Warning',s])];saveDownload(new Blob(["\uFEFF",bulkCsv(rows)],{type:"text/csv;charset=utf-8"}),"HRMS-Employee-201-Import-Issues.csv")}
