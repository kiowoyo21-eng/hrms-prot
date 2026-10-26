"use client";
import {useState} from "react";
import {ArrowLeft,ArrowRight,Folders,Files,FileCheck2,ExternalLink} from "lucide-react";
import DocumentWorkspace from "./DocumentWorkspace";
import DocumentIntake from "./DocumentIntake";
import StudioIndex from "./studio/StudioIndex";
import type {Branch,Role} from "../lib/mock";

type Section="library"|"templates"|"verification";
const spaces=[
 {id:"library" as Section,label:"Document Library",hint:"Browse employee files and organized document folders",Icon:Folders,tone:"gold"},
 {id:"templates" as Section,label:"Document Templates",hint:"Upload existing templates or create new HR documents",Icon:Files,tone:"blue"},
 {id:"verification" as Section,label:"Document Verification",hint:"Review pending submissions and supporting evidence",Icon:FileCheck2,tone:"green"}
];
export default function DocumentOperationsHub({role,branch}:{role:Role;branch:Branch}){
 const [section,setSection]=useState<Section>("library");
 const selected=spaces.find(s=>s.id===section);
 return <div className="docops-root">
  <nav className="docops-file-tabs" aria-label="Employee document workspaces">
  {spaces.map(({id,label,Icon})=><button type="button" key={id} className={`secondary ${section===id?"active":""}`} aria-current={section===id?"page":undefined} onClick={()=>setSection(id)}><Icon size={16}/>{label}</button>)}
  </nav>
  {section==="library"&&<DocumentWorkspace branch={branch} role={role}/>}
  {section==="templates"&&<StudioIndex embedded initialMode="Templates"/>}
  {section==="verification"&&<DocumentIntake branch={branch} role={role}/>}
 </div>;
}
