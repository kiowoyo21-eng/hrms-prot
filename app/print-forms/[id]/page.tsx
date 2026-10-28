"use client";
import {useParams} from "next/navigation";
import Link from "next/link";
import {useState} from "react";
import {printTemplates,validPrintId,printTitle} from "../../../components/formPrint/registry";
import type {PrintCompany} from "../../../components/formPrint/types";
import "../../../components/formPrint/printForms.css";

/** Blank print-template preview only. Never reads private HR records from an unauthenticated URL. */
export default function PrintFormPage(){
 const params=useParams<{id:string}>();const id=typeof params.id==="string"?params.id:"";
 const [company,setCompany]=useState<PrintCompany>("UC");
 if(!validPrintId(id))return <main style={{padding:32}}><h1>Print template unavailable</h1><p>This form type does not exist.</p><Link href="/studio/source-forms">Return to Source Forms</Link></main>;
 const Template=printTemplates[id];
 const data={company,branch:"",values:{},status:"Blank draft — review required",source:"catalog-preview" as const};
 return <div className="hr-print-scope hr-print-frame">
  <div className="hr-print-toolbar hr-print-no-print"><Link href="/studio/source-forms">Back to Source Forms</Link><strong>{printTitle(id)}</strong><label>Company<select aria-label="Print company" value={company} onChange={event=>setCompany(event.target.value as PrintCompany)}><option value="UC">Underchargers</option><option value="MM">Mastermind Autoworks</option></select></label><button type="button" onClick={()=>window.print()}>Print / Save PDF</button></div>
  <p className="hr-print-warning hr-print-no-print">Blank structural preview. Legal agreements and original source text must be imported through Document Studio before use. Choosing another company changes the header only; it does not approve cross-company legal wording.</p>
  <Template data={data}/>
 </div>;
}
