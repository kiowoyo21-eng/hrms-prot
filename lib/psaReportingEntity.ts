/** Reporting entities for the HRMS data-support view, distinct from operational branch filters. */
import type {Shop} from "./people";
import type {Branch} from "./mock";
export type PsaReportingEntity="Underchargers"|"Mastermind";
export const PSA_ENTITIES:readonly PsaReportingEntity[]=["Underchargers","Mastermind"];
export function psaEntityForBranch(branch:string|undefined):PsaReportingEntity|null{
 if(branch==="UC Las Piñas"||branch==="UC Mandaluyong"||branch==="UC Quezon City")return "Underchargers";
 if(branch==="MM Mandaluyong")return "Mastermind";
 return null;
}
/** An operational branch selection must not split the UC entity into separate PSA reports. */
export function psaEntitiesForScope(branch:Branch):PsaReportingEntity[]{
 if(branch==="All Shops")return [...PSA_ENTITIES];
 const entity=psaEntityForBranch(branch as Shop);
 return entity?[entity]:[];
}
