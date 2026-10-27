// Source-level safety checks. Run with Node 20+ and TypeScript available.
const assert=require('node:assert/strict'),fs=require('fs'),path=require('path');
const ts=require('typescript');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,filename);
const root=path.resolve(__dirname,'..');
const {lastCompletedCutoff,philippineToday,reviewCompanyPayroll}=require(path.join(root,'lib/companyWeeklyPayroll.ts'));
const {reviewClearance,noteExternalPayment,closeSeparationReview,finalPayBlockers}=require(path.join(root,'lib/finalPayReview.ts'));
const {finalizeLifecycleCase}=require(path.join(root,'lib/employeeLifecycle.ts'));
assert.deepEqual(lastCompletedCutoff('2026-10-29'),{start:'2026-10-22',end:'2026-10-28',isThursday:true});
assert.deepEqual(lastCompletedCutoff('2026-10-26'),{start:'2026-10-15',end:'2026-10-21',isThursday:false});
assert.equal(philippineToday(new Date('2026-10-28T17:00:00Z')),'2026-10-29');
function employee(id,branch){return {id,name:id,branch,hire:'2025-01-01',status:'Regular',salaryType:'Daily',rate:700,department:'Ops',position:'Mechanic',gender:'Male'};}
const people=[employee('UC-001','UC Las Piñas'),employee('UC-002','UC Mandaluyong'),employee('MM-001','MM Mandaluyong')];
let rows=[];let records=[];
for(const p of people){for(let i=0;i<7;i++){let d=new Date('2026-10-22T00:00:00Z');d.setUTCDate(d.getUTCDate()+i);rows.push({employeeId:p.id,branch:p.branch,date:d.toISOString().slice(0,10),status:i===6?'Rest Day':'Present',workedHours:i===6?0:8,lateMinutes:0,approvedOtHours:0,otApproved:false})}records.push({branch:p.branch,periodStart:'2026-10-22',periodEnd:'2026-10-28',status:'Verified'})}
const cfg={attendanceRecords:records,attendanceRows:rows,rateChanges:[],holidayRules:[],payslipDrafts:[]};
const state={people,rates:{},payrollReleases:[],assets:[],lifecycleCases:[],finalPayCases:[]};
const schedules=people.map(p=>({id:'TEST-'+p.id,employeeId:p.id,branch:p.branch,month:'2026-10',offDates:['2026-10-28'],status:'Published',version:1,updatedAt:'2026-10-01T00:00:00Z',updatedBy:'BM'}));
let uc=reviewCompanyPayroll(state,cfg,'Underchargers','2026-10-22','2026-10-28',schedules);
assert.equal(reviewCompanyPayroll(state,cfg,'Underchargers','2026-10-22','2026-10-28').blocked.length,2,'Missing published OPS schedule must block company payroll');
assert.equal(uc.employees.length,2);assert.equal(uc.blocked.length,0);assert.equal(uc.employees[0].basic,4200); // 6 verified present days
let mm=reviewCompanyPayroll(state,cfg,'Mastermind','2026-10-22','2026-10-28',schedules);assert.equal(mm.employees.length,1);assert.equal(mm.employees[0].employeeId,'MM-001');
let incomplete={...cfg,attendanceRows:rows.filter(x=>!(x.employeeId==='UC-002'&&x.date==='2026-10-25'))};
assert.equal(reviewCompanyPayroll(state,incomplete,'Underchargers','2026-10-22','2026-10-28',schedules).blocked.length,1);
let duplicate={...cfg,payslipDrafts:[{employeeId:'UC-001',periodStart:'2026-10-22',periodEnd:'2026-10-28'}]};assert.equal(reviewCompanyPayroll(state,duplicate,'Underchargers','2026-10-22','2026-10-28',schedules).blocked.length,1);
const clearanceState={...state,people:people.map(p=>p.id==='UC-001'?{...p,status:'Clearance Pending'}:p)};
let withAsset={...clearanceState,assets:[{id:'A1',employeeId:'UC-001',status:'Assigned'}]};
const base={id:'FP-01',employeeId:'UC-001',branch:'UC Las Piñas',lifecycleCaseId:'L1',createdBy:'maker',status:'Accounting Handoff (Demo)',amounts:{unpaidBasic:0,thirteenthAdjustment:0,leaveConversion:0,otherEarnings:0,taxWithholding:0,loanRecovery:0,otherDeductions:0},references:{attendance:'attendance123',payroll:'payroll123',loans:'reviewed123',assets:'assetpending',statutory:'statutory123'},lastWorkingDay:'2026-10-22',notes:'',history:[]};
let outstanding=reviewClearance(withAsset,base,'reviewer','HR','2026-10-26T01:00:00Z','Cleared','Signed final clearance');assert.equal(outstanding.ok,false);
let progress=reviewClearance(withAsset,base,'reviewer','HR','2026-10-26T01:00:00Z','Outstanding Issues','Device assignment unresolved');assert.equal(progress.ok,true);
let proof=noteExternalPayment(progress.record,'reviewer','HR','2026-10-26T01:30:00Z','VOUCHER-2026-01');assert.equal(proof.ok,true);
assert.equal(closeSeparationReview(withAsset,proof.record,'reviewer','HR','2026-10-26T02:00:00Z','CLOSE-2026').ok,false);
const cleared=reviewClearance(clearanceState,proof.record,'reviewer','HR','2026-10-26T02:00:00Z','Cleared','All property checked');assert.equal(cleared.ok,true);
assert.equal(closeSeparationReview(clearanceState,cleared.record,'reviewer','HR','2026-10-26T03:00:00Z','CLOSE-2026').ok,true);
const source=(file)=>fs.readFileSync(path.join(root,file),'utf8');
assert(!source('components/DocumentWorkspace.tsx').includes('id:"DOC-1001"'));
assert(source('components/DocumentOperationsHub.tsx').includes('<StudioIndex embedded initialMode="Templates"/>'));
assert(source('components/PayrollOperationsHub.tsx').includes('Generate Company Payslip Drafts'));
assert(source('components/PayrollOperationsHub.tsx').includes('Attendance Upload Required'));
assert(source('app/ui.css').includes('900px'));
console.log('PASS: payroll cutoff, UC/MM isolation, attendance coverage, duplicates, clearance, external payment references, document cabinets and nav checks');
