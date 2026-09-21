const http=require("http");
const crypto=require("crypto");
const fs=require("fs");
const path=require("path");
const PORT=process.env.PORT||8080, VERSION="1.3.0", started=Date.now();
const MODEL_PATH=process.env.APEX_MODEL||path.join(__dirname,"models","apex-bootstrap.apex.json");
let model=null, modelError=null;
try{const d=JSON.parse(fs.readFileSync(MODEL_PATH,"utf8"));if(d.format!=="APEXMODEL1")throw new Error("INVALID_APEX_MODEL_FORMAT");model=d;}catch(e){modelError=String(e.message||e);}
function json(res,status,obj){res.statusCode=status;res.setHeader("Content-Type","application/json");res.end(JSON.stringify(obj));}
function modelHash(){try{return crypto.createHash("sha256").update(fs.readFileSync(MODEL_PATH)).digest("hex")}catch{return null}}
function generate(prompt,maxTokens=128){
 if(!model)throw new Error("MODEL_UNAVAILABLE");
 const v=model.vocab,ids=[...String(prompt??"")].map(c=>v[c]).filter(x=>x!==undefined).slice(-model.context),out=[];
 for(let k=0;k<maxTokens;k++){const row=model.weights[ids.length?ids[ids.length-1]:0];let best=0,score=-Infinity;for(let i=0;i<row.length;i++)if(row[i]>score){score=row[i];best=i}const ch=model.id_to_token[best];if(ch==="\n")break;out.push(ch);ids.push(best);if(ids.length>model.context)ids.shift()}
 return out.join("");
}
function verify(){
 const prompt="APEX deterministic verification probe";
 const t0=process.hrtime.bigint();const a=generate(prompt);const t1=process.hrtime.bigint();const b=generate(prompt);const t2=process.hrtime.bigint();
 return {service:"APEX",version:VERSION,source:"APEX_MODEL_ONLY",deterministic:a===b,model_loaded:!!model,model:"apex-bootstrap-1.0",model_hash_sha256:modelHash(),probe_hash_sha256:crypto.createHash("sha256").update(prompt).digest("hex"),output_hash_sha256:crypto.createHash("sha256").update(a).digest("hex"),probe_output:a,first_latency_ms:Number((Number(t1-t0)/1e6).toFixed(6)),repeat_latency_ms:Number((Number(t2-t1)/1e6).toFixed(6)),note:"This endpoint verifies model loading, provenance, repeatability and latency. It does not claim benchmark accuracy or leaderboard status."};
}
const server=http.createServer((req,res)=>{let body="";req.on("data",c=>body+=c);req.on("end",()=>{
 if(req.url==="/health")return json(res,model?200:503,{status:model?"ok":"degraded",service:"APEX",version:VERSION,model_loaded:!!model,model_error:modelError,model:"apex-bootstrap-1.0",model_hash_sha256:modelHash(),uptime_ms:Date.now()-started});
 if(req.url==="/v1/models")return json(res,model?200:503,{object:"list",data:model?[{id:"apex-bootstrap-1.0",object:"model",owned_by:"APEX",format:"APEXMODEL1",hash_sha256:modelHash()}]:[]});
 if(req.url==="/v1/verify")try{return json(res,model?200:503,verify())}catch(e){return json(res,503,{error:{message:String(e.message||e)}})};
 if(req.url==="/v1/chat/completions"&&req.method==="POST"){let x={};try{x=JSON.parse(body||"{}")}catch{return json(res,400,{error:{message:"INVALID_JSON"}})}const ms=Array.isArray(x.messages)?x.messages:[],p=ms.length?ms[ms.length-1].content:"";try{const content=generate(p);return json(res,200,{id:"apex-"+crypto.randomUUID(),object:"chat.completion",model:x.model||"apex-bootstrap-1.0",choices:[{index:0,message:{role:"assistant",content},finish_reason:"stop"}],usage:{prompt_tokens:0,completion_tokens:content.length,total_tokens:content.length},provenance:{source:"APEX_MODEL_ONLY",model_hash_sha256:modelHash()}})}catch(e){return json(res,503,{error:{message:String(e.message||e)}})}}
 return json(res,404,{error:{message:"Not found"}});
})});
server.listen(PORT,()=>console.log("APEX listening on "+PORT));
