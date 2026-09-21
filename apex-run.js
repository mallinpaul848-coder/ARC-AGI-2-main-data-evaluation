#!/usr/bin/env node
"use strict";
const fs=require("fs"),path=require("path"),crypto=require("crypto");

const args=process.argv.slice(2);
const mi=args.indexOf("--manifest"),oi=args.indexOf("--output");
if(mi<0||oi<0||!args[mi+1]||!args[oi+1]) throw new Error("usage: apex-run --manifest <manifest> --output <output.jsonl>");

const manifestPath=path.resolve(args[mi+1]);
const outputPath=path.resolve(args[oi+1]);
const modelPath=process.env.APEX_MODEL||path.join(__dirname,"models","apex-bootstrap.apex.json");
const manifest=JSON.parse(fs.readFileSync(manifestPath,"utf8"));
const model=JSON.parse(fs.readFileSync(modelPath,"utf8"));

function validateModel(m){
 if(m.format!=="APEXMODEL1")throw new Error("INVALID_APEX_MODEL_FORMAT");
 if(!m.vocab||!Array.isArray(m.weights)||!Array.isArray(m.id_to_token)||!Number.isInteger(m.context)||m.context<1)throw new Error("INVALID_APEX_MODEL_SCHEMA");
 if(m.weights.length!==m.id_to_token.length)throw new Error("INVALID_APEX_MODEL_DIMENSIONS");
 for(const row of m.weights)if(!Array.isArray(row)||row.length!==m.id_to_token.length||row.some(x=>!Number.isFinite(x)))throw new Error("INVALID_APEX_MODEL_WEIGHTS");
}
validateModel(model);

const modelBytes=fs.readFileSync(modelPath);
const modelHash=crypto.createHash("sha256").update(modelBytes).digest("hex");
const manifestBytes=fs.readFileSync(manifestPath);
const manifestHash=crypto.createHash("sha256").update(manifestBytes).digest("hex");
const modelId=String(model.model_id||model.name||path.basename(modelPath));
const maxTokens=Math.max(1,Math.min(Number(process.env.APEX_MAX_TOKENS)||128,256));

function generate(prompt){
 const p=String(prompt??"");
 const v=model.vocab,ids=[...p].map(c=>v[c]).filter(Number.isInteger).slice(-model.context),out=[];
 for(let k=0;k<maxTokens;k++){
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

const tests=Array.isArray(manifest.tests)?manifest.tests:Array.isArray(manifest.cases)?manifest.cases:[];
const started=process.hrtime.bigint();
const lines=tests.map(t=>{
 const start=process.hrtime.bigint();let output=null,error=null,correct=false;
 try{
  if(!t||typeof t!=="object"||!("input" in t)||!("expected" in t))throw new Error("INVALID_TEST_CASE");
  output=generate(t.input);correct=output===String(t.expected);
 }catch(e){error=String(e.message||e)}
 const latency=Number(process.hrtime.bigint()-start)/1e6;
 const inputHash=crypto.createHash("sha256").update(JSON.stringify(t?.input)).digest("hex");
 return {test_id:String(t?.test_id??t?.id??inputHash.slice(0,12)),input_hash:inputHash,output,expected:String(t?.expected??""),correct,error,timeout:false,latency_ms:Number(latency.toFixed(6)),model:modelId,model_hash_sha256:modelHash,manifest_hash_sha256:manifestHash,runtime:"apex-run-node",hardware:process.arch,sampling:{deterministic:true},source:"APEX_MODEL_ONLY"};
});
fs.writeFileSync(outputPath,lines.map(x=>JSON.stringify(x)).join("\n")+(lines.length?"\n":""));
const correct=lines.filter(x=>x.correct).length;
const errors=lines.filter(x=>x.error!==null).length;
const timeouts=lines.filter(x=>x.timeout===true).length;
const lats=lines.map(x=>x.latency_ms).sort((a,b)=>a-b);
const pct=q=>lats.length?lats[Math.min(lats.length-1,Math.ceil(q*lats.length)-1)]:null;
const summary={schema:"APEX-VERIFICATION-1",source:"APEX_MODEL_ONLY",tests:lines.length,correct,errors,timeouts,accuracy:lines.length?correct/lines.length:null,p50_ms:pct(.50),p95_ms:pct(.95),p99_ms:pct(.99),model:modelId,model_hash_sha256:modelHash,manifest_hash_sha256:manifestHash,deterministic:true,generated_at:new Date().toISOString(),total_runtime_ms:Number((Number(process.hrtime.bigint()-started)/1e6).toFixed(6))};
fs.writeFileSync(outputPath+".summary.json",JSON.stringify(summary,null,2)+"\n");
console.log(JSON.stringify(summary,null,2));
