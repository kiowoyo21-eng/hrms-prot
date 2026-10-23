/** Portable public questionnaire PREVIEW. No remote submissions or respondent data travel in links. */
import {validateIntakeForm,type IntakeField,type IntakeForm,type IntakeFieldType} from "./intakeForms";
export const MAX_PORTABLE_URL_LENGTH=2200;
type PortableFieldV1=[string,string,IntakeFieldType,0|1,string[],string?];
type PortableFieldV2=[string,string,IntakeFieldType,0|1,string[],string?,string?,[string,string]?];
type PortablePayloadV1=[1,string,string,string,number,PortableFieldV1[]];
type PortablePayloadV2=[2,string,string,string,number,PortableFieldV2[]];
const acceptedTypes=new Set<IntakeFieldType>(["short","paragraph","email","date","number","select","radio","checkbox"]);
const utf8=new TextEncoder(),decoder=new TextDecoder();
function toBase64URL(bytes:Uint8Array){let value="";for(const byte of bytes)value+=String.fromCharCode(byte);return btoa(value).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"");}
function fromBase64URL(value:string):Uint8Array{if(!/^[\w-]+$/.test(value))throw new Error("Invalid form link");const binary=atob(value.replace(/-/g,"+").replace(/_/g,"/").padEnd(Math.ceil(value.length/4)*4,"="));return Uint8Array.from(binary,x=>x.charCodeAt(0));}
async function compress(bytes:Uint8Array){if(typeof CompressionStream==="undefined")throw new Error("This browser cannot generate compressed form preview links.");const stream=new Blob([bytes as BlobPart]).stream().pipeThrough(new CompressionStream("deflate"));return new Uint8Array(await new Response(stream).arrayBuffer());}
async function decompress(bytes:Uint8Array){if(typeof DecompressionStream==="undefined")throw new Error("This browser cannot open compressed form preview links.");const stream=new Blob([bytes as BlobPart]).stream().pipeThrough(new DecompressionStream("deflate"));const output=await new Response(stream).arrayBuffer();if(output.byteLength>24000)throw new Error("Form link is too large");return new Uint8Array(output);}
export function snapshotFor(form:IntakeForm):PortablePayloadV2{if(form.target!=="custom"||form.status!=="Published")throw new Error("Only published custom forms can be shared as a portable preview.");const problems=validateIntakeForm(form);if(problems.length)throw new Error(problems[0]);return [2,form.id,form.title,form.description,form.version,form.fields.map(q=>[q.id,q.label,q.type,q.required?1:0,q.options||[],q.help||"",q.section||"",q.showIf?[q.showIf.fieldId,q.showIf.equals]:undefined])];}
export async function createPortableLink(form:IntakeForm,origin:string):Promise<string>{const payload=snapshotFor(form);const token=toBase64URL(await compress(utf8.encode(JSON.stringify(payload))));const base=new URL(`/intake/${encodeURIComponent(form.id)}`,origin);base.searchParams.set("s",token);const url=base.toString();if(url.length>MAX_PORTABLE_URL_LENGTH)throw new Error("Too many questions for one QR link. Use a shorter form for the portable preview; a live form backend is required for unlimited-size links.");return url;}
export async function parsePortableLink(token:string,id:string):Promise<IntakeForm>{if(token.length>4000)throw new Error("Form link is too large");const text=decoder.decode(await decompress(fromBase64URL(token)));const data:unknown=JSON.parse(text);
 if(!Array.isArray(data)||data.length!==6||(data[0]!==1&&data[0]!==2)||data[1]!==id||typeof data[2]!=="string"||typeof data[3]!=="string"||!Array.isArray(data[5])||data[5].length>35)throw new Error("Invalid form preview link");
 const [versionTag,formId,title,description,version,fields]=data as PortablePayloadV1|PortablePayloadV2;
 if(!formId||formId.length>100||title.length>140||description.length>600||!Number.isFinite(version)||version<1)throw new Error("Invalid form details");
 const mapped:IntakeField[]=fields.map(x=>{if(!Array.isArray(x)||x.length>(versionTag===1?6:8)||typeof x[0]!=="string"||typeof x[1]!=="string"||!acceptedTypes.has(x[2])||!Array.isArray(x[4])||x[0].length>100||x[1].length>160||x[4].length>25||x[4].some(v=>typeof v!=="string"||v.length>100)||String(x[5]||"").length>300)throw new Error("Invalid question in form preview link");
  const extended=x as PortableFieldV2;
  if(versionTag===2&&(typeof extended[6]!=="undefined"&&(typeof extended[6]!=="string"||extended[6].length>80)))throw new Error("Invalid section");
  if(versionTag===2&&extended[7]!=null&&(!Array.isArray(extended[7])||extended[7].length!==2||extended[7].some(v=>typeof v!=="string"||v.length>100)))throw new Error("Invalid display rule");
  return {id:x[0],label:x[1],type:x[2],required:x[3]===1,options:x[4],help:x[5]||"",section:versionTag===2?extended[6]||"":"",showIf:versionTag===2&&extended[7]?{fieldId:extended[7][0],equals:extended[7][1]}:undefined};});
 const form:IntakeForm={id:formId,title,description,version:Math.floor(version),fields:mapped,target:"custom",audience:"public",status:"Published",createdAt:"",updatedAt:""};const problems=validateIntakeForm(form);if(problems.length)throw new Error(problems[0]);return form;}
