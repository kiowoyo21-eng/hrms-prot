const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');
const {execFileSync}=require('node:child_process');
let ts;try{ts=require('typescript')}catch{ts=require(path.join(execFileSync('npm',['root','-g'],{encoding:'utf8'}).trim(),'typescript'))}
const base=path.resolve(__dirname,'..');
function load(file){const mod={exports:{}};const code=ts.transpileModule(fs.readFileSync(path.join(base,file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const localRequire=(name)=>{if(name==='./opsRestDays')return {};if(name==='./dateOnly')return {isValidISODate:()=>true};if(name==='./opsPermitEvidence')return {hasOpsPermitFile:()=>true};return require(name)};new Function('require','module','exports',code)(localRequire,mod,mod.exports);return mod.exports}
const {OPS_WEEKDAYS,datesForMonthlyOff,rosterWeekday,rosterLabel}=load('lib/opsRoster.ts');
const {parseErpCsv,erpCsvFingerprint,erpReportVisible}=load('lib/erpCsvReports.ts');
let checks=0;function test(name,fn){fn();checks++;console.log(`PASS ${name}`)}
test('OPS weekdays are Monday to Thursday only',()=>assert.deepEqual(OPS_WEEKDAYS.map(d=>Number(d.value)),[1,2,3,4]));
test('November 2026 Monday day OFF across a month',()=>assert.deepEqual(datesForMonthlyOff('2026-11',1),['2026-11-02','2026-11-09','2026-11-16','2026-11-23','2026-11-30']));
test('leap month Thursday day OFF',()=>assert.deepEqual(datesForMonthlyOff('2028-02',4),['2028-02-03','2028-02-10','2028-02-17','2028-02-24']));
test('Friday to Sunday cannot be assigned as monthly OPS OFF',()=>{for(const w of [0,5,6,7])assert.deepEqual(datesForMonthlyOff('2026-11',w),[])});
test('invalid month rejected',()=>assert.deepEqual(datesForMonthlyOff('2026-13',1),[]));
test('published uniform roster resolves weekday',()=>{const s={month:'2026-11',offDates:datesForMonthlyOff('2026-11',1)};assert.equal(rosterWeekday(s),'1');assert.equal(rosterLabel(s),'Monday')});
test('custom rotating dates remain custom, never silent overwrite',()=>{const s={month:'2026-11',offDates:['2026-11-02','2026-11-10']};assert.equal(rosterWeekday(s),'');assert.equal(rosterLabel(s),'Custom / varies')});
test('ERP CSV reads quoted comma, doubled quotes and newline',()=>{const p=parseErpCsv('ID,Notes\r\n100,"repair, urgent"\r\n101,"said ""okay""\nnext line"\r\n');assert.deepEqual(p.headers,['ID','Notes']);assert.deepEqual(p.rows,[['100','repair, urgent'],['101','said "okay"\nnext line']])});
test('ERP CSV duplicate column names blocked',()=>assert.throws(()=>parseErpCsv('ID,id\n1,2'),/duplicate/i));
test('ERP CSV mismatched columns blocked',()=>assert.throws(()=>parseErpCsv('ID,Name\n100'),/expected/i));
test('ERP CSV empty data blocked',()=>assert.throws(()=>parseErpCsv('ID,Name'),/data row/i));
test('ERP duplicate fingerprint deterministic',()=>assert.equal(erpCsvFingerprint('a,b\n1,2'),erpCsvFingerprint('a,b\n1,2')));
test('BM cannot view another branch CSV, HR respects branch filter',()=>{const r={branch:'UC Las Piñas'};assert.equal(erpReportVisible(r,'UC Mandaluyong','BM'),false);assert.equal(erpReportVisible(r,'All Shops','BM'),false);assert.equal(erpReportVisible(r,'All Shops','HR'),true);assert.equal(erpReportVisible(r,'UC Mandaluyong','HR'),false)});
test('ERP CSV parser preserves values as text, no auto executable mapping',()=>{const p=parseErpCsv('Employee,Formula\nJuan,"=SUM(A1:A2)"');assert.equal(p.rows[0][1],'=SUM(A1:A2)')});
console.log(`ERP CSV + OPS roster: ${checks} targeted tests passed`);
