"use client";
import {createContext,useContext,useEffect,useMemo,useRef,useState,type ReactNode} from "react";
import {createPortal} from "react-dom";
import {useFloatingPopover} from "./ui/useFloatingPopover";
import {visibleAlerts,dashboardAlertGroups,type AlertRegistry,type ModuleAlert} from "../lib/moduleAlertViews";
export type {ModuleAlert} from "../lib/moduleAlertViews";
import {Bell,ChevronRight,X} from "lucide-react";
import type {Branch,ModuleId} from "../lib/mock";
type Registry=AlertRegistry;
type ModuleNoticeAPI={registry:Registry;publish:(module:ModuleId,entries:ModuleAlert[])=>void;clear:()=>void};
const C=createContext<ModuleNoticeAPI|null>(null);
export function ModuleAlertsProvider({children}:{children:ReactNode}){
 const [registry,setRegistry]=useState<Registry>({});
 const value=useMemo<ModuleNoticeAPI>(()=>({registry,publish:(module,entries)=>setRegistry(old=>JSON.stringify(old[module]||[])===JSON.stringify(entries)?old:{...old,[module]:entries}),clear:()=>setRegistry({})}),[registry]);
 return <C.Provider value={value}>{children}</C.Provider>;
}
export function useModuleAlerts(){const context=useContext(C);if(!context)throw new Error("ModuleAlertsProvider required");return context}
export function usePublishModuleAlerts(module:ModuleId,alerts:ModuleAlert[]){
 const {publish}=useModuleAlerts();const serialized=JSON.stringify(alerts);
 useEffect(()=>{publish(module,JSON.parse(serialized) as ModuleAlert[])},[module,serialized,publish]);
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
