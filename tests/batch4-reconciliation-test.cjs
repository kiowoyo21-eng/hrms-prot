/* Dependency-free test harness: compiles isolated TS logic; no React installation needed. */
const fs=require('fs'),ts=require('typescript'),vm=require('vm'),assert=require('assert');
function moduleOf(file,mocks={}){
 const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS}}).outputText;
 const exports={};vm.runInNewContext(`(function(require,exports){${code}\n})`,{})(id=>{if(!(id in mocks))throw Error(`Missing test dependency ${id} for ${file}`);return mocks[id]},exports);return exports;
}
const dateOnly=moduleOf('lib/dateOnly.ts');
const money={roundMoney:n=>Math.round((n+Number.EPSILON)*100)/100};
const x=moduleOf('lib/thirteenthSettlement.ts',{'./payrollConfig':money,'./leavePolicy':{companyManager:p=>p.jobLevel==='Managerial'||/\b(manager|general manager|branch manager)\b/i.test(p.position||'')},'./dateOnly':dateOnly});
const fp=moduleOf('lib/finalPayReview.ts',{'./employeeLifecycle':{outstandingCustody:()=>[]},'./thirteenthSettlement':x});
const employee={id:'E-001',name:'Test Employee',branch:'UC Mandaluyong',status:'Clearance Pending',hire:'2026-01-01'};
const payslip=(id,from,to,basic)=>({id:`D-${id}`,employeeId:employee.id,periodStart:from,periodEnd:to,status:'Released (Demo)',releasedId:id,basicPay:basic});
const release=(id,from,to,gross,kind='Salary')=>({id,employeeId:employee.id,kind,status:'Released',source:'Browser Review',periodStart:from,periodEnd:to,paidAt:to,gross});
const s={people:[employee],payrollConfig:{payslipDrafts:[payslip('P1','2026-01-01','2026-01-07',10000),payslip('P2','2026-01-08','2026-01-14',12000)]},payrollReleases:[release('P1','2026-01-01','2026-01-07',10500),release('P2','2026-01-08','2026-01-14',12700),release('13A','2026-01-01','2026-01-07',200,'13th-Month Pay')],lifecycleCases:[{id:'O1',employeeId:employee.id,action:'Offboard',status:'Applied (Demo)',sourceBranch:employee.branch,effectiveDate:'2026-01-14'}],finalPayCases:[]};
let total=0;function test(name,fn){fn();console.log('PASS',name);total++}
test('verified per-cutoff salary basic, not gross',()=>{const r=x.reconciliationForEmployee(s,employee,2026,'2026-01-14');assert.equal(r.eligibleBasic,22000);assert.equal(r.grossEntitlement,1833.33);assert.equal(r.alreadyPaid,200);assert.equal(r.outstanding,1633.33);assert.equal(r.complete,true)});
test('unknown salary periods block approval',()=>{const r=x.reconciliationForEmployee(s,employee,2026,'2026-01-15');assert(!r.complete&&r.issues.some(i=>i.includes('2026-01-15')))});
test('verified unpaid late/undertime is excluded from 13th-month basic salary',()=>{const y=structuredClone(s);y.payrollConfig.payslipDrafts[0].lateDeduction=100;const result=x.reconciliationForEmployee(y,employee,2026,'2026-01-14');assert.equal(result.eligibleBasic,21900);assert.equal(result.grossEntitlement,1825)});
test('negative or excessive late reductions hold 13th-month reconciliation',()=>{const y=structuredClone(s);y.payrollConfig.payslipDrafts[0].lateDeduction=999999;const result=x.reconciliationForEmployee(y,employee,2026,'2026-01-14');assert.equal(result.complete,false);assert(result.issues.some(i=>i.includes('invalid late/undertime')))});
test('salary increase reflected by actual released periods',()=>{assert.equal(x.reconciliationForEmployee(s,employee,2026,'2026-01-14').cutoffs[1].basic,12000)});
test('overlap on released salary is blocked',()=>{const y=structuredClone(s);y.payrollReleases.push(release('P3','2026-01-07','2026-01-08',200));y.payrollConfig.payslipDrafts.push(payslip('P3','2026-01-07','2026-01-08',180));assert(x.reconciliationForEmployee(y,employee,2026,'2026-01-14').issues.some(i=>i.includes('Overlapping')))});
test('missing released-payslip basic snapshot is blocked',()=>{const y=structuredClone(s);y.payrollConfig.payslipDrafts.pop();assert(!x.reconciliationForEmployee(y,employee,2026,'2026-01-14').complete)});
test('gross basic mismatch blocked',()=>{const y=structuredClone(s);y.payrollConfig.payslipDrafts[0].basicPay=999999;assert(!x.reconciliationForEmployee(y,employee,2026,'2026-01-14').complete)});
test('sample salary releases not treated as verified',()=>{const y=structuredClone(s);y.payrollReleases[0].source='Sample';assert(!x.reconciliationForEmployee(y,employee,2026,'2026-01-14').complete)});
test('previous 13th payments cannot exceed earned basis silently',()=>{const y=structuredClone(s);y.payrollReleases[y.payrollReleases.length-1].gross=3000;assert(x.reconciliationForEmployee(y,employee,2026,'2026-01-14').issues.some(i=>i.includes('exceeds')))});
test('30 calendar-day deadline month boundary and overdue',()=>{assert.equal(x.finalPayDeadline('2026-10-27'),'2026-11-26');assert.equal(x.finalPayDeadlineState('2026-10-27','2026-11-27',false).status,'Overdue')});
test('7 day / 3 day notifications classification',()=>{assert.equal(x.finalPayDeadlineState('2026-10-27','2026-11-20',false).status,'Due Soon');assert.equal(x.finalPayDeadlineState('2026-10-27','2026-11-23',false).status,'Urgent');assert.equal(x.finalPayDeadlineState('2026-10-27','2026-11-23',true).status,'Paid')});
test('create finalpay supplies reconciled amount automatically',()=>{const out=fp.createFinalPay(s,'O1','preparer','HR','2026-01-15T10:00:00Z','F1');assert(out.ok);assert.equal(out.record.amounts.thirteenthAdjustment,1633.33);s.finalPayCases=[out.record]});
test('stale 13th snapshot blocks handoff',()=>{const y=structuredClone(s);y.payrollReleases[1].gross=11000;assert(fp.finalPayBlockers(y,y.finalPayCases[0]).some(i=>i.includes('snapshot')||i.includes('changed')))});
test('manual 13th amount mismatch blocks handoff',()=>{const r=structuredClone(s.finalPayCases[0]);r.amounts.thirteenthAdjustment=100;assert(fp.finalPayBlockers(s,r).some(i=>i.includes('does not match')))});
test('maker-checker restriction remains in place',()=>{const y=structuredClone(s);const r={...y.finalPayCases[0],status:'For HR Review'};y.finalPayCases=[r];assert(!fp.transitionFinalPay(y,r,'Review','preparer','HR','2026-01-15T10:00:00Z','Audit ref 123').ok)});
test('actual external payment date rejects future entry',()=>{const r={...s.finalPayCases[0],status:'Accounting Handoff (Demo)'};assert(!fp.noteExternalPayment(r,'checker','HR','2026-01-20T10:00:00Z','Voucher 100001','2026-01-21').ok)});
test('actual payment date correctly stored, separate record timestamp',()=>{const r={...s.finalPayCases[0],status:'Accounting Handoff (Demo)'};const out=fp.noteExternalPayment(r,'checker','HR','2026-01-20T10:00:00Z','Voucher 100001','2026-01-19');assert(out.ok);assert.equal(out.record.paymentAt,'2026-01-19');assert.equal(out.record.paymentRecordedAt,'2026-01-20T10:00:00Z')});

