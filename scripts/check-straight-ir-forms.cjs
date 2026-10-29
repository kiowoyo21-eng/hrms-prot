/** Validates the continuous print forms and incident report document wiring (no backend data). */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const ts=require('typescript');
const root=path.resolve(__dirname,'..');
const source=(s)=>fs.readFileSync(path.join(root,s),'utf8');
const existing=fs.readdirSync(path.join(root,'components/formPrint/templates')).filter(n=>n.endsWith('.tsx'));
assert.equal(existing.length,18,'17 existing printable forms + 1 dedicated Incident Report');
for(const file of [...existing.map(s=>`components/formPrint/templates/${s}`),'components/formPrint/GenericHRRequestForm.tsx']) {
 const contents=source(file);
 assert.doesNotMatch(contents,/<Section\s+title="[A-Z]\s*[·:.)-]/,`${file} contains an A/B/C section heading`);
}
const registry=source('components/formPrint/registry.tsx');
assert.match(registry,/"incident-report":IncidentReportForm/);
assert.match(source('components/formPrint/types.ts'),/"incident-report"/);
const workspace=source('components/IncidentWorkspace.tsx');
assert.match(workspace,/<IncidentReportForm data=\{incidentReportPrintData\(current\)\}/,'Case view must use the real IR document');
assert.match(workspace,/<IncidentReportPrintPreview record=\{current\}/,'Case print must use the exact current IR case');
assert.doesNotMatch(workspace,/printHRDocument\("Incident Case Summary"/,'Legacy text-only printer must be removed');
assert.match(workspace,/<Paper data=\{\{company:/,'IR submission must use document layout');
assert.match(workspace,/current\.handler==="BM"/,'Keep existing BM/HR routing controls');
assert.match(workspace,/incidentLinksVerifiedInBranch/,'Keep guarded identity validation');
assert.match(workspace,/!manager&&\["Final Decision","Closure Summary"\]/,'Keep HR-only decision controls');
const files=[...existing.map(x=>`components/formPrint/templates/${x}`),'components/formPrint/incidentReportData.ts','components/IncidentReportPrintPreview.tsx','components/IncidentWorkspace.tsx','components/formPrint/registry.tsx','components/formPrint/Paper.tsx','components/formPrint/types.ts'];
for(const file of files){
 const contents=source(file),ast=ts.createSourceFile(file,contents,ts.ScriptTarget.Latest,true,file.endsWith('.tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
 assert.equal(ast.parseDiagnostics.length,0,`${file} JSX/TS syntax error: ${ast.parseDiagnostics.map(x=>x.messageText).join(',')}`);
 const imports=ts.preProcessFile(contents,true,true).importedFiles;
 for(const {fileName} of imports){if(!fileName.startsWith('.'))continue;
 const b=path.resolve(root,path.dirname(file),fileName);
 assert.ok([b,b+'.ts',b+'.tsx',b+'.css',path.join(b,'index.ts'),path.join(b,'index.tsx')].some(fs.existsSync),`${file}: missing ${fileName}`);
 }
}
// Verify the case-to-print adapter doesn't embed sensitive internal HR notes in the IR document.
const isolated=source('components/formPrint/incidentReportData.ts');
const mod={exports:{}};
const js=ts.transpileModule(isolated,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
new Function('exports','module','require',js)(mod.exports,mod,()=>{throw Error('Only type imports expected')});
for(const [branch,company] of [['UC Mandaluyong','UC'],['MM Mandaluyong','MM']]) {
 const doc=mod.exports.incidentReportPrintData({id:'IR-2026-X',branch,respondent:'Employee A',reporter:'Employee B',reporterEmployeeId:'E-B',respondentEmployeeId:'E-A',incidentDate:'2026-10-27',category:'Lateness',summary:'Late arrival',description:'Reported late arrival',handler:'HR',stage:'Initial Review',priority:'Normal',notes:'private HR assessment',attachments:[{name:'evidence.pdf',category:'Evidence',addedAt:'2026-10-27'}]});
 assert.equal(doc.company,company);
 assert.equal(doc.reference,'IR-2026-X');
 assert.equal(doc.values.reporter,'Employee B');
 assert.equal(doc.values.narrative,'Reported late arrival');
 assert.match(doc.values.attachments,/evidence.pdf/);
 assert.doesNotMatch(JSON.stringify(doc),/private HR assessment/);
}
console.log(`PASS: 18 print templates, uninterrupted section headings, case-integrated IR document, permissions guards, 2 UC/MM data scenarios, ${files.length} TS/TSX source parses`);
