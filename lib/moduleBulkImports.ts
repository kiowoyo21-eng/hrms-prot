/** Validated browser-local module imports. Never use as production personnel storage. */
import {readBulkRows,bulkCsv} from './hrmsBulkImport';
export type ModuleImportKind='assets'|'leave'|'recruitment'|'rates'|'compliance'|'documents';
type Column={name:string;required:boolean;guide:string;example:string};
export type ImportRow=Record<string,string>;
export type ImportPreview={rows:ImportRow[];errors:string[];warnings:string[];total:number};
export type ExistingImportData={people:{id:string;branch:string;salaryType?:string}[];assets?:{serial:string}[];applicants?:{email:string;role:string}[];rates?:{employeeId:string;effective:string}[];compliance?:{agency:string;title:string;due:string;branch:string}[];documents?:{employeeId:string;type:string;fileName:string}[];scope:string};
export const branches=['UC Mandaluyong','UC Las Piñas','UC Quezon City','MM Mandaluyong'];
export const moduleImportCatalog:Record<ModuleImportKind,{title:string;purpose:string;behavior:string;columns:Column[]}>= {
 assets:{title:'Asset Inventory',purpose:'Register physical devices as Free inventory only; does not assign custody.',behavior:'New asset records are created; existing serial numbers and assigned assets are never modified.',columns:[
  {name:'asset_name',required:true,guide:'Actual device/item name, brand/model (max 120 characters).',example:'Office laptop model'},
  {name:'serial_number',required:true,guide:'Unique serial or internally unique barcode, case insensitive (max 100 characters).',example:'TEST-ASSET-001'},
  {name:'branch',required:true,guide:'Exactly UC Mandaluyong / UC Las Piñas / UC Quezon City / MM Mandaluyong.',example:'UC Mandaluyong'},
  {name:'condition',required:true,guide:'New, Good, Fair, or For Inspection. Inventory is registered Free, not assigned.',example:'Good'},
  {name:'accessories',required:false,guide:'Comma-separated inventory of accessories; CSV quotes are preserved.',example:'Power cable, keyboard'},
  {name:'notes',required:false,guide:'Reference/remarks (max 300 characters).',example:'Initial inventory count'}]},
 leave:{title:'Leave Opening Balances',purpose:'Set verified current SIL/VIL allocations in Employee 201.',behavior:'This overwrites CURRENT employee SIL/VIL allocations after explicit acknowledgment, but does NOT alter existing leave requests, approvals or credit requests. Historical or future effective dates cannot be accurately reconstructed by this prototype.',columns:[
  {name:'employee_id',required:true,guide:'An existing Employee 201 ID in your selected branch.',example:'UC-0001'},
  {name:'sil_days',required:true,guide:'Verified nonnegative SIL allocation (0 to 365); 0 only for verified zero.',example:'5'},
  {name:'vil_days',required:true,guide:'Verified nonnegative VIL allocation (0 to 365); 0 only for verified zero.',example:'0'},
  {name:'effective_date',required:true,guide:'MUST be today (YYYY-MM-DD) because only current allocations are stored; do not backdate.',example:'YYYY-MM-DD (today)'},
  {name:'source_reference',required:true,guide:'Actual HR approved balance worksheet/case reference, not fictional.',example:'HR-LEAVE-REGISTER'}]},
 recruitment:{title:'Recruitment Applicant Register',purpose:'Import missing applicants into the existing hiring register.',behavior:'Add-only; imported applicants always start as New Applicant for HR review. Past interviews, offers, hiring and approvals are NOT fabricated.',columns:[
  {name:'full_name',required:true,guide:'Applicant full legal name (max 120).',example:'Sample Applicant'},
  {name:'email',required:true,guide:'Applicant contact email; deduplicated per position.',example:'sample@example.com'},
  {name:'phone',required:true,guide:'Actual contact number as text (max 40).',example:'09170000000'},
  {name:'position',required:true,guide:'Actual job title (max 100). New position creates a draft catalog entry using existing logic.',example:'Automotive Technician'},
  {name:'branch',required:true,guide:'One of the four exact recognized branch values.',example:'UC Mandaluyong'},
  {name:'application_date',required:true,guide:'Date originally received, YYYY-MM-DD; no future dates.',example:'2026-10-01'},
  {name:'education',required:false,guide:'Highest relevant qualification as applicant-reported (max 200).',example:'Technical-vocational'},
  {name:'relevant_years',required:false,guide:'Nonnegative years of relevant experience (0 to 80, decimals allowed).',example:'2'}]},
 rates:{title:'Employee Salary Rate History',purpose:'Record effective-dated salary changes without changing stored Employee 201 base rates.',behavior:'Add-only effective rate history. Existing rates and payroll releases are never overwritten. Draft statuses remain subject to review.',columns:[
  {name:'employee_id',required:true,guide:'Existing Employee 201 ID in branch scope.',example:'UC-0001'},
  {name:'salary_type',required:true,guide:'Must exactly match employee current salary type: Daily or Monthly.',example:'Daily'},
  {name:'amount_php',required:true,guide:'Verified positive basic rate, digits and decimal point only; no currency symbols/commas.',example:'1000.00'},
  {name:'effective_date',required:true,guide:'Actual effective date YYYY-MM-DD.',example:'2026-10-01'},
  {name:'reason',required:true,guide:'Specific HR-approved rate change rationale or reference; max 250.',example:'Approved adjustment ref'}]},
 compliance:{title:'Compliance Filing Reference Register',purpose:'Stage missing statutory filing references as Drafts for verification.',behavior:'Import never marks a government filing Submitted, Approved or Verified; only staff can verify source evidence. It does not replace contribution schedules or agency submissions.',columns:[
  {name:'agency',required:true,guide:'DOLE / BIR / SSS / PhilHealth / Pag-IBIG / BFP / DENR-EMB / PSA / LGU.',example:'BIR'},
  {name:'requirement',required:true,guide:'Complete filing/requirement name (max 200).',example:'Annual supporting report'},
  {name:'branch',required:true,guide:'Exact branch name, or All Shops for a company-wide review (subject to branch access).',example:'UC Mandaluyong'},
  {name:'due_date',required:true,guide:'Verified requirement due date, YYYY-MM-DD; do not assume the agency deadline.',example:'2026-12-31'},
  {name:'frequency',required:true,guide:'Monthly / Quarterly / Semiannual / Annual / Event-based / Custom.',example:'Annual'},
  {name:'owner',required:true,guide:'Responsible staff or department, max 120.',example:'HR'},
  {name:'source_reference',required:true,guide:'Real supporting source or proof identifier; remains unverified metadata.',example:'Official agency receipt ref'}]},
 documents:{title:'Employee Document Reference Manifest',purpose:'Index expected document references by Employee ID for HR review.',behavior:'Metadata only. Import does NOT upload files, create actual signed forms, or mark documents Submitted/Verified in Employee 201.',columns:[
  {name:'employee_id',required:true,guide:'Existing Employee 201 ID in selected branch.',example:'UC-0001'},
  {name:'document_type',required:true,guide:'Document name/type (max 120), preferably a controlled required-document name.',example:'Employment Contract'},
  {name:'file_name',required:true,guide:'Reference filename of a separately held file (max 200). The actual file is NOT uploaded.',example:'sample-contract.pdf'},
  {name:'source_reference',required:true,guide:'Verified folder/custodian/reference where actual file can be checked (max 200).',example:'HR secure archive reference'}]}
};
const iso=(s:string)=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s+'T12:00:00'))&&new Date(s+'T12:00:00').toISOString().slice(0,10)===s;
const nonneg=(s:string)=>/^(?:0|[1-9]\d*)(?:\.\d{1,4})?$/.test(s)&&Number.isFinite(+s);
const norm=(s:string)=>s.trim().toLowerCase();
export function validateModuleImport(kind:ModuleImportKind,grid:string[][],ctx:ExistingImportData,today=new Date().toLocaleDateString('en-CA')):ImportPreview{
 const errors:string[]=[],warnings:string[]=[],rows:ImportRow[]=[],columns=moduleImportCatalog[kind].columns;
 const finish=(total:number)=>({rows,errors,warnings,total});
 if(!grid.length){errors.push('File is empty. Download the template.');return finish(0)}
 const header=grid[0].map(s=>s.replace(/^\uFEFF/,'').trim());
 if(header.length!==columns.length||header.some((v,i)=>v!==columns[i].name)){errors.push(`Row 1: use exact ${columns.length} headers and order from the ${moduleImportCatalog[kind].title} template.`);return finish(Math.max(0,grid.length-1))}
 const total=grid.length-1;
 if(!total||total>500){errors.push(`Enter between 1 and 500 records; found ${total}.`);return finish(total)}
 const seen=new Set<string>();
 for(let i=1;i<grid.length;i++){
  const source=grid[i];const row=Object.fromEntries(columns.map((c,j)=>[c.name,(source[j]||'').trim()]));
  const fail=(s:string)=>errors.push(`Row ${i+1}: ${s}`);
  if(source.slice(columns.length).some(x=>x.trim())){fail('Unexpected cells beyond final column.');continue}
  const missing=columns.filter(c=>c.required&&!row[c.name]);if(missing.length){fail('Missing '+missing.map(c=>c.name).join(', '));continue}
  if(columns.some(c=>row[c.name].length>500)){fail('A cell exceeds 500 characters.');continue}
  if('branch' in row){if(row.branch!=='All Shops'&&!branches.includes(row.branch)){fail('Invalid branch; use the exact template branch name.');continue}
   if(ctx.scope!=='All Shops'&&row.branch!==ctx.scope){fail('Branch does not match your selected HRMS branch.');continue}
   if(row.branch==='All Shops'&&kind!=='compliance'){fail('All Shops is not a valid asset/applicant branch.');continue}
   if(row.branch==='All Shops'&&ctx.scope!=='All Shops'){fail('All Shops requires authorized all-branch scope.');continue}}
  if('employee_id' in row){const p=ctx.people.find(x=>x.id.toLowerCase()===row.employee_id.toLowerCase());if(!p){fail('Employee ID does not exist.');continue}if(ctx.scope!=='All Shops'&&p.branch!==ctx.scope){fail('Employee is outside branch permission scope.');continue}}
  let key='';
  if(kind==='assets'){
   if(row.asset_name.length>120||row.serial_number.length>100||row.notes.length>300){fail('Device name, serial, or notes exceeds limit.');continue}
   if(!['New','Good','Fair','For Inspection'].includes(row.condition)){fail('Condition must be New, Good, Fair or For Inspection.');continue}
   key=norm(row.serial_number);if(ctx.assets?.some(x=>norm(x.serial)===key)){fail('Serial already exists in Assets.');continue}
  }else if(kind==='leave'){
   if(!nonneg(row.sil_days)||!nonneg(row.vil_days)||+row.sil_days>365||+row.vil_days>365){fail('SIL/VIL must be 0–365 plain nonnegative days.');continue}
   if(!iso(row.effective_date)||row.effective_date!==today){fail(`Effective date must be today (${today}); historical leave balances cannot be safely backdated in the current HRMS.`);continue}
   key=row.employee_id.toLowerCase();
  }else if(kind==='recruitment'){
   if(!/^\S+@\S+\.\S+$/.test(row.email)||row.full_name.length>120||row.position.length>100||row.phone.length>40||row.education.length>200){fail('Invalid applicant contact or oversized field.');continue}
   if(!iso(row.application_date)||row.application_date>today){fail('Application date must be valid YYYY-MM-DD, not future.');continue}
   if(row.relevant_years&&(!nonneg(row.relevant_years)||+row.relevant_years>80)){fail('Relevant years must be 0–80.');continue}
   key=norm(row.email)+'|'+norm(row.position);if(ctx.applicants?.some(a=>norm(a.email)+'|'+norm(a.role)===key)){fail('Applicant email+position already exists.');continue}
  }else if(kind==='rates'){
   const p=ctx.people.find(x=>x.id.toLowerCase()===row.employee_id.toLowerCase());
   if(!['Daily','Monthly'].includes(row.salary_type)||p?.salaryType!==row.salary_type){fail('Salary type must match Employee 201 Daily/Monthly.');continue}
   if(!nonneg(row.amount_php)||+row.amount_php<=0||+row.amount_php>100000000){fail('Rate must be positive verified PHP amount (max 100,000,000).');continue}
   if(!iso(row.effective_date)||row.reason.length>250){fail('Invalid effective date or reason too long.');continue}
   key=row.employee_id.toLowerCase()+'|'+row.effective_date;
   if(ctx.rates?.some(r=>norm(r.employeeId)===norm(row.employee_id)&&r.effective===row.effective_date)){fail('Employee already has a rate change on that effective date.');continue}
  }else if(kind==='compliance'){
   if(!['DOLE','BIR','SSS','PhilHealth','Pag-IBIG','BFP','DENR-EMB','PSA','LGU'].includes(row.agency)||!['Monthly','Quarterly','Semiannual','Annual','Event-based','Custom'].includes(row.frequency)){fail('Invalid agency or frequency.');continue}
   if(!iso(row.due_date)||row.requirement.length>200||row.owner.length>120){fail('Invalid due date or oversized requirement/owner.');continue}
   key=[row.agency,norm(row.requirement),row.branch,row.due_date].join('|');
   if(ctx.compliance?.some(x=>[x.agency,norm(x.title),x.branch,x.due].join('|')===key)){fail('Compliance task already exists with same agency, name, branch and due date.');continue}
  }else if(kind==='documents'){
   if(row.document_type.length>120||row.file_name.length>200||row.source_reference.length>200||!/^.{1,180}\.(pdf|docx|jpg|jpeg|png)$/i.test(row.file_name)){fail('Invalid reference filename (PDF/DOCX/JPG/PNG only) or oversized field.');continue}
   key=[row.employee_id,norm(row.document_type),norm(row.file_name)].join('|');
   if(ctx.documents?.some(x=>[x.employeeId,norm(x.type),norm(x.fileName)].join('|')===key)){fail('Document reference already exists.');continue}
  }
  if(seen.has(key)){fail('Duplicate record within this upload.');continue}seen.add(key);
  rows.push(row);
 }
 if(kind==='documents')warnings.push('Filename/reference metadata only. No uploaded file, signature, verified document or HR approval is created.');
 if(kind==='compliance')warnings.push('Imported compliance items are always Draft; proof references must be independently reviewed.');
 if(kind==='leave'&&rows.length)warnings.push('Current SIL/VIL allocations will be replaced with these explicit verified values; approved leave usage remains unchanged.');
 return finish(total);
}
export async function readModuleFile(file:File){return readBulkRows(file)}
function downloadBlob(blob:Blob,name:string){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000)}
export function downloadModuleCsv(kind:ModuleImportKind){downloadBlob(new Blob(['\uFEFF',bulkCsv([moduleImportCatalog[kind].columns.map(c=>c.name)])],{type:'text/csv;charset=utf-8'}),`HRMS-${kind}-Bulk-Input.csv`)}
export async function downloadModuleXlsx(kind:ModuleImportKind){
 const {Workbook}=await import('exceljs');const wb=new Workbook();const spec=moduleImportCatalog[kind];
 const sh=wb.addWorksheet('Input');sh.columns=spec.columns.map(c=>({header:c.name,key:c.name,width:Math.max(21,Math.min(40,c.name.length+8))}));sh.views=[{state:'frozen',ySplit:1}];sh.getRow(1).font={bold:true,color:{argb:'FFFFFFFF'}};sh.getRow(1).fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF24354D'}};
 for(let i=2;i<=101;i++)for(let c=1;c<=spec.columns.length;c++)sh.getRow(i).getCell(c).numFmt='@';
 const guide=wb.addWorksheet('Guide - Read First');guide.columns=[{width:26},{width:95},{width:35}];
 const intro=[['HRMS BULK IMPORT',spec.title,''],['PURPOSE',spec.purpose,''],['DATA SAFETY',spec.behavior,''],['HOW TO START','In HRMS choose the correct company/branch; download this template; do not rename Input or column headers.',''],['HOW TO FILL','One record per row from row 2. No blank row gaps, merged cells, or formulas. Keep numeric cells as plain numbers and dates as text YYYY-MM-DD.',''],['HOW TO UPLOAD','Upload .csv or .xlsx (max 3 MB, 500 rows), review all errors/warnings and every record, confirm explicitly.',''],['DUPLICATES','Never rename an existing ID/serial to force an update. Fix the source file or use a proper record-edit workflow.',''],['CONFIDENTIALITY','Frontend/browser-local prototype only. Use fictional data until secure production storage is deployed.',''],['LEGAL / COMPLIANCE','Source entries and references must be verified independently. Government rates, approvals, signatures or evidence are never inferred.',''],[],['EXACT COLUMN','REQUIRED AND DETAILED INSTRUCTIONS','FORMAT EXAMPLE ONLY']];
 for(const row of intro)guide.addRow(row);for(const c of spec.columns)guide.addRow([c.name+(c.required?' *':''),c.guide,c.example]);guide.getRow(1).font={bold:true,size:15};guide.getRow(11).font={bold:true};guide.eachRow(r=>{r.alignment={vertical:'middle',wrapText:true};r.height=45});
 const b=await wb.xlsx.writeBuffer();downloadBlob(new Blob([new Uint8Array(b)],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),`HRMS-${kind}-Bulk-Input.xlsx`);
}
export function downloadModuleIssues(preview:ImportPreview){downloadBlob(new Blob(['\uFEFF',bulkCsv([['Type','Issue'],...preview.errors.map(x=>['Error',x]),...preview.warnings.map(x=>['Warning',x])])],{type:'text/csv;charset=utf-8'}),'HRMS-Module-Bulk-Import-Issues.csv')}
