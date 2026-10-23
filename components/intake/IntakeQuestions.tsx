"use client";
import {Fragment} from "react";
import "../../app/intake-forms.css";
import {activeIntakeFields,groupIntakeSections,type IntakeField} from "../../lib/intakeForms";
export default function IntakeQuestions({fields,values,onChange,disabled=false,showSections=true,resolveConditions=true}:{fields:IntakeField[];values:Record<string,string>;onChange:(key:string,value:string)=>void;disabled?:boolean;showSections?:boolean;resolveConditions?:boolean}){
 const groups=groupIntakeSections(resolveConditions?activeIntakeFields(fields,values):fields);
 return <div className="intake-questions">{groups.map((group,index)=><Fragment key={`${index}-${group.title}`}>
 {showSections&&group.title!=="Questions"&&<h3 className="intake-section-heading">{group.title}</h3>}
 {group.fields.map(f=><div className="intake-field" key={f.id}><label htmlFor={`intake-${f.id}`}>{f.label}{f.required?" *":""}</label>{f.help&&<small>{f.help}</small>}
 {f.type==="paragraph"?<textarea id={`intake-${f.id}`} rows={3} maxLength={2000} required={f.required} disabled={disabled} value={values[f.id]||""} onChange={e=>onChange(f.id,e.target.value)}/>:
 f.type==="radio"||f.type==="checkbox"?<fieldset className="intake-choice-group"><legend className="intake-sr-only">{f.label}</legend>{f.options.map(o=>{const chosen=f.type==="radio"?values[f.id]===o:(values[f.id]||"").split(" || ").includes(o);return <label key={o} className="intake-choice"><input type={f.type} disabled={disabled} name={f.id} checked={chosen} onChange={e=>{if(f.type==="radio")onChange(f.id,o);else{const before=(values[f.id]||"").split(" || ").filter(Boolean);onChange(f.id,(e.target.checked?[...before.filter(x=>x!==o),o]:before.filter(x=>x!==o)).join(" || "))}}}/>{o}</label>})}</fieldset>:
 f.type==="select"?<select id={`intake-${f.id}`} required={f.required} disabled={disabled} value={values[f.id]||""} onChange={e=>onChange(f.id,e.target.value)}><option value="">Choose an option</option>{f.options.map(o=><option key={o} value={o}>{o}</option>)}</select>:
 <input id={`intake-${f.id}`} disabled={disabled} type={f.type==="short"?"text":f.type} required={f.required} maxLength={2000} value={values[f.id]||""} onChange={e=>onChange(f.id,e.target.value)}/>}</div>)}
 </Fragment>)}</div>
}
