/* Focused checks for browser-only HRMS intake template store. */
const fs=require('fs'),path=require('path'),vm=require('vm'),ts=require('typescript'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'../lib/intakeForms.ts'),'utf8');
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const data=new Map();const listeners={};const localStorage={getItem:(key)=>data.get(key)||null,setItem:(key,val)=>data.set(key,String(val))};
class Ev{constructor(type){this.type=type}}
const window={localStorage,dispatchEvent:(e)=>((listeners[e.type]||[]).forEach(fn=>fn(e))),addEventListener:(k,fn)=>{(listeners[k]||(listeners[k]=[])).push(fn)}};
const c={module:{exports:{}},exports:{},window,localStorage,Event:Ev,crypto:require('crypto').webcrypto,Date,Math,console};c.exports=c.module.exports;vm.runInNewContext(code,c);const m=c.module.exports;
assert.equal(m.readIntakeForms().length,2);assert.equal(m.readIntakeForms().filter(f=>f.system).length,2);
const app=m.readIntakeForms().find(x=>x.id==='application');assert.equal(app.status,'Published');
app.fields=[{id:'extra-preference',label:'Preferred shift',type:'select',required:true,options:['Morning','Evening']}];
assert.equal(m.validateIntakeFields(app.fields,{'extra-preference':'Morning'}).length,0);
assert.equal(m.validateIntakeFields(app.fields,{'extra-preference':''}).length,1);
assert.equal(m.validateIntakeFields(app.fields,{'extra-preference':'Not listed'}).length,1);
assert.equal(m.saveIntakeForms([app]),true);
assert.equal(m.readIntakeExtensions('application').length,1);
assert.equal(m.readIntakeExtensions('incident').length,0);
assert.equal(m.readIntakeExtensions('request','Employee Document Request').length,0);
const request={id:'custom-doc',title:'COE extras',description:'',target:'request',requestKind:'Employee Document Request',status:'Published',audience:'employee',version:1,createdAt:'x',updatedAt:'x',fields:[{id:'purpose-more',label:'Requested format',type:'short',required:false,options:[]}]};
assert.equal(m.saveIntakeForms([app,request]),true);assert.equal(m.readIntakeExtensions('request','Employee Document Request').length,1);assert.equal(m.readIntakeExtensions('request','Overtime Authorization').length,0);
const custom={...request,id:'custom',target:'custom',title:'Employee feedback',requestKind:undefined};assert.equal(m.saveIntakeForms([app,request,custom]),true);assert.equal(m.readIntakeForms().length,4);
const response={id:'INTAKE-1',formId:custom.id,formTitle:custom.title,formVersion:1,receivedAt:new Date().toISOString(),values:{'purpose-more':'Feedback'},fieldLabels:{'purpose-more':'Requested format'},status:'New'};assert.equal(m.saveIntakeResponses([response]),true);assert.equal(m.readIntakeResponses().length,1);
assert.equal(m.validateIntakeForm({...custom,fields:[{id:'a',label:'Bad',type:'select',required:true,options:['onlyone']}]}).length,1);
console.log('PASS intake forms: seeded routes, schema checks, publish + field mapping, local response history, unsafe option rejection');
