"use client";
import NativeDocuments from "./workspace/NativeDocuments";
import {useEffect,useState} from "react";
import {Folders,Files} from "lucide-react";
import DocumentWorkspace from "./DocumentWorkspace";
import StudioIndex from "./studio/StudioIndex";
import type {Branch,Role} from "../lib/mock";
type Section="library"|"templates"|"routing";
export default function DocumentOperationsHub({role,branch,username}:{role:Role;branch:Branch;username?:string}){
 const [section,setSection]=useState<Section>("library");
 useEffect(()=>{const sync=()=>{if(sessionStorage.getItem("uc-workspace-pending-document"))setSection("routing")};sync();window.addEventListener("uc-hrms-open-workspace-record",sync);return()=>window.removeEventListener("uc-hrms-open-workspace-record",sync)},[]);
 return <div className="docops-root"><nav className="docops-file-tabs" aria-label="Employee document workspaces">
 <button type="button" className={`secondary ${section==="library"?"active":""}`} onClick={()=>setSection("library")}><Folders size={16}/> Document Library</button>
 <button type="button" className={`secondary ${section==="templates"?"active":""}`} onClick={()=>setSection("templates")}><Files size={16}/> Document Templates</button>
 {username&&<button type="button" className={`secondary ${section==="routing"?"active":""}`} onClick={()=>setSection("routing")}>Routing & Signing</button>}</nav>{section==="routing"&&username?<NativeDocuments key={branch+username} actor={{username,role,branch}}/>:section==="library"?<DocumentWorkspace branch={branch} role={role}/>:<div className="studio-scope"><StudioIndex embedded initialMode="Templates"/></div>}</div>;
}
