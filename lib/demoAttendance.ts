/** Deterministic, fictional September-October 2026 attendance for UI/QA only.
 * No biometrics, actual timesheets or employee submissions are involved.
 */
import type {Person} from "./people";

export type DemoAttendanceStatus = "Present" | "Late" | "Overtime" | "Absent" | "On Leave" | "Incomplete" | "Rest Day" | "Future Demo";
export type DemoAttendanceRow = {
  employeeId:string; employeeName:string; branch:string; department:string;
  date:string; timeIn:string; timeOut:string; status:DemoAttendanceStatus;
  lateMinutes:number; overtimeHours:number; notes:string;
};
const SAMPLE_AS_OF="2026-10-13";
/** Illustrative leave samples shared with this 35-employee review scenario (not live leave decisions). */
const DEMO_APPROVED_LEAVE=new Set([
 "UC-0001:2026-09-10",
 "UC-0002:2026-09-17",
 "UC-0002:2026-09-18",
 "UC-0003:2026-09-22",
 "UC-0004:2026-10-08",
 "UC-0005:2026-10-12"
]);
const pad=(n:number)=>String(n).padStart(2,"0");
const dateOnly=(year:number,month:number,day:number)=>`${year}-${pad(month)}-${pad(day)}`;
const checksum=(value:string)=>[...value].reduce((hash,char)=>((hash*33+char.charCodeAt(0))>>>0),5381);
const time=(minutes:number)=>`${pad(Math.floor(minutes/60))}:${pad(minutes%60)}`;
export const demoAttendanceMonths=["2026-09","2026-10"] as const;
export function buildDemoAttendance(people:readonly Person[]):DemoAttendanceRow[]{
 const dates:string[]=[];
 for(const month of [9,10])for(let day=1;day<=new Date(2026,month,0).getDate();day++)dates.push(dateOnly(2026,month,day));
 return people.flatMap((person,index)=>dates.filter(day=>day>=person.hire).map(day=>{
   const weeklyRest=index%3===0?3:0; // Illustrative Wednesdays / Sundays only, not verified shifts.
   const weekday=new Date(`${day}T12:00:00`).getDay();
   const seed=checksum(`${person.id}:${day}`)%100;
   let status:DemoAttendanceStatus;
   if(weekday===weeklyRest)status="Rest Day";
   else if(day>SAMPLE_AS_OF)status="Future Demo";
   else if(DEMO_APPROVED_LEAVE.has(`${person.id}:${day}`))status="On Leave";
   else if(seed<4)status="Absent";
   else if(seed<8)status="On Leave";
   else if(seed<11)status="Incomplete";
   else if(seed<22)status="Late";
   else if(seed<31)status="Overtime";
   else status="Present";
   const morning=index%2===0?9*60:8*60;
   const lateMinutes=status==="Late"?11+(seed%23):0;
   const overtimeHours=status==="Overtime"?1+(seed%3)*0.5:0;
   const hasPunch=!(["Absent","On Leave","Rest Day","Future Demo"] as string[]).includes(status);
   return {
    employeeId:person.id,employeeName:person.name,branch:person.branch,department:person.department,
    date:day,timeIn:hasPunch?time(morning+lateMinutes):"",timeOut:hasPunch&&status!=="Incomplete"?time(morning+9*60+Math.round(overtimeHours*60)):"",
    status,lateMinutes,overtimeHours,
    notes:status==="Future Demo"?"Future placeholder — not an actual clock-in":status==="Rest Day"?"Illustrative weekly rest day":status==="Incomplete"?"Missing clock-out; for review":status==="On Leave"?(DEMO_APPROVED_LEAVE.has(`${person.id}:${day}`)?"Linked to approved fictional leave request":"Sample leave without a matched approved request") :status==="Absent"?"Sample unpaid absence; requires HR review":status==="Late"?"Sample late arrival":status==="Overtime"?"Sample OT; requires supervisor approval":"Fictional complete shift"
   };
 })) .sort((a,b)=>b.date.localeCompare(a.date)||a.employeeName.localeCompare(b.employeeName));
}
export function sampleCutoff(people:readonly Person[],employeeId:string,start:string){
 const startDate=new Date(`${start}T12:00:00`);
 const endDate=new Date(startDate);endDate.setDate(endDate.getDate()+6);
 const end=endDate.toISOString().slice(0,10);
 const rows=buildDemoAttendance(people).filter(r=>r.employeeId===employeeId&&r.date>=start&&r.date<=end);
 const valid=rows.filter(r=>r.status==="Present"||r.status==="Late"||r.status==="Overtime");
 return {end,rows,daysWorked:valid.length,otHours:valid.reduce((sum,r)=>sum+r.overtimeHours,0),hasFuture:rows.some(r=>r.status==="Future Demo"),hasIncomplete:rows.some(r=>r.status==="Incomplete")};
}
export function exportDemoAttendanceCSV(rows:readonly DemoAttendanceRow[]){
 const content=[
  ["Employee ID","Employee Name","Branch","Department","Date","Time In","Time Out","Status","Late Minutes","OT Hours","Notes"],
  ...rows.map(r=>[r.employeeId,r.employeeName,r.branch,r.department,r.date,r.timeIn,r.timeOut,r.status,String(r.lateMinutes),String(r.overtimeHours),r.notes])
 ].map(cols=>cols.map(value=>`"${String(value).replace(/^([=+@-])/,'\'$1').replaceAll('"','""')}"`).join(",")).join("\r\n");
 const url=URL.createObjectURL(new Blob([content],{type:"text/csv;charset=utf-8"}));
 const a=document.createElement("a");a.href=url;a.download="UCMM_DEMO_Attendance_Sept_Oct_2026.csv";a.click();URL.revokeObjectURL(url);
}
