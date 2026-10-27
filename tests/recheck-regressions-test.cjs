/** Regression checks introduced after consolidated Batch 7 dead-end / duplicate audit. */
const assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),ts=require('typescript');
require.extensions['.ts']=(mod,file)=>mod._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{fileName:file,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText,file);
const {opsScheduleChangeIssues,opsDayClassification}=require('../lib/opsRestDays');
let count=0;const test=(title,run)=>{run();count++;console.log('PASS',title)};
const old={id:'UC MD|A|2026-10',branch:'UC Mandaluyong',employeeId:'A',month:'2026-10',offDates:['2026-10-05','2026-10-12'],status:'Published',version:2,updatedAt:'2026-10-01',updatedBy:'BM'};
const permit={id:'P1',employeeId:'A',branch:'UC Mandaluyong',date:'2026-10-05',reason:'Urgent job',hours:8,status:'Approved',requestedBy:'BM',createdAt:'2026-10-01'};
test('cannot remove scheduled OFF with approved permit',()=>assert.equal(opsScheduleChangeIssues(old,['2026-10-12'],[permit]).length,1));
test('cannot remove scheduled OFF with pending permit',()=>assert.equal(opsScheduleChangeIssues(old,['2026-10-12'],[{...permit,status:'Pending'}]).length,1));
test('rejected permit allows schedule correction',()=>assert.deepEqual(opsScheduleChangeIssues(old,['2026-10-12'],[{...permit,status:'Rejected'}]),[]));
test('unaffected OFF with permit allows other edits',()=>assert.deepEqual(opsScheduleChangeIssues(old,['2026-10-05','2026-10-19'],[permit]),[]));
test('must use approved permit for scheduled OFF classification',()=>assert.equal(opsDayClassification('A','2026-10-05',[old],[permit]).kind,'Approved Rest Day Work'));
const ui=fs.readFileSync(path.join(__dirname,'../components/OpsRestDayWorkspace.tsx'),'utf8');
test('OPS prior schedule snapshots are retained separately from active schedule',()=>{
 assert(ui.includes('OPS_SCHEDULE_HISTORY_KEY'));assert(ui.includes('archivedAt:new Date().toISOString()'));
 assert(ui.indexOf('localStorage.setItem(OPS_SCHEDULE_HISTORY_KEY')<ui.indexOf('localStorage.setItem(OPS_SCHEDULE_KEY')); 
});
const prob=fs.readFileSync(path.join(__dirname,'../components/ProbationaryAssessmentWorkspace.tsx'),'utf8');
test('probation BM UI filters actual assigned branch, never hard-coded branch',()=>{assert(prob.includes("role==='BM'?branch!=='All Shops'&&p.branch===branch"));assert(!prob.includes("p.branch==='UC Mandaluyong'"))});
console.log(`${count} recheck regression tests passed`);
