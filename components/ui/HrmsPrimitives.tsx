"use client";
import {useEffect,useId,useRef,type ReactNode,type ButtonHTMLAttributes,type HTMLAttributes,type InputHTMLAttributes} from "react";
import {createPortal} from "react-dom";
import {X} from "lucide-react";

type Tone="neutral"|"success"|"warning"|"danger"|"info"|"accent";
type Size="sm"|"md";

/** Shared presentational controls: callers retain their existing business handlers. */
export function HrmsButton({variant="secondary",size="md",icon,children,className="",type="button",...rest}:ButtonHTMLAttributes<HTMLButtonElement>&{variant?:"primary"|"secondary"|"ghost"|"danger";size?:Size;icon?:ReactNode}){
 return <button {...rest} type={type} className={`hrms-button hrms-button--${variant} hrms-button--${size} ${className}`.trim()}>{icon}{children}</button>;
}
export function HrmsBadge({tone="neutral",children,className=""}:{tone?:Tone;children:ReactNode;className?:string}){
 return <span className={`hrms-badge hrms-badge--${tone} ${className}`.trim()}>{children}</span>;
}
export function HrmsCard({children,className="",...props}:HTMLAttributes<HTMLElement>){return <section {...props} className={`hrms-card ${className}`.trim()}>{children}</section>}
export function HrmsField({label,htmlFor,required,help,children,className=""}:{label:string;htmlFor?:string;required?:boolean;help?:ReactNode;children:ReactNode;className?:string}){
 return <div className={`hrms-field ${className}`.trim()}><label htmlFor={htmlFor}>{label}{required&&<span aria-hidden="true" className="hrms-required"> *</span>}</label>{children}{help&&<div className="hrms-field-help">{help}</div>}</div>;
}
export function HrmsInput({className="",...props}:InputHTMLAttributes<HTMLInputElement>){return <input {...props} className={`hrms-input ${className}`.trim()}/>}
export function HrmsPageHeader({title,description,actions}:{title:string;description?:string;actions?:ReactNode}){
 return <header className="hrms-page-header"><div><h1>{title}</h1>{description&&<p>{description}</p>}</div>{actions&&<div className="hrms-page-header-actions">{actions}</div>}</header>;
}
export function HrmsStatCard({label,value,icon,note,onClick,active=false}:{label:string;value:ReactNode;icon:ReactNode;note?:ReactNode;onClick?:()=>void;active?:boolean}){
 const inside=<><span className="hrms-stat-icon">{icon}</span><span className="hrms-stat-label">{label}</span><strong className="hrms-stat-number">{value}</strong>{note&&<span className="hrms-stat-note">{note}</span>}</>;
 return onClick?<button type="button" aria-label={`${label}: ${typeof value==="string"||typeof value==="number"?value:"View details"}`} onClick={onClick} className={`hrms-stat-card hrms-stat-card--action ${active?"is-active":""}`}>{inside}</button>:<div className="hrms-stat-card">{inside}</div>;
}
export function HrmsEmptyState({icon,title,description,action}:{icon?:ReactNode;title:string;description?:string;action?:ReactNode}){
 return <div className="hrms-empty-state">{icon&&<span className="hrms-empty-icon">{icon}</span>}<strong>{title}</strong>{description&&<p>{description}</p>}{action}</div>;
}
export function HrmsDataTable({children,label,className=""}:{children:ReactNode;label:string;className?:string}){
 return <div className={`hrms-table-frame ${className}`.trim()} role="region" aria-label={label} tabIndex={0}><div className="hrms-table-scroll"><table>{children}</table></div></div>;
}
export function HrmsTabs<T extends string>({label,items,value,onChange,className="",variant="underline"}:{label:string;items:ReadonlyArray<{id:T;label:string;icon?:ReactNode}>;value:T;onChange:(id:T)=>void;className?:string;variant?:"underline"|"segmented"}){
 const refs=useRef<Array<HTMLButtonElement|null>>([]);
 return <div role="tablist" aria-label={label} className={`hrms-tabs hrms-tabs--${variant} ${className}`.trim()}>
  {items.map((item,i)=><button key={item.id} ref={el=>{refs.current[i]=el}} type="button" role="tab" tabIndex={item.id===value?0:-1} aria-selected={item.id===value} onClick={()=>onChange(item.id)} onKeyDown={event=>{
   if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;
   event.preventDefault();const target=event.key==="Home"?0:event.key==="End"?items.length-1:(i+(event.key==="ArrowRight"?1:-1)+items.length)%items.length;
   const next=items[target];if(next){onChange(next.id);refs.current[target]?.focus()}
  }}>{item.icon}{item.label}</button>)}
 </div>;
}

/** Accessible portal-based dialog with one scrollable body and persistent actions. */
export function HrmsDialog({open,title,subtitle,onClose,children,footer,size="md",className=""}:{open:boolean;title:string;subtitle?:string;onClose:()=>void;children:ReactNode;footer?:ReactNode;size?:"sm"|"md"|"lg"|"xl";className?:string}){
 const titleId=useId();const dialog=useRef<HTMLElement|null>(null);const closer=useRef(onClose);
 useEffect(()=>{closer.current=onClose},[onClose]);
 useEffect(()=>{
  if(!open)return;
  const previous=document.activeElement instanceof HTMLElement?document.activeElement:null;
  const previousOverflow=document.body.style.overflow;
  document.body.style.overflow="hidden";
  const node=dialog.current;node?.focus();
  const onKey=(event:KeyboardEvent)=>{
   const stack=Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"][aria-modal="true"]')).filter(element=>element.getClientRects().length>0);
   if(stack[stack.length-1]!==node)return;
   if(event.key==="Escape"){event.preventDefault();event.stopImmediatePropagation();closer.current();return}
   if(event.key!=="Tab"||!node)return;
   const candidates=Array.from(node.querySelectorAll<HTMLElement>('a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"])')).filter(el=>el.getClientRects().length>0);
   if(!candidates.length){event.preventDefault();node.focus();return}
   const first=candidates[0],last=candidates[candidates.length-1];
   if(event.shiftKey&&(document.activeElement===first||document.activeElement===node)){event.preventDefault();last.focus()}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  };
  document.addEventListener("keydown",onKey,true);
  return()=>{document.removeEventListener("keydown",onKey,true);document.body.style.overflow=previousOverflow;previous?.focus()};
 },[open]);
 if(!open||typeof document==="undefined")return null;
 return createPortal(<div className="hrms-dialog-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)onClose()}}><section ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={titleId} className={`hrms-dialog hrms-dialog--${size} ${className}`.trim()}><header className="hrms-dialog-head"><div><h2 id={titleId}>{title}</h2>{subtitle&&<p>{subtitle}</p>}</div><HrmsButton variant="ghost" size="sm" aria-label="Close dialog" onClick={onClose} icon={<X size={16}/>}/></header><div className="hrms-dialog-body">{children}</div>{footer&&<footer className="hrms-dialog-footer">{footer}</footer>}</section></div>,document.body);
}
export function HrmsToast({tone="neutral",children,onDismiss}:{tone?:Tone;children:ReactNode;onDismiss?:()=>void}){
 return <div role={tone==="danger"?"alert":"status"} className={`hrms-toast hrms-toast--${tone}`}><span>{children}</span>{onDismiss&&<HrmsButton variant="ghost" size="sm" aria-label="Dismiss notification" onClick={onDismiss} icon={<X size={16}/>}/>}</div>;
}
