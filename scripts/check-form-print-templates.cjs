/** Offline syntax, source-catalog linkage and stable workflow checks for HR form printing. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const templateDir = path.join(root, 'components/formPrint/templates');
const files = [
 ...fs.readdirSync(templateDir).filter(x => x.endsWith('.tsx')).map(x => path.join(templateDir, x)),
 ...['Paper.tsx','FormPrintPreview.tsx','GenericHRRequestForm.tsx','registry.tsx','types.ts'].map(x => path.join(root,'components/formPrint',x)),
 path.join(root,'app/print-forms/[id]/page.tsx'),
 path.join(root,'app/studio/source-forms/page.tsx'),
 path.join(root,'components/HRFormsRequestsWorkspace.tsx'),
];
function source(file) {return fs.readFileSync(file,'utf8')}
for(const file of files) {
 const result = ts.transpileModule(source(file), {fileName:file,reportDiagnostics:true, compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.Preserve}});
 const errors=(result.diagnostics||[]).filter(x=>x.category===ts.DiagnosticCategory.Error);
 assert.equal(errors.length,0,`${path.relative(root,file)}: ${errors.map(x=>ts.flattenDiagnosticMessageText(x.messageText,' ')).join('; ')}`);
 const info = ts.preProcessFile(source(file), true, true);
 for(const imported of info.importedFiles) {
  if(!imported.fileName.startsWith('.'))continue;
  const base = path.resolve(path.dirname(file), imported.fileName);
  assert.ok([base,base+'.ts',base+'.tsx',base+'.css',path.join(base,'index.ts'),path.join(base,'index.tsx')].some(fs.existsSync),`Unresolved relative import ${imported.fileName} in ${file}`);
 }
}
const catalog = source(path.join(root,'lib/studio/sourceFormsCatalog.ts'));
const registry=source(path.join(root,'components/formPrint/registry.tsx'));
const ids=['probation-standards','preemployment-checklist','statutory-contributions','nda','leave','halfday','overtime','workpermit','asset-accountability','factfinding','nte-nov','resolution-nod','policies-safety'];
const onboarding=['employee-information','job-offer','employment-contract','orientation-acknowledgment'];
for (const id of ids) {assert.ok(catalog.includes(`source("${id}"`),`Catalog id missing ${id}`);assert.ok(registry.includes(`"${id}":`),`Printable id missing ${id}`)}
for(const id of onboarding) assert.ok(registry.includes(`"${id}":`),`Onboarding id missing ${id}`);
assert.equal(fs.readdirSync(templateDir).filter(x=>x.endsWith('.tsx')).length,17,'Each source/onboarding template has an independent TSX component');
const paper=source(path.join(root,'components/formPrint/Paper.tsx'));
assert.ok(paper.includes('Blank signature line'),'Signature placeholders must not pretend to be signed');
const preview=source(path.join(root,'components/formPrint/FormPrintPreview.tsx'));
assert.ok(preview.includes('createPortal')&&preview.includes('window.print()'),'Request preview must print without new approval record');
assert.ok(!registry.includes('"Schedule Change":"halfday"'),'Schedule changes must not be mislabeled as Half-Day');
assert.ok(!registry.includes('"Attendance Correction":"halfday"'),'General attendance corrections must not be mislabeled as Half-Day');
assert.ok(!registry.includes('"Work Permit / Work Authorization":"workpermit"'),'Documentation-only forms must not masquerade as operational RDW permits');
for (const [company,filename] of [['UC','underchargers.png'],['MM','mastermind.png']]) {
 const image=fs.readFileSync(path.join(root,'public/hr-form-logos',filename));
 assert.ok(image.byteLength>10000&&image.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex')),`Invalid ${company} logo`);
}
const css=source(path.join(root,'components/formPrint/printForms.css'));
assert.ok(css.includes('@page{size:A4 portrait')&&css.includes('print-color-adjust'),'A4 print styles missing');
console.log(`PASS: ${files.length} TypeScript/TSX source files, 17 individual forms, 13 catalog mappings, company logos, routes, printer and permissions-preserving linkage`);
