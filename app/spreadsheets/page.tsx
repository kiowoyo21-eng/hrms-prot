"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {HRProvider} from "../../lib/hrState";
import {activeDemoUser,subscribeSheetChanges,touchDemoSession,type SheetActor} from "../../lib/spreadsheetStore";
import SpreadsheetWorkspace from "../../components/SpreadsheetWorkspace";
export default function SpreadsheetPage(){const [actor,setActor]=useState<SheetActor|null>(null),[ready,setReady]=useState(false);
 useEffect(()=>{const sync=()=>{setActor(activeDemoUser());setReady(true)};sync();const unsub=subscribeSheetChanges(sync);window.addEventListener("focus",sync);document.addEventListener("visibilitychange",sync);const activity=()=>{touchDemoSession()};window.addEventListener("pointerdown",activity);window.addEventListener("keydown",activity);const t=window.setInterval(sync,15000);return ()=>{unsub();window.removeEventListener("focus",sync);document.removeEventListener("visibilitychange",sync);window.removeEventListener("pointerdown",activity);window.removeEventListener("keydown",activity);window.clearInterval(t)}},[]);
 if(!ready)return <main className="sw-auth"><p>Loading spreadsheet workspace…</p></main>;
 if(!actor)return <main className="sw-auth"><h1>Sign in to HRMS first</h1><p>The spreadsheet requires an active HRMS demo session.</p><Link href="/">Go to HRMS login</Link></main>;
 if(actor.role==="BM")return <main className="sw-auth"><h1>Restricted workspace</h1><p>Employee and payroll spreadsheets are limited to HR and Super Admin.</p><Link href="/">Back to HRMS</Link></main>;
 return <HRProvider><SpreadsheetWorkspace key={`${actor.username}-${actor.role}`} actor={actor} branch="All Shops"/></HRProvider>
}
