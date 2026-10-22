// Dependency-free pure selector tests; cannot replace a Next.js build/browser QA.
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const Module=require('node:module');
const ts=require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript/lib/typescript.js');
const root=path.resolve(__dirname,'..');
const original=Module._extensions['.ts'];
Module._extensions['.ts']=function(m,filename){
 const source=fs.readFileSync(filename,'utf8');
 const result=ts.transpileModule(source,{fileName:filename,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}});
 m._compile(result.outputText,filename);
};
// Avoid importing React client/provider. Use a representative isolated state fixture.
const {buildPsaDatasets,employeesAt,psaCsv,assignmentAt}=require('../lib/psaDataSupport.ts');
const p=(id,branch,hire,gender='Male')=>({id,name:`Employee ${id}`,branch,hire,department:'Operations',position:'Mechanic',status:'Regular',gender,salaryType:'Daily',rate:755,documents:[],timeline:[],email:'',phone:'',probation:0,sil:5,vil:5,assignmentHistory:[{id:`a-${id}`,effectiveDate:hire,kind:'Initial Assignment',branch,department:'Operations',position:'Mechanic'}]});
const u=p('UC-01','UC Las Piñas','2025-05-15');const m=p('MM-01','MM Mandaluyong','2026-01-03','Female');
const state={people:[u,m],lifecycleCases:[],payrollConfig:{rateChanges:[]},payrollReleases:[{id:'R1',employeeId:'UC-01',paidAt:'2026-06-10',kind:'Bonus',status:'Released',source:'Browser Review',gross:1000},{id:'R1',employeeId:'UC-01',paidAt:'2026-06-10',kind:'Bonus',status:'Released',source:'Browser Review',gross:1000},{id:'SAMPLE-1',employeeId:'UC-01',paidAt:'2026-06-10',kind:'Bonus',status:'Released',source:'Sample',gross:9999}],assets:[],submissions:[],rates:{},earnings:{},deductions:{}};
const date='2026-08-31';const start='2025-09-01';const today='2026-10-22';
assert.equal(assignmentAt(u,date).branch,'UC Las Piñas');
assert.equal(employeesAt(state,'UC Las Piñas',date,today).rows.length,1);
assert.equal(employeesAt(state,'MM Mandaluyong',date,today).rows.length,1);
const ows=buildPsaDatasets(state,'OWS','UC Las Piñas',date,start,today);
assert.equal(ows.find(d=>d.id==='ows-roster').rows.length,1);
assert.equal(ows.find(d=>d.id==='ows-occupation-sex').rows[0][2],'1');
assert.equal(ows.find(d=>d.id==='ows-basic-pay').rows[0][4],'Not verified');
assert.equal(ows.find(d=>d.id==='ows-recorded-bonuses').rows.length,1,'deduplicate release IDs, exclude sample');
assert.equal(ows.find(d=>d.id==='ows-psoc').status,'Not tracked');
assert.ok(ows.every(d=>d.rows.every(r=>!r.join('').includes('MM-01'))),'cross-establishment isolation');
const isle=buildPsaDatasets(state,'ISLE','UC Las Piñas',date,start,today);
assert.equal(isle.find(d=>d.id==='isle-roster').rows.length,1);
assert.equal(isle.find(d=>d.id==='isle-ai').status,'Not tracked');
assert.equal(isle.find(d=>d.id==='isle-hires').rows.length,0,'hire outside interval');
assert.equal(isle.find(d=>d.id==='isle-separations').status,'Partial','missing separation events are not a certified zero');
// An employee's present-day branch must not leak a past payroll release into another establishment.
const moved={...u,branch:'MM Mandaluyong',assignmentHistory:[...u.assignmentHistory,{id:'transfer',effectiveDate:'2026-07-01',kind:'Transfer',branch:'MM Mandaluyong',department:'Operations',position:'Mechanic'}]};
const historicalState={...state,people:[moved,m]};
const isleUC=buildPsaDatasets(historicalState,'ISLE','UC Las Piñas',date,start,today);
const isleMM=buildPsaDatasets(historicalState,'ISLE','MM Mandaluyong',date,start,today);
assert.equal(isleUC.find(d=>d.id==='isle-digital-wages').rows.length,1,'historical release remains in historical establishment');
assert.equal(isleMM.find(d=>d.id==='isle-digital-wages').rows.length,0,'historical release must not leak into current branch');
assert.deepEqual(buildPsaDatasets(state,'OWS','UC Las Piñas','2030-01-01',start,today),[]);
const bad={...ows[0],columns:['Employee'],rows:[['=DANGEROUS()']]};
assert.ok(psaCsv(bad,'UC Las Piñas').includes("'=DANGEROUS()"),'CSV formula injection escaped');
console.log('PASS PSA data support: establishment separation, as-of evidence, deduplication, no sample releases, gaps, unsafe CSV and date guards');
Module._extensions['.ts']=original;
