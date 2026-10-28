import type {ReactNode} from "react";
import type {PrintFormData} from "./types";

const companyNames = {UC: "UNDERCHARGERS", MM: "MASTERMIND AUTOWORKS"};
const logos = {UC: "/hr-form-logos/underchargers.png", MM: "/hr-form-logos/mastermind.png"};
export const val = (data: PrintFormData, ...keys: string[]) => {
  for (const key of keys) {
    const value = (data.values[key] || "").trim();
    if (value) return value;
  }
  return "";
};
export const item = (label: string, value: unknown) => ({label, value: String(value ?? "")});
type Item = {label: string; value?: string};

export function Paper({data,title,code,category,children,reviewNotice}:{data:PrintFormData;title:string;code:string;category:string;children:ReactNode;reviewNotice?:string}) {
  return <article className="hr-print-paper" data-company={data.company}>
    <header className="hr-print-header">
      <div className="hr-print-brand"><img className={`hr-print-logo hr-print-logo-${data.company.toLowerCase()}`} src={logos[data.company]} alt={`${companyNames[data.company]} logo`}/></div>
      <div className="hr-print-head-meta"><span>{category}</span><span>{code}</span></div>
      <div className="hr-print-head-rule"/>
      <h1>{title}</h1>
      <div className="hr-print-subhead"><span>{data.branch || companyNames[data.company]}</span><span>{data.reference ? `Reference: ${data.reference}` : "Blank / draft form"}</span></div>
    </header>
    <div className="hr-print-document">{children}</div>
    {reviewNotice && <section className="hr-print-review" aria-label="Template review notice"><strong>Template review required.</strong> {reviewNotice}</section>}
    <footer className="hr-print-footer"><span>{companyNames[data.company]} · {code}</span><span>HR records · {data.status || (data.source === "hr-request" ? "Request copy" : "Template preview")}</span></footer>
  </article>;
}
export function Section({title,children,description}:{title:string;children:ReactNode;description?:string}){
 return <section className="hr-print-section"><h2>{title}</h2>{description&&<p className="hr-print-section-note">{description}</p>}{children}</section>;
}
export function InfoGrid({items,columns=2}:{items:Item[];columns?:1|2|3}){
 return <div className={`hr-print-grid hr-print-cols-${columns}`}>{items.map((i,idx)=><div key={`${i.label}-${idx}`} className="hr-print-field"><span className="hr-print-label">{i.label}</span><span className={`hr-print-field-value ${i.value ? "" : "hr-print-empty"}`}>{i.value || "\u00a0"}</span></div>)}</div>;
}
export function Lines({label,value,rows=3}:{label:string;value?:string;rows?:number}){
 return <div className="hr-print-lines"><span className="hr-print-label">{label}</span><div className="hr-print-lined-text" style={{minHeight: `${rows * 23}px`}}>{value || "\u00a0"}</div></div>;
}
export function GridTable({columns,rows,emptyRows=3}:{columns:string[];rows:string[][];emptyRows?:number}){
 const padded=rows.length ? rows : Array.from({length:emptyRows},()=>columns.map(()=>""));
 return <table className="hr-print-table"><thead><tr>{columns.map((x,i)=><th key={`${x}-${i}`}>{x}</th>)}</tr></thead><tbody>{padded.map((row,i)=><tr key={i}>{columns.map((_,j)=><td key={j}>{row[j]||"\u00a0"}</td>)}</tr>)}</tbody></table>;
}
/** Printed names identify participants; only a handwritten or separately verified signature signs a form. */
export function Signatures({items}:{items:{label:string;name?:string;date?:string}[]}){
 return <div className="hr-print-signatures">{items.map((i,idx)=><div className="hr-print-signature" key={idx}>
  <div className="hr-print-sign-line" aria-label="Blank signature line">{"\u00a0"}</div>
  <span>{i.label}</span>
  {i.name&&<strong className="hr-print-sign-print-name">Printed name: {i.name}</strong>}
  <small>{i.date||"Signature / Date"}</small>
 </div>)}</div>;
}
export function Callout({children}:{children:ReactNode}) {return <p className="hr-print-callout">{children}</p>}
export function CommonEmployee({data,includeDate=true}:{data:PrintFormData;includeDate?:boolean}){
 return <InfoGrid items={[item("Employee name",data.employeeName||val(data,"name","employee")),item("Employee ID",data.employeeId),item("Position / Department",[data.position,data.department].filter(Boolean).join(" / ")),item("Company / Branch",data.branch),...(includeDate?[item("Date",data.date||val(data,"workDate","dateApplied")),item("Document reference",data.reference)]:[])]}/>;
}
