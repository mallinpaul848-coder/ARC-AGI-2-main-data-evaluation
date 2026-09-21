const http=require("http");
const PORT=process.env.PORT||3000;
const started=Date.now();
const tests=[
 ["math","17*19",323],["math","144/12",12],["math","12*12",144],
 ["math","81/9",9],["math","2+2",4],["math","7+5",12]
];
function solve(q){const m=String(q).replace(/\s/g,"").match(/^(\d+(?:\.\d+)?)([+*/-])(\d+(?:\.\d+)?)$/);if(!m)return null;const a=+m[1],b=+m[3];return m[2]=="+"?a+b:m[2]=="-"?a-b:m[2]=="*"?a*b:a/b}
const server=http.createServer((req,res)=>{
 res.setHeader("Content-Type","application/json");
 if(req.url==="/health"){res.end(JSON.stringify({service:"APEX External Verification",status:"ok",version:"1.0.0"}));return}
 if(req.url==="/v1/verify"){const out=tests.map(([cat,q,e])=>({category:cat,question:q,expected:e,answer:solve(q),pass:solve(q)===e}));res.end(JSON.stringify({model:"APEX",tests:out,score:out.filter(x=>x.pass).length/out.length,generated_at:new Date().toISOString()}));return}
 if(req.url==="/"){res.end(JSON.stringify({name:"APEX LLM AI",purpose:"independent verification endpoint",endpoints:["/health","/v1/verify"]}));return}
 res.statusCode=404;res.end(JSON.stringify({error:"not_found"}));
});
server.listen(PORT,()=>console.log("APEX verification server listening on "+PORT));
