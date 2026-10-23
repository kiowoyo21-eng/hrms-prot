/* Focused Form Builder sections / conditional responses regression (browser-local only). */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript');
const root=path.join(__dirname,'..');
function evaluate(file,requireFn){const code=ts.transpileModule(fs.readFileSync(path.join(root,file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const module={exports:{}};const context={module,exports:module.exports,require:requireFn,CompressionStream,DecompressionStream,Blob,Response,TextEncoder,TextDecoder,Uint8Array,URL,atob,btoa,console,Date,Math};vm.runInNewContext(code,context,{filename:file});return module.exports;}
const forms=evaluate('lib/intakeForms.ts',()=>{throw Error('unexpected require')});
const shared=evaluate('lib/shareIntake.ts',p=>{assert.equal(p,'./intakeForms');return forms});
const radio={id:'q-kind',label:'Type of request',type:'radio',required:true,options:['Replacement','Other'],section:'Request'};
const details={id:'q-extra',label:'Replacement reason',type:'paragraph',required:true,options:[],section:'Reason',showIf:{fieldId:'q-kind',equals:'Replacement'}};
const name={id:'q-name',label:'Test name',type:'short',required:false,options:[],section:'Request'};
const fieldset=[name,radio,details];
const sample={id:'local-19',title:'Asset request',description:'Testing',target:'custom',audience:'employee',status:'Published',version:3,createdAt:'',updatedAt:'',fields:fieldset};
assert.equal(forms.validateIntakeForm(sample).length,0);
assert.equal(forms.activeIntakeFields(fieldset,{'q-kind':'Other'}).length,2);
assert.equal(forms.validateIntakeFields(fieldset,{'q-kind':'Other'}).length,0);
assert.deepEqual(Object.keys(forms.cleanIntakeValues(fieldset,{'q-kind':'Other','q-extra':'old hidden answer'})).sort(),['q-kind']);
assert.equal(forms.validateIntakeFields(fieldset,{'q-kind':'Replacement'}).length,1);
assert.equal(forms.validateIntakeFields(fieldset,{'q-kind':'Replacement','q-extra':'not working'}).length,0);
assert.equal(forms.groupIntakeSections(forms.activeIntakeFields(fieldset,{'q-kind':'Replacement'})).length,2);
assert.ok(forms.validateIntakeForm({...sample,fields:[details,radio]}).length);
assert.ok(forms.validateIntakeForm({...sample,fields:[radio,{...details,showIf:{fieldId:'q-kind',equals:'Bad option'}}]}).length);
assert.ok(forms.validateIntakeForm({...sample,fields:[{...radio,showIf:{fieldId:'q-extra',equals:'Other'}},details]}).length);
(async()=>{const url=await shared.createPortableLink(sample,'https://hr.example.org');const token=new URL(url).searchParams.get('s');const read=await shared.parsePortableLink(token,sample.id);assert.equal(read.fields[2].section,'Reason');assert.equal(read.fields[2].showIf.equals,'Replacement');assert.equal(read.fields[2].showIf.fieldId,'q-kind');assert.equal(forms.validateIntakeFields(read.fields,{'q-kind':'Other'}).length,0);
// Legacy v1 portable preview remains supported.
const old=[1,sample.id,sample.title,sample.description,3,[['legacy','Old question','short',0,[],'']]];
const bytes=new TextEncoder().encode(JSON.stringify(old));const stream=new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate'));const zipped=new Uint8Array(await new Response(stream).arrayBuffer());const legacyToken=Buffer.from(zipped).toString('base64url');const historic=await shared.parsePortableLink(legacyToken,sample.id);assert.equal(historic.fields[0].label,'Old question');assert.equal(historic.fields[0].showIf,undefined);
for(const f of ['components/intake/FormBuilderWorkspace.tsx','components/intake/IntakeQuestions.tsx','app/intake/[id]/page.tsx']){const contents=fs.readFileSync(path.join(root,f),'utf8');assert.ok(contents.includes('section')||contents.includes('Section'));}
console.log('PASS Patch 19: conditional visibility/validation, hidden-answer cleansing, section grouping, portable link V2 and V1 compatibility');})().catch(e=>{console.error(e);process.exitCode=1});
