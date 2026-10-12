/** Browser-local review records only. NEVER use this storage for real confidential cases. */
export type IncidentStage="Submitted"|"Initial Review"|"NTE / NOV"|"Explanation"|"Conference"|"For Decision"|"Action Tracking"|"Resolved"|"Closed";
export const incidentStages:IncidentStage[]=["Submitted","Initial Review","NTE / NOV","Explanation","Conference","For Decision","Action Tracking","Resolved","Closed"];
export type IncidentDocumentCategory="Initial Report"|"Written Explanation & Notices"|"Evidence"|"Mediation Records"|"Final Decision"|"Closure Summary";
export const incidentDocumentCategories:IncidentDocumentCategory[]=["Initial Report","Written Explanation & Notices","Evidence","Mediation Records","Final Decision","Closure Summary"];
export type IncidentAttachment={id:string;category:IncidentDocumentCategory;name:string;addedAt:string;addedBy:string;notes?:string};
export type IncidentCase={
 id:string;reporter:string;respondent:string;respondentIsBM:boolean;branch:string;summary:string;description:string;handler:"HR"|"BM";stage:IncidentStage;priority:"Normal"|"Urgent"|"Critical";target:string;notes:string;history:string[];
 reporterEmployeeId?:string;respondentEmployeeId?:string;attachments?:IncidentAttachment[];evidenceNotes?:string;explanation?:string;mediation?:string;decision?:string;outcome?:string;closureSummary?:string;closedAt?:string;actionLog?:{at:string;actor:string;action:string;detail:string}[];requiredNotice?:boolean;requiredConference?:boolean;
};
export const seedIncidents:IncidentCase[]=[
 {id:"IR-2026-001",reporter:"Employee A",respondent:"Employee B",respondentIsBM:false,branch:"UC Mandaluyong",summary:"Workshop shift conflict",description:"Reported disagreement during shift turnover.",handler:"BM",stage:"Initial Review",priority:"Normal",target:"2026-10-23",notes:"HR copied for monitoring",history:["Report submitted","BM assigned; HR copied"]},
 {id:"IR-2026-002",reporter:"Employee C",respondent:"Branch Manager",respondentIsBM:true,branch:"MM Mandaluyong",summary:"Concern involving branch manager",description:"Confidential report directed to HR.",handler:"HR",stage:"Explanation",priority:"Urgent",target:"2026-10-20",notes:"Restricted case",history:["Confidential report submitted","Routed directly to HR"]},
 {id:"IR-2026-003",reporter:"Employee D",respondent:"Employee E",respondentIsBM:false,branch:"UC Las Piñas",summary:"Equipment handling incident",description:"An equipment-handling incident requires follow-up.",handler:"BM",stage:"Action Tracking",priority:"Critical",target:"2026-10-17",notes:"Corrective action pending",history:["Report submitted","Investigation reviewed","Action assigned"]},
 {id:"IR-2026-000",reporter:"Juan Dela Cruz",respondent:"Carlo Mendoza",reporterEmployeeId:"UC-0001",respondentEmployeeId:"UC-0004",respondentIsBM:false,branch:"UC Mandaluyong",summary:"Workshop handover clarification (sample)",description:"An equipment handover was reported as incomplete at shift change. HR reviewed the records; this example is for preview only.",handler:"BM",stage:"Closed",priority:"Normal",target:"2026-10-07",notes:"Reviewed by HR; no violation established.",explanation:"Both employees provided their account of the workshop handover and confirmed the item log needed clarification.",mediation:"Participants agreed to use a signed equipment handover checklist at each shift change.",decision:"HR reviewed the submitted explanations and confirmed no disciplinary violation based on the sample evidence.",outcome:"No violation found",closureSummary:"Case closed following HR review. Handover checklist procedure clarified; no disciplinary finding against either employee.",closedAt:"2026-10-09",history:["2026-10-05 · Original report submitted","2026-10-06 · BM initial review, HR copied","2026-10-07 · Written explanations recorded","2026-10-08 · Mediation summary","2026-10-09 · HR final decision","2026-10-09 · Closed by HR"],actionLog:[{at:"2026-10-05",actor:"BM",action:"Report submitted",detail:"Initial report recorded"},{at:"2026-10-08",actor:"HR",action:"Mediation",detail:"Handover procedure clarified"},{at:"2026-10-09",actor:"HR",action:"Closed",detail:"No violation found"}]}
];
export const incidentStoreKey="uc-hr-ui-incident";
export function getClosedCasesForEmployee(cases:IncidentCase[],employeeId:string):IncidentCase[]{
 return cases.filter(c=>c.stage==="Closed"&&(c.reporterEmployeeId===employeeId||c.respondentEmployeeId===employeeId));
}
export function incidentRoleFor(c:IncidentCase,employeeId:string):string[]{return [c.reporterEmployeeId===employeeId?"Reporter":null,c.respondentEmployeeId===employeeId?"Reported Employee":null].filter((s):s is string=>Boolean(s));}
export function incidentDocuments(c:IncidentCase):{category:IncidentDocumentCategory;title:string;body:string;status:string}[]{
 const result:{category:IncidentDocumentCategory;title:string;body:string;status:string}[]=[{category:"Initial Report",title:"Original Incident Report",body:c.description||"No narrative recorded",status:"Original report"}];
 if(c.explanation?.trim())result.push({category:"Written Explanation & Notices",title:"Written Explanation / Notices",body:c.explanation,status:"Recorded text"});
 if(c.evidenceNotes?.trim())result.push({category:"Evidence",title:"Evidence Notes",body:c.evidenceNotes,status:"Recorded evidence notes"});
 if(c.mediation?.trim())result.push({category:"Mediation Records",title:"Mediation Summary",body:c.mediation,status:"Recorded text"});
 if(c.decision?.trim())result.push({category:"Final Decision",title:"HR Decision",body:`${c.outcome||"Decision recorded"}\n\n${c.decision}`,status:"HR decision"});
 if(c.stage==="Closed")result.push({category:"Closure Summary",title:"Case Closure Record",body:`Case: ${c.id}\nConcern: ${c.summary}\nOutcome: ${c.outcome||"Not classified"}\nClosed: ${c.closedAt||"Date not recorded"}\n\n${c.closureSummary||"No additional closure remarks."}`,status:"Closed case"});
 return result;
}
