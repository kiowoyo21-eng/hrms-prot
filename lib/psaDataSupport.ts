/**
 * PSA OWS / ISLE *supporting data*, not a completed PSA return.
 * Read-only selectors over existing browser-local HRMS records. No new storage.
 * Missing records never become numerical zeroes or assumed form answers.
 */
import type {HRState,HRPerson,PayrollRelease,EmployeeAssignment} from "./hrState";
import type {Shop} from "./people";
import {ageBand,getArrangement,getLevel} from "./employeeDemographics";

export type PsaSurvey="OWS"|"ISLE";
export type DatasetAvailability="Recorded"|"Partial"|"No records"|"Not tracked";
export type PsaDataset={id:string;survey:PsaSurvey;title:string;source:string;status:DatasetAvailability;columns:string[];rows:string[][];notes:string[];reference:string};
const validDate=(s:string)=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(`${s}T00:00:00Z`))&&new Date(`${s}T00:00:00Z`).toISOString().slice(0,10)===s;
export function validPsaDate(s:string){return validDate(s)}
export const OWS_AS_OF="2026-08-31";
export const ISLE_WINDOW_START="2025-09-01";
const clean=(x:unknown)=>String(x??"").trim()||"Not recorded";
const money=(n:number)=>Number.isFinite(n)?n.toFixed(2):"Not recorded";
const group=(rows:string[][],columns:number[])=>{
 const counts=new Map<string,{values:string[];count:number}>();
 for(const row of rows){const key=columns.map(i=>row[i]||"Not recorded").join("\u001f");const found=counts.get(key);if(found){found.count++;continue}counts.set(key,{values:columns.map(i=>row[i]||"Not recorded"),count:1})}
 return [...counts.values()].sort((a,b)=>b.count-a.count||a.values.join().localeCompare(b.values.join())).map(x=>[...x.values,String(x.count)]);
};
const recordStatus=(rows:string[][],historical:boolean):DatasetAvailability=>rows.length===0?"No records":historical?"Partial":"Recorded";
/** Derive a historical branch only from explicitly recorded dated assignment events; no fallback to a present-day branch. */
export function assignmentAt(person:HRPerson,asOf:string):EmployeeAssignment|null{
 const events=(person.assignmentHistory||[]).filter(a=>validDate(a.effectiveDate)&&a.effectiveDate<=asOf).sort((a,b)=>b.effectiveDate.localeCompare(a.effectiveDate));
 return events[0]||null;
}
export function employeesAt(state:HRState,establishment:Shop,asOf:string,today:string){
 const historical=asOf<today;
 const offboarded=new Set((state.lifecycleCases||[]).filter(c=>c.action==="Offboard"&&c.status==="Applied (Demo)"&&validDate(c.effectiveDate)&&c.effectiveDate<=asOf).map(c=>c.employeeId));
 const uncertain:string[]=[];
 const rows=state.people.filter(p=>{
  if(!validDate(p.hire)||p.hire>asOf||offboarded.has(p.id))return false;
  if(!historical)return p.branch===establishment;
  const assignment=assignmentAt(p,asOf);
  if(!assignment){uncertain.push(p.id);return false}
  return assignment.branch===establishment;
 });
 return {rows,historical,uncertain};
}
function dataset(id:string,survey:PsaSurvey,title:string,source:string,columns:string[],rows:string[][],reference:string,notes:string[],status?:DatasetAvailability):PsaDataset{
 return {id,survey,title,source,columns,rows,reference,notes,status:status??recordStatus(rows,false)};
}
function notTracked(survey:PsaSurvey,id:string,title:string,reference:string,reason:string):PsaDataset{
 return dataset(id,survey,title,"No structured source in current HRMS",[],[],reference,[reason],"Not tracked");
}
export function buildPsaDatasets(state:HRState,survey:PsaSurvey,establishment:Shop,asOf:string,from:string,today:string):PsaDataset[]{
 if(!validDate(asOf)||!validDate(from)||!validDate(today)||asOf>today||from>asOf)return [];
 const {rows:people,historical,uncertain}=employeesAt(state,establishment,asOf,today);
 const assignments=new Map(people.map(p=>[p.id,historical?assignmentAt(p,asOf):null]));
 const position=(p:HRPerson)=>historical?clean(assignments.get(p.id)?.position):clean(p.position);
 const department=(p:HRPerson)=>historical?clean(assignments.get(p.id)?.department):clean(p.department);
 const core=people.map(p=>[p.id,clean(p.name),establishment,department(p),position(p),clean(p.gender),clean(p.status),p.hire]);
 const snapshotNote=historical
  ?"Historical snapshot is incomplete: only currently retained Employee 201 records with dated assignment evidence are included. Departed/archived workers and earlier employment statuses may be missing. Verify before filing."
  :"Current Employee 201 data is browser-local and may contain demo records; verify against official HR registers.";
 const common=[snapshotNote,...(uncertain.length?[`${uncertain.length} current employee(s) lack dated assignment history and were excluded from the historical branch estimate.`]:[])];
 const tracked=(id:string,s:PsaSurvey,title:string,source:string,columns:string[],rows:string[][],reference:string,notes:string[]=[],forced?:DatasetAvailability)=>dataset(id,s,title,source,columns,rows,reference,[...common,...notes],forced??recordStatus(rows,historical));
 if(survey==="OWS"){
  const occupations=group(core,[4,5]);
  const classifications=group(people.map(p=>[position(p),clean(p.salaryType),getArrangement(p)]),[0,1,2]);
  // A current basic rate is not proof of an earlier rate. Use only applied rate-change events as historical evidence.
  const changes=state.payrollConfig?.rateChanges||[];
  const pay=people.map(p=>{
   const prior=changes.filter(r=>r.employeeId===p.id&&r.status==="Applied (Demo)"&&validDate(r.effective)&&r.effective<=asOf).sort((a,b)=>b.effective.localeCompare(a.effective))[0];
   const rate=historical?prior?.amount:p.rate;
   const basis=historical?(prior?.salaryType??"Not verified"):p.salaryType;
   return [p.id,position(p),clean(p.gender),basis,typeof rate==="number"?money(rate):"Not verified",prior?.effective??(historical?"No historical pay event":"Current record")];
  });
  const evidence=pay.filter(r=>r[4]!=="Not verified");
  const rateGroups=group(evidence,[1,3,4]);
  const releases=(state.payrollReleases||[]).filter(r=>r.source==="Browser Review"&&r.status==="Released"&&["13th-Month Pay","Bonus"].includes(r.kind)&&validDate(r.paidAt)&&r.paidAt>=from&&r.paidAt<=asOf);
  const unique=new Map<string,PayrollRelease>();releases.forEach(r=>{if(!unique.has(r.id))unique.set(r.id,r)});
  const payrollRows=[...unique.values()].flatMap(r=>{
   const p=state.people.find(p=>p.id===r.employeeId);
   if(!p)return []; // No reliable branch mapping for deleted employee in current browser state
   const a=assignmentAt(p,r.paidAt);
   if((r.paidAt<today?a?.branch:p.branch)!==establishment)return [];
   return [[r.id,p.id,r.kind,r.paidAt,money(r.gross),"Browser Review (unverified)"]];
  });
  return [
   tracked("ows-roster","OWS","Employee roster at reference date","Employee 201 + assignment history",["Employee ID","Employee","Establishment","Department","Position","Sex","Current status*","Hire date"],core,`As of ${asOf}`,["*Current status is NOT reconstructed as of the reference date."]),
   tracked("ows-occupation-sex","OWS","Occupation and sex breakdown","Employee 201 position (not a PSA/PSOC code)",["Recorded position","Recorded sex","Employees"],occupations,`As of ${asOf}`,["Internal job titles are not verified PSA occupation codes; classification must be reviewed."]),
   tracked("ows-pay-basis","OWS","Pay basis and employment arrangement","Employee 201 compensation/arrangement",["Recorded position","Pay basis","Employment arrangement","Employees"],classifications,`As of ${asOf}`,["Commission-based and output-based arrangements are not independently verified."]),
   tracked("ows-basic-pay","OWS","Recorded individual basic pay references","Employee 201 rate + applied payroll rate-change history",["Employee ID","Position","Sex","Pay basis","Basic pay PHP","Rate evidence"],pay,`As of ${asOf}`,["A current rate is never backdated. 'Not verified' indicates no recorded applicable historical rate event.","Basic rate is NOT wages actually paid; no conversion without workdays/hours evidence."],historical?"Partial":recordStatus(pay,false)),
   tracked("ows-rate-counts","OWS","Workers by evidenced basic rate","Recorded individual basic pay references",["Position","Pay basis","Basic pay PHP","Workers"],rateGroups,`As of ${asOf}`,["Only employees whose rate is evidenced on the reference date are counted; unverified rates excluded."],historical?"Partial":recordStatus(rateGroups,false)),
   tracked("ows-recorded-bonuses","OWS","Recorded bonus and 13th-month releases","Payroll released transactions (browser-reviewed only)",["Release ID","Employee ID","Release type","Paid date","Gross PHP","Evidence"],payrollRows,`${from} to ${asOf}`,["Only browser-reviewed release transactions are shown; sample, pending and duplicate-ID entries are excluded. Not a certified annual amount.","Records without a verifiable establishment are excluded."],"Partial"),
   notTracked("OWS","ows-allowances","Allowances and supplements by occupation",`As of ${asOf}`,"No dated, occupation-linked allowance ledger suitable for OWS is present."),
   notTracked("OWS","ows-psoc","Official PSA occupation / PSOC mapping",`As of ${asOf}`,"The position names are internal HR job titles; official occupational coding is not recorded or verified."),
  ];
 }
 const ageRows=group(people.map(p=>[ageBand(p.birthDate,asOf),clean(p.gender)]),[0,1]);
 const classifications=group(people.map(p=>[getArrangement(p),getLevel(p),clean(p.status)]),[0,1,2]);
 const hires=state.people.filter(p=>validDate(p.hire)&&p.hire>=from&&p.hire<=asOf).flatMap(p=>{
  const history=assignmentAt(p,p.hire);
  if((p.hire<today?history?.branch:p.branch)!==establishment)return [];
  return [[p.id,clean(p.name),p.hire,clean(history?.position||p.position),"Present in current Employee 201"]];
 });
 const exits=(state.lifecycleCases||[]).filter(c=>c.action==="Offboard"&&c.status==="Applied (Demo)"&&c.sourceBranch===establishment&&validDate(c.effectiveDate)&&c.effectiveDate>=from&&c.effectiveDate<=asOf).map(c=>[c.id,c.employeeId,c.effectiveDate,clean(c.separationType),clean(c.snapshot.position),clean(c.status)]);
 const wage=state.payrollReleases.filter(r=>{
  if(r.source!=="Browser Review"||r.status!=="Released"||!validDate(r.paidAt)||r.paidAt<from||r.paidAt>asOf)return false;
  const p=state.people.find(p=>p.id===r.employeeId);
  if(!p)return false;
  // Never use the employee's CURRENT branch for a historical wage/payment record.
  const dated=assignmentAt(p,r.paidAt);
  return dated?.branch===establishment;
 });
 const unique=new Map<string,PayrollRelease>();wage.forEach(r=>{if(!unique.has(r.id))unique.set(r.id,r)});
 const wageRows=[...unique.values()].map(r=>[r.id,r.employeeId,r.paidAt,r.kind,clean(r.salaryDestination?.channel),money(r.gross)]);
 return [
  tracked("isle-roster","ISLE","Employment roster at reference date","Employee 201 + assignment history",["Employee ID","Employee","Establishment","Department","Position","Sex","Current status*","Hire date"],core,`As of ${asOf}`,["*Status reflects stored current record, not certified prior status."]),
  tracked("isle-age-sex","ISLE","Age group and sex","Employee 201: date of birth and sex",["Age group","Sex","Employees"],ageRows,`As of ${asOf}`,["'Not recorded' birthdays remain unknown; do not infer ages."]),
  tracked("isle-employment","ISLE","Employment arrangement and job level","Employee 201 classifications",["Arrangement","Job level","Current status*","Employees"],classifications,`As of ${asOf}`,["*Historical employment status is not reconstructed; not a verified ISLE response."]),
  tracked("isle-hires","ISLE","Recorded new hires","Employee 201 recorded hire dates",["Employee ID","Employee","Hire date","Position at hire","Record coverage"],hires,`${from} to ${asOf}`,["Departed or deleted hires may not appear in current Employee 201; counts are incomplete."],"Partial"),
  tracked("isle-separations","ISLE","Applied separation cases","Employee lifecycle applied Offboard records",["Case ID","Employee ID","Effective date","Separation category","Last position","Case status"],exits,`${from} to ${asOf}`,["Only approved/applied recorded offboarding cases are shown; other exits may be untracked."],"Partial"),
  tracked("isle-digital-wages","ISLE","Recorded salary payment references","Payroll releases with browser review",["Release ID","Employee ID","Paid date","Release type","Recorded payment channel","Gross PHP"],wageRows,`${from} to ${asOf}`,["This is not a company-wide assessment of digital wage payment or payslip coverage. Payment channel may be unrecorded.","Uses currently associated employee branch; older transfers may require manual reconciliation."],"Partial"),
  notTracked("ISLE","isle-vacancies","Vacancies and hard-to-fill occupations",`${from} to ${asOf}`,"Recruitment vacancy records are not available as a reliable dated, establishment-scoped reporting dataset here."),
  notTracked("ISLE","isle-recruitment-channels","Recruitment channels and applicant counts",`${from} to ${asOf}`,"No verified, survey-period recruitment channel counts are integrated in this data support view."),
  notTracked("ISLE","isle-training","Job-related training, providers and costs",`${from} to ${asOf}`,"No structured dated training-and-cost ledger for the survey is available."),
  notTracked("ISLE","isle-osh","Occupational health and safety programs",`${from} to ${asOf}`,"Company-wide OSH measures and verified safety programs are not stored as structured survey records."),
  notTracked("ISLE","isle-injuries","Occupational injuries, disease and days lost",`${from} to ${asOf}`,"General incident reports are not sufficient for occupation-specific injury and work-hour statistics."),
  notTracked("ISLE","isle-productivity","Productivity programs and gainsharing",`${from} to ${asOf}`,"No survey-ready productivity program or gainsharing register is recorded."),
  notTracked("ISLE","isle-ai","Artificial intelligence at work",`${from} to ${asOf}`,"AI use by job task must be confirmed by management; not tracked in HRMS."),
  notTracked("ISLE","isle-union","Labor relations, CBA and union coverage",`${from} to ${asOf}`,"Union/CBA coverage data is not recorded as structured establishment records."),
  notTracked("ISLE","isle-other-groups","PWD, outsourced and other worker classifications",`${from} to ${asOf}`,"Required worker categories are not reliably captured. Do not infer protected data."),
 ];
}
export function psaCsv(dataset:PsaDataset,establishment:string){
 const q=(cell:unknown)=>{const t=String(cell??"");const safe=/^[=+@\-\t\r]/.test(t)?`'${t}`:t;return `"${safe.replace(/"/g,'""')}"`};
 const meta=[
  ["PSA supporting data only — NOT a completed questionnaire or filing"],
  ["Dataset",dataset.title],["Establishment",establishment],["Reference",dataset.reference],["Source",dataset.source],["Coverage",dataset.status],
  ...dataset.notes.map(n=>["Limitation",n]),
  ["WARNING","Browser-local HRMS may contain demo/unverified records; review all figures before using in a PSA return."],[],dataset.columns,...dataset.rows];
 return '\ufeff'+meta.map(row=>row.map(q).join(",")).join("\r\n");
}
