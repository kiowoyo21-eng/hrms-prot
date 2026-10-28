export type PrintCompany = "UC" | "MM";
export type PrintFormData = {
  company: PrintCompany;
  branch?: string;
  employeeName?: string;
  employeeId?: string;
  position?: string;
  department?: string;
  reference?: string;
  date?: string;
  status?: string;
  preparedBy?: string;
  reviewedBy?: string;
  approvedBy?: string;
  values: Record<string, string>;
  source?: "catalog-preview" | "hr-request";
};
export type PrintTemplateProps = { data: PrintFormData };
export type PrintTemplateId =
  | "probation-standards" | "preemployment-checklist" | "statutory-contributions"
  | "nda" | "leave" | "halfday" | "overtime" | "workpermit"
  | "asset-accountability" | "factfinding" | "nte-nov" | "resolution-nod"
  | "policies-safety" | "employee-information" | "job-offer" | "employment-contract"
  | "orientation-acknowledgment";
