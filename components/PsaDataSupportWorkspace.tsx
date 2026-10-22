"use client";
import {useEffect,useMemo,useState} from "react";
import {CalendarDays,Download,FileSpreadsheet,FileText,Info,Printer,Search,ShieldAlert,Users} from "lucide-react";
import {useHR} from "../lib/hrState";
import {shopNames,type Shop} from "../lib/people";
import {dashboardTodayPH} from "../lib/dashboardAnalytics";
import {buildPsaDatasets,ISLE_WINDOW_START,OWS_AS_OF,psaCsv,validPsaDate,type PsaDataset,type PsaSurvey,type DatasetAvailability} from "../lib/psaDataSupport";
import {HrmsBadge,HrmsButton,HrmsEmptyState,HrmsTabs} from "./ui/HrmsPrimitives";
import type {Branch,Role} from "../lib/mock";
import styles from "./PsaDataSupportWorkspace.module.css";

const labels:Record<DatasetAvailability,string>={Recorded:"Recorded",Partial:"Partial", "No records":"No records", "Not tracked":"Not tracked"};
const tones:Record<DatasetAvailability,"success"|"warning"|"neutral">={Recorded:"success",Partial:"warning","No records":"neutral","Not tracked":"neutral"};
const escapeHtml=(s:unknown)=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]||c));
function downloadCsv(content:string,filename:string){
 const url=URL.createObjectURL(new Blob([content],{type:"text/csv;charset=utf-8"}));
 const a=document.createElement("a");a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function printPsaData(dataset:PsaDataset,establishment:string){
 const popup=window.open("","_blank");if(!popup){window.alert("Allow the print preview pop-up for this report.");return}
 const body=dataset.rows.map(row=>`<tr>${row.map(x=>`<td>${escapeHtml(x)}</td>`).join("")}</tr>`).join("");
 popup.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>PSA support - ${escapeHtml(dataset.title)}</title><style>body{font:12px/1.5 Arial,sans-serif;color:#1a2533;margin:24px}h1{font-size:20px}p{margin:6px 0}.warning{border:1px solid #d5ad55;background:#fff9eb;padding:10px;margin:16px 0}table{width:100%;border-collapse:collapse;margin-top:15px}td,th{border:1px solid #e2e8f0;padding:7px;text-align:left;vertical-align:top}th{background:#f8fafc}tr{break-inside:avoid}.buttons{text-align:right}@media print{.buttons{display:none}}@page{size:A4 landscape;margin:12mm}</style></head><body><div class="buttons"><button onclick="window.print()">Print</button> <button onclick="window.close()">Close</button></div><h1>${escapeHtml(dataset.title)}</h1><p><b>Establishment:</b> ${escapeHtml(establishment)} · <b>Reference:</b> ${escapeHtml(dataset.reference)}</p><p><b>Source:</b> ${escapeHtml(dataset.source)} · <b>Coverage:</b> ${escapeHtml(dataset.status)}</p><div class="warning"><b>Supporting HRMS data only — NOT an official PSA form, certified survey response, or proof of filing.</b> Browser-local data may be fictional or incomplete; HR must verify.</div>${dataset.notes.map(n=>`<p>${escapeHtml(n)}</p>`).join("")}<table><thead><tr>${dataset.columns.map(c=>`<th>${escapeHtml(c)}</th>`).join("")}</tr></thead><tbody>${body||`<tr><td colspan="${Math.max(1,dataset.columns.length)}">No records to display (not proof of zero).</td></tr>`}</tbody></table></body></html>`);
 popup.document.close();popup.focus();
}
export default function PsaDataSupportWorkspace({branch,role}:{branch:Branch;role:Role}){
 const {data,ready}=useHR();
 const today=useMemo(()=>dashboardTodayPH(),[]);
 const [survey,setSurvey]=useState<PsaSurvey>("OWS");
 const [establishment,setEstablishment]=useState<Shop|"">(branch==="All Shops"?"":branch);
 const [asOf,setAsOf]=useState(OWS_AS_OF);
 const [from,setFrom]=useState(ISLE_WINDOW_START);
 const [selectedId,setSelectedId]=useState("ows-roster");
 const [show,setShow]=useState<"all"|"with"|"missing">("all");
 const [search,setSearch]=useState("");
 const [page,setPage]=useState(1);
 useEffect(()=>{setEstablishment(branch==="All Shops"?"":branch)},[branch]);
 const allowed=(role==="Super Admin"||role==="HR"||role==="Special Final Approver — Ms Kate");
 const valid=validPsaDate(asOf)&&asOf<=today&&validPsaDate(from)&&from<=asOf;
 const datasets=useMemo(()=>!allowed||!establishment||!valid?[]:buildPsaDatasets(data,survey,establishment,asOf,from,today),[allowed,establishment,valid,data,survey,asOf,from,today]);
 const catalog=datasets.filter(d=>show==="all"||(show==="with"?d.rows.length>0:d.status==="Not tracked"||d.status==="No records"));
 const selected=catalog.find(d=>d.id===selectedId)||catalog[0];
 const matching=useMemo(()=>selected?.rows.filter(r=>r.join(" ").toLocaleLowerCase().includes(search.toLocaleLowerCase()))||[],[selected,search]);
 const pages=Math.max(1,Math.ceil(matching.length/10));const actualPage=Math.min(page,pages);const pageRows=matching.slice((actualPage-1)*10,actualPage*10);
 const changeSurvey=(next:PsaSurvey)=>{setSurvey(next);setSelectedId(next==="OWS"?"ows-roster":"isle-roster");setPage(1);setSearch("");setShow("all")};
 if(!allowed)return <section className="panel">PSA workforce and wage support data is restricted to authorized HR roles.</section>;
 return <section className={styles.root} aria-label="PSA data support">
  <div className={styles.heading}><div><h3>PSA Data Support</h3><p>Supporting HRMS records for manual filing of the official 2026 surveys.</p></div><HrmsBadge tone="info">Data support only</HrmsBadge></div>
  <HrmsTabs label="PSA survey" value={survey} onChange={changeSurvey} items={[{id:"OWS",label:"Occupational Wages Survey",icon:<FileSpreadsheet size={16}/>},{id:"ISLE",label:"Integrated Survey on Labor and Employment",icon:<Users size={16}/>}]} />
  <div className={styles.filters}>
   <label>Reporting establishment<select aria-label="Reporting establishment" value={establishment} onChange={e=>{setEstablishment(e.target.value as Shop|"");setPage(1)}}><option value="">Choose establishment</option>{shopNames.filter(name=>branch==="All Shops"||name===branch).map(name=><option key={name} value={name}>{name}</option>)}</select></label>
   <label><span><CalendarDays size={14}/> Reference date</span><input aria-label="Survey reference date" type="date" max={today} value={asOf} onChange={e=>{setAsOf(e.target.value);setPage(1)}}/></label>
   <label><span><CalendarDays size={14}/> Supporting period start</span><input aria-label="Supporting period start" type="date" max={asOf||today} value={from} onChange={e=>{setFrom(e.target.value);setPage(1)}}/></label>
  </div>
  <div className={styles.notice}><ShieldAlert size={18}/><span>These are <b>browser-local, potentially demonstration records</b>, not certified PSA answers. No automatic questionnaire filling or submission. Select a single establishment; never combine Underchargers and Mastermind as one filing unit. Historical staffing, pay and classifications may be incomplete.</span></div>
  {!valid&&<div className={styles.warning} role="alert">Enter valid dates: period start must be on or before the reference date, and the reference date cannot be in the future.</div>}
  {!establishment?<HrmsEmptyState icon={<FileText size={24}/>} title="Select the reporting establishment" description="Choose one establishment above to view datasets. All Shops is intentionally not an official filing scope."/>:valid&&!ready?<p className={styles.notice}>Loading existing HRMS records...</p>:valid&&<div className={styles.body}>
   <aside className={styles.catalog} aria-label="PSA dataset categories"><div className={styles.catalogTop}><strong>Available datasets</strong><span>{datasets.length} categories</span></div><div className={styles.filterButtons}><button className={show==="all"?styles.active:""} type="button" onClick={()=>setShow("all")}>All</button><button className={show==="with"?styles.active:""} type="button" onClick={()=>setShow("with")}>With rows</button><button className={show==="missing"?styles.active:""} type="button" onClick={()=>setShow("missing")}>Gaps</button></div><div className={styles.catalogList}>{catalog.map(item=><button type="button" key={item.id} className={`${styles.datasetButton} ${item.id===selected?.id?styles.selected:""}`} onClick={()=>{setSelectedId(item.id);setSearch("");setPage(1)}}><span>{item.title}</span><small>{labels[item.status]}{item.rows.length?` · ${item.rows.length} rows`:""}</small></button>)}{!catalog.length&&<p className={styles.emptySmall}>No datasets match this filter.</p>}</div></aside>
   <div className={styles.detail}>{selected&&<>
    <header className={styles.detailHead}><div><h4>{selected.title}</h4><p>{selected.reference} · {selected.source}</p></div><HrmsBadge tone={tones[selected.status]}>{labels[selected.status]}</HrmsBadge></header>
    <div className={styles.notes}><Info size={16}/><div>{selected.notes.map((note,i)=><p key={i}>{note}</p>)}</div></div>
    {selected.status==="Not tracked"?<HrmsEmptyState icon={<ShieldAlert size={22}/>} title="Not tracked in current HRMS" description="HR must obtain this information from other verified company records; no zero or estimated value is supplied."/>:<>
     <div className={styles.toolbar}><label className={styles.search}><Search size={16}/><input aria-label="Search supporting records" placeholder="Search supporting records..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}}/></label><div className={styles.actions}><HrmsButton size="sm" variant="secondary" onClick={()=>printPsaData(selected,establishment)} icon={<Printer size={16}/>}>Print</HrmsButton><HrmsButton size="sm" variant="primary" onClick={()=>downloadCsv(psaCsv(selected,establishment),`psa-${survey.toLowerCase()}-${selected.id}-${asOf}-${establishment.toLowerCase().replace(/[^a-z0-9]+/g,"-")}.csv`)} icon={<Download size={16}/>}>Export CSV</HrmsButton></div></div>
     <div role="region" tabIndex={0} aria-label="Supporting source records" className={styles.tableWrap}><table><thead><tr>{selected.columns.map((col,i)=><th key={i} scope="col">{col}</th>)}</tr></thead><tbody>{pageRows.map((row,i)=><tr key={`${actualPage}-${i}`}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}{!matching.length&&<tr><td colSpan={Math.max(1,selected.columns.length)} className={styles.noRows}>No matching records available. This does not establish a true zero for the survey.</td></tr>}</tbody></table></div>
     <div className={styles.footer}><span>{matching.length?`Showing ${(actualPage-1)*10+1}–${Math.min(actualPage*10,matching.length)} of ${matching.length} source rows`:"No source rows"} · Records must be validated by HR</span><div><HrmsButton size="sm" disabled={actualPage<=1} onClick={()=>setPage(actualPage-1)}>Previous</HrmsButton><span>{actualPage} / {pages}</span><HrmsButton size="sm" disabled={actualPage>=pages} onClick={()=>setPage(actualPage+1)}>Next</HrmsButton></div></div>
    </>}
   </>}</div>
  </div>}
 </section>;
}
