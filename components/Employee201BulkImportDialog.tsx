"use client";
import {useEffect,useRef,useState} from "react";
import {Download,FileSpreadsheet,Upload,AlertTriangle,CheckCircle2} from "lucide-react";
import type {HRPerson} from "../lib/hrState";
import {employee201Columns,readEmployee201File,validateEmployee201Import,downloadEmployee201Csv,downloadEmployee201Xlsx,downloadEmployee201Errors,type Employee201ImportPreview} from "../lib/employee201Bulk";
import {HrmsDialog} from "./ui/HrmsPrimitives";

type Props={open:boolean;onClose:()=>void;people:HRPerson[];scope:string;onImport:(rows:HRPerson[])=>void};
export default function Employee201BulkImportDialog({open,onClose,people,scope,onImport}:Props){
 const submittedRef=useRef(false);
 const [tab,setTab]=useState<"upload"|"guide">("upload");
 const [selectedFile,setSelectedFile]=useState("");
 const [preview,setPreview]=useState<Employee201ImportPreview|null>(null);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 useEffect(()=>{if(!open){submittedRef.current=false;setTab("upload");setSelectedFile("");setPreview(null);setError("");setBusy(false)}},[open]);
 const readFile=async(file:File|undefined)=>{
  submittedRef.current=false;setPreview(null);setError("");setSelectedFile(file?.name||"");if(!file)return;
  setBusy(true);
  try{
   const rows=await readEmployee201File(file);setPreview(validateEmployee201Import(rows,people,scope));
  }catch(e){setError(e instanceof Error?e.message:String(e))}
  finally{setBusy(false)}
 };
 const finish=()=>{
  if(!preview||preview.errors.length||!preview.rows.length||busy||submittedRef.current)return;
  // Avoid duplicate imports if state changed while the preview was open.
  const fresh=validateEmployee201Import([employee201Columns.map(c=>c.name),...preview.rows.map(row=>[
   row.id,row.name,row.branch,row.department,row.position,row.status,row.gender,row.hire,row.salaryType,String(row.rate),row.birthDate||"",row.civilStatus||"",row.email,row.phone,row.address||"",row.emergencyName||"",row.emergencyRelationship||"",row.emergencyPhone||"",row.nationality||"",row.jobLevel||"",row.employmentArrangement||"",String(row.sil),String(row.vil),row.probation?String(row.probation):"",row.middleName||""
  ])],people,scope);
  if(fresh.errors.length){setPreview(fresh);setError("The employee register changed since preview. Check the errors and reupload the corrected file.");return}
  submittedRef.current=true;onImport(preview.rows);onClose();
 };
 return <HrmsDialog open={open} title="Bulk Add Employees — Employee 201" subtitle="Add-only CSV/Excel import with row-level checks. No existing records will be overwritten." size="xl" onClose={onClose} footer={<><button type="button" className="secondary" onClick={onClose}>Cancel</button><button type="button" className="primary" disabled={!preview||!!preview.errors.length||!preview.rows.length||busy} onClick={finish}>Confirm Import ({preview?.rows.length||0})</button></>}>
  <div className="emp201-bulk-dialog">
   <div className="emp201-bulk-tabs" role="tablist" aria-label="Employee 201 bulk import sections">
    <button role="tab" type="button" aria-selected={tab==="upload"} className={tab==="upload"?"is-active":""} onClick={()=>setTab("upload")}>Upload & Preview</button>
    <button role="tab" type="button" aria-selected={tab==="guide"} className={tab==="guide"?"is-active":""} onClick={()=>setTab("guide")}>Detailed Guide</button>
   </div>
   {tab==="upload"?<>
    <div className="emp201-bulk-downloads">
     <button type="button" className="secondary" onClick={()=>void downloadEmployee201Xlsx().catch(e=>setError(e instanceof Error?e.message:String(e)))}><FileSpreadsheet size={16}/> Download Excel Template</button>
     <button type="button" className="secondary" onClick={downloadEmployee201Csv}><Download size={16}/> Download CSV Template</button>
     <button type="button" className="secondary" onClick={()=>setTab("guide")}>Read Step-by-Step Guide</button>
    </div>
    <p className="muted">Current scope: <strong>{scope}</strong>. Import creates new employee profiles with unsubmitted document checklists; it does not upload supporting documents, update salary history, or change existing employees.</p>
    <label className="emp201-bulk-file">Choose a completed file (.xlsx or .csv, up to 3 MB)
     <input type="file" accept=".xlsx,.csv" disabled={busy} onChange={e=>{void readFile(e.target.files?.[0]);e.currentTarget.value=""}}/>
    </label>
    {busy&&<p role="status">Reading and validating the file…</p>}
    {error&&<p className="error" role="alert">{error}</p>}
    {preview&&<>
     <div className="emp201-bulk-summary"><span><b>{preview.total}</b><small>Uploaded rows</small></span><span><b>{preview.rows.length}</b><small>Valid rows</small></span><span><b>{preview.errors.length}</b><small>Blocking errors</small></span><span><b>{preview.warnings.length}</b><small>Warnings</small></span><span><b>{preview.autoIds}</b><small>Generated IDs</small></span></div>
     <div className="emp201-bulk-review-state">{preview.errors.length?<><AlertTriangle size={16}/> Import blocked. Correct every error and reupload.</>:<><CheckCircle2 size={16}/> Validation passed. Review the employees below before confirming.</>}</div>
     {preview.errors.length>0&&<div className="emp201-bulk-errors" role="alert"><h4>Row Errors</h4><ol>{preview.errors.slice(0,70).map((x,i)=><li key={i}>{x}</li>)}</ol>{preview.errors.length>70&&<p>Additional errors are in the downloadable report.</p>}</div>}
     {preview.warnings.length>0&&<div className="emp201-bulk-warnings"><h4>Warnings</h4><ul>{preview.warnings.slice(0,12).map((x,i)=><li key={i}>{x}</li>)}</ul>{preview.warnings.length>12&&<p>{preview.warnings.length-12} more warning(s) are in the report.</p>}</div>}
     {(preview.errors.length>0||preview.warnings.length>0)&&<button type="button" className="secondary" onClick={()=>downloadEmployee201Errors(preview)}><Download size={15}/> Download Error & Warning Report</button>}
     <div className="emp201-bulk-table"><table><thead><tr><th>Employee ID</th><th>Full Name</th><th>Branch</th><th>Status</th><th>Hire Date</th><th>Basic Rate</th></tr></thead><tbody>{preview.rows.slice(0,20).map(p=><tr key={p.id}><td>{p.id}</td><td>{p.name}</td><td>{p.branch}</td><td>{p.status}</td><td>{p.hire}</td><td>{p.salaryType} · PHP {p.rate.toLocaleString("en-PH")}</td></tr>)}</tbody></table></div>
     {preview.rows.length>20&&<small className="muted">Showing the first 20 validated records of {preview.rows.length}; all valid records are imported together after confirmation.</small>}
     <small className="muted">Source: {selectedFile}. This is browser-local demo storage. Do not upload real confidential employee details before production-grade security is connected.</small>
    </>}
   </>:<div className="emp201-bulk-guide">
    <h4>Step-by-Step Employee 201 Bulk Add Instructions</h4>
    <ol>
     <li><b>Choose the correct HRMS scope.</b> Check the branch filter before opening Bulk Add. If a specific branch is selected, every row must belong to that branch. Underchargers LP/MD/QC are under UC; MM is a separate employer.</li>
     <li><b>Download a fresh template.</b> Use Excel for data-entry help or CSV for external systems. Both have the same 25 columns. Excel data goes into the <code>Input</code> worksheet only; do not edit header names or order.</li>
     <li><b>Fill one employee per row, starting at row 2.</b> Required columns must not be blank. Blank Employee ID is allowed and triggers automatic unique ID generation. Never reuse IDs of existing employees.</li>
     <li><b>Enter verified information.</b> Salary Type is Daily or Monthly, and Basic Rate must be the verified value in PHP with no commas or currency symbols. SIL Days and VIL Days require actual opening credits, including 0 only if verified. DOB may be blank until confirmed.</li>
     <li><b>Use exact formats.</b> Dates use YYYY-MM-DD typed as text; accepted categories are listed below. No formulas, password protection, merged cells, or macro-enabled files.</li>
     <li><b>Upload and inspect.</b> Choose .xlsx or UTF-8 CSV (max 3 MB, 500 employees). Confirm the selected branch, filenames, counts, duplicate checks, and preview of employees.</li>
     <li><b>Resolve every error.</b> Download the error report, fix the specified source spreadsheet rows, then upload again. Import is all-or-nothing: no partial saves and no overwriting existing employees.</li>
     <li><b>Confirm Import.</b> Only after zero blocking errors. New records gain initial assignment history and Missing document statuses. Supporting contracts, IDs, and actual uploaded files must still be managed under Employee 201 Documents.</li>
     <li><b>Verify your results.</b> Inspect employee counts, age, branch, salary type and pay rate in Employee 201. This prototype saves to the current browser only; do not import real personal/payroll data until server-side privacy and access controls are available.</li>
    </ol>
    <h4>Field-by-Field Data Dictionary</h4>
    <div className="emp201-bulk-table"><table><thead><tr><th>Exact Header</th><th>Required?</th><th>How to Fill</th><th>Format Example Only</th></tr></thead><tbody>{employee201Columns.map(c=><tr key={c.name}><td><b>{c.name}</b></td><td>{c.required?"Yes":"No"}</td><td>{c.instruction}</td><td>{c.example}</td></tr>)}</tbody></table></div>
    <h4>Import errors & troubleshooting</h4>
    <p><b>Headers missing/renamed:</b> Download a new template; paste values into the original columns. <b>Dates treated as Excel serial numbers:</b> Set date columns to Text and use YYYY-MM-DD. <b>Duplicate employee:</b> Correct IDs or remove the existing employee's row—bulk add cannot modify a person already in HRMS. <b>Wrong branch:</b> Choose the right HRMS scope or split files by branch. <b>Formula cell:</b> Paste Values before uploading. <b>File too large:</b> Split into batches of at most 500 employees, each under 3 MB.</p>
    <p><b>Limitations:</b> This is ADD-only. Employee movement, rate changes, government IDs, signed documents, payroll history, and document verification require their respective authorized workflows. Actual employees must not be loaded to browser-only storage.</p>
   </div>}
  </div>
 </HrmsDialog>
}
