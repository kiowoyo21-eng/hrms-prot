const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');const ts=require('typescript');
const root=path.resolve(__dirname,'..');
function load(file,requireFn){const code=ts.transpileModule(fs.readFileSync(path.join(root,file),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;const mod={exports:{}};vm.runInNewContext(code,{module:mod,exports:mod.exports,require:requireFn,Date,Math,console}, {filename:file});return mod.exports;}
const view=load('lib/intakeResponseView.ts',()=>({}));
const responses=[
 {id:'r2',formId:'sample',receivedAt:'2026-10-23T07:01:00Z',formVersion:2,status:'Reviewed',fieldLabels:{q1:'Answer',q2:'Answer'},values:{q1:'=SUM(1,2)',q2:'Beta'}},
 {id:'r1',formId:'sample',receivedAt:'2026-10-23T07:02:00Z',formVersion:1,status:'New',fieldLabels:{old:'Old'},values:{old:'+HYPERLINK("x")'}},
 {id:'r3',formId:'other',receivedAt:'2026-10-24T07:01:00Z',formVersion:1,status:'New',fieldLabels:{q:'Test'},values:{q:'Test'}}
];
assert.deepEqual(Array.from(view.filterLocalResponses(responses,'sample')).map(x=>x.id),['r1','r2']);
assert.deepEqual(Array.from(view.filterLocalResponses(responses,'sample','beta')).map(x=>x.id),['r2']);
assert.deepEqual(Array.from(view.filterLocalResponses(responses,'sample','answer')).map(x=>x.id),['r2']);
assert.deepEqual(Array.from(view.filterLocalResponses(responses,'sample','','New')).map(x=>x.id),['r1']);
assert.equal(view.localResponseCounts(responses,'sample').total,2);
assert.equal(view.localResponseCounts(responses,'sample').new,1);
assert.equal(view.localResponseCounts(responses,'sample').reviewed,1);
assert.equal(view.pageLocalResponses(responses,99,1).page,3);
assert.equal(view.pageLocalResponses(responses,2,1).rows[0].id,'r1');
const selected=view.filterLocalResponses(responses,'sample','','Reviewed');
const csv=view.exportLocalResponseCsv(selected);
assert.match(csv,/\[q1\]/);
assert.match(csv,/\[q2\]/);
assert.match(csv,/'=SUM/);
assert.ok(!csv.includes('r1'));
assert.match(view.exportLocalResponseCsv(view.filterLocalResponses(responses,'sample')),/\[old\]/);
assert.ok(view.exportLocalResponseCsv(view.filterLocalResponses(responses,'sample')).includes("'+HYPERLINK"));
const ui=fs.readFileSync(path.join(root,'components/intake/FormBuilderWorkspace.tsx'),'utf8');
for(const token of ['responseStatus','responseSearch','responseDetail','intake-response-pagination','exportLocalResponseCsv','Local Test Responses','setResponseDetail(r.id)']) assert.ok(ui.includes(token),token);
assert.ok(!ui.includes('responses.filter(r=>r.formId===answersFor).map(r=><article')); // previous full inline list removed
console.log('PASS Patch 20: response selection/filters/sort, version-safe CSV, formula escaping, paged local review and modal detail UI');
