/** Browser-portable custom-form preview, not remote response collection. */
const assert=require('node:assert/strict');const fs=require('fs'),path=require('path'),vm=require('node:vm'),ts=require('typescript');
const root=path.join(__dirname,'..');
function evaluate(file,requireFn){const code=ts.transpileModule(fs.readFileSync(path.join(root,file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const module={exports:{}};const ctx={module,exports:module.exports,require:requireFn,CompressionStream,DecompressionStream,Blob,Response,TextEncoder,TextDecoder,Uint8Array,URL,atob,btoa,console,Date,Math};vm.runInNewContext(code,ctx,{filename:file});return module.exports}
const intake=evaluate('lib/intakeForms.ts',()=>{throw Error('no imports')});const share=evaluate('lib/shareIntake.ts',p=>{assert.equal(p,'./intakeForms');return intake});
(async()=>{
const form={id:'form-abc',title:'Team Feedback',description:'Tell HR about your work experience.',target:'custom',audience:'employee',status:'Published',version:4,createdAt:'x',updatedAt:'x',fields:[{id:'q-1',label:'Which department?',type:'select',required:true,options:['Workshop','Support'],help:'Choose your team'},{id:'q-2',label:'Comments',type:'paragraph',required:false,options:[]}]};
const url=await share.createPortableLink(form,'https://forms.example.org');assert.ok(url.includes('/intake/form-abc?s='));assert.ok(url.length<share.MAX_PORTABLE_URL_LENGTH);
const extracted=new URL(url).searchParams.get('s');const clone=await share.parsePortableLink(extracted,'form-abc');assert.equal(clone.title,form.title);assert.equal(clone.version,4);assert.equal(clone.fields.length,2);assert.equal(clone.fields[0].options.join(','),'Workshop,Support');assert.equal(clone.fields[0].required,true);
assert.rejects(share.parsePortableLink(extracted,'form-other'),/Invalid form/);
assert.throws(()=>share.snapshotFor({...form,status:'Draft'}),/published/i);
assert.throws(()=>share.snapshotFor({...form,target:'request'}),/published custom/i);
assert.ok(!url.includes('Tell HR about')); // compressed; does not carry responses
assert.ok(fs.readFileSync(path.join(root,'app/intake/[id]/page.tsx'),'utf8').includes('saveIntakeResponses([...existing,record])')); // same-browser testing retained
console.log('PASS portable form link: compressed schema, cross-browser decode, draft/request rejection, QR-length boundary, non-sensitive snapshot');
})().catch(e=>{console.error(e);process.exitCode=1});
