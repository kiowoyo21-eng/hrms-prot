import type {OpsMonth} from "./opsRestDays";

export const OPS_WEEKDAYS=[{value:"1",label:"Monday"},{value:"2",label:"Tuesday"},{value:"3",label:"Wednesday"},{value:"4",label:"Thursday"}] as const;
/** A monthly roster chooses the same weekday throughout that month; custom calendars remain supported. */
export function datesForMonthlyOff(month:string,weekday:number):string[]{
 if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)||!Number.isInteger(weekday)||weekday<1||weekday>4)return [];
 const [y,m]=month.split("-").map(Number),days=new Date(Date.UTC(y,m,0)).getUTCDate(),result:string[]=[];
 for(let d=1;d<=days;d++){
  const date=new Date(Date.UTC(y,m-1,d));
  if(date.getUTCDay()===weekday)result.push(`${month}-${String(d).padStart(2,"0")}`);
 }
 return result;
}
export function rosterWeekday(schedule?:Pick<OpsMonth,"month"|"offDates">):string{
 if(!schedule||!schedule.offDates.length)return "";
 for(const day of OPS_WEEKDAYS){const expected=datesForMonthlyOff(schedule.month,Number(day.value));if(expected.length===schedule.offDates.length&&expected.every(d=>schedule.offDates.includes(d)))return day.value;}
 return ""; // custom rotation: preserve dates; never silently overwrite it
}
export function rosterLabel(schedule?:Pick<OpsMonth,"month"|"offDates">):string{
 if(!schedule)return "Not scheduled";
 const code=rosterWeekday(schedule);
 return code?OPS_WEEKDAYS.find(d=>d.value===code)!.label:schedule.offDates.length?"Custom / varies":"No OFF dates";
}
