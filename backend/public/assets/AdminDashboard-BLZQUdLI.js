import{r as l,j as e,m as y,c as L}from"./index-z4tH0fPJ.js";/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=(...a)=>a.filter((s,c,o)=>!!s&&s.trim()!==""&&o.indexOf(s)===c).join(" ").trim();/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W=a=>a.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=a=>a.replace(/^([A-Z])|[\s-_]+(\w)/g,(s,c,o)=>o?o.toUpperCase():c.toLowerCase());/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=a=>{const s=$(a);return s.charAt(0).toUpperCase()+s.slice(1)};/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var v={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=a=>{for(const s in a)if(s.startsWith("aria-")||s==="role"||s==="title")return!0;return!1},M=l.createContext({}),R=()=>l.useContext(M),T=l.forwardRef(({color:a,size:s,strokeWidth:c,absoluteStrokeWidth:o,className:d="",children:i,iconNode:p,...u},g)=>{const{size:x=24,strokeWidth:b=2,absoluteStrokeWidth:f=!1,color:j="currentColor",className:w=""}=R()??{},N=o??f?Number(c??b)*24/Number(s??x):c??b;return l.createElement("svg",{ref:g,...v,width:s??x??v.width,height:s??x??v.height,stroke:a??j,strokeWidth:N,className:A("lucide",w,d),...!i&&!E(u)&&{"aria-hidden":"true"},...u},[...p.map(([t,r])=>l.createElement(t,r)),...Array.isArray(i)?i:[i]])});/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=(a,s)=>{const c=l.forwardRef(({className:o,...d},i)=>l.createElement(T,{ref:i,iconNode:s,className:A(`lucide-${W(S(a))}`,`lucide-${a}`,o),...d}));return c.displayName=S(a),c};/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=[["path",{d:"m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",key:"1yiouv"}],["circle",{cx:"12",cy:"8",r:"6",key:"1vp47v"}]],C=h("award",D);/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]],P=h("download",B);/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]],I=h("refresh-cw",z);/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]],U=h("search",F);/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],q=h("triangle-alert",V);/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],O=h("users",H);function K(){const[a,s]=l.useState([]),[c,o]=l.useState(!0),[d,i]=l.useState(""),[p,u]=l.useState("All"),g=async()=>{o(!0);try{const t=await L.get("/api/results");s(t.data)}catch(t){console.error("Error fetching results:",t)}finally{o(!1)}};l.useEffect(()=>{g()},[]);const x=a.filter(t=>{const r=t.name.toLowerCase().includes(d.toLowerCase())||t.email.toLowerCase().includes(d.toLowerCase()),k=p==="All"||t.branch===p;return r&&k}),b=["All",...new Set(a.map(t=>t.branch))],f=()=>{const t=["Name","Email","Pin","Branch","Stage 1","Stage 2","Coding","Total","Warnings","Status","Timestamp"],r=x.map(n=>[n.name,n.email,n.pin,n.branch,n.stage1Score,n.stage2Score,n.codingScore,n.totalScore,n.proctorWarnings,n.passed?"PASSED":"FAILED",n.timestamp]),k="data:text/csv;charset=utf-8,"+t.join(",")+`
`+r.map(n=>n.join(",")).join(`
`),_=encodeURI(k),m=document.createElement("a");m.setAttribute("href",_),m.setAttribute("download",`exam_results_${new Date().toISOString().split("T")[0]}.csv`),document.body.appendChild(m),m.click(),document.body.removeChild(m)},j=a.length>0?(a.reduce((t,r)=>t+r.totalScore,0)/a.length).toFixed(1):0,w=a.length>0?(a.filter(t=>t.passed).length/a.length*100).toFixed(1):0,N=a.reduce((t,r)=>t+r.proctorWarnings,0);return e.jsx("div",{className:"min-h-screen bg-[#050505] text-slate-200 p-8 font-sans",children:e.jsxs("div",{className:"max-w-7xl mx-auto",children:[e.jsxs("div",{className:"flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12",children:[e.jsxs("div",{children:[e.jsxs("h1",{className:"text-4xl font-black text-white tracking-tight uppercase flex items-center gap-3",children:[e.jsx("span",{className:"p-2 rounded-xl bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)] text-black",children:e.jsx(C,{size:32})}),"Exam Results Console"]}),e.jsx("p",{className:"text-slate-500 mt-2 font-medium tracking-wide",children:"TechWing Assessment Data Management"})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("button",{onClick:g,className:"p-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors text-slate-400",title:"Refresh Data",children:e.jsx(I,{size:20,className:c?"animate-spin":""})}),e.jsxs("button",{onClick:f,className:"flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-orange-500 transition-all uppercase text-sm tracking-widest shadow-lg",children:[e.jsx(P,{size:18})," Export CSV"]})]})]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-4 gap-6 mb-10",children:[{label:"Total Candidates",value:a.length,icon:e.jsx(O,{className:"text-blue-400"}),color:"blue"},{label:"Average Score",value:`${j}`,icon:e.jsx(C,{className:"text-orange-400"}),color:"orange"},{label:"Pass Rate",value:`${w}%`,icon:e.jsx("div",{className:"w-2 h-2 rounded-full bg-green-500"}),color:"green"},{label:"Total Violations",value:N,icon:e.jsx(q,{className:"text-red-400"}),color:"red"}].map((t,r)=>e.jsxs(y.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:r*.1},className:"bg-[#0c0c0c] border border-slate-900 p-6 rounded-2xl relative overflow-hidden group",children:[e.jsx("div",{className:"absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none"}),e.jsxs("div",{className:"flex items-center gap-4 mb-3",children:[e.jsx("span",{className:"p-2 rounded-lg bg-white/5",children:t.icon}),e.jsx("span",{className:"text-slate-500 text-sm font-bold uppercase tracking-wider",children:t.label})]}),e.jsx("div",{className:"text-3xl font-black text-white",children:t.value})]},t.label))}),e.jsxs("div",{className:"bg-[#0c0c0c] border border-slate-900 p-4 rounded-2xl mb-6 flex flex-col md:flex-row gap-4 items-center",children:[e.jsxs("div",{className:"relative flex-1 w-full",children:[e.jsx(U,{className:"absolute left-4 top-1/2 -translate-y-1/2 text-slate-500",size:18}),e.jsx("input",{type:"text",placeholder:"Search by name or email...",value:d,onChange:t=>i(t.target.value),className:"w-full bg-[#111] border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500 transition-colors"})]}),e.jsx("select",{value:p,onChange:t=>u(t.target.value),className:"bg-[#111] border border-slate-800 rounded-xl py-3 px-6 text-white focus:outline-none focus:border-orange-500 transition-colors min-w-[150px]",children:b.map(t=>e.jsx("option",{value:t,children:t},t))})]}),e.jsx("div",{className:"bg-[#0c0c0c] border border-slate-900 rounded-2xl overflow-hidden",children:e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"w-full text-left",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b border-slate-900 bg-[#111]",children:[e.jsx("th",{className:"p-5 text-xs font-black uppercase tracking-widest text-slate-500",children:"Student Info"}),e.jsx("th",{className:"p-5 text-xs font-black uppercase tracking-widest text-slate-500 text-center",children:"Branch/Pin"}),e.jsx("th",{className:"p-5 text-xs font-black uppercase tracking-widest text-slate-500 text-center",children:"S1 (Apt)"}),e.jsx("th",{className:"p-5 text-xs font-black uppercase tracking-widest text-slate-500 text-center",children:"S2 (Tech)"}),e.jsx("th",{className:"p-5 text-xs font-black uppercase tracking-widest text-slate-500 text-center",children:"S3 (Code)"}),e.jsx("th",{className:"p-5 text-xs font-black uppercase tracking-widest text-slate-500 text-center",children:"Total"}),e.jsx("th",{className:"p-5 text-xs font-black uppercase tracking-widest text-slate-500 text-center",children:"Proctor"}),e.jsx("th",{className:"p-5 text-xs font-black uppercase tracking-widest text-slate-500 text-center",children:"Status"})]})}),e.jsx("tbody",{children:c?e.jsx("tr",{children:e.jsxs("td",{colSpan:"8",className:"p-20 text-center",children:[e.jsx("div",{className:"animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500 mx-auto mb-4"}),e.jsx("p",{className:"text-slate-500 font-bold uppercase tracking-widest text-xs",children:"Loading Secure Data..."})]})}):x.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:"8",className:"p-20 text-center text-slate-500 font-bold uppercase tracking-widest text-sm",children:"No results found matching your criteria"})}):x.map((t,r)=>e.jsxs(y.tr,{initial:{opacity:0},animate:{opacity:1},transition:{delay:r*.05},className:"border-b border-slate-900 hover:bg-[#111]/50 transition-colors",children:[e.jsxs("td",{className:"p-5",children:[e.jsx("div",{className:"font-bold text-white mb-0.5",children:t.name}),e.jsx("div",{className:"text-xs text-slate-500 font-medium",children:t.email})]}),e.jsxs("td",{className:"p-5 text-center",children:[e.jsx("div",{className:"text-xs font-black px-2 py-1 bg-white/5 rounded-md inline-block uppercase text-orange-400",children:t.branch}),e.jsx("div",{className:"text-[10px] text-slate-600 mt-1 font-bold",children:t.pin})]}),e.jsx("td",{className:"p-5 text-center font-bold",children:t.stage1Score}),e.jsx("td",{className:"p-5 text-center font-bold",children:t.stage2Score}),e.jsx("td",{className:"p-5 text-center font-bold text-orange-500",children:t.codingScore}),e.jsx("td",{className:"p-5 text-center",children:e.jsx("div",{className:"text-xl font-black text-white",children:t.totalScore})}),e.jsx("td",{className:"p-5 text-center",children:e.jsxs("div",{className:`text-xs p-1 rounded-md font-bold uppercase ${t.proctorWarnings>0?"bg-red-500/10 text-red-500":"bg-green-500/10 text-green-500"}`,children:[t.proctorWarnings," Warns"]})}),e.jsx("td",{className:"p-5 text-center",children:e.jsx("div",{className:`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase inline-block ${t.passed?"bg-green-500/10 text-green-500 border border-green-500/20":"bg-red-500/10 text-red-500 border border-red-500/20"}`,children:t.passed?"Certified":"Failed"})})]},t.id||r))})]})})})]})})}export{K as default};
