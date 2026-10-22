/** Fully fictional test-only profile details for the 35 stock HRMS employees.
 * No SSS/PhilHealth/Pag-IBIG/TIN identifiers, verified uploads, or real contact details.
 * Addresses and phone numbers are deliberately invalid for real-world use. */
import type {HRPerson} from "./hrState";
import {employees} from "./people";
const birthdays=[
 "1987-02-16","1991-09-11","1996-05-04","1982-11-19","2001-01-20",
 "1999-04-25","2002-06-09","1975-12-03","1990-03-14","1988-10-07",
 "2000-02-29","1998-07-01","1994-09-17","2003-12-22","1980-04-12",
 "1997-05-30","1984-01-09","2002-08-14","1973-03-16","1993-02-25",
 "2001-11-11","1991-12-24","1996-10-29","2000-07-07","1986-06-18",
 "1995-08-20","2004-03-03","1998-05-12","1967-09-19","1992-01-26",
 "1978-04-27","1983-07-21","1981-10-12","1971-05-08","1989-08-01"
];
export type DemoProfileFields=Pick<HRPerson,"birthDate"|"placeOfBirth"|"nationality"|"civilStatus"|"address"|"email"|"phone"|"emergencyName"|"emergencyRelationship"|"emergencyPhone"|"emergencyAddress"|"jobLevel"|"employmentArrangement"|"monthlyWorkDays"|"hoursPerDay">;
export function demoProfileFor(index:number):DemoProfileFields{
 const n=String(index+1).padStart(2,"0");const base=employees[index];
 return {birthDate:birthdays[index],placeOfBirth:"Metro Manila (fictional)",nationality:"Filipino",civilStatus:index%3===0?"Married":"Single",
  address:`Fictional test address ${n}, Metro Manila`,email:`employee${n}@demo.invalid`,phone:`000-000-${String(index+1).padStart(4,"0")}`,
  emergencyName:`Demo Contact ${n}`,emergencyRelationship:index%2===0?"Sibling":"Parent",emergencyPhone:`000-999-${String(index+1).padStart(4,"0")}`,
  emergencyAddress:`Fictional emergency address ${n}, NCR`,jobLevel:base.department==="Branch Management"?"Supervisory":"Rank-and-File",
  employmentArrangement:base.status==="Probationary"?"Probationary":"Regular",monthlyWorkDays:26,hoursPerDay:8};
}
export function enrichExistingDemoProfiles<T extends HRPerson>(people:T[]):T[]{
 // Match all three original seed identity fields. Never modify independently created employees.
 return people.map(person=>{
  const index=employees.findIndex(seed=>seed.id===person.id&&seed.name===person.name&&seed.hire===person.hire);
  if(index<0)return person;
  const additions=demoProfileFor(index);
  const next={...person};
  for(const [key,value] of Object.entries(additions)){
   const current=(next as unknown as Record<string,unknown>)[key];
   if(current===undefined||current===null||current==="") (next as unknown as Record<string,unknown>)[key]=value;
  }
  return next;
 });
}
export const DEMO_PROFILE_COUNT=birthdays.length;
