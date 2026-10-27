"use client";
import {useState} from "react";
import {Folders,Files} from "lucide-react";
import DocumentWorkspace from "./DocumentWorkspace";
import StudioIndex from "./studio/StudioIndex";
import type {Branch,Role} from "../lib/mock";
type Section="library"|"templates";
export default function DocumentOperationsHub({role,branch}:{role:Role;branch:Branch}){
 const [section,setSection]=useState<Section>("library");
 return <div className="docops-root"><nav className="docops-file-tabs" aria-label="Employee document workspaces">
 <button type="button" className={`secondary ${section==="library"?"active":""}`} onClick={()=>setSection("library")}><Folders size={16}/> Document Library</button>
 <button type="button" className={`secondary ${section==="templates"?"active":""}`} onClick={()=>setSection("templates")}><Files size={16}/> Document Templates</button>
 </nav>{section==="library"?<DocumentWorkspace branch={branch} role={role}/>:<div className="studio-scope"><StudioIndex embedded initialMode="Templates"/></div>}</div>;
}
