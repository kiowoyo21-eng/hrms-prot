"use client";
import {useMemo,useState,type FormEvent} from 'react';
import {ArrowLeft,ClipboardCheck,CalendarDays,AlertTriangle} from 'lucide-react';
import {useHR} from '../lib/hrState';
import type {Branch,Role} from '../lib/mock';
import {writeAuditEvent} from '../lib/auditTrail';
import {philippineToday} from '../lib/companyWeeklyPayroll';
import {probationDueState,probationStages,probationDeadline,submitProbationAssessment,reviewProbationAssessment,resolvePendingProbationDecision,type ProbationStage,type ProbationDecision} from '../lib/probationAssessments';
import styles from './ProbationaryAssessmentWorkspace.module.css';

const hrRoles=['HR','Super Admin','Special Final Approver — Ms Kate'];
export default function ProbationaryAssessmentWorkspace({role,branch,username,onBack,initialEmployeeId,initialStage}:{role:Role;branch:Branch;username:string;onBack:()=>void;initialEmployeeId?:string;initialStage?:ProbationStage}){
 const {data,update}=useHR();
 const people=useMemo(()=>data.people.filter(p=>p.status==='Probationary'&&(role==='BM'?branch!=='All Shops'&&p.branch===branch:branch==='All Shops'||p.branch===branch)),[data.people,branch,role]);
 const [personId,setPersonId]=useState(initialEmployeeId||'');const [stage,setStage]=useState<ProbationStage>(initialStage||1);
 const [score,setScore]=useState(3);const [strengths,setStrengths]=useState('');const [improvements,setImprovements]=useState('');
 const [recommendation,setRecommendation]=useState('');const [evidence,setEvidence]=useState('');
 const [reviewNotes,setReviewNotes]=useState('');const [decision,setDecision]=useState<ProbationDecision>('Pending Review');
 const [standardsRef,setStandardsRef]=useState('');const [noticeRef,setNoticeRef]=useState('');const [message,setMessage]=useState('');
 const person=people.find(p=>p.id===personId)||people[0];
 const records=data.probationAssessments||[];const current=person&&records.find(r=>r.employeeId===person.id&&r.stage===stage);
 const today=philippineToday();const validSchedule=Boolean(person&&probationStages(person).length===3);const due=person&&validSchedule?probationDueState(person,stage,records,today):null;
 const dueCount=people.reduce((n,p)=>n+probationStages(p).filter(s=>{
  const d=probationDueState(p,s.stage,records,today);return d.state==='Overdue'||d.state==='Due Today'||d.state==='Due Soon';
 }).length,0);
 function submit(e:FormEvent){e.preventDefault();if(!person)return;
  if(!validSchedule){setMessage('Correct the employee hire date in Employee 201 before assessing.');return;}
  const result=submitProbationAssessment(data,{employeeId:person.id,stage,dueDate:probationStages(person).find(s=>s.stage===stage)!.dueDate,submittedBy:username,score,strengths,improvements,recommendation,evidenceReference:evidence},role,username,new Date().toISOString(),`PROB-${person.id}-${stage}`,branch);
  if('error' in result){setMessage(result.error);return;}
  update(prev=>({...prev,probationAssessments:result.state.probationAssessments}));writeAuditEvent({module:'Probationary Assessments',action:'Submitted assessment',recordId:`${person.id}-M${stage}`,summary:`Month ${stage} assessment submitted; evidence in restricted record`,actor:username,role});
  setMessage('Assessment submitted for independent HR review.');setStrengths('');setImprovements('');setRecommendation('');setEvidence('');setScore(3);
 }
 function review(e:FormEvent){e.preventDefault();if(!current)return;
  const resolving=current.status==='HR Reviewed'&&current.stage===5&&current.decision==='Pending Review';
  if(resolving&&decision==='Pending Review'){setMessage('Select the final decision before resolving the pending review.');return;}
  const result=resolving?resolvePendingProbationDecision(data,current.id,role,username,new Date().toISOString(),decision as Exclude<ProbationDecision,'Pending Review'>,reviewNotes,noticeRef):reviewProbationAssessment(data,current.id,role,username,new Date().toISOString(),reviewNotes,stage===5?decision:undefined,stage===5?standardsRef:undefined,stage===5?noticeRef:undefined);
  if('error' in result){setMessage(result.error);return;}
  update(prev=>({...prev,probationAssessments:result.state.probationAssessments}));writeAuditEvent({module:'Probationary Assessments',action:stage===5?'Verified probation decision':'Verified assessment',recordId:current.id,summary:`Month ${stage} assessment reviewed; recorded decision ${stage===5?decision:'assessment only'}`,actor:username,role,beforeStatus:current.status,afterStatus:'HR Reviewed'});
  setMessage(stage===5?'Fifth-month HR review recorded. Employment status is unchanged until separate authorized action.':'HR review verified.');setReviewNotes('');setStandardsRef('');setNoticeRef('');setDecision('Pending Review');
 }
 return <div className={styles.page}>
  <header className={styles.header}><div><button type="button" className="secondary" onClick={onBack}><ArrowLeft size={14}/> Recruitment & Hiring</button><h3>Probationary Assessments</h3><p>Month 1 initial · Month 3 midterm · Month 5 decision review</p></div><span className={styles.count}><ClipboardCheck size={15}/>{people.length} probationary · {dueCount} due/overdue reviews</span></header>
  <section className={`panel ${styles.panel}`}><div className={styles.controls}>
   <label>Employee<select value={person?.id||''} onChange={e=>{setPersonId(e.target.value);setStage(1);setMessage('')}}>{people.map(p=><option value={p.id} key={p.id}>{p.name} · {p.id} · {p.branch}</option>)}</select></label>
   <label>Assessment<select value={stage} onChange={e=>{setStage(Number(e.target.value) as ProbationStage);setMessage('')}}><option value={1}>1st Month — Initial</option><option value={3}>3rd Month — Midterm</option><option value={5}>5th Month — Final Decision</option></select></label>
  </div>{!person?<p>No probationary employees in your authorized branch.</p>:<>
   {!validSchedule&&<p className={styles.warn}>Invalid hire date. Correct Employee 201 before scheduling an assessment.</p>}
   {validSchedule&&<><div className={styles.summary}><span><CalendarDays size={15}/> Hired {person.hire}</span><span>Month {stage} due <b>{due?.due}</b></span><span className={due?.state==='Overdue'?styles.warn:styles.tag}>{due?.state}</span><span>Probation end reference <b>{probationDeadline(person)}</b></span></div>
   <div className={styles.timeline}>{probationStages(person).map(s=>{const status=probationDueState(person,s.stage,records,today);return <button type="button" key={s.stage} className={stage===s.stage?styles.active:''} onClick={()=>{setStage(s.stage);setMessage('')}}><b>Month {s.stage}</b><small>{status.due}</small><span>{status.state}</span></button>})}</div>
   {current?<div className={styles.record}>
    <h4>Submitted assessment · {current.status}</h4><div className={styles.facts}><span>Score: <b>{current.score}/5</b></span><span>Submitted by: <b>{current.submittedBy}</b></span><span>Evidence: <b>{current.evidenceReference}</b></span></div>
    <p><b>Strengths:</b> {current.strengths}</p><p><b>Development:</b> {current.improvements}</p><p><b>Recommendation:</b> {current.recommendation}</p>
    {current.status==='HR Reviewed'&&current.decision!=='Pending Review'?<div className={styles.reviewed}><b>HR reviewed by {current.reviewedBy}</b><p>{current.hrReviewNotes}</p>{current.stage===5&&<p><b>Decision:</b> {current.decision} · Standards evidence: {current.qualificationStandardsReference||'Missing'}{current.noticeReference?` · Notice reference: ${current.noticeReference}`:''}</p>}</div>:
    hrRoles.includes(role)?<form onSubmit={review} className={styles.form}><h4>{current.status==='HR Reviewed'?'Resolve Pending Fifth-Month Decision':'Independent HR Verification'}</h4><label>HR Findings<textarea required minLength={10} rows={2} value={reviewNotes} onChange={e=>setReviewNotes(e.target.value)}/></label>
     {stage===5&&<><label>Final Decision<select value={decision} onChange={e=>setDecision(e.target.value as ProbationDecision)}><option value='Pending Review' disabled={current.status==='HR Reviewed'}>{current.status==='HR Reviewed'?'Select final decision':'Pending Review'}</option><option>Regularize</option><option>Do Not Regularize</option></select></label>{current.status!=='HR Reviewed'&&<label>Evidence qualification standards were communicated at engagement<input required minLength={5} value={standardsRef} onChange={e=>setStandardsRef(e.target.value)} placeholder="Document / acknowledgment reference"/></label>}{decision==='Do Not Regularize'&&<label>Lawful notice / process evidence reference<input required minLength={5} value={noticeRef} onChange={e=>setNoticeRef(e.target.value)}/></label>}</>}
     {current.status==='Submitted'&&current.submittedBy===username&&<p className={styles.warn}>Another authorized HR reviewer must verify this assessment.</p>}<button className="primary" disabled={(current.status==='Submitted'&&current.submittedBy===username)||(current.status==='HR Reviewed'&&decision==='Pending Review')} type="submit">Record HR Review</button>
    </form>:<p className={styles.tag}>Awaiting authorized HR review.</p>}
   </div>:<form onSubmit={submit} className={styles.form}><h4>New Month {stage} Assessment</h4><div className={styles.controls}><label>Performance Rating<select value={score} onChange={e=>setScore(Number(e.target.value))}>{[1,2,3,4,5].map(n=><option value={n} key={n}>{n} / 5</option>)}</select></label></div>
    <label>Strengths / Results<textarea minLength={10} rows={2} required value={strengths} onChange={e=>setStrengths(e.target.value)}/></label>
    <label>Concerns / Areas for Improvement<textarea minLength={10} rows={2} required value={improvements} onChange={e=>setImprovements(e.target.value)}/></label>
    <label>Supervisor Recommendation<textarea minLength={10} rows={2} required value={recommendation} onChange={e=>setRecommendation(e.target.value)}/></label>
    <label>Supporting Evidence Reference<input minLength={5} required value={evidence} onChange={e=>setEvidence(e.target.value)} placeholder="Assessment form / attachment ID"/></label>
    <button className="primary" type="submit">Submit Assessment for HR Review</button>
   </form>}
   {stage===5&&<p className={styles.note}><AlertTriangle size={15}/> Fifth-month decisions must be finalized before the applicable legal probation deadline. A pending review, non-regularization decision, or elapsed date never automatically ends employment. Any notice and lawful process must be handled separately.</p>}
  </>}</> }{message&&<p role="status" className={styles.message}>{message}</p>}
  </section>
  <p className={styles.disclaimer}>Browser-local review workflow only. No secure notification delivery, authenticated supervisor identity or actual employee-service communication is provided without a backend.</p>
 </div>;
}
