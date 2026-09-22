const http=require("http");
const crypto=require("crypto");
const fs=require("fs");
const path=require("path");

const PORT=Number(process.env.PORT||8080);
const VERSION="2.0.0";
const started=Date.now();
const MAX_BODY_BYTES=Math.max(1024,Number(process.env.APEX_MAX_BODY_BYTES||1048576));
const MAX_TOKENS=Math.max(1,Math.min(Number(process.env.APEX_MAX_TOKENS||256),256));
const REQUEST_TIMEOUT_MS=Math.max(1000,Number(process.env.APEX_REQUEST_TIMEOUT_MS||30000));
const CORS_ORIGIN=process.env.APEX_CORS_ORIGIN||"*";
const MODEL_PATH=process.env.APEX_MODEL||path.join(__dirname,"models","apex-trained-128-transition-v2.apex.json");
const TRANSFORMER_CHECKPOINT=process.env.APEX_TRANSFORMER_CHECKPOINT||"";
const PYTHON_BIN=process.env.APEX_PYTHON||"python3";
let transformer=null,transformerError=null;

let model=null,modelError=null,MODEL_ID=null;
try{
 const d=JSON.parse(fs.readFileSync(MODEL_PATH,"utf8"));
 if(d.format!=="APEXMODEL1")throw new Error("INVALID_APEX_MODEL_FORMAT");
 if(!d.vocab||typeof d.vocab!=="object"||!Array.isArray(d.weights)||!Array.isArray(d.id_to_token)||!Number.isInteger(d.context)||d.context<1)throw new Error("INVALID_APEX_MODEL_SCHEMA");
 if(d.weights.length!==d.id_to_token.length)throw new Error("INVALID_APEX_MODEL_DIMENSIONS");
 const width=d.id_to_token.length;
 for(const row of d.weights){
  if(!Array.isArray(row)||row.length!==width||row.some(x=>!Number.isFinite(x)))throw new Error("INVALID_APEX_MODEL_WEIGHTS");
 }
 model=d;
 MODEL_ID=String(d.model_id||d.name||path.basename(MODEL_PATH,".json"));
}catch(e){modelError=String(e.message||e);}