// Additional independent ledger verification cases (run after base tests).
test('verified historical basic-pay ledger closes genuine historical gap',()=>{
 const y=structuredClone(s);y.payrollConfig.historicalBasicLedgers=[{id:'HB1',employeeId:employee.id,periodStart:'2026-01-15',periodEnd:'2026-01-21',eligibleBasic:7000,sourceReference:'Legacy-payroll-journal',status:'Verified',createdBy:'HR-A',verifiedBy:'HR-B'}];
 const r=x.reconciliationForEmployee(y,employee,2026,'2026-01-21');assert.equal(r.complete,true);assert.equal(r.eligibleBasic,29000);assert.equal(r.outstanding,2216.67);
});
test('pending historical basic-pay ledger is never treated as verified earnings',()=>{
 const y=structuredClone(s);y.payrollConfig.historicalBasicLedgers=[{id:'HB1',employeeId:employee.id,periodStart:'2026-01-15',periodEnd:'2026-01-21',eligibleBasic:7000,sourceReference:'Legacy-payroll-journal',status:'Pending Review',createdBy:'HR-A'}];
 const r=x.reconciliationForEmployee(y,employee,2026,'2026-01-21');assert(!r.complete);assert.equal(r.eligibleBasic,22000);
});
test('double-counted historical periods are blocked',()=>{
 const y=structuredClone(s);y.payrollConfig.historicalBasicLedgers=[{id:'HB2',employeeId:employee.id,periodStart:'2026-01-07',periodEnd:'2026-01-08',eligibleBasic:5000,sourceReference:'Legacy-payroll-journal',status:'Verified',createdBy:'HR-A',verifiedBy:'HR-B'}];
 const r=x.reconciliationForEmployee(y,employee,2026,'2026-01-14');assert(!r.complete);assert(r.issues.some(i=>i.includes('overlaps')));
});
test('managerial entitlement without approved company coverage is held',()=>{
 const manager={...employee,jobLevel:'Managerial',position:'Branch Manager'};
 const r=x.reconciliationForEmployee(s,manager,2026,'2026-01-14');assert(!r.complete);assert(r.issues.some(i=>i.includes('Managerial')));
});
test('managerial explicitly excluded from company entitlement is zero',()=>{
 const manager={...employee,jobLevel:'Managerial',position:'Branch Manager'};
 const y=structuredClone(s);y.payrollConfig.managerialThirteenthCoverage={[manager.id]:{covered:false,reviewedAt:'2026-01-01',reviewedBy:'HR A',notes:'Contract reference'}};
 // Prior 13th payments will still require a discrepancy review if marked excluded.
 const r=x.reconciliationForEmployee(y,manager,2026,'2026-01-14');assert.equal(r.outstanding,0);assert(!r.complete);
 y.payrollReleases=y.payrollReleases.filter(p=>p.kind!=='13th-Month Pay');const clean=x.reconciliationForEmployee(y,manager,2026,'2026-01-14');assert(clean.complete);assert.equal(clean.grossEntitlement,0);
});
test('managerial included by reviewed policy receives verified rate',()=>{
 const manager={...employee,jobLevel:'Managerial',position:'Branch Manager'};
 const y=structuredClone(s);y.payrollConfig.managerialThirteenthCoverage={[manager.id]:{covered:true,reviewedAt:'2026-01-01',reviewedBy:'HR A',notes:'Contract reference'}};
 const r=x.reconciliationForEmployee(y,manager,2026,'2026-01-14');assert(r.complete);assert.equal(r.grossEntitlement,1833.33);
});

test('duplicate prior 13th release IDs require reconciliation',()=>{const y=structuredClone(s);y.payrollReleases.push(structuredClone(y.payrollReleases[2]));const r=x.reconciliationForEmployee(y,employee,2026,'2026-01-14');assert(!r.complete);assert(r.issues.some(i=>i.includes('Duplicate 13th-month payment')))});
console.log(`${total} Batch 4 isolated tests passed`);
