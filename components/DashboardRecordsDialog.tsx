"use client";
import {useEffect,useMemo,useState} from "react";
import {HrmsDialog,HrmsButton} from "./ui/HrmsPrimitives";
import styles from "./DashboardRecordsDialog.module.css";

import type {DashboardRecordView} from "../lib/dashboardRecordViews";
/** Read-only browser-local source rows, never inferred totals or placeholder examples. */
export default function DashboardRecordsDialog({view,onClose}:{view:DashboardRecordView|null;onClose:()=>void}){
 const [query,setQuery]=useState("");
 const [page,setPage]=useState(1);
 const [selected,setSelected]=useState<string|null>(null);
 useEffect(()=>{setQuery("");setPage(1);setSelected(null)},[view?.title,view?.scope]);
 const filtered=useMemo(()=>view?.rows.filter(row=>`${row.cells.join(" ")} ${row.id}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))||[],[view,query]);
 const count=15;
 const maxPage=Math.max(1,Math.ceil(filtered.length/count));
 const shown=filtered.slice((Math.min(page,maxPage)-1)*count,Math.min(page,maxPage)*count);
 const selectedRow=view?.rows.find(row=>row.id===selected)||null;
 return <HrmsDialog open={!!view} title={view?.title||"Details"} subtitle={view?.scope} onClose={onClose} size="xl" footer={<><span className={styles.footerCount}>{view?.rows.length||0} recorded row(s){view?.total?` · ${view.total}`:""}</span><HrmsButton onClick={onClose}>Close</HrmsButton></>}>
  {view&&<div className={styles.body}>
   {view.note&&<p className={styles.note}>{view.note}</p>}
   <label className={styles.search}>Search these records<input value={query} onChange={e=>{setQuery(e.target.value);setPage(1);setSelected(null)}} placeholder="Search name, ID, branch, date, status…"/></label>
   <div className={styles.tableFrame} role="region" aria-label={`${view.title} records`} tabIndex={0}>
    <table className={styles.table}><thead><tr>{view.columns.map(col=><th key={col} scope="col">{col}</th>)}</tr></thead><tbody>
     {shown.map(row=><tr key={row.id} className={styles.recordRow}><td colSpan={view.columns.length} className={styles.rowContainer}><button type="button" className={styles.recordButton} onClick={()=>setSelected(s=>s===row.id?null:row.id)} aria-haspopup="dialog" aria-label={`Open full recorded details for ${row.cells[0]||row.id}`}><span className={styles.cellGrid} style={{gridTemplateColumns:`repeat(${view.columns.length},minmax(0,1fr))`}}>{row.cells.map((v,index)=><span key={index}>{v||"—"}</span>)}</span><span aria-hidden="true" className={styles.chevron}>↗</span></button></td></tr>)}
     {shown.length===0&&<tr><td colSpan={view.columns.length} className={styles.empty}>{view.rows.length?"No records match your search.":"No recorded data available for this selection."}</td></tr>}
    </tbody></table>
   </div>
   {filtered.length>count&&<div className={styles.pagination}><span>Showing {(Math.min(page,maxPage)-1)*count+1}–{Math.min(page,maxPage)*count<filtered.length?Math.min(page,maxPage)*count:filtered.length} of {filtered.length}</span><HrmsButton size="sm" disabled={page<=1} onClick={()=>{setPage(p=>Math.max(1,p-1));setSelected(null)}}>Previous</HrmsButton><HrmsButton size="sm" disabled={page>=maxPage} onClick={()=>{setPage(p=>Math.min(maxPage,p+1));setSelected(null)}}>Next</HrmsButton></div>}
  </div>}
  <HrmsDialog open={!!selectedRow} title={selectedRow?.cells[0]||"Record details"} subtitle={view?.title||"Supporting record"} onClose={()=>setSelected(null)} size="md" footer={<HrmsButton onClick={()=>setSelected(null)}>Close</HrmsButton>}>
   {selectedRow&&<div className={styles.details}>{(selectedRow.details?.length?selectedRow.details:view?.columns.map((label,i)=>[label,selectedRow.cells[i]] as [string,string])||[]).map(([label,value],i)=><div key={`${label}-${i}`}><small>{label}</small><strong>{value||"Not recorded"}</strong></div>)}</div>}
  </HrmsDialog>
 </HrmsDialog>;
}
