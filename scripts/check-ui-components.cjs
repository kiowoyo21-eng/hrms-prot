const fs = require('fs');
const assert = require('assert');
const path = require('path');
const root=path.join(__dirname,'..');
const read=(name)=>fs.readFileSync(path.join(root,name),'utf8');
const lib=read('components/ui/HrmsPrimitives.tsx');
for(const name of ['HrmsButton','HrmsBadge','HrmsCard','HrmsInput','HrmsField','HrmsPageHeader','HrmsStatCard','HrmsEmptyState','HrmsDataTable','HrmsTabs','HrmsDialog','HrmsToast'])assert(lib.includes(`export function ${name}`),`missing ${name}`);
assert(lib.includes('role="dialog"')&&lib.includes('aria-modal="true"'),'dialog accessibility');
assert(lib.includes('event.key==="Escape"')&&lib.includes('event.key!=="Tab"'),'dialog keyboard support');
assert(lib.includes('ArrowRight')&&lib.includes('aria-selected'),'tabs keyboard/selection');
for(const [file,token] of [['components/GroupedWorkspace.tsx','<HrmsTabs'],['components/ReportsLanding.tsx','<HrmsTabs'],['components/HRFormsRequestsWorkspace.tsx','<HrmsTabs'],['components/RecruitmentWorkspace.tsx','<HrmsTabs']])assert(read(file).includes(token),`tab migration missing: ${file}`);
for(const file of ['app/tokens.css','app/hrms-components.css','app/hrms-migration.css'])assert(fs.statSync(path.join(root,file)).size>250,`missing stylesheet ${file}`);
assert(read('app/layout.tsx').includes('hrms-migration.css'),'CSS not imported');
for(const name of ['app/hrms-components.css','app/hrms-migration.css']){
 const css=read(name);
 assert(!/!important/i.test(css),`new CSS uses !important: ${name}`);
 assert(!/#[0-9a-f]{3,8}\b/i.test(css),`new CSS has hardcoded hex: ${name}`);
}
assert(read('components/HelpButton.tsx').includes('<HrmsDialog'),'Help guide dialog not migrated');
assert(read('components/AssetWorkspace.tsx').includes('useManagedDialog(adding'),'Asset dialog not managed');
assert(read('components/PayrollOperationsHub.tsx').includes('useManagedDialog(govModal'),'Government dialog not managed');
assert(read('components/LeaveManagementWorkspace.tsx').includes('useManagedDialog(showAdd'),'Leave dialog not managed');
console.log('PASS: shared controls, accessible tab adapters, dialog guards and CSS import wiring');
