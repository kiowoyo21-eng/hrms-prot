/** Browser-only review data. Authorization and storage are NOT secure until server-backed. */
export type StudioKind = "docs" | "pdf";
export type TemplateCategory = "Employment" | "Payroll" | "Compliance" | "Onboarding" | "Disciplinary" | "General";
export type StudioItem = {
 id:string;kind:StudioKind;title:string;category:TemplateCategory;template:boolean;
 html?:string;pageSize?:"A4"|"Letter"|"Legal";landscape?:boolean;headerText?:string;footerText?:string;marginMm?:number;
 fields?:PdfField[];originalName?:string;owner:string;createdAt:string;updatedAt:string;version:number;
 parentId?:string;status:"Draft"|"Approved Template"|"Archived";
};
export type PdfField={id:string;page:number;label:string;mapping:string;type:"text"|"date"|"checkbox"|"signature";x:number;y:number;width:number;height:number;fontSize:number;required:boolean;defaultValue:string;sourceName?:string};
export type ApprovalRequest={id:string;itemId:string;itemTitle:string;requester:string;reason:string;status:"pending"|"approved"|"denied"|"revoked";requestedAt:string;decidedAt?:string;decidedBy?:string;expiresAt?:string;note?:string};
export type StudioRevision={id:string;itemId:string;version:number;date:string;actor:string;snapshot:StudioItem};
export type StudioLog={id:string;itemId:string;date:string;actor:string;action:string;detail:string};
export type StudioState={items:StudioItem[];approvals:ApprovalRequest[];revisions:StudioRevision[];logs:StudioLog[]};
export type StudioActor={username:string;role:"HR"|"Super Admin"|"BM"};
