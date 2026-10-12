"use client";
import {createContext,useContext,useEffect,useMemo,useState,type ReactNode} from "react";
import {employees as samples,type Person} from "./people";
export type EmployeeAssignment={
 id:string;effectiveDate:string;kind:"Initial Assignment"|"Transfer"|"Promotion"|"Reassignment";
 branch:string;department:string;position:string;memoId?:string;memoType?:string;
};
export type HRDocument={name:string;status:"Missing"|"Submitted"|"Verified"};
export type HRPerson=Person & {
 email:string;phone:string;hire:string;probation:number;sil:number;vil:number;
 documents:HRDocument[];timeline:string[];assignmentHistory?:EmployeeAssignment[];
 // Optional profile fields allow older browser-stored employees to remain compatible.
 birthDate?:string;civilStatus?:string;address?:string;
 emergencyName?:string;emergencyRelationship?:string;emergencyPhone?:string;
};
export type PremiumProfile={ot:number;rdw:number;rdot:number;regular:number;special:number;effective:string;reason:string};
export type AssetStatus="Free"|"Pending Turnover"|"Assigned"|"For Return"|"Inspection"|"Maintenance"|"Retired";
export type AssetRecord={homeBranch?:string;id:string;name:string;serial:string;status:AssetStatus;employeeId:string;condition:string;accessories:string;notes?:string;history:string[];signed:boolean;date:string;signingMethod?:"phone"|"onsite"|"print";assignedBy?:string;signatureEvidence?:string;assignmentDate?:string};
export type PayrollRelease={
 id:string;employeeId:string;periodStart:string;periodEnd:string;paidAt:string;
 gross:number;deductions:number;net:number;kind:"Salary"|"13th-Month Pay"|"Bonus";
 status:"Released"|"Pending";source:"Sample"|"Browser Review";
};
export type Submission={id:string;employeeId:string;type:string;fileName:string;submittedBy:string;status:"Pending HR Review"|"Approved"|"Rejected";reason:string};
export type HRState={people:HRPerson[];rates:Record<string,PremiumProfile>;assets:AssetRecord[];submissions:Submission[];payrollReleases:PayrollRelease[];earnings:Record<string,{days:number;ot:number;bonus:number;adjustment:number}>;deductions:Record<string,{sss:number;philhealth:number;pagibig:number;tax:number;loan:number}>};
const requirements=["Resume","Medical Clearance","Employment Contract","NDA / Company Policies","Government IDs"];
export const defaultRate:PremiumProfile={ot:125,rdw:130,rdot:169,regular:200,special:130,effective:"2026-10-01",reason:"Company reference profile"};
export const deptRate:Record<string,Partial<PremiumProfile>>={Operations:{ot:200,rdw:200,rdot:260},Service:{ot:150}};
export const initialState:HRState={
 people:samples.map((p,i)=>({...p,email:"",phone:"",probation:p.status==="Probationary"?6:0,sil:5,vil:i%2?5:0,documents:requirements.map((name,j)=>({name,status:j===0?"Verified":j===1?"Missing":"Submitted"})),timeline:[`${p.hire} · Hired at ${p.branch}`],assignmentHistory:[{id:`initial-${p.id}`,effectiveDate:p.hire,kind:"Initial Assignment" as const,branch:p.branch,department:p.department,position:p.position}]})),
 rates:{"UC-0001":{...defaultRate,ot:200,rdw:200,rdot:260,effective:"2026-10-01",reason:"Approved individual reference profile"}},
 assets:[
 {id:"AST-1001",homeBranch:"UC Mandaluyong",name:"Mac mini M2",serial:"UC-MAC-1001",status:"Assigned",employeeId:"UC-0001",condition:"Good",accessories:"Keyboard, power cable",history:["2026-10-03 · Assigned to UC-0001"],signed:true,date:"2026-10-03"},
 {id:"AST-1002",homeBranch:"UC Las Piñas",name:"Canon EOS R50",serial:"UC-CAM-2002",status:"Free",employeeId:"",condition:"Good",accessories:"Lens, battery, charger",history:["2026-09-20 · Registered"],signed:false,date:"2026-09-20"},
 {id:"AST-1003",homeBranch:"UC Quezon City",name:"Lenovo ThinkPad",serial:"UC-LAP-1003",status:"Free",employeeId:"",condition:"New",accessories:"Charger",history:["2026-09-30 · Registered"],signed:false,date:"2026-09-30"},
 {id:"AST-1004",homeBranch:"MM Mandaluyong",name:"Samsung Tablet",serial:"MM-TAB-1004",status:"Inspection",employeeId:"MM-0001",condition:"For Inspection",accessories:"Charger",history:["2026-10-10 · Retrieved from MM-0001; awaiting inspection"],signed:true,date:"2026-10-10"}
 ],
 payrollReleases:samples.slice(0,8).flatMap((p,i)=>["2026-09-16","2026-09-23","2026-09-30"].map((periodEnd,j)=>{
  const gross=Number((p.salaryType==="Daily"?p.rate*6:p.rate/4).toFixed(2));
  const deductions=Number((gross*(.07+(i%3)*.01)).toFixed(2));
  return {id:`SAMPLE-PAY-${p.id}-${j+1}`,employeeId:p.id,periodStart:["2026-09-10","2026-09-17","2026-09-24"][j],periodEnd,paidAt:["2026-09-18","2026-09-25","2026-10-02"][j],gross,deductions,net:Number((gross-deductions).toFixed(2)),kind:"Salary" as const,status:"Released" as const,source:"Sample" as const};
 })),
 submissions:[{id:"SUB-1001",employeeId:"UC-0001",type:"Medical Clearance",fileName:"medical-clearance-sample.pdf",submittedBy:"BM",status:"Pending HR Review",reason:""}],
 earnings:{"UC-0001":{days:6,ot:2,bonus:0,adjustment:0}},
 deductions:Object.fromEntries(samples.slice(0,6).map(p=>[p.id,{sss:150,philhealth:90,pagibig:60,tax:0,loan:0}]))
};
const KEY="uc-hr-review-release-v2";
type ContextValue={data:HRState;update:(fn:(state:HRState)=>HRState)=>void;reset:()=>void;ready:boolean};
const HRContext=createContext<ContextValue|null>(null);
export function HRProvider({children}:{children:ReactNode}){
 const [data,setData]=useState<HRState>(initialState);const [ready,setReady]=useState(false);
 useEffect(()=>{try{const raw=window.localStorage.getItem(KEY);if(raw){const loaded=JSON.parse(raw) as Partial<HRState>;if(Array.isArray(loaded.people)&&Array.isArray(loaded.assets))setData({...initialState,...loaded,earnings:loaded.earnings||{},deductions:loaded.deductions||{},payrollReleases:loaded.payrollReleases||initialState.payrollReleases});}}catch{}setReady(true)},[]);
 useEffect(()=>{if(ready){try{window.localStorage.setItem(KEY,JSON.stringify(data))}catch{}}},[data,ready]);
 const value=useMemo<ContextValue>(()=>({data,update:(fn)=>setData(previous=>fn(previous)),reset:()=>setData(initialState),ready}),[data,ready]);
 return <HRContext.Provider value={value}>{children}</HRContext.Provider>
}
export function useHR(){const context=useContext(HRContext);if(!context)throw Error("HRProvider missing");return context}
export function effectiveRate(person:Person,rates:Record<string,PremiumProfile>):PremiumProfile{return {...defaultRate,...(deptRate[person.department]||{}),...(rates[person.id]||{})}}
export const money=(n:number)=>new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP"}).format(n);
