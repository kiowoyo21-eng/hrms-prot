"use client";
import {useEffect,useRef} from "react";
/** Adds Esc, focus trapping, body scroll lock and focus restoration to existing portalled dialogs.
 *  New dialog implementations should use HrmsDialog directly. */
export function useManagedDialog(open:boolean,selector:string,onClose:()=>void){
 const closeRef=useRef(onClose);closeRef.current=onClose;
 useEffect(()=>{
  if(!open||typeof document==="undefined")return;
  const previous=document.activeElement instanceof HTMLElement?document.activeElement:null;
  const previousOverflow=document.body.style.overflow;
  const root=document.querySelector<HTMLElement>(selector);
  if(!root)return;
  const originalTabIndex=root.getAttribute("tabindex");
  if(!root.hasAttribute("tabindex"))root.setAttribute("tabindex","-1");
  root.focus();document.body.style.overflow="hidden";
  const keydown=(event:KeyboardEvent)=>{
   const stack=Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"][aria-modal="true"]')).filter(element=>element.getClientRects().length>0);
   if(stack[stack.length-1]!==root)return;
   if(event.key==="Escape"){event.preventDefault();event.stopImmediatePropagation();closeRef.current();return}
   if(event.key!=="Tab")return;
   const focusable=Array.from(root.querySelectorAll<HTMLElement>('a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"])')).filter(node=>node.getClientRects().length>0);
   if(!focusable.length){event.preventDefault();root.focus();return}
   const first=focusable[0],last=focusable[focusable.length-1];
   if(event.shiftKey&&(document.activeElement===first||document.activeElement===root)){event.preventDefault();last.focus()}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  };
  document.addEventListener("keydown",keydown,true);
  return()=>{document.removeEventListener("keydown",keydown,true);document.body.style.overflow=previousOverflow;if(originalTabIndex===null)root.removeAttribute("tabindex");previous?.focus()};
 },[open,selector]);
}
