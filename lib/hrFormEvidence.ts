/** Request-level temporary attachment bytes. Metadata is kept on the originating HRFormRecord. */
const files=new Map<string,File>();
export type HRFormAttachment={id:string;name:string;mime:string;createdAt:string;addedBy:string;status:"Pending Verification"|"Verified"|"Rejected";reviewedBy?:string;reviewedAt?:string;remarks?:string};
export function permittedHRFile(file:File){return ["application/pdf","image/jpeg","image/png","image/webp"].includes(file.type)&&file.size>0&&file.size<=10*1024*1024}
export function saveHRFormFile(requestId:string,attachmentId:string,file:File){if(!permittedHRFile(file))throw Error("Attach PDF/JPG/PNG/WebP up to 10 MB");files.set(`${requestId}/${attachmentId}`,file)}
export function hasHRFormFile(requestId:string,attachmentId:string){return files.has(`${requestId}/${attachmentId}`)}
export function openHRFormFile(requestId:string,attachmentId:string){const file=files.get(`${requestId}/${attachmentId}`);if(!file)return false;const url=URL.createObjectURL(file);window.open(url,"_blank","noopener,noreferrer");window.setTimeout(()=>URL.revokeObjectURL(url),60000);return true}
