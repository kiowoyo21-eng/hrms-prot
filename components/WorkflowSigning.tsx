"use client";
import {useEffect,useRef,useState} from "react";
import {CheckCircle2,Eye,FileText,Info,PenLine,QrCode,RotateCcw} from "lucide-react";

/** Review-only signature UX. The document MUST be visible before capture.
 * Neither demo drawings nor filenames are evidence of a legally signed document.
 */
export default function WorkflowSigning({documentName,recipient,documentText,documentFile}:{documentName:string;recipient:string;documentText?:string;documentFile?:File|null}){
 const [method,setMethod]=useState<"device"|"remote">("device");
 const [drawn,setDrawn]=useState(false);
 const [previewed,setPreviewed]=useState(false);
 const [reviewed,setReviewed]=useState(false);
 const [documentUrl,setDocumentUrl]=useState("");
 const pad=useRef<HTMLCanvasElement>(null);
 const drawing=useRef(false);
 const hasFile=Boolean(documentFile && (documentFile.type==="application/pdf" || documentFile.type.startsWith("image/")));
 const hasContent=hasFile||Boolean(documentText?.trim());
 useEffect(()=>{setReviewed(false);setDrawn(false);setPreviewed(false);pad.current?.getContext("2d")?.clearRect(0,0,pad.current.width,pad.current.height)},[documentName,recipient,documentText,documentFile]);
 useEffect(()=>{if(!documentFile||!hasFile){setDocumentUrl("");return}const url=URL.createObjectURL(documentFile);setDocumentUrl(url);return()=>URL.revokeObjectURL(url)},[documentFile,hasFile]);
 function point(e:React.PointerEvent<HTMLCanvasElement>){const el=pad.current;if(!el)return{x:0,y:0};const r=el.getBoundingClientRect();return{x:(e.clientX-r.left)*el.width/r.width,y:(e.clientY-r.top)*el.height/r.height}}
 function start(e:React.PointerEvent<HTMLCanvasElement>){if(!reviewed||!hasContent)return;const el=pad.current;if(!el)return;el.setPointerCapture(e.pointerId);const ctx=el.getContext("2d");if(!ctx)return;ctx.beginPath();const p=point(e);ctx.moveTo(p.x,p.y);ctx.lineWidth=3;ctx.lineCap="round";ctx.strokeStyle="#283449";drawing.current=true;setPreviewed(false)}
 function move(e:React.PointerEvent<HTMLCanvasElement>){if(!drawing.current)return;const ctx=pad.current?.getContext("2d");if(!ctx)return;const p=point(e);ctx.lineTo(p.x,p.y);ctx.stroke();setDrawn(true)}
 function finish(){drawing.current=false}
 function reset(){const canvas=pad.current;if(canvas)canvas.getContext("2d")?.clearRect(0,0,canvas.width,canvas.height);setDrawn(false);setPreviewed(false)}
 return <div className="wf-signing"><div className="wf-signing-heading"><strong>Document Review & Signature</strong><small>{documentName} · {recipient||"Select recipient"}</small></div>
  <section className="uc-sign-document" aria-label={`Document to review: ${documentName}`}><div className="uc-sign-document-head"><span><FileText size={17}/> Document to be signed</span><span className="uc-sign-demo-label">Browser preview only</span></div>
   {documentUrl&&documentFile?.type==="application/pdf"?<iframe src={documentUrl} title={`Review ${documentName}`} className="uc-sign-pdf"/>:documentUrl&&documentFile?.type.startsWith("image/")?<img src={documentUrl} alt={`Review ${documentName}`} className="uc-sign-img"/>:documentText?.trim()?<article className="uc-sign-paper"><strong>{documentName}</strong><p>{documentText}</p></article>:<p className="uc-sign-no-file"><Info size={16}/> No approved document is attached yet. HR must provide the full form before collecting any signature. A document title alone is not sufficient.</p>}
   <label className="uc-sign-review"><input type="checkbox" checked={reviewed} disabled={!hasContent} onChange={e=>{setReviewed(e.target.checked);reset()}}/> I have opened and reviewed the complete document shown above.</label>
  </section>
  <div className="wf-signing-choices" role="group" aria-label="Signing method"><button type="button" className={method==="device"?"selected":""} onClick={()=>{setMethod("device");setPreviewed(false)}}><PenLine size={17}/><span><b>Sign on Device</b><small>Local signature preview</small></span></button><button type="button" className={method==="remote"?"selected":""} onClick={()=>setMethod("remote")}><QrCode size={17}/><span><b>Link / QR Code</b><small>Secure backend required</small></span></button></div>
  {method==="device"?<div className="wf-signing-pad"><p>{reviewed?"Draw a sample signature after reviewing the document. It is NOT saved, verified, or attached to an official signed copy.":"Review and acknowledge the actual document above to enable the demo signature area."}</p><canvas ref={pad} width={700} height={160} className={!reviewed?"uc-sign-disabled":""} aria-label="Demo signature drawing pad" onPointerDown={start} onPointerMove={move} onPointerUp={finish} onPointerCancel={finish}/><div className="wf-signing-footer"><button type="button" className="secondary" onClick={reset}><RotateCcw size={14}/> Clear</button><button type="button" className="secondary" disabled={!drawn||!reviewed} onClick={()=>setPreviewed(true)}><Eye size={14}/> Preview Drawn Signature</button></div>{previewed&&<p className="wf-signing-feedback"><CheckCircle2 size={14}/> Drawing previewed only. Document status stays unchanged until a verified signing and archive workflow exists.</p>}</div>:<div className="wf-signing-remote"><QrCode size={29}/><div><strong>Recipient-specific signing link — not yet enabled</strong><p>A real link must open this exact document and verify the recipient, consent, expiration and audit trail. No fake cross-device link is created in this frontend.</p></div></div>}
 </div>
}
