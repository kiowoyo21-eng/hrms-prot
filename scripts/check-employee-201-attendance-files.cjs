const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ts=require('typescript');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,filename);
const root=path.resolve(__dirname,'..');
const store=new Map();
global.localStorage={getItem:key=>store.get(key)||null,setItem:(key,value)=>store.set(key,value)};
let updates=[];
global.window={dispatchEvent:e=>updates.push(e.type)};
const {attendanceCategories,attendanceCategoryForRequest,readEmployeeAttendanceDocuments}=require(path.join(root,'lib/attendanceDocumentIndex.ts'));
const {saveHRFormFile,HR_FORM_EVIDENCE_EVENT}=require(path.join(root,'lib/hrFormEvidence.ts'));
const {attachOpsPermitFile}=require(path.join(root,'lib/opsPermitEvidence.ts'));
const {FORM_STORE_KEY}=require(path.join(root,'lib/hrForms.ts'));
const {OPS_PERMIT_KEY}=require(path.join(root,'lib/opsRestDays.ts'));
for(const k of ['Overtime','Work Permit / RDW','Half Day','Leave','Absence','Attendance Correction','Other'])assert(attendanceCategories.includes(k));
assert.equal(attendanceCategoryForRequest('Overtime Authorization'),'Overtime');
assert.equal(attendanceCategoryForRequest('Work Permit / Work Authorization'),'Work Permit / RDW');
assert.equal(attendanceCategoryForRequest('Leave Documentation'),'Leave');
assert.equal(attendanceCategoryForRequest('Leave Documentation',{reason:'Half day for appointment'}),'Half Day');
assert.equal(attendanceCategoryForRequest('Return-to-Work Clearance'),'Absence');
assert.equal(attendanceCategoryForRequest('Attendance Correction',{issue:'Half day timecard error'}),'Half Day');
assert.equal(attendanceCategoryForRequest('Attendance Correction'),'Attendance Correction');
assert.equal(attendanceCategoryForRequest('Asset Clearance'),null);
const f=(name)=>({name,size:900,type:'application/pdf'});
const r=(id,emp,kind,attachment='A1',status='Verified',branch='UC Mandaluyong')=>({id,employeeId:emp,branch,requestor:'employee',kind,fields:{workDate:'2026-10-27'},history:[],attachments:[{id:attachment,name:`${id}.pdf`,status}]});
store.set(FORM_STORE_KEY,JSON.stringify([
 r('HR-OT-1','UC-001','Overtime Authorization'),
 r('HR-LEAVE-1','UC-001','Leave Documentation','A2','Pending Verification'),
 r('HR-OTHER-1','UC-001','Asset Clearance','A3'),
 r('HR-OT-2','UC-002','Overtime Authorization','A4'),
 r('HR-OT-WRONG-BRANCH','UC-001','Overtime Authorization','A5','Verified','UC Las Piñas'),
 r('HR-UNATTACHED','UC-001','Overtime Authorization','A6'),
]));
saveHRFormFile('HR-OT-1','A1',f('ot.pdf'));
saveHRFormFile('HR-LEAVE-1','A2',f('leave.pdf'));
saveHRFormFile('HR-OTHER-1','A3',f('irrelevant.pdf'));
saveHRFormFile('HR-OT-2','A4',f('someoneelse.pdf'));
saveHRFormFile('HR-OT-WRONG-BRANCH','A5',f('wrongbranch.pdf'));
assert(updates.includes(HR_FORM_EVIDENCE_EVENT),'Source attachment updates must notify Employee 201');
store.set(OPS_PERMIT_KEY,JSON.stringify([
 {id:'PERMIT-1',employeeId:'UC-001',branch:'UC Mandaluyong',date:'2026-10-29',status:'Approved',reviewedBy:'BM Anna',attachmentName:'rdw.pdf'},
 {id:'PERMIT-NO-BYTES',employeeId:'UC-001',branch:'UC Mandaluyong',date:'2026-10-30',status:'Approved',attachmentName:'fake.pdf'},
 {id:'PERMIT-OTHER',employeeId:'UC-002',branch:'UC Mandaluyong',date:'2026-10-31',status:'Approved',attachmentName:'other.pdf'},
]));
attachOpsPermitFile('PERMIT-1',f('rdw.pdf'));
let docs=readEmployeeAttendanceDocuments('UC-001');
assert.equal(docs.length,4,'Three request files including prior branch and one actual RDW permit file');
assert.deepEqual(docs.map(x=>x.reference).sort(),['HR-LEAVE-1','HR-OT-1','HR-OT-WRONG-BRANCH','PERMIT-1']);
assert.equal(docs.find(x=>x.reference==='PERMIT-1').reviewedBy,'BM Anna');
assert.equal(docs.find(x=>x.reference==='HR-LEAVE-1').status.startsWith('Pending Verification'),true);
assert.equal(docs.find(x=>x.reference==='PERMIT-1').category,'Work Permit / RDW');
assert.equal(docs.find(x=>x.reference==='HR-OT-WRONG-BRANCH').branch,'UC Las Piñas','Preserve prior branch information');
assert.equal(readEmployeeAttendanceDocuments('UC-002').length,1);
const ui=fs.readFileSync(path.join(root,'components/EmployeeDocumentLibrary.tsx'),'utf8');
assert(ui.includes('Attendance & Work Requests')&&ui.includes('attendanceCategories.map'));
assert(ui.includes('RequestedMemo')===false);
console.log('PASS: Employee 201 attendance folder, categories, request/permit file linking, employee isolation, branch history, verification labels, missing evidence protection');
