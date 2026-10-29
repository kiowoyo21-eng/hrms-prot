/* Source-level and isolated workflow test: no browser/network required. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const ts=require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript');
const base=path.join(__dirname,'..');
require.extensions['.ts']=(module,filename)=>{
 const src=fs.readFileSync(filename,'utf8');
 const result=ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}});
 module._compile(result.outputText,filename);
};
const routing=require('../lib/requestRouting.ts');
const forms=require('../lib/hrForms.ts');
const b='UC Mandaluyong',now='2026-10-29T08:00:00Z';
const a=routing.DEFAULT_REVIEWERS;
let checks=0;
function test(name,fn){try{fn();checks++;console.log('PASS',name)}catch(err){console.error('FAIL',name);throw err}}
const record=(route,status='Submitted')=>({id:'HFORM-TEST-1',kind:'Overtime Authorization',branch:b,employeeId:'UC-0001',requestor:'employee:UC-0001',createdAt:now,updatedAt:now,status,route,fields:{workDate:'2026-10-29',start:'08:00',end:'09:00',reason:'Approved service coverage',supervisor:'UC-0002'},evidenceRefs:'',remarks:'',history:[{at:now,actor:'employee:UC-0001',status:'Draft',action:'Created'}]});
test('Operations BM receives assigned branch',()=>{const r=routing.chooseRequestReviewer('Operations',b,a,now,'Overtime Authorization');assert.equal(r.approverUsername,'bmaccount')});
test('OPS aliases resolve BM',()=>assert.equal(routing.chooseRequestReviewer('OPS',b,a,now)?.approverRole,'BM'));
test('Marketing gets department head',()=>assert.equal(routing.chooseRequestReviewer('Marketing',b,a,now)?.approverUsername,'marketinghead'));
test('PM alias gets configured department head',()=>assert.equal(routing.chooseRequestReviewer('PM',b,a,now)?.approverUsername,'pmhead'));
test('Unassigned branch OPS falls back to HR',()=>assert.equal(routing.chooseRequestReviewer('Operations','UC Las Piñas',a,now)?.approverUsername,'hraccount'));
test('Grave incident routes to HR even when OPS',()=>assert.equal(routing.chooseRequestReviewer('Operations',b,a,now,'Incident Statement').approverRole,'HR'));
test('Grievance routes to HR only',()=>assert.equal(routing.chooseRequestReviewer('Marketing',b,a,now,'Workplace Dispute / Grievance').approverRole,'HR'));
test('Maker cannot be their own route reviewer',()=>{const route=routing.chooseRequestReviewer('Unknown Department',b,a,now,'Attendance Correction','hraccount');assert.equal(route.approverUsername,'hrreviewer')});
test('Head filing own department request routes to HR fallback',()=>{const route=routing.chooseRequestReviewer('Marketing',b,a,now,'Overtime Authorization','marketinghead');assert.equal(route.approverRole,'HR')});
test('No active reviewer means no silent approval route',()=>assert.equal(routing.chooseRequestReviewer('Marketing',b,[],now),null));
const r=record(routing.chooseRequestReviewer('Operations',b,a,now));
test('BM branch-scoped can see assigned request',()=>assert.equal(forms.canViewForm(r,'bmaccount','BM',b),true));
test('BM cannot see another branch',()=>assert.equal(forms.canViewForm(r,'bmaccount','BM','UC Las Piñas'),false));
test('Unassigned BM cannot view',()=>assert.equal(forms.canViewForm(r,'another-bm','BM',b),false));
test('Other department head cannot view',()=>assert.equal(forms.canViewForm(r,'marketinghead','Dept Head',b),false));
test('Only exact account and role can approve',()=>{assert.equal(forms.canReviewForm(r,'bmaccount','BM'),true);assert.equal(forms.canReviewForm(r,'bmaccount','Dept Head'),false);assert.equal(forms.canReviewForm(r,'hraccount','HR'),false)});
test('Self-approval disallowed',()=>{const own={...r,requestor:'bmaccount'};assert.equal(forms.canReviewForm(own,'bmaccount','BM'),false)});
test('Request Documents requires remarks',()=>assert.throws(()=>forms.transitionForm(r,'Request Documents','bmaccount','BM','',now)));
test('Request Documents records same id and audit history',()=>{const next=forms.transitionForm(r,'Request Documents','bmaccount','BM','Please upload medical clearance',now);assert.equal(next.id,r.id);assert.equal(next.status,'For Additional Documents');assert.equal(next.history.length,r.history.length+1);assert.equal(next.reviewedBy,'bmaccount')});
test('Returned requestor may resubmit same record',()=>{const requested=forms.transitionForm(r,'Request Documents','bmaccount','BM','Medical clearance',now);const next=forms.transitionForm(requested,'Submit',requested.requestor,'HR','',now);assert.equal(next.id,requested.id);assert.equal(next.status,'Submitted');assert.equal(next.route.approverUsername,'bmaccount')});
test('Approved request cannot be reviewed twice',()=>{const next=forms.transitionForm(r,'Approve','bmaccount','BM','Checked',now);assert.equal(next.status,'Approved (Documentation Only)');assert.equal(forms.canReviewForm(next,'bmaccount','BM'),false)});
test('Legacy HR review retained',()=>assert.equal(forms.canReviewForm(record(undefined),'hraccount','HR'),true));
test('No editor may approve unassigned legacy as BM',()=>assert.equal(forms.canReviewForm(record(undefined),'bmaccount','BM'),false));
test('BM branch list respects assigned accounts',()=>assert.deepEqual(routing.branchesForBM('bmaccount',a),[b]));
for(const file of ['components/RequestReviewDetail.tsx','components/formPrint/InlineRequestForm.tsx','components/RequestRoutingSettings.tsx','components/EmployeeRequestHistoryPanel.tsx','components/GlobalHRSearch.tsx','components/HRFormsRequestsWorkspace.tsx','app/page.tsx']){
 assert.ok(fs.existsSync(path.join(base,file)),`Missing ${file}`);
}
test('Unified form viewer and action controls present',()=>{const s=fs.readFileSync(path.join(base,'components/RequestReviewDetail.tsx'),'utf8');for(const v of ['InlineRequestForm','Supporting Documents','Request Documents','Request History','Approve Documentation','Decline','onAttachment'])assert.ok(s.includes(v),v)});
test('Existing form UI uses same detail component',()=>assert.ok(fs.readFileSync(path.join(base,'components/HRFormsRequestsWorkspace.tsx'),'utf8').includes('<RequestReviewDetail')));
console.log(`PASS ${checks} CRM-inspired workflow checks`);
