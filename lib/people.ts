import type {Branch} from "./mock";
export type Shop=Exclude<Branch,"All Shops">;
export type Person={id:string;name:string;branch:Shop;department:string;position:string;status:string;gender:string;hire:string;salaryType:"Daily"|"Monthly";rate:number};
export const employees:Person[]=[
{id:"UC-0001",name:"Juan Dela Cruz",branch:"UC Mandaluyong",department:"Operations",position:"Automotive Technician",status:"Probationary",gender:"Male",hire:"2026-08-12",salaryType:"Daily",rate:700},
{id:"UC-0002",name:"Maria Santos",branch:"UC Las Piñas",department:"Administration",position:"HR Specialist",status:"Regular",gender:"Female",hire:"2025-03-10",salaryType:"Monthly",rate:25000},
{id:"UC-0003",name:"Paolo Reyes",branch:"UC Quezon City",department:"Operations",position:"Branch Supervisor",status:"Regular",gender:"Male",hire:"2026-07-01",salaryType:"Monthly",rate:30000},
{id:"MM-0001",name:"Andrea Cruz",branch:"MM Mandaluyong",department:"Service",position:"Service Advisor",status:"Probationary",gender:"Female",hire:"2026-09-01",salaryType:"Daily",rate:850},
{id:"UC-0004",name:"Carlo Mendoza",branch:"UC Mandaluyong",department:"Operations",position:"Senior Mechanic",status:"Regular",gender:"Male",hire:"2023-02-09",salaryType:"Daily",rate:1050},
{id:"UC-0005",name:"Mika Flores",branch:"UC Las Piñas",department:"Marketing",position:"Content Specialist",status:"Regular",gender:"Female",hire:"2024-11-16",salaryType:"Monthly",rate:28500},
{id:"UC-0006",name:"Rafael Garcia",branch:"UC Quezon City",department:"Operations",position:"Technician",status:"Probationary",gender:"Male",hire:"2026-09-09",salaryType:"Daily",rate:750},
{id:"MM-0002",name:"Lea Villanueva",branch:"MM Mandaluyong",department:"Administration",position:"Cashier",status:"Regular",gender:"Female",hire:"2025-06-22",salaryType:"Daily",rate:820},
{id:"UC-0007",name:"Noel Ramos",branch:"UC Las Piñas",department:"Operations",position:"Service Technician",status:"Regular",gender:"Male",hire:"2024-10-01",salaryType:"Daily",rate:900},
{id:"MM-0003",name:"Angela Bautista",branch:"MM Mandaluyong",department:"Operations",position:"Technician",status:"Probationary",gender:"Female",hire:"2026-08-23",salaryType:"Daily",rate:760},
{id:"UC-0008",name:"Luis Navarro",branch:"UC Mandaluyong",department:"Service",position:"Service Advisor",status:"Regular",gender:"Male",hire:"2022-12-10",salaryType:"Monthly",rate:28000},
{id:"UC-0009",name:"Bianca Lim",branch:"UC Quezon City",department:"Administration",position:"Admin Assistant",status:"Regular",gender:"Female",hire:"2025-01-27",salaryType:"Monthly",rate:22000}
];
export const shopNames:Shop[]=["UC Mandaluyong","UC Las Piñas","UC Quezon City","MM Mandaluyong"];
export const php=(n:number)=>new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP"}).format(n);
