"use client";
import {createContext,useCallback,useContext,useEffect,useMemo,useRef,useState,type ReactNode} from "react";
import {createPortal} from "react-dom";
import {useFloatingPopover} from "./ui/useFloatingPopover";
import {visibleAlerts,dashboardAlertGroups,mergeAlertSources,type AlertRegistry,type AlertSources,type ModuleAlert} from "../lib/moduleAlertViews";
export type {ModuleAlert} from "../lib/moduleAlertViews";
import {Bell,ChevronRight,X} from "lucide-react";
import type {Branch,ModuleId} from "../lib/mock";
type Registry=AlertRegistry;
type ModuleNoticeAPI={registry:Registry;publish:(module:ModuleId,entries:ModuleAlert[],source?:string)=>void;clear:()=>void};
const C=createContext<ModuleNoticeAPI|null>(null);
export function ModuleAlertsProvider({children}:{children:ReactNode}){
 // Different publishers (e.g. payroll cutoff monitor and Payroll workspace) must not overwrite each other.
 const [sources,setSources]=useState<AlertSources>({});
 const publish=useCallback((module:ModuleId,entries:ModuleAlert[],source="workspace")=>setSources(old=>{
  const current:Record<string,ModuleAlert[]>=old[module]||{};
  if(JSON.stringify(current[source]||[])===JSON.stringify(entries))return old;
  return {...old,[module]:{...current,[source]:entries}};
 }),[]);
 const clear=useCallback(()=>setSources({}),[]);
 const registry=useMemo<Registry>(()=>mergeAlertSources(sources),[sources]);
 const value=useMemo<ModuleNoticeAPI>(()=>({registry,publish,clear}),[registry,publish,clear]);
 return <C.Provider value={value}>{children}</C.Provider>;
}
export function useModuleAlerts(){const context=useContext(C);if(!context)throw new Error("ModuleAlertsProvider required");return context}
export function usePublishModuleAlerts(module:ModuleId,alerts:ModuleAlert[],source="workspace"){
 const {publish}=useModuleAlerts();const serialized=JSON.stringify(alerts);
 useEffect(()=>{publish(module,JSON.parse(serialized) as ModuleAlert[],source)},[module,source,serialized,publish]);
}
export function ModuleAlertButton({module,branch,onOpen}:{module:ModuleId;branch:Branch;onOpen?:(alert:ModuleAlert)=>void}){
 const {registry}=useModuleAlerts();const [open,setOpen]=useState(false);
 const anchor=useRef<HTMLButtonElement>(null);
 const alerts=visibleAlerts(registry,module,branch);
 const floating=useFloatingPopover(open,anchor,355);
 useEffect(()=>{if(!open)return;const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape")setOpen(false)};
 const onOutside=(e:PointerEvent)=>{const node=e.target as Node;if(!anchor.current?.contains(node)&&!floating.panel.current?.contains(node))setOpen(false)};
 document.addEventListener("pointerdown",onOutside);document.addEventListener("keydown",onKey);
 return()=>{document.removeEventListener("pointerdown",onOutside);document.removeEventListener("keydown",onKey)};
 },[open,floating.panel]);
 return <div className="mu-bell-wrap"><button ref={anchor} type="button" className="mu-bell" aria-label={`${alerts.length} module notifications`} aria-expanded={open} aria-haspopup="true" onClick={()=>setOpen(p=>!p)}><Bell size={17}/>{alerts.length>0&&<span>{alerts.length}</span>}</button>{open&&createPortal(<div ref={floating.panel} style={floating.style} className="mu-notice-popover uc-fixed-popover" role="region" aria-label="Module notifications"><div className="mu-notice-head"><b>Module Notifications</b><button type="button" aria-label="Close notifications" onClick={()=>setOpen(false)}><X size={15}/></button></div>{alerts.length===0?<p className="mu-notice-empty">No pending actions in the loaded records.</p>:alerts.map(item=><button key={item.id} type="button" className="mu-notice-item" onClick={()=>{onOpen?.(item);if(module==="payroll"&&typeof window!=="undefined"){if(item.id.startsWith("loan-"))window.dispatchEvent(new CustomEvent("ucmm-payroll-open",{detail:{area:"loans"}}));else if(item.action?.startsWith("payroll:"))window.dispatchEvent(new CustomEvent("ucmm-payroll-open",{detail:{area:item.action.slice(8)}}));}setOpen(false)}}><span className={item.level==="urgent"?"mu-notice-dot is-urgent":"mu-notice-dot"}/><span><b>{item.title}</b><small>{item.detail}</small></span><ChevronRight size={14}/></button>)}</div>,document.body)}</div>;
}
export function ModuleAlertSummary({module,branch}:{module:ModuleId;branch:Branch}){const {registry}=useModuleAlerts();const alerts=visibleAlerts(registry,module,branch);if(!alerts.length)return <span>No pending actions in loaded records</span>;return <span>{alerts.length} requiring action · {alerts.filter(a=>a.level==="urgent").length} high priority</span>}
export function DashboardModuleAlerts({branch,onNavigate,allowed}:{branch:Branch;onNavigate:(id:ModuleId)=>void;allowed:ModuleId[]}){
 const {registry}=useModuleAlerts();const items=dashboardAlertGroups(registry,allowed,branch);
 return <section className="panel mu-dashboard-alerts"><div className="panel-head"><h3>Pending Actions by Module</h3></div>{items.length===0?<p className="muted">Open each module to review its records and current action items.</p>:<div className="mu-dashboard-grid">{items.map(x=><button type="button" key={x.id} onClick={()=>onNavigate(x.id)}><span><b>{x.id==="lifecycle"?"Recruitment & Hiring":x.id==="ir"?"Incident Reports":x.id==="compliance"?"Government Compliance":x.id==="employees"?"Employee 201":x.id==="assets"?"Assets & Devices":x.id==="leave"?"Leave Management":x.id==="documents"?"Documents":x.id==="payroll"?"Payroll Management":x.id}</b><small>{x.items.filter(y=>y.level==="urgent").length} urgent</small></span><strong>{x.items.length}</strong></button>)}</div>}</section>;
}

