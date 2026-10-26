"use client";
import {useEffect,useMemo,useState,use,type FormEvent} from "react";
import IntakeQuestions from "../../../components/intake/IntakeQuestions";
import {INTAKE_EVENT,readIntakeForms,readIntakeResponses,saveIntakeResponses,uid,validateIntakeFields,activeIntakeFields,groupIntakeSections,cleanIntakeValues,type IntakeForm} from "../../../lib/intakeForms";
import {parsePortableLink} from "../../../lib/shareIntake";
import {exportIntakeHandoff} from "../../../lib/intakeResponseTransfer";
import "../../../app/intake-forms.css";
export default function EmployeeIntakePage({params}:{params:Promise<{id:string}>}){
 const {id}=use(params);
 const [forms,setForms]=useState<IntakeForm[]>([]),[portable,setPortable]=useState<IntakeForm|null>(null),[linkError,setLinkError]=useState(""),[isPortable,setIsPortable]=useState(false);
 const [ready,setReady]=useState(false),[step,setStep]=useState(0),[values,setValues]=useState<Record<string,string>>({}),[error,setError]=useState(""),[result,setResult]=useState("");
 useEffect(()=>{let active=true;const sync=()=>setForms(readIntakeForms());sync();window.addEventListener(INTAKE_EVENT,sync);
 const token=new URL(window.location.href).searchParams.get("s");setIsPortable(!!token);
 if(token){parsePortableLink(token,id).then(form=>{if(active)setPortable(form)}).catch(e=>{if(active)setLinkError(e instanceof Error?e.message:"Invalid link")}).finally(()=>{if(active)setReady(true)})}else setReady(true);
 return()=>{active=false;window.removeEventListener(INTAKE_EVENT,sync)}},[id]);
 const form=useMemo(()=>isPortable?portable:forms.find(x=>x.id===id&&x.target==="custom"&&x.status==="Published"),[isPortable,portable,forms,id]);
 const sections=useMemo(()=>groupIntakeSections(activeIntakeFields(form?.fields||[],values)),[form,values]);
 const currentStep=Math.min(step,Math.max(0,sections.length-1));
 const submit=(event:FormEvent)=>{event.preventDefault();if(!form)return;
 if(currentStep<sections.length-1){const stepErrors=validateIntakeFields((sections[currentStep]?.fields||[]).map(f=>({...f,showIf:undefined})),values);if(stepErrors.length)return setError(stepErrors[0]);setError("");setStep(currentStep+1);return;}
 const errors=validateIntakeFields(form.fields,values);if(errors.length)return setError(errors[0]);
 if(!window.confirm("Prepare a TEST response file? It will not reach HR automatically. Do not include confidential employee information."))return;
 const existing=readIntakeResponses();const record={id:uid("INTAKE"),formId:form.id,formTitle:form.title,formVersion:form.version,receivedAt:new Date().toISOString(),values:cleanIntakeValues(form.fields,values),fieldLabels:Object.fromEntries(activeIntakeFields(form.fields,values).map(x=>[x.id,x.label])),status:"New" as const};
 const saved=saveIntakeResponses([...existing,record]);exportIntakeHandoff(record);
 setValues({});setStep(0);setError("");setResult(`${record.id} prepared. A JSON handoff was downloaded. ${saved?"A test copy is saved on this device. ":""}Send the file to HR through an approved channel; HR must import it. No live submission occurred.`)};
 return <main className="intake-public"><div className="intake-public-card"><a href="/">HR Portal</a><h1>{form?.title||"Employee intake"}</h1>{form?.description&&<p>{form.description}</p>}
 <div className="intake-warning" role="note"><b>{isPortable?"Shared questionnaire preview":"Browser-only form demo"}.</b> {isPortable?"The questionnaire is a shared snapshot. Answers can be downloaded as a handoff file but cannot reach HR automatically. Do not enter real personal, confidential, or incident information.":"You can download a response handoff for HR to import. No secure live submission exists."}</div>
 {!ready?<p>Loading form…</p>:!form?<p role="alert">{linkError||"Form not published or available on this device."}</p>:<form onSubmit={submit}>
 {sections.length>1&&<div className="intake-step-progress" aria-label="Form section progress"><div><span>Section {currentStep+1} of {sections.length}</span><strong>{sections[currentStep]?.title}</strong></div><progress max={sections.length} value={currentStep+1}/></div>}
 <IntakeQuestions fields={sections[currentStep]?.fields||[]} values={values} showSections={false} resolveConditions={false} onChange={(key,value)=>{setError("");setResult("");setValues(s=>({...s,[key]:value}))}}/>
 {error&&<p role="alert" className="intake-error">{error}</p>}{result&&<p role="status" className="intake-success">{result}</p>}
 <div className="intake-step-actions">{currentStep>0&&<button type="button" className="intake-secondary" onClick={()=>{setStep(currentStep-1);setError("")}}>Previous</button>}<button type="submit" className="intake-primary">{currentStep<sections.length-1?"Next section":"Download Test Response for HR Import"}</button></div>
 </form>}</div></main>
}
