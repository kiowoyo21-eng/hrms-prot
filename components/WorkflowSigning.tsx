"use client";
import {useRef,useState} from "react";
import {CheckCircle2,Info,PenLine,QrCode,RotateCcw} from "lucide-react";

/** An in-workflow signing interface. This frontend demo intentionally does not issue usable links
 * or persist signatures. Production signing requires verified identity and tamper-evident storage. */
export default function WorkflowSigning({documentName,recipient}:{documentName:string;recipient:string}){
 const [method,setMethod]=useState<"device"|"remote">("device");
 const [drawn,setDrawn]=useState(false);
 const [previewed,setPreviewed]=useState(false);
 const pad=useRef<HTMLCanvasElement>(null);
 const drawing=useRef(false);
 function point(e:React.PointerEvent<HTMLCanvasElement>){const el=pad.current;if(!el)return {x:0,y:0};const r=el.getBoundingClientRect();return {x:(e.clientX-r.left)*el.width/r.width,y:(e.clientY-r.top)*el.height/r.height}}
 function start(e:React.PointerEvent<HTMLCanvasElement>){const el=pad.current;if(!el)return;el.setPointerCapture(e.pointerId);const ctx=el.getContext("2d");if(!ctx)return;ctx.beginPath();const p=point(e);ctx.moveTo(p.x,p.y);ctx.lineWidth=3;ctx.lineCap="round";ctx.strokeStyle="#283449";drawing.current=true;setPreviewed(false)}
 function move(e:React.PointerEvent<HTMLCanvasElement>){if(!drawing.current)return;const ctx=pad.current?.getContext("2d");if(!ctx)return;const p=point(e);ctx.lineTo(p.x,p.y);ctx.stroke();setDrawn(true)}
 function finish(){drawing.current=false}
 function reset(){pad.current?.getContext("2d")?.clearRect(0,0,pad.current!.width,pad.current!.height);setDrawn(false);setPreviewed(false)}
 return <div className="wf-signing"><div className="wf-signing-heading"><strong>Individual Document Signing</strong><small>{documentName} · {recipient||"Select recipient"}</small></div>
  <div className="wf-signing-choices" role="group" aria-label="Signing method">
   <button type="button" className={method==="device"?"selected":""} onClick={()=>{setMethod("device");setPreviewed(false)}}><PenLine size={17}/><span><b>Sign on Device</b><small>Touchscreen, mouse or trackpad</small></span></button>
   <button type="button" className={method==="remote"?"selected":""} onClick={()=>setMethod("remote")}><QrCode size={17}/><span><b>Link / QR Code</b><small>Recipient's own phone</small></span></button>
  </div>
  {method==="device"?<div className="wf-signing-pad"><p>Employee reviews the document, then signs below on this device. Demo signature is not stored or verified.</p><canvas ref={pad} width={700} height={160} aria-label="Demo signature drawing pad" onPointerDown={start} onPointerMove={move} onPointerUp={finish} onPointerCancel={finish}/><div className="wf-signing-footer"><button type="button" className="secondary" onClick={reset}><RotateCcw size={14}/> Clear</button><button type="button" className="secondary" disabled={!drawn} onClick={()=>setPreviewed(true)}><CheckCircle2 size={14}/> Preview Captured Signature</button></div>{previewed&&<p className="wf-signing-feedback"><Info size={14}/> Captured in this browser view only. HR must verify identity and retain a signed document through the approved process; this is not an official e-signature.</p>}</div>:
   <div className="wf-signing-remote"><QrCode size={29}/><div><strong>Secure QR / Link — Backend Required</strong><p>When the authenticated signing service is connected, issue one expiring, recipient-bound request for this document. QR and copy-link will be available here. No fake usable link is generated.</p></div></div>}
 </div>
}
