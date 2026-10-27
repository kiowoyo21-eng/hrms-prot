"use client";
import {useMemo,useState} from "react";

type DirectoryEmployee={id:string;name:string;branch:string;department:string;position:string;status?:string};
/** Typed search filters the directory; the selected Employee 201 ID is the only identity value saved. */
export default function Employee201Picker({label,people,value,onChange,disabled=false,excludeId="",required=true}: {
 label:string;people:readonly DirectoryEmployee[];value:string;onChange:(id:string)=>void;disabled?:boolean;excludeId?:string;required?:boolean;
}){
 const [query,setQuery]=useState("");
 const options=useMemo(()=>people.filter(p=>p.id!==excludeId&&(!query||`${p.name} ${p.id} ${p.position} ${p.department}`.toLowerCase().includes(query.toLowerCase()))).slice(0,100),[people,query,excludeId]);
 const selected=people.find(p=>p.id===value);
 return <div className="uc-employee-picker">
  <label>{label}{required?" *":""}<input type="search" aria-label={`Search ${label}`} autoComplete="off" placeholder="Search employee ID, name or position" value={query} disabled={disabled} onChange={e=>setQuery(e.target.value)} /></label>
  <select aria-label={`Select ${label} from Employee 201`} required={required} disabled={disabled} value={value} onChange={e=>onChange(e.target.value)}>
   <option value="">Select Employee 201 record</option>
   {selected&&!options.some(p=>p.id===selected.id)&&<option value={selected.id}>{selected.id} · {selected.name}</option>}
   {options.map(p=><option key={p.id} value={p.id}>{p.id} · {p.name} · {p.position}</option>)}
  </select>
  {selected?<small>Selected: {selected.id} · {selected.branch} · {selected.department} · {selected.position}</small>:<small>{options.length} matching employee(s). Names cannot be manually entered.</small>}
 </div>;
}
