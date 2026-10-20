/** Small deterministic, safe formula evaluator: no eval, scripts, network, or external refs. */
export const columnLabel=(index:number)=>{let out="";for(let n=index+1;n>0;n=Math.floor((n-1)/26))out=String.fromCharCode(65+(n-1)%26)+out;return out};
export function decodeCell(ref:string):{row:number;col:number}|null{const m=/^(\$?[A-Z]{1,2})(\$?[1-9]\d{0,3})$/.exec(ref.toUpperCase());if(!m)return null;let col=0;for(const c of m[1].replace(/\$/g,""))col=col*26+c.charCodeAt(0)-64;return {row:Number(m[2].replace(/\$/g,""))-1,col:col-1}}
export type CellResult=string|number;
export function evaluateSheetFormula(input:string,get:(ref:string)=>CellResult):CellResult{
 if(!input.startsWith("="))return input;
 try{
  const body=input.slice(1).toUpperCase();const tokenRe=/\s*(\$?[A-Z]{1,2}\$?[1-9]\d{0,3}|[A-Z]+|(?:\d+(?:\.\d*)?|\.\d+)|[()+\-*/,:])/gy;
  const tokens:string[]=[];let at=0;
  while(at<body.length){tokenRe.lastIndex=at;const m=tokenRe.exec(body);if(!m)throw Error("syntax");tokens.push(m[1]);at=tokenRe.lastIndex;if(tokens.length>1800)throw Error("complex")}
  let pos=0;const peek=()=>tokens[pos],eat=(x:string)=>{if(peek()!==x)throw Error("syntax");pos++};
  const valueOf=(ref:string)=>{const v=get(ref);if(typeof v==="string"&&v.startsWith("#"))throw Error(v);const parsed=typeof v==="number"?v:Number(v);return Number.isFinite(parsed)?parsed:0};
  const factor=():number=>{const t=peek();if(!t)throw Error("syntax");if(t==="+"){pos++;return factor()}if(t==="-"){pos++;return -factor()}if(t==="("){pos++;const v=expr();eat(")");return v}
   if(/^\d/.test(t)||t.startsWith(".")){pos++;return Number(t)}
   if(/^\$?[A-Z]{1,2}\$?[1-9]\d{0,3}$/.test(t)){pos++;if(!decodeCell(t))throw Error("#REF!");return valueOf(t.replace(/\$/g,""))}
   if(/^(SUM|AVERAGE|MIN|MAX|COUNT)$/.test(t)){pos++;eat("(");const vals:number[]=[];while(peek()!==")"){if(!peek())throw Error("syntax");const a=peek();const b=tokens[pos+1],c=tokens[pos+2];if(/^\$?[A-Z]{1,2}\$?[1-9]\d{0,3}$/.test(a)&&b===":"&&c&&/^\$?[A-Z]{1,2}\$?[1-9]\d{0,3}$/.test(c)){
      pos+=3;const start=decodeCell(a),end=decodeCell(c);if(!start||!end||start.row>end.row||start.col>end.col||(end.row-start.row+1)*(end.col-start.col+1)>1000)throw Error("#REF!");for(let row=start.row;row<=end.row;row++)for(let col=start.col;col<=end.col;col++){const ref=`${columnLabel(col)}${row+1}`;const v=get(ref);if(typeof v==="string"&&v.startsWith("#"))throw Error(v);if(String(v??"").trim()!==""&&Number.isFinite(Number(v)))vals.push(Number(v))}
     }else vals.push(expr());if(peek()!==",")break;pos++}
    eat(")");switch(t){case "SUM":return vals.reduce((a,b)=>a+b,0);case "AVERAGE":return vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:0;case "MIN":return vals.length?Math.min(...vals):0;case "MAX":return vals.length?Math.max(...vals):0;default:return vals.length}}
   throw Error("syntax")};
  const term=():number=>{let n=factor();while(peek()==="*"||peek()==="/"){const op=tokens[pos++];const next=factor();if(op==="/"&&next===0)throw Error("#DIV/0!");n=op==="*"?n*next:n/next}return n};
  const expr=():number=>{let n=term();while(peek()==="+"||peek()==="-"){const op=tokens[pos++];const next=term();n=op==="+"?n+next:n-next}return n};
  const output=expr();if(pos!==tokens.length||!Number.isFinite(output))throw Error("syntax");return Number(output.toFixed(8));
 }catch(e){const message=e instanceof Error?e.message:"";return message.startsWith("#")?message:"#ERROR!"}
}