function json(res,status,obj){
 res.statusCode=status;
 res.setHeader("Content-Type","application/json; charset=utf-8");
 res.setHeader("Cache-Control","no-store");
 res.setHeader("X-Content-Type-Options","nosniff");
 res.setHeader("Access-Control-Allow-Origin",CORS_ORIGIN);
 res.setHeader("Access-Control-Allow-Headers","Content-Type, Authorization");
 res.setHeader("Access-Control-Allow-Methods","GET,POST,OPTIONS");
 res.end(JSON.stringify(obj));
}
function startTransformer(){
 if(!TRANSFORMER_CHECKPOINT)return;
 try{
  const cp=require("child_process").spawn(PYTHON_BIN,[path.join(__dirname,"apex-transformer-worker.py"),TRANSFORMER_CHECKPOINT],{stdio:["pipe","pipe","pipe"]});
  let buf="",pending=[];
  cp.stdout.on("data",d=>{buf+=d.toString();let i;while((i=buf.indexOf("\n"))>=0){const line=buf.slice(0,i);buf=buf.slice(i+1);const p=pending.shift();if(p){try{p.resolve(JSON.parse(line))}catch(e){p.reject(e)}}}});
  cp.stderr.on("data",d=>{transformerError=d.toString().trim()||transformerError});
  cp.on("error",e=>{transformerError=String(e.message||e);transformer=null});
  cp.on("exit",(code)=>{if(code!==0)transformerError=transformerError||("worker exited "+code);transformer=null});
  transformer={cp,pending};
 }catch(e){transformerError=String(e.message||e)}
}
function transformerRequest(req){
 return new Promise((resolve,reject)=>{
  if(!transformer)return reject(new Error("TRANSFORMER_UNAVAILABLE"));
  transformer.pending.push({resolve,reject});
  transformer.cp.stdin.write(JSON.stringify(req)+"\n",e=>{if(e){const p=transformer.pending.pop();if(p)p.reject(e)}});
 });
}
function modelHash(){
 try{return crypto.createHash("sha256").update(fs.readFileSync(MODEL_PATH)).digest("hex")}
 catch{return null}
}
function generate(prompt,maxTokens=MAX_TOKENS){
 if(!model)throw new Error("MODEL_UNAVAILABLE");
 const limit=Math.max(1,Math.min(Number(maxTokens)||MAX_TOKENS,MAX_TOKENS));
 const v=model.vocab,ids=[...String(prompt??"")].map(c=>v[c]).filter(Number.isInteger).slice(-model.context),out=[];
 for(let k=0;k<limit;k++){
  const row=model.weights[ids.length?ids[ids.length-1]:0];
  let best=0,score=-Infinity;
  for(let i=0;i<row.length;i++)if(row[i]>score){score=row[i];best=i}
  const ch=model.id_to_token[best];
  if(typeof ch!=="string")throw new Error("INVALID_APEX_TOKEN");
  if(ch==="\n")break;
  out.push(ch);ids.push(best);if(ids.length>model.context)ids.shift();
 }
 return out.join("");
}
function verify(){
 const prompt="APEX deterministic verification probe";
 const t0=process.hrtime.bigint(),a=generate(prompt),t1=process.hrtime.bigint(),b=generate(prompt),t2=process.hrtime.bigint();
 return {
  service:"APEX",version:VERSION,source:"APEX_MODEL_ONLY",deterministic:a===b,
  model_loaded:!!model,model:MODEL_ID,model_hash_sha256:modelHash(),
  probe_hash_sha256:crypto.createHash("sha256").update(prompt).digest("hex"),
  output_hash_sha256:crypto.createHash("sha256").update(a).digest("hex"),
  probe_output:a,
  first_latency_ms:Number((Number(t1-t0)/1e6).toFixed(6)),
  repeat_latency_ms:Number((Number(t2-t1)/1e6).toFixed(6)),
  note:"Verifies loading, provenance, repeatability and latency; it does not establish benchmark accuracy or leaderboard status."
 };
}
function readBody(req){
 return new Promise((resolve,reject)=>{
  let body="",bytes=0,done=false;
  const fail=e=>{if(!done){done=true;reject(e)}};
  const timer=setTimeout(()=>{req.destroy();fail(new Error("REQUEST_TIMEOUT"))},REQUEST_TIMEOUT_MS);
  req.on("data",chunk=>{
   bytes+=chunk.length;
   if(bytes>MAX_BODY_BYTES){clearTimeout(timer);req.destroy();fail(new Error("REQUEST_BODY_TOO_LARGE"));return}
   body+=chunk.toString("utf8");
  });
  req.on("end",()=>{clearTimeout(timer);if(!done){done=true;resolve(body)}});
  req.on("error",e=>{clearTimeout(timer);fail(e)});
 });
}
function serveStatic(res,filePath){
 try{
  const ext=path.extname(filePath);
  const types={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json; charset=utf-8"};
  const data=fs.readFileSync(filePath);
  res.statusCode=200;
  res.setHeader("Content-Type",types[ext]||"application/octet-stream");
  res.setHeader("Cache-Control","no-store");
  res.setHeader("X-Content-Type-Options","nosniff");
  res.end(data);
  return true;
 }catch{return false}
}
startTransformer();
const server=http.createServer(async(req,res)=>{
  if(req.method==="GET"){
    const pathname=(req.url||"/").split("?")[0];
    const safe=pathname==="/"?"/index.html":pathname;
    const rel=safe.startsWith("/frontend/")?safe.slice(1):safe.slice(1);
    if((safe==="/index.html"||safe.startsWith("/frontend/")) && serveStatic(res,path.join(__dirname,rel))) return;
  }
 if(req.method==="OPTIONS"){res.statusCode=204;res.setHeader("Access-Control-Allow-Origin",CORS_ORIGIN);res.setHeader("Access-Control-Allow-Headers","Content-Type, Authorization");res.setHeader("Access-Control-Allow-Methods","GET,POST,OPTIONS");res.setHeader("Cache-Control","no-store");return res.end();}
 if(req.url==="/health"&&req.method==="GET")return json(res,(model||transformer)?200:503,{status:(model||transformer)?"ok":"degraded",service:"APEX",version:VERSION,model_loaded:!!model,transformer_loaded:!!transformer,model_error:modelError,transformer_error:transformerError,model:MODEL_ID,transformer_checkpoint:TRANSFORMER_CHECKPOINT||null,model_hash_sha256:modelHash(),uptime_ms:Date.now()-started});
 if(req.url==="/v1/models"&&req.method==="GET")return json(res,model?200:503,{object:"list",data:model?[{id:MODEL_ID,object:"model",owned_by:"APEX",format:"APEXMODEL1",hash_sha256:modelHash()}]:[]});
 if(req.url==="/v1/verify"&&req.method==="GET"){try{return json(res,model?200:503,verify())}catch(e){return json(res,503,{error:{message:String(e.message||e)}})}}
 if(req.url==="/v1/chat/completions"&&req.method==="POST"){
  let body;try{body=await readBody(req)}catch(e){const msg=String(e.message||e);return json(res,msg==="REQUEST_BODY_TOO_LARGE"?413:408,{error:{message:msg}})}
  let x;try{x=JSON.parse(body||"{}")}catch{return json(res,400,{error:{message:"INVALID_JSON"}})}
  if(!Array.isArray(x.messages)||x.messages.length===0)return json(res,400,{error:{message:"MESSAGES_REQUIRED"}});
  const last=x.messages[x.messages.length-1],p=typeof last?.content==="string"?last.content:"";
  if(!p)return json(res,400,{error:{message:"MESSAGE_CONTENT_REQUIRED"}});
  if(x.model&&x.model!==MODEL_ID)return json(res,400,{error:{message:"MODEL_NOT_AVAILABLE",model:x.model,available_models:[MODEL_ID]}});
  try{
   if(transformer){
    const t0=process.hrtime.bigint();
    const wr=await transformerRequest({op:"generate",prompt:p,max_tokens:x.max_tokens});
    if(!wr.ok)throw new Error(wr.error||"TRANSFORMER_INFERENCE_FAILED");
    const content=wr.text||"";
    return json(res,200,{id:"apex-"+crypto.randomUUID(),object:"chat.completion",model:TRANSFORMER_CHECKPOINT,choices:[{index:0,message:{role:"assistant",content},finish_reason:"stop"}],usage:{prompt_tokens:p.length,completion_tokens:content.length,total_tokens:p.length+content.length},provenance:{source:"APEX_TRANSFORMER_LOCAL",checkpoint:TRANSFORMER_CHECKPOINT,latency_ms:Number((Number(process.hrtime.bigint()-t0)/1e6).toFixed(6))}});
   }
   const content=generate(p,x.max_tokens);
   return json(res,200,{id:"apex-"+crypto.randomUUID(),object:"chat.completion",model:MODEL_ID,choices:[{index:0,message:{role:"assistant",content},finish_reason:"stop"}],usage:{prompt_tokens:p.length,completion_tokens:content.length,total_tokens:p.length+content.length},provenance:{source:"APEX_MODEL_ONLY",model_hash_sha256:modelHash()}});
  }catch(e){return json(res,503,{error:{message:String(e.message||e)}})}
 }
 return json(res,404,{error:{message:"Not found"}});
});
server.requestTimeout=REQUEST_TIMEOUT_MS;
server.headersTimeout=Math.max(REQUEST_TIMEOUT_MS,5000);
server.keepAliveTimeout=5000;
server.listen(PORT,()=>console.log("APEX "+VERSION+" listening on "+PORT));