/** A single accessible notification entry point visible on every authorized HRMS page.
 * Pending actions only; no fabricated events, delivery/read state, or push notifications.
 */
export function UniversalNotificationCenter({current,branch,allowed,onNavigate}:{current:ModuleId;branch:Branch;allowed:ModuleId[];onNavigate:(module:ModuleId)=>void}){
 const {registry}=useModuleAlerts();
 const [open,setOpen]=useState(false);
 const [scope,setScope]=useState<"module"|"all">("all");
 const anchor=useRef<HTMLButtonElement>(null);
 const floating=useFloatingPopover(open,anchor,410);
 const groups=dashboardAlertGroups(registry,allowed,branch);
 const allCount=groups.reduce((sum,group)=>sum+group.items.length,0);
 const currentCount=groups.find(group=>group.id===current)?.items.length||0;
 const displayed=scope==="all"?groups:groups.filter(group=>group.id===current);
 const nameOf=(id:ModuleId)=>({loans:"Payroll Management",ir:"Incident Reports",lifecycle:"Recruitment & Hiring",employees:"Employee 201"} as Partial<Record<ModuleId,string>>)[id]||({dashboard:"Dashboard",submissions:"Submit Employee Documents",assets:"Assets & Devices",compliance:"Government Compliance",documents:"Employee Documents",payroll:"Payroll Management",leave:"Leave Management",filters:"Reports & Analytics",drive:"HRMS Drive",spreadsheets:"Spreadsheets",studio:"Document Library",audit:"Audit Logs",settings:"Settings"} as Partial<Record<ModuleId,string>>)[id]||id;
 useEffect(()=>{setOpen(false);setScope(current==="dashboard"?"all":"module")},[current]);
 useEffect(()=>{if(!open)return;
  const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape")setOpen(false)};
  const onOutside=(e:PointerEvent)=>{const node=e.target as Node;if(!anchor.current?.contains(node)&&!floating.panel.current?.contains(node))setOpen(false)};
  document.addEventListener("keydown",onKey);document.addEventListener("pointerdown",onOutside);
  return()=>{document.removeEventListener("keydown",onKey);document.removeEventListener("pointerdown",onOutside)};
 },[open,floating.panel]);
 return <div className="mu-global-wrap">
  <button type="button" className="mu-global-trigger" ref={anchor} onClick={()=>setOpen(value=>!value)}
   aria-label={`Open HRMS notifications, ${allCount} pending actions across accessible modules`} aria-haspopup="dialog" aria-expanded={open} title="Notifications across authorized modules">
   <Bell size={18}/>{allCount>0&&<span className="mu-global-count">{allCount>99?"99+":allCount}</span>}
  </button>
  {open&&createPortal(<section ref={floating.panel} style={floating.style} role="dialog" aria-label="HRMS module notifications" className="mu-global-panel">
   <header className="mu-global-head"><div><strong>Notifications</strong><small>Pending actions in loaded HRMS records</small></div><button className="mu-global-close" aria-label="Close notifications" onClick={()=>setOpen(false)} type="button"><X size={17}/></button></header>
   <div className="mu-global-tabs" role="group" aria-label="Notification scope">
    <button type="button" aria-pressed={scope==="module"} className={scope==="module"?"selected":""} onClick={()=>setScope("module")}>This module ({currentCount})</button>
    <button type="button" aria-pressed={scope==="all"} className={scope==="all"?"selected":""} onClick={()=>setScope("all")}>All modules ({allCount})</button>
   </div>
   <div className="mu-global-list">
    {displayed.length===0?<p className="mu-global-empty">No pending actions recorded {scope==="module"?`for ${nameOf(current)}`:"for the accessible modules"}. Modules without recorded action alerts will appear empty.</p>:displayed.map(group=><div key={group.id} className="mu-global-group">
     <div className="mu-global-group-heading"><strong>{nameOf(group.id)}</strong><span>{group.items.length}</span></div>
     {group.items.slice(0,10).map(alert=><button className="mu-global-item" type="button" key={`${group.id}:${alert.id}`} onClick={()=>{setOpen(false);onNavigate(group.id)}} aria-label={`Open ${nameOf(group.id)}: ${alert.title}`}>
      <span className={alert.level==="urgent"?"mu-global-dot urgent":"mu-global-dot"}/><span className="mu-global-detail"><strong>{alert.title}</strong><small>{alert.detail}</small></span><ChevronRight size={15}/>
     </button>)}
     {group.items.length>10&&<button className="mu-global-more" type="button" onClick={()=>{setOpen(false);onNavigate(group.id)}}>Open {nameOf(group.id)} to review {group.items.length-10} more pending actions <ChevronRight size={14}/></button>}
    </div>)}
   </div>
   <footer className="mu-global-foot">Opens the owning module for review. This is a browser-only pending-action list, not an email or push-notification service.</footer>
  </section>,document.body)}
 </div>;
}
