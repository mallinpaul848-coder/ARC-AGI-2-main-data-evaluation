#!/usr/bin/env node
const fs=require("fs"),path=require("path"),crypto=require("crypto");
const args=process.argv.slice(2),mi=args.indexOf("--manifest"),oi=args.indexOf("--output");
if(mi<0||oi<0) throw new Error("usage: apex-run --manifest <manifest> --output <output.jsonl>");
const manifest=JSON.parse(fs.readFileSync(args[mi+1],"utf8"));
const modelPath=process.env.APEX_MODEL||path.join(__dirname,"models","apex-bootstrap.apex.json");
const model=JSON.parse(fs.readFileSync(modelPath,"utf8"));
if(model.format!=="APEXMODEL1") throw new Error("INVALID_APEX_MODEL_FORMAT");
function generate(prompt,maxTokens=128){
 const p=String(prompt??"");
 const v=model.vocab,ids=[...p].map(c=>v[c]).filter(x=>x!==undefined).slice(-model.context),out=[];
 for(let k=0;k<maxTokens;k++){
  const row=model.weights[ids.length?ids[ids.length-1]:0];
  let best=0,score=-Infinity;
  for(let i=0;i<row.length;i++) if(row[i]>score){score=row[i];best=i}
  const ch=model.id_to_token[best]; if(ch==="\n") break;
  out.push(ch); ids.push(best); if(ids.length>model.context) ids.shift();
 }
 return out.join("");
}
const modelBytes=fs.readFileSync(modelPath);
const modelHash=crypto.createHash("sha256").update(modelBytes).digest("hex");
const manifestBytes=fs.readFileSync(args[mi+1]);
const manifestHash=crypto.createHash("sha256").update(manifestBytes).digest("hex");
const started=process.hrtime.bigint();
const tests=manifest.tests||manifest.cases||[];
const lines=tests.map(t=>{
 const start=process.hrtime.bigint(); let output=null,error=null,correct=false;
 try{output=generate(t.input);correct=output===String(t.expected)}catch(e){error=String(e.message||e)}
 const latency=Number(process.hrtime.bigint()-start)/1e6;
 const inputHash=crypto.createHash("sha256").update(JSON.stringify(t.input)).digest("hex");
 return {test_id:String(t.test_id??t.id??inputHash.slice(0,12)),input_hash:inputHash,output,expected:String(t.expected),correct,error,timeout:false,latency_ms:Number(latency.toFixed(6)),model:"apex-bootstrap-1.0",model_hash_sha256:modelHash,manifest_hash_sha256:manifestHash,runtime:"apex-run-node",hardware:process.arch,sampling:{deterministic:true},source:"APEX_MODEL_ONLY"};
});
fs.writeFileSync(args[oi+1],lines.map(x=>JSON.stringify(x)).join("\n")+"\n");
const correct=lines.filter(x=>x.correct).length;
const lats=lines.map(x=>x.latency_ms).sort((a,b)=>a-b);
const pct=q=>lats.length?lats[Math.min(lats.length-1,Math.ceil(q*lats.length)-1)]:null;
const summary={schema:"APEX-VERIFICATION-1",source:"APEX_MODEL_ONLY",tests:lines.length,correct,accuracy:lines.length?correct/lines.length:null,p50_ms:pct(.50),p95_ms:pct(.95),p99_ms:pct(.99),model:"apex-bootstrap-1.0",model_hash_sha256:modelHash,manifest_hash_sha256:manifestHash,deterministic:true,generated_at:new Date().toISOString(),total_runtime_ms:Number((Number(process.hrtime.bigint()-started)/1e6).toFixed(6))};
fs.writeFileSync(args[oi+1]+".summary.json",JSON.stringify(summary,null,2)+"\n");
