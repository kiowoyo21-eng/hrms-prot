/** Browser-session demo only: actual files never enter localStorage. A missing file fails closed. */
const attachments=new Map<string,File>();
export const validPermitFile=(file:File)=>["application/pdf","image/jpeg","image/png","image/webp"].includes(file.type)&&file.size>0&&file.size<=10*1024*1024;
export function attachOpsPermitFile(id:string,file:File){if(!validPermitFile(file))throw new Error("Attach a PDF/JPG/PNG/WebP file up to 10 MB.");attachments.set(id,file)}
export function getOpsPermitFile(id:string){return attachments.get(id)||null}
export function hasOpsPermitFile(id:string){return attachments.has(id)}
export function openOpsPermitFile(id:string){const file=getOpsPermitFile(id);if(!file)return false;const url=URL.createObjectURL(file);window.open(url,"_blank","noopener,noreferrer");window.setTimeout(()=>URL.revokeObjectURL(url),60000);return true}
