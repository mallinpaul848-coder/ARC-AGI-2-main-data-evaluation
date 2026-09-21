const http=require("http");
const crypto=require("crypto");
const PORT=process.env.PORT||8080, VERSION="1.0.0", started=Date.now();
function json(res,status,obj){res.statusCode=status;res.setHeader("Content-Type","application/json");res.end(JSON.stringify(obj));}
function answer(prompt){
 const p=String(prompt||"").trim(), m=p.replace(/,/g,"").match(/^(\d+(?:\.\d+)?)\s*([+*/-])\s*(\d+(?:\.\d+)?)$/);
 if(m){const a=+m[1],b=+m[3];return String(m[2]=="+"?a+b:m[2]=="-"?a-b:m[2]=="*"?a*b:a/b)}
 if(/^ping$/i.test(p))return "pong";
 return "APEX inference core: request received. Attach a trained model artifact for general-language generation.";
}
const server=http.createServer((req,res)=>{let body="";req.on("data",c=>body+=c);req.on("end",()=>{
 if(req.url==="/health")return json(res,200,{status:"ok",service:"APEX",version:VERSION,uptime_ms:Date.now()-started});
 if(req.url==="/v1/models")return json(res,200,{object:"list",data:[{id:"apex-core-1.0",object:"model",owned_by:"APEX"}]});
 if(req.url==="/v1/verify")return json(res,200,{service:"APEX",version:VERSION,deterministic:true,tests:[["17*19","323"],["144/12","12"],["12*12","144"],["81/9","9"],["2+2","4"],["7+5","12"]].map(([q,e])=>({input:q,expected:e,output:answer(q),pass:answer(q)===e}))});
 if(req.url==="/v1/chat/completions"&&req.method==="POST"){let x={};try{x=JSON.parse(body||"{}")}catch{};const ms=Array.isArray(x.messages)?x.messages:[],p=ms.length?ms[ms.length-1].content:"",content=answer(p);return json(res,200,{id:"apex-"+crypto.randomUUID(),object:"chat.completion",model:x.model||"apex-core-1.0",choices:[{index:0,message:{role:"assistant",content},finish_reason:"stop"}],usage:{prompt_tokens:0,completion_tokens:content.length,total_tokens:content.length}})}
 return json(res,404,{error:{message:"Not found"}});
})});server.listen(PORT,()=>console.log("APEX listening on "+PORT));
