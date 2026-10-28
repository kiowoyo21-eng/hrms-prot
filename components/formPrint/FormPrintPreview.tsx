"use client";
import {useEffect} from "react";
import {createPortal} from "react-dom";
import type {HRFormRecord} from "../../lib/hrForms";
import {hrRequestPrintData,hrRequestPrintTemplate,printTemplates} from "./registry";
import GenericHRRequestForm from "./GenericHRRequestForm";
import "./printForms.css";

/** Print action lives inside the existing request review screen; no new workflow or stored approval. */
export default function FormPrintPreview({record,employeeName,position,department,onClose}:{record:HRFormRecord;employeeName:string;position?:string;department?:string;onClose:()=>void}){
 useEffect(()=>{const prev=document.body.style.overflow;document.body.style.overflow="hidden";const onKey=(event:KeyboardEvent)=>{if(event.key==="Escape")onClose()};window.addEventListener("keydown",onKey);return()=>{document.body.style.overflow=prev;window.removeEventListener("keydown",onKey)}},[onClose]);
 const data=hrRequestPrintData(record,employeeName,position,department);
 const templateId=hrRequestPrintTemplate[record.kind];
 const Template=templateId?printTemplates[templateId]:null;
 if(typeof document==="undefined")return null;
 return createPortal(<div className="hr-print-overlay hr-print-scope" role="dialog" aria-modal="true" aria-label={`Print ${record.kind}`}>
  <div className="hr-print-toolbar hr-print-no-print"><strong>Print review · {record.id}</strong><span>PDF: choose “Save as PDF” in the print dialog</span><button type="button" onClick={()=>window.print()}>Print / Save PDF</button><button type="button" onClick={onClose}>Close</button></div>
  <div className="hr-print-frame">
   {Template?<Template data={data}/>:<GenericHRRequestForm data={data} kind={record.kind} additionalLabels={record.additionalLabels}/>}
  </div>
 </div>,document.body);
}
