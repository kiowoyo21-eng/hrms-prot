"use client";

import {useState, type ChangeEvent, type FormEvent} from "react";
import {AlertTriangle, ArrowRight, BriefcaseBusiness, FileCheck2, FileUp, Info, Send, UserRound} from "lucide-react";

type ApplicationFields = {
  fullName:string;
  email:string;
  phone:string;
  position:string;
  otherPosition:string;
  preferredBranch:string;
  experience:string;
  introduction:string;
};

const INITIAL:ApplicationFields = {
  fullName:"",email:"",phone:"",position:"",otherPosition:"",preferredBranch:"",experience:"",introduction:"",
};
const BRANCHES = ["UC Mandaluyong","UC Las Piñas","UC Quezon City","MM Mandaluyong","Open to any branch"];
const POSITIONS = ["Automotive Technician / Mechanic","Service Advisor","Branch Operations","Marketing / Content Creator","Administration / HR","Other"];
const MAX_RESUME_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = /\.(pdf|doc|docx)$/i;
function validEmail(value:string){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);}
function validPhone(value:string){return /^[+\d\s().-]+$/.test(value) && value.replace(/\D/g,"").length>=7 && value.replace(/\D/g,"").length<=15;}

export default function PublicJobApplication(){
  const [form,setForm]=useState<ApplicationFields>(INITIAL);
  const [resume,setResume]=useState<File|null>(null);
  const [fileError,setFileError]=useState("");
  const [errors,setErrors]=useState<string[]>([]);
  const update=(field:keyof ApplicationFields,value:string)=>{setForm(previous=>({...previous,[field]:value}));if(errors.length)setErrors([]);};

  function chooseResume(e:ChangeEvent<HTMLInputElement>){
    const file=e.target.files?.[0] ?? null;
    setFileError("");
    setResume(null);
    if(!file)return;
    if(!ALLOWED_EXTENSIONS.test(file.name)){
      setFileError("Please choose a PDF, DOC, or DOCX resume.");
      e.target.value="";return;
    }
    if(file.size===0 || file.size>MAX_RESUME_BYTES){
      setFileError("The file must be non-empty and no larger than 10 MB.");
      e.target.value="";return;
    }
    setResume(file);
  }

  function handleSubmit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    const next:string[]=[];
    if(form.fullName.trim().length<2)next.push("Enter your full name.");
    if(!validEmail(form.email.trim()))next.push("Enter a valid email address.");
    if(!validPhone(form.phone.trim()))next.push("Enter a valid contact number (7–15 digits).");
    if(!form.position)next.push("Select a position.");
    if(form.position==="Other" && form.otherPosition.trim().length<2)next.push("Specify the position you want to apply for.");
    if(!form.preferredBranch)next.push("Select your preferred branch.");
    if(!resume || !ALLOWED_EXTENSIONS.test(resume.name) || resume.size===0 || resume.size>MAX_RESUME_BYTES)next.push("Attach a valid PDF, DOC, or DOCX resume (up to 10 MB).");
    setErrors(next);
    if(next.length){document.getElementById("application-errors")?.scrollIntoView({block:"center",behavior:"smooth"});return;}
    window.alert(`Application form validated for ${form.fullName.trim()}.\nResume selected: ${resume?.name ?? ""}\n\nPREVIEW ONLY: The application and CV have NOT been uploaded, submitted, saved, or sent to HR. Please do not treat this alert as an application receipt.`);
  }

  return <main className="public-ir-page">
    <div className="public-ir-shell">
      <header className="public-ir-brand">
        <div className="brand-mark" aria-hidden="true">UC</div>
        <div><strong>UNDERCHARGERS</strong><span>Careers · Job Application</span></div>
        <a className="public-ir-home" href="/">HR Portal <ArrowRight size={14}/></a>
      </header>
      <div className="public-ir-header">
        <span className="public-ir-eyebrow"><BriefcaseBusiness size={15}/> Careers</span>
        <h1>Apply to join our team</h1>
        <p>Fill out your information and attach your resume or CV. No account or login is needed to open this form.</p>
      </div>
      <div className="public-ir-unavailable" role="note">
        <AlertTriangle size={20}/>
        <div><strong>Application preview — not receiving applications yet.</strong>
          <p>Resume selection and the Submit button are for interface review only. No documents or personal information are sent or stored.</p>
        </div>
      </div>
      <form className="public-ir-form" noValidate onSubmit={handleSubmit}>
        <section className="public-ir-card">
          <div className="public-ir-section-title">
            <span className="public-ir-section-icon"><UserRound size={20}/></span>
            <div><h2>Applicant information</h2><p>Fields marked * are required.</p></div>
          </div>
          <div className="public-ir-fields">
            <label className="public-ir-field">Full name <em>*</em>
              <input required autoComplete="name" maxLength={160} value={form.fullName} onChange={e=>update("fullName",e.target.value)} placeholder="Enter your full name"/>
            </label>
            <div className="public-ir-two">
              <label className="public-ir-field">Email address <em>*</em>
                <input required type="email" autoComplete="email" value={form.email} onChange={e=>update("email",e.target.value)} placeholder="name@example.com" maxLength={180}/>
              </label>
              <label className="public-ir-field">Contact number <em>*</em>
                <input required type="tel" autoComplete="tel" value={form.phone} onChange={e=>update("phone",e.target.value)} placeholder="09XX XXX XXXX" maxLength={30}/>
              </label>
            </div>
          </div>
        </section>
        <section className="public-ir-card">
          <div className="public-ir-section-title">
            <span className="public-ir-section-icon"><BriefcaseBusiness size={20}/></span>
            <div><h2>Position & resume</h2><p>Tell us what role you're interested in and attach your CV.</p></div>
          </div>
          <div className="public-ir-fields">
            <div className="public-ir-two">
              <label className="public-ir-field">Position applied for <em>*</em>
                <select required value={form.position} onChange={e=>update("position",e.target.value)}>
                  <option value="">Select position</option>
                  {POSITIONS.map(p=><option value={p} key={p}>{p}</option>)}
                </select>
              </label>
              <label className="public-ir-field">Preferred branch <em>*</em>
                <select required value={form.preferredBranch} onChange={e=>update("preferredBranch",e.target.value)}>
                  <option value="">Select preferred branch</option>
                  {BRANCHES.map(b=><option key={b} value={b}>{b}</option>)}
                </select>
              </label>
            </div>
            {form.position==="Other"&&<label className="public-ir-field">Specify the position <em>*</em>
              <input required maxLength={120} value={form.otherPosition} onChange={e=>update("otherPosition",e.target.value)} placeholder="Position title"/>
            </label>}
            <div className="public-ir-two">
              <label className="public-ir-field">Work experience <span>Optional</span>
                <select value={form.experience} onChange={e=>update("experience",e.target.value)}>
                  <option value="">Select experience</option>
                  {["No experience / Fresh graduate","Less than 1 year","1–2 years","3–5 years","More than 5 years"].map(x=><option key={x}>{x}</option>)}
                </select>
              </label>
            </div>
            <label className="public-ir-field" htmlFor="resume-cv-upload">Resume / CV <em>*</em>
              <div className="public-application-upload">
                <FileUp size={23} aria-hidden="true"/>
                <div>
                  <strong>{resume?resume.name:"Choose your resume or CV"}</strong>
                  <small>{resume?`${(resume.size/1024/1024).toFixed(2)} MB · Selected on this device only`:"PDF, DOC, or DOCX · Maximum 10 MB"}</small>
                </div>
                <input id="resume-cv-upload" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" required onChange={chooseResume} aria-describedby="resume-note"/>
              </div>
              {fileError&&<small className="public-application-file-error" role="alert">{fileError}</small>}
              <small className="public-ir-hint" id="resume-note">Your selected file stays on this device until a secure application system is implemented.</small>
            </label>
            <label className="public-ir-field">Short introduction <span>Optional</span>
              <textarea rows={3} maxLength={1200} value={form.introduction} onChange={e=>update("introduction",e.target.value)} placeholder="Share a little about your experience, skills, or availability."/>
            </label>
            <div className="public-ir-help"><Info size={17}/><span>Once secure hiring submissions are enabled, applicants will be reviewed through Recruitment & Hiring. Do not enter real personal information on the current frontend preview.</span></div>
          </div>
        </section>
        {errors.length>0&&<div className="public-ir-errors" id="application-errors" role="alert" tabIndex={-1}><strong>Please complete the following:</strong><ul>{errors.map(error=><li key={error}>{error}</li>)}</ul></div>}
        <div className="public-ir-foot-actions">
          <span><FileCheck2 size={15} aria-hidden="true"/> Clicking Submit validates this form and shows an alert only.</span>
          <button type="submit" className="primary"><Send size={17}/> Submit Application</button>
        </div>
      </form>
      <footer className="public-ir-footer"><span>Underchargers · Careers</span><span>Public page · No login needed · No active submissions</span></footer>
    </div>
  </main>;
}
