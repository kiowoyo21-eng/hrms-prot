"use client";
import {HrmsDialog,HrmsButton} from "./ui/HrmsPrimitives";
import {bulkColumns,type BulkKind} from "../lib/hrmsBulkImport";

export default function BulkUploadGuide({kind,onClose}:{kind:BulkKind|null;onClose:()=>void}){
 const isAttendance=kind==="Attendance";
 const columns=kind?bulkColumns(kind):[];
 const steps=isAttendance?[
  "Open Payroll → Generate Payslips → Attendance Upload & Verification. Select the correct branch and the Thursday payroll cutoff start date BEFORE uploading.",
  "Choose Download Excel Template (.xlsx), or Download CSV Template. The Excel file contains an Input sheet and a Guide - Read First sheet. Enter actual attendance in Input only.",
  "Enter one row for EACH employee and EACH applicable cutoff date, including Rest Day, Absent or On Leave when appropriate. Use existing Employee IDs rather than names.",
  "Enter YYYY-MM-DD dates. Use 08:00 and 17:00 for 24-hour Time In / Time Out only when punches are known. Do not fabricate attendance. Incomplete punches should be marked Incomplete.",
  "For Present, enter both times, with Time Out later on the same date. For Rest Day, Absent or On Leave, leave times blank. For Incomplete, enter the one available partial punch.",
  "Approved OT Hours is a number from 0 to 8. Set OT Approved to Yes only when positive OT has actually been approved and the employee is Present.",
  "Save the Excel workbook as .xlsx with the Input sheet name unchanged, or export just the filled Input data as UTF-8 CSV. Keep original column headers; do not add totals, merged headings, formulas or extra columns.",
  "Click Import Attendance. Inspect the row count and every row-specific validation error. Correct the file, then reupload. Zero errors are required before Record Validated Rows becomes available.",
  "Review branch/cutoff coverage, employee/day duplicates, hire dates, leave, missing punches and OT authorization against independent timekeeping evidence. Submit for verification, then record the authorized review.",
  "The imported records are browser-local references, NOT trusted biometric evidence, final payroll computations, or a bank payment instruction. Production collection requires a secure backend."
 ]:[
  `Open Payroll → Government Deductions → ${kind??"Agency"}. Select the correct agency and check the saved schedule version before changing anything.`,
  "Download the Excel Template (.xlsx), or select CSV Template for an Excel/Google Sheets-friendly comma-separated file. Each agency has its own EXACT column headers.",
  "Get the current or applicable historical OFFICIAL government agency circular/table. Verify its effective date, applicable compensation basis, pay frequency, floor/ceiling and employer/employee split. Do not copy the HRMS illustrative default schedule.",
  "In the Excel workbook, edit only the Input sheet; the Guide - Read First sheet explains every column. Keep header row 1 and sheet name Input unchanged. Begin actual data in row 2. CSV users keep the same header row.",
  "Enter one bracket per row: min and max as inclusive peso boundaries. Use no ₱, commas, formulas, or % signs. For rate enter percentage POINTS, such as 15 for 15%, not 0.15. For open-ended ranges, 999999999 is an HRMS prototype convention only.",
  "Enter exactly one real effective date per uploaded schedule in YYYY-MM-DD; do not combine multiple effective dates or different pay frequencies in one upload. For BIR this template represents WEEKLY taxable compensation brackets, not monthly gross income.",
  "Save as .xlsx or UTF-8 .csv. Click Import CSV / XLSX and examine the preview: total rows, sample bracket values, row errors, date mismatch, overlaps, and gaps. The importer does not replace existing versions automatically.",
  "Correct every listed validation error in the spreadsheet and reupload. Resolve warning flags against the government source even when the file passes technical validation. CSV and XLSX use the SAME validation rules.",
  "After a clean preview, choose Stage as Draft. Supply the official HTTPS source URL, verify the imported effective date, and Save Proposed Version. Previous schedules remain in history.",
  "Approval is a separate internal DEMO review action and is NOT regulatory confirmation. Do not treat imported reference tables as approved for real payroll withholding, remittances or official filings without independent payroll/legal validation."
 ];
 return <HrmsDialog open={Boolean(kind)} title={isAttendance?"Attendance Bulk Upload — Detailed Guide":`${kind??"Government"} Brackets — Detailed Import Guide`} subtitle="Exact template columns, file preparation, validation, and review procedure" onClose={onClose} size="xl" className="hrms-bulk-guide" footer={<HrmsButton variant="primary" onClick={onClose}>Close Guide</HrmsButton>}>
  <div className="hrms-bulk-guide-content">
   <p><strong>Choose the correct template for this module.</strong> These downloads contain column headers and instructions, not real salaries, government contribution amounts, tax rates, or fabricated employee data.</p>
   <h3>Step-by-step procedure</h3>
   <ol>{steps.map((s,i)=><li key={i}>{s}</li>)}</ol>
   <h3>Exact input columns</h3>
   <div className="hrms-bulk-guide-table"><table><thead><tr><th>Column (exact spelling)</th><th>Required?</th><th>Meaning / accepted value</th><th>Format only</th></tr></thead><tbody>{columns.map(c=><tr key={c.name}><td><code>{c.name}</code></td><td>{c.required?"Required":"Optional"}</td><td>{c.meaning}</td><td><code>{c.example||"(blank)"}</code></td></tr>)}</tbody></table></div>
   <h3>What happens if an import fails?</h3>
   <ul><li><b>Missing header:</b> keep the exact downloaded column name; do not rename, merge, or duplicate columns.</li><li><b>Invalid amount / percentage:</b> remove ₱, commas, percent symbols, formulas and negative numbers; use plain numeric values.</li><li><b>Invalid date:</b> use <code>YYYY-MM-DD</code> and verify the date exists; one effective date per government schedule.</li><li><b>Overlapping brackets:</b> correct the official interval boundaries; the importer does not guess or adjust ranges.</li><li><b>Conflicting records:</b> check the selected agency, employee ID, branch, reporting period and source documentation.</li><li><b>File cannot be read:</b> use genuine .xlsx or UTF-8 .csv, not .xls, .xlsm, renamed PDFs or password-protected spreadsheets. Maximum size is 3 MB.</li></ul>
   <p className="hrms-bulk-legal"><b>Review requirement:</b> All imported government schedules are draft references. Do not assume a technically valid uploaded file is legally correct. Payroll calculation, employee contribution allocation, statutory deadlines and legal applicability require separate validation by the responsible HR/Payroll reviewer.</p>
  </div>
 </HrmsDialog>
}
