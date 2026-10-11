export type Role = "Super Admin" | "HR" | "BM";
export type Branch = "All Shops" | "UC Mandaluyong" | "UC Las Piñas" | "UC Quezon City" | "MM Mandaluyong";
export const branches: Branch[] = ["All Shops","UC Mandaluyong","UC Las Piñas","UC Quezon City","MM Mandaluyong"];
export const modules = [
 {id:"dashboard",name:"Dashboard",icon:"LayoutDashboard",count:0},
 {id:"employees",name:"Employee 201 Files",icon:"FolderOpen",count:8},
 {id:"lifecycle",name:"Employee Life Cycle",icon:"Workflow",count:5},
 {id:"payroll",name:"Payroll",icon:"Wallet",count:3},
 {id:"leave",name:"Leave Management",icon:"CalendarCheck",count:2},
 {id:"loans",name:"Loans & Advances",icon:"HandCoins",count:2},
 {id:"ir",name:"Incident Reports",icon:"FileWarning",count:4},
 {id:"assets",name:"Assets & Devices",icon:"Laptop",count:2},
 {id:"compliance",name:"Government Compliance",icon:"Landmark",count:7},
 {id:"tasks",name:"HR Tasks",icon:"ListTodo",count:6},
 {id:"documents",name:"Documents & Templates",icon:"Files",count:0},
 {id:"filters",name:"Custom Filters & Reports",icon:"SlidersHorizontal",count:0},
 {id:"audit",name:"Grouped Audit Logs",icon:"ScrollText",count:2},
 {id:"settings",name:"Account Settings",icon:"Settings",count:0}
] as const;
export type ModuleId = typeof modules[number]["id"];
export const permissions: Record<Role, ModuleId[]> = {
 "Super Admin":modules.map(m=>m.id),
 "HR": ["dashboard","employees","lifecycle","payroll","leave","loans","ir","assets","compliance","tasks","documents","filters","audit","settings"],
 "BM": ["dashboard","employees","lifecycle","leave","ir","assets","tasks","documents","settings"]
};
export const demoAccounts = [{username:"admin",password:"admin12345",role:"Super Admin" as Role},{username:"hraccount",password:"hraccount12345",role:"HR" as Role},{username:"bmaccount",password:"bm12345",role:"BM" as Role}];
export type Task = {id:number,module:ModuleId,title:string,branch:Branch,priority:"Critical"|"Urgent"|"Normal",status:"Pending"|"For Review"|"Overdue",owner:"HR"|"BM"|"Super Admin",due:string};
export const tasks:Task[] = [
{id:1,module:"employees",title:"Verify new hire medical clearance",branch:"UC Mandaluyong",priority:"Urgent",status:"Pending",owner:"HR",due:"2026-10-15"},
{id:2,module:"lifecycle",title:"Probationary assessment review",branch:"UC Las Piñas",priority:"Normal",status:"For Review",owner:"HR",due:"2026-10-24"},
{id:3,module:"payroll",title:"Review weekly payroll calculation",branch:"UC Mandaluyong",priority:"Critical",status:"For Review",owner:"HR",due:"2026-10-14"},
{id:4,module:"ir",title:"IR resolution follow-up",branch:"MM Mandaluyong",priority:"Urgent",status:"Pending",owner:"BM",due:"2026-10-18"},
{id:5,module:"compliance",title:"Review upcoming work permit renewal",branch:"MM Mandaluyong",priority:"Urgent",status:"Pending",owner:"HR",due:"2026-11-10"},
{id:6,module:"tasks",title:"Approve annual compliance schedule",branch:"All Shops",priority:"Normal",status:"Pending",owner:"HR",due:"2026-12-15"},
{id:7,module:"assets",title:"Inspect returned device",branch:"UC Quezon City",priority:"Normal",status:"Pending",owner:"BM",due:"2026-10-20"},
{id:8,module:"loans",title:"Validate SSS loan amortization",branch:"UC Las Piñas",priority:"Normal",status:"For Review",owner:"HR",due:"2026-10-22"}
];
export const activity=[
 {module:"Payroll",text:"Payroll calculation preview requested",user:"HR Sample",date:"Oct 11, 2026"},
 {module:"Employee 201",text:"Onboarding requirement flagged",user:"HR Sample",date:"Oct 10, 2026"},
 {module:"Incident Reports",text:"Case assigned to Branch Manager",user:"System Example",date:"Oct 09, 2026"}
];
