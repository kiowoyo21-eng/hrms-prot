/* Focused static QA for Tools & Forms file-manager revision. No backend or browser test implied. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
const root=path.resolve(__dirname,'..');
const load=p=>fs.readFileSync(path.join(root,p),'utf8');
const drive=load('components/workspace/DriveWorkspace.tsx');
const view=load('components/workspace/DriveUploadViewer.tsx');
const route=load('app/drive/view/[id]/page.tsx');
const forms=load('components/intake/FormBuilderWorkspace.tsx');
for(const p of ['components/workspace/DriveWorkspace.tsx','components/workspace/DriveUploadViewer.tsx','app/drive/view/[id]/page.tsx','components/intake/FormBuilderWorkspace.tsx']){
 const ast=ts.createSourceFile(p,load(p),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 assert.equal(ast.parseDiagnostics.length,0,`${p} should parse: ${ast.parseDiagnostics.map(d=>ts.flattenDiagnosticMessageText(d.messageText,' '))}`);
}
for(const mark of ['new-doc','new-sheet','addStudioItem(','createBlankSheet(','New document','New spreadsheet','Move to Trash','EntryIcon','drive-grid','drive-new-menu'])assert(drive.includes(mark),`Missing Drive feature ${mark}`);
for(const mark of ['getDriveBlob(','readDrive(','downloadDriveUpload(','URL.revokeObjectURL','sandbox=""','Access restricted'])assert(view.includes(mark),`Missing viewer safeguard ${mark}`);
assert(route.includes('DriveUploadViewer')&&route.includes('await params'),'Missing compatible Next.js dynamic route');
for(const mark of ['target==="application"','target==="incident"','Share / QR','QRCodeCanvas','Preview / test only:'])assert(forms.includes(mark),`Missing form feature ${mark}`);
const allFiles=[...new Set([...Object.keys(require('node:module').builtinModules), ...fs.readdirSync(root)])];
assert(fs.existsSync(path.join(root,'app/drive/view/[id]/page.tsx')));
console.log('PASS Files & Forms patch: TSX parsing, document/spreadsheet creation wiring, folder/trash actions, secure local preview route, QR UI modes');
