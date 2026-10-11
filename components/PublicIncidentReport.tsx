"use client";
import {useState,type FormEvent} from "react";
import {ArrowLeft,ArrowRight,AlertTriangle,CheckCircle2,ClipboardCheck,Download,FileText,HelpCircle,LockKeyhole,ShieldAlert,ShieldCheck} from "lucide-react";
import {getIncidentRouting,type IncidentRespondentType} from "../lib/incidentRouting";

type IncidentForm = {
  branch: string;
  respondentType: "" | IncidentRespondentType;
  respondentName: string;
  category: string;
  incidentDate: string;
  incidentLocation: string;
  summary: string;
  description: string;
  witnesses: string;
  desiredAction: string;
  contactPreference: "with_contact" | "without_contact";
  reporterName: string;
  contact: string;
  urgency: "Normal" | "Urgent";
};
const empty:IncidentForm={branch:"",respondentType:"",respondentName:"",category:"",incidentDate:"",incidentLocation:"",summary:"",description:"",witnesses:"",desiredAction:"",contactPreference:"with_contact",reporterName:"",contact:"",urgency:"Normal"};
const BRANCHES=["UC Mandaluyong","UC Las Piñas","UC Quezon City","MM Mandaluyong"];
const CATEGORIES=["Workplace behavior / conduct","Harassment / discrimination","Safety / health concern","Workplace conflict","Policy or procedure concern","Other concern"];
const describeTarget=[
  {value:"branch_manager",label:"A Branch Manager",desc:"HR receives this privately. The Branch Manager being reported is not a recipient."},
  {value:"other_staff",label:"Another employee or staff member",desc:"The relevant Branch Manager handles the case; HR is copied."},
  {value:"unsure",label:"I'm not sure / prefer HR screening",desc:"HR receives the report for an initial confidential routing decision."},
] as const;
function makeTextFile(data:IncidentForm){
  const recipient=getIncidentRouting(data.respondentType as IncidentRespondentType);
  const lines=[
    "UNDERCHARGERS | WORKPLACE INCIDENT REPORT — PERSONAL DRAFT",
    "NOT SUBMITTED. This file is not an official received report.","",
    `Branch: ${data.branch}`,
    `Concerning: ${describeTarget.find(x=>x.value===data.respondentType)?.label||""}`,
    `Routing recommendation: ${recipient.heading}`,
    `Reported person: ${data.respondentName||"Not specified"}`,
    `Concern category: ${data.category}`,
    `Date of incident: ${data.incidentDate||"Not specified"}`,
    `Location: ${data.incidentLocation||"Not specified"}`,
    `Urgency: ${data.urgency}`,
    `Subject: ${data.summary}`,
    `Description:\n${data.description}`,
    `Witnesses / other people involved:\n${data.witnesses||"None identified"}`,
    `Requested follow-up:\n${data.desiredAction||"Not specified"}`,
    `Reporter: ${data.contactPreference==="without_contact"?"Name not supplied":data.reporterName||"Not specified"}`,
    `Contact: ${data.contactPreference==="without_contact"?"Not supplied":data.contact||"Not specified"}`,
    "","This local draft has NOT been transmitted to HR or any Branch Manager.",
  ].join("\r\n");
  const blob=new Blob([lines],{type:"text/plain;charset=utf-8"});
  const url=URL.createObjectURL(blob);const anchor=document.createElement("a");anchor.href=url;
  anchor.download="underchargers-workplace-report-draft.txt";anchor.click();
  window.setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export default function PublicIncidentReport(){
  const [form,setForm]=useState<IncidentForm>(empty);
  const [step,setStep]=useState<1|2>(1);
  const [errors,setErrors]=useState<string[]>([]);
  const set=<K extends keyof IncidentForm>(key:K,value:IncidentForm[K])=>setForm(prev=>({...prev,[key]:value}));
  const routing=form.respondentType?getIncidentRouting(form.respondentType):null;
  function review(e:FormEvent<HTMLFormElement>){
    e.preventDefault();const missing:string[]=[];
    if(!form.branch)missing.push("Select the branch involved.");
    if(!form.respondentType)missing.push("Select who the concern is about.");
    if(!form.category)missing.push("Select the type of concern.");
    if(!form.summary.trim())missing.push("Enter a short subject.");
    if(form.description.trim().length<30)missing.push("Describe what happened in at least 30 characters.");
    if(missing.length){setErrors(missing);return;}
    setErrors([]);setStep(2);window.scrollTo({top:0,behavior:"smooth"});
  }
  function edit(){setStep(1);window.scrollTo({top:0,behavior:"smooth"})}
  return <main className="public-ir-page">
    <div className="public-ir-shell">
      <header className="public-ir-brand">
        <div className="brand-mark" aria-hidden="true">UC</div>
        <div><strong>UNDERCHARGERS</strong><span>Employee Relations · Workplace Reporting</span></div>
        <a className="public-ir-home" href="/">HR Portal <ArrowRight size={14}/></a>
      </header>
      <div className="public-ir-header"><span className="public-ir-eyebrow"><ShieldCheck size={15}/> Workplace Concern & Incident Report</span><h1>Tell us what happened.</h1><p>Use this form to describe a workplace concern, policy issue, or incident. No HR account or login is needed to open the form.</p></div>
      <div className="public-ir-unavailable" role="note"><ShieldAlert size={22}/><div><strong>Form preview — submissions are not yet active</strong><p>This website currently has no secure report-receiving service. Your information stays in this open page and is <b>not sent</b> to HR or any Branch Manager. Do not enter actual confidential details during testing. Once secure receiving and access restrictions are configured, this page can become the public reporting link.</p></div></div>
      <div className="public-ir-progress" aria-label="Report progress"><div className={step>=1?"public-ir-progress-on":""}><span>1</span>Report details</div><div className={step>=2?"public-ir-progress-on":""}><span>2</span>Review your answers</div></div>
      {step===1?<form onSubmit={review} noValidate className="public-ir-form">
        <section className="public-ir-card"><div className="public-ir-section-title"><span className="public-ir-section-icon"><FileText size={21}/></span><div><h2>About the concern</h2><p>Select where it happened and who the concern involves.</p></div></div>
          <div className="public-ir-fields">
            <label className="public-ir-field">Branch involved <em>Required</em><select value={form.branch} onChange={e=>set("branch",e.target.value)} required><option value="">Select a branch</option>{BRANCHES.map(x=><option key={x}>{x}</option>)}</select></label>
            <fieldset className="public-ir-target"><legend>Who is the concern about? <em>Required</em></legend><p className="public-ir-hint">Your choice determines the intended reviewer. Select “A Branch Manager” if the person involved is a BM, including your own.</p>{describeTarget.map(option=><label key={option.value} className={`public-ir-option ${form.respondentType===option.value?"selected":""}`}><input type="radio" name="reported-role" value={option.value} checked={form.respondentType===option.value} onChange={()=>set("respondentType",option.value)}/><span><strong>{option.label}</strong><small>{option.desc}</small></span></label>)}</fieldset>
            {routing&&<div className={`public-ir-route ${routing.handler==="HR"?"private":""}`} aria-live="polite"><LockKeyhole size={19}/><div><strong>Intended routing: {routing.heading}</strong><p>{routing.explanation}</p><small>Routing is shown as a preview only; no notification or record is sent.</small></div></div>}
            <label className="public-ir-field">Name / position of person involved <span>Optional</span><input value={form.respondentName} onChange={e=>set("respondentName",e.target.value)} placeholder="Name or position, if known"/></label>
            <label className="public-ir-field">Concern type <em>Required</em><select value={form.category} onChange={e=>set("category",e.target.value)} required><option value="">Select concern category</option>{CATEGORIES.map(x=><option key={x}>{x}</option>)}</select></label>
          </div>
        </section>
        <section className="public-ir-card"><div className="public-ir-section-title"><span className="public-ir-section-icon"><ClipboardCheck size={21}/></span><div><h2>Incident details</h2><p>Include what happened, when, and where. Specific facts help the reviewer understand the concern.</p></div></div>
          <div className="public-ir-fields"><div className="public-ir-two"><label className="public-ir-field">Date of incident <span>Optional</span><input type="date" value={form.incidentDate} onChange={e=>set("incidentDate",e.target.value)}/></label><label className="public-ir-field">Urgency <span>Optional</span><select value={form.urgency} onChange={e=>set("urgency",e.target.value as IncidentForm["urgency"])}><option>Normal</option><option>Urgent</option></select></label></div>
            <label className="public-ir-field">Location / work area <span>Optional</span><input value={form.incidentLocation} onChange={e=>set("incidentLocation",e.target.value)} placeholder="Example: workshop, front desk or work group"/></label>
            <label className="public-ir-field">Short subject <em>Required</em><input value={form.summary} maxLength={140} onChange={e=>set("summary",e.target.value)} placeholder="Summarize the main concern in one sentence"/></label>
            <label className="public-ir-field">What happened? <em>Required</em><textarea rows={7} maxLength={5000} value={form.description} onChange={e=>set("description",e.target.value)} placeholder="Describe what occurred in your own words. Include sequence, circumstances, dates and people involved if known."/><small className="public-ir-hint">At least 30 characters. Avoid unnecessary private information about other people.</small></label>
            <label className="public-ir-field">Witnesses or other people involved <span>Optional</span><textarea rows={3} value={form.witnesses} onChange={e=>set("witnesses",e.target.value)} placeholder="Names, positions, or what they may have observed"/></label>
            <label className="public-ir-field">What follow-up would you like? <span>Optional</span><textarea rows={3} value={form.desiredAction} onChange={e=>set("desiredAction",e.target.value)} placeholder="Example: a private discussion, investigation, workplace safety action"/></label>
            <div className="public-ir-help"><HelpCircle size={18}/><span>Supporting files and photographs will be added after secure attachment storage, malware scanning, size limits, and access rules are available. This preview does not accept confidential evidence.</span></div>
          </div>
        </section>
        <section className="public-ir-card"><div className="public-ir-section-title"><span className="public-ir-section-icon"><ShieldCheck size={21}/></span><div><h2>About you</h2><p>You may supply contact details so the reviewer can request clarification.</p></div></div>
          <div className="public-ir-fields"><fieldset className="public-ir-target"><legend>Would you like to provide contact details?</legend><label className="public-ir-option"><input type="radio" name="reporter-contact" checked={form.contactPreference==="with_contact"} onChange={()=>set("contactPreference","with_contact")}/><span><strong>Yes, I can be contacted</strong><small>Provide a name and a way to reach you if you wish.</small></span></label><label className="public-ir-option"><input type="radio" name="reporter-contact" checked={form.contactPreference==="without_contact"} onChange={()=>set("contactPreference","without_contact")}/><span><strong>No, I prefer not to provide my name</strong><small>In a future live form, details of the incident itself may still indirectly identify someone; absolute anonymity cannot be promised.</small></span></label></fieldset>
          {form.contactPreference==="with_contact"&&<div className="public-ir-two"><label className="public-ir-field">Your name <span>Optional</span><input autoComplete="name" value={form.reporterName} onChange={e=>set("reporterName",e.target.value)} placeholder="Full name"/></label><label className="public-ir-field">Phone or email <span>Optional</span><input autoComplete="off" value={form.contact} onChange={e=>set("contact",e.target.value)} placeholder="Contact for private follow-up"/></label></div>}
          </div>
        </section>
        {errors.length>0&&<div className="public-ir-errors" role="alert"><strong>Please check the following:</strong><ul>{errors.map(x=><li key={x}>{x}</li>)}</ul></div>}
        <div className="public-ir-foot-actions"><span>Required fields are marked. This form is not connected to HR yet.</span><button className="primary" type="submit">Review Report <ArrowRight size={18}/></button></div>
      </form>:<div className="public-ir-review">
        <section className="public-ir-card"><div className="public-ir-section-title"><span className="public-ir-section-icon"><ClipboardCheck size={21}/></span><div><h2>Review your report</h2><p>Check your answers and the intended routing. Nothing has been submitted.</p></div></div>
          <div className="public-ir-review-grid">
            {([ ["Branch",form.branch],["Concern about",describeTarget.find(x=>x.value===form.respondentType)?.label||""],["Intended handler",routing?.heading||""],["Person named",form.respondentName||"Not specified"],["Category",form.category],["Urgency",form.urgency],["Incident date",form.incidentDate||"Not specified"],["Work area",form.incidentLocation||"Not specified"],["Reporter",form.contactPreference==="without_contact"?"Name not provided":form.reporterName||"Not provided"],["Contact",form.contactPreference==="without_contact"?"Not provided":form.contact||"Not provided"]] as [string,string][]).map(([label,value])=><div key={label}><span>{label}</span><strong>{value}</strong></div>)}
          </div><div className="public-ir-review-text"><h3>Subject</h3><p>{form.summary}</p><h3>What happened</h3><p>{form.description}</p><h3>Witnesses / other people involved</h3><p>{form.witnesses||"None provided"}</p><h3>Requested follow-up</h3><p>{form.desiredAction||"None provided"}</p></div>
        </section><div className="public-ir-unavailable"><AlertTriangle size={21}/><div><strong>This is a draft, not a case submission.</strong><p>No report was sent, no email was issued, and no case number has been created. Secure submissions require the future backend.</p></div></div><div className="public-ir-foot-actions"><button className="secondary" onClick={edit}><ArrowLeft size={17}/> Edit Answers</button><button className="primary" onClick={()=>makeTextFile(form)}><Download size={17}/> Download Personal Draft</button></div>
      </div>}
      <footer className="public-ir-footer"><span>Underchargers · Workplace Reporting</span><span>Frontend review only · No confidential information should be entered while testing</span></footer>
    </div>
  </main>;
}
