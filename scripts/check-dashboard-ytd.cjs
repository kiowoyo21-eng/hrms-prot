const assert=require('node:assert/strict');
const fs=require('fs'),path=require('path'),ts=require('typescript');
const src=fs.readFileSync(path.resolve(__dirname,'../lib/dashboardAnalytics.ts'),'utf8');
const compiled=ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const out={};const transpiledModule={exports:out};new Function('module','exports','require',compiled)(transpiledModule,out,()=>{});
const {dashboardEmployeeSummary,dashboardTodayPH}=out;
const B1='UC Mandaluyong',B2='UC Las Piñas';
const person=(id,branch,hire,gender)=>({id,branch,hire,gender,position:'Service Advisor'});
const release=(id,employeeId,paidAt,gross,source='Browser Review',status='Released',kind='Salary')=>({id,employeeId,paidAt,gross,source,status,kind});
const state={people:[person('A',B1,'2026-01-01','Male'),person('B',B1,'2025-03-01','Female'),person('C',B2,'2026-09-01','Female'),person('F',B1,'2026-11-01','Female')],lifecycleCases:[
 {id:'life1',action:'Offboard',status:'Applied (Demo)',effectiveDate:'2026-09-01',sourceBranch:B1,snapshot:{position:'Service Advisor'},separationType:'Resignation'},
 {id:'life2',action:'Offboard',status:'Applied (Demo)',effectiveDate:'2026-10-24',sourceBranch:B1,snapshot:{position:'Service Advisor'},separationType:'Termination'},
 {id:'life3',action:'Offboard',status:'Applied (Demo)',effectiveDate:'2026-09-01',sourceBranch:B2,snapshot:{position:'Service Advisor'},separationType:'Termination'}
 ],payrollReleases:[
 release('r1','A','2026-01-01',100),release('r1','A','2026-01-01',100),
 release('r2','B','2026-10-22',200),release('r3','A','2026-10-23',999),
 release('r4','A','2026-09-10',999,'Sample'),release('r5','A','2026-09-10',999,'Browser Review','Pending'),
 release('r6','A','2026-09-10',999,'Browser Review','Released','Bonus'),
 release('r7','C','2026-09-10',999),release('r8','A','2025-12-31',999),release('r9','A','2026-06-01',-4)
 ]};
const b1=dashboardEmployeeSummary(state,B1,'2026-10-22');
const all=dashboardEmployeeSummary(state,'All Shops','2026-10-22');
assert.equal(b1.total,3);assert.equal(b1.hires,1);assert.equal(b1.exits,1);assert.equal(b1.terminations,0);
assert.equal(b1.salaryGross,300);assert.equal(b1.salaryCount,2);assert.equal(b1.sampleReleasesExcluded,1);
assert.equal(all.salaryGross,1299);assert.equal(all.hires,2);assert.equal(all.exits,2);
assert.match(dashboardTodayPH(new Date('2026-10-22T03:00:00Z')), /^2026-10-22$/);
console.log('PASS: Jan 1–today, branch scope, missing/duplicate/sample/future/unreviewed payroll exclusion and applied offboarding filters');
