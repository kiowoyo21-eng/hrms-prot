"use client";
import {useEffect,useState} from 'react';
import {useHR} from '../lib/hrState';
import {usePublishModuleAlerts,type ModuleAlert} from './ModuleAlerts';
import type {Branch,Role} from '../lib/mock';
import {philippineToday} from '../lib/companyWeeklyPayroll';
import {daysUntil,probationDeadline,probationDueState,probationStages} from '../lib/probationAssessments';
/** In-app pending action alerts, not push notifications or email delivery. */
export default function ProbationAlertsPublisher({role,branch}:{role:Role;branch:Branch}){
 const {data}=useHR();const [today,setToday]=useState(philippineToday);
 useEffect(()=>{const refresh=()=>setToday(philippineToday());window.addEventListener('focus',refresh);const tick=window.setInterval(refresh,60000);return()=>{window.removeEventListener('focus',refresh);window.clearInterval(tick)}},[]);
 const alerts:ModuleAlert[]=[];
 for(const employee of data.people){
  if(employee.status!=='Probationary'||(role==='BM'&&employee.branch!=='UC Mandaluyong')||(branch!=='All Shops'&&employee.branch!==branch))continue;
  const schedule=probationStages(employee);
  if(!schedule.length){alerts.push({id:`prob-invalid-hire-${employee.id}`,title:`Check probation hire date · ${employee.name}`,detail:'Correct missing or invalid hire date in Employee 201',branch:employee.branch,level:'urgent',action:`probation:${employee.id}:1`});continue;}
  for(const item of schedule){
   const st=probationDueState(employee,item.stage,data.probationAssessments||[],today);
   if(st.state==='Completed')continue;
   const submitted=st.review?.status==='Submitted';
   const finalPending=item.stage===5&&st.review?.status==='HR Reviewed'&&st.review.decision==='Pending Review';
   if(!submitted&&!finalPending&&!['Overdue','Due Today','Due Soon'].includes(st.state))continue;
   alerts.push({id:`prob-${employee.id}-month-${item.stage}`,title:submitted?`HR review needed · ${employee.name}`:finalPending?`Regularization decision unresolved · ${employee.name}`:`Month ${item.stage} assessment ${st.state.toLowerCase()} · ${employee.name}`,
    detail:`${employee.id} · ${item.dueDate} · ${submitted?'Submitted by supervisor':st.state} · HR/assigned supervisor review`,branch:employee.branch,
    level:st.state==='Overdue'||item.stage===5?'urgent':'normal',action:`probation:${employee.id}:${item.stage}`});
  }
  const deadline=probationDeadline(employee),days=daysUntil(deadline,today);
  const final=(data.probationAssessments||[]).find(r=>r.employeeId===employee.id&&r.stage===5&&r.status==='HR Reviewed'&&r.decision!=='Pending Review');
  if(final){alerts.push({id:`prob-followup-${employee.id}`,title:final.decision==='Regularize'?`Apply approved regularization · ${employee.name}`:`Complete non-regularization process · ${employee.name}`,detail:final.decision==='Regularize'?'HR decision recorded · Employee 201 employment action still required':'Document notices, applicable process and disposition before changing employment status',branch:employee.branch,level:'urgent',action:`probation:${employee.id}:5`});}
  if(!final&&days<=14){alerts.push({id:`prob-deadline-${employee.id}`,title:`Probation deadline ${days<0?'past reference':'approaching'} · ${employee.name}`,detail:`Reference ${deadline} · ${days} day(s) remaining · Review employment status and lawful process`,branch:employee.branch,level:'urgent',action:`probation:${employee.id}:5`});}
 }
 usePublishModuleAlerts('lifecycle',alerts,'probation-assessments');return null;
}
