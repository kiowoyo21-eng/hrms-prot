"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {ArrowLeft,Download,File,FileText} from "lucide-react";
import {getDriveBlob,readDrive,downloadDriveUpload} from "../../lib/drive/store";
import {useStudio} from "../../lib/studio/useStudio";
import "../../app/drive/drive.css";

type Preview = {name:string;size:number;kind:"image"|"pdf"|"text"|"docx"|"download";url?:string;text?:string;html?:string};
const validId=(s:string)=>/^[a-zA-Z0-9-]{1,100}$/.test(s);

export default function DriveUploadViewer({id}:{id:string}){
 const {actor,ready}=useStudio();
 const [preview,setPreview]=useState<Preview|null>(null),[error,setError]=useState("");
 const [downloading,setDownloading]=useState(false);
 useEffect(()=>{
  if(!ready||!actor||actor.role==="BM")return;
  let alive=true;let objectUrl:string|undefined;
  (async()=>{
   if(!validId(id))throw Error("Invalid Drive file reference.");
   const drive=readDrive(),record=drive.uploads.find(x=>x.id===id);
   if(!record||drive.trashed.includes(`upload:${id}`))throw Error("This uploaded file is missing or in Trash.");
   const blob=await getDriveBlob(id);if(!blob)throw Error("File contents are unavailable in this browser.");
   const name=record.name;
   const info:Preview={name,size:record.size,kind:"download"};
   if(/\.(png|jpe?g|gif|webp)$/i.test(name)){objectUrl=URL.createObjectURL(new Blob([blob],{type:record.mime||"image/png"}));info.kind="image";info.url=objectUrl;}
   else if(/\.pdf$/i.test(name)){objectUrl=URL.createObjectURL(new Blob([blob],{type:"application/pdf"}));info.kind="pdf";info.url=objectUrl;}
   else if(/\.(txt|md|csv|json|log)$/i.test(name)){if(blob.size>2_000_000)throw Error("Text preview exceeds 2 MB. Download the original file instead.");info.kind="text";info.text=await blob.text();}
   else if(/\.docx$/i.test(name)){
    const mammoth=await import("mammoth");const result=await mammoth.convertToHtml({arrayBuffer:await blob.arrayBuffer()});
    info.kind="docx";info.html=`<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'"><style>body{font:14px/1.6 Arial,sans-serif;color:#1f2937;max-width:800px;margin:24px auto;padding:0 18px;overflow-wrap:anywhere}table{border-collapse:collapse}td,th{border:1px solid #cbd5e1;padding:6px}img{max-width:100%}</style></head><body>${result.value}</body></html>`;
   }
   if(alive)setPreview(info);
  })().catch(e=>{if(alive)setError(e instanceof Error?e.message:String(e))});
  return()=>{alive=false;if(objectUrl)URL.revokeObjectURL(objectUrl)};
 },[id,actor?.username,actor?.role,ready]);
 if(!ready)return <main className="drive-viewer"><p>Loading document preview…</p></main>;
 if(!actor||actor.role==="BM")return <main className="drive-viewer"><h1>Access restricted</h1><p>Sign in with an authorized HRMS account.</p><Link href="/">Return to HRMS</Link></main>;
 return <main className="drive-viewer"><header className="drive-viewer-header"><Link href="/drive"><ArrowLeft size={17}/> Back to Drive</Link><strong><File size={19}/> File preview</strong></header>
 {error&&<p className="drive-viewer-error" role="alert">{error}</p>}
 {preview&&<><div className="drive-viewer-title"><div><h1>{preview.name}</h1><small>{(preview.size/1024).toFixed(1)} KB · Stored in this browser only</small></div><button type="button" disabled={downloading} onClick={()=>{setDownloading(true);void downloadDriveUpload(id,preview.name).catch(e=>setError(String(e))).finally(()=>setDownloading(false))}}><Download size={16}/> Download original</button></div>
 {preview.kind==="image"&&<div className="drive-viewer-content"><img alt={preview.name} src={preview.url}/></div>}
 {preview.kind==="pdf"&&<iframe className="drive-viewer-frame" title={preview.name} src={preview.url}/>}
 {preview.kind==="text"&&<pre className="drive-viewer-text">{preview.text}</pre>}
 {preview.kind==="docx"&&<iframe title={preview.name} className="drive-viewer-frame" sandbox="" srcDoc={preview.html}/>}
 {preview.kind==="download"&&<div className="drive-viewer-empty"><FileText size={34}/><p>Preview isn't supported for this file type. Use Download original.</p></div>}
 </>}
 <p className="drive-viewer-note">This is a local prototype preview, not a secured document hosting service. Sharing and remote synchronization are unavailable.</p>
 </main>;
}
