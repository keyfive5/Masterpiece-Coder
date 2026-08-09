import{_ as p}from"./monaco-D7SiFys1.js";let l=null,c=null,i=null;class u extends Error{}function m(){return typeof navigator<"u"&&"gpu"in navigator}async function h(t,a){if(l&&c===t)return l;if(i)return i;if(!m())throw new u("This machine does not expose WebGPU, which the on-device model needs. Use the Free provider, or Built in, instead.");return i=(async()=>{a?.("Loading the local model…");const{CreateMLCEngine:o}=await p(async()=>{const{CreateMLCEngine:s}=await import("./index-D5Gthswc.js");return{CreateMLCEngine:s}},[],import.meta.url);let e=-1;const n=await o(t,{initProgressCallback:s=>{const r=Math.round((s.progress??0)*100);(r>=e+5||r===100)&&(e=r,a?.(r>=100?"Starting the local model…":`Downloading the model — ${r}%`))}});return l=n,c=t,i=null,n})().catch(o=>{throw i=null,new u(`The local model could not start: ${o.message}. It needs WebGPU and a few gigabytes of free space.`)}),i}function d(t){return`
# How to act
You cannot write files directly. To do anything, reply with ONE fenced json block and nothing else:

\`\`\`json
{"tool": "write_file", "input": {"path": "index.html", "content": "<!doctype html>..."}}
\`\`\`

Rules:
- Exactly one json block per reply. No prose before or after it.
- Put the file's FULL contents in "content", properly JSON-escaped.
- When the whole task is finished, reply with plain text instead of a json block, describing what you built.

Available tools:
${t.map(o=>`- ${o.name}: ${o.description}
  input: ${JSON.stringify(o.parameters.properties??{})}`).join(`
`)}
`}function f(t){const a=t.match(/```(?:json)?\s*([\s\S]*?)```/i),o=a?a[1]:t.trim().startsWith("{")?t.trim():null;if(!o)return null;try{const e=JSON.parse(o.trim()),n=e?.tool??e?.name??e?.function;return typeof n!="string"?null:{id:`local_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,name:n,input:e.input??e.arguments??e.parameters??{}}}catch{return null}}function g(t,a,o){const e=[{role:"system",content:t+d(o)}];for(const n of a)if(n.role==="user")e.push({role:"user",content:n.content});else if(n.role==="assistant"){const s=n.toolCalls?.[0];e.push({role:"assistant",content:s?`\`\`\`json
${JSON.stringify({tool:s.name,input:s.input})}
\`\`\``:n.content})}else e.push({role:"user",content:n.results.map(s=>`Result of ${s.name}: ${s.content}`).join(`

`).slice(0,8e3)});return e}async function w(t,a){const o=await h(t.model,a.onActivity);a.onActivity?.("Thinking on your machine");const e=await o.chat.completions.create({messages:g(t.system,t.messages,t.tools),max_tokens:Math.min(t.maxTokens,4096),temperature:.4,stream:!1}),n=e?.choices?.[0]?.message?.content??"",s=f(n);return s?{text:"",thinking:"",toolCalls:[s],native:null,usage:{input:e?.usage?.prompt_tokens??0,output:e?.usage?.completion_tokens??0,cacheRead:0,cacheWrite:0},stopReason:"tool_use"}:(n&&a.onText(n),{text:n,thinking:"",toolCalls:[],native:null,usage:{input:e?.usage?.prompt_tokens??0,output:e?.usage?.completion_tokens??0,cacheRead:0,cacheWrite:0},stopReason:"end_turn"})}export{u as LocalModelError,h as ensureEngine,w as runLocal,m as webGpuAvailable};
